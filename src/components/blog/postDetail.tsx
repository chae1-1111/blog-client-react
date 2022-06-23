import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa";

import config from "../../config/config.json";

interface PropsType {
    postKey: number;
    isOwner: boolean;
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
}

interface reply {
    Content: string;
    Deleted: boolean;
    Group: number;
    Name: string;
    ReplyKey: number;
    UserId: string;
    isWriter: boolean;
}

const PostDetail: Function = (props: PropsType) => {
    const [post, setPost] = useState({} as postProps);
    const [replys, setReplys] = useState([] as reply[]);
    const [replyLength, setReplyLength] = useState(0);

    useEffect(() => {
        getPostDetail();
        getReplyList();
    }, []);

    const newReplyContent =
        useRef() as React.MutableRefObject<HTMLTextAreaElement>;
    const replyButton = useRef() as React.MutableRefObject<HTMLAnchorElement>;

    const getPostDetail = async () => {
        try {
            let result = await axios.get(
                `${config.baseurl}/post/detail/${props.postKey}`,
                { headers: { Authorization: config.apikey } }
            );
            if (result.status === 200) {
                setPost(result.data.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getReplyList = async () => {
        try {
            let result = await axios.get(
                `${config.baseurl}/post/reply?postkey=${
                    props.postKey
                }&userkey=${sessionStorage.getItem("UserKey")}`,
                { headers: { Authorization: config.apikey } }
            );
            setReplys(result.data.data);
        } catch (err) {
            alert("잠시 후 다시 시도해주세요.");
            console.log(err);
        }
    };

    const newReply = async () => {
        let content = newReplyContent.current.value;
        if (content.trim().length === 0) {
            alert("댓글 내용을 작성해주세요");
            newReplyContent.current.focus();
            return;
        } else if (content.length > 1000) {
            alert("댓글은 최대 1000자까지만 입력해주세요");
            return;
        }
        try {
            let result = await axios.post(
                `${config.baseurl}/post/reply`,
                {
                    userkey: sessionStorage.getItem("UserKey"),
                    postkey: props.postKey,
                    content: newReplyContent.current.value,
                },
                { headers: { Authorization: config.apikey } }
            );
            if (result.status === 200) {
                await getReplyList();
            }
        } catch (err) {
            console.log(err);
            alert("잠시 후 다시 시도해주세요.");
        }
    };

    const replyEvent = () => {
        replyButton.current.className =
            newReplyContent.current.value.trim().length !== 0
                ? "post-reply-submit active"
                : "post-reply-submit";
        setReplyLength(newReplyContent.current.value.length);
    };

    return (
        <div className="post-detail">
            {post.Title && (
                <>
                    <div className="post-top-area">
                        <a className="post-Category" href="#">
                            {post.Category + " >"}
                        </a>
                        <div className="post-title">{post.Title}</div>
                        <div className="post-info">
                            <span className="post-name">{post.Name}</span>
                            <span className="post-created">
                                {post.Created.split("T")[0] +
                                    " " +
                                    post.Created.split("T")[1].substring(0, 5)}
                            </span>
                        </div>
                    </div>
                    <div className="post-description">{post.Description}</div>
                    <div className="post-keywords">
                        {post.Keyword.map((keyword, index) => (
                            <span className="post-keyword" key={index}>
                                {"#" + keyword}
                            </span>
                        ))}
                    </div>
                    <div className="post-reply-info">
                        <div className="post-reaction">
                            <div className="post-like">
                                {post.isLiker ? (
                                    <FaHeart className="icon-like" size={20} />
                                ) : (
                                    <FaRegHeart
                                        className="icon-like"
                                        size={20}
                                    />
                                )}
                                <span>좋아요</span>
                                <span className="number-likes">
                                    {post.Likes}
                                </span>
                            </div>
                            <div className="post-reply">
                                <FaRegComment
                                    className="icon-reply"
                                    size={20}
                                />
                                <span>댓글</span>
                                <span className="number-reply">
                                    {post.Replys}
                                </span>
                            </div>
                        </div>
                        <div className="post-reply-wrap">
                            <p className="post-reply-list-title">댓글</p>
                            <div className="post-reply-input-wrap">
                                <div className="post-reply-input-content">
                                    <span className="post-reply-input-name">
                                        {sessionStorage.getItem("Name")}
                                    </span>
                                    <span
                                        className={`post-reply-length ${
                                            replyLength === 0 ? " none" : ""
                                        }`}
                                    >
                                        <span
                                            className={
                                                replyLength > 1000
                                                    ? "toolong"
                                                    : ""
                                            }
                                        >
                                            {replyLength}
                                        </span>
                                        /1000
                                    </span>
                                    <textarea
                                        className="post-reply-input"
                                        placeholder="댓글을 남겨보세요."
                                        ref={newReplyContent}
                                        onChange={() => replyEvent()}
                                    ></textarea>
                                </div>
                                <a
                                    className="post-reply-submit"
                                    onClick={() => newReply()}
                                    ref={replyButton}
                                >
                                    등록
                                </a>
                            </div>
                            <div className="post-reply-list">
                                {replys
                                    .filter((r) => r.Group === props.postKey)
                                    .map((reply) => "")}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PostDetail;
