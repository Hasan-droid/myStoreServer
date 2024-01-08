const nodemailer = require("nodemailer");
module.exports = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Outlook365",
    logger: true,
    auth: {
      user: "newStore2025@outlook.com",
      pass: "112233asd.&",
    },
  });
  const mailOptions = {
    from: '"7erfa Store"<newStore2025@outlook.com>',
    to: email,
    subject: "Sending Email using Node.js",
    text: `${process.env.SERVER_URL}/user/verify?email=${email}&token=${token}`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Email send error ", err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
