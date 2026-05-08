import { describe, expect, it } from 'vitest';
import { buildGradeTree, buildNameLookup } from './hierarchy.js';

const entries = [
  { examCode: '2526_I_INF_FISA_S07_AEE', name: 'AEE', nameEn: 'AEE' },
  { examCode: '2526_I_INF_FISA_S07_AEE_AE', name: "Evaluation de l'apprentissage en entreprise", nameEn: 'Work-based learning assessment' },
  { examCode: '2526_I_INF_FISA_S07_AEE_AE_EX', name: "Evaluation de l'apprentissage en entreprise - Examen", nameEn: 'Work-based learning assessment - Exam', avgPreRatt: '12' },
];

describe('grade tree localization', () => {
  it('keeps English names for subjects and marks', () => {
    const tree = buildGradeTree([
      { examCode: '2526_I_INF_FISA_S07_AEE_AE_EX', mark: 18, coefficient: 1 },
    ], buildNameLookup(entries));

    expect(tree[0].nameEn).toBe('AEE');
    expect(tree[0].subjects[0].nameEn).toBe('Work-based learning assessment');
    expect(tree[0].subjects[0].marks[0].nameEn).toBe('Work-based learning assessment - Exam');
  });
});
