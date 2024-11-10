import React, { useState, useEffect } from "react";
import FloatingButton from "./components/FloatingButton";
import PopupWindow from "./components/PopupWindow";
import TaskPopupWindow from "./components/TaskPopupWindow";
import SettingsModal from "./components/SettingsModal";
import { db } from "./firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "./contexts/AuthContext";
import "./index.css";

const getTodayISOString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
};

const getTomorrowISOString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
};

const MainApp = ({ onLogout }) => {
    const { currentUser } = useAuth();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [tasksToday, setTasksToday] = useState([]);
    const [tasksTomorrow, setTasksTomorrow] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTaskPopupOpen, setIsTaskPopupOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const fetchTasks = async () => {
        const todayStr = getTodayISOString();
        const tomorrowStr = getTomorrowISOString();

        const qToday = query(
            collection(db, "tasks"),
            where("date", "==", todayStr),
            where("userId", "==", currentUser.uid)
        );
        const querySnapshotToday = await getDocs(qToday);
        const tasksTodayData = [];
        querySnapshotToday.forEach((doc) => {
            tasksTodayData.push({ id: doc.id, ...doc.data() });
        });
        setTasksToday(tasksTodayData);

        const qTomorrow = query(
            collection(db, "tasks"),
            where("date", "==", tomorrowStr),
            where("userId", "==", currentUser.uid)
        );
        const querySnapshotTomorrow = await getDocs(qTomorrow);
        const tasksTomorrowData = [];
        querySnapshotTomorrow.forEach((doc) => {
            tasksTomorrowData.push({ id: doc.id, ...doc.data() });
        });
        setTasksTomorrow(tasksTomorrowData);
    };

    const hours = Array.from(
        { length: 24 },
        (_, i) => `${i.toString().padStart(2, "0")}:00`
    );

    useEffect(() => {
        fetchTasks();
    }, [isPopupOpen, isTaskPopupOpen]);

    return (
        <>
            <header className="header">
                <h1 className="header_title">NextPlan</h1>
                <div className="user-actions">
                    <p className="username">{currentUser.email}</p>
                    <button className="logout-button" onClick={onLogout}>
                        ログアウト
                    </button>
                </div>
            </header>
            <div className="container">
                <div className="dashboard">
                    <button className="dashboard-button">タスク</button>
                    <button
                        className="dashboard-button"
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        設定
                    </button>
                </div>

                {/* Timeline Section */}
                <div className="timeline-section">
                    {/* Today's Timeline */}
                    <div className="timeline">
                        <h2 className="title">今日の予定</h2>
                        <div className="timeline-content">
                            {hours.map((hour, index) => (
                                <div key={index} className="timeline-row">
                                    <span className="hour">{hour}</span>
                                    <div className="timeline-line"></div>
                                </div>
                            ))}
                            {tasksToday.map((task) => {
                                const [startHour, startMinute] = task.startTime
                                    .split(":")
                                    .map(Number);
                                const [endHour, endMinute] = task.endTime
                                    .split(":")
                                    .map(Number);
                                const startTotalMinutes =
                                    startHour * 60 + startMinute;
                                const endTotalMinutes =
                                    endHour * 60 + endMinute;
                                const durationMinutes =
                                    endTotalMinutes - startTotalMinutes;

                                const topPosition =
                                    (startTotalMinutes / 60) * 60; // 1時間あたり60pxとして計算
                                const taskHeight = (durationMinutes / 60) * 60;

                                return (
                                    <div
                                        key={task.id}
                                        className="task-item"
                                        style={{
                                            top: `${topPosition}px`,
                                            height: `${taskHeight}px`,
                                        }}
                                        onClick={() => {
                                            setSelectedTask(task);
                                            setIsTaskPopupOpen(true);
                                        }}
                                    >
                                        <strong>{task.title}</strong>
                                        <p>{task.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tomorrow's Timeline */}
                    <div className="timeline">
                        <h2 className="title">明日の予定</h2>
                        <div className="timeline-content">
                            {hours.map((hour, index) => (
                                <div key={index} className="timeline-row">
                                    <span className="hour">{hour}</span>
                                    <div className="timeline-line"></div>
                                </div>
                            ))}
                            {tasksTomorrow.map((task) => {
                                const [startHour, startMinute] = task.startTime
                                    .split(":")
                                    .map(Number);
                                const [endHour, endMinute] = task.endTime
                                    .split(":")
                                    .map(Number);
                                const startTotalMinutes =
                                    startHour * 60 + startMinute;
                                const endTotalMinutes =
                                    endHour * 60 + endMinute;
                                const durationMinutes =
                                    endTotalMinutes - startTotalMinutes;

                                const topPosition =
                                    (startTotalMinutes / 60) * 60; // 1時間あたり60pxとして計算
                                const taskHeight = (durationMinutes / 60) * 60;

                                return (
                                    <div
                                        key={task.id}
                                        className="task-item"
                                        style={{
                                            top: `${topPosition}px`,
                                            height: `${taskHeight}px`,
                                        }}
                                        onClick={() => {
                                            setSelectedTask(task);
                                            setIsTaskPopupOpen(true);
                                        }}
                                    >
                                        <strong>{task.title}</strong>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup window */}
            <PopupWindow
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
            />

            {selectedTask && (
                <TaskPopupWindow
                    isOpen={isTaskPopupOpen}
                    onClose={() => setIsTaskPopupOpen(false)}
                    task={selectedTask}
                />
            )}

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onLinkLine={() => console.log("Link LINE button clicked!")}
            />

            {/* Floating button */}
            <FloatingButton onClick={() => setIsPopupOpen(true)} />
        </>
    );
};

export default MainApp;
