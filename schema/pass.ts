import { z } from 'zod';

export const PassSchema = z.object({
    passId: z.string(),
    passCardId: z.string(),
    roomId: z.string(),
    cardScannedTime: z.string(),
    expired: z.boolean().optional().default(false),
})

export type Pass = z.infer<typeof PassSchema>