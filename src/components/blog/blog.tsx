import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";

import config from "../../config/config.json";

import { AiOutlineUser } from "react-icons/ai";

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

interface BlogInfo {
    Name?: String;
    Email?: String;
    Categories?: String[];
    ProfileImage?: String;
}

const Blog: Function = () => {
    const owner = useParams().userid;

    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([] as post[]);
    const [blogInfo, setBlogInfo] = useState({} as BlogInfo);

    const getPostList = async () => {
        const result = await axios.get(
            `${config.baseurl}/post/list/${owner}?page=${page}`,
            { headers: { Authorization: config.apikey } }
        );
        setPosts(result.data.data);
    };

    const getProfileImage = async () => {
        let result = await axios.get(
            `${config.baseurl}/member/getBlogInfo?userid=${owner}`,
            { headers: { Authorization: config.apikey } }
        );

        setBlogInfo({
            Name: result.data.body.Name,
            Email: result.data.body.Email,
            Categories: result.data.body.Categories,
            ProfileImage:
                result.data.body.ProfileImage === ""
                    ? result.data.body.ProfileImage
                    : new Buffer(result.data.body.ProfileImage.data).toString(
                          "base64"
                      ),
        });
    };

    useEffect(() => {
        getPostList();
        getProfileImage();
    }, []);

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
                <div className="nav-left-list">
                    <div>
                        <ul>
                            <a href={`/blog/${owner}`}>
                                <li>전체 글 보기</li>
                            </a>
                            {blogInfo.Categories &&
                                blogInfo.Categories.map(
                                    (category: String, index: number) => (
                                        <a
                                            href={`/blog/${owner}/${category}`}
                                            key={index}
                                        >
                                            <li>{category}</li>
                                        </a>
                                    )
                                )}
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
