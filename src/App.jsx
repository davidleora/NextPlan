import React from "react";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MainApp from "./MainApp"; // MainAppを呼び出す
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";

const App = () => {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("ログアウト成功");
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  if (!currentUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          height: "100vh",
          gap: "20px",
        }}
      >
        <Login />
        <Signup />
      </div>
    );
  }

  return <MainApp onLogout={handleLogout} />;
};

export default App;
