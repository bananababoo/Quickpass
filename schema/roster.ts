import { z } from 'zod';

export const RosterSchema = z.object({
    rosterId: z.uuid(),
    RosterName: z.string().min(1, { message: "Roster name cannot be empty"}),
    roomId: z.string()
    userIds: z.array(z.string());
})

export type Roster = z.infer<typeof RosterSchema>