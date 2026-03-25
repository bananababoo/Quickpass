import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import useDynamoDB from '../../utils/dynamodb'
import { ServerSchedule, ServerScheduleSchema } from '~~/schema/schedule'

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
            return []
        }

        console.log('Fetched schedule:', Items)

        let scheduleDatas: ServerSchedule[] = []

        for (let item of Items) {
            scheduleDatas.push(ServerScheduleSchema.parse(item))
        }

        return scheduleDatas

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