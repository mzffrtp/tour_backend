const nodemailer = require("nodemailer")

const sendMail = async (options) => {

    //!Transporter
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "bb07944564270d",
            pass: "3d329472163599"
        }
    });

    //!Email
    const mailOptions = {
        from: "Tourfy Customer Service, <reset-password@tourify.com>",
        to: options.email,
        subject: options.subject,
        text: options.text
    }

    //! Send email
    await transport.sendMail(mailOptions)
}

module.exports = sendMail