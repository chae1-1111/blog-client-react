import { useEffect, useState } from "react";
import axios from "axios";

import config from "../../config/config.json";

import "./resetPw.scss";

interface propsType {
    isLogin: boolean;
}

interface disable {
    userpw?: String;
    userpw_check?: String;
}

function ResetPw(props: propsType) {
    const [disable, setDisable] = useState({
        userpw: "",
        userpw_check: "",
    } as disable);
    const [user, setUser] = useState({ UserId: "", UserKey: 0 });

    let current = decodeURI(window.location.href);
    let search = current.split("?")[1];
    let params = new URLSearchParams(search);

    const getUser = async function () {
        let user = await axios.get(
            `${config.baseurl}/member/tokenCheck?token=${params.get("token")}`,
            {
                headers: { Authorization: `${config.apikey}` },
            }
        );
        setUser({ ...user.data.body });
    };

    useEffect(() => {
        try {
            getUser();
            return;
        } catch (err) {
            alert("유효하지 않은 링크입니다. 다시 시도해주세요.");
            window.location.href = "/";
        }
    }, []);

    const [active, setActive] = useState(true);

    const pwInquiry: Function = async () => {
        let resultCheck = { userpw: "", userpw_check: "" } as disable;

        const userpw = (document.getElementById("userpw") as HTMLInputElement)
            .value;
        const userpw_check = (
            document.getElementById("userpw_check") as HTMLInputElement
        ).value;

        const regPw = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[~!@#$%^&*<>?]).{8,20}$/;

        if (userpw.trim().length === 0) {
            resultCheck.userpw = "비밀번호를 입력해주세요.";
        } else if (!regPw.test(userpw)) {
            resultCheck.userpw =
                "비밀번호는 8자 이상 20자 이하의 영문 대소문자와 숫자, 특수문자를 포함해주세요.";
        }

        if (userpw_check.trim().length === 0) {
            resultCheck.userpw_check = "비밀번호 확인을 입력해주세요.";
        } else if (userpw !== userpw_check) {
            resultCheck.userpw_check = "비밀번호 확인이 일치하지 않습니다.";
        }

        setDisable(resultCheck);
        if (resultCheck.userpw !== "" || resultCheck.userpw_check !== "") {
            setActive(true);
            return;
        }
    };

    return (
        <div className="Login">
            {!props.isLogin ? (
                <div>
                    <h1>비밀번호 재설정</h1>
                    <div className="form">
                        <p id="userid">{user.UserId}</p>
                        <input
                            type="password"
                            id="userpw"
                            placeholder="비밀번호"
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
                            id="userpw_check"
                            placeholder="비밀번호 확인"
                            className={
                                disable.userpw_check === "" ? "" : "error"
                            }
                            onClick={() => {
                                setDisable({ ...disable, userpw_check: "" });
                            }}
                        />
                        {disable.userpw_check !== "" ? (
                            <p className="disable">{disable.userpw_check}</p>
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
            ) : (
                <script>window.location.href = "./";</script>
            )}
        </div>
    );
}

export default ResetPw;
