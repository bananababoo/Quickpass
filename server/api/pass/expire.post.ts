import { UpdateCommandInput, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import useDynamoDB from '../../utils/dynamodb';


export default defineEventHandler(async (event) => {

  let client = useDynamoDB();
  let passId = (await readBody(event)).passId;

  const params: UpdateCommandInput = {
    TableName: 'pass-scans',
    Key: {
      passId: passId
    },
    UpdateExpression: 'SET expired = :val',
    ExpressionAttributeValues: {
      ':val': true
    }
  }

  try {
    await client.send(new UpdateCommand(params));
    return { success: true };
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch passes',
    });
  }
});