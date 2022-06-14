import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import config from "../../config/config.json";

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
                <div className="post-created">{props.Created}</div>
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
        <div>
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
