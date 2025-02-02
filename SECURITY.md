# Security Policy and Best Practices

## Credential Management

### Current Security Measures

- Environment variables for sensitive credentials (Discord token, API keys)
- Git pre-commit hooks to prevent credential exposure
- .gitignore rules for sensitive files
- Test environment using mock credentials

### Cleaning Git History of Credentials

If you need to remove sensitive data from git history, follow these steps carefully:

#### Prerequisites

1. Install git-filter-repo:

```bash
# macOS
brew install git-filter-repo

# Linux
pip3 install git-filter-repo

# Windows
pip install git-filter-repo
```

2. Create a backup of your repository:

```bash
cp -r your-repo your-repo-backup
```

#### Cleaning Process

1. **Prepare Your Repository**

```bash
# Change to your repository directory
cd your-repo

# Create a fresh clone (recommended for cleaning)
git clone --mirror git@github.com:username/your-repo.git repo-mirror
cd repo-mirror
```

2. **Create a Pattern File**
Create a file named `patterns.txt` containing patterns of credentials to remove:

```
# Discord tokens (common patterns)
['"](N[a-zA-Z0-9]{23}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{27})['"]
# API keys
['"](sk-[a-zA-Z0-9]{48}|pk-[a-zA-Z0-9]{48})['"]
# Generic tokens/keys
['"]([a-zA-Z0-9_-]{32,64})['"]
# Add more patterns as needed
```

3. **Clean the Repository**

```bash
# Remove files containing credentials
git filter-repo --invert-paths --paths-from-file patterns.txt

# Clean all refs
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

4. **Verify the Cleaning**

```bash
# Check for any remaining credentials
git log -p | grep -i -f patterns.txt
```

5. **Update Remote Repository**

```bash
# Force push all branches
git push origin --force --all

# Force push all tags
git push origin --force --tags
```

6. **Update All Local Clones**
For each local clone of the repository:

```bash
# In each local clone
git fetch origin
git reset --hard origin/main  # or your default branch
```

#### Important Notes

- This process is irreversible and rewrites git history
- All collaborators must re-clone the repository after cleaning
- Immediately revoke and rotate any exposed credentials
- Old credentials may still exist in:
  - GitHub Actions logs
  - Issue comments
  - Pull request descriptions
  - Cached views on GitHub
  - Other users' local clones

### Setting Up Environment Variables

1. Create a `.env` file in the project root (this file is automatically ignored by git)
2. Add your credentials using this format:

```
DISCORD_TOKEN=your_discord_token_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

3. Never commit the `.env` file to version control

### Development Guidelines

#### DO

- Use environment variables for all sensitive data
- Keep the `.env` file secure and local to your development environment
- Use mock/fake data for tests
- Review code for credential exposure before committing
- Use the pre-commit hook to catch potential credential leaks

#### DON'T

- Hardcode credentials in source code
- Commit `.env` files to version control
- Share credentials through insecure channels
- Disable the pre-commit hook
- Log sensitive information

### Secure Credential Storage

For production environments:

1. Use a secrets management service or secure environment variable storage
2. Rotate credentials regularly
3. Use the principle of least privilege
4. Monitor for unauthorized access
5. Keep backup copies of credentials in a secure location

### What to Do If Credentials Are Exposed

If credentials are accidentally committed:

1. Immediately invalidate and rotate the exposed credentials
2. Use tools like `git-filter-repo` to remove the credentials from git history
3. Force push the cleaned history
4. Notify relevant team members/security personnel
5. Review access logs for potential unauthorized use

### Pre-commit Hook

The project includes a pre-commit hook that scans for potential credentials. The hook:

- Checks staged files for common credential patterns
- Excludes test files and dependencies
- Provides clear error messages if potential credentials are found

To bypass the hook in exceptional cases (NOT RECOMMENDED):

```bash
git commit --no-verify
```

### Continuous Integration

For CI/CD pipelines:

1. Use secure environment variables in CI configuration
2. Never display environment variables in build logs
3. Rotate CI/CD credentials regularly
4. Limit CI/CD service permissions to only what's necessary

### Security Checks

Regular security maintenance:

1. Update dependencies regularly
2. Run security audits (`npm audit`)
3. Review access logs
4. Verify environment variable usage
5. Check git history for any exposed credentials

### Reporting Security Issues

If you discover a security vulnerability:

1. Do NOT open a public issue
2. Contact the maintainers directly
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## Additional Resources

- [Node.js Security Best Practices](https://nodejs.org/en/security/)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [Discord Bot Security](https://discord.com/developers/docs/topics/security)
