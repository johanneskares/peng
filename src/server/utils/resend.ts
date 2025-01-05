import { Resend } from "resend";

export const resened = new Resend(process.env.RESEND_API_KEY);
