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
var sibMail = __importStar(require("sib-api-v3-typescript"));
// const sendInBlueApiKey = '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';
var sibEmailInstance = new sibMail.TransactionalEmailsApi();
// Configure Api Key
sibEmailInstance.setApiKey(sibMail.TransactionalEmailsApiApiKeys.apiKey, process.env.SENDINBLUE_API_KEY);
// Admin Sender
var sender = {
    email: "shaikhobaid123@gmail.com",
    name: "Ubed Shaikh",
};
// sibEmailInstance.sendTransacEmail(sibMail.SendSmtpEmail)
var sendWelcomeEmail = function (email, name) {
    return sibEmailInstance.sendTransacEmail({
        sender: sender,
        to: [{ email: email }],
        subject: "Thanks for joining in!",
        textContent: "Welcome ".concat(name.toUpperCase(), "! Go legend in a month with our AI Task Tracking service."),
        htmlContent: "\n        <!DOCTYPE html>\n<html>\n<head>\n\t<meta charset=\"UTF-8\">\n\t<title>Transaction Notification</title>\n\t<style>\n\t\tbody {\n\t\t\tfont-family: Arial, sans-serif;\n\t\t\tbackground-color: #f6f6f6;\n\t\t\tcolor: #444444;\n\t\t\tline-height: 1.6em;\n\t\t\tpadding: 20px;\n\t\t\tmargin: 0;\n\t\t}\n\n\t\t.container {\n\t\t\tmax-width: 600px;\n\t\t\tmargin: 0 auto;\n\t\t\tbackground-color: #ffffff;\n\t\t\tpadding: 20px;\n\t\t\tbox-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n\t\t\tborder-radius: 5px;\n\t\t}\n\n\t\th1 {\n\t\t\tfont-size: 24px;\n\t\t\tmargin-top: 0;\n\t\t\ttext-align: center;\n\t\t}\n\n\t\tp {\n\t\t\tmargin-bottom: 20px;\n\t\t}\n\n\t\t.button {\n\t\t\tdisplay: inline-block;\n\t\t\tbackground-color: #4CAF50;\n\t\t\tcolor: #ffffff;\n\t\t\ttext-align: center;\n\t\t\tpadding: 10px 20px;\n\t\t\ttext-decoration: none;\n\t\t\tborder-radius: 5px;\n\t\t}\n\n\t\t.button:hover {\n\t\t\tbackground-color: #3e8e41;\n\t\t}\n\n\t\t.footer {\n\t\t\tfont-size: 12px;\n\t\t\tcolor: #999999;\n\t\t\ttext-align: center;\n\t\t\tmargin-top: 50px;\n\t\t\tpadding-top: 20px;\n\t\t\tborder-top: 1px solid #cccccc;\n\t\t}\n\t</style>\n</head>\n<body>\n\t<div class=\"container\">\n\t\t<h1>Account Created Successfully!</h1>\n\t\t<p>Hello <strong>".concat(name.toUpperCase(), "</strong>,</p>\n\t\t\t<p>Thank you for choosing Taskify. Go legend in a month with our AI Task Tracking service.</p>\n\t\t\t<p>If you have any questions or concerns, please don't hesitate to contact us.</p>\n\t\t\t<a href=\"https://ubedshaikh.netlify.app/home\" class=\"button\">Visit developer's website</a>\n\t\t</div>\n\t\t<div class=\"footer\">\n\t\t\t<p>This email was sent to ").concat(email.toLowerCase(), " because you made a transaction with us.</p>\n\t\t</div>\n\t</div>\n</body>\n</html>\n        "),
    });
};
exports.sendWelcomeEmail = sendWelcomeEmail;
var sendCancellationEmail = function (email, name) {
    return sibEmailInstance.sendTransacEmail({
        sender: sender,
        to: [{ email: email }],
        subject: "Sorry to see you go :)",
        textContent: "GoodBye ".concat(name.toUpperCase(), "! I Hope to see you back sometime soon."),
        htmlContent: "\n        <!DOCTYPE html>\n<html>\n<head>\n\t<meta charset=\"UTF-8\">\n\t<title>Transaction Notification</title>\n\t<style>\n\t\tbody {\n\t\t\tfont-family: Arial, sans-serif;\n\t\t\tbackground-color: #f6f6f6;\n\t\t\tcolor: #444444;\n\t\t\tline-height: 1.6em;\n\t\t\tpadding: 20px;\n\t\t\tmargin: 0;\n\t\t}\n\n\t\t.container {\n\t\t\tmax-width: 600px;\n\t\t\tmargin: 0 auto;\n\t\t\tbackground-color: #ffffff;\n\t\t\tpadding: 20px;\n\t\t\tbox-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n\t\t\tborder-radius: 5px;\n\t\t}\n\n\t\th1 {\n\t\t\tfont-size: 24px;\n\t\t\tmargin-top: 0;\n\t\t\ttext-align: center;\n\t\t}\n\n\t\tp {\n\t\t\tmargin-bottom: 20px;\n\t\t}\n\n\t\t.button {\n\t\t\tdisplay: inline-block;\n\t\t\tbackground-color: #4CAF50;\n\t\t\tcolor: #ffffff;\n\t\t\ttext-align: center;\n\t\t\tpadding: 10px 20px;\n\t\t\ttext-decoration: none;\n\t\t\tborder-radius: 5px;\n\t\t}\n\n\t\t.button:hover {\n\t\t\tbackground-color: #3e8e41;\n\t\t}\n\n\t\t.footer {\n\t\t\tfont-size: 12px;\n\t\t\tcolor: #999999;\n\t\t\ttext-align: center;\n\t\t\tmargin-top: 50px;\n\t\t\tpadding-top: 20px;\n\t\t\tborder-top: 1px solid #cccccc;\n\t\t}\n\t</style>\n</head>\n<body>\n\t<div class=\"container\">\n\t\t<h1>Account Deleted Successfully</h1>\n\t\t<p>GoodBye <strong>".concat(name.toUpperCase(), "</strong>,</p>\n\t\t\t<p>I Hope to see you back sometime soon.</p>\n\t\t\t<p>If you have any questions or concerns, please don't hesitate to contact us.</p>\n\t\t\t<a href=\"https://ubedshaikh.netlify.app/home\" class=\"button\">Visit developer's website</a>\n\t\t</div>\n\t\t<div class=\"footer\">\n\t\t\t<p>This email was sent to ").concat(email.toLowerCase(), " because you made a transaction with us.</p>\n\t\t</div>\n\t</div>\n</body>\n</html>\n        "),
    });
};
exports.sendCancellationEmail = sendCancellationEmail;
