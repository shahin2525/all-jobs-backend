// import { Resend } from 'resend';

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
import { Resend } from 'resend';
import config from '../../config';

const resend = new Resend(config.resend);

// resend.emails.send({
//   from: 'onboarding@resend.dev',
//   to: 'shahin451999@gmail.com',
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
// });
//
export const sendResetPasswordEmail = async (to: string, resetUrl: string) => {
  await resend.emails.send({
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
};
