export const storeToken = (tokens) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
};

export const getToken = () => {
    return {
        access_token: localStorage.getItem('access_token'),
        refresh_token: localStorage.getItem('refresh_token'),
    };
};

export const removeToken = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

