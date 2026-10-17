import { ConnexionDB } from "@/lib/mongoConnecte";
import { ContextModel } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Connexion à la base de données
    await ConnexionDB();

    // 2. Récupérer tous les contextes et inclure les informations de l'auteur (nom, email)
    const contexts = await ContextModel.find({})
      .populate("author_id", "nom email")
      .sort({ created_at: -1 }); // Du plus récent au plus ancien

    // 3. Retourner la liste
    return NextResponse.json(
      {
        message: "ok",
        contexts,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Erreur de récupération :", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la récupération des contextes." },
      { status: 500 },
    );
  }
}
