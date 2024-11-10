import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import "../styles/common.css";
import "./PopupWindow.css";

const PopupWindow = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const { currentUser } = useAuth();
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [description, setDescription] = useState("");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toLocaleDateString("ja-JP", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleRegister = async () => {
        try {
            await addDoc(collection(db, "tasks"), {
                title,
                startTime,
                endTime,
                description,
                date: tomorrow.toISOString().split("T")[0],
                userId: currentUser.uid,
            });
            setTitle("");
            setStartTime("");
            setEndTime("");
            setDescription("");
            onClose();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-window" onClick={(e) => e.stopPropagation()}>
                {/* 明日の日付 */}
                <h2>{tomorrowDate}</h2>

                {/* タイトル */}
                <label>
                    タイトル：
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>

                {/* Start と End */}
                <div className="time-inputs">
                    <div>
                        <label>
                            Start：
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            End：
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </label>
                    </div>
                </div>

                {/* 説明 */}
                <label>
                    説明：
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                    ></textarea>
                </label>

                {/* 登録ボタン */}
                <div className="button-container">
                    <button className="button" onClick={handleRegister}>
                        登録
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupWindow;
