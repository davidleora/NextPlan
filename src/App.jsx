import React from "react";
import FloatingButton from "./components/FloatingButton";
import PopupWindow from "./components/PopupWindow";
import "./index.css";

const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const App = () => {
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);

    const hours = Array.from(
        { length: 24 },
        (_, i) => `${i.toString().padStart(2, "0")}:00`
    );

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
                    <h2 className="title">Plan for {getTodayDate()}</h2>
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
                </div>

                {/* Popup window */}
                <PopupWindow
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                />

                {/* Floating button */}
                <FloatingButton onClick={() => setIsPopupOpen(true)} />
            </div>
        </>
    );
};

export default App;
