import Link from "next/link";
import { BookOpen, Filter, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { samplePrompts } from "@/data/sample-prompts";

export default function LibraryPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Bibliothèque</p>
          <h1 className="text-3xl font-semibold">Prompts prêts à l’emploi</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau prompt
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {samplePrompts.map((prompt) => (
          <Card key={prompt.id} className="border-border/70">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{prompt.useCase}</Badge>
                <Badge>{prompt.variant}</Badge>
              </div>
              <CardTitle className="text-lg">{prompt.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {prompt.content}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-primary">
                Score {prompt.score}/100
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/prompt/${prompt.id}`}>Voir</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        <Card className="border-dashed border-border/80">
          <CardHeader>
            <CardTitle className="text-lg">Playbooks à venir</CardTitle>
            <CardDescription>
              Partagez vos prompts, créez des tags, lancez des A/B tests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-24 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
              <BookOpen className="mr-2 h-5 w-5" />
              Bientôt: templates collaboratifs
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
