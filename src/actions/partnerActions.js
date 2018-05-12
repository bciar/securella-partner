export function setLoginState(loggedIn) {
    return {
        type: "SET_LOGIN_STATE",
        payload: loggedIn
    };
}
