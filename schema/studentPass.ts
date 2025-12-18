import { z } from 'zod';

export const StudentPassSchema = z.object({
    passId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    studentId: z.string()
})

export type StudentPass = z.infer<typeof StudentPassSchema>