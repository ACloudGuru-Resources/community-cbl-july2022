const { Textract } = require('@aws-sdk/client-textract');
const AWSXRay = require('aws-xray-sdk');

const textract = AWSXRay.captureAWSv3Client(new Textract());

const getTextDetectionResults = async (event, nextToken = null) => {
  const { JobId: jobId } = event.textDetection;
  const params = {
    JobId: jobId,
    MaxResults: 1000,
  };

  if (nextToken) {
    params.NextToken = nextToken;
    console.log({
      message: 'Requesting additional information from Textract with nextToken',
      nextToken
    })
  }
  const data = await textract.getDocumentTextDetection(params);
  let textOutput = '';

  if (data.JobStatus === 'SUCCEEDED') {
    // Get blocks that are 'words' (and not pages or lines)
    const lineBlocks = data.Blocks.filter(b => b.BlockType === 'WORD');
    // Get an array of text values from these blocks
    const textFromLineBlocks = lineBlocks.map(b => b.Text);
    // Join this array of text together, by putting a space between each element
    textOutput = textFromLineBlocks.join(' ').trim();

    if (data.NextToken) {
      // Delay 1 second to avoid exceeding provisioned rate for Textract
      await new Promise(r => setTimeout(r, 1000));
      const { outputText: nextText } = await getTextDetectionResults(event, data.NextToken);
      if (nextText) {
        textOutput += ` ${nextText}`;
      }
    }
  } else if (data.JobStatus === 'FAILED') {
    throw new Error('Could not detect text from document');
  }

  return {
    JobId: jobId,
    jobStatus: data.JobStatus,
    textOutput,
  };
};

exports.handler = async event => {
  const { JobId: jobId } = event;
  console.log({
    message: 'Get Text Detection Results Starting',
    event
  })
  console.info(`Getting text detection results. JOB ID: ${jobId}`);
  const results = await getTextDetectionResults(event);
  console.log({
    message: 'Completed output text assembly',
    textOutput: results
  })
  return {
    ...event,
    textDetection: results,
  };
};
