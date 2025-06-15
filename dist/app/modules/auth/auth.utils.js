"use strict";
// import { Resend } from 'resend';
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
exports.sendResetPasswordEmail = void 0;
// const resend = new Resend(process.env.RESEND_API_KEY);
// export const sendResetPasswordEmail = async (to: string, resetUrl: string) => {
//   await resend.emails.send({
//     from: 'Your App Name <no-reply@yourdomain.com>',
//     to,
//     subject: 'Reset Your Password',
//     html: `
//       <p>Hello,</p>
//       <p>Click the link below to reset your password:</p>
//       <a href="${resetUrl}" target="_blank">${resetUrl}</a>
//       <p>This link will expire in 15 minutes.</p>
//     `,
//   });
// };
const resend_1 = require("resend");
const config_1 = __importDefault(require("../../config"));
const resend = new resend_1.Resend(config_1.default.resend);
// resend.emails.send({
//   from: 'onboarding@resend.dev',
//   to: 'shahin451999@gmail.com',
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
// });
//
const sendResetPasswordEmail = (to, resetUrl) => __awaiter(void 0, void 0, void 0, function* () {
    yield resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject: 'Reset Your Password',
        html: `
      <p>Hello,</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `,
    });
});
exports.sendResetPasswordEmail = sendResetPasswordEmail;
