"use strict";
const nodemailer = require("nodemailer");

nodemailer.createTestAccount((err, account) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Gmail Host
    port: 465, // Port
    secure: true, // this is true as port is 465
    auth: {
      user: "fuglenbusiness@gmail.com", //Gmail username
      pass: "wya95bac" // Gmail password
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false
    }
  });

  let mailOptions = {
    from: "fuglenbusiness@gmail.com",
    to: "fuglenbusiness@gmail.com", // Recepient email address. Multiple emails can send separated by commas
    subject: "Sending Email using Node.js[nodemailer]",
    text: "That was easy!"
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
});
