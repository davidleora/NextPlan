const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Firebaseの初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());

// LINEのWebhookエンドポイント
app.post("/webhook", (req, res) => {
  const events = req.body.events;

  events.forEach(async (event) => {
    if (event.type === "message" && event.message.type === "text") {
      const todoText = event.message.text;

      // FirestoreにTodoとして保存
      await db.collection("todos").add({ text: todoText, completed: false });

      console.log(`Added todo: ${todoText}`);
    }
  });

  res.sendStatus(200);
});

// サーバーの起動
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
