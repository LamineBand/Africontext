import { model, models, Schema } from "mongoose";

// --- 1. Schéma et Modèle Utilisateur ---
const UserSchema = new Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
    },
  },
  {
    timestamps: true,
  },
);

export const Usermodel = models.User || model("User", UserSchema);

// --- 2. Schéma et Modèle Context ---
const ContextSchema = new Schema(
  {
    slug: {
      type: String,
      required: [true, "Le slug est obligatoire"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Le type est obligatoire"],
      trim: true,
    },
    content_payload: {
      type: String,
      required: [true, "Le contenu est obligatoire"],
    },
    service: {
      type: String,
      required: [true, "Le service est obligatoire"],
      trim: true,
    },
    pays: {
      type: [String],
      required: true,
    },
    version_api: {
      type: String,
      trim: true,
    },
    source_url: {
      type: String,
      trim: true,
    },
    source_hash: {
      type: String,
      trim: true,
    },
    tested_with: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "to_recheck"],
      default: "pending",
    },
    last_verified_at: {
      type: Date,
      default: Date.now,
    },
    author_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  },
);

export const ContextModel = models.Context || model("Context", ContextSchema);
