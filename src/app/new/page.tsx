"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Clipboard, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  PromptCritique,
  PromptVariant,
  critiquePrompt,
  exampleUseCases,
  generateVariants,
  optimizePrompt,
  promptIntakeSchema,
  scorePrompt,
  type PromptIntake,
} from "@/lib/prompt-engine";
import { samplePrompts } from "@/data/sample-prompts";

type ActiveStep =
  | "use-case"
  | "intake"
  | "variants"
  | "critique"
  | "optimize"
  | "export";

const defaultIntake: PromptIntake = {
  goal: exampleUseCases[0].prompt,
  context: "Audience: PM & Marketing B2B. Canal: LinkedIn.",
  tone: "clair, crédible",
  constraints: "120-150 mots, 1 CTA, pas de jargon",
  format: "Texte avec 3 bullets clés",
  audience: "Prospects B2B",
};

export default function NewPromptFlow() {
  const [intake, setIntake] = useState<PromptIntake>(defaultIntake);
  const [activeStep, setActiveStep] = useState<ActiveStep>("use-case");
  const [variants, setVariants] = useState<PromptVariant[]>(() =>
    generateVariants(defaultIntake)
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string>("balanced");
  const [critique, setCritique] = useState<PromptCritique>(() =>
    critiquePrompt(generateVariants(defaultIntake)[1].content)
  );
  const [optimizedPrompt, setOptimizedPrompt] = useState<string>(() =>
    optimizePrompt(generateVariants(defaultIntake)[1], critique)
  );
  const [error, setError] = useState<string | null>(null);
  const [exportMessage, setExportMessage] = useState<string>("");

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? variants[0],
    [variants, selectedVariantId]
  );

  const score = useMemo(
    () => scorePrompt(selectedVariant?.content || ""),
    [selectedVariant]
  );

  const nextActionCopy: Record<ActiveStep, string> = {
    "use-case": "Choisis un cas d’usage ou laisse-nous deviner.",
    intake: "Renseigne objectif, contexte et format minimal.",
    variants: "Compare Safe/Balanced/Aggressive et sélectionne.",
    critique: "Accepte les suggestions ou précise tes réponses.",
    optimize: "Lance l’optimisation auto puis teste.",
    export: "Copie ou exporte vers Notion/PDF/API.",
  };

  const handleGenerate = () => {
    const parsed = promptIntakeSchema.safeParse(intake);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Champs manquants");
      return;
    }
    const nextVariants = generateVariants(parsed.data);
    const preferred = nextVariants.find((v) => v.type === "balanced")!;
    const nextCritique = critiquePrompt(preferred.content);
    setVariants(nextVariants);
    setSelectedVariantId(preferred.id);
    setCritique(nextCritique);
    setOptimizedPrompt(optimizePrompt(preferred, nextCritique));
    setActiveStep("variants");
    setError(null);
    setExportMessage("");
  };

  const handleOptimize = () => {
    if (!selectedVariant) return;
    const nextCritique = critiquePrompt(selectedVariant.content);
    setCritique(nextCritique);
    setOptimizedPrompt(optimizePrompt(selectedVariant, nextCritique));
    setActiveStep("optimize");
  };

  const handleExport = (target: string) => {
    setExportMessage(`Export prêt pour ${target}. Lien API simulé.`);
    setActiveStep("export");
  };

  const handleUseCase = (prompt: string) => {
    setIntake((prev) => ({ ...prev, goal: prompt }));
    setActiveStep("intake");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Flux guidé</p>
          <h1 className="text-3xl font-semibold">
            Crée un prompt, critique-le et exporte-le.
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/">Accueil</Link>
          </Button>
          <Button asChild>
            <Link href="/library">
              Bibliothèque <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Étapes sans friction
          </CardTitle>
          <CardDescription>{nextActionCopy[activeStep]}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={["use-case", "intake", "variants", "critique", "optimize", "export"].indexOf(activeStep) * 20} />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card id="use-case" className="border-border/70">
          <CardHeader>
            <CardTitle>1) Choix du cas d’usage</CardTitle>
            <CardDescription>
              Sélectionne un exemple ou clique “je ne sais pas” et remplis juste
              l’objectif.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {exampleUseCases.map((useCase) => (
              <button
                key={useCase.id}
                onClick={() => handleUseCase(useCase.prompt)}
                className="rounded-xl border border-border/80 bg-card p-4 text-left transition hover:border-primary/50 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{useCase.label}</h3>
                  <Badge variant="secondary">{useCase.id}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {useCase.prompt}
                </p>
              </button>
            ))}
            <div className="rounded-xl border border-dashed border-border/80 p-4">
              <p className="text-sm text-muted-foreground">
                Je ne sais pas → décris simplement l’objectif et on t’accompagne
                étape suivante.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card id="intake" className="border-border/70">
          <CardHeader>
            <CardTitle>2) Collecte minimale</CardTitle>
            <CardDescription>
              Objectif, contexte, ton, contraintes, format de sortie.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="goal">Objectif</Label>
              <Textarea
                id="goal"
                value={intake.goal}
                onChange={(e) => setIntake({ ...intake, goal: e.target.value })}
                placeholder="Ex: générer un post LinkedIn annonçant un webinar"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="context">Contexte</Label>
              <Textarea
                id="context"
                value={intake.context}
                onChange={(e) =>
                  setIntake({ ...intake, context: e.target.value })
                }
                placeholder="Audience, canal, contraintes business…"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="tone">Ton</Label>
              <Input
                id="tone"
                value={intake.tone || ""}
                onChange={(e) => setIntake({ ...intake, tone: e.target.value })}
                placeholder="Clair, précis, crédible…"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="constraints">Contraintes</Label>
              <Input
                id="constraints"
                value={intake.constraints || ""}
                onChange={(e) =>
                  setIntake({ ...intake, constraints: e.target.value })
                }
                placeholder="Longueur, sections, interdits…"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="format">Format de sortie</Label>
              <Input
                id="format"
                value={intake.format || ""}
                onChange={(e) =>
                  setIntake({ ...intake, format: e.target.value })
                }
                placeholder='Ex: JSON avec {"title","bullets"} ou Markdown structuré'
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="audience">Audience</Label>
              <Input
                id="audience"
                value={intake.audience || ""}
                onChange={(e) =>
                  setIntake({ ...intake, audience: e.target.value })
                }
                placeholder="PM, devs, étudiants…"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">
                {error} • Ajoute au moins un objectif clair.
              </p>
            )}
            <div className="md:col-span-2">
              <Button onClick={handleGenerate} className="w-full md:w-auto">
                Générer 3 variantes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card id="variants" className="border-border/70">
          <CardHeader>
            <CardTitle>3) Variantes Safe / Balanced / Aggressive</CardTitle>
            <CardDescription>
              Compare, consulte le score et sélectionne ta base.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={selectedVariantId}
              onValueChange={(val) => {
                setSelectedVariantId(val);
                setActiveStep("critique");
              }}
            >
              <TabsList className="grid w-full grid-cols-3">
                {variants.map((variant) => (
                  <TabsTrigger key={variant.id} value={variant.id}>
                    {variant.title} ({variant.score}/100)
                  </TabsTrigger>
                ))}
              </TabsList>
              {variants.map((variant) => (
                <TabsContent key={variant.id} value={variant.id}>
                  <div className="rounded-xl border border-border/70 bg-card p-4">
                    <div className="flex items-center justify-between">
                      <Badge>{variant.type}</Badge>
                      <span className="text-sm text-primary">
                        Score {variant.score}/100
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                      {variant.content}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {variant.rationale}
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card id="critique" className="border-border/70">
          <CardHeader>
            <CardTitle>4) Mode Critique</CardTitle>
            <CardDescription>
              Analyse des failles, questions manquantes et risques hallu.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 space-y-2">
              <h4 className="font-semibold">Failles détectées</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {critique.issues.map((issue) => (
                  <li key={issue} className="rounded-lg bg-muted/60 p-2">
                    {issue}
                  </li>
                ))}
              </ul>
              <h4 className="mt-4 font-semibold">Questions à clarifier</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {critique.questions.map((q) => (
                  <li key={q} className="rounded-lg bg-muted/60 p-2">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 rounded-xl border border-border/70 p-4">
              <p className="text-sm font-semibold">Risque hallu</p>
              <Badge variant="secondary">{critique.hallucinationRisk}</Badge>
              <Separator />
              <p className="text-sm font-semibold">Guardrails à ajouter</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {critique.missingGuardrails.map((g) => (
                  <li key={g} className="rounded-lg bg-muted/60 p-2">
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card id="optimize" className="border-border/70">
          <CardHeader>
            <CardTitle>5) Optimisation automatique</CardTitle>
            <CardDescription>
              Réécriture + contraintes + guardrails + format ready-to-use.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleOptimize} variant="outline">
                Appliquer la critique
              </Button>
              <div className="text-sm text-muted-foreground">
                Score estimé: {score.total}/100 (clarté {score.breakdown.clarity}
                , complétude {score.breakdown.completeness})
              </div>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/80 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Prompt optimisé</p>
                <Badge variant="outline" className="uppercase">
                  Guardrails
                </Badge>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                {optimizedPrompt}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card id="export" className="border-border/70">
          <CardHeader>
            <CardTitle>6) Export / Run</CardTitle>
            <CardDescription>
              Copier, PDF, Notion, API, Run in ChatGPT/Claude.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => handleExport("Copier")} variant="secondary">
              <Clipboard className="mr-2 h-4 w-4" />
              Copier
            </Button>
            <Button onClick={() => handleExport("PDF")} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button onClick={() => handleExport("Notion")} variant="outline">
              Notion
            </Button>
            <Button onClick={() => handleExport("API")} variant="outline">
              API
            </Button>
            <Button onClick={() => handleExport("Run in ChatGPT")}>
              Run in ChatGPT
            </Button>
            <Button onClick={() => handleExport("Run in Claude")}>
              Run in Claude
            </Button>
            {exportMessage && (
              <p className="text-sm text-primary">{exportMessage}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Prompts prêts dans la bibliothèque</CardTitle>
          <CardDescription>
            Parcours, score, variantes, format testable.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {samplePrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="rounded-xl border border-border/70 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{prompt.useCase}</Badge>
                <Badge className="capitalize">{prompt.variant}</Badge>
              </div>
              <h4 className="mt-2 text-lg font-semibold">{prompt.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {prompt.content}
              </p>
              <div className="mt-2 text-sm text-primary">
                Score {prompt.score}/100
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
