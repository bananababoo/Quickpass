import { PutCommand } from '@aws-sdk/lib-dynamodb';
import useDynamoDB from '../../utils/dynamodb';
import { ClientScheduleSchema, ServerSchedule } from '~/../schema/schedule'

export default defineEventHandler(async (event) => {

    let client = useDynamoDB();

    const rawScheduleData = await readBody(event);

    console.log('Adding new Schedule:', rawScheduleData);

    const scheduleData = await readValidatedBody(event, (data) => ClientScheduleSchema.parse(data));
    
    const serverScheduleData: ServerSchedule = {
        ...scheduleData,
        scheduleId: crypto.randomUUID()
    };

    let queryOptions = {
        TableName: 'schedules',
        Item: serverScheduleData
    }


    try {
        await client.send(new PutCommand(queryOptions));
        console.log('Schedule added successfully to school:', serverScheduleData.schoolId);
        return serverScheduleData;

    } catch (err) {
        console.error(err);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch schedules',
        });
    }

});