const domain = '45.79.125.41';
const basePath = `http://${domain}/api`;

const authKey = 'auth';
const authBaseRoute = `${basePath}/${authKey}`;
export const authRoutes = {
    getUser: `${authBaseRoute}/user`,
    sendOtp: `${authBaseRoute}/sendOTP`,
    verifyOtp: `${authBaseRoute}/verifyOTP`,
    logout: `${authBaseRoute}/logout`,
};
