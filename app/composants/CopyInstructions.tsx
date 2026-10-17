"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type CopyInstructionsProps = {
  instructions: string[];
};

export default function CopyInstructions({
  instructions,
}: CopyInstructionsProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      const text = instructions
        .map((instruction, index) => `${index + 1}. ${instruction}`)
        .join("\n");

      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la copie :", error);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400"
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}

      {copied ? "Copié !" : "Copier les instructions"}
    </button>
  );
}
