import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  client_url: process.env.CLIENT_URL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS),
  mail: process.env.MAIL,
  mail_password: process.env.MAIL_PASS,
  base_url_server: process.env.BASE_URL_SERVER,
  base_url_client: process.env.BASE_URL_CLIENT,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  emailSender:{
    email:process.env.EMAIL_SENDER_EMAIL,
    pass:process.env.EMAIL_SENDER_PASS
  },
  smtp:{
    host:process.env.SMTP_HOST as string,
    port:process.env.SMTP_PORT as string,
    user:process.env.SMTP_USER  as string,
    pass:process.env.SMTP_PASS as string,
    service:process.env.SMTP_SERVICE as string
  },
  admin:{
    email:process.env.ADMIN_EMAIL as string,
    password:process.env.ADMIN_PASS as string,
    salt:Number(process.env.SALT)
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY   as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string
  },
  stripe:{
    secret_key: process.env.STRIPE_SECRET_KEY as string,
  },
  redis:{
    port:process.env.REDIS_PORT,
    host:process.env.REDIS_HOST,
    password:process.env.REDIS_PASSWORD
  }
};