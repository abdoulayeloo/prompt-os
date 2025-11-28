export type SamplePrompt = {
  id: string;
  title: string;
  variant: "safe" | "balanced" | "aggressive";
  score: number;
  tags: string[];
  content: string;
  useCase: string;
};

export const samplePrompts: SamplePrompt[] = [
  {
    id: "linkedin-safe",
    title: "Annonce webinar IA",
    variant: "safe",
    score: 86,
    tags: ["marketing", "b2b"],
    useCase: "Post LinkedIn",
    content:
      "Rôle: copywriter B2B. Objectif: annoncer un webinar sur l’IA. Contexte: audience PM/Marketing. Ton: clair, crédible. Contraintes: 120-150 mots, 1 CTA, pas de jargon. Format: texte simple avec 3 bullets. Guardrails: si info manquante, poser 2 questions; ne pas inventer de stats.",
  },
  {
    id: "refacto-balanced",
    title: "Refacto fonction Node18",
    variant: "balanced",
    score: 90,
    tags: ["code", "typescript"],
    useCase: "Refacto code",
    content:
      "Tu es un reviewer JS senior. Objectif: refactorer la fonction fournie. Contexte: Node 18, TS strict. Contraintes: conserver l’API, ajouter jsdoc, proposer 2 noms alternatifs. Output JSON {refactored_code, rationale, breaking_change_risk:0-1}.",
  },
  {
    id: "cours-aggressive",
    title: "Plan cours équations diff.",
    variant: "aggressive",
    score: 82,
    tags: ["éducation", "maths"],
    useCase: "Plan de cours",
    content:
      "Tu es un professeur de maths lycée. Objectif: plan de 6 semaines sur les équations différentielles. Ton: motivant. Contraintes: inclure prérequis, activités pratiques hebdo, évaluation formative. Output markdown avec sections Semaine, Objectifs, Activités, Évaluation.",
  },
];
