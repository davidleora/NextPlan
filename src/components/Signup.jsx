import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "../styles/common.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // サインアップ成功
    } catch (error) {
      console.error("サインアップエラー:", error);
      setErrorMessage(
        "サインアップに失敗しました。入力内容を確認してください。"
      );
    }
  };

  return (
    <div className="form-container">
      <h2 className="heading">サインアップ</h2>
      <form onSubmit={handleSignup}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <label className="form-label">
          メールアドレス：
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          パスワード：
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="button">
          登録
        </button>
      </form>
    </div>
  );
};

export default Signup;
