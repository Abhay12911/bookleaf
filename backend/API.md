# BookLeaf REST API

All endpoints use the `/api` prefix. Login and signup set an HTTP-only `token`
cookie; protected requests must include that cookie. CORS is restricted to
`FRONTEND_URL`.

## Authentication

- `POST /auth/signup` - create an author account. Body: `{ email, password }`.
- `POST /auth/login` - sign in. Body: `{ email, password }`.
- `GET /health` - public health check.

## Author endpoints

- `GET /books` - books owned by the authenticated author.
- `GET /dashboard` - ticket and royalty summary.
- `GET /tickets` - the author's tickets and public conversation.
- `POST /tickets` - create a ticket. Body: `{ subject, description, bookId? }`.
- `GET /tickets/:id` - one owned ticket.
- `POST /tickets/:id/messages` - add an author reply. Body: `{ content }`.

## Admin endpoints

All admin endpoints require an authenticated `ADMIN` user.

- `GET /admin/tickets?status=&priority=&category=&from=&to=` - filtered queue.
- `PATCH /admin/tickets/:id` - override status, priority, category, or assignee.
- `POST /admin/tickets/:id/reply` - send a public reply. Body: `{ content }`.
- `POST /admin/tickets/:id/notes` - add an internal note. Body: `{ content }`.

AI classification and draft generation occur after ticket creation. If the AI
provider is unavailable or returns invalid data, the ticket remains persisted
with `GENERAL_INQUIRY`, `MEDIUM`, and no draft so an admin can continue
manually. The API key is server-only in `OPENAI_API_KEY`.
