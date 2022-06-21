import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Buffer } from "buffer";

import "./App.scss";
import Header from "./components/header";
import Join from "./components/member/join";
import Login from "./components/member/login";
import IdInquiry from "./components/member/idInquiry";
import PwInquiry from "./components/member/pwInquiry";
import ResetPw from "./components/member/resetPw";
import Mypage from "./components/member/mypage";

import Blog from "./components/blog/blog";
import Test from "./components/test";
import axios from "axios";

import config from "./config/config.json";

function App() {
    const [isLogin, setIsLogin] = React.useState(
        sessionStorage.getItem("UserKey") ? true : false
    );

    const [profileImage, setProfileImage] = React.useState("");

    const getProfileImage = async () => {
        let result = await axios.get(
            `${
                config.baseurl
            }/member/getProfileImage?userid=${sessionStorage.getItem(
                "UserId"
            )}`,
            { headers: { Authorization: config.apikey } }
        );

        setProfileImage(new Buffer(result.data.image.data).toString("base64"));
    };

    return (
        <BrowserRouter>
            <div className="App">
                <Header
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                    profileImage={profileImage}
                    getProfileImage={getProfileImage}
                />
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
                                path="/resetPw/:token"
                                element={<ResetPw isLogin={isLogin} />}
                            />
                            <Route
                                path="/mypage/:page"
                                element={
                                    <Mypage
                                        isLogin={isLogin}
                                        setIsLogin={setIsLogin}
                                        profileImage={profileImage}
                                        getProfileImage={getProfileImage}
                                    />
                                }
                            />
                            <Route path="/blog/:userid" element={<Blog />} />
                            <Route
                                path="/blog/:userid/:postkey"
                                element={<Blog />}
                            />
                            <Route path="/test" element={<Test />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
