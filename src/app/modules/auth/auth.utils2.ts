//
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';

export const createToken = (
  jwtPayload: {
    userId: Types.ObjectId;
    name: { firstName: string; lastName: string } | null | undefined;
    email: string;
    isActive: boolean;
    role: 'admin' | 'recruiter' | 'candidate';
  },
  secret: Secret,
  expireIn: string,
) => {
  const accessToken = jwt.sign(jwtPayload, secret, {
    expiresIn: expireIn,
  } as SignOptions);

  return accessToken;
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
