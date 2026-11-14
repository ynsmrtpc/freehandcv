/** Deliberate allowlist: editors, accounts, profiles and private extensions are never tracked. */
export function isAnalyticsPath(pathname: string) {
  return pathname === "/" || /^\/(resume-templates|resume-examples|guides)(?:\/[^/]+)?$/.test(pathname)
    || ["/privacy", "/support", "/is-it-free", "/ats-resume-check"].includes(pathname);
}
