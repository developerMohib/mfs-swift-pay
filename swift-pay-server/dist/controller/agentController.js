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
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUser = void 0;
const Agent_1 = require("../model/Agent");
const allUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield Agent_1.Agent.find(); // Fetch all users
        res.send(users); // Send the users back as a JSON response
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
        next(error);
    }
});
exports.allUser = allUser;
