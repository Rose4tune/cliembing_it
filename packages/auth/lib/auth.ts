import NextAuth from "next-auth";
import { authOptions } from "./options";

export const handlers = NextAuth(authOptions);
