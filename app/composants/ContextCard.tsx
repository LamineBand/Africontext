import { ShieldCheck, Terminal, Zap } from "lucide-react";
import React from "react";

function ContextCard() {
  const contexts = [
    {
      title: "Wave Payments",
      description:
        "Intégrer les paiements Wave avec les bonnes pratiques et les erreurs à éviter.",
      service: "Paiement",
      country: "Sénégal",
      language: "TypeScript",
      icon: Zap,
    },
    {
      title: "Orange Money",
      description:
        "Comprendre les étapes d'intégration et la gestion des transactions.",
      service: "Paiement",
      country: "Côte d'Ivoire",
      language: "TypeScript",
      icon: ShieldCheck,
    },
    {
      title: "SMS Africa",
      description:
        "Préparer une intégration SMS avec une gestion claire des erreurs.",
      service: "Communication",
      country: "Afrique",
      language: "JavaScript",
      icon: Terminal,
    },
  ];

  return <div></div>;
}

export default ContextCard;
