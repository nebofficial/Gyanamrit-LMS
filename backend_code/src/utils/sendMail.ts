import nodemailer from "nodemailer";
import { config } from "../config/config";
import { Resend } from "resend";

interface IMailFormat {
  to: string;
  subject: string;
  html: string;
}

const resend = new Resend(config.resendKey);

const sendMail = async (mailData: IMailFormat) => {
  try {
    await resend.emails.send({
      from: `${config.mailName} <${config.mail}>`,
      to: mailData.to,
      subject: mailData.subject,
      html: mailData.html,
    });
    console.log(`✅ Mmail sent successfully ${mailData.to} `);
  } catch (error) {
    console.log(error);
  }
};

const sendMail1 = async (mailData: IMailFormat) => {
  const transport = nodemailer.createTransport({
    service: config.nodemailerService,
    auth: {
      user: config.nodemailerMail,
      pass: config.nodemailerPasskey,
    },
  });

  const mailformat = {
    from: `${config.nodemailerUser} <${config.nodemailerMail}>`,
    to: mailData.to,
    subject: mailData.subject,
    html: mailData.html,
  };

  try {
    const info = await transport.sendMail(mailformat);
    console.log(`✅ Email sent - ${info.response}`);
  } catch (error: unknown) {
    console.log(`❌ Failed to sent mail -${error} `);
  }
};

export default sendMail;
