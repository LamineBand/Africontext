export const orangeMoneyWebPayKnowledge = {
  metadata: {
    name: "Orange Money Web Payment",
    slug: "orange-money-webpay",
    provider: "Orange Money",
    category: "Paiement",
    country: "Côte d'Ivoire",
    currency: "XOF",
    language: "TypeScript",
    status: "partially_verified",
    lastUpdated: "2026-10-14",

    description:
      "Base de connaissances destinée à guider les développeurs dans l'intégration d'Orange Money Web Payment, étape par étape.",

    disclaimer:
      "Cette base de connaissances n'est pas une spécification officielle certifiée. " +
      "Les URL, paramètres, réponses et mécanismes qui ne sont pas confirmés par une documentation " +
      "officielle applicable au compte marchand doivent être vérifiés avant toute intégration réelle.",
  },

  sources: {
    officialDocumentation: {
      label: "Documentation Orange Developer",
      url: "https://developer.orange.com/apis/om-webpay",
      status: "reference_to_verify",
      notes:
        "Consulter la documentation officielle et vérifier qu'elle correspond au pays, " +
        "au produit WebPay et au compte marchand concernés.",
    },

    developerPortal: {
      label: "Orange Developer",
      url: "https://developer.orange.com/",
      status: "official_portal",
    },

    ivoryCoastBusinessPage: {
      label: "Orange Money Côte d'Ivoire",
      url: "https://business.orange.ci/fr/orange-money/api-orange-money.html",
      status: "reference_to_verify",
      notes:
        "Vérifier les conditions d'accès, les produits disponibles et les modalités d'activation.",
    },
  },

  baseUrls: {
    oauth: "https://api.orange.com/oauth/v3/token",

    webpayDev: "https://api.orange.com/orange-money-webpayment/dev/v1",

    webpayProd: null,

    notes: [
      "L'URL OAuth est connue, mais l'accès dépend des autorisations du compte développeur.",
      "L'URL WebPay de développement doit être confirmée avec la documentation applicable au compte marchand.",
      "Aucune URL de production n'est renseignée sans confirmation officielle.",
      "Ne pas remplacer automatiquement l'URL de développement par une URL de production supposée.",
    ],
  },

  countryAndCurrency: {
    country: "Côte d'Ivoire",
    countryCode: "CI",
    currency: "XOF",
    currencyDescription: "Franc CFA BCEAO",

    rules: [
      "Vérifier que le produit WebPay est disponible pour le compte marchand ivoirien.",
      "Vérifier la devise acceptée par le contrat marchand.",
      "Ne pas supposer que les limites de paiement sont identiques dans tous les pays.",
      "Ne pas inventer de montant minimum ou maximum.",
    ],

    amountValidation: {
      status: "requires_technical_reference",

      rules: [
        "Valider le montant côté serveur.",
        "Utiliser une valeur numérique conforme au format exigé par l'API.",
        "Ne pas accepter aveuglément le montant envoyé par le navigateur.",
        "Vérifier les limites autorisées dans la documentation du compte marchand.",
      ],
    },
  },

  authentication: {
    type: "OAuth 2.0 Client Credentials",

    tokenEndpoint: "https://api.orange.com/oauth/v3/token",

    method: "POST",

    headers: {
      Authorization: "Basic BASE64(CLIENT_ID:CLIENT_SECRET)",
      "Content-Type": "application/x-www-form-urlencoded",
    },

    body: {
      grant_type: "client_credentials",
    },

    requestExample: {
      method: "POST",
      url: "https://api.orange.com/oauth/v3/token",

      headers: {
        Authorization: "Basic BASE64(CLIENT_ID:CLIENT_SECRET)",
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: "grant_type=client_credentials",
    },

    expectedResponseFields: [
      {
        name: "access_token",
        status: "documented_oauth_field",
        description: "Jeton utilisé pour authentifier les requêtes autorisées.",
      },
      {
        name: "token_type",
        status: "documented_oauth_field",
        description: "Type du jeton renvoyé par le serveur OAuth.",
      },
      {
        name: "expires_in",
        status: "documented_oauth_field",
        description: "Durée de validité du jeton, selon la réponse du serveur.",
      },
    ],

    rules: [
      "Les identifiants doivent être conservés côté serveur.",
      "Ne jamais exposer CLIENT_SECRET dans le navigateur.",
      "Ne jamais inclure les identifiants dans le code source public.",
      "Encoder correctement CLIENT_ID:CLIENT_SECRET en Base64.",
      "Ne pas confondre l'encodage Base64 avec le chiffrement.",
      "Envoyer le grant_type au format attendu par OAuth.",
      "Gérer les erreurs d'authentification sans révéler les secrets.",
      "Respecter la durée de validité réellement renvoyée par le serveur.",
      "Ne pas inventer la durée de validité du jeton.",
    ],

    tokenStorage: {
      recommended: "server_memory_or_secure_cache",
      notes: [
        "Conserver le jeton côté serveur.",
        "Éviter de demander un nouveau jeton inutilement.",
        "Renouveler le jeton selon sa durée de validité.",
        "Ne pas enregistrer le jeton dans les logs.",
      ],
    },
  },

  endpoints: {
    initiatePayment: {
      name: "Initiation d'un paiement WebPay",
      method: "POST",

      baseUrl: "https://api.orange.com/orange-money-webpayment/dev/v1",

      path: "/webpayment",

      url: "https://api.orange.com/orange-money-webpayment/dev/v1/webpayment",

      environment: "development",

      status: "requires_merchant_confirmation",

      description:
        "Point d'entrée référencé pour l'initiation d'un paiement WebPay. " +
        "Confirmer son URL, ses paramètres et ses en-têtes avec la documentation applicable au compte marchand.",

      authentication: "Bearer access_token",

      requestFields: [
        {
          name: "merchant_key",
          status: "requires_technical_reference",
          description:
            "Clé marchand dont le nom et le format doivent être confirmés.",
        },
        {
          name: "currency",
          status: "requires_technical_reference",
          description:
            "Code de devise accepté par le produit et le compte marchand.",
        },
        {
          name: "order_id",
          status: "requires_technical_reference",
          description:
            "Identifiant unique de la commande, selon le contrat de l'API.",
        },
        {
          name: "amount",
          status: "requires_technical_reference",
          description: "Montant de la transaction au format exigé par l'API.",
        },
        {
          name: "return_url",
          status: "requires_technical_reference",
          description:
            "URL de retour après le parcours de paiement, si ce champ est exigé.",
        },
        {
          name: "cancel_url",
          status: "requires_technical_reference",
          description:
            "URL de retour en cas d'annulation, si ce champ est exigé.",
        },
        {
          name: "notif_url",
          status: "requires_technical_reference",
          description:
            "URL de notification serveur, si ce mécanisme est prévu par le contrat.",
        },
        {
          name: "reference",
          status: "requires_technical_reference",
          description:
            "Référence éventuelle de la transaction ou de la commande.",
        },
        {
          name: "lang",
          status: "requires_technical_reference",
          description: "Langue éventuelle de l'interface de paiement.",
        },
      ],

      responseFields: [
        {
          name: "payment_url",
          status: "reported_but_unverified",
          description:
            "Champ évoqué dans certains exemples, à confirmer dans la réponse officielle.",
        },
        {
          name: "pay_token",
          status: "reported_but_unverified",
          description:
            "Champ évoqué dans certains exemples, à confirmer dans la réponse officielle.",
        },
        {
          name: "notif_token",
          status: "reported_but_unverified",
          description:
            "Champ évoqué dans certains exemples, à confirmer dans la documentation applicable.",
        },
      ],

      rules: [
        "Ne pas présenter les champs listés comme un schéma JSON certifié.",
        "Confirmer les noms, types et champs obligatoires avant d'écrire le payload final.",
        "Ne pas inventer les champs supplémentaires d'une requête.",
        "Ne pas considérer la réception d'une URL de paiement comme une preuve de paiement réussi.",
        "Ne jamais confirmer une commande uniquement à partir du retour du navigateur.",
      ],
    },

    getTransactionStatus: {
      name: "Consultation du statut d'une transaction",
      method: "POST",

      baseUrl: "https://api.orange.com/orange-money-webpayment/dev/v1",

      path: "/transactionstatus",

      url: "https://api.orange.com/orange-money-webpayment/dev/v1/transactionstatus",

      environment: "development",

      status: "requires_merchant_confirmation",

      description:
        "Point d'entrée référencé pour consulter le statut d'une transaction. " +
        "Confirmer l'URL, la méthode, le payload et le schéma de réponse avec la documentation du compte marchand.",

      authentication: "Bearer access_token",

      requestFields: [
        {
          name: "transaction_reference",
          status: "not_confirmed",
          description:
            "Nom indicatif uniquement : identifier le champ réel exigé par l'API.",
        },
        {
          name: "order_id",
          status: "requires_technical_reference",
          description: "Identifiant de commande éventuel, à confirmer.",
        },
      ],

      responseFields: [
        {
          name: "status",
          status: "reported_but_unverified",
          description:
            "Le nom et les valeurs possibles doivent être confirmés.",
        },
        {
          name: "transaction_id",
          status: "reported_but_unverified",
          description: "Identifiant de transaction éventuel, à confirmer.",
        },
      ],

      rules: [
        "Les champs de requête ci-dessus ne constituent pas un payload certifié.",
        "Ne pas inventer les valeurs possibles du statut.",
        "Ne pas assimiler automatiquement HTTP 200 à un paiement réussi.",
        "Vérifier le statut auprès du serveur de paiement avant de confirmer la commande.",
      ],
    },
  },

  paymentWorkflow: {
    status: "conceptual_workflow_requires_api_confirmation",

    steps: [
      {
        step: 1,
        title: "Créer la commande",
        description:
          "Créer une commande côté serveur avec un identifiant unique et un montant calculé par le serveur.",
      },
      {
        step: 2,
        title: "Vérifier la commande",
        description:
          "Contrôler le montant, la devise, l'identifiant de commande et les règles métier.",
      },
      {
        step: 3,
        title: "Obtenir un jeton OAuth",
        description:
          "Appeler le point d'entrée OAuth avec les identifiants autorisés, côté serveur.",
      },
      {
        step: 4,
        title: "Initier le paiement",
        description:
          "Construire la requête avec les champs confirmés dans la documentation officielle.",
      },
      {
        step: 5,
        title: "Rediriger le client",
        description:
          "Utiliser l'URL de paiement réellement renvoyée par l'API, si cette réponse en contient une.",
      },
      {
        step: 6,
        title: "Vérifier le résultat",
        description:
          "Vérifier le statut côté serveur à partir du mécanisme officiellement prévu.",
      },
      {
        step: 7,
        title: "Mettre à jour la commande",
        description:
          "Confirmer la commande uniquement après une vérification fiable du paiement.",
      },
    ],

    importantRules: [
      "Le retour vers return_url ne prouve pas à lui seul le succès du paiement.",
      "Une réponse HTTP réussie ne prouve pas nécessairement que la transaction est payée.",
      "Le montant attendu doit provenir de la commande enregistrée côté serveur.",
      "Prévoir les délais, erreurs réseau et réponses temporaires.",
      "Éviter de créer plusieurs paiements involontaires pour la même commande.",
    ],
  },

  notificationsAndWebhooks: {
    status: "requires_technical_reference",

    description:
      "Le format des notifications, leur authentification et leur protocole exacts ne sont pas confirmés dans cette base.",

    fields: [
      {
        name: "notif_url",
        status: "requires_technical_reference",
      },
      {
        name: "notif_token",
        status: "reported_but_unverified",
      },
    ],

    rules: [
      "Ne pas inventer le format d'une notification.",
      "Confirmer si le produit utilise un webhook, une notification ou un autre mécanisme.",
      "Vérifier la méthode d'authentification des notifications.",
      "Ne pas faire confiance à une notification non authentifiée.",
      "Ne pas supposer qu'un champ notif_token constitue à lui seul une signature sécurisée.",
      "Ne pas exposer les secrets dans les journaux.",
      "Prévoir un traitement idempotent des événements répétés.",
      "Ne pas marquer une commande comme payée sans validation conforme au protocole officiel.",
    ],
  },

  errorHandling: {
    status: "general_recommendations",

    cases: [
      {
        case: "Authentication error",
        handling:
          "Vérifier les identifiants, les autorisations et le format de la requête OAuth.",
      },
      {
        case: "Unauthorized request",
        handling:
          "Vérifier le jeton, sa validité et les autorisations accordées au compte.",
      },
      {
        case: "Invalid request",
        handling:
          "Comparer les paramètres envoyés avec le schéma officiel applicable.",
      },
      {
        case: "Network timeout",
        handling:
          "Ne pas supposer que le paiement a échoué. Vérifier son statut avant toute nouvelle tentative.",
      },
      {
        case: "Payment pending",
        handling:
          "Conserver un état intermédiaire et vérifier à nouveau selon les règles officielles.",
      },
      {
        case: "Payment failed",
        handling:
          "Enregistrer le résultat et permettre une nouvelle tentative contrôlée si le contrat le permet.",
      },
      {
        case: "Unknown response",
        handling:
          "Ne pas interpréter un champ ou un statut inconnu comme une confirmation de paiement.",
      },
    ],

    rules: [
      "Ne jamais renvoyer au client les secrets ou les détails internes sensibles.",
      "Ne pas journaliser les identifiants confidentiels ni les jetons.",
      "Conserver un identifiant de corrélation pour faciliter le diagnostic.",
      "Ne pas relancer automatiquement une opération de paiement sans évaluer le risque de doublon.",
    ],
  },

  environmentVariables: {
    status: "recommended_configuration",

    variables: [
      {
        name: "ORANGE_MONEY_CLIENT_ID",
        description: "Identifiant client fourni pour l'accès à l'API.",
        secret: true,
      },
      {
        name: "ORANGE_MONEY_CLIENT_SECRET",
        description: "Secret client fourni pour l'accès à l'API.",
        secret: true,
      },
      {
        name: "ORANGE_MONEY_MERCHANT_KEY",
        description: "Clé marchand, uniquement si exigée par le contrat.",
        secret: true,
      },
      {
        name: "ORANGE_MONEY_OAUTH_URL",
        description: "URL OAuth vérifiée pour l'environnement utilisé.",
        secret: false,
      },
      {
        name: "ORANGE_MONEY_WEBPAY_BASE_URL",
        description: "URL de base WebPay confirmée pour l'environnement.",
        secret: false,
      },
    ],

    example: [
      "# .env.local",
      "ORANGE_MONEY_CLIENT_ID=your_client_id",
      "ORANGE_MONEY_CLIENT_SECRET=your_client_secret",
      "ORANGE_MONEY_MERCHANT_KEY=your_merchant_key",
      "ORANGE_MONEY_OAUTH_URL=https://api.orange.com/oauth/v3/token",
      "ORANGE_MONEY_WEBPAY_BASE_URL=https://api.orange.com/orange-money-webpayment/dev/v1",
    ].join("\n"),

    rules: [
      "Ne jamais committer le fichier .env.local dans Git.",
      "Ne jamais utiliser NEXT_PUBLIC_ pour un secret.",
      "Les variables doivent être utilisées uniquement côté serveur.",
      "L'exemple de configuration ne confirme pas que les identifiants ou l'accès WebPay sont activés.",
      "Ne pas utiliser l'URL de développement en production.",
      "Configurer l'URL de production uniquement après confirmation officielle.",
    ],
  },

  architectureRecommendations: {
    status: "general_recommendations",

    principles: [
      "Effectuer les appels Orange Money depuis le serveur, jamais directement depuis le navigateur avec un secret.",
      "Séparer la logique de paiement de l'interface utilisateur.",
      "Créer un module dédié au fournisseur de paiement.",
      "Valider les entrées et les montants côté serveur.",
      "Enregistrer les commandes et les transactions en base de données.",
      "Prévoir des états de paiement explicites.",
      "Rendre les traitements répétitifs idempotents.",
      "Ne pas confondre l'état technique d'une requête et l'état métier du paiement.",
      "Ne pas enregistrer une commande comme payée avant vérification.",
    ],

    suggestedStructure: {
      paymentService: "lib/payments/orange-money.ts",
      createPaymentRoute: "app/api/payments/orange-money/route.ts",
      statusRoute: "app/api/payments/orange-money/status/route.ts",
      webhookRoute: "app/api/payments/orange-money/notification/route.ts",
      note: "Les chemins sont des exemples d'architecture Next.js, pas des endpoints Orange Money.",
    },

    testing: [
      "Tester uniquement avec les identifiants et l'environnement autorisés.",
      "Vérifier les cas de succès, d'échec, d'attente et de délai réseau.",
      "Tester les doublons et les nouvelles tentatives.",
      "Ne pas effectuer de paiement réel sans autorisation et configuration confirmées.",
      "Ne pas prétendre qu'une intégration est testée si aucun test réel n'a été effectué.",
    ],
  },

  aiIntegrationPolicy: {
    objective:
      "Aider un développeur à intégrer Orange Money étape par étape sans inventer les informations manquantes.",

    strictRules: [
      "Distinguer les informations officielles, les informations rapportées et les hypothèses.",
      "Ne jamais présenter cette base de connaissances comme une spécification officielle certifiée.",
      "Ne pas inventer une URL de production.",
      "Ne pas déduire qu'une URL de développement est valide pour tous les comptes marchands.",
      "Ne pas supposer que les identifiants développeur suffisent à activer WebPay.",
      "Ne pas inventer les champs obligatoires, leurs types ou leurs formats.",
      "Ne pas inventer les payloads JSON de requête ou de réponse.",
      "Ne pas inventer les valeurs possibles des statuts de transaction.",
      "Ne pas inventer le format, la signature ou le mécanisme des notifications.",
      "Ne pas affirmer qu'un endpoint fonctionne sans preuve ou test.",
      "Ne pas considérer les champs historiques pay_token, payment_url et notif_token comme contractuellement confirmés sans référence vérifiable.",
      "Les chemins /webpayment et /transactionstatus doivent être confirmés avec la documentation applicable au compte marchand.",
      "Si une information technique manque, l'indiquer explicitement et demander la documentation ou un exemple officiel.",
      "Ne jamais demander à l'utilisateur de partager publiquement son client secret ou ses autres secrets.",
      "Ne jamais placer un secret dans le code client ou dans un exemple destiné au navigateur.",
      "Ne pas confirmer un paiement sur la seule base d'une redirection navigateur.",
      "Ne pas prétendre qu'un paiement a réussi sans vérification fiable côté serveur.",
      "Ne pas prétendre qu'un test ou un déploiement a réussi s'il n'a pas réellement été effectué.",
      "Expliquer l'intégration progressivement, une étape à la fois.",
      "Fournir du code adapté au framework demandé par le développeur.",
      "Avant de générer le code final, identifier les informations bloquantes non confirmées.",
    ],

    confidenceLevels: {
      documented:
        "Information explicitement confirmée par une documentation officielle applicable.",
      reported_but_unverified:
        "Information présente dans des exemples ou des sources secondaires, mais pas confirmée pour le contrat utilisé.",
      requires_technical_reference:
        "Information à confirmer à partir d'une documentation technique fiable.",
      requires_merchant_confirmation:
        "Information qui doit être vérifiée avec le compte marchand ou le support Orange Money.",
      not_confirmed:
        "Information insuffisante pour produire une implémentation fiable.",
    },

    expectedAssistantBehavior: [
      "Commencer par identifier le pays, le produit et l'environnement de paiement.",
      "Vérifier les informations disponibles avant de proposer le code.",
      "Présenter les prérequis et les variables d'environnement nécessaires.",
      "Expliquer le rôle de chaque étape.",
      "Séparer le code certain du code qui dépend d'un contrat API non confirmé.",
      "Demander la documentation manquante plutôt que d'inventer les paramètres.",
      "Produire un exemple minimal uniquement lorsque les informations nécessaires sont suffisantes.",
      "Terminer par des étapes de test adaptées à l'environnement autorisé.",
    ],
  },
} as const;
