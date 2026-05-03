# Contributing to Hospital Management System

Thank you for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Hospital-Management-System.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes and commit them
5. Push to your fork and open a Pull Request

## Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/description` | `feature/add-search` |
| Bug fix | `fix/description` | `fix/login-redirect` |
| Refactor | `refactor/description` | `refactor/auth-controller` |
| Docs | `docs/description` | `docs/update-readme` |

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short description>

Types: feat, fix, refactor, docs, style, test, chore, security
```

Examples:
- `feat: add appointment reminder notifications`
- `fix: resolve token expiry on password reset`
- `security: add rate limiting to auth endpoints`

## Code Style

- Use consistent indentation (2 spaces)
- Add comments for complex logic
- Keep functions small and focused
- Validate all user inputs on both frontend and backend

## Environment Setup

See `backend/.env.example` for required environment variables.

## Reporting Issues

Open a GitHub Issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
