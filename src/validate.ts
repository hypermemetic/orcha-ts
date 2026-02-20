import { execSync } from 'child_process';

export interface ValidationArtifact {
  test_command: string;
  cwd: string;
}

export interface TestResult {
  success: boolean;
  output: string;
}

// Scan accumulated output text for {"orcha_validate": {...}}
export function extractArtifact(text: string): ValidationArtifact | null {
  const match = text.match(/\{"orcha_validate"\s*:\s*(\{[^}]+\})\}/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

export function runTest(artifact: ValidationArtifact): TestResult {
  try {
    const output = execSync(artifact.test_command, {
      cwd: artifact.cwd,
      encoding: 'utf8',
      timeout: 60_000,
    });
    return { success: true, output };
  } catch (e: any) {
    return { success: false, output: e.stderr || e.stdout || String(e) };
  }
}
