import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { dark, light, noSidebar } from "@adminjs/themes";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/user.js";
import Bus from "../models/bus.js";
import Ticket from "../models/ticket.js";
import { COOKIE_PASSWORD } from "./config.js";

AdminJS.registerAdapter(AdminJSMongoose);

const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL_LOGIN,
  password: process.env.ADMIN_LOGIN_PASSWORD,
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password == DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

export const buildAdminJS = async (app) => {
  const admin = new AdminJS({
    resources: [{ resource: User }, { resource: Bus }, { resource: Ticket }],
    branding: {
      companyName: "Bus Ways",
      withMadeWithLove: false,
    },
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
    rootPath: "/admin",
  });

  const MongoDBStore = ConnectMongoDBSession(session);
  const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: "uri",
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: "adminjs",
      cookiePassword: process.env.COOKIE_PASSWORD,
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV == "production",
        secure: process.env.NODE_ENV == "production",
      },
      name: "adminjs",
    }
  );

  app.use(admin.options.rootPath, adminRouter);
};
