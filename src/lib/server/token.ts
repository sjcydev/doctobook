import { generateRandomString, isWithinExpiration } from "lucia/utils";
import { prisma } from "./prisma";

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
  const storedUserTokens = await prisma.email_verification_token.findFirst({
    where: {
      user_id: userId,
    },
  });
  if (storedUserTokens.length > 0) {
    const reusableStoredToken = isWithinExpiration(
      Number(storedUserTokens.expires) - EXPIRES_IN / 2
    );
    if (reusableStoredToken) return storedUserTokens.id;
  }
  const token = generateRandomString(63);
  await prisma.email_verification_token.create({
    data: {
      id: token,
      expires: new Date().getTime() + EXPIRES_IN,
      user_id: userId,
    },
  });

  return token;
};

export const validateEmailVerificationToken = async (token: string) => {
  const storedToken = await prisma.email_verification_token.findUnique({
    where: {
      id: token,
    },
  });

  if (!storedToken) throw new Error("Invalid Token");

  await prisma.email_verification_token.delete({
    where: {
      user_id: storedToken.user_id,
    },
  });

  const tokenExpires = Number(storedToken.expires);
  if (!isWithinExpiration(tokenExpires)) {
    throw new Error("Expired token");
  }
  return storedToken.user_id;
};
