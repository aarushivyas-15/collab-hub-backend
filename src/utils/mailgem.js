import Mailgen from "mailgen";
// import { options } from "mongoose/lib/schema/array";

// import { options } from "mongoose/lib/schema/documentArray.js";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://taskmanagelink.com",
    },
  });
  console.log("OPTIONS:", options); // add this
  console.log("TO EMAIL:", options.email); // add this
  const emailTexual = mailGenerator.generatePlaintext(options.mailgenContent);

  const emailHtml = mailGenerator.generate(options.mailgenContent);

  // const transporter = nodemailer.createTransport({
  //   host: process.env.MAILTRAP_SMTP_USER,
  //   pass: process.env.MAILTRAP_SMTP_PASS,
  // });

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTexual,
    html: emailHtml,
  };
  try {
    await transporter.sendMail(mail);
    // await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email Service failed, Make sure to have your MAILTRAPE credential in .env file",
    );
    // console.error(Error);
    console.error(error);
  }
};
// try {
//   await transporter.sendEmail(mail);
// } catch (error) {
//   console.error(
//     "Email Service failed, Make sure to have your MAILTRAPE credential in .env file",
//   );
//   console.error(Error);
// }

const emailVerificationMailgenContent = function (username, verificationUrl) {
  return {
    body: {
      name: username,
      intro: "We are exited to have you on board.",
      action: {
        instructions: "To verify your email, please click here: ",
        button: {
          color: "#15a930",
          text: "Verify your mail",
          link: verificationUrl,
        },
      },
      outro:
        " Need help, or have questions? Just reply to this email, we\'d love to help.",
    },
  };
};

const forgotPasswordMailgenContent = function (username, PasswordResetUrl) {
  return {
    body: {
      name: "Aarushi Vyas",
      intro: "We got requst to reset your password for your account.",
      action: {
        instructions: "To reset your password, please click here: ",
        button: {
          color: "#471afc",
          text: "Reset your password",
          link: PasswordResetUrl,
        },
      },
      outro:
        " Need help, or have questions? Just reply to this email, we\'d love to help.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
