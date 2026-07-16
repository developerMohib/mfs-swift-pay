# swiftPay

A mobile financial services (MFS) style money-transfer app: users send money,
cash in/out through agents, and admins oversee the system. Two-part project:

- `swift-pay-client/` - React + Vite + Tailwind/daisyUI
- `swift-pay-server/` - Node + Express + TypeScript + MongoDB (Mongoose)

## Getting started

### 1. Server

```bash
cd swift-pay-server
cp .env.example .env   # then fill in your own MongoDB URI, JWT secret, etc.
npm install
npm run dev             # or: npm run build && npm start
```

### 2. Client

```bash
cd swift-pay-client
cp .env.example .env   # points at your local API by default
npm install
npm run dev
```

## Roles

- **User** - registers, sends money, cashes in/out through an agent.
- **Agent** - approves cash-in requests, deposits cash into a user's
  account, tops up their own float from the admin.
- **Admin** - approves/blocks agents, manages users, views system-wide
  transactions and balances. Admin accounts are created directly in the
  database (there is no public admin sign-up) and sign in at `/admin/login`.

## Environment variables

See `swift-pay-server/.env.example` and `swift-pay-client/.env.example` for
the full list. Nothing sensitive is committed to this repo - copy the
example files and fill in your own values locally.

## Security notes

- Passwords/PINs are hashed with bcrypt and never returned by the API.
- Sessions are httpOnly JWT cookies; the server derives the caller's
  identity from the token rather than trusting client-supplied IDs.
- Routes are gated by role where appropriate (see `CHANGELOG BELOW`).

If you're rotating credentials after downloading/sharing this project
(e.g. this codebase was previously shared with a real `.env` file), treat
that Mongo URI, JWT secret, and any admin password as compromised and
rotate them.


<!-- Challanges Things -->

Everything below was found and fixed while going through this codebase as
a senior-engineer pass. Grouped by severity so you can see what mattered
most.

## Critical - money & auth were broken or exploitable

1. **The app couldn't actually log anyone in.** `AuthProvider` never set
   `user` after a successful login (`Login.jsx` didn't call it, and
   `AdminLogin.jsx` called a `login()` function that didn't exist on the
   context - a crash). Every page that read `user` (Send Money, Cash In,
   Cash Deposit, Navbar, Profile...) was working with `null`. Fixed by
   rebuilding `AuthProvider` to expose a real `login()`, and by adding a
   `GET /auth/me` endpoint so a page refresh doesn't silently log you out.
2. **Send Money never checked the PIN.** Any non-empty string was accepted
   as valid. Added a real `comparePassword` check before any balance
   changes.
3. **Every money-moving/admin/agent-management route was reachable with no
   login at all** (`sendMoney`, `cashOut`, `cashIn`, `cashDeposit`, agent
   approval, user management, etc. had no `authenticate` middleware).
   Added `authenticate` (must be logged in) and `authorize(role)`
   (must be the right role) to every sensitive route, matched carefully
   against what the frontend actually calls so nothing legitimate breaks.
4. **`senderId` was trusted from the request body.** Any logged-in account
   could pass someone else's id and move money out of their balance
   (classic IDOR). Now every money-moving controller uses the id embedded
   in the verified JWT, not whatever the client sends.
5. **Password hashes were returned by the API** (`GET /all/users`,
   `GET /all/agents`, user lookup, admin login response). Added
   `select('-password')`/`select: false` throughout, with explicit
   `select('+password')` only where a controller genuinely needs to
   compare it.
6. **Cash-out transaction saved sender/receiver twice** - once *outside*
   the DB transaction and once inside, which defeats the whole point of
   using a transaction (a crash between the two writes leaves the ledger
   inconsistent). Removed the redundant unsessioned save.
7. **Admin login never issued a session token at all** (the `jwt.sign(...)`
   call was commented out), so there was no way to actually protect
   admin-only routes even after adding middleware. It also had a dead
   code path that - had it been reachable - would have let anyone create
   a new admin account just by POSTing an unrecognized email. Rewrote the
   endpoint: real credential check, real JWT + cookie, no auto-provisioning.
8. **A developer's real personal email/phone were hardcoded as schema
   defaults** on the Admin model, and the plaintext demo admin password
   was committed in the README. Removed both. **If you're reusing this
   Mongo URI / JWT secret / admin password from before this cleanup,
   rotate them** - see the note in `README.md`.
9. **`/user/transactions/:userId` always returned an empty list** - it
   queried `Transaction.find({ userId })`, but the schema stores
   `sender`/`receiver`, not `userId`. Fixed to query `$or: [{sender},
   {receiver}]`. The user-facing "My Transactions" page was also pulling
   from the *admin* "all transactions" endpoint (and rendering one
   hardcoded fake row) instead of the user's own history - rewired to the
   correct, now-working endpoint and made the row component actually
   render real data.
10. **An agent's "pending cash-in requests" endpoint returned every
    agent's pending requests, system-wide**, not just their own (the
    scoping filter was written as a comment and never applied). Fixed to
    filter by the authenticated agent's id.

## Bugs

- `/admin/balance` had no handler function at all (`router.get('/balance')`
  with nothing after it) - wired it up to the existing `balanceInSystem`
  controller, which was written but never connected to a route.
- Logout called `POST /api/auth/logout` from the client but the server
  only exposed `POST /auth/logout` - always 404'd, so "logging out" only
  ever cleared local state, not the server cookie.
- The logout cookie was cleared with different `path`/`sameSite` options
  than the login cookie was set with, which means browsers would ignore
  the clear (cookie option mismatches are checked exactly).
- The client's API base URL was hardcoded to `http://localhost:8000` even
  though a `VITE_baseUrl` env var already existed and was simply never
  read - switching between local/deployed meant hand-editing source.
- Most requests didn't send the auth cookie at all (`withCredentials` was
  only set on a couple of calls) - now set once, globally, in the shared
  axios instance.
- Three pages read `user._id`, but the API only ever returns `id` - those
  reads were always `undefined`, silently breaking cash-in/cash-out/deposit
  forms for the logged-in user.
- The agent dashboard's "Cash Out Requests" nav route pointed at the Cash
  Deposit form (same component, wrong page) instead of the intended
  cash-out-requests view.
- Registration's "Account Type" dropdown had a valueless placeholder
  option, so submitting without picking user/agent silently sent the
  literal string "Select account Type" as the role.
- `config.ts` read `SOLT_ROUNDS` (typo) instead of `SALT_ROUNDS` - harmless
  in practice (a default was used either way) but confusing; fixed and
  documented in `.env.example`.

## Structure / naming

- `middleware/authMiddleware.ts` wasn't middleware (it was password
  hash/compare helpers) - moved to `utils/password.util.ts`.
- `utils/errorHandler.ts` was an empty, unused file while `index.ts` had
  its own inline error handling - implemented a real
  `notFoundHandler`/`globalErrorHandler` pair and wired it in.
- `utils/jwt.ts` was dead code (never imported anywhere) - removed.
- Fixed the typo'd router variable names (`adnminRouter` -> `adminRouter`,
  `transectionRouter` -> `transactionRouter`) without changing the actual
  URL mount points the frontend depends on.
- Added a role-checking `middleware/authorize.ts` alongside the existing
  `authenticate.ts`.
- Split each route file so the public routes (login/register) are
  explicit and every other route states which role(s) can call it, instead
  of one undifferentiated router.
- Removed the `.pdf` course file, `emergency.txt`, and `plan.txt` scratch
  notes from the client folder, and dropped committed `node_modules`/`dist`
  build output.
- CORS origins are now `[...hardcoded defaults, process.env.FRONTEND_URL]`
  instead of requiring a code edit to point at a new deployment.

## Frontend design pass

Applied a minimal design system on top of the existing Tailwind/daisyUI
setup rather than replacing it (replacing it would have meant rewriting
every page that already uses daisyUI's `btn`/`input`/`card` classes):

- One flat, minimal daisyUI theme for light mode and one for dark mode
  (`tailwind.config.js`), replacing daisyUI's louder built-in defaults.
- Switched the base font to Inter.
- Added a small set of reusable classes in `index.css`
  (`.card-minimal`, `.btn-primary-minimal`, `.btn-outline-minimal`,
  `.input-minimal`, `.container-page`, `.page-heading`, etc.) and used
  them to rebuild the Login, Admin Login, Navbar, and Transactions pages.
- Every other page already styled with daisyUI utility classes inherits
  the new minimal theme automatically - no per-page rewrite needed for
  the color/spacing system to apply consistently across the app.

If you want the same minimal treatment applied page-by-page to the rest
of the app (Register, dashboards, agent/admin management tables, etc.),
that's a natural next step - happy to keep going.

## What's intentionally *not* changed

Some things came up during the audit that are real product/architecture
questions, not one-line bugs, so they were left alone rather than guessed
at:

- `CashOutRequ.jsx` (agent "Cash Out Requests" page) doesn't correspond to
  any pending-approval workflow on the backend - cash-out is instant/
  synchronous today. Either build a real pending cash-out flow, or drop
  the page/nav link.
- Fine-grained ownership checks (e.g. can a user only ever view *their
  own* record via `/user/find/:id`) aren't enforced - anyone logged in
  can look up any account's public profile fields by id. Worth deciding
  if that's intentional before hardening further.