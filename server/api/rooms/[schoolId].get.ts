import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import useDynamoDB from '../../utils/dynamodb';
import { Room, RoomSchema } from '~~/schema/room';

export default defineEventHandler(async (event) => {

    let client = useDynamoDB();

    const schoolId = getRouterParam(event, 'schoolId');

    console.log('Fetching rooms with school Id:', schoolId);

    if (!schoolId) {
        throw createError({ statusCode: 400, statusMessage: 'schoolId is required' });
    }

    let queryOptions = {
        TableName: 'rooms',
        IndexName: 'SchoolIdIndex',
        KeyConditionExpression: 'schoolId = :s',
        ExpressionAttributeValues: {
            ':s': schoolId
        }
    }

    try {

        const { Items } = await client.send(new QueryCommand(queryOptions));

        if (!Items || Items.length === 0) {
            throw createError({ statusCode: 404, statusMessage: 'Room not found' });
        }

        let scheduleDatas: Room[] = []

        for (let item of Items) {
            console.log('Validating item:', item);
            scheduleDatas.push(RoomSchema.parse(item))
        }

        console.log('Fetched rooms:', scheduleDatas);

        return scheduleDatas;

    } catch (err) {
        console.error(err);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch rooms',
        });
    }

});