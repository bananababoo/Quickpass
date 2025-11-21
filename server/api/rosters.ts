import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import useDynamoDB from '../utils/dynamodb';

export default defineEventHandler(async (event) => {

  let client = useDynamoDB();

  const query = getQuery(event);

  const { roomId } = query;

  let queryOptions: ScanCommandInput = {
    TableName: 'rosters',
  }

  if (roomId) {
    queryOptions.FilterExpression = "rosterId = :rosterId";
    queryOptions.ExpressionAttributeValues = {
      ":roomId": roomId,
    };
  }

  try {
    const { Items } = await client.send(new ScanCommand(queryOptions));

    return Items
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch passes',
    });
  }

});