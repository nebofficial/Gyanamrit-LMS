import dotenv from 'dotenv';

dotenv.config();

export const config = {
    siteName: 'Gyanamrit',
    port: process.env.PORT || 2580,
    dtabaseUrl: process.env.DATABASE_URL as string,
    clientUrl: process.env.TOKEN_VERIFY_URL,

    //Nodemailer
    nodemailerMail: process.env.NODEMAILER_GMAIL,
    nodemailerPasskey: process.env.NODEMAILER_PASSKEY,
    nodemailerUser: process.env.NODEMAILER_USERNAME,
    nodemailerService: process.env.NODEMAILER_SERVICE,

    jsonSecretKey: process.env.JSON_SECRET_KEY,

    resendKey: process.env.RESEND_KEY,
    mail: process.env.MAIL,
    mailName: process.env.MAIL_NAME,

    //CLOUDINARY
    cloudinarName: process.env.CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUD_API_KEY,
    cloudinaryApiSecret: process.env.CLOUD_API_SECRET,
    cloudinaryFolder: process.env.CLOUD_FOLDER,

}

