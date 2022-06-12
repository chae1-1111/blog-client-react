import { useEffect, useState } from "react";
import axios from "axios";

import config from "../../config/config.json";

import "./member.scss";

interface propsType {
    isLogin: boolean;
}

interface disable {
    email?: String;
    userid?: String;
}

const PwInquiry = (props: propsType) => {
    const [disable, setDisable] = useState({
        email: "",
        userid: "",
    } as disable);

    const [active, setActive] = useState(true);

    useEffect(() => {
        if (props.isLogin) {
            window.location.href = "/";
        }
    }, []);

    const pwInquiry: Function = async () => {
        let resultCheck = { userid: "", email: "" } as disable;

        const userid = (document.getElementById("userid") as HTMLInputElement)
            .value;
        const email = (document.getElementById("email") as HTMLInputElement)
            .value;

        const regId = /^[a-zA-Z0-9]{4,12}$/;
        const regEmail = /^\w+([\.-]?\w+)*@\w+([\.0]?\w+)*(\.\w{2,3})+$/;

        if (userid.trim().length === 0) {
            resultCheck.userid = "아이디를 입력해주세요.";
        } else if (!regId.test(userid)) {
            resultCheck.userid =
                "아이디는 4자 이상 12자 이하의 영문 대소문자와 숫자로만 입력해주세요.";
        }

        if (email.trim().length === 0) {
            resultCheck.email = "이메일을 입력해주세요.";
        } else if (!regEmail.test(email)) {
            resultCheck.email = "올바른 이메일을 입력해주세요.";
        }

        setDisable(resultCheck);
        if (resultCheck.userid !== "" || resultCheck.email !== "") {
            setActive(true);
            return;
        }

        let result = await axios.get(
            `${config.baseurl}/member/pwInquiry?email=${email}&userid=${userid}`,
            {
                headers: { Authorization: config.apikey },
            }
        );

        if (result.status === 200) {
            alert(
                "비밀번호 재설정 이메일을 발송했습니다.\n이메일을 확인해주세요."
            );
            window.location.href = "/";
        } else if (result.status === 201) {
            alert("일치하는 사용자가 존재하지 않습니다.");
            setActive(true);
        } else {
            alert(result.data.errorCode + ": 잠시 후 다시 시도해주세요.");
            setActive(true);
        }
    };

    return (
        <div className="form-wrap">
            {!props.isLogin && (
                <div>
                    <h1>비밀번호 찾기</h1>
                    <div className="form">
                        <input
                            type="text"
                            id="userid"
                            placeholder="아이디"
                            className={disable.userid === "" ? "" : "error"}
                            onClick={() => {
                                setDisable({ ...disable, userid: "" });
                            }}
                        />
                        {disable.userid !== "" ? (
                            <p className="disable">{disable.userid}</p>
                        ) : null}
                        <input
                            type="text"
                            id="email"
                            placeholder="이메일"
                            className={disable.email === "" ? "" : "error"}
                            onClick={() => {
                                setDisable({ ...disable, email: "" });
                            }}
                        />
                        {disable.email !== "" ? (
                            <p className="disable">{disable.email}</p>
                        ) : null}
                        <input
                            type="button"
                            value="비밀번호 찾기"
                            onClick={() => {
                                setActive(false);
                                pwInquiry();
                            }}
                            disabled={!active}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PwInquiry;
