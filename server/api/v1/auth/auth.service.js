const { User } = require("../../../models");
const jwt = require("jsonwebtoken");
// const { MailService } = require("../../../services/mail.service");

class AuthService {
    constructor() { }

    login(credentials) {
        return new Promise(async (resolve, reject) => {
            const { email, password } = credentials;
            try {
                let user = null;
                user = await User.findOne({ email });
                if (!user) {
                    user = await User.findOne({ username: email });
                    if (!user) {
                        user = await User.findOne({ phone: email });
                        if (!user) {
                            return reject({ message: 'User not exists', code: 400 });
                        }
                    }
                }
                const passwordIsValid = user.authenticate(password);
                if (!passwordIsValid) {
                    return reject({ message: 'Email or Password invalid!', code: 400 });
                }
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                    expiresIn: 604800, // 1 week hours
                    algorithm: 'HS256'
                });
                resolve({
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    phone: user.phone,
                    accessToken: token,
                    date: user.date,
                    profilePicture: user.profilePicture
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    async forgotPassword({ email, host }) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return reject({ message: 'No user found with that email address', code: 400 });
                }
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                    expiresIn: 7200, // 2 hours
                    algorithm: 'HS256'
                });
                user.resetPasswordToken = token;
                user.save();
                const mailOptions = {
                    to: user.email,
                    from: process.env.APP_EMAIL_SENDER,
                    subject: 'Password Reset',
                    html: `
                        <h1 style="font-family: sans-serif;">Hello!</h1>
                        <p style="font-family: sans-serif;font-size: 20px;color: grey;">You are reviewing this email because we received a password reset request from your account.</p>
                        <br>
                        <br>
                        <div style="display: flex;flex: 1;justify-content: center;align-items: center;">
                            <a href="${host}/reset-password/${token}" style="cursor: pointer !important;">
                                <button style="border: none;outline: none;background: #172865;padding: 20px 60px;font-size: 20px;border-radius: 10px;color: white;cursor: pointer;">Reset Password</button>
                            </a>
                        </div>
                        <br>
                        <br>
                        <p style="font-family: sans-serif;font-size: 18px;color: grey;">If you did not request a password reset, no further action is requried.</p>
                        <p style="font-family: sans-serif;font-size: 18px;color: grey;">Kind Regards, <br> Black Lion, Inc.</p>
                        <br>
                        <br>
                        <br>
                        <div style="height: 1px;width: 100%;background: #d8d8d8;"></div>
                        <br>
                        <p style="font-family: sans-serif;font-size: 16px;color: grey;">If you are having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser.</p>
                        <a href="${host}/reset-password/${token}" style="font-family: sans-serif;font-size: 16px;">${host}/reset-password/${token}</a>
                    `
                };
                // const mailService = new MailService();
                // mailService.sendEmail(mailOptions)
                //     .then((success) => {
                //         resolve(success);
                //     })
                //     .catch((error) => {
                //         reject(error);
                //     });
            } catch (err) {
                reject(err);
            }
        });
    }

    resetPassword(token, password) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!token) {
                    return reject({ message: 'Invaild token request', code: 400 });
                }
                const user = await User.findOne({ resetPasswordToken: token });
                if (!user) {
                    return reject({ message: 'Unauthorized reset password request', code: 400 });
                }
                user.password = password;
                user.resetPasswordToken = undefined;
                user.save();
                const mailOptions = {
                    to: user.email,
                    from: process.env.APP_EMAIL_SENDER,
                    subject: 'Password Reset',
                    html: '<h3>Hello,</h3>' +
                        '<h3>This is a confirmation that the password for your account ' + user.email + ' has just been changed.</h3>'
                };
                // const mailService = new MailService();
                // mailService.sendEmail(mailOptions)
                //     .then((success) => {
                //         resolve(success);
                //     })
                //     .catch((error) => {
                //         reject(error);
                //     });
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = new AuthService();
