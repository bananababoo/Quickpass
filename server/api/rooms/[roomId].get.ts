import { GetCommand } from '@aws-sdk/lib-dynamodb';
import useDynamoDB from '../../utils/dynamodb';
import { RoomSchema } from '~~/schema/room';

export default defineEventHandler(async (event) => {

  let client = useDynamoDB();

  const roomId = getRouterParam(event, 'userId');

  console.log('Fetching user with ID:', roomId);

  if (!roomId) {
    throw createError({ statusCode: 400, statusMessage: 'roomId is required' });
  }

  let queryOptions = {
    TableName: 'users',
    Key: {
      userId: roomId
    }
  }

  try {

    const { Item } = await client.send(new GetCommand(queryOptions));

    if (!Item) {
      throw createError({ statusCode: 404, statusMessage: 'Room not found' });
    }

    let roomData = RoomSchema.parse(Item);

    console.log('Fetched room:', roomData);

    return roomData

  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch rooms',
    });
  }

});