// src/authProvider.js
// Sample authProvider for react-admin

const authProvider = {
    // called when the user attempts to log in
    login: ({ username, password }) => {
        // Replace with real authentication logic
        if (username === 'admin' && password === 'password') {
            localStorage.setItem('authToken', 'fake-token');
            return Promise.resolve();
        }
        return Promise.reject('Invalid credentials');
    },
    // called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem('authToken');
        return Promise.resolve();
    },
    // called when the API returns an error
    checkError: (error) => {
        if (error.status === 401 || error.status === 403) {
            localStorage.removeItem('authToken');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // called when the user navigates, to check for authentication
    checkAuth: () => {
        return localStorage.getItem('authToken')
            ? Promise.resolve()
            : Promise.reject();
    },
    // called when the user navigates, to get user identity
    getIdentity: () => {
        return Promise.resolve({ id: 'admin', fullName: 'Admin User' });
    },
    // called to get user permissions
    getPermissions: () => Promise.resolve(),
};

export default authProvider;
