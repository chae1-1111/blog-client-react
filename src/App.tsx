import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Header from "./components/header";
import Join from "./components/member/join";
import Login from "./components/member/login";

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
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
