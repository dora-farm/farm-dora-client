export const findId = async (name, email) => {
    const response = await fetch("http://localhost:8080/api/find/send/code", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: name,
            email: email,
            find: "ID",
        }),
    });
    if (!response.ok) throw new Error("아이디 찾기 실패");
    return response.json();
};

export const findPassword = async (id, email) => {
    const response = await fetch("http://localhost:8080/api/find/send/code", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            id: id,
            email: email,
            find: "PWD",
        }),
    });
    if (!response.ok) throw new Error("비밀번호 찾기 실패");
    return response.json();
};

export const findVerificationCode = async (email, code, find) => {
    const response = await fetch("http://localhost:8080/api/find/send/value", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: email,
            code: code,
            find: find,
        }),
    });
    if (!response.ok) throw new Error("인증실패");
    return response.json();
}
