import axios from "axios";
import { useEffect, useState } from "react";

import config from "../../config/config.json";
import SelectKeyword from "./selectKeyword";
import EmailAuth from "./emailAuth";
import { joinCheck } from "./joinCheck";

import "./member.scss";

interface propsType {
    isLogin: boolean;
}

interface disableType {
    userid?: string;
    userpw?: string;
    userpw_check?: string;
    email?: string;
    keywords?: string;
}

const Join = (props: propsType) => {
    const [selectKeyword, setSelectKeyword] = useState(false);
    const [emailAuth, setEmailAuth] = useState(false);
    const [email, setEmail] = useState("");

    const [keywords, setKeywords] = useState([] as string[]);

    const [disable, setDisable] = useState({} as disableType);

    useEffect(() => {
        if (props.isLogin) {
            window.location.href = "/";
        }
    }, []);

    const join: Function = async () => {
        const userid = document.getElementById("userid") as HTMLInputElement;
        const userpw = document.getElementById("userpw") as HTMLInputElement;
        const userpw_check = document.getElementById(
            "userpw_check"
        ) as HTMLInputElement;
        const email = document.getElementById("email") as HTMLInputElement;
        const name = document.getElementById("name") as HTMLInputElement;
        const birth = document.getElementById("birth") as HTMLInputElement;

        let user = {
            userid: userid.value,
            userpw: userpw.value,
            userpw_check: userpw_check.value,
            email: email.value,
            keywords: keywords,
        };

        const result = await joinCheck(user);
        if (Object.keys(result).length !== 0) {
            setDisable(result);
            return;
        } else {
            setDisable({});
            const res = await axios.post(
                `${config.baseurl}/member/general`,
                {
                    userid: userid.value,
                    userpw: userpw.value,
                    email: email.value,
                    name: name.value !== "" ? name.value : null,
                    birthday: birth.value,
                    keyword: keywords,
                },
                { headers: { Authorization: `${config.apikey}` } }
            );

            if (res.status === 200) {
                alert("???????????? ??????");
                window.location.href = "./login";
            } else {
                alert("???????????? ??????");
            }
        }
    };

    return (
        <div className="form-wrap">
            {!props.isLogin && (
                <div>
                    <h1>????????????</h1>
                    <div className="form">
                        <p className="label mandatory">?????????</p>
                        <input
                            type="text"
                            className={
                                !disable.userid || disable.userid === ""
                                    ? ""
                                    : "error"
                            }
                            id="userid"
                            placeholder="6~20??? ?????? ????????????, ??????"
                            onFocus={() => {
                                setDisable({ ...disable, userid: "" });
                            }}
                        />
                        {disable.userid && disable.userid !== "" ? (
                            <p className="disable">{disable.userid}</p>
                        ) : null}
                        <p className="label mandatory">????????????</p>
                        <input
                            type="password"
                            className={
                                !disable.userpw || disable.userpw === ""
                                    ? ""
                                    : "error"
                            }
                            id="userpw"
                            placeholder="8~20??? ?????? ????????????, ??????, ????????????"
                            onFocus={() => {
                                setDisable({ ...disable, userpw: "" });
                            }}
                        />
                        {disable.userpw && disable.userpw !== "" ? (
                            <p className="disable">{disable.userpw}</p>
                        ) : null}
                        <p className="label mandatory">???????????? ??????</p>
                        <input
                            type="password"
                            className={
                                !disable.userpw_check ||
                                disable.userpw_check === ""
                                    ? ""
                                    : "error"
                            }
                            id="userpw_check"
                            placeholder="???????????? ??????"
                            onFocus={() => {
                                setDisable({ ...disable, userpw_check: "" });
                            }}
                        />
                        {disable.userpw_check && disable.userpw_check !== "" ? (
                            <p className="disable">{disable.userpw_check}</p>
                        ) : null}
                        <p className="label mandatory">?????????</p>
                        <input
                            type="text"
                            className={
                                !disable.email || disable.email === ""
                                    ? ""
                                    : "error"
                            }
                            id="email"
                            placeholder="?????????"
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
                        <p className="label">??????</p>
                        <input type="text" id="name" placeholder="??????" />

                        <p className="label">????????????</p>
                        <input
                            type="date"
                            id="birth"
                            max={new Date().toLocaleDateString("en-ca")}
                        />
                        <p className="label mandatory">?????? ?????????</p>
                        <input
                            type="text"
                            id="keyword"
                            placeholder="?????? ????????? ??????"
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
                            onClick={() => join()}
                            value="????????????"
                        />
                    </div>
                </div>
            )}
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

export default Join;
