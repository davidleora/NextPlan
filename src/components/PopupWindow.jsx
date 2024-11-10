import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

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

    console.log("Current User: ", currentUser);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "400px",
                    position: "relative",
                }}
                onClick={(e) => e.stopPropagation()} // 背景クリックで閉じるが、ポップアップ内のクリックは無視
            >
                {/* 明日の日付 */}
                <h2 style={{ marginTop: 0, textAlign: "center" }}>
                    {tomorrowDate}
                </h2>

                {/* タイトル */}
                <div style={{ marginBottom: "10px" }}>
                    <label>
                        タイトル：
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "5px",
                                marginTop: "5px",
                            }}
                        />
                    </label>
                </div>

                {/* Start と End */}
                <div
                    style={{
                        marginBottom: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ width: "48%" }}>
                        <label>
                            Start：
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "5px",
                                    marginTop: "5px",
                                }}
                            />
                        </label>
                    </div>
                    <div style={{ width: "48%" }}>
                        <label>
                            End：
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "5px",
                                    marginTop: "5px",
                                }}
                            />
                        </label>
                    </div>
                </div>

                {/* 説明 */}
                <div style={{ marginBottom: "10px" }}>
                    <label>
                        説明：
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "5px",
                                marginTop: "5px",
                            }}
                            rows="3"
                        ></textarea>
                    </label>
                </div>

                {/* 登録ボタン */}
                <button
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        padding: "10px 20px",
                        backgroundColor: "dodgerblue",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                    onClick={handleRegister} // 現時点では閉じる動作のみ
                >
                    登録
                </button>
            </div>
        </div>
    );
};

export default PopupWindow;
