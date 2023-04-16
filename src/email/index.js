"use strict";
// Previous with SendGrid
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCancellationEmail = exports.sendWelcomeEmail = void 0;
// import sgMail from "@sendgrid/mail";
// const sendGridApiKey = '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';
// sgMail.setApiKey(sendGridApiKey);
// export const sendWelcomeEmail = (email: string, name: string) => {
//     return sgMail.send({
//         to: email,
//         from: 'shaikhobaid123@gmail.com',
//         subject: 'Thanks for joining in!',
//         text: `Welcome ${name.toLowerCase()[0].toUpperCase()}! Go legend in a month with our AI Task Tracking service.`
//     })
// }
// export const sendCancellationEmail = (email: string, name: string) => {
//     return sgMail.send({
//         to: email,
//         from: 'shaikhobaid123@gmail.com',
//         subject: 'Sorry to see yoy go :)',
//         text: `GoodBye ${name.toLowerCase()[0].toUpperCase()}! I Hope to see you back sometime soon.`
//     })
// }
// Latest With SendInBlue
const sibMail = __importStar(require("sib-api-v3-typescript"));
// const sendInBlueApiKey = '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';
const sibEmailInstance = new sibMail.TransactionalEmailsApi();
// Configure Api Key
sibEmailInstance.setApiKey(sibMail.TransactionalEmailsApiApiKeys.apiKey, process.env.SENDINBLUE_API_KEY);
// Admin Sender
const sender = {
    email: "shaikhobaid123@gmail.com",
    name: "Ubed Shaikh",
};
// sibEmailInstance.sendTransacEmail(sibMail.SendSmtpEmail)
const sendWelcomeEmail = (email, name) => {
    return sibEmailInstance.sendTransacEmail({
        sender,
        to: [{ email }],
        subject: "Thanks for joining in!",
        textContent: `Welcome ${name.toUpperCase()}! Go legend in a month with our AI Task Tracking service.`,
        htmlContent: `
        <!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Transaction Notification</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			background-color: #f6f6f6;
			color: #444444;
			line-height: 1.6em;
			padding: 20px;
			margin: 0;
		}

		.container {
			max-width: 600px;
			margin: 0 auto;
			background-color: #ffffff;
			padding: 20px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			border-radius: 5px;
		}

		h1 {
			font-size: 24px;
			margin-top: 0;
			text-align: center;
		}

		p {
			margin-bottom: 20px;
		}

		.button {
			display: inline-block;
			background-color: #4CAF50;
			color: #ffffff;
			text-align: center;
			padding: 10px 20px;
			text-decoration: none;
			border-radius: 5px;
		}

		.button:hover {
			background-color: #3e8e41;
		}

		.footer {
			font-size: 12px;
			color: #999999;
			text-align: center;
			margin-top: 50px;
			padding-top: 20px;
			border-top: 1px solid #cccccc;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>Account Created Successfully!</h1>
		<p>Hello <strong>${name.toUpperCase()}</strong>,</p>
			<p>Thank you for choosing Taskify. Go legend in a month with our AI Task Tracking service.</p>
			<p>If you have any questions or concerns, please don't hesitate to contact us.</p>
			<a href="https://ubedshaikh.netlify.app/home" class="button">Visit developer's website</a>
		</div>
		<div class="footer">
			<p>This email was sent to ${email.toLowerCase()} because you made a transaction with us.</p>
		</div>
	</div>
</body>
</html>
        `,
    });
};
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendCancellationEmail = (email, name) => {
    return sibEmailInstance.sendTransacEmail({
        sender,
        to: [{ email }],
        subject: "Sorry to see you go :)",
        textContent: `GoodBye ${name.toUpperCase()}! I Hope to see you back sometime soon.`,
        htmlContent: `
        <!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Transaction Notification</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			background-color: #f6f6f6;
			color: #444444;
			line-height: 1.6em;
			padding: 20px;
			margin: 0;
		}

		.container {
			max-width: 600px;
			margin: 0 auto;
			background-color: #ffffff;
			padding: 20px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			border-radius: 5px;
		}

		h1 {
			font-size: 24px;
			margin-top: 0;
			text-align: center;
		}

		p {
			margin-bottom: 20px;
		}

		.button {
			display: inline-block;
			background-color: #4CAF50;
			color: #ffffff;
			text-align: center;
			padding: 10px 20px;
			text-decoration: none;
			border-radius: 5px;
		}

		.button:hover {
			background-color: #3e8e41;
		}

		.footer {
			font-size: 12px;
			color: #999999;
			text-align: center;
			margin-top: 50px;
			padding-top: 20px;
			border-top: 1px solid #cccccc;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>Account Deleted Successfully</h1>
		<p>GoodBye <strong>${name.toUpperCase()}</strong>,</p>
			<p>I Hope to see you back sometime soon.</p>
			<p>If you have any questions or concerns, please don't hesitate to contact us.</p>
			<a href="https://ubedshaikh.netlify.app/home" class="button">Visit developer's website</a>
		</div>
		<div class="footer">
			<p>This email was sent to ${email.toLowerCase()} because you made a transaction with us.</p>
		</div>
	</div>
</body>
</html>
        `,
    });
};
exports.sendCancellationEmail = sendCancellationEmail;
