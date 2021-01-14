import * as mailjet from "node-mailjet";
import dotenv from "dotenv";

dotenv.config();

const mjClient = mailjet.connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const sendConformationRequest = (receiptEmail, firstName, lastName, token) => {
  const request = mjClient.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.SENDER_EMAIL,
          Name: "Architecd",
        },
        To: [
          {
            Email: receiptEmail,
            Name: firstName + " " + lastName,
          },
        ],
        Subject: "Welcome",
        TextPart: "Click the below link to activate your account",
        HTMLPart: `<a href="${process.env.API_URL}/auth/verify/${token}">Verify</a>`,
      },
    ],
  });
  request
    .then((result) => {
      console.log(JSON.stringify(result.body));
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};

const sendPasswordResetRequest = (receiptEmail, firstName, lastName, token) => {
  const request = mjClient.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.SENDER_EMAIL,
          Name: "Architecd",
        },
        To: [
          {
            Email: receiptEmail,
            Name: firstName + " " + lastName,
          },
        ],
        Subject: "Reset Password",
        TextPart: "Click the below link to reset your password",
        HTMLPart: `<a href="${process.env.API_URL}/auth/reset/${token}">Reset Passwrod</a>`, //This should be frontend link, just keep backend link for now.
      },
    ],
  });
  request
    .then((result) => {
      console.log(JSON.stringify(result.body));
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};

const sendPasswordResetedNotify = (receiptEmail, firstName, lastName) => {
  const request = mjClient.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.SENDER_EMAIL,
          Name: "Architecd",
        },
        To: [
          {
            Email: receiptEmail,
            Name: firstName + " " + lastName,
          },
        ],
        Subject: "Password reseted",
        TextPart: "Password has been changed",
        HTMLPart: `<span>This is a confirmation that the password for your account</span>`,
      },
    ],
  });
  request
    .then((result) => {
      console.log(JSON.stringify(result.body));
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};

export {
  sendConformationRequest,
  sendPasswordResetRequest,
  sendPasswordResetedNotify,
};
