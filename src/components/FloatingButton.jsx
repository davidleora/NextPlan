import React from "react";

const FloatingButton = ({ onClick }) => {
    return (
        <button
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                width: "60px",
                height: "60px",
                fontSize: "3em",
                borderRadius: "15%",
                border: "none",
                backgroundColor: "dodgerblue",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            }}
            onClick={onClick}
        >
            +
        </button>
    );
};

export default FloatingButton;
