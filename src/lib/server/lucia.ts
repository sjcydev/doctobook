import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma";
import { dev } from "$app/environment";
import { prisma } from "./prisma";

export const auth = lucia({
  adapter: prismaAdapter(prisma),
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
  getUserAttributes: (userData) => {
    return {
      userID: userData.id,
      email: userData.email,
      name: userData.name,
      emailVerified: userData.email_verified,
    };
  },
});

export type Auth = typeof auth;
