import { Hono } from "hono";
import { getUser, kindeClient, sessionManager } from "../kinde";

export const authRoute = new Hono()
  .get("/login", async (c) => {
    try {
      const loginUrl = await kindeClient.login(sessionManager(c));
      return c.redirect(loginUrl.toString());
    } catch (error) {
      console.error("Login error:", error);
      return c.text("An error occurred during login", 500);
    }
  })
  .get("/register", async (c) => {
    try {
      const registerUrl = await kindeClient.register(sessionManager(c));
      return c.redirect(registerUrl.toString());
    } catch (error) {
      console.error("Registration error:", error);
      return c.text("An error occurred during registration", 500);
    }
  })
  .get("/callback", async (c) => {
    try {
      const url = new URL(c.req.url);
      await kindeClient.handleRedirectToApp(sessionManager(c), url);
      return c.redirect("/");
    } catch (error) {
      console.error("Callback error:", error);
      return c.text("An error occurred during authentication callback", 500);
    }
  })
  .get("/logout", async (c) => {
    try {
      const logoutUrl = await kindeClient.logout(sessionManager(c));
      return c.redirect(logoutUrl.toString());
    } catch (error) {
      console.error("Logout error:", error);
      return c.text("An error occurred during logout", 500);
    }
  })
  .get("/me", getUser, async (c) => {
     const user = c.var.user
      return c.json({ user})
    
  });