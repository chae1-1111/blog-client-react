import axios from "axios";

import apikey from "../../auth/apikey.json";
import EmailAuth from "./emailAuth";

import "./join.scss";

interface propsType {
    isLogin: boolean;
}

function Join(props: propsType) {
    const join: Function = async () => {
        console.log("회원가입");
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
            <EmailAuth />
        </div>
    );
}

export default Join;
