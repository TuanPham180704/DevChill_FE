import { z } from "zod";

const passwordRules = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt")
  .regex(/\d/, "Mật khẩu phải chứa ít nhất 1 chữ số");

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Tên hiển thị phải có ít nhất 3 ký tự")
      .max(30, "Tên hiển thị không dài quá 30 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: passwordRules,
    confirmPassword: z.string(),
    verify: z.boolean().refine((val) => val === true, {
      message: "Bạn phải xác minh là con người",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  });

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
