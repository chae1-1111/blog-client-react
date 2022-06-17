import "./header.scss";

import { FaPaw, FaUser } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

import config from "../config/config.json";

interface HeaderProps {
    isLogin: boolean;
    setIsLogin: (isLogin: boolean) => void;
    profileImage: string;
    getProfileImage: () => void;
}

const Header = (props: HeaderProps) => {
    const logout: Function = () => {
        sessionStorage.clear();
        props.setIsLogin(false);
    };

    const profileRef = useRef() as React.MutableRefObject<HTMLDivElement>;

    const [viewProfile, setViewProfile] = useState(false);

    useEffect(() => {
        const checkIfClickedOutside = (e: any) => {
            if (
                viewProfile &&
                profileRef.current &&
                !profileRef.current.contains(e.target)
            ) {
                setViewProfile(false);
            }
        };

        document.addEventListener("mouseup", checkIfClickedOutside);

        return () => {
            document.removeEventListener("mouseup", checkIfClickedOutside);
        };
    }, [viewProfile]);

    useEffect(() => {
        props.getProfileImage();
    }, []);

    return (
        <div className="Header-wrap">
            <div className="Header">
                <div className="Header-left">
                    <a href="./">
                        <div className="logo-area">
                            <FaPaw />
                        </div>
                    </a>
                    <nav>
                        <a
                            href={
                                props.isLogin
                                    ? `/blog/${sessionStorage.getItem(
                                          "UserId"
                                      )}`
                                    : `/login`
                            }
                        >
                            <p>내 블로그</p>
                        </a>
                        <a>
                            <p>피드</p>
                        </a>
                        <a>
                            <p>추천</p>
                        </a>
                    </nav>
                </div>
                <div className="Header-right">
                    {props.isLogin ? (
                        // 로그인 상태
                        <div>
                            {props.profileImage === "" ? (
                                <FaUser
                                    className="user-icon"
                                    size={50}
                                    onClick={() => {
                                        setViewProfile(true);
                                    }}
                                />
                            ) : (
                                <img
                                    className="user-icon"
                                    src={
                                        "data:image/jpeg;base64," +
                                        props.profileImage
                                    }
                                    onClick={() => {
                                        setViewProfile(true);
                                    }}
                                />
                            )}
                            {viewProfile && (
                                <div className="profile-wrap" ref={profileRef}>
                                    <p className="profile-name">
                                        {sessionStorage.getItem("Name")}
                                    </p>
                                    <a href="/mypage/configBlog">
                                        <p className="profile-link">
                                            마이페이지
                                        </p>
                                    </a>
                                    <a href="/">
                                        <p
                                            className="profile-link"
                                            onClick={() => logout()}
                                        >
                                            로그아웃
                                        </p>
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        // 로그인 전
                        <a className="login-area" href="/login">
                            시작하기
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
