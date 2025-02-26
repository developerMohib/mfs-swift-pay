"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// make password hash for sign up
const hashPassword = (plainPass) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10); // to make 10 hasing pass
    const hashedPass = yield bcryptjs_1.default.hash(plainPass, salt);
    return hashedPass;
});
exports.hashPassword = hashPassword;
// compare password for login
const comparePassword = (plainPass, hashPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // Compare plain password with hashed one
    const isMatch = yield bcryptjs_1.default.compare(plainPass, hashPassword);
    return isMatch;
});
exports.comparePassword = comparePassword;
