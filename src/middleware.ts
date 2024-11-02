import { NextResponse, NextRequest } from "next/server";

// First middleware (Your logic)
function validateTokenMiddleware(request: NextRequest) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

function exampleMiddleware(request: NextRequest) {
  console.log("Example middleware");
  return NextResponse.next();
}

export function middleware(request: NextRequest) {
  let response = validateTokenMiddleware(request);
  if (response?.status) return response;

  response = exampleMiddleware(request);
  if (response?.status) return response;

  return NextResponse.next();
}

export const config = {
  matcher: ["/reset_password"],
};
