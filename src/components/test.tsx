import { useEffect, useRef, useState } from "react";

const Test = () => {
    const [image, setImage] = useState({} as File);
    const [imageUrl, setImageUrl] = useState("");

    const profileImage = useRef() as React.MutableRefObject<HTMLInputElement>;

    useEffect(() => {
        profileImage.current.addEventListener("change", () => {
            console.log(profileImage.current.files);
            setImage(
                profileImage.current.files &&
                    profileImage.current.files.length !== 0
                    ? profileImage.current.files[0]
                    : ({} as File)
            );
        });
    }, []);

    useEffect(() => {
        console.log(image);
        setImageUrl("");
        image.name && setImageUrl(URL.createObjectURL(image).toString());
    }, [image]);

    return (
        <>
            <input
                type="file"
                ref={profileImage}
                accept="image/jpg image/jpeg image/png"
            />
            <img src={imageUrl} />
        </>
    );
};

export default Test;
