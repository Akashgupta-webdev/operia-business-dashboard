// Keep the existing cache roots: invalidation relies on these exact prefixes.
export const authKeys = {
  session: ["auth","session"],
  currentClient: ["client","me"],

};
