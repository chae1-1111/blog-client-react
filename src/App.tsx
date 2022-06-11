import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Header from "./components/header";
import Join from "./components/member/join";
import Login from "./components/member/login";
import IdInquiry from "./components/member/idInquiry";
import PwInquiry from "./components/member/pwInquiry";
import ResetPw from "./components/member/resetPw";
import Mypage from "./components/member/mypage";

function App() {
    const [isLogin, setIsLogin] = React.useState(false);

    useEffect(() => {
        setIsLogin(sessionStorage.getItem("UserKey") ? true : false);
    }, []);

    return (
        <BrowserRouter>
            <div className="App">
                <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                <div className="content-wrap">
                    <div className="content">
                        <Routes>
                            <Route
                                path="/login"
                                element={
                                    <Login
                                        isLogin={isLogin}
                                        setIsLogin={setIsLogin}
                                    />
                                }
                            />
                            <Route
                                path="/join"
                                element={<Join isLogin={isLogin} />}
                            />
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
                            <Route
                                path="/mypage/*"
                                element={<Mypage isLogin={isLogin} />}
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
