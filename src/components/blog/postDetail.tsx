import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Buffer } from "buffer";

import { FaRegHeart, FaHeart, FaRegComment, FaEllipsisV } from "react-icons/fa";
import { BsArrowReturnRight } from "react-icons/bs";

import config from "../../config/config.json";

interface PropsType {
    postKey: number;
    userid: string;
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
    ProfileImage: string;
}

interface reply {
    Content: string;
    Deleted: boolean;
    Group: string;
    Name: string;
    ReplyKey: number;
    UserId: string;
    isWriter: boolean;
    Created: string;
    ProfileImage: string;
}

const PostDetail: Function = (props: PropsType) => {
    const [post, setPost] = useState({} as postProps);
    const [replys, setReplys] = useState([] as reply[]);
    const [replyLength, setReplyLength] = useState(0);
    const [replyEditLength, setReplyEditLength] = useState(0);
    const [nestedReplyLength, setNestedReplyLength] = useState(0);
    const [editReplyKey, setEditReplyKey] = useState(-1);
    const [nestedReplyKey, setNestedReplyKey] = useState(-1);
    const [likeButtonActive, setLikeButtonActive] = useState(!props.isLogin);
    const [postMenuActive, setPostMenuActive] = useState(false);

    useEffect(() => {
        getPostDetail();
        getReplyList();
        incViews();
    }, []);

    useEffect(() => {
        const checkIfClickedOutside = (e: any) => {
            if (
                postMenuActive &&
                postMenu.current &&
                !postMenu.current.contains(e.target)
            ) {
                setPostMenuActive(false);
            }
        };

        document.addEventListener("mouseup", checkIfClickedOutside);

        return () => {
            document.removeEventListener("mouseup", checkIfClickedOutside);
        };
    }, [postMenuActive]);

    const newReplyContent =
        useRef() as React.MutableRefObject<HTMLTextAreaElement>;
    const replyEditContent =
        useRef() as React.MutableRefObject<HTMLTextAreaElement>;
    const nestedReplyContent =
        useRef() as React.MutableRefObject<HTMLTextAreaElement>;
    const replyButton = useRef() as React.MutableRefObject<HTMLAnchorElement>;
    const replyEditButton =
        useRef() as React.MutableRefObject<HTMLAnchorElement>;
    const nestedReplyButton =
        useRef() as React.MutableRefObject<HTMLAnchorElement>;
    const postMenu = useRef() as React.MutableRefObject<HTMLDivElement>;

    const incViews = async () => {
        try {
            let result = await axios.put(
                `${config.baseurl}/post/incViews`,
                { postkey: props.postKey },
                { headers: { Authorization: config.apikey } }
            );
        } catch (err) {
            console.log(err);
            alert("잠시 후 다시 시도해주세요.");
        }
    };

    const getPostDetail = async () => {
        try {
            let result = await axios.get(
                `${config.baseurl}/post/detail/${props.postKey}?userkey=${
                    sessionStorage.getItem("UserKey")
                        ? sessionStorage.getItem("UserKey")
                        : -1
                }&userid=${props.userid}`,
                { headers: { Authorization: config.apikey } }
            );
            if (result.status === 200) {
                if (!result.data.data.Title) {
                    alert("존재하지 않는 게시글입니다.");
                    window.location.href = `/blog/${props.userid}`;
                }
                setPost({
                    ...result.data.data,
                    ProfileImage:
                        result.data.data.profileImage === ""
                            ? result.data.data.profileImage
                            : new Buffer(
                                  result.data.data.profileImage.data
                              ).toString("base64"),
                });
            }
        } catch (err) {
            console.log(err);
            alert("잠시 후 다시 시도해주세요.");
        }
    };

    const removePost = async () => {
        if (
            !window.confirm(
                "게시글 삭제 시 복원이 불가능합니다.\n정말로 삭제하시겠습니까?"
            )
        ) {
            return;
        }
        try {
            let result = await axios.delete(`${config.baseurl}/post`, {
                data: {
                    userkey: sessionStorage.getItem("UserKey"),
                    postkey: props.postKey,
                },
                headers: { Authorization: config.apikey },
            });
            if (result.status === 200) {
                alert("게시글이 삭제되었습니다.");
                window.location.href = `/blog/${post.UserId}`;
            } else if (result.status === 201) {
                alert("일치하는 정보가 존재하지 않습니다.");
            }
        } catch (err) {
            console.log(err);
            alert("잠시 후 다시 시도해주세요.");
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
            let temp = [] as reply[];
            for (const reply of result.data.data) {
                temp.push({
                    ...reply,
                    ProfileImage:
                        !reply.profileImage && reply.profileImage === ""
                            ? reply.profileImage
                            : new Buffer(reply.profileImage.data).toString(
                                  "base64"
                              ),
                });
            }
            setReplys(temp);
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
                    group: props.postKey,
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

    const newNestedReply = async () => {
        let content = nestedReplyContent.current.value;
        if (content.trim().length === 0) {
            alert("답글 내용을 작성해주세요");
            nestedReplyContent.current.focus();
            return;
        } else if (content.length > 1000) {
            alert("답글은 최대 1000자까지만 입력해주세요");
            return;
        }
        try {
            let result = await axios.post(
                `${config.baseurl}/post/reply`,
                {
                    userkey: sessionStorage.getItem("UserKey"),
                    postkey: props.postKey,
                    group: "reply" + nestedReplyKey,
                    content: content,
                },
                { headers: { Authorization: config.apikey } }
            );
            if (result.status === 200) {
                await getReplyList();
                nestedReplyContent.current.value = "";
                await setReplyLength(0);
                await setNestedReplyKey(-1);
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

    const nestedReplyEvent = () => {
        nestedReplyButton.current.className =
            nestedReplyContent.current.value.trim().length !== 0
                ? "post-reply-submit active"
                : "post-reply-submit";
        setNestedReplyLength(nestedReplyContent.current.value.length);
    };

    const hideReplyEdit = (e: any) => {
        if (e.key === "Escape") {
            setEditReplyKey(-1);
        }
    };

    const hideNestedReply = (e: any) => {
        if (e.key === "Escape") {
            setNestedReplyKey(-1);
        }
    };

    const dateTimeFormatter = (d: string) => {
        let date = new Date(d);
        return `${date.getFullYear()}.${date
            .getMonth()
            .toString()
            .padStart(2, "0")}.${date
            .getDate()
            .toString()
            .padStart(2, "0")} ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
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
                            <div className="post-profile">
                                <a href={`/blog/${post.UserId}`}>
                                    <img
                                        className="image"
                                        src={
                                            "data:image/*;base64," +
                                            post.ProfileImage
                                        }
                                    />
                                </a>
                                <div className="post-profile-right">
                                    <a className="post-name">{post.Name}</a>
                                    <span className="post-created">
                                        {dateTimeFormatter(post.Created)}
                                    </span>
                                </div>
                            </div>
                            <div className="post-menu">
                                <FaEllipsisV
                                    onClick={() => setPostMenuActive(true)}
                                />
                                <div
                                    className={`post-menu-list ${
                                        !postMenuActive && "hidden"
                                    }`}
                                    ref={postMenu}
                                >
                                    {props.isOwner && (
                                        <>
                                            <a
                                                href={`/newPost/${props.postKey}`}
                                            >
                                                수정
                                            </a>
                                            <a onClick={() => removePost()}>
                                                삭제
                                            </a>
                                        </>
                                    )}
                                    <a>신고</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="post-description">
                        {post.Description.split("\n").map((line, index) => (
                            <p key={index}>
                                {line}
                                <br />
                            </p>
                        ))}
                    </div>
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
                        <div className="post-replys-wrap">
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
                                    .filter(
                                        (r) =>
                                            r.Group === props.postKey.toString()
                                    )
                                    .map((reply, index) => (
                                        <div key={index}>
                                            {!reply.Deleted ? (
                                                <div className="post-reply-wrap">
                                                    {reply.ReplyKey !==
                                                    editReplyKey ? (
                                                        <div className="post-reply">
                                                            <a
                                                                href={`/blog/${reply.UserId}`}
                                                            >
                                                                <img
                                                                    className="image"
                                                                    src={
                                                                        "data:image/*;base64," +
                                                                        reply.ProfileImage
                                                                    }
                                                                />
                                                            </a>
                                                            <div className="post-reply">
                                                                <div className="post-reply-top">
                                                                    <a
                                                                        href={`/blog/${reply.UserId}`}
                                                                        className="post-reply-name"
                                                                    >
                                                                        {
                                                                            reply.Name
                                                                        }
                                                                    </a>
                                                                    <div className="post-reply-actions">
                                                                        {props.isLogin && (
                                                                            <span
                                                                                className="post-reply-action nested-reply"
                                                                                onClick={async () => {
                                                                                    await setNestedReplyKey(
                                                                                        reply.ReplyKey
                                                                                    );
                                                                                    await nestedReplyContent.current.addEventListener(
                                                                                        "keydown",
                                                                                        hideNestedReply
                                                                                    );
                                                                                    nestedReplyContent.current.focus();
                                                                                }}
                                                                            >
                                                                                답글
                                                                            </span>
                                                                        )}
                                                                        {reply.isWriter ? (
                                                                            <>
                                                                                <span
                                                                                    className="post-reply-action edit"
                                                                                    onClick={async () => {
                                                                                        await setEditReplyKey(
                                                                                            reply.ReplyKey
                                                                                        );
                                                                                        await replyEditEvent();
                                                                                        await replyEditContent.current.addEventListener(
                                                                                            "keydown",
                                                                                            hideReplyEdit
                                                                                        );
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
                                                                <div className="post-reply-content">
                                                                    {reply.Content.split(
                                                                        "\n"
                                                                    ).map(
                                                                        (
                                                                            line,
                                                                            index
                                                                        ) => (
                                                                            <p
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {
                                                                                    line
                                                                                }
                                                                                <br />
                                                                            </p>
                                                                        )
                                                                    )}
                                                                </div>
                                                                <p className="post-reply-created">
                                                                    {dateTimeFormatter(
                                                                        reply.Created
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="post-reply">
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
                                                    )}
                                                </div>
                                            ) : replys.filter(
                                                  (r) =>
                                                      r.Group.toString() ===
                                                          "reply" +
                                                              reply.ReplyKey &&
                                                      !r.Deleted
                                              ).length === 0 ? null : (
                                                <div
                                                    className="post-reply-wrap"
                                                    key={index}
                                                >
                                                    <p className="deleted">
                                                        삭제된 댓글입니다.
                                                    </p>
                                                </div>
                                            )}
                                            {replys
                                                .filter(
                                                    (r) =>
                                                        r.Group.toString() ===
                                                            "reply" +
                                                                reply.ReplyKey &&
                                                        !r.Deleted
                                                )
                                                .map((nestedReply, index) => (
                                                    <div
                                                        className="post-reply-wrap nested-reply-wrap"
                                                        key={index}
                                                    >
                                                        <BsArrowReturnRight
                                                            className="post-nested-reply-icon"
                                                            size={20}
                                                        />
                                                        {editReplyKey !==
                                                        nestedReply.ReplyKey ? (
                                                            <div className="post-reply">
                                                                <a
                                                                    href={`/blog/${nestedReply.UserId}`}
                                                                >
                                                                    <img
                                                                        className="image"
                                                                        src={
                                                                            "data:image/*;base64," +
                                                                            nestedReply.ProfileImage
                                                                        }
                                                                    />
                                                                </a>
                                                                <div className="post-reply">
                                                                    <div className="post-reply-top">
                                                                        <a
                                                                            href={`/blog/${nestedReply.UserId}`}
                                                                            className="post-reply-name"
                                                                        >
                                                                            {
                                                                                nestedReply.Name
                                                                            }
                                                                        </a>
                                                                        <div className="post-reply-actions">
                                                                            {nestedReply.isWriter ? (
                                                                                <>
                                                                                    <span
                                                                                        className="post-reply-action edit"
                                                                                        onClick={async () => {
                                                                                            await setEditReplyKey(
                                                                                                nestedReply.ReplyKey
                                                                                            );
                                                                                            await replyEditEvent();
                                                                                            await replyEditContent.current.addEventListener(
                                                                                                "keydown",
                                                                                                hideReplyEdit
                                                                                            );
                                                                                            replyEditContent.current.focus();
                                                                                        }}
                                                                                    >
                                                                                        수정
                                                                                    </span>
                                                                                    <span
                                                                                        className="post-reply-action delete"
                                                                                        onClick={() =>
                                                                                            deleteReply(
                                                                                                nestedReply.ReplyKey
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
                                                                    <div className="post-reply-content">
                                                                        {nestedReply.Content.split(
                                                                            "\n"
                                                                        ).map(
                                                                            (
                                                                                line,
                                                                                index
                                                                            ) => (
                                                                                <p
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        line
                                                                                    }
                                                                                    <br />
                                                                                </p>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                    <p className="post-reply-created">
                                                                        {dateTimeFormatter(
                                                                            nestedReply.Created
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="post-nested-reply-wrap">
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
                                                                        placeholder="답글을 남겨보세요."
                                                                        ref={
                                                                            replyEditContent
                                                                        }
                                                                        onChange={() =>
                                                                            replyEditEvent()
                                                                        }
                                                                        defaultValue={
                                                                            nestedReply.Content
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
                                                        )}
                                                    </div>
                                                ))}
                                            {reply.ReplyKey ===
                                                nestedReplyKey && (
                                                <div className="post-nested-reply">
                                                    <BsArrowReturnRight
                                                        className="post-nested-reply-icon"
                                                        size={20}
                                                    />
                                                    <div className="post-nested-reply-wrap">
                                                        <div className="post-reply-input-content">
                                                            <span className="post-reply-input-name">
                                                                {sessionStorage.getItem(
                                                                    "Name"
                                                                )}
                                                            </span>
                                                            <span
                                                                className={`post-reply-length ${
                                                                    nestedReplyLength ===
                                                                    0
                                                                        ? " none"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <span
                                                                    className={
                                                                        nestedReplyLength >
                                                                        1000
                                                                            ? "toolong"
                                                                            : ""
                                                                    }
                                                                >
                                                                    {
                                                                        nestedReplyLength
                                                                    }
                                                                </span>
                                                                /1000
                                                            </span>
                                                            <textarea
                                                                className="post-reply-input"
                                                                placeholder="답글을 남겨보세요."
                                                                ref={
                                                                    nestedReplyContent
                                                                }
                                                                onChange={() =>
                                                                    nestedReplyEvent()
                                                                }
                                                            ></textarea>
                                                        </div>
                                                        <a
                                                            className="post-reply-submit"
                                                            onClick={() => {
                                                                newNestedReply();
                                                            }}
                                                            ref={
                                                                nestedReplyButton
                                                            }
                                                        >
                                                            등록
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PostDetail;
