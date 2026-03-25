import { z } from 'zod';

export const RoomSchema = z.object({
    roomId: z.string(),
    roomName: z.string(),
})

export type Room = z.infer<typeof RoomSchema>