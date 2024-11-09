import React, { useState, useEffect } from "react";
import FloatingButton from "./components/FloatingButton";
import PopupWindow from "./components/PopupWindow";
import { db } from "./firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./index.css";

const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString("ja-JP", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const getTomorrowISOString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
};

const App = () => {
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        const tomorrowStr = getTomorrowISOString();

        const q = query(
            collection(db, "tasks"),
            where("date", "==", tomorrowStr)
        );
        const querySnapshot = await getDocs(q);
        const tasksData = [];
        querySnapshot.forEach((doc) => {
            tasksData.push({ id: doc.id, ...doc.data() });
        });
        setTasks(tasksData);
    };

    const hours = Array.from(
        { length: 24 },
        (_, i) => `${i.toString().padStart(2, "0")}:00`
    );

    useEffect(() => {
        fetchTasks();
    }, [isPopupOpen]);

    return (
        <>
            <header className="header">
                <h1 className="header_title">NextPlan</h1>
                <div className="user-actions">
                    <p className="username">ユーザー名</p>
                    <button className="logout-button">ログアウト</button>
                </div>
            </header>
            <div className="container">
                {/* Header displaying today's date */}
                <div className="date">
                    <h2 className="title">明日の予定：{getTomorrowDate()}</h2>
                </div>

                {/* Timeline */}
                <div className="TimeLine">
                    {hours.map((hour, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {/* Hour label */}
                            <span className="hour">{hour}</span>
                            {/* Horizontal line */}
                            <div
                                style={{
                                    flex: 1, // Line takes up remaining horizontal space
                                    height: "1px",
                                    backgroundColor: "#ccc",
                                }}
                            ></div>
                        </div>
                    ))}

                    {/* Tasks */}
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="task-item"
                            style={{
                                position: "absolute",
                                left: "70px",
                                top: `${task.startTime.split(":")[0] * 40}px`, // Adjust based on start time
                            }}
                        >
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popup window */}
            <PopupWindow
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
            />

            {/* Floating button */}
            <FloatingButton onClick={() => setIsPopupOpen(true)} />
        </>
    );
};

export default App;
