import { useEffect, useState } from "react";
import { FaHome, FaUser, FaEdit } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { useParams } from "react-router-dom";

import "./mypage.scss";
import ConfigBlog from "./mypages/configBlog";
import ModifyPassword from "./mypages/modifyPassword";
import ModifyUser from "./mypages/modifyUser";
import RemoveAccount from "./mypages/removeAccount";
import EditProfile from "./mypages/editProfile";

interface MyPageProps {
    isLogin: Boolean;
    setIsLogin: Function;
}

const Mypage = (props: MyPageProps) => {
    const [viewPopup, setViewPopup] = useState(false);

    const params = useParams();

    useEffect(() => {
        if (!props.isLogin) {
            window.location.href = "/";
        }
    }, []);

    return (
        <div className="Mypage">
            {props.isLogin && (
                <>
                    <div className="nav-left">
                        <div className="nav-left-title">
                            <h2>마이페이지</h2>
                        </div>
                        <div className="nav-left-profile">
                            <div className="profile-image">
                                <AiOutlineUser size={100} />
                                <p
                                    onClick={() => {
                                        setViewPopup(true);
                                    }}
                                >
                                    <a href="#none">편집</a>
                                </p>
                            </div>
                            <p className="name">
                                {sessionStorage.getItem("Name")}
                            </p>
                            <p className="email">
                                {sessionStorage.getItem("Email")}
                            </p>
                        </div>
                        <div className="nav-left-list">
                            <div>
                                <div className="nav-left-list-title">
                                    <FaHome className="icon" size={18} />
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
                                    <FaUser className="icon" size={18} />
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
                    <div className="mypage-content-wrap">
                        <div className="mypage-content">
                            {params.page === "configBlog" && <ConfigBlog />}
                            {params.page === "modifyUser" && <ModifyUser />}
                            {params.page === "modifyPassword" && (
                                <ModifyPassword setIsLogin={props.setIsLogin} />
                            )}
                            {params.page === "removeAccount" && (
                                <RemoveAccount setIsLogin={props.setIsLogin} />
                            )}
                        </div>
                    </div>
                </>
            )}
            {viewPopup && (
                <EditProfile
                    viewPopup={viewPopup}
                    setViewPopup={setViewPopup}
                />
            )}
        </div>
    );
};

export default Mypage;
