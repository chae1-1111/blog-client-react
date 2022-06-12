import "./mypages.scss";

import config from "../../../config/config.json";

import { useState } from "react";
const axios = require("axios");

interface disable {
    userpw?: String;
    newPw?: String;
    newPw_check?: String;
}

interface propsType {
    setIsLogin: Function;
}

const ModifyPassword = (props: propsType) => {
    const [disable, setDisable] = useState({
        userpw: "",
        newPw: "",
        newPw_check: "",
    } as disable);
    const [active, setActive] = useState(true);
    const [userkey, setUserkey] = useState(sessionStorage.getItem("UserKey"));

    const logout: Function = () => {
        sessionStorage.clear();
        props.setIsLogin(false);
    };

    const modifyPw: Function = async () => {
        let resultCheck = { userpw: "", newPw: "", newPw_check: "" } as disable;

        const userpw = (document.getElementById("userpw") as HTMLInputElement)
            .value;
        const newPw = (document.getElementById("newPw") as HTMLInputElement)
            .value;
        const newPw_check = (
            document.getElementById("newPw_check") as HTMLInputElement
        ).value;

        const regPw = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[~!@#$%^&*<>?]).{8,20}$/;

        if (userpw.trim().length === 0) {
            resultCheck.userpw = "기존 비밀번호를 입력해주세요.";
        } else if (!regPw.test(userpw)) {
            resultCheck.userpw =
                "비밀번호는 8자 이상 20자 이하의 영문 대소문자와 숫자, 특수문자를 포함해주세요.";
        }

        if (newPw.trim().length === 0) {
            resultCheck.newPw = "신규 비밀번호를 입력해주세요.";
        } else if (!regPw.test(userpw)) {
            resultCheck.newPw =
                "비밀번호는 8자 이상 20자 이하의 영문 대소문자와 숫자, 특수문자를 포함해주세요.";
        }

        if (newPw_check.trim().length === 0) {
            resultCheck.newPw_check = "비밀번호 확인을 입력해주세요.";
        } else if (newPw !== newPw_check) {
            resultCheck.newPw_check = "비밀번호 확인이 일치하지 않습니다.";
        }

        setDisable(resultCheck);
        if (
            resultCheck.userpw !== "" ||
            resultCheck.newPw !== "" ||
            resultCheck.newPw_check !== ""
        ) {
            setActive(true);
            return;
        }

        try {
            let result = await axios.put(
                `${config.baseurl}/member/general/modifyPw`,
                {
                    userkey: userkey,
                    userpw: userpw,
                    newPw: newPw,
                },
                { headers: { Authorization: `${config.apikey}` } }
            );
            if (result.status === 200) {
                alert(
                    "비밀번호가 변경되었습니다.\n로그인 페이지로 이동합니다."
                );
                logout();
                window.location.href = "/login";
            } else {
                alert("잘못된 요청입니다.");
                window.location.href = "/";
            }
        } catch (err) {
            alert("잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div>
            <h1>비밀번호 변경</h1>
            <div className="sub-content-wrap">
                <div className="sub-content">
                    <div className="form">
                        <input
                            type="password"
                            id="userpw"
                            placeholder="기존 비밀번호"
                            className={disable.userpw === "" ? "" : "error"}
                            onClick={() => {
                                setDisable({ ...disable, userpw: "" });
                            }}
                        />
                        {disable.userpw !== "" ? (
                            <p className="disable">{disable.userpw}</p>
                        ) : null}
                        <input
                            type="password"
                            id="newPw"
                            placeholder="변경할 비밀번호"
                            className={disable.newPw === "" ? "" : "error"}
                            onClick={() => {
                                setDisable({ ...disable, newPw: "" });
                            }}
                        />
                        {disable.newPw !== "" ? (
                            <p className="disable">{disable.newPw}</p>
                        ) : null}
                        <input
                            type="password"
                            id="newPw_check"
                            placeholder="비밀번호 확인"
                            className={
                                disable.newPw_check === "" ? "" : "error"
                            }
                            onClick={() => {
                                setDisable({
                                    ...disable,
                                    newPw_check: "",
                                });
                            }}
                        />
                        {disable.newPw_check !== "" ? (
                            <p className="disable">{disable.newPw_check}</p>
                        ) : null}
                        <input
                            type="button"
                            value="비밀번호 변경"
                            onClick={() => {
                                setActive(false);
                                modifyPw();
                            }}
                            disabled={!active}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModifyPassword;
