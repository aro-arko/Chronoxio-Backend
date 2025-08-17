import z from "zod";

const CreateTaskValidation = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    startDate: z.string(),
    endDate: z.string().optional(),
    category: z.enum([
      "Self Improvement",
      "Workout",
      "Extra Curricular",
      "Others",
    ]),
  }),
});

const updateTaskValidation = z.object({
  body: z.object({
    status: z.enum(["pending", "completed", "expired"]).optional(),
  }),
});

const CompleteTaskValidation = z.object({
  body: z.object({
    timeSpent: z.number().min(0, "Time spent must be positive"),
  }),
});

export const TaskValidation = {
  CreateTaskValidation,
  updateTaskValidation,
  CompleteTaskValidation,
};
