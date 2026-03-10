
export function parseUserFromToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      email: payload.email,
      role: payload.role,
      // add other fields if needed
    };
  } catch {
    return null;
  }
}
