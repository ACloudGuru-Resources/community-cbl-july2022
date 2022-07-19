const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const KSUID = require('ksuid');
const AWSXRay = require('aws-xray-sdk');

const client = AWSXRay.captureAWSv3Client(new DynamoDBClient());
const dynamoDB = DynamoDBDocumentClient.from(client);

const tableName = process.env.DYNAMO_DB_TABLE;

const getDocumentURL = event => {
  const region = process.env.AWS_REGION;
  const bucket = process.env.UPLOAD_BUCKET;
  return `http://s3.${region}.amazonaws.com/${bucket}/${event.file.key}`;
};

exports.handler = async event => {

  console.log({ 
    message: 'Insert Document Starting',
    event 
  })

  const item = {
    DocumentID: KSUID.randomSync().string,
    DateProcessed: new Date().toISOString(),
    DateUploaded: new Date().toISOString(),
    Document: getDocumentURL(event),
    FileSize: event.file.size,
    Metadata: event.metadata,
    DetectedText: event.textDetection.textOutput
  };

  console.log({ 
    message: 'Inserting item into DynamoDB',
    item
  })

  const putParams = {
    TableName: tableName,
    Item: item
  };
  await dynamoDB.send(new PutCommand(putParams))
  return;
};
