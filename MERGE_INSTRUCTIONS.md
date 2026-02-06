# Instructions for Merging Pull Requests

## Overview

This document provides step-by-step instructions for repository maintainers to merge the 6 open pull requests that have been reviewed.

## Prerequisites

Before merging any PRs, please:

1. **Fix Security Vulnerabilities** (IMPORTANT)
   ```bash
   npm audit fix
   # Review the changes and test
   npm test
   ```

2. **Review the full analysis** in `PR_REVIEW_SUMMARY.md`

## Recommended Merge Order

### Phase 1: Independent Bug Fixes & Improvements (Safe to merge immediately)

#### 1. Merge PR #2: Input Validation Hardening
```bash
gh pr merge 2 --squash
# Or via GitHub UI: Review > Approve > Squash and merge
```
- **Why first**: Small, independent validation improvement
- **Risk**: Low
- **Tests**: ✅ Pass

#### 2. Merge PR #5: Task Serializer Bug Fix
```bash
gh pr merge 5 --squash
```
- **Why next**: Small, independent bug fix
- **Risk**: Low
- **Tests**: ✅ Pass

#### 3. Merge PR #6: Task Validation Security
```bash
gh pr merge 6 --squash
```
- **Why third**: Independent security improvement
- **Risk**: Low
- **Tests**: ✅ Pass

### Phase 2: Feature Addition

#### 4. Merge PR #3: i18n and SEO Endpoints
```bash
gh pr merge 3 --squash
```
- **Why now**: Independent feature, doesn't conflict with frontend PRs
- **Risk**: Low
- **Tests**: ✅ Pass

### Phase 3: Frontend/Architecture Decision (⚠️ IMPORTANT)

You need to **choose** between PR #1 and PR #4, as both make significant frontend changes:

#### Option A: Merge PR #4 (Recommended for most cases)
**If you want the Nuxt3 frontend scaffold:**
```bash
gh pr merge 4 --squash
# Then review if PR #1 is still needed or should be closed
```
- **Changes**: Adds complete Nuxt3 frontend with pages, CI workflows
- **Size**: 10,152 additions, 0 deletions
- **Risk**: Low (purely additive)
- **Tests**: ✅ Pass

#### Option B: Merge PR #1 (Only if major refactor is needed)
**If you want to refactor/replace existing code:**
```bash
# First, carefully review the 14,781 deletions
gh pr view 1 --web
# Review the diff thoroughly
# Then merge if appropriate:
gh pr merge 1 --squash
# Then review if PR #4 should be adapted or closed
```
- **Changes**: 7,744 additions, 14,781 deletions
- **Risk**: ⚠️ High (major refactor)
- **Tests**: ⚠️ Only 2 tests, unstable merge state
- **WARNING**: Review deletions carefully before merging

## Post-Merge Checklist

After merging each PR:
- [ ] Verify main branch tests still pass
- [ ] Check for any CI/CD failures
- [ ] Update any affected documentation
- [ ] Close any related issues

## Alternative: Merge via GitHub Web Interface

If you prefer using the GitHub web interface:

1. Go to https://github.com/LexBANK/core-hub/pulls
2. Click on each PR in the recommended order
3. Click "Review changes" > "Approve"
4. Click "Squash and merge" or "Merge pull request"
5. Confirm the merge

## Troubleshooting

### If merge conflicts occur:
```bash
# Update the branch
git checkout <branch-name>
git fetch origin main
git merge origin/main
# Resolve conflicts
git add .
git commit
git push
```

### If tests fail after merging:
1. Review the failing test output
2. Check if it's related to the merged changes
3. Create a hotfix PR if needed

## Contact

If you need clarification on any of these recommendations, please comment on this PR or contact the repository maintainers.

---

**Note**: This analysis was performed by GitHub Copilot on 2026-02-06. The recommendations are based on the PR state at that time.
