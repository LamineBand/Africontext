import axios from "axios";
import { Dispatch, SetStateAction } from "react";

export async function Inscription(
  nom: string,
  email: string,
  password: string,
  setError: Dispatch<SetStateAction<string>>,
  setloader: Dispatch<SetStateAction<boolean>>,
  setEmail: Dispatch<SetStateAction<string>>,
  setPassword: Dispatch<SetStateAction<string>>,
  setNom: Dispatch<SetStateAction<string>>,
) {
  try {
    setloader(true);
    setError("");
    console.log("reçu au controller : ");
    console.log({
      nom,
      email,
      password,
    });
    if (!nom || !email || !password) {
      setError("Veuillez remplir tout les champs");
      return;
    }
    const req = await axios.post("/API/inscription", {
      nom,
      email,
      password,
    });
    if (req.data && req.data.message === "ok") {
      console.log("insciption ok");
      setEmail("");
      setError("");
      setNom("");
      setPassword("");
    }
  } catch (error: unknown) {
    console.error("Erreur à l'inscription :", error);

    // Vérification propre avec Axios pour extraire le message du serveur
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      setError(error.response.data.message as string);
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Une erreur est survenue lors de l'inscription.");
    }
  } finally {
    setloader(false);
  }
}
