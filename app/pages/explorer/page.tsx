"use client";

import { ArrowRight, Search, SlidersHorizontal, Globe } from "lucide-react";

import { useState } from "react";
import Link from "next/link";
import { contexts } from "@/data/contexts";

export default function ExplorerPage() {
  const [recherche, setRecherche] = useState("");
  const [service, setService] = useState("Tous");
  const [pays, setPays] = useState("Tous");

  const contextesFiltres = contexts.filter((context) => {
    const rechercheMinuscule = recherche.toLowerCase();

    const correspondRecherche =
      context.title.toLowerCase().includes(rechercheMinuscule) ||
      context.description.toLowerCase().includes(rechercheMinuscule) ||
      context.country.toLowerCase().includes(rechercheMinuscule) ||
      context.language.toLowerCase().includes(rechercheMinuscule);

    const correspondService = service === "Tous" || context.service === service;

    const correspondPays = pays === "Tous" || context.country === pays;

    return correspondRecherche && correspondService && correspondPays;
  });

  return (
    <main className="min-h-screen bg-[#090d18] px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="text-sm text-slate-400 transition hover:text-orange-400"
        >
          {" ← Retour à l'accueil"}
        </Link>

        <div className="mt-10">
          <p className="text-sm font-medium text-orange-400">
            BIBLIOTHÈQUE TECHNIQUE
          </p>

          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            Explorer les contextes
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Découvrez des ressources techniques pour intégrer les services
            africains et mieux guider votre assistant IA.
          </p>
        </div>

        {/* Recherche et filtres */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row">
          {/* Barre de recherche */}
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#111827] px-4">
            <Search size={20} className="text-slate-500" />

            <input
              type="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un contexte..."
              className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Filtre par service */}
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111827] px-4">
            <SlidersHorizontal size={18} className="text-orange-400" />

            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="bg-transparent py-4 text-sm text-slate-200 outline-none"
            >
              <option className="bg-[#111827]" value="Tous">
                Tous les services
              </option>
              <option className="bg-[#111827]" value="Paiement">
                Paiement
              </option>
              <option className="bg-[#111827]" value="Communication">
                Communication
              </option>
            </select>
          </div>

          {/* Filtre par pays */}
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111827] px-4">
            <Globe size={18} className="text-orange-400" />

            <select
              value={pays}
              onChange={(e) => setPays(e.target.value)}
              className="bg-transparent py-4 text-sm text-slate-200 outline-none"
            >
              <option className="bg-[#111827]" value="Tous">
                Tous les pays
              </option>
              <option className="bg-[#111827]" value="Sénégal">
                Sénégal
              </option>
              <option className="bg-[#111827]" value="Côte d'Ivoire">
                {" Côte d'Ivoire"}
              </option>
              <option className="bg-[#111827]" value="Afrique">
                Afrique
              </option>
            </select>
          </div>
        </div>

        {/* Nombre de résultats */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tous les contextes</h2>

          <span className="text-sm text-slate-500">
            {contextesFiltres.length}{" "}
            {contextesFiltres.length > 1 ? "contextes" : "contexte"}
          </span>
        </div>

        {/* Cartes des contextes */}
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {contextesFiltres.map((context) => {
            const Icon = context.icon;

            return (
              <article
                key={context.slug}
                className="rounded-2xl border border-white/10 bg-[#111827] p-6 transition hover:-translate-y-1 hover:border-orange-400/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-orange-400">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-lg font-semibold">{context.title}</h3>

                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">
                  {context.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-md bg-white/5 px-2.5 py-1.5 text-xs text-slate-300">
                    {context.service}
                  </span>

                  <span className="rounded-md bg-white/5 px-2.5 py-1.5 text-xs text-slate-300">
                    {context.country}
                  </span>

                  <span className="rounded-md bg-white/5 px-2.5 py-1.5 text-xs text-slate-300">
                    {context.language}
                  </span>
                </div>

                <Link
                  href={`/pages/explorer/${context.slug}`}
                  className="mt-6 flex items-center gap-2 text-sm font-medium text-orange-400 transition hover:text-orange-300"
                >
                  Voir le contexte
                  <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}

          {/* Aucun résultat */}
          {contextesFiltres.length === 0 && (
            <p className="col-span-full py-12 text-center text-slate-400">
              Aucun contexte trouvé. Essaie une autre recherche ou modifie tes
              filtres.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
