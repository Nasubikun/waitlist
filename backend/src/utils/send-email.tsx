import { Resend } from 'resend';
import { EmailTemplate } from '../emails/email-template';
const resend = new Resend('re_LBGw372e_MVEHkPRBN1yddrxWVCk1jazf');
export const sendEmail = (to: string) => resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [to],
    subject: 'hello world',
    react: <EmailTemplate firstName="John" />,
});