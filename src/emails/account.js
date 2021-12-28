const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendSignupMail = (email, name) => {
  sgMail.send({
    to: email,
    from: "orkhan.rz8@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}! Thanks for signing up!`,
  });
};

const sendDeletionMail = (email, name) => {
  sgMail.send({
    to: email,
    from: "orkhan.rz8@gmail.com",
    subject: "Account Deleted!",
    text: `We are sorry to hear that you leave our team, ${name}. You can signup anytime later. Thank you for being part of our organization.`,
  });
};

module.exports = { sendSignupMail, sendDeletionMail };
