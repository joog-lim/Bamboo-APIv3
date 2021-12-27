import { CreateResInput, ReturnResHTTPData } from "../DTO/http.dto";

export const ALLOWED_ORIGINS: string[] = [
  "http://localhost:3000",
  "https://localhost:3000",
  "http://localhost",
  "https://localhost",
  "https://joog-lim.info",
  "https://www.joog-lim.info",
  "https://jooglim.netlify.app",
];

export const ERROR_CODE_LIST = {
  JL001: "인가되지않은 Origin입니다.",
  JL002: "어드민이 아닙니다.",
  JL003: "인자값이 부족합니다.",
  JL004: "예상치 못한 에러입니다. 개발자에게 문의해주세요.",
  JL005: "Token 값을 찾을수 없습니다.",
  JL006: "Token 인증이 실패하였습니다.",
  JL007: "잘못된 요청입니다.",
  JL008: "액세스토큰이 유효하지않습니다.",
} as const;

export type ErrorCodeType = keyof typeof ERROR_CODE_LIST;

export const createRes = ({
  statusCode,
  headers,
  body,
}: CreateResInput): ReturnResHTTPData => {
  return {
    statusCode: statusCode ?? 200,
    headers: Object.assign(
      {},
      {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      headers ?? {}
    ),
    body: JSON.stringify(body ?? {}),
  };
};
export const createErrorRes = ({
  errorCode,
  status,
}: {
  errorCode: ErrorCodeType;
  status?: number;
}): ReturnResHTTPData => {
  return {
    statusCode: status ?? 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      success: false,
      errorCode: errorCode,
      message: ERROR_CODE_LIST[errorCode],
    }),
  };
};
