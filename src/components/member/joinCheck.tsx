import axios from "axios";
import config from "../../config/config.json";

interface user {
    userid: string;
    userpw: string;
    userpw_check: string;
    email: string;
    keywords: string[];
}
interface result {
    userid?: string;
    userpw?: string;
    userpw_check?: string;
    email?: string;
    keywords?: string;
}

export const joinCheck: Function = async (user: user) => {
    let result: result = {};

    let regId = /^[a-zA-Z0-9]{6,20}$/;
    let regPw = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[~!@#$%^&*<>?]).{8,20}$/;

    let idCheck = await axios.get(
        `${config.baseurl}/member/general?userid=${user.userid}`,
        { headers: { Authorization: `${config.apikey}` } }
    );

    if (user.userid!.trim().length === 0) {
        result.userid = "아이디를 입력해주세요.";
    } else if (!regId.test(user.userid!)) {
        result.userid =
            "아이디는 4자 이상 12자 이하의 영문 대소문자와 숫자로만 입력해주세요.";
    } else if (!idCheck.data.result) {
        result.userid = "이미 가입된 아이디입니다.";
    }

    if (user.userpw!.trim().length === 0) {
        result.userpw = "비밀번호를 입력해주세요.";
    } else if (!regPw.test(user.userpw!)) {
        result.userpw =
            "비밀번호는 8자 이상 20자 이하의 영문 대소문자와 숫자, 특수문자를 포함해주세요.";
    }

    if (user.userpw! !== user.userpw_check!) {
        result.userpw_check = "비밀번호가 일치하지 않습니다.";
    }

    if (user.email!.trim().length === 0) {
        result.email = "이메일 인증이 필요합니다.";
    }

    if (user.keywords!.length === 0) {
        result.keywords = "키워드를 선택해주세요.";
    }

    return result;
};
