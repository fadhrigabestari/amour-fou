const { IndexFacesCommand } = require("@aws-sdk/client-rekognition");
const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { s3Client, rekognitionClient } = require("../src/lib/aws-config");
require('dotenv').config({ path: '.env.local' });

const AWS_REGION = process.env.AWS_REGION?.trim();
const BUCKET_NAME = process.env.AWS_S3_BUCKET?.trim();
const COLLECTION_ID = process.env.AWS_REKOGNITION_COLLECTION_ID?.trim();

if (!AWS_REGION || !BUCKET_NAME || !COLLECTION_ID) {
  console.error("Missing required environment variables");
  process.exit(1);
}

async function getAllImages(prefix) {
  const images = [];
  let continuationToken;

  do {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);

    if (response.Contents) {
      const imageFiles = response.Contents.filter((item) =>
        /\.(jpg|jpeg|png|webp)$/i.test(item.Key)
      );
      images.push(...imageFiles.map((item) => item.Key));
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return images;
}

async function indexFace(imageKey) {
  try {
    const externalImageId = imageKey.replace(/\//g, ':');
    
    const command = new IndexFacesCommand({
      CollectionId: COLLECTION_ID,
      Image: {
        S3Object: {
          Bucket: BUCKET_NAME,
          Name: imageKey,
        },
      },
      ExternalImageId: externalImageId,
      MaxFaces: 10,
      QualityFilter: "AUTO",
      DetectionAttributes: ["DEFAULT"],
    });

    const response = await rekognitionClient.send(command);

    if (response.FaceRecords && response.FaceRecords.length > 0) {
      console.log(`✓ Indexed ${response.FaceRecords.length} face(s) in: ${imageKey}`);
      return { success: true, faces: response.FaceRecords.length };
    } else {
      console.log(`⚠ No faces detected in: ${imageKey}`);
      return { success: false, faces: 0 };
    }
  } catch (error) {
    if (error.name === "InvalidParameterException") {
      console.log(`⚠ Invalid image or no faces: ${imageKey}`);
    } else {
      console.error(`✗ Error indexing ${imageKey}:`, error.message);
    }
    return { success: false, faces: 0 };
  }
}

async function indexAllFaces(pathname = "prewed/") {
  console.log(`\nStarting face indexing for path: ${pathname}\n`);

  const images = await getAllImages(pathname);
  console.log(`Found ${images.length} images to process\n`);

  let indexed = 0;
  let failed = 0;
  let totalFaces = 0;

  for (const imageKey of images) {
    const result = await indexFace(imageKey);
    if (result.success) {
      indexed++;
      totalFaces += result.faces;
    } else {
      failed++;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`\n--- Summary ---`);
  console.log(`Total images: ${images.length}`);
  console.log(`Successfully indexed: ${indexed}`);
  console.log(`Failed/No faces: ${failed}`);
  console.log(`Total faces indexed: ${totalFaces}`);
}

const pathname = process.argv[2] || "prewed/";
indexAllFaces(pathname).catch(console.error);