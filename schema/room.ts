import { z } from 'zod';

export const RoomSchema = z.object({
    roomId: z.uuid(),
    RoomName: z.string().min(1, { message: "Room name cannot be empty"})
})

export type Room = z.infer<typeof RoomSchema>