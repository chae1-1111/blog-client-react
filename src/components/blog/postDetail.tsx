import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa";

import config from "../../config/config.json";

interface PropsType {
    postKey: number;
    isOwner: boolean;
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
}

interface reply {
    Content: string;
    Deleted: boolean;
    Group: number;
    Name: string;
    ReplyKey: number;
    UserId: string;
    isWriter: boolean;
    Created: string;
}

const PostDetail: Function = (props: PropsType) => {
    const [post, setPost] = useState({} as postProps);
    const [replys, setReplys] = useState([] as reply[]);
    const [replyLength, setReplyLength] = useState(0);
    const [replyEditLength, setReplyEditLength] = useState(0);
    const [editReplyKey, setEditReplyKey] = useState(-1);
    const [likeButtonActive, setLikeButtonActive] = useState(!props.isLogin);

    useEffect(() => {
        getPostDetail();
        getReplyList();
    }, []);

    const newReplyContent =
        useRef() as React.MutableRefObject<HTMLTextAreaElement>;
    const replyEditContent =
        useRef() as React.MutableRefObject<HTMLTextAreaElement>;
    const replyButton = useRef() as React.MutableRefObject<HTMLAnchorElement>;
    const replyEditButton =
        useRef() as React.MutableRefObject<HTMLAnchorElement>;

    const getPostDetail = async () => {
        try {
            let result = await axios.get(
                `${config.baseurl}/post/detail/${props.postKey}?userkey=${
                    sessionStorage.getItem("UserKey")
                        ? sessionStorage.getItem("UserKey")
                        : -1
                }`,
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
                    content: content,
                },
                { headers: { Authorization: config.apikey } }
            );
            if (result.status === 200) {
                await getReplyList();
                newReplyContent.current.value = "";
                setReplyLength(0);
            }
        } catch (err) {
            console.log(err);
            alert("잠시 후 다시 시도해주세요.");
        }
    };

    const editReply = async () => {
        let content = replyEditContent.current.value;
        if (content.trim().length === 0) {
            alert("댓글 내용을 작성해주세요");
            replyEditContent.current.focus();
            return;
        } else if (content.length > 1000) {
            alert("댓글은 최대 1000자까지만 입력해주세요");
            replyEditContent.current.focus();
            return;
        } else if (!window.confirm("댓글을 수정하시겠습니까?")) {
            replyEditContent.current.focus();
            return;
        }
        try {
            let result = await axios.put(
                `${config.baseurl}/post/reply`,
                {
                    userkey: sessionStorage.getItem("UserKey"),
                    postkey: props.postKey,
                    content: content,
                    replykey: editReplyKey,
                },
                { headers: { Authorization: config.apikey } }
            );
            if (result.status === 200) {
                await getReplyList();
                replyEditContent.current.value = "";
                setReplyEditLength(0);
                setEditReplyKey(-1);
            }
        } catch (err) {
            console.log(err);
            alert("잠시 후 다시 시도해주세요.");
        }
    };

    const deleteReply = async (replykey: number) => {
        if (!window.confirm("정말로 삭제하시겠습니까?")) {
            return;
        }
        try {
            let result = await axios.delete(`${config.baseurl}/post/reply`, {
                data: {
                    userkey: sessionStorage.getItem("UserKey"),
                    postkey: props.postKey,
                    replykey: replykey,
                },
                headers: { Authorization: config.apikey },
            });
            console.log(result);
            if (result.status === 200) {
                await getReplyList();
                alert("삭제 되었습니다.");
            }
        } catch (err) {
            console.log(err);
            alert("잠시 후 다시 시도해주세요.");
        }
    };

    const likePost = async () => {
        try {
            await setLikeButtonActive(true);
            let result = await axios.put(
                `${config.baseurl}/post/like`,
                {
                    postkey: props.postKey,
                    userkey: sessionStorage.getItem("UserKey"),
                    like: post.isLiker ? "unlike" : "like",
                },
                { headers: { Authorization: config.apikey } }
            );
            console.log(result);
            if (result.status === 200) {
                await getPostDetail();
                await setLikeButtonActive(false);
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

    const replyEditEvent = () => {
        replyEditButton.current.className =
            replyEditContent.current.value.trim().length !== 0
                ? "post-reply-submit active"
                : "post-reply-submit";
        setReplyEditLength(replyEditContent.current.value.length);
    };

    const dateFormatter = (d: string) => {
        let date = new Date(d);
        return `${date.getFullYear()}.${date.getMonth()}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    };

    return (
        <div className="post-detail">
            {post.Title && (
                <>
                    <div className="post-top-area">
                        <a
                            className="post-Category"
                            href={`/blog/${post.UserId}/${post.Category}`}
                        >
                            {post.Category + " >"}
                        </a>
                        <div className="post-title">{post.Title}</div>
                        <div className="post-info">
                            <a
                                className="post-name"
                                href={`/blog/${post.UserId}`}
                            >
                                {post.Name}
                            </a>
                            <span className="post-created">
                                {dateFormatter(post.Created)}
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
                                    <button
                                        disabled={likeButtonActive}
                                        onClick={() => likePost()}
                                    >
                                        <FaHeart
                                            className="icon-like"
                                            size={20}
                                        />
                                    </button>
                                ) : (
                                    <button
                                        disabled={likeButtonActive}
                                        onClick={() => likePost()}
                                    >
                                        <FaRegHeart
                                            className="icon-like"
                                            size={20}
                                        />
                                    </button>
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
                                    {replys.filter((r) => !r.Deleted).length}
                                </span>
                            </div>
                        </div>
                        <div className="post-reply-wrap">
                            <p className="post-reply-list-title">댓글</p>
                            {props.isLogin ? (
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
                            ) : (
                                <div className="post-reply-input-wrap go-login">
                                    <p>댓글을 남기려면 로그인이 필요합니다.</p>
                                    <a href="/login">로그인 하러가기 &gt;</a>
                                </div>
                            )}
                            <div className="post-reply-list">
                                {replys
                                    .filter((r) => r.Group === props.postKey)
                                    .map((reply, index) =>
                                        !reply.Deleted ? (
                                            reply.ReplyKey !== editReplyKey ? (
                                                <div
                                                    className="post-reply"
                                                    key={index}
                                                >
                                                    <div className="post-reply-top">
                                                        <a
                                                            href={`/blog/${reply.UserId}`}
                                                            className="post-reply-name"
                                                        >
                                                            {reply.Name}
                                                        </a>
                                                        <div className="post-reply-actions">
                                                            {reply.isWriter ? (
                                                                <>
                                                                    <span
                                                                        className="post-reply-action edit"
                                                                        onClick={async () => {
                                                                            await setEditReplyKey(
                                                                                reply.ReplyKey
                                                                            );
                                                                            await replyEditEvent();
                                                                            replyEditContent.current.focus();
                                                                        }}
                                                                    >
                                                                        수정
                                                                    </span>
                                                                    <span
                                                                        className="post-reply-action delete"
                                                                        onClick={() =>
                                                                            deleteReply(
                                                                                reply.ReplyKey
                                                                            )
                                                                        }
                                                                    >
                                                                        삭제
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="post-reply-action report">
                                                                    신고
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="post-reply-content">
                                                        {reply.Content}
                                                    </p>
                                                    <p className="post-reply-created">
                                                        {dateFormatter(
                                                            reply.Created
                                                        )}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div
                                                    className="post-reply"
                                                    key={index}
                                                >
                                                    <div className="post-reply-edit-wrap">
                                                        <div className="post-reply-input-content">
                                                            <span className="post-reply-input-name">
                                                                {sessionStorage.getItem(
                                                                    "Name"
                                                                )}
                                                            </span>
                                                            <span
                                                                className={`post-reply-length ${
                                                                    replyEditLength ===
                                                                    0
                                                                        ? " none"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <span
                                                                    className={
                                                                        replyEditLength >
                                                                        1000
                                                                            ? "toolong"
                                                                            : ""
                                                                    }
                                                                >
                                                                    {
                                                                        replyEditLength
                                                                    }
                                                                </span>
                                                                /1000
                                                            </span>
                                                            <textarea
                                                                className="post-reply-input"
                                                                placeholder="댓글을 남겨보세요."
                                                                ref={
                                                                    replyEditContent
                                                                }
                                                                onChange={() =>
                                                                    replyEditEvent()
                                                                }
                                                                defaultValue={
                                                                    reply.Content
                                                                }
                                                            ></textarea>
                                                        </div>
                                                        <a
                                                            className="post-reply-submit"
                                                            onClick={() => {
                                                                editReply();
                                                            }}
                                                            ref={
                                                                replyEditButton
                                                            }
                                                        >
                                                            등록
                                                        </a>
                                                    </div>
                                                </div>
                                            )
                                        ) : replys.filter(
                                              (r) =>
                                                  r.Group.toString() ===
                                                  "R" + reply.ReplyKey
                                          ).length === 0 ? null : (
                                            <div className="post-reply">
                                                <p className="deleted">
                                                    삭제된 댓글입니다.
                                                </p>
                                            </div>
                                        )
                                    )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PostDetail;
