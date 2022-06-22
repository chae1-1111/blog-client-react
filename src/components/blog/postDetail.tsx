import axios from "axios";
import { useEffect, useState } from "react";

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
}

const PostDetail: Function = (props: PropsType) => {
    const [post, setPost] = useState({} as postProps);

    useEffect(() => {
        getPostDetail();
    }, []);

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

    return (
        <div className="post-detail">
            {post.Title && (
                <>
                    <div className="post-top-area">
                        <a className="post-Category" href="#">
                            {post.Category}
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
                </>
            )}
        </div>
    );
};

export default PostDetail;
