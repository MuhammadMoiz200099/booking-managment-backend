const { Schema, model } = require("mongoose");
const crypto = require("crypto");

const UserModelName = 'User';
const authTypes = ['github', 'twitter', 'facebook', 'google'];

const { Types } = Schema;

const UserSchema = new Schema({
    firstName: { type: Types.String },
    lastName: { type: Types.String },
    username: {
        type: Types.String,
        unique: true
    },
    email: {
        type: Types.String,
        unique: true,
        lowercase: true,
        required() {
            return authTypes.indexOf(this.provider) === -1;
        }
    },
    password: {
        type: String,
        required() {
            return authTypes.indexOf(this.provider) === -1;
        }
    },
    provider: String,
    salt: String,
    phone: {
        type: Types.String,
        unique: true
    },
    address: { type: Types.String, required: true },
    city: { type: Types.String, required: true },
    country: { type: Types.String, required: true },
    postalCode: { type: Types.String, required: true },
    profilePicture: { type: Types.String },
    resetPasswordToken: String,
    facebook: {},
    twitter: {},
    google: {},
    github: {},
    date: {
        type: Types.Date,
        default: Date.now()
    }
});

UserSchema.virtual('profile').get(function () {
    return { name: this.name };
});

UserSchema.virtual('token').get(function () {
    return { _id: this._id };
});

UserSchema.path('email').validate(function (email) {
    return email.length;
}, 'Email cannot be blank');

UserSchema.path('password').validate(function (password) {
    return password.length;
}, 'Password cannot be blank');

UserSchema.path('email').validate(function (value) {
    return this.constructor.findOne({ email: value }).exec()
        .then(user => {
            if (user) {
                return this.id === user.id;
            }
            return true;
        })
        .catch(err => {
            throw err;
        });
}, 'The specified email address is already in use.');

UserSchema.path('username').validate(function (value) {
    return this.constructor.findOne({ username: value }).exec()
        .then(user => {
            if (user) {
                return this.id === user.id;
            }
            return true;
        })
        .catch(err => {
            throw err;
        });
}, 'The specified Username is already in use.');

UserSchema.path('phone').validate(function (value) {
    return this.constructor.findOne({ phone: value }).exec()
        .then(user => {
            if (user) {
                return this.id === user.id;
            }
            return true;
        })
        .catch(err => {
            throw err;
        });
}, 'The specified Phone Number is already in use.');

const validatePresenceOf = function (value) {
    return value && value.length;
};

UserSchema.pre('save', function (next) {
    const _this = this;
    if (!_this.isModified('password')) {
        return next();
    }

    if (!validatePresenceOf(_this.password)) {
        return next();
    }

    _this.makeSalt((saltErr, salt) => {
        if (saltErr) {
            return next(saltErr);
        }
        _this.salt = salt;
        _this.encryptPassword(_this.password, (encryptErr, hashedPassword) => {
            if (encryptErr) {
                return next(encryptErr);
            }
            _this.password = hashedPassword;
            return next();
        });
    });
});

UserSchema.methods = {
    authenticate(password, callback) {
        const _this = this;
        if (!callback) {
            return _this.password === _this.encryptPassword(password);
        }

        _this.encryptPassword(password, (err, pwdGen) => {
            if (err) {
                return callback(err);
            }

            if (_this.password === pwdGen) {
                return callback(null, true);
            } else {
                return callback(null, false);
            }
        });
    },
    makeSalt(...args) {
        const defaultByteSize = 16;
        let byteSize;
        let callback;

        if (typeof args[0] === 'function') {
            callback = args[0];
            byteSize = defaultByteSize;
        } else if (typeof args[1] === 'function') {
            callback = args[1];
        } else {
            throw new Error('Missing Callback');
        }

        if (!byteSize) {
            byteSize = defaultByteSize;
        }

        return crypto.randomBytes(byteSize, (err, salt) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, salt.toString('base64'));
            }
        });
    },
    encryptPassword(password, callback) {
        const _this = this;
        if (!password || !_this.salt) {
            if (!callback) {
                return null;
            } else {
                return callback('Missing password or salt');
            }
        }

        const defaultIterations = 10000;
        const defaultKeyLength = 64;
        const salt = Buffer.from(_this.salt, 'base64');

        if (!callback) {
            return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha256')
                .toString('base64');
        }

        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha256', (err, key) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, key.toString('base64'));
            }
        });
    }
};

const User = model(UserModelName, UserSchema);
module.exports = User;
