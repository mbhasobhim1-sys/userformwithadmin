<!-- Please provide a short, descriptive title for your PR ->

### Summary
- What: Brief description of the change (one or two sentences).
- Why: Reason / motivation for the change.

### Changes
- List of the main changes included in this PR (feature, bugfix, docs, tests).

### Type of change
- [ ] Bugfix
- [ ] Feature
- [ ] Chore / Refactor
- [ ] Tests
- [ ] Docs

### Testing / Validation (required)
Run the commands below where applicable and describe any manual testing steps:

- Install / run dev server:
  - pnpm install
  - pnpm dev
- Node E2E smoke tests (HTTP-level):
  - node test-page-excavator-loader.js
  - node test-submit-excavator-loader.js
- Playwright PDF / browser checks (CI-like environment):
  - npx playwright install --with-deps
  - node test-excavator-loader-pdf.js

### Checklist
- [ ] I have added/updated tests where applicable
- [ ] CI passes (GitHub Actions)
- [ ] I have run Node E2E smoke tests locally
- [ ] Playwright tests run locally or CI will run them for me
- [ ] I updated documentation where relevant (README, comments)
- [ ] No secrets or credentials are committed

### Related issues / PRs
- Resolves: # (link issue if applicable)
- Related: (link other PRs)

### Reviewer notes / special instructions
- Any setup steps the reviewer needs to know (env vars, external services, etc.)
- Areas to focus review on (security, performance, UX, tests)

### Screenshots / Acceptance criteria
- (Optional) Attach screenshots or describe acceptance criteria for UI changes.

---
*Use this template to make PR reviews faster and ensure consistency.*
