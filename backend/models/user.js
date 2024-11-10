import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        unique : true,
        required : true
    },

    firstname: {
        type : String,
        required: true
    },

    lastname: {
        type : String,
    },

    dob: {
        type : Date,
    },

    mobileno: {
        type : String,
        unique : true,
        required: true
    },

    email: {
        type : String,
        unique : true,
        required: true
    },

    role: {
        type : String,
        enum : ['Student' , 'Admin', 'Examiner'],
        required: true
    },

    referto: {
        type: mongoose.Schema.Types.ObjectId,
        refpath: 'role'
    },

    password: {
        type : String,
        required: true
    }
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;