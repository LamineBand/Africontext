import { ShieldCheck, Zap, Terminal } from "lucide-react";

export const contexts = [
  {
    slug: "wave-payments",
    title: "Wave Payments",
    description:
      "Intégrer les paiements Wave avec les bonnes pratiques et les erreurs à éviter.",
    service: "Paiement",
    country: "Sénégal",
    language: "TypeScript",
    icon: Zap,
    overview:
      "Ce contexte aide les développeurs à préparer une intégration de paiement Wave dans une application.",
    instructions: [
      "Consulter la documentation officielle du service avant toute intégration.",
      "Garder les clés secrètes côté serveur.",
      "Vérifier les transactions côté serveur avant de confirmer un paiement.",
      "Prévoir la gestion des erreurs et des interruptions réseau.",
    ],
  },
  {
    slug: "orange-money",
    title: "Orange Money",
    description:
      "Comprendre les étapes d'intégration et la gestion des transactions.",
    service: "Paiement",
    country: "Côte d'Ivoire",
    language: "TypeScript",
    icon: ShieldCheck,
    overview:
      "Ce contexte présente les précautions à prendre pour intégrer un service de paiement Orange Money.",
    instructions: [
      "Consulter la documentation officielle adaptée au pays.",
      "Protéger les identifiants de l'API.",
      "Contrôler le statut des transactions côté serveur.",
      "Prévoir les erreurs, les délais d'attente et les notifications de paiement.",
    ],
  },
  {
    slug: "sms-africa",
    title: "SMS Africa",
    description:
      "Préparer une intégration SMS avec une gestion claire des erreurs.",
    service: "Communication",
    country: "Afrique",
    language: "JavaScript",
    icon: Terminal,
    overview:
      "Ce contexte aide à structurer une intégration d'envoi de SMS dans une application.",
    instructions: [
      "Identifier le fournisseur SMS et consulter sa documentation.",
      "Conserver les identifiants d'accès côté serveur.",
      "Gérer les erreurs et les limites d'envoi.",
      "Enregistrer le statut des messages pour faciliter le suivi.",
    ],
  },
];
