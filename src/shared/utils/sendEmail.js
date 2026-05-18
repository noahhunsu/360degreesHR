import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
export const sendEmail = async ({ to, subject, html }) => {
    console.log("sending email");
    return resend.emails.send({
        from: process.env.EMAIL_FROM,
        to, subject, html
    });
};
//# sourceMappingURL=sendEmail.js.map