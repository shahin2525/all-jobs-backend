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
const appError_1 = __importDefault(require("../error/appError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../modules/user/user.model");
//...requiredRoles: TUserRole[]
const auth = (...requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // console.log(req.headers.authorization);
            // const token = req.headers.authorization?.split(' ')[1];
            const token = req.headers.authorization;
            // console.log('token', token);
            if (!token) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'you are unauthorize 1');
            }
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.access_secret);
            // console.log('decod', decoded);
            const { email, role } = decoded;
            const user = yield user_model_1.User.findOne(email);
            if (!user) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'you are unauthorize 2');
            }
            //   const isBlocked = user.deactivate;
            //   if (isBlocked) {
            //     throw new AppError(StatusCodes.FORBIDDEN, 'you are unauthorize 3');
            //   }
            const isActive = user === null || user === void 0 ? void 0 : user.isActive;
            if (!isActive) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'you are unauthorize 3');
            }
            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'you are unauthorize 4');
            }
            req.user = decoded;
            next();
        }
        catch (err) {
            next(err);
        }
    });
};
exports.default = auth;
