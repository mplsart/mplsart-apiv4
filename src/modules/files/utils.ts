// Utilities for Files
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';

export interface SignedUrlPayload {
  url: string;
  fileName: string;
  metadataHeaders: Record<string, string>;
}

/**
 * Generate a signed upload url for Google Cloud Storage
 * @param originalFilename Filename of original file for debugging
 * @param contentType Content type of original file for debugging
 * @param checkHash A hash put on the header for added security
 * @param userId The userId of the uploader for debugging
 * @param tmp_bucket Target GCS bucket
 * @param tmp_folder Target folder within the GCS bucket
 * @returns An object containg the singed url and headers that must be sent
 */
export async function generateV4UploadSignedUrl(
  originalFilename: string,
  contentType: string,
  checkHash: string,
  userId: string,
  tmp_bucket: string,
  tmp_folder: string
): Promise<SignedUrlPayload> {
  const storage = new Storage();
  const now = Date.now();

  // Prepare headers for the file object
  const metadataHeaders = {
    'x-goog-meta-original-filename': originalFilename,
    'x-goog-meta-checkhash': checkHash,
    'x-goog-meta-uploading-user': userId
  };

  const options: GetSignedUrlConfig = {
    version: 'v4',
    action: 'write',
    expires: now + 15 * 60 * 1000, // 15 minutes
    contentType: contentType,
    extensionHeaders: metadataHeaders
  };

  // Create the destination filename
  const fileName = `${now}`;
  const filePath = `${tmp_folder}/${fileName}`; // Destination filename

  // Get a v4 signed URL for uploading file
  const [url] = await storage
    .bucket(tmp_bucket)
    .file(filePath)
    .getSignedUrl(options);

  return { url, fileName, metadataHeaders };
}
