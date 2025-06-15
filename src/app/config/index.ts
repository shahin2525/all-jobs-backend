import dotenv from 'dotenv';

import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  salt: process.env.SALT,
  db_url: process.env.DB_URL,
  bcrypt: process.env.SALT,
  resend: process.env.RESEND,
  NODE_ENV: process.env.NODE_ENV,
  access_secret: process.env.JWT_SECRET,
  refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRES_IN,
};
