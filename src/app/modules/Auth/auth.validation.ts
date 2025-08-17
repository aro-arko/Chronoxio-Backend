import { z } from "zod";

const registrationValidation = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required and cannot be empty"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(28, "Password must be at most 28 characters long"),
  }),
});

const loginValidation = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(28, "Password must be at most 28 characters long"),
  }),
});

const changePasswordValidation = z.object({
  body: z.object({
    oldPassword: z
      .string({
        error: "Old password must be a string",
      })
      .min(6, {
        message: "Old password must be at least 6 characters long",
      })
      .max(100, {
        message: "Old password must be at most 32 characters long",
      }),
    newPassword: z
      .string({
        error: "New password must be a string",
      })
      .min(6, {
        message: "New password must be at least 6 characters long",
      })
      .max(100, {
        message: "New password must be at most 32 characters long",
      }),
  }),
});
const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        error: "Email must be a string",
      })
      .email({
        message: "Invalid email format",
      }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        error: "Email must be a string",
      })
      .email({
        message: "Invalid email format",
      }),
    newPassword: z
      .string({
        error: "New password must be a string",
      })
      .min(6, {
        message: "New password must be at least 6 characters long",
      })
      .max(100, {
        message: "New password must be at most 32 characters long",
      }),
  }),
});

export const authValidation = {
  registrationValidation,
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
