import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import useDynamoDB from '../../../utils/dynamodb'
import { SchoolSchema, School } from '../../../../schema/school'
import { ServerSchedule } from '~~/schema/schedule'

export default defineEventHandler(async (event) => {

    let client = useDynamoDB()

    const schoolId = getRouterParam(event, 'schoolId')
    console.log('Fetching school with ID:', schoolId)

    if (!schoolId) {
        throw createError({ statusCode: 400, statusMessage: 'schoolId is required' })
    }

    let queryOptions = {
        TableName: 'schools',
        KeyConditionExpression: 'schoolId = :s',
        ExpressionAttributeValues: {
            ':s': schoolId
        }
    }


    try {

        const { Items: School } = await client.send(new QueryCommand(queryOptions))

        if (!School || School.length === 0) {
            throw createError({ statusCode: 404, statusMessage: 'School not found' })
        }

        console.log('Fetched school:', School)

        
        const serverSchedule: School = SchoolSchema.parse(School[0])
        if (serverSchedule.schoolId != null) {
            const scheduleId = serverSchedule.activeScheduleId
            console.log('Found Active Schedule with id:' + scheduleId)

            let queryOptions = {
                TableName: 'schedules',
                KeyConditionExpression: 'scheduleId = :s',
                ExpressionAttributeValues: {
                    ':s': scheduleId
                }
            }
            
            const { Items } = await client.send(new QueryCommand(queryOptions))

            if (!Items || Items.length === 0) {
                throw createError({ statusCode: 404, statusMessage: 'Schedule not found' })
            }

            console.log('Fetched schedule:', Items)

            if (Items.length > 1) {
                throw createError({ statusCode: 404, statusMessage: 'Multiple Schedules with same id' })
            }

            return Items[0] as ServerSchedule
        }
        

       


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