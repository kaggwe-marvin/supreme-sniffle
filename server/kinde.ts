import {createKindeServerClient, GrantType, type SessionManager, type UserType} from "@kinde-oss/kinde-typescript-sdk";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import  {Hono,type Context} from "hono";
import { createFactory, createMiddleware } from 'hono/factory'


export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
});

  let store: Record<string, unknown> = {};

  export const sessionManager = (c: Context): SessionManager => ({
    async getSessionItem(key: string) {
      return getCookie(c, key);
    },
    async setSessionItem(key: string, value: unknown) {
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        SameSite: "Lax"
      };
      if (typeof value === "string") {
        setCookie(c, key, value, cookieOptions);
      } else {
        setCookie(c, key, JSON.stringify(value), cookieOptions);
      }
    },
    async removeSessionItem(key: string) {
      deleteCookie(c, key, { path: "/" });
    },
    async destroySession() {
      ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
        deleteCookie(c, key, { path: "/" });
      });
    }
  });

  type Env = {
    Variables: {
      user: UserType;
    }
  }
  

  export const getUser = createMiddleware<Env>(async (c, next) => {
    try {
        const manager = sessionManager(c);
        const isAuthenticated = await kindeClient.isAuthenticated(manager);
        
        if (!isAuthenticated) {
          return c.json({ error: "User is not authenticated"}, 401);
        } 
        const user = await kindeClient.getUserProfile(manager);
        return c.json({ user})
        await next()
    } catch (e) {
        console.error(e);
        return c.json({ error: "Unauthorized"}, 401)
    }
    
  })