import "./emailAuth.scss";

const EmailAuth = () => {
    return (
        <div className="wrap">
            <div className="EmailAuth">
                <h1>이메일 인증</h1>
                <div>
                    <input type="text" id="email" placeholder="이메일" />
                    <input type="text" id="code" placeholder="인증번호" />
                    <input type="button" id="button" value="인증번호 발송" />
                </div>
            </div>
        </div>
    );
};

export default EmailAuth;
