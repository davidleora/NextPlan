import React from "react";
import FloatingButton from "./components/FloatingButton";

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
    const hours = Array.from(
        { length: 24 },
        (_, i) => `${i.toString().padStart(2, "0")}:00`
    );

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
            {/* Header displaying today's date */}
            <header style={{ marginBottom: "20px", textAlign: "center" }}>
                <h1>Plan for {getTodayDate()}</h1>
            </header>

            {/* Timeline */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                {hours.map((hour, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {/* Hour label */}
                        <span
                            style={{
                                width: "60px", // Ensure consistent space for hour digits
                                textAlign: "right",
                                marginRight: "10px",
                                fontWeight: "bold",
                            }}
                        >
                            {hour}
                        </span>
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

            {/* Floating button */}
            <FloatingButton
                onClick={() => console.log("Floating button clicked!")}
            />
        </div>
    );
};

export default App;
