import React from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import lineQr from "../assets/line-qr.png";
import "../styles/common.css";

const SettingsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const { currentUser } = useAuth();

    const handleLinkLine = async () => {
        const linkCode = uuidv4();

        await addDoc(collection(db, "linkCodes"), {
            linkCode: linkCode,
            userId: currentUser.uid,
            createdAt: serverTimestamp(),
        });

        alert(`以下のコードをLINEボットに送信してください：\n\n${linkCode}`);
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-window" onClick={(e) => e.stopPropagation()}>
                <h2>設定</h2>
                <p>
                    LINEボットと連携するには、以下のQRコードをスキャンしてください。
                </p>
                <img
                    src={lineQr}
                    alt="LINE Bot QR Code"
                    style={{
                        width: "200px",
                        height: "200px",
                        margin: "20px auto",
                        display: "block",
                    }}
                />
                <div className="button-container">
                    <button className="button" onClick={handleLinkLine}>
                        LINEと連携する
                    </button>
                    <button className="button" onClick={onClose}>
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
