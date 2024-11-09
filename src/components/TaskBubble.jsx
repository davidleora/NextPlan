import React from "react";

const TaskBubble = ({ task, onClick }) => {
    const startHour = parseInt(task.startTime.split(":")[0], 10);
    const endHour = parseInt(task.endTime.split(":")[0], 10);
    const duration = endHour - startHour;

    return (
        <div
            className="task-bubble"
            style={{
                position: "absolute",
                left: "120px",
                top: `${startHour * 50}px`,
                height: `${duration * 50}px`,
                width: "200px",
                backgroundColor: "rgba(173, 216, 230, 0.5)",
                borderRadius: "8px",
                padding: "3px",
                cursor: "pointer",
                overflow: "hidden",
                border: "2px solid blue",
            }}
            onClick={onClick}
        >
            <strong>{task.title}</strong>
        </div>
    );
};

export default TaskBubble;
