import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const buttonColor = "#2864F1";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };

  return (
    <form onSubmit={handleLogin} style={styles.form}>
      <h2 style={styles.title}>ログイン</h2>
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={styles.input}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        ログイン
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    border: `2px solid ${buttonColor}`,
    borderRadius: "8px",
    width: "250px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#ffffff",
  },
  title: {
    color: buttonColor,
    marginBottom: "15px",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    width: "100%",
    borderRadius: "4px",
    backgroundColor: buttonColor,
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
  },
};

export default Login;
