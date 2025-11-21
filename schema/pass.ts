import { z } from 'zod';

export const PassSchema = z.object({
    passId: z.string(),
    timestamp: z.string(),
    expired: z.boolean(),
})

export type Pass = z.infer<typeof PassSchema>