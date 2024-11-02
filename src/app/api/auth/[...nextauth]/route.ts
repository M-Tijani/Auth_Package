import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
  }
  interface JWT {
    id: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Invalid credentials");
        }

        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("No user found with this email or password is wrong");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email;

        if (!email) {
          return false;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: email,
              name: user.name,
              provider: "google",
              providerId: user.id,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      } else if (token) {
        session.user = {
          id: token.id as string,
          name: null,
          email: null,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
