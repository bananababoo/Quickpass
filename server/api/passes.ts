import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import useDynamoDB from '../utils/dynamodb';

export default defineEventHandler(async (event) => {

  let client = useDynamoDB();

  let queryOptions = {
    TableName: 'pass-scans',
  }

  try {
    const { Items } = await client.send(new ScanCommand(queryOptions));
    return Items;
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch passes',
    });
  }

});