import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb'
import useDynamoDB from '../../../utils/dynamodb'

export default defineEventHandler(async (event) => {

    let client = useDynamoDB()

    const schoolId = getRouterParam(event, 'schoolId')
    console.log('Fetching school with ID:', schoolId)

    if (!schoolId) {
        throw createError({ statusCode: 400, statusMessage: 'schoolId is required' })
    }

    let updateOptions: UpdateCommandInput = {
        TableName: 'schedules',
        Key: {
            id: schoolId
        },
        UpdateExpression: 'SET isActive = :active',
        ExpressionAttributeNames: {
            '#isActive': 'isActive'
        },
        ExpressionAttributeValues: {
            ':active': true
        },
        ReturnValues: 'ALL_NEW'
    }

    try {

        await client.send(new UpdateCommand(updateOptions))

        return { success: true }

    } catch (err) {
        console.error(err);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch passes',
        })
    }

})