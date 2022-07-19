

const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { S3 } = require('@aws-sdk/client-s3');
const AWSXRay = require('aws-xray-sdk');

const s3 = AWSXRay.captureAWSv3Client(new S3({}));

const getMetadataFromDocument = doc => {
  return {
    author: doc.getAuthor(),
    createdDate: doc.getCreationDate(),
    modifiedDate: doc.getModificationDate(),
    pageCount: doc.getPageCount(),
    title: doc.getTitle(),
    keywords: doc.getKeywords(),
  };
};

const getBufferFromIncomingMessage = (stream) => {
  return new Promise((resolve, reject) => {
    const output = [];
    stream.on('data', chunk => output.push(chunk))
    stream.once('end', () => resolve(Buffer.concat(output)))
    stream.once('error', reject)
  })
}

exports.handler = async event => {

  console.log({ 
    message: 'Get document metadata STARTED',
    event
   })

  // Make sure we are getting an S3 event
  if (event.source !== 'aws.s3') {
    throw new Error('Invalid source event');
  }

  // Check file extension
  const extension = path.extname(event.detail.object.key);
  if (extension.toLowerCase() !== '.pdf') {
    throw new Error('Unsupported file type');
  }

  // Download file
  const getObjectParams = {
    Key: event.detail.object.key,
    Bucket: event.detail.bucket.name,
  };

  let fileData, document, metadata;

  try {
    const result = await s3.getObject(getObjectParams);
    console.log('S3 Command Executed')
    fileData = await getBufferFromIncomingMessage(result.Body);
    console.log('Buffer created')

    // Get PDF metadata
    const metadataParams = {
      updateMetadata: false,
    };
    console.log({ message: 'Loading PDF File...' })
    document = await PDFDocument.load(fileData, metadataParams);
    metadata = getMetadataFromDocument(document);
    console.log({
      message: 'Metadata returned',
      metadata
    })
  } catch(err) {
    console.log({ err })
  }
  
  return {
    file: {
      key: event.detail.object.key,
      bucket: event.detail.bucket.name,
      size: fileData.length,
    },
    metadata,
  };
};
