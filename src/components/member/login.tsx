import axios from "axios";
import { useEffect, useRef } from "react";

import config from "../../config/config.json";

import "./login.scss";
import "./member.scss";

interface propsType {
    isLogin: boolean;
    setIsLogin: (isLogin: boolean) => void;
}

const Login = (props: propsType) => {
    useEffect(() => {
        if (props.isLogin) {
            window.location.href = "/";
        }
        form.current.addEventListener("keydown", event);
    }, []);

    const event = async (e: any) => {
        if (e.key === "Enter") {
            form.current.removeEventListener("keydown", event);
            await login();
            form.current.addEventListener("keydown", event);
        }
    };

    const form = useRef() as React.MutableRefObject<HTMLDivElement>;

    const login: Function = async () => {
        let userid = (document.querySelector("#userid") as HTMLInputElement)
            .value;
        let userpw = (document.querySelector("#userpw") as HTMLInputElement)
            .value;

        if (userid.trim().length === 0 || userpw.trim().length === 0) {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        let result = await axios.get(
            `${config.baseurl}/member/general?userid=${userid}&userpw=${userpw}`,
            { headers: { Authorization: `${config.apikey}` } }
        );

        if (result.status === 200) {
            sessionStorage.setItem("Name", result.data.body.Name);
            sessionStorage.setItem("Email", result.data.body.Email);
            sessionStorage.setItem("UserKey", result.data.body.UserKey);
            sessionStorage.setItem("UserId", userid);
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
        <div className="form-wrap">
            {!props.isLogin && (
                <div>
                    <h1>로그인</h1>
                    <div className="form" ref={form}>
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
                        <ul className="actions">
                            <li>
                                <a href="/idInquiry">아이디 찾기</a>
                            </li>
                            <li>
                                <a href="/pwInquiry">비밀번호 재설정</a>
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
