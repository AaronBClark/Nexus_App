export type SeedKind =
  | "template"
  | "plan"
  | "report"
  | "module"
  | "policy"
  | "element"
  | "initiative"
  | "program";
export type SeedFactory = (authorUserId: string) => any;