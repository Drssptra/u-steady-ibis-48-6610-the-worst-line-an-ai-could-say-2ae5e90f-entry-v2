// Worst-line entry for make.fun: a single canned pickup line, written
// byte-for-byte to entry.txt. Nothing here is random or generated at
// runtime — the judge scores one fixed string, so the program's only real
// job is to reproduce that string faithfully and refuse to emit anything
// that breaks the bounty rules (over 140 chars, blank, or newline-ended).
//
// Layout: the wording lives in line.ts; this file owns validation and
// output. A table of rules is applied in order, and the file is written
// through a raw file descriptor so no library can append a trailing
// newline behind our back.

import { closeSync, mkdirSync, openSync, writeSync } from 'node:fs';
import { resolve } from 'node:path';

import { buildLine } from './line.ts';

const MAX_CHARS = 140;

type Rule = { name: string; ok: (text: string) => boolean };

const RULES: Rule[] = [
  { name: 'non-empty', ok: (t) => t.length > 0 },
  { name: 'within-140-chars', ok: (t) => t.length <= MAX_CHARS },
  { name: 'not-whitespace-only', ok: (t) => t.trim().length > 0 },
  { name: 'no-trailing-newline', ok: (t) => !t.endsWith('\n') },
  { name: 'single-line', ok: (t) => !t.includes('\n') },
];

function checkLine(text: string): void {
  const failed = RULES.filter((rule) => !rule.ok(text));
  if (failed.length > 0) {
    throw new Error(
      `line failed validation: ${failed.map((r) => r.name).join(', ')}`,
    );
  }
}

function outputPath(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  mkdirSync(dir, { recursive: true });
  return resolve(dir, 'entry.txt');
}

function emit(text: string, path: string): void {
  const fd = openSync(path, 'w');
  try {
    const bytes = Buffer.from(text, 'utf8');
    let written = 0;
    while (written < bytes.length) {
      written += writeSync(fd, bytes, written, bytes.length - written);
    }
  } finally {
    closeSync(fd);
  }
}

function main(): void {
  const line = buildLine();
  checkLine(line);
  emit(line, outputPath());
  process.stdout.write(`${line}\n`);
}

main();
