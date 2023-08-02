// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      auth: import("lucia").AuthRequest;
    }
    // interface PageData {}
    // interface Platform {}
  }
  var prisma: PrismaClient;
  /// <reference types="lucia" />
  declare namespace Lucia {
    type Auth = import("./lucia.js").Auth;
    type DatabaseUserAttributes = {
      email: string;
      name: string;
      email_verified: boolean;
      correo?: string;
    };
    type DatabaseSessionAttributes = Record<string, never>;
  }
}

export {};
