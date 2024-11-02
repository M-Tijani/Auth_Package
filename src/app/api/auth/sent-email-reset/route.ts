import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ message: "Email not found" }, { status: 404 });
  } else {
    const _id = user?.id;
    const token = await new SignJWT({ _id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    try {
      const resetLink = `http://localhost:3000/reset_password?token=${token}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"Authorization Server" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Password Reset Request",
        text: `Click the link to reset your password: ${resetLink}`,
        html: `
     <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <tr>
            <td style="padding: 30px 20px; background: linear-gradient(to right, #3498db, #2980b9); text-align: center;">
                <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 10px;">Password Reset Request</h2>
                <p style="color: #e6e6e6; font-size: 16px; margin: 0;">We've got you covered</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px 20px;">
                <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">Hello,</p>
                <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">We received a request to reset your password. Please click the button below to proceed:</p>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                        <td align="center">
                            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #3498db; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 5px;">Reset Password</a>
                        </td>
                    </tr>
                </table>
                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0 10px;">If the button above doesn't work, you can also click on the link below or copy and paste it into your browser:</p>
                <p style="font-size: 14px; line-height: 1.5; margin: 0 0 20px; word-break: break-all;">
                    <a href="${resetLink}" style="color: #3498db; text-decoration: underline;">${resetLink}</a>
                </p>
                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0;">If you didn't request a password reset, please ignore this email or contact our support team if you have any concerns.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #f8f8f8; text-align: center; font-size: 12px; color: #888888;">
                This is an automated message from the Authorization Server. Please do not reply to this email.
            </td>
        </tr>
    </table>
  `,
      });

      return NextResponse.json({
        message: "Password reset email sent",
        resetLink: resetLink,
      });
    } catch (err: any | Error) {
      console.error("Error sending email:", err);
      return NextResponse.json({ message: "Internal server error" });
    }
  }
}
