import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter required" },
        { status: 400 }
      );
    }

    const cloudFrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || "";
    if (!url.startsWith(cloudFrontUrl)) {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      );
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": blob.type,
        "Content-Disposition": "attachment",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Download failed" },
      { status: 500 }
    );
  }
}