import { z } from 'zod';

export const NewPeriodSchema = z.object({
    roomId: z.uuid(),
    periodName: z.string().min(1, { message: "Period name cannot be empty" }),
    scheduleIndex: z.int(),
})

export type NewPeriod = z.infer<typeof NewPeriodSchema>