/**
 * Shared admin-role check, used by both `proxy.ts` (route-level gate) and
 * every admin Server Action (defense in depth — Server Functions are POST
 * endpoints reachable directly, regardless of what the proxy allows through;
 * see node_modules/next/dist/docs/.../file-conventions/proxy.md, "Execution
 * order" section).
 *
 * Reads the role off `sessionClaims.publicMetadata.role`, which requires a
 * one-time Clerk Dashboard change — see the "Testing" note in the admin
 * README/PR description. Without that change, `publicMetadata` is not part
 * of the default session token and this will always read as `undefined`
 * (fails closed: no access, not a crash).
 */
export interface AdminSessionClaims {
  publicMetadata?: {
    role?: string;
  };
}

export function isAdminClaims(sessionClaims: unknown): boolean {
  const claims = sessionClaims as AdminSessionClaims | null | undefined;
  return claims?.publicMetadata?.role === "admin";
}
