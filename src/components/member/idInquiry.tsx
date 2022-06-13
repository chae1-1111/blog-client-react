import { useEffect, useState } from "react";
import axios from "axios";

import config from "../../config/config.json";

import "./member.scss";

interface propsType {
    isLogin: boolean;
}

const IdInquiry = (props: propsType) => {
    const [disable, setDisable] = useState("" as String);

    const [active, setActive] = useState(true);

    useEffect(() => {
        if (props.isLogin) {
            window.location.href = "/";
        }
    }, []);

    const idInquiry: Function = async () => {
        const email = (document.getElementById("email") as HTMLInputElement)
            .value;

        const regEmail = /^\w+([\.-]?\w+)*@\w+([\.0]?\w+)*(\.\w{2,3})+$/;
        if (email === "") {
            setDisable("이메일을 입력해주세요.");
            setActive(true);
            return;
        } else if (!regEmail.test(email)) {
            setDisable("올바른 이메일을 입력해주세요.");
            setActive(true);
            return;
        }

        let result = await axios.get(
            `${config.baseurl}/member/idInquiry?email=${email}`,
            {
                headers: { Authorization: config.apikey },
            }
        );

        if (result.status === 200) {
            alert("아이디를 이메일로 발송했습니다.\n이메일을 확인해주세요.");
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
                    <h1>아이디 찾기</h1>
                    <div className="form">
                        <p className="label mandatory">이메일</p>
                        <input
                            type="text"
                            id="email"
                            placeholder="이메일"
                            className={disable === "" ? "" : "error"}
                            onClick={() => {
                                setDisable("");
                            }}
                        />
                        {disable !== "" ? (
                            <p className="disable">{disable}</p>
                        ) : null}
                        <input
                            type="button"
                            value="아이디 찾기"
                            onClick={() => {
                                setActive(false);
                                idInquiry();
                            }}
                            disabled={!active}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default IdInquiry;
