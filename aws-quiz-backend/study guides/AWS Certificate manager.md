# AWS Certificate Manager (ACM) Study Guide

## Key Concepts and Definitions

- **AWS Certificate Manager (ACM):** A service that lets you easily provision, manage, and deploy SSL/TLS certificates for use with AWS services and your internal connected resources.
- **SSL/TLS Certificates:** Digital certificates that provide secure, encrypted communications between a website and a user's web browser.
- **Public Certificates:** Used for securing internet-based traffic and are trusted by most web browsers.
- **Private Certificates:** Used for internal applications and are managed through AWS Private Certificate Authority.
- **Domain Validation:** A process that verifies the domain ownership when issuing a certificate.
- **Certificate Renewal:** ACM automatically renews certificates before they expire.
- **Certificate Deployment:** Certificates can be deployed with services like Elastic Load Balancing, Amazon CloudFront, and Amazon API Gateway.

## Mnemonics and Memory Aids

- **"ACM" for "Automated Certificate Magic":** Remember that ACM automates the process of issuing, deploying, and renewing certificates.
- **"P2D" for "Public to Domain":** Public certificates require domain validation.
- **"PAD" for "Provision, Automate, Deploy":** ACM handles provisioning, automating renewals, and deploying certificates.

## Simple Diagrams

![ACM Workflow](https://example.com/acm-workflow-diagram)

## Comparison Table

| Feature                       | Public Certificates                     | Private Certificates                    |
|-------------------------------|-----------------------------------------|-----------------------------------------|
| Use Case                      | Internet traffic                        | Internal applications                   |
| Domain Validation             | Required                                | Not required                            |
| Managed by ACM                | Yes                                     | Yes                                     |
| Public Trust                  | Trusted by web browsers                 | Not publicly trusted                    |
| Automatic Renewal             | Yes                                     | Yes                                     |

## Processes

### Provisioning an ACM Certificate

1. **Request a Certificate:**
   - Use the ACM console to request a public or private certificate.
2. **Domain Validation:**
   - Choose validation method: DNS or email for public certificates.
3. **Certificate Issuance:**
   - ACM issues the certificate upon successful validation.
4. **Deployment:**
   - Deploy the certificate with supported AWS services.

## Practice Questions

1. **What is the primary purpose of AWS Certificate Manager?**
   - a) To manage user permissions
   - b) To automate SSL/TLS certificate provisioning and management
   - c) To provide DNS services
   - d) To deploy EC2 instances

2. **Which of the following requires domain validation in ACM?**
   - a) Private certificates
   - b) Public certificates
   - c) Both private and public certificates
   - d) None of the above

3. **Which AWS services can you deploy ACM certificates with? (Choose two)**
   - a) Amazon S3
   - b) Amazon RDS
   - c) Elastic Load Balancing
   - d) Amazon CloudFront

4. **How does ACM handle certificate renewal?**
   - a) Manually renews the certificate before expiration
   - b) Automatically renews the certificate before expiration
   - c) Does not support renewal process
   - d) Sends notifications for manual renewal

5. **What is a primary difference between public and private certificates in ACM?**
   - a) Public certificates are free, private certificates are paid
   - b) Public certificates require domain validation, private certificates do not
   - c) Public certificates are for internal use, private certificates are for external use
   - d) There is no difference

## Potential Points of Confusion

- **Public vs. Private Certificates:** Understand the use cases and validation requirements for each.
- **Domain Validation Methods:** Know the difference between DNS and email validation.
- **Service Integration:** Remember which AWS services support ACM for certificate deployment.
- **Renewal Process:** Recognize that ACM automates the renewal process, unlike traditional manual renewals.

---