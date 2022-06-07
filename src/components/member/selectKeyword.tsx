import axios from "axios";
import "./selectKeyword.scss";

import { FaTimes } from "react-icons/fa";

import keywords from "./keywords.json";

interface selectKeywordProps {
    keywords: string[];
    setKeywords: (keywords: string[]) => void;
    setSelectKeyword: (selectKeyword: boolean) => void;
}

const EmailAuth = (props: selectKeywordProps) => {
    return (
        <div className="wrap">
            <div className="SelectKeyword">
                <div>
                    <h2>관심 키워드 설정</h2>
                    <div className="keywords">
                        {keywords.keywords.map((keyword, index) => (
                            <div
                                className={
                                    props.keywords.indexOf(keyword) === -1
                                        ? "keyword"
                                        : "keyword selected"
                                }
                                key={index}
                                onClick={() => {
                                    if (
                                        props.keywords.indexOf(keyword) === -1
                                    ) {
                                        if (props.keywords.length === 10) {
                                            alert(
                                                "10개까지만 선택 가능합니다."
                                            );
                                        } else {
                                            props.setKeywords([
                                                ...props.keywords,
                                                keyword,
                                            ]);
                                        }
                                    } else {
                                        props.setKeywords(
                                            props.keywords.filter(
                                                (i) => i !== keyword
                                            )
                                        );
                                    }
                                }}
                            >
                                {keyword}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <input
                        type="button"
                        onClick={() => {
                            props.setSelectKeyword(false);
                        }}
                        value="확인"
                    />
                </div>
                <FaTimes
                    className="exit-icon"
                    onClick={() => props.setSelectKeyword(false)}
                />
            </div>
        </div>
    );
};

export default EmailAuth;
