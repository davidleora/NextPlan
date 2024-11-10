import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../styles/common.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // ログイン成功
        } catch (error) {
            console.error("ログインエラー:", error);
            setErrorMessage(
                "ログインに失敗しました。メールアドレスとパスワードを確認してください。"
            );
        }
    };

    return (
        <div className="form-container">
            <h2 className="heading">ログイン</h2>
            <form onSubmit={handleLogin}>
                {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                )}
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
                    ログイン
                </button>
            </form>
        </div>
    );
};

export default Login;
