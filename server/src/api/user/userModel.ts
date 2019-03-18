import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

type UserType = mongoose.Document & {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
};

const userSchema = new Schema({
    id: { type: ObjectId, index: true },
    firstName: { type: String, trim: true, required: 'required firstName' },
    lastName: { type: String, trim: true, required: 'required lastName' },
    email: {
        type: String, unique: true, required: 'required email', index: true, lowercase: true
    },
    dateOfBirth: { type: Date, required: 'required dateOfBirth' },
    password: { type: String, required: 'required password' },
}, {
        timestamps: true
    });

const User = mongoose.model('User', userSchema);

export { UserType, User };