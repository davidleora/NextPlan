import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const TaskPopupWindow = ({ isOpen, onClose, task }) => {
    if (!isOpen) return null;

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [startTime, setStartTime] = useState(task.startTime);
    const [endTime, setEndTime] = useState(task.endTime);
    const [description, setDescription] = useState(task.description);

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "tasks", task.id));
            onClose();
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    const handleUpdate = async () => {
        try {
            await updateDoc(doc(db, "tasks", task.id), {
                title,
                startTime,
                endTime,
                description,
            });
            setIsEditing(false);
            onClose();
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

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
                onClick={(e) => e.stopPropagation()}
            >
                {/* タイトル */}
                <div style={{ marginBottom: "10px" }}>
                    <label>
                        タイトル：
                        {isEditing ? (
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
                        ) : (
                            <p>{title}</p>
                        )}
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
                            {isEditing ? (
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "5px",
                                        marginTop: "5px",
                                    }}
                                />
                            ) : (
                                <p>{startTime}</p>
                            )}
                        </label>
                    </div>
                    <div style={{ width: "48%" }}>
                        <label>
                            End：
                            {isEditing ? (
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
                            ) : (
                                <p>{endTime}</p>
                            )}
                        </label>
                    </div>
                </div>

                {/* 説明 */}
                <div style={{ marginBottom: "10px" }}>
                    <label>
                        説明：
                        {isEditing ? (
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
                        ) : (
                            <p>{description}</p>
                        )}
                    </label>
                </div>

                {/* ボタン */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "20px",
                        right: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <button
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                        onClick={handleDelete}
                    >
                        削除
                    </button>
                    {isEditing ? (
                        <button
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "green",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                            onClick={handleUpdate}
                        >
                            保存
                        </button>
                    ) : (
                        <button
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "dodgerblue",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                            onClick={() => setIsEditing(true)}
                        >
                            編集
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskPopupWindow;
