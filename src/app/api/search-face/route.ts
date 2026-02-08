import { NextRequest, NextResponse } from "next/server";
import {
  RekognitionClient,
  SearchFacesByImageCommand,
} from "@aws-sdk/client-rekognition";

const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const COLLECTION_ID = process.env.AWS_REKOGNITION_COLLECTION_ID || "wedding-faces";
const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || "";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const searchCommand = new SearchFacesByImageCommand({
      CollectionId: COLLECTION_ID,
      Image: { Bytes: buffer },
      MaxFaces: 50,
      FaceMatchThreshold: 70,
    });

    const searchResult = await rekognitionClient.send(searchCommand);

    if (!searchResult.FaceMatches || searchResult.FaceMatches.length === 0) {
      return NextResponse.json({ matches: [] });
    }

    const matches = searchResult.FaceMatches
      .map((match) => {
        const externalImageId = match.Face?.ExternalImageId || "";
        const originalPath = externalImageId.replace(/:/g, '/');
        
        return {
          src: `${CLOUDFRONT_URL}/${originalPath}`,
          similarity: match.Similarity || 0,
        };
      })
      .filter((match) => match.src.includes("prewed/"));

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Face search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}