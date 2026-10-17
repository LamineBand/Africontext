"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  LockKeyhole,
  UserRound,
  Eye,
  EyeOff,
  LoaderCircle,
  Code2,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function AdminLoginPage() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!login.trim() || !password) {
      setError("Le login et le mot de passe sont obligatoires.");
      return;
    }

    try {
      setLoading(true);

      const req = await axios.post("/API/connexionAdmine", {
        login,
        mdp: password,
      });

      if (req.status === 200) {
        setError("");
        setLogin("");
        setPassword("");
        router.push("/pages/admin");
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);

      if (axios.isAxiosError(error)) {
        // Récupérer le message envoyé par le backend
        const message = error.response?.data?.message;

        setError(
          typeof message === "string"
            ? message
            : "Impossible de contacter le serveur. Réessaie plus tard.",
        );
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090d18] px-6 py-10 text-slate-100">
      {/* Arrière-plan */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-400/5 blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <section className="relative z-10 w-full max-w-md">
        {/* Retour à l'accueil */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          {"  Retour à l'accueil"}
        </Link>

        {/* Identité AfriContext */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/10">
            <Code2 size={27} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Afri<span className="text-orange-400">Context</span>
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {"  Espace d'administration"}
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-7">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/5 text-orange-400">
              <ShieldCheck size={23} />
            </div>

            <h2 className="text-xl font-bold">Connexion administrateur</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Connecte-toi pour vérifier les contextes partagés par les
              contributeurs et gérer la plateforme.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login */}
            <div>
              <label
                htmlFor="login"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Login
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="login"
                  name="login"
                  type="text"
                  autoComplete="username"
                  maxLength={100}
                  required
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Ton identifiant"
                  className="w-full rounded-xl border border-white/10 bg-[#090d18] py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/10"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Mot de passe
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ton mot de passe"
                  className="w-full rounded-xl border border-white/10 bg-[#090d18] py-3 pl-11 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-orange-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400"
              >
                {error}
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  {" Accéder à l'administration"}
                  <ShieldCheck size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-center text-xs leading-5 text-slate-500">
              {"Accès réservé à l'administrateur autorisé d'AfriContext."}
            </p>
          </div>
        </div>

        {/* Pied de page */}
        <p className="mt-6 text-center text-xs text-slate-500">
          AfriContext · Construit pour les développeurs africains.
        </p>
      </section>
    </main>
  );
}
