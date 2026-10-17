/**
 * docs/fedapay-checkout.ts
 *
 * Fiche technique FedaPay API v1 pour AfriContext.
 * Objectif : aider un développeur à intégrer FedaPay dans une application
 * Next.js en suivant les informations documentées officiellement.
 *
 * Documentation :
 * - https://docs-v1.fedapay.com/paiements/transactions
 * - https://docs-v1.fedapay.com/developpement/webhooks
 * - https://docs-v1.fedapay.com/paiements/methodes-de-paiement
 * - https://docs-v1.fedapay.com/paiements/devises
 *
 * Dernière vérification documentaire : 2026-10-14
 *
 * Important :
 * - Cette fiche n'effectue aucun appel API.
 * - Aucune clé secrète réelle ne doit être stockée ici.
 * - Les exemples doivent être testés avec un compte sandbox.
 */

export const fedaPayKnowledge = {
  provider: "FedaPay",
  product: "Transactions API & Checkout",
  version: "v1",

  metadata: {
    description:
      "API de paiement permettant de créer des transactions, de générer un lien de paiement hébergé et de vérifier leur statut.",
    documentationUrl: "https://docs-v1.fedapay.com/",
    currentPortalUrl: "https://docs.fedapay.com/",
    lastReviewed: "2026-10-14",
    integrationLanguage: "TypeScript",
    recommendedArchitecture: "Next.js App Router",
  },

  baseUrls: {
    sandbox: "https://sandbox-api.fedapay.com/v1",
    production: "https://api.fedapay.com/v1",
  },

  environmentNotes: [
    "Utiliser la clé de test avec l'API sandbox.",
    "Utiliser la clé live avec l'API de production.",
    "Les objets créés en mode test ne doivent pas être considérés comme des transactions de production.",
    "Ne jamais mélanger les clés, les transactions ou les environnements.",
  ],

  countriesAndCurrencies: {
    countryOfInterest: "Côte d'Ivoire",
    countryCode: "CI",
    currency: {
      iso: "XOF",
      name: "Franc CFA BCEAO",
      decimals: 0,
      amountRule:
        "Transmettre le montant directement en francs CFA, sans conversion en centimes.",
      examples: [
        {
          description: "Mille francs CFA",
          amount: 1000,
        },
        {
          description: "Cinq mille francs CFA",
          amount: 5000,
        },
      ],
    },

    documentedPaymentMethodsInIvoryCoast: [
      {
        name: "MTN Mobile Money",
        code: "mtn_ci",
        notes:
          "Le code mtn_ci est documenté pour certains paiements sans redirection. Vérifier les conditions applicables au compte.",
      },
      {
        name: "Moov Money",
        code: "moov_ci",
        notes:
          "Le moyen de paiement est répertorié pour la Côte d'Ivoire. Vérifier sa disponibilité effective sur le compte.",
      },
      {
        name: "Orange Money",
        code: "orange_ci",
        notes:
          "Le moyen de paiement est répertorié pour la Côte d'Ivoire. Vérifier sa disponibilité effective sur le compte.",
      },
      {
        name: "Wave",
        code: "wave_ci",
        notes:
          "Le moyen de paiement est répertorié pour la Côte d'Ivoire. Vérifier sa disponibilité effective sur le compte.",
      },
    ],

    availabilityWarning:
      "Les moyens de paiement accessibles dépendent du compte, de son activation et du parcours d'intégration. Ne pas supposer qu'un moyen est activé uniquement parce qu'il figure dans la documentation.",
  },

  authentication: {
    type: "Bearer API key",
    header: "Authorization",
    format: "Bearer <FEDA_SECRET_KEY>",

    keys: {
      secretKey: {
        usage: "Appels API serveur",
        mustRemainServerSide: true,
        environmentVariable: "FEDAPAY_SECRET_KEY",
      },

      publicKey: {
        usage:
          "Fonctionnalités frontend qui exigent explicitement une clé publique, notamment certaines intégrations Checkout.js.",
        environmentVariable: "NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY",
        warning:
          "Ne pas utiliser la clé publique à la place de la clé secrète pour appeler les endpoints serveur.",
      },

      webhookSecret: {
        usage: "Vérification de la signature des webhooks",
        environmentVariable: "FEDAPAY_WEBHOOK_SECRET",
        warning:
          "La clé secrète du webhook est distincte de la clé API. Récupérer celle qui correspond à l'endpoint configuré dans le tableau de bord.",
      },
    },

    officialGuidance:
      "Les clés API de test et de production sont distinctes. Les clés secrètes doivent rester confidentielles et être stockées côté serveur.",
  },

  endpoints: {
    createTransaction: {
      method: "POST",
      path: "/transactions",
      fullSandboxUrl: "https://sandbox-api.fedapay.com/v1/transactions",
      fullProductionUrl: "https://api.fedapay.com/v1/transactions",

      purpose: "Créer une transaction avant de générer son lien de paiement.",

      requiredFields: ["description", "amount", "currency"],

      optionalFields: ["callback_url", "customer"],

      fieldNotes: {
        description:
          "Description de la transaction, par exemple Paiement commande #1234.",

        amount:
          "Montant numérique entier pour le XOF. Ne pas transmettre une chaîne contenant un montant formaté.",

        currency:
          "Objet contenant la devise, par exemple { iso: 'XOF' }. La documentation v1 accepte également le code ISO ou le numéro ISO selon le format documenté.",

        callback_url:
          "URL de retour facultative. Elle permet de rediriger le client après le parcours de paiement, mais ne constitue pas une preuve de paiement.",

        customer:
          "Client existant ou informations permettant d'associer un client à la transaction. Vérifier le format attendu dans la documentation et le SDK utilisés.",
      },

      exampleBody: {
        description: "Paiement commande #1234",
        amount: 5000,
        currency: {
          iso: "XOF",
        },
        callback_url: "https://example.com/paiement/retour",
        customer: {
          firstname: "Koffi",
          lastname: "Konan",
          email: "client@example.com",
          phone_number: {
            number: "+2250700000000",
            country: "ci",
          },
        },
      },

      exampleWarning:
        "Les informations client sont fictives. Adapter le numéro et le format des champs à la documentation et au compte utilisés.",

      returns:
        "Un objet transaction contenant notamment son identifiant et son statut initial.",
    },

    generatePaymentToken: {
      method: "POST",
      path: "/transactions/:id/token",
      fullSandboxUrlTemplate:
        "https://sandbox-api.fedapay.com/v1/transactions/{id}/token",
      fullProductionUrlTemplate:
        "https://api.fedapay.com/v1/transactions/{id}/token",

      purpose:
        "Générer un token de paiement et un lien hébergé à partir d'une transaction créée.",

      authenticationRequired: true,

      expectedResult:
        "Objet contenant notamment un token et une URL de paiement, selon la réponse de l'API.",

      nextAction:
        "Récupérer l'URL renvoyée par FedaPay et rediriger le navigateur du client vers cette URL.",

      warning:
        "Ne pas inventer le nom des propriétés de la réponse : consulter la réponse réelle ou le SDK utilisé.",
    },

    getTransaction: {
      method: "GET",
      path: "/transactions/:id",
      fullSandboxUrlTemplate:
        "https://sandbox-api.fedapay.com/v1/transactions/{id}",
      fullProductionUrlTemplate: "https://api.fedapay.com/v1/transactions/{id}",

      purpose:
        "Récupérer les détails d'une transaction et vérifier son statut actuel.",

      successStatus: "approved",

      rule: "Une commande ne doit être considérée comme payée qu'après vérification fiable du statut approuvé.",

      warning:
        "Le statut transmis par le navigateur ou dans une URL de retour ne suffit pas à confirmer le paiement.",
    },

    listTransactions: {
      method: "GET",
      path: "/transactions",
      purpose:
        "Consulter les transactions du compte selon les paramètres disponibles dans l'API v1.",

      warning:
        "Vérifier les paramètres de pagination et de filtrage dans la documentation avant de les utiliser.",
    },
  },

  transactionStatuses: {
    documentedExamples: [
      {
        status: "pending",
        meaning: "Transaction créée ou en attente de résolution.",
      },
      {
        status: "approved",
        meaning:
          "Transaction approuvée. Vérifier la transaction côté serveur avant de livrer la commande.",
      },
      {
        status: "declined",
        meaning: "Transaction refusée.",
      },
      {
        status: "canceled",
        meaning: "Transaction annulée.",
      },
    ],

    note: "Ne pas supposer que cette liste est exhaustive. Gérer les statuts supplémentaires renvoyés par l'API sans les transformer automatiquement en paiement réussi.",
  },

  checkoutWorkflows: {
    hostedRedirect: [
      "1. Le serveur Next.js crée la transaction.",
      "2. Le serveur demande le token et l'URL de paiement.",
      "3. Le serveur conserve l'identifiant de transaction et l'identifiant de commande interne.",
      "4. Le navigateur du client est redirigé vers l'URL hébergée par FedaPay.",
      "5. FedaPay traite le paiement.",
      "6. Le serveur vérifie le statut de la transaction ou traite un webhook authentifié.",
      "7. La commande est marquée payée uniquement après confirmation fiable.",
    ],

    checkoutJs: {
      description:
        "FedaPay propose également Checkout.js pour certains parcours frontend.",

      rule: "Suivre la documentation officielle de Checkout.js pour les propriétés et événements exacts. Ne pas mélanger le fonctionnement du widget avec celui du parcours API v1 par redirection.",
    },

    directPayment: {
      description:
        "Certains moyens de paiement peuvent être utilisés sans redirection après création de la transaction et obtention du token.",

      documentedExamples: [
        "mtn_open",
        "moov",
        "sbin",
        "mtn_ci",
        "moov_tg",
        "togocel",
        "free_sn",
        "airtel_ne",
        "mtn_open_gn",
      ],

      warning:
        "Les codes disponibles dépendent du pays et du moyen de paiement. Ne pas présenter cette liste comme une liste de méthodes utilisables en Côte d'Ivoire.",
    },
  },

  amounts: {
    currency: "XOF",
    type: "integer",
    examples: {
      valid: [100, 500, 1000, 5000],
      invalid: ["5000.00", "5 000"],
    },

    rules: [
      "Pour le XOF, envoyer le montant directement en francs CFA.",
      "Ne pas multiplier le montant XOF par 100.",
      "Valider le montant côté serveur avant de créer la transaction.",
      "Ne jamais accepter sans vérification un montant envoyé par le navigateur.",
    ],
  },

  webhooks: {
    officialDocumentationUrl:
      "https://docs-v1.fedapay.com/developpement/webhooks",

    method: "POST",

    signatureHeader: "X-FEDAPAY-SIGNATURE",

    signatureVerification: {
      requiredForSecureIntegration: true,

      secretSource:
        "Récupérer la clé secrète propre au webhook dans les paramètres Webhooks du tableau de bord FedaPay.",

      recommendedMethod:
        "Utiliser la méthode officielle de vérification de signature de la bibliothèque FedaPay, ou implémenter la vérification manuelle conformément à la documentation.",

      rawBody:
        "Conserver le corps brut de la requête si la méthode de vérification choisie l'exige. Ne pas supposer que le JSON déjà parsé est interchangeable avec le corps original.",

      rejectInvalidSignature: true,
    },

    documentedEvents: [
      "transaction.created",
      "transaction.approved",
      "transaction.canceled",
      "transaction.declined",
      "transaction.updated",
    ],

    endpointRequirements: [
      "Utiliser une URL HTTPS accessible par FedaPay.",
      "Vérifier la signature avant de traiter l'événement.",
      "Traiter les événements de façon idempotente.",
      "Ne pas considérer la simple réception d'un webhook comme une preuve suffisante sans vérifier sa signature et les données associées.",
      "Répondre avec un code HTTP 2xx après le traitement réussi.",
      "Prévoir une vérification de transaction côté serveur pour les cas où un événement est manquant ou ambigu.",
    ],

    important:
      "Les webhooks peuvent être configurés depuis le tableau de bord. Les secrets de webhook de test et de production peuvent être différents.",

    officialSource: "https://docs-v1.fedapay.com/developpement/webhooks",
  },

  nextJsArchitecture: {
    recommendedRoutes: [
      {
        route: "POST /api/payments/fedapay/create",
        purpose:
          "Valider la commande côté serveur, créer la transaction et générer le lien de paiement.",
      },
      {
        route: "GET /api/payments/fedapay/status",
        purpose:
          "Vérifier le statut d'une transaction côté serveur avant de mettre à jour la commande.",
      },
      {
        route: "POST /api/webhooks/fedapay",
        purpose:
          "Recevoir les événements, vérifier leur signature et mettre à jour la commande de manière idempotente.",
      },
    ],

    databaseRecommendations: [
      "Enregistrer l'identifiant interne de la commande.",
      "Enregistrer l'identifiant de transaction FedaPay.",
      "Enregistrer le montant attendu et la devise.",
      "Conserver le statut de paiement et les dates de mise à jour.",
      "Éviter de stocker les clés API dans les documents de commande.",
    ],

    securityRules: [
      "Ne jamais exposer FEDAPAY_SECRET_KEY au navigateur.",
      "Ne jamais laisser le client définir librement le prix final à payer.",
      "Vérifier le montant, la devise, l'identifiant de commande et le statut avant de confirmer le paiement.",
      "Ne pas livrer un produit ou activer un service uniquement parce que le client revient sur la page de succès.",
      "Ne pas enregistrer deux fois le même paiement lors de la réception répétée d'un événement.",
    ],
  },

  environmentVariables: {
    FEDAPAY_SECRET_KEY: "Clé API secrète utilisée exclusivement côté serveur.",
    NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY:
      "Clé publique uniquement si le mode Checkout.js utilisé la requiert.",
    FEDAPAY_WEBHOOK_SECRET:
      "Secret de vérification du webhook configuré dans le tableau de bord.",
  },

  officialSources: [
    {
      title: "Transactions et création du lien de paiement",
      url: "https://docs-v1.fedapay.com/paiements/transactions",
    },
    {
      title: "Webhooks et vérification de signature",
      url: "https://docs-v1.fedapay.com/developpement/webhooks",
    },
    {
      title: "Moyens de paiement par pays",
      url: "https://docs-v1.fedapay.com/paiements/methodes-de-paiement",
    },
    {
      title: "Devises et règles de montant",
      url: "https://docs-v1.fedapay.com/paiements/devises",
    },
    {
      title: "Clés API et bibliothèques",
      url: "https://docs-v1.fedapay.com/developpement/apikey-librairies",
    },
  ],

  aiIntegrationPolicy: [
    "Utiliser en priorité les endpoints et champs documentés dans les sources officielles.",
    "Ne jamais inventer d'URL, de champ de requête, de statut, de signature ou de format de réponse.",
    "Signaler clairement toute information non confirmée par la documentation.",
    "Ne jamais prétendre qu'une intégration a été testée en production sans preuve.",
    "Proposer une implémentation Next.js étape par étape, avec validation serveur et gestion des erreurs.",
    "Confirmer l'activation du compte, du pays et des moyens de paiement avant de promettre qu'un parcours est disponible.",
  ],
} as const;
