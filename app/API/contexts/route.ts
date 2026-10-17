import { ConnexionDB } from "@/lib/mongoConnecte";
import { ContextModel, Usermodel } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      slug: rawSlug,
      title: rawTitle,
      description: rawDescription,
      type: rawType,
      service: rawService,
      pays,
      version_api: rawVersionApi,
      source_url: rawSourceUrl,
      tested_with,
      content_payload: rawContentPayload,
      author_id: rawAuthorId, // Optionnel si envoyé depuis le client
    } = body;

    // 1. Connexion à la base de données
    await ConnexionDB();

    // 2. Nettoyage et validation des champs obligatoires
    const slug =
      typeof rawSlug === "string" ? rawSlug.trim().toLowerCase() : "";
    const title = typeof rawTitle === "string" ? rawTitle.trim() : "";
    const type = typeof rawType === "string" ? rawType.trim() : "";
    const service = typeof rawService === "string" ? rawService.trim() : "";
    const content_payload =
      typeof rawContentPayload === "string" ? rawContentPayload.trim() : "";

    if (
      !slug ||
      !title ||
      !type ||
      !service ||
      !content_payload ||
      !pays ||
      pays.length === 0
    ) {
      return NextResponse.json(
        { message: "Veuillez remplir tous les champs obligatoires (*)." },
        { status: 400 },
      );
    }

    // 3. Vérifier si un contexte avec ce slug existe déjà
    const existingContext = await ContextModel.findOne({ slug });
    if (existingContext) {
      return NextResponse.json(
        { message: "Une fiche avec ce slug (URL unique) existe déjà." },
        { status: 409 },
      );
    }

    // 4. Gestion de l'auteur (author_id)
    let authorId = rawAuthorId;
    if (!authorId) {
      // Pour les tests ou si l'utilisateur n'est pas explicitement lié, on récupère le premier utilisateur par défaut de la base
      const defaultUser = await Usermodel.findOne();
      if (!defaultUser) {
        return NextResponse.json(
          {
            message:
              "Aucun utilisateur trouvé. Veuillez vous connecter ou créer un compte.",
          },
          { status: 401 },
        );
      }
      authorId = defaultUser._id;
    }

    // 5. Création et enregistrement du nouveau contexte
    const newContext = await ContextModel.create({
      slug,
      title,
      description:
        typeof rawDescription === "string" ? rawDescription.trim() : "",
      type,
      service,
      pays,
      version_api:
        typeof rawVersionApi === "string" ? rawVersionApi.trim() : "",
      source_url: typeof rawSourceUrl === "string" ? rawSourceUrl.trim() : "",
      tested_with: Array.isArray(tested_with) ? tested_with : [],
      content_payload,
      status: "pending", // En attente de validation par défaut
      author_id: authorId,
    });

    return NextResponse.json(
      {
        message: "Fiche contexte enregistrée avec succès !",
        context: newContext,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Erreur lors de l'enregistrement du contexte :", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de l'enregistrement du contexte." },
      { status: 500 },
    );
  }
}
