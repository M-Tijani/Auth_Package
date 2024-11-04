# Authentication Starter Kit

A complete starter kit for implementing robust user authentication in Next.js projects, including Google OAuth and form validation. This kit simplifies the integration of a modern authentication stack with best practices.

![App Screenshot](https://i.ibb.co/LhKyQ80/1.png)

## Tech Stack

- **Next.js**: Framework for server-side rendering and static site generation.
- **NextAuth.js**: Authentication solution for Next.js with built-in support for Google OAuth.
- **Zod**: TypeScript-first schema declaration and validation library.
- **React Hook Form**: Library for building flexible forms with minimal re-renders.
- **ShadCN Components**: Custom UI components for consistent and elegant design.
- **ShadCN Form**: Advanced forms built with the ShadCN component library.
- **Prisma**: Modern database toolkit to query, migrate, and manage data.
- **MongoDB**: NoSQL database for scalable data storage.

## Features

- **Google OAuth Integration**: Out-of-the-box support for authenticating users via Google.
- **Form Validation**: Robust client-side and server-side form validation using Zod.
- **Reusable UI Components**: Pre-built and styled components from ShadCN for faster development.
- **Data Management**: Integration with Prisma and MongoDB for handling user data.
- **Type Safety**: Full TypeScript support for safer and more reliable code.
- **Responsive Design**: UI components are mobile-friendly and accessible.

## Installation

1. Clone the repository:

   ```bash
   git clone hhttps://github.com/M-Tijani/Auth_Package
   or
   cd Auth_Package
   ```

2. Install the packeges:

   ```bash
   npm install or npm i
   or
   pnpm install or npm i
   ```

3. Set up your environment variables.:

   ```bash
   DATABASE_URL="mongodb+srv://name:password@mongodb.net"/databaseName?retryWrites=true&w=majority
   GOOGLE_CLIENT_ID=From_Google_Console
   GOOGLE_CLIENT_SECRET=From_Google_Console
   JWT_SECRET=Make_A_Unique_String
   NEXTAUTH_SECRET=Make_A_Unique_String
   MAILER_SEND_API_KEY=From_Mailjet
   GMAIL_APP_PASSWORD=Create_Your_App_Password
   GMAIL_USER=Your_Gmail_Account
   BRAND_NAME=Your_Brand_Name // "You can remove it if you want"
   PRODUCTION=https://your_domain.com
   LOCAL=http://localhost:3000
   ENVIRONMENT=LOCAL
   ```

4. Install the packeges:

   ```bash
   npm run dev
   or
   pnpm run dev
   ```

5.Open http://localhost:3000 to see your application in action.
