// docs/mtn-momo-collection.ts
// MTN MoMo API — Collection / RequestToPay
//
// Base de connaissances pour AfriContext.
// Référence officielle : https://momodeveloper.mtn.com/
//
// IMPORTANT :
// - Les endpoints sandbox sont issus des références MTN MoMo.
// - L'accès en production dépend du pays, du produit et du compte partenaire.
// - Les exemples de requêtes ne garantissent pas que le compte est activé.
// - Aucune clé secrète réelle ne doit être stockée dans ce fichier.

export const mtnMomoCollectionKnowledge = {
  metadata: {
    provider: "MTN",
    product: "MoMo API - Collection",
    useCase: "RequestToPay",
    version: "v1_0",
    specification: "OpenAPI",
    country: "Côte d'Ivoire",
    currency: "XOF",

    status: "partially_verified",

    description:
      "Base de connaissances pour guider les développeurs dans l'intégration " +
      "de MTN MoMo Collection avec une approche progressive et sécurisée.",

    disclaimer:
      "Cette base de connaissances ne remplace pas la documentation officielle " +
      "applicable au compte marchand. Les paramètres propres au pays et à la " +
      "production doivent être confirmés avant une intégration réelle.",

    lastReviewed: "2026-10-14",
  },

  sources: {
    developerPortal: {
      name: "MTN MoMo Developer Portal",
      url: "https://momodeveloper.mtn.com/",
      status: "official",
    },

    apiDocumentation: {
      name: "MTN MoMo API Documentation",
      url: "https://momodeveloper.mtn.com/",
      status: "official_portal_reference",
      notes:
        "Utiliser la documentation Collection et les exemples RequestToPay " +
        "disponibles dans le portail officiel.",
    },
  },

  environments: {
    sandbox: {
      baseUrl: "https://sandbox.momodeveloper.mtn.com",
      status: "documented_sandbox_base_url",
    },

    production: {
      baseUrl: null,
      status: "requires_partner_confirmation",
      notes: [
        "Ne pas supposer que l'URL de production est identique pour tous les pays.",
        "Confirmer l'URL et les accès fournis lors de l'onboarding MTN.",
        "Confirmer la valeur exacte de X-Target-Environment pour le compte ivoirien.",
      ],
    },

    headers: {
      targetEnvironment: {
        sandbox: "sandbox",
        production: null,
        productionStatus: "requires_partner_confirmation",
      },

      subscriptionKey: "Ocp-Apim-Subscription-Key",
    },
  },

  countryAndCurrency: {
    requestedCountry: "Côte d'Ivoire",
    countryCode: "CI",
    requestedCurrency: "XOF",

    status: "requires_account_confirmation",

    notes: [
      "XOF correspond à la devise demandée pour le contexte ivoirien.",
      "Confirmer que le produit Collection du compte MTN accepte cette devise.",
      "Les exemples sandbox du portail peuvent utiliser une devise différente.",
      "Ne pas supposer que la devise de l'exemple sandbox est celle de production.",
      "Ne pas inventer les limites minimales ou maximales de transaction.",
    ],
  },

  authentication: {
    type: "OAuth 2.0 Client Credentials",

    overview:
      "Le parcours classique du portail MTN MoMo utilise un API User, une API Key " +
      "et un jeton d'accès OAuth pour autoriser les appels à Collection.",

    requiredCredentials: [
      {
        name: "Ocp-Apim-Subscription-Key",
        description:
          "Clé d'abonnement fournie par le portail développeur pour l'API concernée.",
        secret: true,
        status: "required_for_configured_api",
      },
      {
        name: "X-Reference-Id",
        description:
          "UUID utilisé pour identifier l'API User lors de sa création.",
        secret: false,
        status: "documented",
      },
      {
        name: "api_key",
        description:
          "Clé associée à l'API User, générée via l'endpoint prévu par MTN.",
        secret: true,
        status: "requires_secure_storage",
      },
      {
        name: "access_token",
        description: "Jeton OAuth utilisé pour les appels protégés.",
        secret: true,
        status: "obtained_at_runtime",
      },
    ],

    steps: {
      createApiUser: {
        method: "POST",
        path: "/v1_0/apiuser",

        sandboxUrl: "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser",

        headers: {
          "X-Reference-Id": "<UUID_V4>",
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": "<SUBSCRIPTION_KEY>",
        },

        exampleBody: {
          providerCallbackHost: "https://example.com",
        },

        expectedHttpStatus: 201,

        notes: [
          "Générer un UUID pour identifier le nouvel API User.",
          "Utiliser un domaine contrôlé par le marchand pour le callback host.",
          "L'exemple de corps doit être comparé à la documentation du compte.",
          "Ne pas utiliser example.com comme véritable URL de callback.",
        ],
      },

      createApiKey: {
        method: "POST",

        path: "/v1_0/apiuser/{X-Reference-Id}/apikey",

        sandboxUrl:
          "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/{X-Reference-Id}/apikey",

        headers: {
          "Ocp-Apim-Subscription-Key": "<SUBSCRIPTION_KEY>",
        },

        expectedResult: {
          field: "apiKey",
          status: "field_name_to_verify_against_actual_response",
        },

        notes: [
          "Remplacer {X-Reference-Id} par l'identifiant utilisé à la création.",
          "La clé obtenue est confidentielle.",
          "Confirmer le nom exact du champ de réponse dans la documentation active.",
        ],
      },

      createAccessToken: {
        method: "POST",

        path: "/collection/token/",

        sandboxUrl: "https://sandbox.momodeveloper.mtn.com/collection/token/",

        headers: {
          Authorization: "Basic BASE64(API_USER_REFERENCE_ID:API_KEY)",

          "Ocp-Apim-Subscription-Key": "<SUBSCRIPTION_KEY>",
        },

        body: null,

        notes: [
          "Utiliser l'API User et la clé API correspondante.",
          "L'authentification Basic utilise l'encodage Base64 des identifiants.",
          "Ne pas confondre Base64 avec du chiffrement.",
          "Ne pas exposer ces identifiants au navigateur.",
          "Vérifier le format de réponse et la durée de validité du jeton retourné.",
        ],

        responseFields: [
          {
            name: "access_token",
            status: "expected_oauth_field",
          },
          {
            name: "token_type",
            status: "verify_in_actual_response",
          },
          {
            name: "expires_in",
            status: "verify_in_actual_response",
          },
        ],
      },
    },
  },

  endpoints: {
    requestToPay: {
      name: "RequestToPay",
      method: "POST",

      path: "/collection/v1_0/requesttopay",

      sandboxUrl:
        "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",

      productionUrl: null,

      productionStatus: "requires_partner_confirmation",

      purpose:
        "Demander au client d'autoriser un paiement depuis son compte Mobile Money.",

      headers: {
        Authorization: "Bearer <ACCESS_TOKEN>",

        "X-Reference-Id": "<UUID_V4_UNIQUE_POUR_LA_DEMANDE>",

        "X-Target-Environment": "sandbox",

        "Ocp-Apim-Subscription-Key": "<COLLECTION_SUBSCRIPTION_KEY>",

        "Content-Type": "application/json",
      },

      documentedRequestFields: [
        {
          name: "amount",
          type: "string",
          required: true,
          description:
            "Montant de la transaction transmis sous forme de chaîne dans l'exemple officiel.",
          example: "1000",
          status: "documented_example",
        },
        {
          name: "currency",
          type: "string",
          required: true,
          description:
            "Code de devise accepté par le produit et l'environnement utilisés.",
          example: "EUR",
          status: "documented_example_not_country_confirmation",
        },
        {
          name: "externalId",
          type: "string",
          required: true,
          description: "Référence de transaction définie par le partenaire.",
          example: "10001",
          status: "documented_example",
        },
        {
          name: "payer",
          type: "object",
          required: true,
          description: "Compte du client qui doit effectuer le paiement.",
          status: "documented_example",
        },
        {
          name: "payer.partyIdType",
          type: "string",
          required: true,
          description: "Type d'identifiant du payeur.",
          example: "MSISDN",
          status: "documented_example",
        },
        {
          name: "payer.partyId",
          type: "string",
          required: true,
          description:
            "Identifiant du compte client, par exemple son numéro Mobile Money.",
          example: "123456789012",
          status: "documented_example",
        },
        {
          name: "payerMessage",
          type: "string",
          required: true,
          description: "Message associé à la demande de paiement.",
          example: "Order Payment",
          status: "documented_example",
        },
        {
          name: "payeeNote",
          type: "string",
          required: true,
          description: "Note associée à la transaction pour le bénéficiaire.",
          example: "Order Payment",
          status: "documented_example",
        },
      ],

      exampleBody: {
        amount: "1000",
        currency: "EUR",
        externalId: "10001",

        payer: {
          partyIdType: "MSISDN",
          partyId: "123456789012",
        },

        payerMessage: "Order Payment",
        payeeNote: "Order Payment",
      },

      exampleBodyNotes: [
        "Cet exemple illustre la structure générale de la requête.",
        "La devise EUR est celle de l'exemple de référence, pas une recommandation pour la Côte d'Ivoire.",
        "Remplacer les valeurs de démonstration par des valeurs valides pour l'environnement utilisé.",
        "Ne pas considérer un numéro d'exemple comme un vrai compte de paiement.",
      ],

      expectedHttpStatus: 202,

      acceptedResponseMeaning:
        "HTTP 202 Accepted indique que la demande a été acceptée pour traitement. " +
        "Cela ne confirme pas que le paiement est terminé ou réussi.",

      transactionReference: {
        header: "X-Reference-Id",
        usage:
          "Conserver l'identifiant envoyé pour retrouver et vérifier la transaction.",
      },

      rules: [
        "Générer un UUID unique pour chaque demande de paiement.",
        "Conserver l'association entre l'identifiant de référence et la commande interne.",
        "Ne jamais marquer la commande comme payée sur la seule base du HTTP 202.",
        "Vérifier le statut final avec l'endpoint de consultation.",
        "Valider le montant côté serveur.",
        "Ne pas supposer que toutes les devises sont acceptées dans tous les environnements.",
      ],
    },

    getTransactionStatus: {
      name: "RequestToPay Transaction Status",
      method: "GET",

      path: "/collection/v1_0/requesttopay/{referenceId}",

      sandboxUrl:
        "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/{referenceId}",

      productionUrl: null,

      productionStatus: "requires_partner_confirmation",

      purpose: "Consulter le statut d'une demande RequestToPay existante.",

      headers: {
        Authorization: "Bearer <ACCESS_TOKEN>",

        "X-Target-Environment": "sandbox",

        "Ocp-Apim-Subscription-Key": "<COLLECTION_SUBSCRIPTION_KEY>",
      },

      pathParameters: [
        {
          name: "referenceId",
          description: "Identifiant de référence de la demande RequestToPay.",
          status: "documented_endpoint_parameter",
        },
      ],

      documentedStatuses: [
        {
          value: "PENDING",
          meaning: "La demande est toujours en cours de traitement.",
        },
        {
          value: "SUCCESSFUL",
          meaning: "La transaction est signalée comme réussie.",
        },
        {
          value: "FAILED",
          meaning: "La transaction est signalée comme échouée.",
        },
      ],

      rules: [
        "Utiliser la référence de la demande correspondante.",
        "Gérer les statuts de manière explicite.",
        "Ne pas interpréter PENDING comme un succès ou un échec définitif.",
        "Vérifier les détails exacts de la réponse dans la documentation active.",
        "Ne pas inventer d'autres valeurs de statut.",
      ],
    },
  },

  callbacks: {
    status: "requires_implementation_confirmation",

    overview:
      "La documentation MTN décrit la possibilité d'une notification callback " +
      "lorsqu'une demande RequestToPay atteint un état final, si le callback est configuré.",

    documentedBehavior: [
      "Une notification peut être envoyée lorsque la transaction atteint un état final.",
      "Les états finaux décrits incluent SUCCESSFUL et FAILED.",
      "La documentation indique que le callback RequestToPay n'est pas renvoyé en cas d'échec de livraison.",
      "La consultation GET permet de vérifier le statut si le callback n'est pas reçu.",
    ],

    security: [
      "Confirmer dans la documentation du compte comment le callback est authentifié.",
      "Ne pas inventer un en-tête de signature ou un algorithme de vérification.",
      "Ne pas faire confiance à une notification simplement parce qu'elle arrive sur l'URL attendue.",
      "Utiliser l'endpoint de statut pour réconcilier les transactions lorsque nécessaire.",
      "Traiter les notifications de manière idempotente.",
    ],

    implementationRules: [
      "Ne pas dépendre uniquement du callback pour connaître le résultat final.",
      "Prévoir un mécanisme de réconciliation.",
      "Ne pas supposer que le fournisseur renverra automatiquement les notifications perdues.",
      "Ne pas marquer une commande comme payée sans vérification conforme au protocole documenté.",
    ],
  },

  paymentWorkflowUX: {
    status: "documented_general_workflow",

    steps: [
      {
        step: 1,
        title: "Le client choisit Mobile Money",
        description: "Le client sélectionne MTN MoMo comme moyen de paiement.",
      },
      {
        step: 2,
        title: "Le serveur crée la demande",
        description:
          "Le serveur valide la commande et envoie RequestToPay à MTN.",
      },
      {
        step: 3,
        title: "MTN accepte la demande",
        description:
          "La réponse 202 indique que la demande a été acceptée pour traitement.",
      },
      {
        step: 4,
        title: "Le client autorise le paiement",
        description:
          "Le client approuve ou refuse la demande via le canal Mobile Money prévu.",
      },
      {
        step: 5,
        title: "Le serveur vérifie le statut",
        description:
          "Le serveur consulte le statut ou traite une notification conformément à la documentation.",
      },
      {
        step: 6,
        title: "La commande est mise à jour",
        description:
          "La commande est confirmée uniquement après vérification du statut final.",
      },
    ],

    rules: [
      "Informer le client que le paiement est en cours après une réponse 202.",
      "Ne pas annoncer un succès avant confirmation.",
      "Prévoir un état intermédiaire pour les paiements en attente.",
      "Gérer les erreurs réseau et les réponses inconnues.",
    ],
  },

  amounts: {
    status: "requires_country_specific_confirmation",

    rules: [
      "Le champ amount est montré comme une chaîne dans l'exemple de référence.",
      "La devise doit être compatible avec le compte et l'environnement.",
      "Vérifier le format, les limites et les règles d'arrondi dans la documentation du compte.",
      "Ne pas imposer une règle universelle sur les décimales sans référence propre à la devise.",
      "Ne pas faire confiance au montant envoyé directement par le navigateur.",
    ],
  },

  environmentVariables: {
    recommended: true,

    variables: [
      {
        name: "MTN_MOMO_COLLECTION_BASE_URL",
        secret: false,
        description: "URL de base confirmée pour l'environnement actif.",
      },
      {
        name: "MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY",
        secret: true,
        description: "Clé d'abonnement associée à l'API Collection.",
      },
      {
        name: "MTN_MOMO_API_USER",
        secret: true,
        description: "Identifiant de l'API User selon la configuration MTN.",
      },
      {
        name: "MTN_MOMO_API_KEY",
        secret: true,
        description: "Clé API associée à l'API User.",
      },
      {
        name: "MTN_MOMO_TARGET_ENVIRONMENT",
        secret: false,
        description:
          "Valeur X-Target-Environment confirmée pour l'environnement actif.",
      },
    ],

    example: [
      "# .env.local",
      "MTN_MOMO_COLLECTION_BASE_URL=https://sandbox.momodeveloper.mtn.com",
      "MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY=your_subscription_key",
      "MTN_MOMO_API_USER=your_api_user_reference",
      "MTN_MOMO_API_KEY=your_api_key",
      "MTN_MOMO_TARGET_ENVIRONMENT=sandbox",
    ].join("\n"),

    rules: [
      "Ne jamais committer les secrets dans Git.",
      "Ne jamais exposer une clé secrète dans le navigateur.",
      "Ne pas utiliser NEXT_PUBLIC_ pour les secrets.",
      "Conserver les identifiants uniquement côté serveur.",
      "Ne pas utiliser la configuration sandbox pour effectuer des transactions de production.",
    ],
  },

  architectureRecommendations: {
    principles: [
      "Effectuer les appels MTN MoMo côté serveur.",
      "Séparer la logique de paiement de l'interface.",
      "Enregistrer la commande et la référence de paiement avant le traitement asynchrone.",
      "Prévoir un état PENDING avant de connaître le résultat final.",
      "Mettre en place une vérification de statut côté serveur.",
      "Traiter les notifications de façon idempotente.",
      "Éviter les nouvelles tentatives automatiques qui pourraient créer des paiements en double.",
      "Ne pas stocker les secrets dans la base de données sans protection adaptée.",
    ],

    suggestedStructure: {
      paymentService: "lib/payments/mtn-momo-collection.ts",
      createPaymentRoute: "app/api/payments/mtn-momo/route.ts",
      statusRoute: "app/api/payments/mtn-momo/status/route.ts",
      callbackRoute: "app/api/payments/mtn-momo/callback/route.ts",

      note: "Ces chemins sont des suggestions d'organisation Next.js, pas des endpoints MTN.",
    },
  },

  aiIntegrationPolicy: {
    objective:
      "Guider le développeur dans l'intégration de MTN MoMo Collection à partir des références disponibles, sans inventer les éléments manquants.",

    strictRules: [
      "Utiliser en priorité le portail officiel MTN MoMo Developer.",
      "Distinguer les faits documentés, les exemples et les hypothèses.",
      "Ne pas inventer un endpoint ou une URL de production.",
      "Ne pas supposer que la configuration sandbox fonctionne en production.",
      "Ne pas affirmer que XOF est activé pour un compte sans confirmation applicable.",
      "Ne pas confondre Collection / RequestToPay avec Disbursement / Transfer.",
      "Ne pas modifier arbitrairement les noms de champs camelCase documentés.",
      "Ne pas inventer des champs obligatoires absents de la documentation applicable.",
      "Ne pas supposer que le statut HTTP 202 signifie que le paiement est réussi.",
      "Ne pas inventer de signature ou d'en-têtes de sécurité pour les callbacks.",
      "Ne pas supposer que les callbacks seront automatiquement renvoyés après une erreur.",
      "Ne jamais exposer les clés d'abonnement, API Keys ou jetons au navigateur.",
      "Ne pas affirmer qu'une transaction a réussi sans vérification fiable du statut.",
      "Ne pas prétendre qu'une intégration a été testée si aucun test n'a été effectué.",
      "Demander la documentation ou les paramètres fournis lors de l'onboarding lorsqu'une information manque.",
      "Expliquer les étapes progressivement et séparer les prérequis du code.",
    ],

    confidenceLevels: {
      documented:
        "Information présente dans la documentation officielle consultée.",
      documented_example:
        "Valeur ou structure utilisée comme exemple dans la documentation.",
      requires_account_confirmation:
        "Information dépendant de l'activation ou de la configuration du compte.",
      requires_partner_confirmation:
        "Information à confirmer auprès du portail ou de l'équipe MTN chargée de l'onboarding.",
      requires_implementation_confirmation:
        "Mécanisme à vérifier avant de l'implémenter.",
      unverified:
        "Information qui ne doit pas être présentée comme un fait confirmé.",
    },

    expectedAssistantBehavior: [
      "Identifier le pays, le produit et l'environnement demandés.",
      "Vérifier la documentation correspondant au produit Collection.",
      "Expliquer l'authentification avant la création du paiement.",
      "Présenter les endpoints sandbox documentés avec leurs méthodes.",
      "Indiquer les informations nécessaires pour activer la production.",
      "Produire le payload en respectant le schéma officiel applicable.",
      "Expliquer la vérification du statut et les états asynchrones.",
      "Signaler clairement les éléments à confirmer avant un paiement réel.",
    ],
  },
} as const;
