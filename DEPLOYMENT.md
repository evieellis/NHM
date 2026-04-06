# Deployment Workflow

This repo is configured for simple push-based deployment to GitHub Pages from `main`.

## 1) Deploy quickly

```bash
./deploy.sh "Your message here"
```

If you omit the message, `deploy.sh` uses a timestamped default message.

## 2) See recent deploy commits

```bash
git --no-pager log --oneline -n 10
```

## 3) Roll back safely to a previous version

Use the commit hash you want to revert:

```bash
./rollback.sh <commit-hash>
```

Example:

```bash
./rollback.sh a1b2c3d
```

This does a **safe rollback** with `git revert` (no history rewrite), then pushes to `main` so Pages redeploys.

## Notes

- Deployment URL: `https://evieellis.github.io/NHM/`
- Local test URL (when available): `http://localhost:8000/worm-local.html`
- If the site looks stale after deploy, force-refresh in Safari or open a new tab.
