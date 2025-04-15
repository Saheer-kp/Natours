const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');
const mailjetTransport = require('nodemailer-mailjet-transport');



module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Shaheer <${process.env.EMAIL_FROM}>`;
  }


  newTransport() {
    if(process.env.NODE_ENV === 'production'){
    //  return nodemailer.createTransport(mailjetTransport({
    //     auth: {
    //       apiKey: process.env.MAILJET_KEY,
    //       apiSecret: process.env.MAILJET_SECRET
    //     }
    //   }));
      return nodemailer.createTransport({
        service: 'MailJet',
        auth: {
          user: process.env.MAILJET_KEY,
          pass: process.env.MAILJET_SECRET
        }
    });
    //  return nodemailer.createTransport({
    //     host: 'in-v3.mailjet.com', // Mailjet SMTP server
    //     port: 587, // Use 587 for TLS or 465 for SSL
    //     secure: false, // Set to true if using port 465
    //     auth: {
    //       user: process.env.MAILJET_KEY, // Your Mailjet API key
    //       pass:  process.env.MAILJET_SECRET // Your Mailjet secret key
    //     }
    //   });
    }

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
      // text: options.message,
    }

    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to natures');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Reset your password');
  }
}


// const sendEmail = async options => {
//   const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//           user: process.env.EMAIL_USERNAME,
//           pass: process.env.EMAIL_PASSWORD
//         }
//     });

//   const mailOptions = {
//     from: `Shaheer <${process.env.EMAIL_FROM}>`,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html: options.html
//   }

//   await transporter.sendMail(mailOptions);
// }

// module.exports = sendEmail;