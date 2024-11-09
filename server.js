require("dotenv").config(); // dotenvで環境変数を読み込む
const express = require("express");
const line = require("@line/bot-sdk");
const admin = require("firebase-admin");

// Firebaseの初期化
admin.initializeApp({
  credential: admin.credential.cert({
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    project_id: "nextplan-f4340",
  }),
});

const db = admin.firestore();

// LINE APIの設定を環境変数から取得
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
app.use(express.json());

// Webhookエンドポイントを設定
app.post("/webhook", line.middleware(config), async (req, res) => {
  const events = req.body.events;

  for (let event of events) {
    if (event.type === "message" && event.message.type === "text") {
      // Firebaseにメッセージ内容を保存
      await db
        .collection("todos")
        .add({ text: event.message.text, done: false });
    }
  }

  res.sendStatus(200); // LINEに正常終了を通知
});

// サーバーを起動
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
