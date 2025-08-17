import nodemailer from "nodemailer";

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "aroarko.sd@gmail.com",
      pass: "xbhv gbzg hllv bslg",
    },
  });

  await transporter.sendMail({
    from: "aroarko.sd@gmail.com",
    to,
    subject: "Reset your password within ten mins!",
    text: "",
    html,
  });
};
