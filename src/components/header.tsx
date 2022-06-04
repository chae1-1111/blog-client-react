import "./header.scss";

import { FaPaw } from "react-icons/fa";

interface HeaderProps {
    isLogin: boolean;
    setIsLogin: (isLogin: boolean) => void;
}

const Header = (props: HeaderProps) => {
    const logout: Function = () => {
        sessionStorage.clear();
        props.setIsLogin(false);
    };

    return (
        <div className="Header">
            <div className="Header-left">
                <a href="./">
                    <div className="logo-area">
                        <FaPaw />
                    </div>
                </a>
                <nav>
                    <a>
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
                    <p onClick={() => logout()}>로그아웃</p>
                ) : (
                    // 로그인 전
                    <a className="login-area" href="./login">
                        시작하기
                    </a>
                )}
            </div>
        </div>
    );
};

export default Header;
