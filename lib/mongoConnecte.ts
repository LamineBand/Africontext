import mongoose from "mongoose";

export async function ConnexionDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "Africontext",
    });
    return "connexion reussie";
  } catch (error) {
    console.log(error);

    return "connexion echouée";
  }
}
