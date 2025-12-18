import { z } from 'zod';

export const RoomSchema = z.object({
    roomId: z.uuid(),
})

export type Room = z.infer<typeof RoomSchema>