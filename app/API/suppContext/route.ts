import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ConnexionDB } from "@/lib/mongoConnecte";
import { ContextModel } from "@/models";

export async function DELETE(req: Request) {
  try {
    // 1. Récupérer l'identifiant envoyé par le frontend
    const { id } = await req.json();

    // 2. Vérifier que l'identifiant est fourni
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          message: "Identifiant de contribution manquant ou invalide.",
        },
        { status: 400 },
      );
    }

    // 3. Vérifier le format de l'identifiant MongoDB
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          message: "L'identifiant de la contribution est invalide.",
        },
        { status: 400 },
      );
    }

    // 4. Se connecter à MongoDB
    await ConnexionDB();

    // 5. Supprimer la contribution
    const deletedContext = await ContextModel.findByIdAndDelete(id);

    // 6. Vérifier si la contribution existe
    if (!deletedContext) {
      return NextResponse.json(
        {
          message: "Contribution introuvable ou déjà supprimée.",
        },
        { status: 404 },
      );
    }

    // 7. Confirmer la suppression au frontend
    return NextResponse.json(
      {
        message: "ok",
        detail: "Contribution supprimée avec succès.",
        id: deletedContext._id.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur de suppression au serveur :", error);

    // Corps JSON invalide
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          message: "Le corps de la requête est invalide.",
        },
        { status: 400 },
      );
    }

    // Erreur serveur
    return NextResponse.json(
      {
        message: "Une erreur serveur est survenue pendant la suppression.",
      },
      { status: 500 },
    );
  }
}
