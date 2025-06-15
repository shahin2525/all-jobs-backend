"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
    port: process.env.PORT,
    salt: process.env.SALT,
    db_url: process.env.DB_URL,
    bcrypt: process.env.SALT,
    resend: process.env.RESEND,
    NODE_ENV: process.env.NODE_ENV,
    access_secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRES_IN,
};
