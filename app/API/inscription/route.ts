import { ConnexionDB } from "@/lib/mongoConnecte";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // npm install bcryptjs && npm install -D @types/bcryptjs
import { Usermodel } from "@/models";

export async function POST(req: Request) {
  try {
    const {
      nom: rawNom,
      email: rawEmail,
      password: rawPassword,
    } = await req.json();

    // Nettoyage des espaces :
    // - replace(/\s+/g, " ") remplace les espaces multiples au milieu par un seul espace
    // - .trim() supprime les espaces au début et à la fin
    const nom =
      typeof rawNom === "string" ? rawNom.replace(/\s+/g, " ").trim() : "";
    const email =
      typeof rawEmail === "string"
        ? rawEmail.replace(/\s+/g, "").trim().toLowerCase()
        : "";
    const password = typeof rawPassword === "string" ? rawPassword.trim() : "";

    // 1. Connexion à la base de données
    await ConnexionDB();

    // 2. Validation des champs requis après nettoyage
    if (!nom || !email || !password) {
      return NextResponse.json(
        { message: "Aucun champ ne doit être vide." },
        { status: 400 },
      );
    }

    // 3. Vérifier si l'utilisateur existe déjà
    const userExiste = await Usermodel.findOne({ email });
    if (userExiste) {
      return NextResponse.json(
        { message: "Un utilisateur avec cet email existe déjà." },
        { status: 409 },
      );
    }

    // 4. Hacher le mot de passe avant enregistrement
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Enregistrer le nouvel utilisateur dans MongoDB
    const nouvelUtilisateur = await Usermodel.create({
      nom,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "ok",
        user: {
          id: nouvelUtilisateur._id,
          nom: nouvelUtilisateur.nom,
          email: nouvelUtilisateur.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur d'ajout au back :", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de l'inscription." },
      { status: 500 },
    );
  }
}
