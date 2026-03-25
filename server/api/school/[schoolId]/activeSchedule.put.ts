import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import useDynamoDB from '../../../utils/dynamodb'

export default defineEventHandler(async (event) => {

  let client = useDynamoDB()

  const body = await readBody(event);
  const schoolId = getRouterParam(event, 'schoolId')!!;
  const scheduleId: string = body["scheduleId"]

  console.log('Setting active schedule with ID:', scheduleId)

  if (!scheduleId) {
    throw createError({ statusCode: 400, statusMessage: 'scheduleId is required' })
  }

  try {

    await client.send(new UpdateCommand({
      TableName: 'schools',
      Key: { schoolId: schoolId },
      UpdateExpression: 'SET activeScheduleId = :activeScheduleId',
      ExpressionAttributeValues: {
        ':activeScheduleId': scheduleId
      }
    }))

    return { success: true }

  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch passes',
    })
  }

})