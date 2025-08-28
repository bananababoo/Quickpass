import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

let client: DynamoDBDocumentClient;

export default function useDynamoDB() {
  if (!client) {
    
    client = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: 'us-east-2',
      })
    )
  }
  return client
}