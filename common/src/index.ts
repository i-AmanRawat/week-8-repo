import { z } from "zod";

export const signupInput = z.object({
  username: z
    .string()
    .email({
      message: "Invalid email. Please enter a valid email address",
    })
    .min(1)
    .max(15)
    .trim(),
  password: z.string().min(6).max(15),
});

export type SignupParams = z.infer<typeof signupInput>;

export const todoInput = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export type TodoInput = z.infer<typeof todoInput>;
