import * as sgMail from "@sendgrid/mail";
const API_KEY = process.env.SENDGRID_APIKEY;
sgMail.setApiKey(API_KEY);

export async function sendgrid(msg) {
    try {
        return await sgMail.send(msg);
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    }
}