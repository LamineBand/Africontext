import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";

export async function Connexion(
  email: string,
  password: string,
  setEmail: Dispatch<SetStateAction<string>>,
  setPassword: Dispatch<SetStateAction<string>>,
  setError: Dispatch<SetStateAction<string>>,
  setloader: Dispatch<SetStateAction<boolean>>,
  route: AppRouterInstance,
) {
  try {
    setloader(true);
    if (!email || !password) {
      setError("Aucun champs ne peut être vide");
      return;
    }
    const req = await axios.post("/API/connexion", { email, password });
    if (req.data && req.data.message === "ok") {
      console.log("connexion ok");
      setEmail("");
      setPassword("");
      route.push("/pages/ajoutContexte");
    }
  } catch (error: unknown) {
    console.error("Erreur à l'inscription :", error);

    // Vérification propre avec Axios pour extraire le message du serveur
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      setError(error.response.data.message as string);
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Une erreur est survenue lors de la connexion.");
    }
  } finally {
    setloader(false);
  }
}
