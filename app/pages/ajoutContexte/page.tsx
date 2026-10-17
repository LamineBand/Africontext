"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  FileText,
  Globe,
  Layers,
  PlusCircle,
  ShieldCheck,
  Tag,
  Terminal,
} from "lucide-react";

export default function NouveauContextePage() {
  const router = useRouter();

  // États du formulaire
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [service, setService] = useState("");
  const [pays, setPays] = useState(""); // Saisi sous forme de chaîne séparée par des virgules (ex: CI, SN)
  const [versionApi, setVersionApi] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [testedWith, setTestedWith] = useState(""); // Ex: Postman, Next.js
  const [contentPayload, setContentPayload] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Transformation de la chaîne pays et tested_with en tableaux propres
      const paysArray = pays
        ? pays
            .split(",")
            .map((p) => p.trim().toUpperCase())
            .filter(Boolean)
        : [];
      const testedWithArray = testedWith
        ? testedWith
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const payload = {
        slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
        title: title.trim(),
        description: description.trim(),
        type: type.trim(),
        service: service.trim(),
        pays: paysArray,
        version_api: versionApi.trim(),
        source_url: sourceUrl.trim(),
        tested_with: testedWithArray,
        content_payload: contentPayload,
        // author_id sera récupéré automatiquement côté back via la session/token connecté
      };

      const res = await axios.post("/API/contexts", payload);

      if (res.status === 201) {
        setSuccess("Fiche contexte enregistrée avec succès ! Redirection...");
        setTimeout(() => {
          router.push("/pages/explorer");
        }, 1500);
      }
    } catch (err: unknown) {
      console.error("Erreur lors de l'ajout du contexte :", err);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Une erreur est survenue lors de l'enregistrement.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#090d18] px-4 py-10 text-white">
      {/* Navigation de retour */}
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Retour à l’accueil
        </Link>

        {/* En-tête de la page */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/5 px-4 py-1.5 text-sm text-orange-300">
            <PlusCircle size={16} />
            Espace Contributeur
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ajouter une nouvelle{" "}
            <span className="text-orange-400">Fiche Contexte</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {
              "     Partagez une intégration propre et documentée pour enrichir l'écosystème des développeurs africains."
            }
          </p>
        </div>

        {/* Formulaire principal */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-md sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ligne 1 : Titre et Slug */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">
                  Titre de la fiche *
                </label>
                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Wave Payments Sénégal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0d1220] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">
                  Slug (URL unique) *
                </label>
                <div className="relative">
                  <Tag
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Ex: wave-payments"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0d1220] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
              </div>
            </div>

            {/* Ligne 2 : Type et Service */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">
                  {" Type d'intégration *"}
                </label>
                <div className="relative">
                  <Layers
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Paiement / Mobile Money / SMS"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0d1220] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">
                  Nom du service *
                </label>
                <div className="relative">
                  <Code2
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Wave / Orange Money / FedaPay"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0d1220] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
              </div>
            </div>

            {/* Ligne 3 : Pays, Version API et Source URL */}
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">
                  Pays (séparés par des virgules) *
                </label>
                <div className="relative">
                  <Globe
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Ex: SN, CI, BJ"
                    value={pays}
                    onChange={(e) => setPays(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0d1220] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">
                  {" Version de l'API"}
                </label>
                <input
                  type="text"
                  placeholder="Ex: v1.2"
                  value={versionApi}
                  onChange={(e) => setVersionApi(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">
                  Testé avec (ex: Postman, cURL)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Postman, Next.js"
                  value={testedWith}
                  onChange={(e) => setTestedWith(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>
            </div>

            {/* Source URL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">
                URL de la documentation source officielle
              </label>
              <input
                type="url"
                placeholder="Ex: https://developer.wave.com/docs"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0d1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
              />
            </div>

            {/* Description courte */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Description synthétique
              </label>
              <textarea
                rows={2}
                placeholder="Résumé rapide de l'intégration..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0d1220] p-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
              />
            </div>

            {/* Content Payload (Fact Sheet technique) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Contenu technique (Payload / Fact Sheet markdown ou JSON) *
              </label>
              <div className="relative">
                <Terminal
                  size={18}
                  className="absolute left-3.5 top-4 text-gray-500"
                />
                <textarea
                  required
                  rows={8}
                  placeholder="# Guide technique d'intégration... Renseignez les endpoints, headers, HMAC validation..."
                  value={contentPayload}
                  onChange={(e) => setContentPayload(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1220] py-3 pl-11 pr-4 font-mono text-xs text-orange-200 outline-none transition placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>
            </div>

            {/* Messages d'erreur ou de succès */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {success}
              </div>
            )}

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:opacity-50"
            >
              {loading
                ? "Enregistrement en cours..."
                : "Publier la fiche contexte"}
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>
        </div>

        {/* Mention de sécurité */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck size={15} />
          <span>
            Toutes les fiches soumises sont validées pour garantir la fiabilité
            des intégrations.
          </span>
        </div>
      </div>
    </main>
  );
}
