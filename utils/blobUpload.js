const { BlobServiceClient } = require("@azure/storage-blob");

const azureContainerName = "yuouthopia-event-posters";
const azureConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

async function uploadToAzureBlob(base64Data, fileName) {
    console.log("HI")
  const blobServiceClient = BlobServiceClient.fromConnectionString(azureConnectionString);
  const containerClient = blobServiceClient.getContainerClient(azureContainerName);

  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  const buffer = Buffer.from(matches[2], 'base64');

  await blockBlobClient.upload(buffer, buffer.length);

  return blockBlobClient.url;
}

module.expors={uploadToAzureBlob}
