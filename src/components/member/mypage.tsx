import { FaHome, FaUser } from "react-icons/fa";
import { Route, Routes } from "react-router-dom";

import "./mypage.scss";
import ConfigBlog from "./mypages/configBlog";
import ModifyPassword from "./mypages/modifyPassword";
import ModifyUser from "./mypages/modifyUser";
import RemoveAccount from "./mypages/removeAccount";

interface MyPageProps {
    isLogin: Boolean;
}

const Mypage = (props: MyPageProps) => {
    return (
        <div className="Mypage">
            <div className="nav-left">
                <div className="nav-left-title">
                    <h2>마이페이지</h2>
                </div>
                <div className="nav-left-profile">
                    <p className="name">{sessionStorage.getItem("Name")}</p>
                    <p className="email">{sessionStorage.getItem("Email")}</p>
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
                    <Routes>
                        <Route path="/configBlog" element={<ConfigBlog />} />
                        <Route path="/modifyUser" element={<ModifyUser />} />
                        <Route
                            path="/modifyPassword"
                            element={<ModifyPassword />}
                        />
                        <Route
                            path="/removeAccount"
                            element={<RemoveAccount />}
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Mypage;
