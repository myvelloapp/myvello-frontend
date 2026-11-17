import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "myvello.mobileconfig");
    if (!fs.existsSync(filePath)) {
      return new NextResponse("Configuration profile not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/x-apple-aspen-config",
        "Content-Disposition": 'attachment; filename="myvello.mobileconfig"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Error serving mobileconfig:", err);
    return new NextResponse("Error serving iOS profile", { status: 500 });
  }
}
