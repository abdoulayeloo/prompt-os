import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FolderGit2,
  Play,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { samplePrompts } from "@/data/sample-prompts";

const highlights = [
  "Flux guidé: intake → critique → optimisation → export.",
  "3 variantes Safe/Balanced/Aggressive + scoring automatique.",
  "Exports prêts: copier, PDF, Notion, lien API, Run in ChatGPT/Claude.",
  "Guardrails anti-hallucinations + checklist QA intégrée.",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <header className="flex items-center justify-between border-b border-border/60 px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">PromptFoundry</p>
            <p className="text-xs text-muted-foreground">
              Du brouillon au prompt blindé
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/library">Bibliothèque</Link>
          </Button>
          <Button asChild>
            <Link href="/new">
              Commencer <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">
              SaaS B2B/B2C • Prompt Engine
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Génère un prompt clair, scoré et testable en moins de 5 minutes.
            </h1>
            <p className="text-lg text-muted-foreground">
              Un flux guidé de zéro à l’export: diagnostic, variantes, critique,
              optimisation automatique et guardrails intégrés. Pensé pour le
              marketing, le code, le juridique, la data, l’éducation, et plus.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/new">
                  Lancer le flux guidé
                  <Play className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/library">Explorer les prompts</Link>
              </Button>
            </div>
            <div className="grid gap-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <Card className="shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle>3 use-cases prêts</CardTitle>
              <p className="text-sm text-muted-foreground">
                Variantes Safe/Balanced/Aggressive avec scoring immédiat.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {samplePrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="rounded-xl border border-border/70 bg-card p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{prompt.useCase}</Badge>
                      <Badge>{prompt.variant}</Badge>
                    </div>
                    <div className="text-sm font-medium text-primary">
                      Score {prompt.score}/100
                    </div>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold">{prompt.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {prompt.content}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Guardrails intégrés",
              desc: "Linting, critique, scoring, checklists anti-hallu.",
              icon: <ShieldCheck className="h-5 w-5" />,
            },
            {
              title: "Multi-modèles",
              desc: "Compatibilité ChatGPT, Claude, Llama avec layer neutre.",
              icon: <Play className="h-5 w-5" />,
            },
            {
              title: "Partage & exécution",
              desc: "Exports PDF/Notion/API et liens Run in ChatGPT/Claude.",
              icon: <ArrowRight className="h-5 w-5" />,
            },
          ].map((item) => (
            <Card key={item.title} className="border-border/70">
              <CardHeader className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardHeader>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
