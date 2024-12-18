# Authentication Starter Kit

A complete starter kit for implementing robust user authentication in Next.js projects, including Google OAuth and form validation. This kit simplifies the integration of a modern authentication stack with best practices.

![App Screenshot](https://i.ibb.co/LhKyQ80/1.png)

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
   git clone https://github.com/M-Tijani/Auth_Package
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

4. Prisma Schema:

   ```bash
   npx prisma generate
   ```
   
5. Install the packeges:

   ```bash
   npm run dev
   or
   pnpm run dev
   ```

6.Open http://localhost:3000 to see your application in action.
