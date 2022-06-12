import { useEffect, useState } from "react";
import axios from "axios";

import config from "../../config/config.json";

import "./resetPw.scss";
import { useParams } from "react-router-dom";

interface propsType {
    isLogin: boolean;
}

interface disable {
    userpw?: String;
    userpw_check?: String;
}

const ResetPw = (props: propsType) => {
    const [disable, setDisable] = useState({
        userpw: "",
        userpw_check: "",
    } as disable);
    const [user, setUser] = useState({ UserId: "", UserKey: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    let params = useParams();

    const getUser = async function () {
        let user = await axios.get(
            `${config.baseurl}/member/tokenCheck?token=${params.token}`,
            {
                headers: { Authorization: `${config.apikey}` },
            }
        );
        if (user.status === 200) {
            console.log("user", user.data);
            setUser({ ...user.data.body });
            setIsLoaded(true);
        } else if (user.status === 201 && user.data.errorCode === "TKN001") {
            console.log(user);
            alert("만료된 링크입니다.");
        } else {
            alert("잘못된 링크입니다.");
            window.location.href = "/";
        }
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

    const resetPw: Function = async () => {
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

        try {
            let result = await axios.put(
                `${config.baseurl}/member/resetPw`,
                {
                    userkey: user.UserKey,
                    userpw: userpw,
                    token: params.token,
                },
                { headers: { Authorization: `${config.apikey}` } }
            );
            if (result.status === 200) {
                alert(
                    "비밀번호가 변경되었습니다.\n로그인 페이지로 이동합니다."
                );
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
        <div className="resetPw">
            {!props.isLogin ? (
                isLoaded ? (
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
                                    setDisable({
                                        ...disable,
                                        userpw_check: "",
                                    });
                                }}
                            />
                            {disable.userpw_check !== "" ? (
                                <p className="disable">
                                    {disable.userpw_check}
                                </p>
                            ) : null}
                            <input
                                type="button"
                                value="비밀번호 찾기"
                                onClick={() => {
                                    setActive(false);
                                    resetPw();
                                }}
                                disabled={!active}
                            />
                        </div>
                    </div>
                ) : null
            ) : (
                <script>window.location.href = "./";</script>
            )}
        </div>
    );
};

export default ResetPw;
