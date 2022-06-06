import axios from "axios";
import "./emailAuth.scss";

import { useState } from "react";

import config from "../../config/config.json";

const EmailAuth = () => {
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
            alert("중복된 이메일입니다.");
            setButtonState(false);
            return;
        } else if (result.status === 200) {
            setAuthCode(result.data.AuthCode);
            setEmail(email);
            (document.getElementById("button") as HTMLInputElement).type =
                "hidden";
            (document.getElementById("code") as HTMLInputElement).type = "text";
            (document.getElementById("verify") as HTMLInputElement).type =
                "button";
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
                    <input type="hidden" id="verify" value="인증" />
                </div>
            </div>
        </div>
    );
};

export default EmailAuth;
