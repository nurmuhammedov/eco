# Handover: TypeScript cleanup (branch `claude/nice-keller-37uy19`)

Temporary file for the next session. Delete it before merging.

## Rules (from the user; keep following them)

- Reply in Uzbek. Use ‘ (U+2018) in o‘/g‘ and ’ (U+2019) for the apostrophe. Be short and honest.
- Code comments: few, in English, matching the surrounding style.
- Form error texts: only `Majburiy maydon!` and `Kiritilgan ma’lumot yaroqli emas!`. The global zod error map in
  `src/shared/validation/zod-setup.ts` already produces these, so schemas carry no messages.
- Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Push only to this branch, never to main.
- Check every chunk with `npx tsc -b`, `npx eslint <paths>` and `npx vitest run`. Run `npm run build` before the end, then delete `dist/`.
- Never type passwords or tokens. The server is read-only, except the Laravel services. Don’t deploy. Don’t touch the Java backend.
- Don’t raise these again: `can_assign`, old test KPI tasks, Zoom limits, server disk, prod KPI setup.

## Done on this branch

- `any` is gone from `src` (outside tests and comments). What remains is a few documented, narrow casts:
  zod-form-resolver, the RHF view casts in create-application parts, the Yandex map typings, and the GeoJSON import.
- Types follow the backend DTOs from the jar the user supplied (`db085508-ecosystem-classes.zip`).
  Jackson naming rule: a primitive `boolean isX` is sent as `x`; a `Boolean isX` is sent as `isX`.
- Shared helpers:
  - `useSliceMutation` (`src/shared/lib/query/use-slice-mutation.ts`) replaced 33 hand-patched admin cache hooks.
  - `serviceData` (`src/shared/api/services-api-client.ts`) unwraps the Laravel `{ data }` envelope.
  - `DetailPageSkeleton` (`src/shared/components/common/detail-card`).
  - `lookupCitizen` (`src/shared/api/citizen-lookup.ts`).
  - `toLabelledFiles` and `parseCoordinate`.
  - `CommonService` joins `endpoint/id` without a double slash.
- Each commit message lists the bugs it fixed. Read them with `git log main..HEAD`.

## Remaining tasks

1. **#12 Floating promises.** Enable type-aware ESLint rules `@typescript-eslint/no-floating-promises`,
   `no-misused-promises` and `await-thenable`, then fix every hit:
   - `await` or `return` the promise inside `onSuccess`;
   - use `void` for fire-and-forget calls;
   - prefer `mutate(v, { onSuccess })` over `mutateAsync().then()`.
     The user’s IDE screenshot showed `invalidateQueries` results being ignored. The decree-signers case is already fixed; there are many others.
2. **#8 Naming.** Review folder, file and variable names. Examples:
   - `features/inquiries/model/types.tsx` holds constants and JSX;
   - an `appeal_type` prop;
   - `postChecklists2`;
   - variables that shadow `data`.
3. **#9 Performance.** Examples:
   - the inspection widget sends 6 count requests, one per tab;
   - the organizations and declarations pages count with `size=1` list calls;
   - «Murojaatlar holati» report sends about 720 requests. This needs a product decision, so ask the user.
4. **#10 Loading, empty and error states.** Register, expertise, declarations, inquiries, accidents and risk-analysis pages already have skeletons. Check the remaining pages.
5. **#11 UI consistency pass.** List design proposals for the user rather than redesigning.
6. **Final.** Run `npm run build` and delete `dist/`. Give the user a report in Uzbek covering:
   - the fixes;
   - the backend questions below;
   - a request to test in the browser.

## Backend questions for the user (checked against the latest jar)

1. `equipmentCertExpiryDate` is not in the pipeline or LPG-powered DTOs, so the date the user enters is dropped.
2. The jar has no `/appeals/irs/unofficial` endpoint, yet `ILLEGAL_REGISTER_IRS` is enabled for MANAGER. `RE_REGISTER_HF` and `RE_REGISTER_ILLEGAL_HF` have no backend: delete them or keep them for later?
3. These view DTOs lack fields the UI reads, so those rows are always empty:
   - `IrsViewById`: `location`, `deactivationDate`, `deregisterBasisPath`, `deregisterReason`;
   - `XRayResById`: `location`;
   - `EquipmentViewById`: `ownerName`.
4. The admin `EquipmentTypeEnum` lacks `OIL_CONTAINER`.
5. `ConclusionUpdateDto` has only `declarationFilePath`. Edits to `calculationLetterPath` and `informationNotePath` are silently dropped.
6. There are no `/irs/by-tin/select`, `/xrays/by-tin/select` or `/equipments/by-tin/select` endpoints. A violation report can therefore only be linked to an HF.
7. `InquiryRestDto` has no `rejectReason` or `action`, so the "To‘lanmaslik sababi" row is always empty.
8. The `/elevators` page shows an always-empty table because no data source is connected. Product decision: connect an API or remove the page.

Pending product decisions (still unanswered):

- five reports use `Math.random` placeholder data;
- `/reports/employees-dashboard` shows mock people.

## Unverified

- None of the changes has been tested in a browser. Check the logged-in forms (create, edit, detail) in dev against the test backend.
