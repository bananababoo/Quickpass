import { GetCommand } from '@aws-sdk/lib-dynamodb';
import useDynamoDB from '../../utils/dynamodb';
import { User, UserSchema } from '../../../schema/user';

export default defineEventHandler(async (event) => {

  let client = useDynamoDB();

  const userId = getRouterParam(event, 'userId');

  console.log('Fetching user with ID:', userId);

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId is required' });
  }

  let queryOptions = {
    TableName: 'users',
    Key: {
      userId: userId
    }
  }

  try {

    const { Item } = await client.send(new GetCommand(queryOptions));

    if (!Item) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' });
    }

    console.log('Fetched user:', Item);

    let userData: User = UserSchema.parse(Item);

    return userData

  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch passes',
    });
  }

});