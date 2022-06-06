import axios from "axios";
import "./emailAuth.scss";

import { useState } from "react";

import config from "../../config/config.json";

import { FaTimes } from "react-icons/fa";

interface emailAuthProps {
    setEmailAuth: (emailAuth: boolean) => void;
    setEmail: (email: string) => void;
}

const EmailAuth = (props: emailAuthProps) => {
    const [email, setEmail] = useState("");
    const [authCode, setAuthCode] = useState("");
    const [buttonState, setButtonState] = useState(false);

    const sendEmail: Function = async () => {
        setButtonState(true);
        const email = (document.querySelector("#_email") as HTMLInputElement)
            .value;

        if (email.length === 0) {
            alert("이메일을 입력해주세요.");
            setButtonState(false);
            return;
        }

        let result = await axios.post(
            `${config.baseurl}/member/general/email`,
            { email: email },
            {
                headers: { Authorization: `${config.apikey}` },
            }
        );

        console.log(result);
        if (result.status === 201 && result.data.errorCode === "MEM001") {
            alert("이미 가입된 이메일입니다.");
            setButtonState(false);
            return;
        } else if (result.status === 200) {
            console.log(result.data);
            setAuthCode(result.data.authCode);
            setEmail(email);
            (document.getElementById("button") as HTMLInputElement).type =
                "hidden";
            (document.getElementById("code") as HTMLInputElement).type = "text";
            (document.getElementById("verify") as HTMLInputElement).type =
                "button";
        }
    };

    const verify: Function = async () => {
        const code = (document.getElementById("code") as HTMLInputElement)
            .value;

        console.log(code);
        console.log(authCode);
        if (code.length === 0) {
            alert("인증번호를 입력해주세요.");
            return;
        } else if (authCode != "" && code === authCode) {
            alert("인증 되었습니다.");
            props.setEmail(email);
            props.setEmailAuth(false);
        } else {
            alert("잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div className="wrap">
            <div className="EmailAuth">
                <h1>이메일 인증</h1>
                <div className="input-wrap">
                    <input type="text" id="_email" placeholder="이메일" />
                    <input
                        type="button"
                        onClick={() => sendEmail()}
                        disabled={buttonState}
                        id="button"
                        value="인증번호 발송"
                    />
                    <input type="hidden" id="code" placeholder="인증번호" />
                    <input
                        type="hidden"
                        id="verify"
                        onClick={() => verify()}
                        value="인증"
                    />
                </div>
                <FaTimes
                    className="exit-icon"
                    onClick={() => props.setEmailAuth(false)}
                />
            </div>
        </div>
    );
};

export default EmailAuth;
