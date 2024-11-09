import React from "react";

const PopupWindow = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

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
                    Plan for {tomorrowDate}
                </h2>

                {/* タイトル */}
                <div style={{ marginBottom: "10px" }}>
                    <label>
                        タイトル：
                        <input
                            type="text"
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
                    onClick={onClose} // 現時点では閉じる動作のみ
                >
                    登録
                </button>
            </div>
        </div>
    );
};

export default PopupWindow;
