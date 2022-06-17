import axios from "axios";
import "./editProfile.scss";

import { useState, useEffect, useRef } from "react";

import config from "../../../config/config.json";

import { FaTimes } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";

interface emailAuthProps {
    viewPopup: boolean;
    setViewPopup: (emailAuth: boolean) => void;
    profileImage: string;
    getProfileImage: () => void;
}

const EditProfile = (props: emailAuthProps) => {
    const popupRef = useRef() as React.MutableRefObject<HTMLDivElement>;

    const inputImage = useRef() as React.MutableRefObject<HTMLInputElement>;

    const [image, setImage] = useState({} as File);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        inputImage.current.addEventListener("change", () => {
            setImage(
                inputImage.current.files &&
                    inputImage.current.files.length !== 0
                    ? inputImage.current.files[0]
                    : image
            );
        });
    }, []);

    useEffect(() => {
        image.name && setImageUrl(URL.createObjectURL(image).toString());
    }, [image]);

    useEffect(() => {
        const checkIfClickedOutside = (e: any) => {
            if (
                props.viewPopup &&
                popupRef.current &&
                !popupRef.current.contains(e.target)
            ) {
                props.setViewPopup(false);
            }
        };

        document.addEventListener("mouseup", checkIfClickedOutside);

        return () => {
            document.removeEventListener("mouseup", checkIfClickedOutside);
        };
    }, [props.viewPopup]);

    const uploadImage = async () => {
        const formData = new FormData();
        formData.append("img", image);

        formData.append(
            "userkey",
            sessionStorage.getItem("UserKey")!.toString()
        );

        const res = await axios.put(
            `${config.baseurl}/member/profileImage`,
            formData,
            {
                headers: { Authorization: config.apikey },
            }
        );
        if (res.status === 200) {
            props.setViewPopup(false);
            props.getProfileImage();
        } else {
            alert("업로드 실패\n잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div className="wrap">
            <div ref={popupRef} className="EmailAuth">
                <h1>프로필사진 등록</h1>
                <div className="input-wrap">
                    <div className="profile-image">
                        {imageUrl ? (
                            <img src={imageUrl} className="preview" />
                        ) : props.profileImage === "" ? (
                            <AiOutlineUser className="preview" />
                        ) : (
                            <img
                                className="preview"
                                src={
                                    "data:image/jpeg;base64," +
                                    props.profileImage
                                }
                            />
                        )}
                        <a
                            href="#none"
                            onClick={() => {
                                inputImage.current.click();
                            }}
                        >
                            <p>이미지 등록</p>
                        </a>
                        <input
                            ref={inputImage}
                            type="file"
                            accept="image/jpg image/jpeg image/png"
                        />
                    </div>
                    <input type="button" value="등록" onClick={uploadImage} />
                </div>
                <FaTimes
                    className="exit-icon"
                    onClick={() => props.setViewPopup(false)}
                />
            </div>
        </div>
    );
};

export default EditProfile;
