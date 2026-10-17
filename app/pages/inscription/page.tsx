"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { Inscription } from "@/app/controller/inscription";

export default function InscriptionPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loader, setloader] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Les champs correspondants en base : nom, email, mot_de_passe_hash, github_id (null), github_url (null), reputation_score (0), role ('user')
    Inscription(
      nom,
      email,
      password,
      setError,
      setloader,
      setEmail,
      setPassword,
      setNom,
    );
    /**
    *  setError(
      "L’inscription n’est pas encore activée. Elle sera connectée à la base de données à la prochaine étape.",
    );
    */
  };

  const handleGithubSignup = () => {
    setError(
      "L’inscription via GitHub sera disponible après la configuration de l’authentification OAuth.",
    );
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090d18] px-4 py-10 text-white">
      {/* Effets d'arrière-plan */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-orange-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-600/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Retour à l'accueil */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Retour à l’accueil
        </Link>

        {/* Logo et titre */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center justify-center gap-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 ring-1 ring-orange-400/20">
              <Sparkles size={23} />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              Afri<span className="text-orange-400">Context</span>
            </span>
          </Link>

          <h1 className="mb-2 text-2xl font-bold tracking-tight">
            Rejoins la communauté
          </h1>

          <p className="text-sm leading-6 text-gray-400">
            Crée ton compte pour contribuer aux fiches d’intégration et partager
            ton expérience.
          </p>
        </div>

        {/* Formulaire */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom */}
            <div>
              <label
                htmlFor="nom"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Nom complet
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  id="nom"
                  type="text"
                  placeholder="Lamine Bandaogo"
                  value={nom}
                  onChange={(e) => {
                    setNom(e.target.value);
                    setError("");
                  }}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#0d1220] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Adresse e-mail
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#0d1220] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Mot de passe
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Choisis un mot de passe sécurisé"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#0d1220] py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Message d'information */}
            {error && (
              <div
                role="status"
                className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm leading-5 text-amber-300"
              >
                {error}
              </div>
            )}

            {/* Bouton d'inscription */}
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
            >
              Créer mon compte
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>

          {/* Séparateur */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-500">
              {"OU S'INSCRIRE AVEC"}
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Inscription GitHub */}
          <button
            type="button"
            onClick={handleGithubSignup}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-medium text-gray-200 transition hover:border-orange-400/40 hover:bg-white/[0.06]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-white text-xs font-bold text-black">
              GH
            </span>
            {" S'inscrire avec GitHub"}
          </button>

          {/* Lien connexion */}
          <p className="mt-7 text-center text-sm text-gray-400">
            Tu as déjà un compte ?{" "}
            <Link
              href="/pages/connexion"
              className="font-medium text-orange-400 transition hover:text-orange-300"
            >
              Se connecter
            </Link>
          </p>
        </div>

        {/* Mention de sécurité */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck size={15} />
          <span>
            Données sécurisées et profil par défaut en mode contributeur.
          </span>
        </div>
      </div>
    </main>
  );
}
