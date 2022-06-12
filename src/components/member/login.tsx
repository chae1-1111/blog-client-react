import axios from "axios";
import { useEffect } from "react";

import config from "../../config/config.json";

import "./login.scss";

interface propsType {
    isLogin: boolean;
    setIsLogin: (isLogin: boolean) => void;
}

const Login = (props: propsType) => {
    useEffect(() => {
        if (props.isLogin) {
            window.location.href = "/";
        }
    }, []);

    const login: Function = async () => {
        let userid = (document.querySelector("#userid") as HTMLInputElement)
            .value;
        let userpw = (document.querySelector("#userpw") as HTMLInputElement)
            .value;
        let result = await axios.get(
            `${config.baseurl}/member/general?userid=${userid}&userpw=${userpw}`,
            { headers: { Authorization: `${config.apikey}` } }
        );

        if (result.data.status === 200) {
            sessionStorage.setItem("Name", result.data.body.Name);
            sessionStorage.setItem("Email", result.data.body.Email);
            sessionStorage.setItem("UserKey", result.data.body.UserKey);
            props.setIsLogin(true);
            window.location.href = "./";
        } else {
            alert("아이디와 비밀번호를 확인해주세요.");
        }
    };

    const logout: Function = () => {
        sessionStorage.clear();
        props.setIsLogin(false);
    };

    return (
        <div className="Login">
            {!props.isLogin && (
                <div>
                    <h1>로그인</h1>
                    <div className="form">
                        <input type="text" id="userid" placeholder="아이디" />
                        <input
                            type="password"
                            id="userpw"
                            placeholder="비밀번호"
                        />
                        <input
                            type="button"
                            onClick={() => login()}
                            value="로그인"
                        />
                        <ul>
                            <li>
                                <a href="/idInquiry">아이디 찾기</a>
                            </li>
                            <li>
                                <a href="/pwInquiry">비밀번호 찾기</a>
                            </li>
                            <li>
                                <a href="/join">회원가입</a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
