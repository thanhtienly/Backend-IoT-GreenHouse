import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env.local',
});

export const accessTokenConfig = {
  expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  secret: process.env.JWT_ACCESS_SECRET,
};

export const refreshTokenConfig = {
  expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  secret: process.env.JWT_REFRESH_SECRET,
};
