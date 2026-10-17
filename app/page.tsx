import {
  ArrowRight,
  Bot,
  Code2,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";

const contexts = [
  {
    slug: "wave-payments",
    title: "Wave Payments",
    description:
      "Comprendre les étapes d'intégration des paiements Wave et les précautions à prendre.",
    service: "Paiement",
    country: "Sénégal",
    language: "TypeScript",
    icon: Zap,
  },
  {
    slug: "orange-money",
    title: "Orange Money",
    description:
      "Découvrir les étapes d'intégration et la gestion des transactions.",
    service: "Paiement",
    country: "Côte d'Ivoire",
    language: "TypeScript",
    icon: ShieldCheck,
  },
  {
    slug: "sms-africa",
    title: "SMS Africa",
    description:
      "Préparer une intégration SMS et comprendre la gestion des erreurs.",
    service: "Communication",
    country: "Afrique",
    language: "JavaScript",
    icon: Terminal,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090d18] text-slate-100">
      {/* Navigation */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Code2 size={22} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Afri<span className="text-orange-400">Context</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            {/** <Link
              href="/pages/assistant"
              className="transition hover:text-orange-400"
            >
              Assistant
            </Link> */}

            <Link
              href="/pages/explorer"
              className="transition hover:text-white"
            >
              Explorer
            </Link>

            <Link
              href="/pages/authAdmine"
              className="transition hover:text-white"
            >
              Admin
            </Link>

            <Link
              href={"/pages/connexion"}
              className="transition hover:text-white"
            >
              Contribuer
            </Link>
          </nav>

          <Link
            href="/pages/assistant"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            <Bot size={17} />
            <span className="hidden sm:inline"> {"Essayer l'assistant"} </span>
            <span className="sm:hidden">Assistant</span>
          </Link>
        </div>
      </header>

      {/* Présentation principale */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 md:pb-28 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/5 px-4 py-2 text-sm text-orange-300">
            <ShieldCheck size={16} />
            Votre assistant {"d'intégration"} de services africains
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Intégrez les services africains
            <span className="mt-2 block text-orange-400">étape par étape.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
            Décrivez votre projet et obtenez un accompagnement pour comprendre
            les API, préparer votre code, configurer votre intégration et tester
            son fonctionnement.
          </p>

          {/* Boutons principaux */}
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/pages/assistant"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-400"
            >
              <Bot size={20} />
              {" Démarrer avec l'assistant"}
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/pages/explorer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#111827] px-6 py-4 text-sm font-semibold text-slate-200 transition hover:border-orange-400/40 hover:text-white"
            >
              Explorer les services
            </Link>
          </div>

          <p className="mt-5 text-xs text-slate-500">
            Paiements · API · Webhooks · Notifications · Authentification
          </p>
        </div>
      </section>

      {/* Aperçu des services */}
      <section
        id="explorer"
        className="mx-auto max-w-7xl scroll-mt-10 px-6 pb-24"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-orange-400">
              SERVICES DISPONIBLES
            </p>

            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              Que souhaitez-vous intégrer ?
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Découvrez quelques services et utilisez {"l'assistant"} pour
              préparer votre intégration.
            </p>
          </div>

          <Link
            href="/pages/explorer"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-400 transition hover:text-orange-300"
          >
            Voir tous les services
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {contexts.map((context) => {
            const Icon = context.icon;

            return (
              <article
                key={context.slug}
                className="group rounded-2xl border border-white/10 bg-[#111827] p-6 transition duration-200 hover:-translate-y-1 hover:border-orange-400/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-orange-400">
                    <Icon size={22} />
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                    {context.service}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold">{context.title}</h3>

                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">
                  {context.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-md bg-white/5 px-2.5 py-1.5 text-xs text-slate-300">
                    {context.country}
                  </span>

                  <span className="rounded-md bg-white/5 px-2.5 py-1.5 text-xs text-slate-300">
                    {context.language}
                  </span>
                </div>

                <Link
                  href={`/pages/explorer/${context.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-orange-400 transition group-hover:text-orange-300"
                >
                  Consulter le service
                  <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Fonctionnement */}
      <section
        id="fonctionnement"
        className="border-y border-white/10 bg-[#0d1220] px-6 py-16"
      >
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/5 text-orange-400">
            <Bot size={25} />
          </div>

          <h2 className="mt-5 text-2xl font-bold md:text-3xl">
            De votre idée à une intégration fonctionnelle.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            AfriContext a pour objectif de vous guider dans la compréhension des
            services, la préparation du code et les tests, en tenant compte de
            votre projet et de votre technologie.
          </p>

          <Link
            href="/pages/assistant"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            Commencer mon intégration
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Pied de page */}
      <footer
        id="contribuer"
        className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© 2026 AfriContext</p>
        <p>Construit pour les développeurs africains.</p>
      </footer>
    </main>
  );
}
