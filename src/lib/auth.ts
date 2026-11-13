import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const DEMO_USER_ID = "local-demo-student";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Student",
      credentials: {
        email: { label: "Электрондық пошта", type: "email" },
        password: { label: "Құпия сөз", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) return null;

        const demoEmail = process.env.DEMO_LOGIN_EMAIL?.trim().toLowerCase();
        if (
          process.env.NODE_ENV === "development" &&
          demoEmail &&
          email === demoEmail &&
          password === process.env.DEMO_LOGIN_PASSWORD
        ) {
          return {
            id: DEMO_USER_ID,
            name: process.env.DEMO_LOGIN_NAME ?? "Тест студенті",
            email: demoEmail,
            role: "student",
          };
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "student";
      }
      return session;
    },
  },
};
