import fs from 'node:fs';
import path from 'node:path';

const EVIDENCE_LIBRARY_PLAN_PATH = path.resolve(
  process.cwd(),
  '../../public-data/evidence-library/evidence-library-plan.json'
);

export interface EvidenceLibraryPhase {
  id: string;
  status: string;
  deliverables: string[];
}

export interface EvidenceLibraryWorkflowStep {
  id: string;
  title: string;
  input: string;
  output: string;
}

export interface EvidenceLibraryPlan {
  id: string;
  version: string;
  title: string;
  status: string;
  updatedAt: string;
  goal: string;
  principle: string;
  publicRoute: string;
  sourceRoot: string;
  actors: {
    myblog: {
      role: string;
      publicApp: string;
      adminApp: string;
      dataRoot: string;
    };
    openlist: {
      role: string;
      baseUrl: string;
      activeMounts: string[];
      apis: Record<string, string>;
      semanticPolicy: string;
    };
    remotion: {
      role: string;
      manifestInput: string;
    };
  };
  hardRules: Record<string, boolean>;
  workflow: EvidenceLibraryWorkflowStep[];
  phases: EvidenceLibraryPhase[];
  recommendedDirectories: Record<string, string>;
}

export function getEvidenceLibraryPlan(): EvidenceLibraryPlan {
  const source = fs.readFileSync(EVIDENCE_LIBRARY_PLAN_PATH, 'utf8');
  return JSON.parse(source) as EvidenceLibraryPlan;
}
