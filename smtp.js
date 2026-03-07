/**
 * Simple SMTP Test Script
 * Run: node smtp.js
 */

const nodemailer =require('nodemailer');

// 🔴 এখানে তোমার SMTP তথ্য বসাও
constSMTP_HOST ='smtpout.secureserver.net';// GoDaddy
// Hostinger: smtp.hostinger.com
// Gmail: smtp.gmail.com

SMTP_HOST="smtp.gmail.com"
SMTP_USER="mdhamim5088@gmail.com"
SMTP_PASS="xmwt ynha biun vvqs"
SMTP_PORT=465

async function smtpTest() {
const transporter = nodemailer.createTransport({
host:SMTP_HOST,
port:SMTP_PORT,
secure:SMTP_PORT ===465,// 465 হলে true, নাহলে false
auth: {
user:SMTP_USER,
pass:SMTP_PASS,
    },
tls: {
rejectUnauthorized:false,// certificate error এলে দরকার হয়
    },
  });

try {
console.log('🔄 SMTP server check করা হচ্ছে...');
await transporter.verify();
console.log('✅ SMTP ঠিক আছে, login সফল এবং server reachable');
  }catch (error) {
console.error('❌ SMTP কাজ করছে না');
console.error('Error:', error.message);
  }
}

smtpTest();

