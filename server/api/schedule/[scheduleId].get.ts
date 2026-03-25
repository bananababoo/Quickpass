import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import useDynamoDB from '../../utils/dynamodb'
import { ServerSchedule } from '../../../schema/schedule'

export default defineEventHandler(async (event) => {

    let client = useDynamoDB()

    const scheduleId = getRouterParam(event, 'schoolId')
    console.log('Fetching schedule with ID:', scheduleId)

    if (!scheduleId) {
        throw createError({ statusCode: 400, statusMessage: 'schoolId is required' })
    }

    let queryOptions = {
        TableName: 'schedules',
        KeyConditionExpression: 'scheduleId = :s',
        ExpressionAttributeValues: {
            ':s': scheduleId
        }
    }

    try {

        const { Items } = await client.send(new QueryCommand(queryOptions))

        if (!Items || Items.length === 0) {
            throw createError({ statusCode: 404, statusMessage: 'Schedule not found' })
        }

        console.log('Fetched schedule:', Items)

        if (Items.length > 1) {
            throw createError({ statusCode: 404, statusMessage: 'Multiple Schedules with same id' })
        }

        return Items[0] as ServerSchedule

    } catch (err: any) {
        if (err.statusCode) {
            throw err
        }

        console.error('Unexpected Server Error:', err)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch schedule due to server error',
        })
    }

})