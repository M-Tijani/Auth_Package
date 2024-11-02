import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { registerSchema } from "@/app/schemas/registerSchema/route";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    await prisma.$connect();

    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const userExists = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (userExists) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    } else {
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
        },
      });

      return NextResponse.json({ user }, { status: 201 });
    }
  } catch (error: any | unknown) {
    console.error("Database operation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
