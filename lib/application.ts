import { z } from "zod";
import { tracks } from "./data";
export const applicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "이름을 2자 이상 입력해 주세요.")
    .max(30, "이름은 30자 이하로 입력해 주세요."),
  studentId: z
    .string()
    .trim()
    .regex(/^\d{7,10}$/, "학번은 숫자 7자리 이상 10자리 이하로 입력해 주세요."),
  department: z.string().trim().min(2, "학과를 입력해 주세요.").max(60),
  phone: z
    .string()
    .trim()
    .regex(
      /^01[016789]-?\d{3,4}-?\d{4}$/,
      "올바른 휴대전화 번호를 입력해 주세요.",
    ),
  email: z.email("올바른 이메일 주소를 입력해 주세요.").max(254),
  track: z.enum(tracks, { error: "지원 분야를 선택해 주세요." }),
  motivation: z
    .string()
    .trim()
    .min(20, "지원 동기를 20자 이상 입력해 주세요.")
    .max(500, "지원 동기는 500자 이하로 입력해 주세요."),
  portfolio: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => !v || (/^https?:\/\//i.test(v) && URL.canParse(v)),
      "http 또는 https로 시작하는 URL을 입력해 주세요.",
    ),
  consent: z.literal(true, { error: "개인정보 수집 및 이용에 동의해 주세요." }),
  website: z.string().max(0).optional(),
});
export type Application = z.infer<typeof applicationSchema>;
