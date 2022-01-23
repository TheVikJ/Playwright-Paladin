const domain = 'backend.playwrightpaladin.co';
const basePath = `https://${domain}/api`;

const authKey = 'auth';
const authBaseRoute = `${basePath}/${authKey}`;
export const authRoutes = {
    getUser: `${authBaseRoute}/user`,
    sendOtp: `${authBaseRoute}/sendOTP`,
    verifyOtp: `${authBaseRoute}/verifyOTP`,
    logout: `${authBaseRoute}/logout`,
};
