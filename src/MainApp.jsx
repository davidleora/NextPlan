import React, { useState, useEffect } from "react";
import FloatingButton from "./components/FloatingButton";
import PopupWindow from "./components/PopupWindow";
import TaskBubble from "./components/TaskBubble";
import TaskPopupWindow from "./components/TaskPopupWindow";
import { db } from "./firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "./contexts/AuthContext";
import "./index.css";

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString("ja-JP", {
    weekday: "short",
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

const MainApp = ({ onLogout }) => {
  const { currentUser } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskPopupOpen, setIsTaskPopupOpen] = useState(false);

  const fetchTasks = async () => {
    const tomorrowStr = getTomorrowISOString();

    // tasks コレクションのクエリ
    const tasksQuery = query(
      collection(db, "tasks"),
      where("date", "==", tomorrowStr),
      where("userId", "==", currentUser.uid)
    );
    const tasksSnapshot = await getDocs(tasksQuery);
    const tasksData = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // todos コレクションのクエリ
    const todosQuery = query(
      collection(db, "todos"),
      where("date", "==", tomorrowStr),
      where("userId", "==", currentUser.uid)
    );
    const todosSnapshot = await getDocs(todosQuery);
    const todosData = todosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // 必要に応じてフィールドを統一
      startTime: doc.data().startTime || "未設定",
      endTime: doc.data().endTime || "未設定",
      description: doc.data().description || "",
    }));

    // 両方のコレクションのデータを結合
    setTasks([...tasksData, ...todosData]);
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
          <button className="dashboard-button">設定</button>
        </div>
        <div className="timeline-container">
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
              <TaskBubble
                key={task.id}
                task={task}
                onClick={() => {
                  setSelectedTask(task);
                  setIsTaskPopupOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Popup window */}
      <PopupWindow isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      {selectedTask && (
        <TaskPopupWindow
          isOpen={isTaskPopupOpen}
          onClose={() => setIsTaskPopupOpen(false)}
          task={selectedTask}
        />
      )}

      {/* Floating button */}
      <FloatingButton onClick={() => setIsPopupOpen(true)} />
    </>
  );
};

export default MainApp;
