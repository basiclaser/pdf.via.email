import nodemailer from 'nodemailer';

export default async function sendEmail(link, email) {
    var transporter = nodemailer.createTransport({
        host: PUT_YOUR_EMAIL_SERVER_HERE,
        port: 465,
        secure: true,
        auth: {
          user: PUT_YOUR_EMAIL_CREDENTIALS_HERE,
          pass: PUT_YOUR_EMAIL_CREDENTIALS_HERE
        }
    });
    
    try {
        var mailOptions = {
            from: PUT_YOUR_EMAIL_HERE, 
            to: email,
            subject: 'test',
            html: `<a href=${link}>your invoice</a>`,
            text: 'your invoice'
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                throw  new Error (error.message)
            } else {
                console.log('Email sent: ' + info.response);
                return 
            }
        });
    } catch(e) {
        console.log(e);
        throw new Error("there was an error generating email verification stuff")
    }
}