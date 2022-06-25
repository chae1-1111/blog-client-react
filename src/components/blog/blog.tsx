import axios from "axios";
import { useEffect, useState } from "react";
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
import { TbNotes, TbSettings } from "react-icons/tb";

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
        return `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
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

    const getPostList = async () => {
        let userkey = sessionStorage.getItem("UserKey");

        const result = await axios.get(
            `${config.baseurl}/post/list/${params.userid}?page=${page}&category=${category}` +
                (userkey ? `&userkey=${userkey}` : ""),
            { headers: { Authorization: config.apikey } }
        );
        setPosts(result.data.data);
        setIsOwner(result.data.owner);
    };

    const getBlogInfo = async () => {
        try {
            let result = await axios.get(
                `${config.baseurl}/member/getBlogInfo?userid=${params.userid}`,
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
            } else if (result.status === 201) {
                alert("존재하지 않는 블로그입니다.");
                window.location.href = "/";
            }
        } catch (err) {
            console.log(err);
            alert("잠시 후 다시 시도해주세요.");
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
                    <p className="name">{blogInfo.Name}</p>
                    <p className="email">{blogInfo.Email}</p>
                </div>
                {isOwner && (
                    <a className="nav-left-newPost" href="/newPost">
                        <FaPlus />글 쓰러 가기
                    </a>
                )}
                <div className="nav-left-list">
                    <div>
                        <ul>
                            <li className="sub-title">
                                <span>카테고리</span>
                                {isOwner && (
                                    <a href="/mypage/configCategory">
                                        <TbSettings size={18} />
                                    </a>
                                )}
                            </li>
                            <a href={`/blog/${params.userid}`}>
                                <li>
                                    <TbNotes />
                                    {`전체 글 보기 (${
                                        blogInfo.CategoryInfo
                                            ? blogInfo.CategoryInfo.Total
                                            : 0
                                    })`}
                                </li>
                            </a>
                            {blogInfo.CategoryInfo &&
                                blogInfo.CategoryInfo.eachCategory.map(
                                    (obj: any, index: number) => (
                                        <a
                                            href={`/blog/${params.userid}/${obj.Category}`}
                                            key={index}
                                        >
                                            <li>
                                                <TbNotes />
                                                {obj.Category +
                                                    ` (${obj.Count})`}
                                            </li>
                                        </a>
                                    )
                                )}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="blog-content-wrap">
                {postKey === -1 ? (
                    <div className="blog-content">
                        <h2>{category === "" ? "전체 글 보기" : category}</h2>
                        <ul className="post-list">
                            {posts.map((item, id) => (
                                <li key={id}>
                                    <Post post={item} userid={params.userid} />
                                </li>
                            ))}
                        </ul>
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
