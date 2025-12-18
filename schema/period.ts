import { z } from 'zod';

export const PeriodSchema = z.object({
    roomId: z.uuid(),
    periodId: z.uuid(),
    scheduleId: z.uuid().optional(),
    scheduleIndex: z.int().optional(),
    periodName: z.string().min(1, { message: "Period name cannot be empty" }),
    Students: z.array(z.string().min(1)),
})

export type Period = z.infer<typeof PeriodSchema>