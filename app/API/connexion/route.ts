import { ConnexionDB } from "@/lib/mongoConnecte";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Usermodel } from "@/models";

export async function POST(req: Request) {
  try {
    const { email: rawEmail, password: rawPassword } = await req.json();

    // 1. Nettoyage des espaces
    const email =
      typeof rawEmail === "string"
        ? rawEmail.replace(/\s+/g, "").trim().toLowerCase()
        : "";
    const password = typeof rawPassword === "string" ? rawPassword.trim() : "";

    // 2. Connexion à la base de données
    await ConnexionDB();

    // 3. Validation des champs requis
    if (!email || !password) {
      return NextResponse.json(
        { message: "Veuillez remplir tous les champs." },
        { status: 400 },
      );
    }

    // 4. Vérifier si l'utilisateur existe
    const utilisateur = await Usermodel.findOne({ email });
    if (!utilisateur) {
      return NextResponse.json(
        { message: "Identifiants incorrects." },
        { status: 401 },
      );
    }

    // 5. Vérifier si le mot de passe correspond
    const passwordMatch = await bcrypt.compare(password, utilisateur.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Identifiants incorrects." },
        { status: 401 },
      );
    }

    // 6. Succès
    return NextResponse.json(
      {
        message: "ok",
        user: {
          id: utilisateur._id,
          nom: utilisateur.nom,
          email: utilisateur.email,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Erreur de connexion au back :", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la connexion." },
      { status: 500 },
    );
  }
}
