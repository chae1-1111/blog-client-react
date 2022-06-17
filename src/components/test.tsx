import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Buffer } from "buffer";

import config from "../config/config.json";

const Test = () => {
    const [image, setImage] = useState("");

    const testFunc = async () => {
        let result = await axios.get(
            `${
                config.baseurl
            }/member/getProfileImage?userkey=${sessionStorage.getItem(
                "UserKey"
            )}`,
            { headers: { Authorization: config.apikey } }
        );

        // console.log(result);
        console.log(result.data);
        // console.log(result.data.image.data.toString("base64"));
        setImage(new Buffer(result.data.image.data).toString("base64"));
    };

    useEffect(() => {
        testFunc();
    }, []);

    return (
        <>
            <img src={"data:image/jpeg;base64," + image} />
        </>
    );
};

export default Test;
