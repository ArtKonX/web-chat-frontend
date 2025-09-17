const NEXT_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://web-chat-backend-s29s.onrender.com";

const NEXT_BACKEND_URL_WS =
  process.env.NEXT_PUBLIC_BACKEND_URL_WS ||
  "wss://web-chat-backend-s29s.onrender.com/ws";

export default { NEXT_BACKEND_URL, NEXT_BACKEND_URL_WS } as {
  [key in string]: string
};