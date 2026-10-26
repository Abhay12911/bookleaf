# BookLeaf Portal

BookLeaf is a support portal for authors and the BookLeaf operations team. It
has a Next.js frontend and an Express/Prisma backend connected to PostgreSQL.

## Login instructions

Start both servers first using the setup instructions below. Then open:

```text
http://localhost:3000/login
```

### Author login

Open the login page:

```text
http://localhost:3000/login
```

The sample data includes 10 seeded author accounts. They all use:

```text
Password: BookLeafDemo123!
```

Available seeded author emails:

```text
priya.sharma@email.com
rohit.kapoor@email.com
ananya.reddy@email.com
vikram.joshi@email.com
meera.nair@email.com
arjun.malhotra@email.com
sneha.kulkarni@email.com
farhan.sheikh@email.com
kavita.deshmukh@email.com
diya.chatterjee@email.com
```

After signing in, an author can access:

```text
http://localhost:3000/author/dashboard
```

Author pages:

- `/author/dashboard` - ticket and royalty summary.
- `/author/books` - the signed-in author's books, sales, and royalty details.
- `/author/tickets` - all tickets submitted by the signed-in author.
- `/author/tickets/new` - submit a support query.
- `/author/tickets/[id]` - view a ticket conversation and reply.

Authors can only access their own books and tickets.

### Admin login

Open:

```text
http://localhost:3000/login
```

Use the seeded admin account:

```text
Email: admin@bookleaf.com
Password: BookLeafAdmin123!
```

The admin portal is available at:

```text
http://localhost:3000/admin/tickets
```

Admin capabilities include:

- View tickets from all authors.
- Filter by status, priority, and category.
- Open ticket details.
- Override status, priority, and category.
- Use or edit the AI-generated response draft.
- Send a response to an author.
- Add internal notes visible only to admins.

The public signup page cannot create admin accounts.

### New user signup

New users can create an author account at:

```text
http://localhost:3000/signup
```

The signup form requires:

- Email address
- Password with at least 8 characters
- Password confirmation

New accounts are created with the `AUTHOR` role and are redirected to the
author dashboard after signup. They can then create tickets and access books
associated with that account.

## Requirements

- Node.js 20 or newer
- PostgreSQL connection configured in `backend/.env`
- Dependencies installed in both projects

## First-time setup

Install frontend dependencies:

```powershell
cd E:\bookleaf_portal\frontend
npm install
```

Install backend dependencies:

```powershell
cd E:\bookleaf_portal\backend
npm install
```

Apply the Prisma schema and seed the sample authors, books, and admin account:

```powershell
cd E:\bookleaf_portal\backend
npx prisma db push --accept-data-loss
npx prisma generate
npm run db:seed
```

The seed command is safe to run again. It updates the existing seeded records
instead of creating duplicates.

## Start the portal

Start the backend in one terminal:

```powershell
cd E:\bookleaf_portal\backend
npm start
```

The API runs at:

```text
http://localhost:5000
```

Start the frontend in a second terminal:

```powershell
cd E:\bookleaf_portal\frontend
npm run dev
```

The portal runs at:

```text
http://localhost:3000
```

Both servers must be running before using the login instructions above.

## Sample data

The sample authors and books are stored in:

```text
backend/data/bookleaf_sample_data.json
```

The seed script is:

```text
backend/prisma/seed.js
```

It currently seeds 10 authors and 18 books. Seeded authors use the common
development password shown above. To use a different password when seeding:

```powershell
$env:SEED_AUTHOR_PASSWORD="YourAuthorPassword123!"
$env:SEED_ADMIN_PASSWORD="YourAdminPassword123!"
npm run db:seed
```

## API health check

With the backend running, open:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "message": "BookLeaf API is running"
}
```

Additional API details are documented in [backend/API.md](backend/API.md).

## Useful commands

Frontend:

```powershell
cd E:\bookleaf_portal\frontend
npm run dev
npm run lint
npm run build
```

Backend:

```powershell
cd E:\bookleaf_portal\backend
npm start
npm run dev
npm run db:seed
```
