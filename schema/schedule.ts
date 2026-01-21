import z from 'zod';

export const ClientScheduleSchema = z.object({
  schoolId: z.string().min(1),
  scheduleName: z.string().min(1),
  times: z.array(z.object({
    time: z.string().min(1),
    durationMinutes: z.number().min(1)
  })).optional() // timeId and time duration in minutes
})

export type ClientSchedule = z.infer<typeof ClientScheduleSchema>

export const ServerScheduleSchema = ClientScheduleSchema.extend({
  scheduleId: z.uuid().default(() => crypto.randomUUID()),
  isActive: z.boolean().default(false)
});

export type ServerSchedule = z.infer<typeof ServerScheduleSchema>;
