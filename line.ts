// The entry line, kept apart from the I/O code so the wording can be
// reviewed on its own. It is assembled from three clauses — the setup
// (a fake data claim), the pivot (the "data" verdict), and the punchline
// (the ask) — joined with single spaces. The result is a fixed string:
// 97 characters, one line, no trailing newline.

export const CLAUSES = [
  'I have analyzed 4.2 million first dates,',
  'and the data says you should lower your standards',
  'to me.',
] as const;

export function buildLine(): string {
  return CLAUSES.join(' ');
}
