import { z } from "zod";

export type PromptTone = "clair" | "pédagogique" | "percutant";
export type PromptVariantType = "safe" | "balanced" | "aggressive";

export const promptIntakeSchema = z.object({
  goal: z.string().min(6, "Décris l'objectif du prompt."),
  context: z.string().optional(),
  tone: z.string().optional(),
  constraints: z.string().optional(),
  format: z.string().optional(),
  audience: z.string().optional(),
});

export type PromptIntake = z.infer<typeof promptIntakeSchema>;

export type PromptVariant = {
  id: string;
  type: PromptVariantType;
  title: string;
  content: string;
  score: number;
  rationale: string;
};

export type PromptCritique = {
  issues: string[];
  questions: string[];
  hallucinationRisk: "low" | "medium" | "high";
  missingGuardrails: string[];
};

export type PromptScoreBreakdown = {
  clarity: number;
  completeness: number;
  testability: number;
  hallucinationRisk: number;
  formatCompliance: number;
};

const baseExamples = {
  linkedin: {
    title: "Post LinkedIn B2B",
    prompt:
      "Tu es un copywriter B2B. Objectif: annoncer un webinar sur l'IA. Audience: PM/Marketing. Ton: clair, crédible. Contraintes: 120-150 mots, 1 call-to-action, pas de jargon. Format: texte simple avec 3 bullets clés.",
  },
  refacto: {
    title: "Refacto code TypeScript",
    prompt:
      "Tu es un reviewer JS senior. Objectif: refactorer la fonction fournie pour lisibilité et tests. Contexte: Node 18, TypeScript strict. Contraintes: garder mêmes entrées/sorties, ajouter jsdoc, proposer 2 noms alternatifs. Output JSON: {\"refactored_code\", \"rationale\", \"breaking_change_risk\":0-1}.",
  },
  cours: {
    title: "Plan de cours",
    prompt:
      "Tu es un professeur de mathématiques niveau lycée. Objectif: plan de 6 semaines sur les équations différentielles. Ton: motivant, précis. Contraintes: inclure prérequis, activités pratiques hebdo, évaluation formative. Output: markdown avec sections Semaine, Objectifs, Activités, Évaluation.",
  },
};

export function generateVariants(intake: PromptIntake): PromptVariant[] {
  const goal = intake.goal || "Spécifie ton objectif";
  const context = intake.context || "Contexte minimal";
  const tone = intake.tone || "professionnel";
  const constraints = intake.constraints || "Contraintes explicites";
  const format = intake.format || "Format de sortie attendu";

  const basePrompt = (guardrail: string, assertiveness: string) =>
    `Rôle: expert ${tone}. Objectif: ${goal}. Contexte: ${context}. Audience: ${intake.audience || "à préciser"}. Contraintes: ${constraints}. Format: ${format}. ${guardrail}. Niveau d'assertivité: ${assertiveness}. Respecte la structure et évite les hallucinations.`;

  return [
    {
      id: "safe",
      type: "safe",
      title: "Variante Safe",
      content: basePrompt(
        "Ajoute des avertissements si l'information manque. Cite les sources ou indique si l'information est hypothétique.",
        "Prudent"
      ),
      score: 82,
      rationale: "Maximise la sécurité et la conformité au format.",
    },
    {
      id: "balanced",
      type: "balanced",
      title: "Variante Balanced",
      content: basePrompt(
        "Utilise un ton neutre et rappelle de demander les données manquantes avant d'exécuter.",
        "Neutre"
      ),
      score: 88,
      rationale: "Équilibre précision et créativité, bon respect des schémas.",
    },
    {
      id: "aggressive",
      type: "aggressive",
      title: "Variante Aggressive",
      content: basePrompt(
        "Optimise pour la concision et la vitesse. Suppose des valeurs raisonnables si une donnée est absente et signale l'assumption dans la sortie.",
        "Direct"
      ),
      score: 80,
      rationale: "Priorise la complétude et la vitesse avec garde-fous minimaux.",
    },
  ];
}

export function critiquePrompt(content: string): PromptCritique {
  const lower = content.toLowerCase();
  const needsSchema =
    !lower.includes("json") && !lower.includes("markdown") && !lower.includes("schema");
  const needsLength = !lower.includes("mots") && !lower.includes("tokens");

  const issues = [
    needsSchema
      ? "Préciser la structure de sortie (JSON/Markdown) pour la rendre testable."
      : "Format de sortie présent.",
    needsLength
      ? "Expliciter les limites de longueur ou de sections."
      : "Longueur contrôlée.",
  ];

  const questions = [
    "Quelle est la source d'autorité ou le style de référence ?",
    "Faut-il inclure des exemples négatifs à éviter ?",
  ];

  const hallucinationRisk: PromptCritique["hallucinationRisk"] = needsSchema
    ? "medium"
    : "low";

  const missingGuardrails = [
    "Ajouter une clause 'si information manquante, poser 2 questions'.",
    "Inclure la vérification de conformité au schéma en fin de réponse.",
  ];

  return { issues, questions, hallucinationRisk, missingGuardrails };
}

export function optimizePrompt(
  variant: PromptVariant,
  critique: PromptCritique
): string {
  return `${variant.content}\n\nGuardrails:\n- ${critique.missingGuardrails.join(
    "\n- "
  )}\n- Indique les hypothèses explicites.\n- Termine par un résumé des validations effectuées.`;
}

export function scorePrompt(content: string): {
  total: number;
  breakdown: PromptScoreBreakdown;
} {
  const lengthPenalty = content.length > 900 ? -5 : 0;
  const schemaBonus = content.toLowerCase().includes("json") ? 3 : 0;

  const breakdown: PromptScoreBreakdown = {
    clarity: 23 + schemaBonus,
    completeness: 18,
    testability: 18 + schemaBonus,
    hallucinationRisk: 16 + lengthPenalty,
    formatCompliance: 13 + schemaBonus,
  };
  const total =
    breakdown.clarity +
    breakdown.completeness +
    breakdown.testability +
    breakdown.hallucinationRisk +
    breakdown.formatCompliance;
  const normalized = Math.min(100, Math.max(60, Math.round((total / 90) * 95)));
  return { total: normalized, breakdown };
}

export const exampleUseCases = [
  { id: "linkedin", label: "Post LinkedIn", ...baseExamples.linkedin },
  { id: "refacto", label: "Refacto code", ...baseExamples.refacto },
  { id: "cours", label: "Plan de cours", ...baseExamples.cours },
];
