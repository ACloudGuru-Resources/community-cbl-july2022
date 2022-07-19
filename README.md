# Cloud Builder Live - July 2022

![Cloud Builder Live Thumbnail](/images/thumbnail.jpg)

In this session, David will build a serverless Step Function using the Serverless Application Model (SAM) from AWS. You will learn how to piece together multiple AWS services and how to optimize the local development experience for serverless applications.

Watch it Live - [Cloud Builder Live - July 2022](https://www.youtube.com/watch?v=PvXSEtO6h44)  

## What Are We Building

In this episode, David will be building a document processing workflow using SAM Accelerate, Step Functions, Lambda, Textract, and S3.  This workflow will be triggered when a PDF file is uploaded to an S3 bucket.  It will grab metadata from the PDF, extract text from the document with Textract, and then insert the resulting data into DynamoDB.  All of this will be managed by a Step Function.  You can see an image of the workflow below:

![Workflow Diagram](/images/workflow.png)

## Prerequisites

If you want to follow along, there are a few things you will need to have:

- AWS Account ([Instructions](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/))
- AWS CLI ([Instructions](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html))
- Node.js ([Instructions](https://nodejs.org/en/))

In addition, I'll be walking you through the installation of the SAM CLI in the episode.  You can get those instructions here:

- SAM CLI ([Instructions](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html))

## Branches and Code

This repository has a single branch `main` which represents the state of the code at the end of the episode.  
