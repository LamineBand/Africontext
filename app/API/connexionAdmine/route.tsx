import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Récupérer les identifiants envoyés par le formulaire
    const body = await req.json();
    const { login, mdp } = body;

    // 2. Vérifier que les champs sont renseignés
    if (
      typeof login !== "string" ||
      typeof mdp !== "string" ||
      !login.trim() ||
      !mdp
    ) {
      return NextResponse.json(
        { message: "Le login et le mot de passe sont obligatoires." },
        { status: 400 },
      );
    }

    // 3. Récupérer les identifiants depuis les variables d'environnement
    const adminLogin = process.env.login;
    const adminPassword = process.env.mdp;

    // 4. Vérifier la configuration du serveur
    if (!adminLogin || !adminPassword) {
      console.error("Les identifiants admin ne sont pas configurés.");

      return NextResponse.json(
        { message: "Le service est temporairement indisponible." },
        { status: 500 },
      );
    }

    // 5. Vérifier les identifiants
    if (login.trim() !== adminLogin || mdp !== adminPassword) {
      return NextResponse.json(
        { message: "Login ou mot de passe incorrect." },
        { status: 401 },
      );
    }

    // 6. Identifiants corrects
    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Erreur de connexion admin :", error);

    return NextResponse.json(
      { message: "Une erreur est survenue sur le serveur." },
      { status: 500 },
    );
  }
}
