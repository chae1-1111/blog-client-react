import "./selectKeyword.scss";

import { FaTimes } from "react-icons/fa";

import keywords from "./keywords.json";
import { useState } from "react";

interface selectKeywordProps {
    keywords: string[];
    setKeywords: (keywords: string[]) => void;
    setSelectKeyword: (selectKeyword: boolean) => void;
}

const SelectKeyword = (props: selectKeywordProps) => {
    const [selected, setSelected] = useState(props.keywords);

    return (
        <div className="wrap">
            <div className="SelectKeyword">
                <div>
                    <h2>관심 키워드 설정</h2>
                    <div className="keywords">
                        {keywords.keywords.map((keyword, index) => (
                            <div
                                className={
                                    selected.indexOf(keyword) === -1
                                        ? "keyword"
                                        : "keyword selected"
                                }
                                key={index}
                                onClick={() => {
                                    if (selected.indexOf(keyword) === -1) {
                                        if (selected.length === 10) {
                                            alert(
                                                "10개까지만 선택 가능합니다."
                                            );
                                        } else {
                                            setSelected([...selected, keyword]);
                                        }
                                    } else {
                                        setSelected(
                                            selected.filter(
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
                            props.setKeywords(selected);
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

export default SelectKeyword;
