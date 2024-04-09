const { Appointment } = require("../../../models");

class AppointmentService {
    constructor() {}

    async get() {
        return Appointment.find({});
    }

    async create(userData) {
        const userInstance = new Appointment(userData);
        return userInstance.save();
    }

    async getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                const [get] = await Appointment.find({ _id: id });
                return resolve(get);
            } catch (err) {
                return reject(err);
            }
        });
    }
    async getByUserID(id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                const [get] = await Appointment.find({ user_id: id });
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
                const updateQuery = await Appointment.findOneAndUpdate({ _id: id }, user);
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
                const deleteQuery = await Appointment.findOneAndDelete({ _id: id });
                return resolve(deleteQuery);
            } catch (err) {
                return reject(err);
            }
        });
    }
}

module.exports = new AppointmentService();
