import{ model, Schema } from "mongoose";

export interface IAdmin {
    userName: string;
    userPhone: string;
    userEmail: string;
    password: string;
    balance: number;
    totalMoneyInSystem: number;
}

const AdminSchema: Schema = new Schema({
    userName: { type: String },
    userPhone: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    totalMoneyInSystem: { type: Number, default: 0 },
});

export const Admin = model<IAdmin>("Admin", AdminSchema);

  