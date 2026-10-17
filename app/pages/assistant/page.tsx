"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Send,
  Code2,
  Globe,
  Zap,
  MessageSquare,
} from "lucide-react";
import axios from "axios";

export default function AssistantPage() {
  const [projet, setProjet] = useState("");
  const [service, setService] = useState("Wave");
  const [pays, setPays] = useState("Côte d'Ivoire");
  const [technologie, setTechnologie] = useState("Next.js");
  const [demarre, setDemarre] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
  }

  async function demarrerAssistant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!projet.trim() || demarre) return;

    const currentInput = projet;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setDemarre(true);
    setProjet("");

    try {
      const response = await axios.post("/API/ia", {
        prompt: currentInput,
        service,
        pays,
        technologie,

        // Historique des échanges précédents
        messages: messages.map(({ role, content }) => ({
          role,
          content,
        })),
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.texte,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Une erreur est survenue. Réessaie plus tard.",
        },
      ]);
    } finally {
      setDemarre(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090d18] text-slate-100">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-orange-400"
        >
          <ArrowLeft size={17} />
          {" Retour à l'accueil"}
        </Link>

        {/* En-tête */}
        <div className="mt-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10 text-orange-400">
            <Bot size={26} />
          </div>

          <p className="mt-5 text-sm font-medium text-orange-400">
            AFRICONTEXT AI
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Ton assistant de développement
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Configure ton projet et laisse AfriContext {"t'accompagner"} dans
            {" l'intégration"} de services africains, étape par étape.
          </p>
        </div>

        {/* Configuration */}
        <form
          onSubmit={demarrerAssistant}
          className="mt-10 rounded-2xl border border-white/10 bg-[#111827] p-5 md:p-8"
        >
          <h2 className="text-lg font-semibold">Configure ton intégration</h2>

          <p className="mt-2 text-sm text-slate-400">
            Indique les informations de ton projet pour préparer
            {"l'accompagnement."}
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {/* Service */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Zap size={16} className="text-orange-400" />
                Service à intégrer
              </label>

              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#090d18] px-4 py-3 text-sm outline-none focus:border-orange-400"
              >
                <option value="Wave">Wave</option>
                <option value="Orange Money">Orange Money</option>
                <option value="MTN MoMo">MTN Mobile Money</option>
                <option value="SMS Africa">SMS Africa</option>
                <option value="Autre">Autre service</option>
              </select>
            </div>

            {/* Pays */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Globe size={16} className="text-orange-400" />
                Pays concerné
              </label>

              <select
                value={pays}
                onChange={(e) => setPays(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#090d18] px-4 py-3 text-sm outline-none focus:border-orange-400"
              >
                <option value="Côte d'Ivoire">{"Côte d'Ivoire"}</option>
                <option value="Sénégal">Sénégal</option>
                <option value="Bénin">Bénin</option>
                <option value="Mali">Mali</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Autre pays">Autre pays</option>
              </select>
            </div>

            {/* Technologie */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Code2 size={16} className="text-orange-400" />
                Technologie
              </label>

              <select
                value={technologie}
                onChange={(e) => setTechnologie(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#090d18] px-4 py-3 text-sm outline-none focus:border-orange-400"
              >
                <option value="Next.js">Next.js</option>
                <option value="React">React</option>
                <option value="Node.js">Node.js</option>
                <option value="PHP">PHP</option>
                <option value="Python">Python</option>
                <option value="Autre">Autre technologie</option>
              </select>
            </div>
          </div>

          {/* Description du projet */}
          <div className="mt-6">
            <label htmlFor="projet" className="mb-2 block text-sm font-medium">
              Décris ce que tu veux construire
            </label>

            <textarea
              id="projet"
              value={projet}
              onChange={(e) => setProjet(e.target.value)}
              placeholder="Exemple : Je veux permettre aux clients de payer leurs commandes avec Wave dans mon application Next.js..."
              rows={5}
              className="w-full resize-y rounded-xl border border-white/10 bg-[#090d18] px-4 py-4 text-sm leading-6 outline-none placeholder:text-slate-600 focus:border-orange-400"
            />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-400"
          >
            {"Démarrer l'intégration"}
            <Send size={17} />
          </button>
        </form>

        {/* Espace de conversation */}

        {/* Espace de conversation */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-[#111827] p-5 md:p-8">
          {/* En-tête */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <MessageSquare size={21} />
            </div>

            <div>
              <h2 className="font-semibold">Espace de conversation</h2>
              <p className="text-xs text-slate-500">Assistant AfriContext</p>
            </div>
          </div>

          {/* Configuration sélectionnée */}
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-slate-300">
              Service : {service}
            </span>

            <span className="rounded-full border border-white/10 px-3 py-1.5 text-slate-300">
              Pays : {pays}
            </span>

            <span className="rounded-full border border-white/10 px-3 py-1.5 text-slate-300">
              Technologie : {technologie}
            </span>
          </div>

          {/* Messages */}
          <div className="mt-6 space-y-5">
            {messages.length === 0 && !demarre && (
              <div className="py-10 text-center">
                <Bot size={36} className="mx-auto text-slate-600" />

                <p className="mt-4 font-medium text-slate-300">
                  Ton prochain projet commence ici
                </p>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Décris ton besoin et AfriContext {"t'aidera"} à intégrer ton
                  service étape par étape.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-2xl rounded-2xl p-4 ${
                  message.role === "user"
                    ? "ml-auto rounded-tr-sm bg-orange-500/10"
                    : "rounded-tl-sm border border-white/10 bg-[#090d18]"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  {message.role === "assistant" && (
                    <Bot size={17} className="text-orange-400" />
                  )}

                  <p
                    className={`text-xs font-semibold ${
                      message.role === "user"
                        ? "text-orange-400"
                        : "text-slate-300"
                    }`}
                  >
                    {message.role === "user" ? "TOI" : "AFRICONTEXT AI"}
                  </p>
                </div>

                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">
                  {message.content}
                </p>
              </div>
            ))}

            {/* Chargement */}
            {demarre && (
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#090d18] p-4">
                <Bot size={20} className="text-orange-400" />

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    AfriContext réfléchit...
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Analyse du service, du pays et de la technologie.
                  </p>
                </div>

                <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-orange-400" />
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
