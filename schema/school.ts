import { z } from 'zod';

export const SchoolSchema = z.object({
    schoolId: z.string(),
    activeScheduleId: z.string().optional()
})

export type School = z.infer<typeof SchoolSchema>