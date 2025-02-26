import{ model, Schema } from "mongoose";

export interface IAdmin {
    name: string;
    mobileNumber: string;
    email: string;
    password: string;
    balance: number;
    totalMoneyInSystem: number;
}

const AdminSchema: Schema = new Schema({
    name: { type: String },
    mobileNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    totalMoneyInSystem: { type: Number, default: 0 },
});

export const Admin = model<IAdmin>("Admin", AdminSchema);

  