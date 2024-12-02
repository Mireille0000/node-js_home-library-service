import 'dotenv/config';

export const jwtConstants = {
    secret: process.env.JWT_SECRET_KEY,
    expiration_time: process.env.TOKEN_EXPIRE_TIME
};
  