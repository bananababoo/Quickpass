import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import useDynamoDB from '../../utils/dynamodb';
import { Period, PeriodSchema } from '~~/schema/period';

export default defineEventHandler(async (event) => {

  let client = useDynamoDB();

  const roomId = getRouterParam(event, 'roomId');

  console.log('Fetching periods within room with ID:', roomId);

  if (!roomId) {
    throw createError({ statusCode: 400, statusMessage: 'roomId is required' });
  }

  let queryOptions = {
    TableName: 'periods',
    IndexName: 'RoomIdIndex',
    KeyConditionExpression: 'roomId = :s',
    ExpressionAttributeValues: {
      ':s': roomId
    }
  }

  try {

    const { Items } = await client.send(new QueryCommand(queryOptions));

    if (!Items || Items.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Room not found' });
    }

    let scheduleDatas: Period[] = []

    for (let item of Items) {
      scheduleDatas.push(PeriodSchema.parse(item))
    }

    console.log('Fetched room:', scheduleDatas);

    return scheduleDatas;

  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch rooms',
    });
  }

});