import React from "react";
import "../styles/common.css";

const SettingsModal = ({ isOpen, onClose, onLinkLine }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-window" onClick={(e) => e.stopPropagation()}>
                <h2>設定</h2>
                <div className="button-container">
                    <button className="button" onClick={onLinkLine}>
                        LINEと連携する
                    </button>
                    <button className="button" onClick={onClose}>
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
