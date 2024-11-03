import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 404 });
  }

  try {
    const { newPassword } = await request.json();

    if (!newPassword) {
      return NextResponse.json(
        { message: "New password is required" },
        { status: 400 }
      );
    }

    const { payload } = await jwtVerify(token, secret);
    const user = await prisma.user.findUnique({
      where: { id: payload._id as string },
    });

    const hashedPassword = await bcrypt.compare(
      newPassword,
      user?.password as string
    );
    if (hashedPassword === true) {
      return NextResponse.json(
        { message: "Password is already set" },
        { status: 409 }
      );
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: payload._id as string },
        data: { password: hashedPassword },
      });
      return NextResponse.json({ message: "Password reset successfully" });
    }
  } catch (error: any | Error) {
    return NextResponse.json({ message: error?.message }, { status: 500 });
  }
}
