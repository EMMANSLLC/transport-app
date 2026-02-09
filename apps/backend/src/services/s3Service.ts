import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'private',
  };

  const result = await s3.upload(params).promise();
  return result.Location;
}

export async function getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Expires: expiresIn,
  };

  return s3.getSignedUrlPromise('getObject', params);
}

export async function deleteFromS3(key: string): Promise<void> {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
  };

  await s3.deleteObject(params).promise();
}
