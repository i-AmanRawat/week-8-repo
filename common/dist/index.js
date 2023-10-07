"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoInput = exports.signupInput = void 0;
const zod_1 = require("zod");
exports.signupInput = zod_1.z.object({
    username: zod_1.z
        .string()
        .email({
        message: "Invalid email. Please enter a valid email address",
    })
        .min(1)
        .max(15)
        .trim(),
    password: zod_1.z.string().min(6).max(15),
});
exports.todoInput = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
});
