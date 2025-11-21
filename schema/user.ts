import { z } from 'zod';

const UserRoleSchema = z.enum(['teacher', 'admin'])

export const UserSchema = z.object({
    userId: z.string(),
    Name: z.string().min(1, { message: "User name cannot be empty"}),
    Role: UserRoleSchema,
    School: z.string().min(1, { message: "School name cannot be empty"})
})

export type User = z.infer<typeof UserSchema>