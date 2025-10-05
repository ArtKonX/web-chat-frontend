import { http, HttpResponse } from 'msw';

export const mockResponses = {
  login: { success: true, attempts: 1 },
  updateUser: { success: true, attempts: 1 },
  getMessages: { success: true },
};

export const handlers = [
  http.post('https://web-chat-backend-s29s.onrender.com/sing-in', () => {
    if (mockResponses.login.success) {
      return HttpResponse.json(
        {
          status: 'ok',
          user: { token: 'new-token' },
        },
        { status: 200 }
      );
    } else {
      return HttpResponse.json(
        {
          status: 'error',
          data: { attempt: 1, status: 'not-pin-code' },
        },
        { status: 400 }
      );
    }
  }),
  http.patch('https://web-chat-backend-s29s.onrender.com/update-user', () => {
    if (mockResponses.updateUser.success) {
      return HttpResponse.json(
        {
          status: 'ok',
        },
        { status: 200 }
      );
    } else {
      return HttpResponse.json(
        {
          status: 'error',
          data: { attempt: 1, status: 'error' },
        },
        { status: 401 }
      );
    }
  }),
  http.get('https://web-chat-backend-s29s.onrender.com/get-messages?currentUserId=user1&userId=1&offSet=0', () => {
    if (mockResponses.getMessages.success) {
      return HttpResponse.json(
        {
          status: 'ok',
          messages: [{ id: '1', message: 'Test message' }],
        },
        { status: 200 }
      );
    } else {
      return HttpResponse.json(
        {
          status: 'error',
          data: { attempt: 1 },
        },
        { status: 401 }
      );
    }
  }),
  http.get('https://web-chat-backend-s29s.onrender.com/ws', (req, res, ctx) => {
    return HttpResponse.json(
      ctx.status(200),
      ctx.json({
        message: 'WebSocket connected'
      })
    )
  }),
  http.patch('https://web-chat-backend-s29s.onrender.com/update-city', (req, res, ctx) => {
    return HttpResponse.json(
      ctx.status(200),
      ctx.json({
        status: 'ok'
      })
    )
  })
]