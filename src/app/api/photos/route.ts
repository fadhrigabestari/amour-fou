import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "";
const S3_BASE_URL = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "ap-southeast-1"}.amazonaws.com`;

export async function GET() {
  try {
    const [landscapeData, portraitData] = await Promise.all([
      s3Client.send(
        new ListObjectsV2Command({
          Bucket: BUCKET_NAME,
          Prefix: "prewed/landscape/",
        })
      ),
      s3Client.send(
        new ListObjectsV2Command({
          Bucket: BUCKET_NAME,
          Prefix: "prewed/portrait/",
        })
      ),
    ]);

    const landscapePhotos =
      landscapeData.Contents?.filter((item) =>
        /\.(jpg|jpeg|png|webp)$/i.test(item.Key || "")
      ).map((item) => ({
        src: `${S3_BASE_URL}/${item.Key}`,
        alt: `Adristi and Fadhriga landscape`,
        orientation: "landscape",
      })) || [];

    const portraitPhotos =
      portraitData.Contents?.filter((item) =>
        /\.(jpg|jpeg|png|webp)$/i.test(item.Key || "")
      ).map((item) => ({
        src: `${S3_BASE_URL}/${item.Key}`,
        alt: `Adristi and Fadhriga portrait`,
        orientation: "portrait",
      })) || [];

    return NextResponse.json({
      landscape: landscapePhotos,
      portrait: portraitPhotos,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}