import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Header from "./components/header";
import Join from "./components/member/join";
import Login from "./components/member/login";
import IdInquiry from "./components/member/idInquiry";
import PwInquiry from "./components/member/pwInquiry";
import ResetPw from "./components/member/resetPw";

function App() {
    const [isLogin, setIsLogin] = React.useState(false);

    useEffect(() => {
        setIsLogin(sessionStorage.getItem("UserKey") ? true : false);
    }, []);

    return (
        <BrowserRouter>
            <div className="App">
                <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <Login isLogin={isLogin} setIsLogin={setIsLogin} />
                        }
                    />
                    <Route path="/join" element={<Join isLogin={isLogin} />} />
                    <Route
                        path="/idInquiry"
                        element={<IdInquiry isLogin={isLogin} />}
                    />
                    <Route
                        path="/pwInquiry"
                        element={<PwInquiry isLogin={isLogin} />}
                    />
                    <Route
                        path="/resetPw"
                        element={<ResetPw isLogin={isLogin} />}
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
