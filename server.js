// server.js
require("dotenv").config();
const express = require("express");
const line = require("@line/bot-sdk");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// LINE Bot Configuration
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
app.post("/webhook", (req, res) => {
    res.status(200).send("Webhook is working");
});

const client = new line.Client(config);

async function handleEvent(event) {
    if (event.type !== "message" || event.message.type !== "text") {
        return Promise.resolve(null);
    }

    const userMessage = event.message.text.trim();
    const lineUserId = event.source.userId;

    // Check if LINE user is linked to a website user
    const linkDoc = await db.collection("lineUsers").doc(lineUserId).get();

    if (!linkDoc.exists) {
        // User is not linked
        if (userMessage.length === 36) {
            // Assume this is a link code
            const linkCodeSnapshot = await db
                .collection("linkCodes")
                .where("linkCode", "==", userMessage)
                .limit(1)
                .get();

            if (!linkCodeSnapshot.empty) {
                const linkCodeDoc = linkCodeSnapshot.docs[0];
                const websiteUserId = linkCodeDoc.data().userId;

                // Save the mapping
                await db.collection("lineUsers").doc(lineUserId).set({
                    websiteUserId: websiteUserId,
                    linkedAt: admin.firestore.FieldValue.serverTimestamp(),
                });

                // Optionally, update the user's document
                await db.collection("users").doc(websiteUserId).update({
                    lineUserId: lineUserId,
                });

                // Delete the link code
                await db.collection("linkCodes").doc(linkCodeDoc.id).delete();

                // Reply to the user
                await client.replyMessage(event.replyToken, {
                    type: "text",
                    text: "アカウントの連携が完了しました！",
                });

                return;
            }
        }

        // Prompt user to link accounts
        await client.replyMessage(event.replyToken, {
            type: "text",
            text: "アカウントが連携されていません。ウェブサイトで表示されたリンクコードを送信してください。",
        });

        return;
    }

    // User is linked
    const websiteUserId = linkDoc.data().websiteUserId;

    // Handle user messages
    if (userMessage.startsWith("タスク追加:")) {
        const taskContent = userMessage.replace("タスク追加:", "").trim();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateString = tomorrow.toISOString().split("T")[0];

        // Save task to Firestore
        await db.collection("tasks").add({
            title: taskContent,
            startTime: "00:00",
            endTime: "23:59",
            description: "",
            date: dateString,
            userId: websiteUserId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        await client.replyMessage(event.replyToken, {
            type: "text",
            text: "タスクを追加しました。",
        });
    } else if (userMessage === "タスク一覧") {
        // Fetch tasks
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateString = tomorrow.toISOString().split("T")[0];

        const tasksSnapshot = await db
            .collection("tasks")
            .where("userId", "==", websiteUserId)
            .where("date", "==", dateString)
            .orderBy("createdAt", "desc")
            .get();

        if (tasksSnapshot.empty) {
            await client.replyMessage(event.replyToken, {
                type: "text",
                text: "明日のタスクはありません。",
            });
        } else {
            const tasks = tasksSnapshot.docs
                .map((doc) => doc.data().title)
                .join("\n");

            await client.replyMessage(event.replyToken, {
                type: "text",
                text: `明日のタスク一覧:\n${tasks}`,
            });
        }
    } else {
        // Default response
        await client.replyMessage(event.replyToken, {
            type: "text",
            text: "利用可能なコマンド:\n- タスク追加: [タスク名]\n- タスク一覧",
        });
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
