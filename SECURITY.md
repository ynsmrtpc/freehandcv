# Security policy

FreehandCV stores people's resumes: names, contact details, work history. Please report
vulnerabilities privately so they can be fixed before they are public.

## Reporting a vulnerability

Use GitHub's private reporting: **Security → Report a vulnerability** on this repository.
Do not open a public issue for security problems.

Please include:

- what an attacker can do, and to whose data;
- steps to reproduce (a request, a URL, or a short script);
- the commit or deployment you tested against.

You should get a first reply within 7 days. Once a fix is released, you are credited in the
release notes unless you ask not to be.

## Scope

In scope: this repository's code, including authentication, the admin panel, sharing links,
template validation and server-side PDF rendering.

Out of scope: denial of service by volume, reports from automated scanners without a working
proof, and missing security headers that have no demonstrated impact.

## Supported versions

Only the latest commit on `main` (what runs on freehandcv.com) receives fixes.
