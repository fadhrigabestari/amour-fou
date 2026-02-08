import { S3Client } from "@aws-sdk/client-s3";
import { RekognitionClient } from "@aws-sdk/client-rekognition";

const awsConfig = {
  region: process.env.AWS_REGION || "ap-southeast-1",
};

export const s3Client = new S3Client(awsConfig);
export const rekognitionClient = new RekognitionClient(awsConfig);

export const S3_BUCKET = process.env.S3_BUCKET_NAME;
export const REKOGNITION_COLLECTION = process.env.AWS_REKOGNITION_COLLECTION_ID;