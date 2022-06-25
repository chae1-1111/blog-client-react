import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";

import { FaTimes, FaHashtag } from "react-icons/fa";

import config from "../../config/config.json";
import "./blog.scss";

interface PropsType {
    isLogin: boolean;
}

interface postProps {
    Created: string;
    Description: string;
    Likes: number;
    Name: string;
    Title: string;
    UserId: string;
    Views: number;
    isLiker: boolean;
    Category: string;
    Keyword: string[];
    Replys: number;
    isOwner: boolean;
}

const NewPost: Function = (props: PropsType) => {
    const params = useParams();

    const [post, setPost] = useState({} as postProps);
    const [categories, setCategories] = useState([] as string[]);
    const [keywords, setKeywords] = useState([] as string[]);

    const newTagInput = useRef() as React.MutableRefObject<HTMLInputElement>;

    useEffect(() => {
        !props.isLogin && (window.location.href = "/login");
        params.postKey && getPostDetail();
        getCategories();
        newTagInput.current.addEventListener("keypress", addKeyword);
    }, []);

    useEffect(() => {
        newTagInput.current.addEventListener("keypress", addKeyword);
        return () =>
            newTagInput.current.removeEventListener("keypress", addKeyword);
    }, [keywords]);

    const addKeyword = async (e: any) => {
        console.log(e.key);
        if (e.key === "Enter") {
            let keyword = newTagInput.current.value;
            if (keyword.trim().length > 0 && keywords.indexOf(keyword) === -1) {
                if (keywords.length === 20) {
                    alert("키워드는 20개까지만 입력 가능합니다.");
                } else {
                    await setKeywords([...keywords, keyword]);
                }
            }
            newTagInput.current.value = "";
        }
    };

    const getCategories = async () => {
        const result = await axios.get(
            `${
                config.baseurl
            }/member/getCategories?userkey=${sessionStorage.getItem(
                "UserKey"
            )}`,
            { headers: { Authorization: config.apikey } }
        );
        if (result.status === 200) {
            setCategories(result.data.body.Categories);
        }
    };

    const getPostDetail = async () => {
        try {
            let result = await axios.get(
                `${config.baseurl}/post/detail/${params.postKey}?userkey=${
                    sessionStorage.getItem("UserKey")
                        ? sessionStorage.getItem("UserKey")
                        : -1
                }`,
                { headers: { Authorization: config.apikey } }
            );
            if (result.status === 200) {
                if (!result.data.data.isOwner) {
                    alert("본인이 작성한 글만 수정 가능합니다.");
                    window.location.href = `/blog/${result.data.data.UserId}/detail/${params.postKey}`;
                }
                setPost(result.data.data);
            }
        } catch (err) {
            console.log(err);
            alert("잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div className="new-post-wrap">
            <div className="new-post-top">
                <select defaultValue="">
                    <option value="" disabled style={{ display: "none" }}>
                        카테고리
                    </option>
                    {categories.length === 0 && (
                        <option value="">카테고리 없음</option>
                    )}
                    {categories.map((category, index) => (
                        <option value={category} key={index}>
                            {category}
                        </option>
                    ))}
                </select>
                <input type="text" placeholder="제목을 입력해주세요." />
            </div>
            <div className="new-post-content">
                <textarea></textarea>
            </div>
            <div className="new-post-tags">
                {keywords.map((keyword) => (
                    <span className="new-post-keyword">
                        <FaHashtag size={14} />
                        <span>{keyword}</span>
                        <FaTimes
                            size={14}
                            onClick={() =>
                                setKeywords(
                                    keywords.filter((k) => k !== keyword)
                                )
                            }
                        />
                    </span>
                ))}
                <div className="new-post-new-tag">
                    <FaHashtag size={14} />
                    <input
                        type="text"
                        className="new-post-tag-input"
                        placeholder="키워드 입력"
                        ref={newTagInput}
                    />
                </div>
            </div>
            <div className="new-post-button-wrap">
                <button>등록</button>
            </div>
        </div>
    );
};

export default NewPost;
