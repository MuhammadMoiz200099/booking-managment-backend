const { Schema, model } = require("mongoose");

export const AppointmentName = 'Appointment';
const { Types } = Schema;

const AppointmentSchema = new Schema({
    name: {
        type: Types.String
    },
    email: {
        type: Types.String
    },
    phone: {
        type: Types.String
    },
    date: {
        type: Types.Date
    },
    time: {
        type: Types.Date
    },
    date: {
        type: Types.Date,
        default: Date.now()
    }
});

const Appointment = model(AppointmentName, AppointmentSchema);

module.exports = Appointment;