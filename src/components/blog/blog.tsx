import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import config from "../../config/config.json";

import "./blog.scss";

interface post {
    Title: String;
    Description: String;
    Category: String;
    Replys: Number;
    Created: String;
    Likes: Number;
}

const Post: Function = (props: post) => {
    return (
        <div className="post">
            <div className="post-title">{props.Title}</div>
            <div className="post-info">
                <div className="post-created">
                    {props.Created.split("T")[0]}
                </div>
                <div className="post-comments">{props.Replys.toString()}</div>
                <div className="post-likes">{props.Likes.toString()}</div>
            </div>
            <div className="post-description">{props.Description}</div>
        </div>
    );
};

const Blog: Function = () => {
    const owner = useParams().userid;

    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([] as post[]);

    const getPostList = async () => {
        const result = await axios.get(
            `${config.baseurl}/post/list/${owner}?page=${page}`,
            { headers: { Authorization: config.apikey } }
        );
        setPosts(result.data.data);
    };

    useEffect(() => {
        getPostList();
    }, []);

    return (
        <div className="blog-wrap">
            <div className="nav-left">
                <div className="nav-left-profile">
                    <p className="name">{sessionStorage.getItem("Name")}</p>
                    <p className="email">{sessionStorage.getItem("Email")}</p>
                </div>
                <div className="nav-left-list">
                    <div>
                        <div className="nav-left-list-title">
                            <h3>블로그 관리</h3>
                        </div>
                        <ul>
                            <a href="/mypage/configBlog">
                                <li>블로그 설정</li>
                            </a>
                        </ul>
                    </div>
                    <div>
                        <div className="nav-left-list-title">
                            <h3>계정 관리</h3>
                        </div>
                        <ul>
                            <a href="/mypage/modifyUser">
                                <li>회원정보 수정</li>
                            </a>
                            <a href="/mypage/modifyPassword">
                                <li>비밀번호 변경</li>
                            </a>
                            <a href="/mypage/removeAccount">
                                <li>회원탈퇴</li>
                            </a>
                        </ul>
                    </div>
                </div>
            </div>
            <h1>Blog</h1>
            <h3>{owner}</h3>
            <ul>
                {posts.map((item, id) => (
                    <li key={id}>
                        <Post {...item} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Blog;
