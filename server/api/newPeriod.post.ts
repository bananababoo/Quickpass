import { PutCommand } from '@aws-sdk/lib-dynamodb';
import useDynamoDB from '../utils/dynamodb';
import { NewPeriodSchema } from '~/../schema/newPeriod';

export default defineEventHandler(async (event) => {

  let client = useDynamoDB();

  const rawNewPeriodData = await readBody(event);

  console.log('Adding new Period:', rawNewPeriodData);

  const newPeriodData = await readValidatedBody(event, (data) => NewPeriodSchema.parse(data));

  let queryOptions = {
    TableName: 'periods',
    Item: {...newPeriodData, Students: []}
  }

  try {

    await client.send(new PutCommand(queryOptions));
    console.log('User added successfully:', newPeriodData.roomId);
    return newPeriodData;

  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch periods',
    });
  }

});