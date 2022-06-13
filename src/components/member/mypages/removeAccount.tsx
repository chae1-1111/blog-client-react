import axios from "axios";
import { useState } from "react";

import config from "../../../config/config.json";

interface disable {
    userpw?: string;
}

interface propsType {
    setIsLogin: Function;
}

const RemoveAccount = (props: propsType) => {
    const [disable, setDisable] = useState({ userpw: "" } as disable);
    const [active, setActive] = useState(true);

    const logout: Function = () => {
        sessionStorage.clear();
        props.setIsLogin(false);
    };

    const removeAccount: Function = async () => {
        const userkey = sessionStorage.getItem("UserKey");
        const userpw = (document.getElementById("userpw") as HTMLInputElement)
            .value;

        const regPw = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[~!@#$%^&*<>?]).{8,20}$/;

        if (userpw.trim().length === 0) {
            setDisable({ userpw: "비밀번호를 입력해주세요." });
            setActive(true);
            return;
        } else if (!regPw.test(userpw)) {
            setDisable({
                userpw: "비밀번호는 8자 이상 20자 이하의 영문 대소문자와 숫자, 특수문자를 포함해주세요.",
            });
            setActive(true);
            return;
        }

        if (!window.confirm("정말로 탈퇴하시겠습니까?")) {
            setActive(true);
            return;
        }

        const result = await axios.delete(`${config.baseurl}/member/general`, {
            data: { userkey: userkey, userpw: userpw },
            headers: { Authorization: config.apikey },
        });

        if (result.status === 200) {
            alert("탈퇴가 완료되었습니다.");
            logout();
            window.location.href = "/";
        } else if (result.status === 201) {
            alert("비밀번호가 일치하지 않습니다.");
            setActive(true);
            return;
        } else {
            alert("잠시 후 다시 시도해주세요.");
            setActive(true);
            return;
        }
    };

    return (
        <div>
            <h1>회원탈퇴</h1>
            <p>※ 사용자 확인을 위해 비밀번호를 다시 입력해주세요.</p>
            <div className="sub-content-wrap">
                <div className="sub-content">
                    <div className="form">
                        <p className="label mandatory">비밀번호</p>
                        <input
                            type="password"
                            id="userpw"
                            placeholder="비밀번호"
                            className={disable.userpw === "" ? "" : "error"}
                            onFocus={() => {
                                setDisable({ ...disable, userpw: "" });
                            }}
                        />
                        {disable.userpw !== "" ? (
                            <p className="disable">{disable.userpw}</p>
                        ) : null}
                        <input
                            type="button"
                            value="회원탈퇴"
                            onClick={() => {
                                setActive(false);
                                removeAccount();
                            }}
                            disabled={!active}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemoveAccount;
