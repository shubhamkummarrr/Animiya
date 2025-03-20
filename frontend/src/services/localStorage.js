const storeToken = (tokens) => {
    if (tokens) {
        const { access, refresh } = tokens;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
    }
}

const getToken = () => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    return { access_token, refresh_token };
}

const removeToken = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

export { storeToken, getToken, removeToken };