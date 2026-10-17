import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Code2 } from "lucide-react";
import { contexts } from "@/data/contexts";
import CopyInstructions from "@/app/composants/CopyInstructions";

export function generateStaticParams() {
  return contexts.map((context) => ({
    slug: context.slug,
  }));
}

async function ContextDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const context = contexts.find((item) => item.slug === slug);

  if (!context) {
    return (
      <main className="min-h-screen bg-[#090d18] px-6 py-20 text-slate-100">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold">Contexte introuvable</h1>

          <p className="mt-4 text-slate-400">
            {"  Ce contexte n'existe pas ou n'est pas encore disponible."}
          </p>

          <Link
            href="/pages/explorer"
            className="mt-6 inline-flex items-center gap-2 text-orange-400 transition hover:text-orange-300"
          >
            <ArrowLeft size={18} />
            {" Retour à l'exploration"}
          </Link>
        </div>
      </main>
    );
  }

  const Icon = context.icon;

  return (
    <main className="min-h-screen bg-[#090d18] px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/pages/explorer"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-orange-400"
        >
          <ArrowLeft size={18} />
          Retour aux contextes
        </Link>

        <section className="mt-10 rounded-2xl border border-white/10 bg-[#111827] p-6 md:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/10 text-orange-400">
            <Icon size={28} />
          </div>

          <p className="mt-6 text-sm font-medium text-orange-400">
            {context.service}
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            {context.title}
          </h1>

          <p className="mt-4 leading-7 text-slate-400">{context.description}</p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <Globe size={16} />
              {context.country}
            </span>

            <span className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <Code2 size={16} />
              {context.language}
            </span>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">À propos de ce contexte</h2>

          <p className="mt-3 leading-7 text-slate-400">{context.overview}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold">
            Instructions et bonnes pratiques
          </h2>
          <div className="mt-5">
            <CopyInstructions instructions={context.instructions} />
          </div>
          <div className="mt-5 space-y-3">
            {context.instructions.map((instruction, index) => (
              <div
                key={instruction}
                className="flex gap-4 rounded-xl border border-white/10 bg-[#111827] p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-400/10 text-sm font-semibold text-orange-400">
                  {index + 1}
                </span>

                <p className="pt-1 leading-6 text-slate-300">{instruction}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ContextDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#090d18] text-slate-300">
          Chargement du contexte...
        </main>
      }
    >
      <ContextDetailContent params={params} />
    </Suspense>
  );
}
