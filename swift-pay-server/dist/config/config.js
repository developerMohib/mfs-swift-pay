"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
// Create a configuration object with proper type assertions
const config = {
    port: Number(process.env.PORT) || 8000,
    databaseUrl: process.env.MongoDB_url,
    saltRounds: Number(process.env.SOLT_ROUNDS) || 10,
    jwtSecret: process.env.JWT_SECRET || "default_secret",
};
exports.default = config;
