import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";

import config from "../../config/config.json";

import {
    FaHeart,
    FaPlus,
    FaRegCalendarAlt,
    FaRegComment,
    FaAngleDoubleLeft,
    FaAngleLeft,
    FaAngleDoubleRight,
    FaAngleRight,
} from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { TbNotes, TbSettings, TbEqual } from "react-icons/tb";

import "./blog.scss";
import PostDetail from "./postDetail";

interface post {
    Title: string;
    Description: string;
    Category: string;
    Replys: number;
    Created: string;
    Likes: number;
    PostKey: number;
}

interface postProps {
    post: post;
    userid: string;
}

const Post: Function = (props: postProps) => {
    const dateFormatter = (d: string) => {
        let date = new Date(d);
        return `${date.getFullYear()}.${date
            .getMonth()
            .toString()
            .padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
    };

    return (
        <div className="post">
            <div className="post-title">
                <a href={`/blog/${props.userid}/detail/${props.post.PostKey}`}>
                    {props.post.Title}
                </a>
            </div>
            <div className="post-info">
                <div className="post-created">
                    <FaRegCalendarAlt />
                    <span>{dateFormatter(props.post.Created)}</span>
                </div>
                <div className="post-comments">
                    <FaRegComment />
                    <span>{props.post.Replys.toString()}</span>
                </div>
                <div className="post-likes">
                    <FaHeart />
                    <span>{props.post.Likes.toString()}</span>
                </div>
            </div>
            <div className="post-description">
                <a href={`/blog/${props.userid}/detail/${props.post.PostKey}`}>
                    {props.post.Description}
                </a>
            </div>
        </div>
    );
};

interface BlogInfo {
    Name?: String;
    Email?: String;
    CategoryInfo?: {
        Total: number;
        eachCategory: [{ Category: string; Count: number }?];
    };
    ProfileImage?: String;
}

interface BlogProps {
    isLogin: boolean;
}

const Blog: Function = (props: BlogProps) => {
    const params = useParams();

    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([] as post[]);
    const [blogInfo, setBlogInfo] = useState({} as BlogInfo);
    const [isOwner, setIsOwner] = useState(false);
    const [category, setCategory] = useState(
        params.category ? params.category : ""
    );
    const [postKey, setPostKey] = useState(
        params.postkey ? parseInt(params.postkey) : -1
    );

    const [pages, setPages] = useState([] as number[]);

    const categoryList = useRef() as React.MutableRefObject<HTMLDivElement>;

    const getPostList = async () => {
        let userkey = sessionStorage.getItem("UserKey");

        const result = await axios.get(
            `${config.baseurl}/post/list/${params.userid}?page=${page}&category=${category}` +
                (userkey ? `&userkey=${userkey}` : ""),
            { headers: { Authorization: config.apikey } }
        );
        setPosts(result.data.data);
    };

    const getBlogInfo = async () => {
        try {
            let result = await axios.get(
                `${config.baseurl}/member/getBlogInfo?userid=${
                    params.userid
                }&userkey=${
                    sessionStorage.getItem("UserKey")
                        ? sessionStorage.getItem("UserKey")
                        : -1
                }`,
                { headers: { Authorization: config.apikey } }
            );

            if (result.status === 200) {
                setBlogInfo({
                    Name: result.data.body.Name,
                    Email: result.data.body.Email,
                    CategoryInfo: result.data.body.CategoryInfo,
                    ProfileImage:
                        result.data.body.ProfileImage === ""
                            ? result.data.body.ProfileImage
                            : new Buffer(
                                  result.data.body.ProfileImage.data
                              ).toString("base64"),
                });
                setIsOwner(result.data.body.isOwner);
            } else if (result.status === 201) {
                alert("???????????? ?????? ??????????????????.");
                window.location.href = "/";
            }
        } catch (err) {
            console.log(err);
            alert("?????? ??? ?????? ??????????????????.");
        }
    };

    const setArrPages = () => {
        let array = [];
        let len: number = (blogInfo.CategoryInfo &&
            (category === ""
                ? blogInfo.CategoryInfo.Total
                : blogInfo.CategoryInfo.eachCategory.filter(
                      (c) => c?.Category === category
                  )[0]!.Count)) as number;
        for (let i = 0; i < Math.ceil(len / 10); i++) {
            array.push(i + 1);
        }
        setPages(array);
    };

    useEffect(() => {
        getBlogInfo();
    }, []);

    useEffect(() => {
        postKey === -1 && getPostList();
    }, [category, page, postKey]);

    useEffect(() => {
        postKey === -1 && setArrPages();
    }, [blogInfo, category]);

    return (
        <div className="blog-wrap">
            <div className="nav-left">
                <div className="nav-left-profile">
                    <div className="profile-image">
                        {blogInfo.ProfileImage &&
                        blogInfo.ProfileImage !== "" ? (
                            <img
                                className="image"
                                src={
                                    "data:image/*;base64," +
                                    blogInfo.ProfileImage
                                }
                            />
                        ) : (
                            <AiOutlineUser className="image" />
                        )}
                    </div>
                    <div className="name-wrap">
                        <p className="name">{blogInfo.Name}</p>
                        <p className="email">{blogInfo.Email}</p>
                    </div>
                    <TbEqual
                        className="category-menu"
                        size={30}
                        onClick={() => {
                            categoryList.current.style.display =
                                categoryList.current.style.display == "flex"
                                    ? "none"
                                    : "flex";
                        }}
                    />
                </div>
                {isOwner && (
                    <a className="nav-left-newPost" href="/newPost">
                        <FaPlus />??? ?????? ??????
                    </a>
                )}
                <div className="nav-left-list" ref={categoryList}>
                    <div>
                        <ul>
                            <li className="sub-title">
                                <span>????????????</span>
                                {isOwner && (
                                    <a href="/mypage/configCategory">
                                        <TbSettings size={18} />
                                    </a>
                                )}
                            </li>
                            <li>
                                <a href={`/blog/${params.userid}`}>
                                    <TbNotes />
                                    {`?????? ??? ?????? (${
                                        blogInfo.CategoryInfo
                                            ? blogInfo.CategoryInfo.Total
                                            : 0
                                    })`}
                                </a>
                            </li>
                            {blogInfo.CategoryInfo &&
                                blogInfo.CategoryInfo.eachCategory.map(
                                    (obj: any, index: number) => (
                                        <li key={index}>
                                            <a
                                                href={`/blog/${params.userid}/${obj.Category}`}
                                            >
                                                <TbNotes />
                                                {obj.Category +
                                                    ` (${obj.Count})`}
                                            </a>
                                        </li>
                                    )
                                )}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="blog-content-wrap">
                {postKey === -1 ? (
                    <div className="blog-content">
                        <div className="category-title-wrap">
                            <h2>
                                {category === "" ? "?????? ??? ??????" : category}
                            </h2>
                            {isOwner && (
                                <a className="nav-left-newPost" href="/newPost">
                                    <FaPlus />
                                    ?????????
                                </a>
                            )}
                        </div>
                        <ul className="post-list">
                            {posts.length === 0 && (
                                <div className="no-result">
                                    <p>???????????? ???????????? ????????????.</p>
                                    {isOwner && (
                                        <a href="/newPost">????????? ?????? &gt;</a>
                                    )}
                                </div>
                            )}
                            {posts.map((item, id) => (
                                <li key={id}>
                                    <Post post={item} userid={params.userid} />
                                </li>
                            ))}
                        </ul>
                        {pages.length !== 0 && (
                            <ul className="pages">
                                <li>
                                    <a href="#none" onClick={() => setPage(1)}>
                                        <FaAngleDoubleLeft />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#none"
                                        onClick={() =>
                                            page - 1 !== 0 && setPage(page - 1)
                                        }
                                    >
                                        <FaAngleLeft />
                                    </a>
                                </li>
                                {pages.map((p, id) => (
                                    <li
                                        className={page === p ? "active" : ""}
                                        key={id}
                                    >
                                        <a href="#" onClick={() => setPage(p)}>
                                            {p}
                                        </a>
                                    </li>
                                ))}
                                <li>
                                    <a
                                        href="#none"
                                        onClick={() =>
                                            pages.indexOf(page + 1) !== -1 &&
                                            setPage(page + 1)
                                        }
                                    >
                                        <FaAngleRight />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#none"
                                        onClick={() => setPage(pages.length)}
                                    >
                                        <FaAngleDoubleRight />
                                    </a>
                                </li>
                            </ul>
                        )}
                    </div>
                ) : (
                    blogInfo.Name && (
                        <div className="blog-content">
                            <PostDetail
                                postKey={postKey}
                                isOwner={isOwner}
                                isLogin={props.isLogin}
                                userid={params.userid}
                            />
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Blog;
