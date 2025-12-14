# Security Policy

## Supported Versions

This is a demonstration project for learning purposes. Security updates are provided on a best-effort basis.

| Version | Supported          |
| ------- | ------------------ |
| Current | :white_check_mark: |

## Security Features Implemented

### Authentication
- **Password Hashing**: All passwords are hashed using bcryptjs with 10 salt rounds before storage
- **Password Protection**: Passwords are never returned in API responses (removed via toJSON method)
- **Input Validation**: Username and password requirements enforced (username: 3-30 alphanumeric chars, password: min 6 chars)

### Data Validation
- **Express Validator**: All API endpoints use express-validator for input sanitization
- **Content Length Limits**: 
  - Post content: max 1000 characters
  - Bio: max 500 characters
  - Status: max 100 characters
  - Names: max 50 characters

### Database Security
- **Mongoose Schema Validation**: Type checking and constraints at database level
- **Indexed Queries**: Optimized queries with indexes on commonly accessed fields

## Known Limitations & Future Improvements

This is a basic implementation intended for development and learning. The following security enhancements are recommended for production use:

### Authentication & Authorization
1. **Session Management**: Currently uses basic username-based identification. Should implement:
   - JWT (JSON Web Tokens) or session-based authentication
   - Secure session storage (Redis or similar)
   - Session expiration and refresh tokens

2. **User Authorization**: Some endpoints lack proper authorization:
   - `/api/users` endpoint returns all users without pagination or access control
   - Delete post endpoint relies on username in request body (can be spoofed)
   - Logout endpoint doesn't verify session ownership

### Rate Limiting
- No rate limiting implemented
- Vulnerable to brute force attacks on login/register endpoints
- Recommendation: Add express-rate-limit middleware

### HTTPS/TLS
- Server runs on HTTP by default
- Production deployment must use HTTPS with valid SSL certificates

### CORS
- CORS is currently wide open (allows all origins)
- Production should restrict CORS to specific trusted domains

### Environment Variables
- `.env` file contains secrets and should never be committed to version control
- Use proper secret management in production (AWS Secrets Manager, HashiCorp Vault, etc.)

### Input Sanitization
- Basic validation is implemented
- Additional sanitization recommended for XSS prevention:
  - DOMPurify for HTML content
  - Additional regex validation for special characters

### Database
- MongoDB connection string stored in environment variable
- Production should use:
  - MongoDB Atlas with IP whitelisting
  - Database user with minimal required permissions
  - Encrypted connections (SSL/TLS)

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by:

1. **DO NOT** create a public GitHub issue
2. Send an email to the repository owner with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

We will respond to security reports within 48 hours and work to address valid issues promptly.

## Security Best Practices for Developers

When contributing to this project:

1. Never commit `.env` files or secrets
2. Always validate and sanitize user input
3. Use parameterized queries to prevent injection attacks
4. Keep dependencies updated (`npm audit` and `npm audit fix`)
5. Follow principle of least privilege for database access
6. Test security features thoroughly before merging

## Dependency Security

This project uses:
- `mongoose@8.9.5` - Patched version (previous versions had search injection vulnerabilities)
- `bcryptjs@2.4.3` - For password hashing
- `express-validator@7.0.0` - For input validation
- `express@5.1.0` - Latest stable version
- `dotenv@16.3.1` - For environment configuration

Run `npm audit` regularly to check for known vulnerabilities in dependencies.
