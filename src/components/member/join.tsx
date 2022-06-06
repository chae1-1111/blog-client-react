import axios from "axios";
import { useState } from "react";

import config from "../../config/config.json";
import EmailAuth from "./emailAuth";

import "./join.scss";

interface propsType {
    isLogin: boolean;
}

function Join(props: propsType) {
    const [emailAuth, setEmailAuth] = useState(false);
    const [email, setEmail] = useState("");

    const join: Function = async () => {
        const userid = document.getElementById("userid") as HTMLInputElement;
        const userpw = document.getElementById("userpw") as HTMLInputElement;
        const userpw_chack = document.getElementById("userpw_check") as HTMLInputElement;
        const email = document.getElementById("email") as HTMLInputElement;
        const name = document.getElementById("name") as HTMLInputElement;

        
    };

    return (
        <div className="Join">
            {!props.isLogin ? (
                <div>
                    <h1>회원가입</h1>
                    <div className="form">
                        <input type="text" id="userid" placeholder="아이디" />
                        <input
                            type="password"
                            id="userpw"
                            placeholder="비밀번호"
                        />
                        <input
                            type="password"
                            id="userpw_check"
                            placeholder="비밀번호 확인"
                        />
                        <input
                            type="text"
                            id="email"
                            placeholder="이메일"
                            value={email}
                            onClick={() => setEmailAuth(true)}
                            readOnly
                        />
                        <input type="text" id="name" placeholder="이름" />

                        <input
                            type="button"
                            onClick={() => join()}
                            value="회원가입"
                        />
                    </div>
                </div>
            ) : (
                <script>window.location.href = "./";</script>
            )}
            {emailAuth ? (
                <EmailAuth setEmailAuth={setEmailAuth} setEmail={setEmail} />
            ) : null}
        </div>
    );
}

export default Join;
