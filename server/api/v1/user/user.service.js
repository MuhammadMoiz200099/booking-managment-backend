const { User } = require("../../../models");

class UserService {
    constructor() {}

    async get() {
        return User.find({});
    }

    async create(userData) {
        const userInstance = new User(userData);
        return userInstance.save();
    }

    async getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                const [get] = await User.find({ _id: id });
                return resolve(get);
            } catch (err) {
                return reject(err);
            }
        });
    }

    async update(id, user) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id || !user) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                const updateQuery = await User.findOneAndUpdate({ _id: id }, user);
                return resolve(updateQuery);
            } catch (err) {
                return reject(err);
            }
        });
    }

    async delete(id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                const deleteQuery = await User.findOneAndDelete({ _id: id });
                return resolve(deleteQuery);
            } catch (err) {
                return reject(err);
            }
        });
    }
}

module.exports = new UserService();
