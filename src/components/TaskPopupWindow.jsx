import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import "../styles/common.css";
import "./TaskPopupWindow.css";

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
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-window" onClick={(e) => e.stopPropagation()}>
                {/* タイトル */}
                <label>
                    タイトル：
                    {isEditing ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    ) : (
                        <p>{title}</p>
                    )}
                </label>

                {/* Start と End */}
                <div className="time-inputs">
                    <div>
                        <label>
                            Start：
                            {isEditing ? (
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                />
                            ) : (
                                <p>{startTime}</p>
                            )}
                        </label>
                    </div>
                    <div>
                        <label>
                            End：
                            {isEditing ? (
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            ) : (
                                <p>{endTime}</p>
                            )}
                        </label>
                    </div>
                </div>

                {/* 説明 */}
                <label>
                    説明：
                    {isEditing ? (
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        ></textarea>
                    ) : (
                        <p>{description}</p>
                    )}
                </label>

                {/* ボタン */}
                <div className="button-container">
                    <button
                        className="button delete-button"
                        onClick={handleDelete}
                    >
                        削除
                    </button>
                    {isEditing ? (
                        <button
                            className="button save-button"
                            onClick={handleUpdate}
                        >
                            保存
                        </button>
                    ) : (
                        <button
                            className="button edit-button"
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
