import { z } from "zod";

/* -------------------------------------------------------
 * 1) 단일 채팅 메시지 스키마
 * ----------------------------------------------------- */
export const ChatMsgSchema = z.object({
  _id: z.string(),                                 // Mongo ObjectId 등
  sender: z.enum(["user", "bot"]),
  message: z.string(),
  createdAt: z.string(),                           // ISO 8601 문자열
});

/* TypeScript 타입 자동 추출 */
export type ChatMessage = z.infer<typeof ChatMsgSchema>;

/* -------------------------------------------------------
 * 2) /chat/history API 응답 스키마
 *    → 백엔드에서  { history: ChatMessage[] } 형태로 반환한다고 가정
 * ----------------------------------------------------- */
export const MessageSchema = z.object({
  _id: z.string(),
  sender: z.enum(["user", "bot"]),
  text: z.string(),
  createdAt: z.string(),
  analysisData: z.any().optional(),
  resultCount: z.number().optional(),   // ✅ 추가
  results: z.array(z.any()).optional(), // ✅ 추가
});

export const HistorySchema = z.object({
  history: z.array(MessageSchema),
});

/* -------------------------------------------------------
 * 3) 헬퍼: 타입 가드 & 배열 변환
 * ----------------------------------------------------- */

/** 런타임 타입 가드 (Zod과 동일 로직) */
export const isChatMessage = (v: unknown): v is ChatMessage =>
  ChatMsgSchema.safeParse(v).success;

/** unknown → ChatMessage[] 안전 변환 */
export const toChatMessages = (input: unknown): ChatMessage[] =>
  Array.isArray(input) ? input.filter(isChatMessage) : [];
