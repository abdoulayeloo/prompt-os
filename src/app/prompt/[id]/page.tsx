import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { samplePrompts } from "@/data/sample-prompts";

type PromptDetailPageProps = {
  params: { id: string };
};

export default function PromptDetailPage({ params }: PromptDetailPageProps) {
  const prompt = samplePrompts.find((p) => p.id === params.id);
  if (!prompt) return notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/library">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{prompt.useCase}</Badge>
            <Badge className="capitalize">{prompt.variant}</Badge>
          </div>
          <CardTitle className="text-2xl">{prompt.title}</CardTitle>
          <CardDescription>Score {prompt.score}/100</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {prompt.content}
          </p>
          <div className="rounded-xl border border-dashed border-border/80 p-4 text-sm text-muted-foreground">
            Checklist QA: rôle défini, contraintes explicites, format JSON/Markdown, questions manquantes listées, mention des hypothèses et validations finales.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
