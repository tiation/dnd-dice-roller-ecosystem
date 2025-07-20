# Security Policy

## Supported Versions

We actively support the following versions of DnD Dice Roller with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The security of DnD Dice Roller is important to us. If you discover a security vulnerability, please follow these steps:

### 🔒 Private Disclosure

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please:

1. **Email us directly** at security@tiation.com
2. **Include detailed information**:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Suggested fix (if available)
   - Your contact information

### 📋 What to Include

When reporting a security vulnerability, please include:

- **Type of vulnerability** (e.g., authentication bypass, data exposure, etc.)
- **Affected components** (e.g., login system, dice roller, data storage)
- **Attack vectors** (e.g., local access, network-based, etc.)
- **Impact assessment** (e.g., data breach, unauthorized access, etc.)
- **Proof of concept** (if applicable)
- **Suggested mitigation** (if available)

### 🕐 Response Timeline

We commit to the following response times:

- **Initial response**: Within 24 hours
- **Vulnerability assessment**: Within 5 business days
- **Fix deployment**: Within 30 days (depending on severity)
- **Public disclosure**: After fix is deployed and users have had time to update

### 🏆 Recognition

We believe in recognizing security researchers who help keep our users safe:

- **Hall of Fame**: Security researchers will be listed in our security acknowledgments
- **Coordinated Disclosure**: We work with researchers to ensure responsible disclosure
- **CVE Assignment**: We help assign CVE numbers for significant vulnerabilities when appropriate

### 🔐 Security Measures

Our app implements several security measures:

#### Authentication & Authorization
- Secure password hashing using bcrypt
- Session management with secure tokens
- Input validation and sanitization
- Protection against common attack vectors

#### Data Protection
- Local data encryption using AsyncStorage
- Secure transmission of sensitive data
- Minimal data collection and storage
- Regular security audits

#### Mobile Security
- Secure storage of user credentials
- Protection against reverse engineering
- Runtime application self-protection (RASP)
- Certificate pinning for API communications

### 🚨 Security Incident Response

In the event of a security incident:

1. **Immediate Assessment**: Evaluate the scope and impact
2. **Containment**: Implement immediate measures to prevent further damage
3. **Investigation**: Conduct thorough forensic analysis
4. **Remediation**: Deploy fixes and security improvements
5. **Communication**: Notify affected users and stakeholders
6. **Post-Incident Review**: Analyze the incident and improve security measures

### 📚 Security Best Practices for Users

Users can help maintain security by:

- **Keeping the app updated** to the latest version
- **Using strong passwords** for user accounts
- **Enabling device security** features (screen lock, biometrics)
- **Downloading only from official sources** (Google Play Store)
- **Reporting suspicious activity** immediately

### 🔍 Security Audits

We conduct regular security audits:

- **Code reviews** for all security-related changes
- **Dependency scanning** for known vulnerabilities
- **Static analysis** of application code
- **Dynamic testing** of running applications
- **Third-party audits** for comprehensive assessment

### 📞 Contact Information

For security-related matters:

- **Email**: security@tiation.com
- **PGP Key**: [Available upon request]
- **Response Time**: 24 hours maximum

For general inquiries:
- **Email**: contact@tiation.com
- **GitHub**: Open an issue for non-security matters

### 🏛️ Legal

By participating in our security program, you agree to:

- Act in good faith and avoid privacy violations
- Not disrupt our services or access unauthorized data
- Provide sufficient information for us to reproduce the issue
- Not publicly disclose the vulnerability before we've had a chance to fix it
- Comply with all applicable laws and regulations

We commit to:

- Respond to your report in a timely manner
- Work with you to understand and resolve the issue
- Recognize your contribution to our security (if desired)
- Not take legal action against you for good faith security research

---

**Thank you for helping keep DnD Dice Roller secure for all users! 🛡️**
