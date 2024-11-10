require("dotenv").config(); // dotenvの読み込み
const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const axios = require("axios");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
const userState = {}; // ユーザーの状態を保持するオブジェクト
const LINE_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN; // 環境変数からアクセストークンを取得
// LINEのWebhookエンドポイント
app.post("/webhook", (req, res) => {
    const events = req.body.events;
    events.forEach(async (event) => {
        const userId = event.source.userId;
        if (event.type === "message" && event.message.type === "text") {
            const messageText = event.message.text;
            if (messageText === "todoを追加") {
                userState[userId] = "waiting_for_todo";
                await replyMessage(
                    event.replyToken,
                    "追加したいTodoを入力してください。\n形式: Todoテキスト/YYYY-MM-DD/HH:MM/HH:MM/説明テキスト"
                );
            } else if (userState[userId] === "waiting_for_todo") {
                // 空白を削除した上で正規表現チェック
                const trimmedMessage = messageText.replace(/\s+/g, "");
                const regex =
                    /^(.+)\/(\d{4}-\d{2}-\d{2})\/(\d{2}:\d{2})\/(\d{2}:\d{2})\/(.+)$/;
                const match = trimmedMessage.match(regex);
                if (match) {
                    const [_, todoText, date, startTime, endTime, description] =
                        match;
                    // Firestoreにtasksコレクションを使用し、userIdフィールドを追加して保存
                    await db.collection("tasks").add({
                        title: todoText,
                        date: date,
                        startTime: startTime,
                        endTime: endTime,
                        description: description,
                        userId: userId, // userIdフィールドを追加
                    });
                    console.log(
                        `Added task with details: ${todoText}, ${date}, ${startTime} - ${endTime}, ${description}, userId: ${userId}`
                    );
                    await replyMessage(
                        event.replyToken,
                        `Todoが追加されました: ${todoText}`
                    );
                    delete userState[userId];
                } else {
                    await replyMessage(
                        event.replyToken,
                        "形式が正しくありません。もう一度入力してください。\n形式: Todoテキスト/YYYY-MM-DD/HH:MM/HH:MM/説明テキスト"
                    );
                }
            }
        }
    });
    res.sendStatus(200);
});
// LINEメッセージを返信する関数
async function replyMessage(replyToken, message) {
    const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message/reply";
    await axios.post(
        LINE_MESSAGING_API,
        {
            replyToken: replyToken,
            messages: [{ type: "text", text: message }],
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
            },
        }
    );
}
// サーバーの起動
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
