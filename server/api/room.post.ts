import { PutCommand } from '@aws-sdk/lib-dynamodb';
import useDynamoDB from '../utils/dynamodb';
import { Room, RoomSchema } from '~/../schema/room'
import z from 'zod';

export default defineEventHandler(async (event) => {

  let client = useDynamoDB();

  const rawRoomData = await readBody(event);

  console.log('Adding new Room:', rawRoomData);

  let roomData: Room

  try {
    // Validate the incoming data against the schema
    roomData = RoomSchema.parse(rawRoomData);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'Validation failed',
        data: err.issues 
      });
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to process request body' });
  }

  let queryOptions = {
    TableName: 'rooms',
    Item: roomData
  }

  try {

    await client.send(new PutCommand(queryOptions));
    console.log('User added successfully:', roomData.roomId);
    return roomData;

  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch rooms',
    });
  }

});