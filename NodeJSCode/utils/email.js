'use strict';
const nodemailer = require('../node_modules/nodemailer');
var Email = function() {};

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    secureConnection: false, // secure:true for port 465, secure:false for port 587
    port: 587,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: '',
        pass: ''
    }

});

Email.prototype.sendeEmail = function(data, email_list, attchments, subject) {

    let mailOptions = {
        from: '', // sender address
        to: email_list, // list of receivers
        subject: subject, // Subject line
        html: data,
        attachments: attchments
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
    //return { success: true, message: message, result: payload }

}

module.exports = new Email();