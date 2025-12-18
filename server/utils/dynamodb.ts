import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

let client: DynamoDBDocumentClient;

export default function useDynamoDB() {
  if (!client) {
    
    client = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: 'us-east-2',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
      })
    )
  }
  return client
}