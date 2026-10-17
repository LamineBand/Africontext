import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ConnexionDB } from "@/lib/mongoConnecte";
import { ContextModel } from "@/models";

const validStatuses = ["pending", "approved", "revision", "rejected"] as const;

type ContextStatus = (typeof validStatuses)[number];

export async function PUT(req: Request) {
  try {
    // 1. Lire les données envoyées par le frontend
    const body = await req.json();
    const { id, status } = body;

    // 2. Vérifier l'identifiant
    if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Identifiant de contribution invalide." },
        { status: 400 },
      );
    }

    // 3. Vérifier le statut demandé
    if (
      typeof status !== "string" ||
      !validStatuses.includes(status as ContextStatus)
    ) {
      return NextResponse.json(
        { message: "Le statut fourni est invalide." },
        { status: 400 },
      );
    }

    // 4. Se connecter à MongoDB
    await ConnexionDB();

    // 5. Modifier le statut de la contribution
    const updatedContext = await ContextModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      {
        new: true,
        runValidators: true,
      },
    );

    // 6. Vérifier que la contribution existe
    if (!updatedContext) {
      return NextResponse.json(
        { message: "Contribution introuvable." },
        { status: 404 },
      );
    }

    // 7. Retourner le résultat
    return NextResponse.json(
      {
        message: "ok",
        context: updatedContext,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur pendant la modification du contexte :", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Le corps de la requête est invalide." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Erreur serveur pendant la modification." },
      { status: 500 },
    );
  }
}
