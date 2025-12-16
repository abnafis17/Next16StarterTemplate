// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(_request: NextRequest) {
  // Do nothing: allow request to continue normally
  return NextResponse.next();
}

// Optional: limit where it runs (recommended to avoid touching everything)
export const config = {
  matcher: ["/api/:path*"], // only intercept /api routes
};
