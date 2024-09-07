const nodemailer = require('nodemailer');
const config = require('../config/keys');

const sendEmail = async (emailList, body) => {
  try {
    // Check if config.sendEmail exists to avoid undefined errors
    if (!config || !config.sendEmail || !config.sendEmail.user || !config.sendEmail.pass || !config.sendEmail.host) {
      throw new Error('Email configuration is missing or invalid');
    }

    console.log("Config:", config.sendEmail); // Debugging configuration

    const transporter = nodemailer.createTransport({
      host: config.sendEmail.host, // Use correct config object path
      port: 2525, // SMTP port, adjust if needed
      secure: false, // Set to true if SSL/TLS is required
      auth: {
        user: config.sendEmail.user, // Email username from config
        pass: config.sendEmail.pass // Email password from config
      }
    });

    const mailOptions = {
      from: config.sendEmail.user, // Sender email
      to: emailList.join(', '), // Recipient(s) joined by commas
      subject: 'Task Notification', // Email subject
      html: body // Email body in HTML format
    };

    // Attempt to send the email
    console.log("Sending email..."); // Debugging email sending
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response); // Debug successful email sending
    return { success: true, message: 'Email sent successfully.' };

  } catch (error) {
    // Catch any error and log it with relevant information
    console.error('Error sending email:', error.message || error);

    // Return a failed response with error details
    return { success: false, message: 'Failed to send email.', error: error.message || error };
  }
};

module.exports = sendEmail;
