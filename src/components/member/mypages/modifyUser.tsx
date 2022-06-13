import axios from "axios";
import { useEffect, useRef, useState } from "react";
import EmailAuth from "../emailAuth";
import SelectKeyword from "../selectKeyword";

import config from "../../../config/config.json";

interface disable {
    userpw?: string;
    email?: string;
    keywords?: string;
}

const ModifyUser = () => {
    const [disable, setDisable] = useState({ userpw: "" } as disable);
    const [active, setActive] = useState(true);
    const [keywords, setKeywords] = useState([] as string[]);
    const [email, setEmail] = useState(
        sessionStorage.getItem("Email") as string
    );
    const [emailAuth, setEmailAuth] = useState(false);
    const [selectKeyword, setSelectKeyword] = useState(false);

    const name = useRef() as React.MutableRefObject<HTMLInputElement>;
    const birth = useRef() as React.MutableRefObject<HTMLInputElement>;

    const getUser = async () => {
        let result = await axios.get(
            `${
                config.baseurl
            }/member/general/getUserInfo?userkey=${sessionStorage.getItem(
                "UserKey"
            )}`,
            { headers: { Authorization: config.apikey } }
        );
        if (result.status === 200) {
            setKeywords(result.data.body.Keyword);
            name.current.value = result.data.body.Name;
            birth.current.value = result.data.body.Birth;
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const removeUndefined: Function = (obj: object) => {
        Object.keys(obj).forEach(
            (key) =>
                obj[key as keyof typeof obj] === undefined &&
                delete obj[key as keyof typeof obj]
        );
        return obj;
    };

    const modifyUser: Function = async () => {
        const userpw = (document.getElementById("userpw") as HTMLInputElement)
            .value;
        const name = (document.getElementById("name") as HTMLInputElement)
            .value;
        const birth = (document.getElementById("birth") as HTMLInputElement)
            .value;

        const regPw = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[~!@#$%^&*<>?]).{8,20}$/;

        let resultCheck = {} as disable;

        if (userpw.trim().length === 0) {
            resultCheck.userpw = "비밀번호를 입력해주세요.";
        } else if (!regPw.test(userpw)) {
            resultCheck.userpw =
                "비밀번호는 8자 이상 20자 이하의 영문 대소문자와 숫자, 특수문자를 포함해주세요.";
        }

        if (email.trim().length === 0) {
            resultCheck.email = "이메일 인증이 필요합니다.";
        }

        if (keywords!.length === 0) {
            resultCheck.keywords = "키워드를 선택해주세요.";
        }

        if (Object.keys(resultCheck).length !== 0) {
            setDisable({ ...disable, ...resultCheck });
            setActive(true);
            return;
        }

        let data = removeUndefined({
            userkey: sessionStorage.getItem("UserKey"),
            userpw: userpw,
            email: email,
            name: name,
            birth: birth,
            keyword: keywords,
        });

        const result = await axios.put(
            `${config.baseurl}/member/general`,
            data,
            {
                headers: { Authorization: config.apikey },
            }
        );

        if (result.status === 200) {
            alert("회원정보가 수정되었습니다.");
            window.location.href = "/mypages/modifyUser";
        } else if (result.status === 201) {
            setDisable({ ...disable, userpw: "비밀번호가 일치하지 않습니다." });
            setActive(true);
            return;
        } else {
            alert("잠시 후 다시 시도해주세요.");
            setActive(true);
        }
    };

    return (
        <div>
            <h1>회원정보 수정</h1>
            <div className="sub-content-wrap">
                <div className="sub-content">
                    <div className="form">
                        <p className="label mandatory">비밀번호</p>
                        <input
                            type="password"
                            className={
                                !disable.userpw || disable.userpw === ""
                                    ? ""
                                    : "error"
                            }
                            id="userpw"
                            placeholder="기존 비밀번호"
                            onFocus={() => {
                                setDisable({ ...disable, userpw: "" });
                            }}
                        />
                        {disable.userpw && disable.userpw !== "" ? (
                            <p className="disable">{disable.userpw}</p>
                        ) : null}
                        <p className="label mandatory">이메일</p>
                        <input
                            type="text"
                            className={
                                !disable.email || disable.email === ""
                                    ? ""
                                    : "error"
                            }
                            id="email"
                            placeholder="이메일"
                            value={email}
                            onFocus={() => {
                                setDisable({ ...disable, email: "" });
                                setEmailAuth(true);
                            }}
                            readOnly
                        />
                        {disable.email && disable.email !== "" ? (
                            <p className="disable">{disable.email}</p>
                        ) : null}
                        <p className="label">이름</p>
                        <input
                            type="text"
                            id="name"
                            placeholder="이름"
                            ref={name}
                        />

                        <p className="label">생년월일</p>
                        <input
                            type="date"
                            id="birth"
                            max={new Date().toLocaleDateString("en-ca")}
                            ref={birth}
                        />
                        <p className="label mandatory">관심 키워드</p>
                        <input
                            type="text"
                            id="keyword"
                            placeholder="관심 키워드 설정"
                            className={
                                !disable.keywords || disable.keywords === ""
                                    ? ""
                                    : "error"
                            }
                            onClick={() => {
                                setDisable({ ...disable, keywords: "" });
                                setSelectKeyword(true);
                            }}
                            value={keywords.join(", ")}
                            readOnly
                        />
                        {disable.keywords && disable.keywords !== "" ? (
                            <p className="disable">{disable.keywords}</p>
                        ) : null}
                        <input
                            type="button"
                            value="수정"
                            onClick={() => {
                                setActive(false);
                                modifyUser();
                            }}
                            disabled={!active}
                        />
                    </div>
                </div>
            </div>
            {emailAuth && (
                <EmailAuth
                    emailAuth={emailAuth}
                    setEmailAuth={setEmailAuth}
                    setEmail={setEmail}
                />
            )}
            {selectKeyword && (
                <SelectKeyword
                    keywords={keywords}
                    setKeywords={setKeywords}
                    selectKeyword={selectKeyword}
                    setSelectKeyword={setSelectKeyword}
                />
            )}
        </div>
    );
};
export default ModifyUser;
