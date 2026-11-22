import 'dotenv/config';
import nodemailer from 'nodemailer';

async function test() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD?.replace(/\s/g, ''),
    },

    logger: true,
    debug: true,
    connectionTimeout: 30000,
    greetingTimeout: 15000,
  });

  try {
    console.log('Starting SMTP verification...');

    await transporter.verify();

    console.log('SMTP verification successful!');
  } catch (error) {
    console.error('SMTP verification failed:', {
      message: error.message,
      code: error.code,
      originalCode: error.originalCode,
      command: error.command,
      timeoutType: error.timeoutType,
    });
  } finally {
    transporter.close();
  }
}

test();