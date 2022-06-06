interface user {
    userid: HTMLInputElement;
    userpw: HTMLInputElement;
    userpw_check: HTMLInputElement;
    email: HTMLInputElement;
    name: HTMLInputElement;
}

interface result {
    userid?: string;
    userpw?: string;
    userpw_check?: string;
    email?: string;
    name?: string;
}

const joinCheck: Function = (user: user) => {
    let result:result = {};
    if (user.userid.value.trim().length === 0) {
        result.userid = "아이디를 입력해주세요.";
    }
    
};

export default joinCheck;
