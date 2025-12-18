import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import useDynamoDB from '../../utils/dynamodb'
import { ClientSchedule, ClientScheduleSchema } from '../../../schema/schedule'

export default defineEventHandler(async (event) => {

    let client = useDynamoDB()

    const schoolId = getRouterParam(event, 'schoolId')
    console.log('Fetching school with ID:', schoolId)

    if (!schoolId) {
        throw createError({ statusCode: 400, statusMessage: 'schoolId is required' })
    }

    let queryOptions = {
        TableName: 'schedules',
        IndexName: 'SchoolIdIndex',
        KeyConditionExpression: 'schoolId = :s',
        ExpressionAttributeValues: {
            ':s': schoolId
        }
    }

    try {

        const { Items } = await client.send(new QueryCommand(queryOptions))

        if (!Items || Items.length === 0) {
            throw createError({ statusCode: 404, statusMessage: 'Schedule not found' })
        }

        console.log('Fetched schedule:', Items)

        let scheduleDatas: ClientSchedule[] = []

        for (let item of Items) {
            console.log('Validating item:', item);
            scheduleDatas.push(ClientScheduleSchema.parse(item))
        }

        return scheduleDatas

    } catch (err) {
        console.error(err);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch passes',
        })
    }

})