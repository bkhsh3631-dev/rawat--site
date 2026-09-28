# روعة الحياة | منصة علوم الأحياء

منصة عربية تفاعلية لمراجعة واختبارات علوم الأحياء لطلاب الأول والثاني الثانوي.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/rawat-alhayat/` — React + Vite web app with RTL pages, theme, quizzes, profile and admin surfaces.
- `artifacts/api-server/src/routes/biology.ts` — auth, lesson, quiz, comments and protected admin API routes.
- `artifacts/api-server/src/lib/session.ts` — signed HTTP-only session cookie and password hashing helpers.
- `lib/api-spec/openapi.yaml` — source of truth for generated API hooks and schemas.
- `lib/db/src/schema/index.ts` — PostgreSQL/Drizzle schema for users, lessons, questions, comments, attempts and encouragements.
- `artifacts/rawat-alhayat/public/sitemap.xml` and `robots.txt` — basic search engine discovery files.

## Architecture decisions

- The administrator identity is restricted server-side to `bkhsh3631@gmail.com`; its password is read only from the `ADMIN_PASSWORD` secret.
- Sessions are signed, HTTP-only cookies backed by the database user record; no password or session token is shipped to the browser.
- Biology content is persisted in the built-in PostgreSQL database and seeded only when the content tables are empty.
- The frontend uses generated OpenAPI hooks and invalidates query keys after mutations so admin changes and learner progress refresh without a full page reload.

## Product

Learners can register or sign in, browse lessons by grade and term, take four-choice quizzes with immediate explanations and celebratory feedback, save results, ask lesson questions, switch dark mode, and share results. The admin can view activity metrics, manage lessons/questions/encouragements, and answer learner comments from a protected responsive dashboard.

## User preferences

- Keep the product Arabic-first, RTL, responsive and branded as “روعة الحياة | علوم الأحياء”.
- Preserve the footer text: “جميع الحقوق محفوظة © 2026 - تم التطوير بواسطة سهام”.

## Gotchas

- After changing `lib/api-spec/openapi.yaml`, run `pnpm --filter @workspace/api-spec run codegen` before typechecking the app or server.
- Use the managed workflows `artifacts/api-server: API Server` and `artifacts/rawat-alhayat: web`; do not create duplicate workflows.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
