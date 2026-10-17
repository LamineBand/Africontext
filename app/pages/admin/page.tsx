"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  ClipboardCheck,
  CheckCircle2,
  Clock3,
  XCircle,
  Search,
  ChevronRight,
  FileText,
  ExternalLink,
  Eye,
  Trash2,
  AlertCircle,
  Code2,
  Globe2,
  Menu,
  X,
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";
import axios from "axios";
import type { Context, Status, ContextResponse } from "@/type";

type FilterStatus = "all" | Status;

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: {
    label: "En attente",
    className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  },
  approved: {
    label: "Publié",
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },
  revision: {
    label: "À corriger",
    className: "border-orange-400/20 bg-orange-400/10 text-orange-300",
  },
  rejected: {
    label: "Rejeté",
    className: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  },
};

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date inconnue";
  }

  return parsedDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminPage() {
  const [contexts, setContexts] = useState<Context[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [loadupdatingStatus, setloadUpdatingStatus] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  // Récupération des contributions depuis le backend
  useEffect(() => {
    async function fetchContexts() {
      try {
        setLoading(true);
        setFetchError("");

        const response = await axios.get<ContextResponse>("/API/recupContext");

        if (response.data.message === "ok") {
          setContexts(response.data.contexts);
        } else {
          setFetchError("Impossible de récupérer les contributions.");
        }
      } catch (error) {
        console.error("Erreur de récupération des contextes :", error);

        setFetchError(
          axios.isAxiosError(error)
            ? (error.response?.data?.message ??
                "Impossible de contacter le serveur.")
            : "Une erreur inattendue est survenue.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchContexts();
  }, []);

  // Recherche et filtrage des contributions
  const filteredContexts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contexts.filter((context) => {
      const matchesFilter = filter === "all" || context.status === filter;

      const searchableValues = [
        context.title,
        context.service,
        context.type,
        context.version_api,
        context.description,
        context.content_payload,
        context.author_id?.nom ?? "",
        context.author_id?.email ?? "",
        ...(context.pays ?? []),
      ];

      const matchesSearch = searchableValues.some((value) =>
        value.toLowerCase().includes(query),
      );

      return matchesFilter && matchesSearch;
    });
  }, [contexts, filter, search]);

  // Contribution sélectionnée
  const currentContext =
    contexts.find((context) => context._id === selected) ?? null;

  // Statistiques
  const counts = {
    pending: contexts.filter((item) => item.status === "pending").length,
    approved: contexts.filter((item) => item.status === "approved").length,
    revision: contexts.filter((item) => item.status === "revision").length,
    rejected: contexts.filter((item) => item.status === "rejected").length,
  };

  // Modification locale du statut
  async function updateStatus(id: string, status: Status) {
    setloadUpdatingStatus(true);

    try {
      const req = await axios.put("/API/modifierContext", {
        id,
        status,
      });

      if (req.data?.message === "ok") {
        setContexts((items) =>
          items.map((item) => (item._id === id ? { ...item, status } : item)),
        );

        setNotice(
          req.data.detail || "Statut de la contribution modifié avec succès.",
        );
      } else {
        setNotice(
          req.data?.detail ||
            req.data?.message ||
            "La modification n'a pas pu être effectuée.",
        );
      }
    } catch (error) {
      console.error("Erreur pendant la modification du statut :", error);

      if (axios.isAxiosError(error)) {
        setNotice(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            "Impossible de modifier le statut de la contribution.",
        );
      } else {
        setNotice("Une erreur inattendue est survenue.");
      }
    } finally {
      setloadUpdatingStatus(false);
    }
  }

  // Suppression locale uniquement
  async function deleteContext(id: string) {
    setloadUpdatingStatus(true);

    try {
      const req = await axios.delete("/API/suppContext", {
        data: { id },
      });

      if (req.data?.message === "ok") {
        setContexts((items) => items.filter((item) => item._id !== id));
        setSelected(null);
        setNotice(req.data.detail || "Contribution supprimée avec succès.");
        setShowDeletePopup(false);
      }
    } catch (error) {
      console.error("Erreur de suppression :", error);

      if (axios.isAxiosError(error)) {
        setNotice(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            "Impossible de supprimer la contribution.",
        );
      } else {
        setNotice("Une erreur inattendue est survenue.");
      }
    } finally {
      setloadUpdatingStatus(false);
    }
  }

  const stats = [
    {
      label: "En attente",
      count: counts.pending,
      detail: "Nécessitent une vérification",
      icon: Clock3,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      status: "pending" as Status,
    },
    {
      label: "Contextes publiés",
      count: counts.approved,
      detail: "Disponibles sur la plateforme",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      status: "approved" as Status,
    },
    {
      label: "À corriger",
      count: counts.revision,
      detail: "Demandent des précisions",
      icon: AlertCircle,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      status: "revision" as Status,
    },
    {
      label: "Rejetés",
      count: counts.rejected,
      detail: "Non retenus",
      icon: XCircle,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
      status: "rejected" as Status,
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d18] text-white">
      <div className="flex min-h-screen">
        {/**message toas d'erreur  */}
        {notice && (
          <div className="fixed right-5 top-5 z-[100] max-w-sm rounded-xl border border-rose-500/50 bg-rose-950 px-4 py-3 shadow-2xl shadow-rose-950/40">
            <p className="text-sm font-semibold text-rose-200">⚠️ {notice}</p>

            <button
              onClick={() => setNotice("")}
              className="mt-2 text-xs font-semibold text-rose-400 transition hover:text-rose-200"
            >
              Fermer
            </button>
          </div>
        )}
        {/**popup pour supprimer context */}
        {showDeletePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1220] p-6 shadow-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-400/10 text-rose-400">
                <Trash2 size={24} />
              </div>

              <h2 className="text-lg font-semibold text-white">
                Supprimer cette contribution ?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Cette action supprimera la contribution de la démonstration.
                Veux-tu vraiment continuer ?
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Annuler
                </button>

                <button
                  onClick={() => {
                    deleteContext(currentContext!._id);
                    setShowDeletePopup(false);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
                >
                  <Trash2 size={17} />
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Fond du menu mobile */}
        {sidebarOpen && (
          <button
            aria-label="Fermer le menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        )}

        {/* Barre latérale */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0d1220] transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
              <ShieldCheck size={23} />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight">AfriContext</p>
              <p className="text-xs text-slate-400">Administration</p>
            </div>

            <button
              aria-label="Fermer le menu"
              onClick={() => setSidebarOpen(false)}
              className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-4 pt-4">
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 px-3 py-3 text-sm font-medium text-slate-400 transition hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400"
            >
              <ArrowLeft size={18} />
              {" Retour à l'accueil"}
            </button>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Espace admin
            </p>

            <button
              onClick={() => {
                setFilter("all");
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                filter === "all"
                  ? "bg-orange-500/10 text-orange-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard size={19} />
              {" Vue d'ensemble"}
            </button>

            <button
              onClick={() => {
                setFilter("pending");
                setSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <ClipboardCheck size={19} />
              <span className="flex-1">Contributions</span>
              <span className="rounded-md bg-white/5 px-2 py-1 text-xs">
                {counts.pending}
              </span>
            </button>

            <button
              onClick={() => {
                setFilter("approved");
                setSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <CheckCircle2 size={19} />
              Contextes publiés
            </button>

            <button
              onClick={() => {
                setFilter("revision");
                setSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <AlertCircle size={19} />À corriger
            </button>
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/15 font-bold text-orange-400">
                A
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Administrateur</p>
                <p className="text-xs text-slate-500">
                  Modération des contenus
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#090d18]/90 px-4 backdrop-blur-xl sm:px-8">
            <div className="flex items-center gap-3">
              <button
                aria-label="Ouvrir le menu"
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-sm text-slate-400">
                  Administration / Modération
                </p>
                <h1 className="text-lg font-bold sm:text-xl">
                  {"Vue d'ensemble"}
                </h1>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                Données API
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#111827]">
                <ShieldCheck size={18} className="text-orange-400" />
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-8">
            {/* Notifications */}
            {notice && (
              <div
                role="status"
                className="flex items-center justify-between gap-3 rounded-xl border border-orange-400/20 bg-orange-400/10 px-4 py-3 text-sm text-orange-200"
              >
                <span>{notice}</span>
                <button
                  onClick={() => setNotice("")}
                  aria-label="Fermer le message"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            {fetchError && (
              <div
                role="alert"
                className="flex items-center justify-between gap-3 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300"
              >
                <span>{fetchError}</span>
                <button
                  onClick={() => window.location.reload()}
                  className="shrink-0 underline"
                >
                  Réessayer
                </button>
              </div>
            )}

            {/* Introduction */}
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-sm font-medium text-orange-400">
                  CENTRE DE MODÉRATION
                </p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Bonjour, administrateur
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Vérifiez les sources, contrôlez les informations techniques et
                  {
                    "                  décidez quels contextes méritent d'être publiés."
                  }
                </p>
              </div>

              <button
                onClick={() => {
                  setFilter("pending");
                  setSearch("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
              >
                <ClipboardCheck size={18} />
                Examiner les demandes
              </button>
            </section>

            {/* Statistiques */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <button
                    key={stat.label}
                    onClick={() => setFilter(stat.status)}
                    className="rounded-2xl border border-white/10 bg-[#111827] p-5 text-left transition hover:border-orange-500/40 hover:bg-[#141c2d]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        {stat.label}
                      </span>
                      <span
                        className={`rounded-xl p-2.5 ${stat.bg} ${stat.color}`}
                      >
                        <Icon size={20} />
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-bold">{stat.count}</p>
                    <p className="mt-2 text-xs text-slate-500">{stat.detail}</p>
                  </button>
                );
              })}
            </section>

            {/* Liste et détails */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1220]">
              <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-bold">Contributions</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Examinez chaque proposition avant publication.
                    </p>
                  </div>
                  <span className="text-sm text-slate-500">
                    {filteredContexts.length} résultat(s)
                  </span>
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Rechercher un service, un pays..."
                      className="w-full rounded-xl border border-white/10 bg-[#090d18] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-orange-500/60"
                    />
                  </div>

                  <select
                    value={filter}
                    onChange={(event) =>
                      setFilter(event.target.value as FilterStatus)
                    }
                    className="rounded-xl border border-white/10 bg-[#090d18] px-4 py-3 text-sm text-slate-300 outline-none focus:border-orange-500/60"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Publiés</option>
                    <option value="revision">À corriger</option>
                    <option value="rejected">Rejetés</option>
                  </select>
                </div>
              </div>

              <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.85fr)]">
                {/* Liste des contributions */}
                <div className="divide-y divide-white/[0.06]">
                  {loading ? (
                    <div className="p-10 text-center text-sm text-slate-400">
                      Chargement des contributions...
                    </div>
                  ) : filteredContexts.length === 0 ? (
                    <div className="p-10 text-center">
                      <FileText size={30} className="mx-auto text-slate-600" />
                      <p className="mt-3 font-medium">
                        Aucune contribution trouvée
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Essayez un autre filtre ou une autre recherche.
                      </p>
                    </div>
                  ) : (
                    filteredContexts.map((context) => (
                      <button
                        key={context._id}
                        onClick={() => setSelected(context._id)}
                        className={`block w-full border-l-2 p-5 text-left transition hover:bg-white/[0.03] ${
                          selected === context._id
                            ? "border-orange-500 bg-orange-500/[0.05]"
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#111827]">
                              <Code2 size={20} className="text-orange-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold">{context.title}</p>
                              <p className="mt-1 text-sm text-slate-400">
                                {context.service} · {context.version_api}
                              </p>
                            </div>
                          </div>
                          <ChevronRight
                            size={18}
                            className="mt-1 shrink-0 text-slate-500"
                          />
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                            <Globe2 size={13} />
                            {context.pays.join(", ") || "Pays non précisé"}
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs ${statusConfig[context.status].className}`}
                          >
                            {statusConfig[context.status].label}
                          </span>
                        </div>

                        <p className="mt-3 text-xs text-slate-500">
                          Proposé par {context.author_id?.nom ?? "Inconnu"} ·{" "}
                          {formatDate(context.created_at)}
                        </p>
                      </button>
                    ))
                  )}
                </div>

                {/* Panneau de détails */}
                <div className="border-t border-white/10 bg-[#090d18]/50 p-5 sm:p-6 lg:border-l lg:border-t-0">
                  {currentContext ? (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Détails de la contribution
                        </span>
                        <Eye size={18} className="text-orange-400" />
                      </div>

                      <div>
                        <h4 className="text-xl font-bold">
                          {currentContext.title}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {currentContext.description ||
                            "Aucune description fournie."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-white/10 bg-[#111827] p-3">
                          <p className="text-xs text-slate-500">Service</p>
                          <p className="mt-1 text-sm font-medium">
                            {currentContext.service}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-[#111827] p-3">
                          <p className="text-xs text-slate-500">Pays</p>
                          <p className="mt-1 text-sm font-medium">
                            {currentContext.pays.join(", ") || "Non précisé"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-[#111827] p-3">
                          <p className="text-xs text-slate-500">Version API</p>
                          <p className="mt-1 text-sm font-medium">
                            {currentContext.version_api || "Non précisée"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-[#111827] p-3">
                          <p className="text-xs text-slate-500">Type</p>
                          <p className="mt-1 text-sm font-medium">
                            {currentContext.type || "Non précisé"}
                          </p>
                        </div>

                        <div className="col-span-2 rounded-xl border border-white/10 bg-[#111827] p-3">
                          <p className="text-xs text-slate-500">Contributeur</p>
                          <p className="mt-1 text-sm font-medium">
                            {currentContext.author_id?.nom ?? "Inconnu"}
                          </p>
                          <p className="mt-1 break-all text-xs text-slate-400">
                            {currentContext.author_id?.email ?? ""}
                          </p>
                        </div>
                      </div>

                      {/* Contenu soumis */}
                      <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <FileText size={16} className="text-orange-400" />
                          Contenu soumis
                        </div>
                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">
                          {currentContext.content_payload ||
                            "Aucun contenu fourni."}
                        </p>
                      </div>

                      {/* Source officielle */}
                      <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <ExternalLink size={16} className="text-orange-400" />
                          Source déclarée
                        </div>

                        {currentContext.source_url ? (
                          <a
                            href={currentContext.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 block break-all text-sm text-orange-400 underline decoration-orange-400/30 underline-offset-4 hover:text-orange-300"
                          >
                            {currentContext.source_url}
                          </a>
                        ) : (
                          <p className="mt-2 text-sm text-slate-500">
                            Aucune source fournie.
                          </p>
                        )}

                        <p className="mt-3 text-xs leading-5 text-slate-500">
                          Vérifiez la documentation officielle avant toute
                          publication.
                        </p>
                      </div>

                      {/* Tests déclarés */}
                      <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
                        <p className="text-sm font-semibold">
                          Environnements testés
                        </p>
                        {currentContext.tested_with.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {currentContext.tested_with.map((item, index) => (
                              <span
                                key={`${item}-${index}`}
                                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-2 text-sm text-slate-500">
                            Aucun test déclaré.
                          </p>
                        )}
                      </div>

                      {/* Modération Boutton */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Décision de modération
                        </p>
                        <button
                          disabled={loadupdatingStatus}
                          onClick={() =>
                            updateStatus(currentContext._id, "approved")
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {loadupdatingStatus ? (
                            <>
                              <LoaderCircle
                                size={18}
                                className="animate-spin"
                              />
                              Modification en cours...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={18} />
                              Approuver et publier
                            </>
                          )}
                        </button>

                        {/**<button
                          onClick={() =>
                            updateStatus(currentContext._id, "revision")
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-400/20 bg-orange-400/10 px-4 py-3 text-sm font-semibold text-orange-300 transition hover:bg-orange-400/15"
                        >
                          <AlertCircle size={18} />
                          Demander une correction
                        </button> */}

                        <button
                          disabled={loadupdatingStatus}
                          onClick={() =>
                            updateStatus(currentContext._id, "rejected")
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {loadupdatingStatus ? (
                            <>
                              <LoaderCircle
                                size={18}
                                className="animate-spin"
                              />
                              Modification en cours...
                            </>
                          ) : (
                            <>
                              <XCircle size={18} />
                              Rejeter la contribution
                            </>
                          )}
                        </button>
                        {/**boutton de suppression */}
                        <button
                          disabled={loadupdatingStatus}
                          onClick={() => {
                            setShowDeletePopup(true);
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-400 transition hover:border-rose-400/30 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {loadupdatingStatus ? (
                            <>
                              <LoaderCircle
                                size={17}
                                className="animate-spin"
                              />
                              Chargement...
                            </>
                          ) : (
                            <>
                              <Trash2 size={17} />
                              Supprimer
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-80 flex-col items-center justify-center text-center">
                      <FileText size={36} className="text-slate-600" />
                      <p className="mt-4 font-semibold">
                        Aucune contribution sélectionnée
                      </p>
                      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                        Choisissez une contribution dans la liste pour consulter
                        ses détails.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <p className="text-center text-xs text-slate-600">
              AfriContext · Les modifications de statut et suppressions sont
              locales et ne sont pas encore enregistrées en base.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
