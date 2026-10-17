export const waveCheckoutKnowledge = {
  provider: "Wave",
  product: "Checkout API",
  version: "v1",

  metadata: {
    integrationTargetCountry: "Côte d'Ivoire",
    countryAvailabilityStatus: "requires_merchant_confirmation",
    lastReviewed: "2026-10-14",

    sources: {
      checkout: "https://docs.wave.com/checkout",
      webhooks: "https://docs.wave.com/webhook",
      business: "https://docs.wave.com/business",
      developerPortal: "https://business.wave.com/",
    },

    verification: {
      reviewedAt: "2026-10-14",
      note: "Cette date correspond à la date de revue du fichier, pas à une garantie que chaque fonctionnalité a été testée en production.",

      claims: [
        {
          topic: "checkout_endpoints",
          status: "documented",
          sourceUrl: "https://docs.wave.com/checkout",
        },
        {
          topic: "api_request_signing",
          status: "documented",
          sourceUrl: "https://docs.wave.com/checkout",
        },
        {
          topic: "webhook_signature",
          status: "documented",
          sourceUrl: "https://docs.wave.com/webhook",
        },
        {
          topic: "future_timestamp_tolerance_for_webhooks",
          status: "not_confirmed",
          sourceUrl: "https://docs.wave.com/webhook",
        },
        {
          topic: "merchant_account_activation_in_ci",
          status: "requires_merchant_confirmation",
          sourceUrl: "https://business.wave.com/",
        },
        {
          topic: "sandbox_availability",
          status: "not_confirmed",
          sourceUrl: "https://docs.wave.com/checkout",
        },
      ],
    },
  },

  baseUrl: "https://api.wave.com",

  environment: {
    sandboxUrl: null,
    sandboxStatus: "not_confirmed_in_referenced_documentation",

    variables: [
      {
        name: "WAVE_API_KEY",
        purpose: "Clé API Wave utilisée côté serveur.",
        required: true,
        secret: true,
      },
      {
        name: "WAVE_WEBHOOK_SECRET",
        purpose:
          "Secret partagé, uniquement si la stratégie d'authentification webhook choisie l'utilise.",
        required: false,
        secret: true,
      },
      {
        name: "WAVE_WEBHOOK_SIGNING_SECRET",
        purpose:
          "Secret de signature HMAC, uniquement si cette stratégie est activée.",
        required: false,
        secret: true,
      },
      {
        name: "WAVE_CHECKOUT_SUCCESS_URL",
        purpose: "URL de retour de l'utilisateur après le parcours Checkout.",
        required: false,
        secret: false,
      },
      {
        name: "WAVE_CHECKOUT_ERROR_URL",
        purpose: "URL de retour en cas d'échec du parcours Checkout.",
        required: false,
        secret: false,
      },
    ],

    rules: [
      "Ne jamais exposer une clé API ou un secret dans le navigateur.",
      "Ne jamais committer de vraies clés ou de vrais secrets dans Git.",
      "Ne pas inventer une URL sandbox si elle n'est pas confirmée par une source officielle.",
      "Utiliser des variables d'environnement côté serveur.",
    ],
  },

  countries: {
    integrationTargetCountry: "Côte d'Ivoire",
    availabilityStatus: "requires_merchant_confirmation",

    rules: [
      "Le pays cible du projet ne garantit pas que le compte marchand dispose de l'accès nécessaire.",
      "Confirmer l'éligibilité du compte marchand, l'activation de Checkout et les autorisations disponibles.",
      "Ne pas présenter la disponibilité du service comme garantie sans confirmation officielle.",
    ],
  },

  authentication: {
    method: "Bearer",
    header: "Authorization",
    format: "Bearer <API_KEY>",

    rules: [
      "Envoyer les requêtes API depuis le serveur.",
      "Utiliser HTTPS.",
      "Ne jamais envoyer la clé API au frontend.",
      "Les autorisations dépendent du compte marchand et de la clé API.",
    ],

    requestSigning: {
      availability: "optional",

      algorithm: "HMAC-SHA256",

      header: "Wave-Signature",

      format: "t=<timestamp>,v1=<signature>",

      payload: "timestamp + raw HTTP request body",

      getRequestPayload:
        "Pour une requête GET, la documentation indique d'utiliser le timestamp suivi d'un corps vide.",

      timestampValidation: {
        rejectOlderThanSeconds: 300,
        rejectFutureMoreThanSeconds: 30,
        appliesTo: "outgoing_api_request_signatures",
      },

      rules: [
        "La signature des requêtes API est une fonctionnalité distincte de la signature des webhooks.",
        "Si la signature des requêtes est activée, respecter la méthode de signature documentée pour chaque requête.",
        "Utiliser exactement les octets du corps brut requis par la documentation pour calculer la signature.",
        "Ne pas appliquer automatiquement les tolérances temporelles des requêtes API à la validation des webhooks.",
        "Ne pas considérer la signature comme obligatoire si elle n'est pas activée pour le compte ou l'intégration concernée.",
      ],

      sourceUrl: "https://docs.wave.com/checkout",
    },

    ipAllowlist: {
      appliesTo: "outgoing_api_requests",
      purpose:
        "Restreindre les adresses IP autorisées à appeler l'API lorsque cette fonction est configurée.",
      rules: [
        "Distinguer cette liste des adresses IP utilisées pour les webhooks entrants.",
        "Vérifier la configuration et les exigences actuelles dans la documentation officielle.",
        "Ne pas inventer d'adresses IP.",
      ],
      sourceUrl: "https://docs.wave.com/checkout",
    },
  },

  endpoints: {
    createCheckoutSession: {
      method: "POST",
      path: "/v1/checkout/sessions",
      purpose: "Créer une session Checkout.",
      sourceUrl: "https://docs.wave.com/checkout",
    },

    retrieveCheckoutSession: {
      method: "GET",
      path: "/v1/checkout/sessions/{id}",
      purpose: "Récupérer une session Checkout à partir de son identifiant.",
      sourceUrl: "https://docs.wave.com/checkout",
    },

    retrieveCheckoutSessionByTransactionId: {
      method: "GET",
      path: "/v1/checkout/sessions?transaction_id={transaction_id}",
      purpose:
        "Rechercher une session à partir d'un identifiant de transaction.",
      sourceUrl: "https://docs.wave.com/checkout",
      rules: [
        "Utiliser le paramètre transaction_id documenté.",
        "Ne pas imposer un format d'identifiant non confirmé par la documentation.",
      ],
    },

    searchByClientReference: {
      method: "GET",
      path: "documented_endpoint",
      purpose: "Rechercher les sessions à partir de client_reference.",
      sourceUrl: "https://docs.wave.com/checkout",
      rules: [
        "Consulter la documentation officielle pour le chemin exact et les paramètres acceptés.",
        "Ne pas transformer cette valeur descriptive en URL d'endpoint inventée.",
      ],
    },

    expireCheckoutSession: {
      method: "POST",
      path: "documented_endpoint",
      purpose: "Demander l'expiration d'une session Checkout.",
      sourceUrl: "https://docs.wave.com/checkout",
      rules: [
        "Vérifier le chemin et les paramètres exacts dans la documentation officielle avant l'implémentation.",
        "Traiter les erreurs HTTP documentées sans supposer que l'opération réussira dans tous les états.",
      ],
    },

    refund: {
      method: "POST",
      path: "documented_endpoint",
      purpose:
        "Demander le remboursement d'une transaction lorsque cette opération est disponible.",
      sourceUrl: "https://docs.wave.com/checkout",
      rules: [
        "Vérifier le chemin exact et les paramètres du remboursement dans la documentation officielle.",
        "Ne pas inventer une réponse JSON si la documentation indique un corps vide.",
        "Traiter le remboursement comme une opération distincte du parcours Checkout initial.",
      ],
    },

    endpointRules: [
      "Les chemins indiqués comme documented_endpoint doivent être récupérés depuis la documentation officielle avant de générer une implémentation finale.",
      "Ne pas appeler un endpoint supposé ou déduit du nom d'une opération.",
      "Utiliser https://api.wave.com comme base URL documentée.",
      "Ne pas inventer de route locale Next.js et la présenter comme un endpoint Wave.",
    ],
  },

  checkoutSession: {
    fields: {
      amount: {
        type: "string",
        description: "Montant de la session Checkout.",
      },

      currency: {
        type: "string",
        expectedValue: "XOF",
        description: "Devise utilisée pour le paiement.",
      },

      client_reference: {
        type: "string",
        maxLength: 255,
        description:
          "Référence fournie par le marchand pour retrouver et associer la session à une commande.",
      },

      success_url: {
        type: "string",
        requirement: "HTTPS",
        description:
          "URL de retour après le parcours Checkout. Elle ne remplace pas la vérification du paiement côté serveur.",
      },

      error_url: {
        type: "string",
        requirement: "HTTPS",
        description: "URL de retour prévue pour le parcours d'erreur.",
      },

      when_expires: {
        type: "string",
        description:
          "Paramètre à consulter pour configurer l'expiration lorsque cette possibilité est nécessaire.",
      },

      restrict_payer_mobile: {
        type: "documented_by_wave",
        description:
          "Paramètre permettant de restreindre le numéro de téléphone du payeur lorsque ce comportement est requis.",
      },

      aggregated_merchant_id: {
        type: "string",
        requirement: "required_for_aggregators",
        description:
          "Identifiant requis pour les agrégateurs dans le cas décrit par la documentation.",
      },
    },

    statuses: {
      checkout: ["open", "complete", "expired"],
      payment: ["processing", "cancelled", "succeeded"],
    },

    expiry: {
      documentationNotes:
        "La documentation évoque une expiration par défaut de 30 minutes, mais les exemples ne sont pas entièrement cohérents sur ce point.",

      recommendation:
        "Ne pas supposer une durée exacte sans vérifier la réponse réelle de l'API. Utiliser le champ d'expiration documenté lorsqu'il est disponible.",

      useActualExpiry:
        "S'appuyer sur la valeur renvoyée par l'API plutôt que de calculer arbitrairement une expiration.",
    },

    rules: [
      "Le montant doit être validé côté serveur avant la création de la session.",
      "Le prix envoyé à Wave doit provenir d'une source fiable côté serveur, et non d'une valeur frontend acceptée sans validation.",
      "Ne jamais confirmer une commande uniquement parce que l'utilisateur revient sur success_url.",
      "Vérifier l'état réel du paiement côté serveur avant de marquer une commande comme payée.",
      "Conserver une référence de commande permettant de rapprocher la session du paiement.",
      "Ne pas considérer client_reference comme un secret ou comme une preuve de paiement.",
    ],

    sourceUrl: "https://docs.wave.com/checkout",
  },

  amounts: {
    currency: "XOF",

    decimalPlaces: 0,

    examples: {
      validXof: ["1", "1000"],
    },

    rules: [
      "Pour XOF, ne pas envoyer de décimales.",
      "Respecter le type et le format de montant documentés par Wave.",
      "Valider le montant côté serveur avant d'appeler l'API.",
      "Ne pas inventer de montant minimum ou maximum sans source officielle applicable au compte marchand.",
      "Ne pas convertir ou arrondir silencieusement un montant de manière à modifier le prix attendu.",
    ],

    sourceUrl: "https://docs.wave.com/checkout",
  },

  webhooks: {
    purpose:
      "Recevoir les événements serveur envoyés par Wave afin de suivre l'évolution réelle des paiements.",

    endpoint: {
      method: "POST",
      requirement: "HTTPS",
      responseDeadlineSeconds: 5,

      rules: [
        "Créer un endpoint serveur accessible par Wave.",
        "Répondre rapidement avec un statut HTTP 2xx lorsque l'événement a été accepté et enregistré de manière fiable.",
        "Si un traitement métier prend du temps, envisager de le traiter de manière asynchrone après l'enregistrement fiable de l'événement.",
        "Ne pas répondre positivement avant d'avoir accepté l'événement de façon suffisamment fiable pour éviter sa perte.",
      ],
    },

    authentication: {
      strategies: [
        {
          id: "shared_secret",
          name: "Secret partagé dans Authorization",
          description:
            "La documentation décrit une stratégie utilisant un secret partagé dans l'en-tête Authorization.",
          header: "Authorization",
          format: "Bearer <WEBHOOK_SECRET>",
          rules: [
            "Utiliser cette stratégie uniquement si elle est configurée pour le webhook concerné.",
            "Conserver le secret côté serveur.",
            "Comparer les informations d'authentification de manière sûre.",
          ],
          sourceUrl: "https://docs.wave.com/webhook",
        },

        {
          id: "hmac_signature",
          name: "Signature HMAC",
          description:
            "La documentation décrit une stratégie de signature HMAC recommandée pour la sécurité en production.",
          algorithm: "HMAC-SHA256",
          header: "Wave-Signature",
          format: "t=<timestamp>,v1=<signature>",
          payload: "timestamp + raw HTTP request body",

          timestampValidation: {
            rejectOlderThanSeconds: 300,
            futureTolerance: "not_specified_here",
          },

          rules: [
            "Lire le corps brut de la requête lorsque le calcul de signature l'exige.",
            "Reproduire exactement le calcul de signature décrit dans la documentation officielle.",
            "Vérifier la signature avant de faire confiance au contenu du webhook.",
            "Rejeter les signatures invalides.",
            "Appliquer la fenêtre temporelle documentée pour les webhooks.",
            "Ne pas copier automatiquement la tolérance future de 30 secondes de la signature des requêtes API.",
          ],

          sourceUrl: "https://docs.wave.com/webhook",
        },
      ],

      rules: [
        "Choisir la stratégie correspondant à la configuration réelle du webhook.",
        "Ne pas supposer que les deux stratégies doivent être activées simultanément.",
        "Ne pas accepter un événement comme authentique uniquement parce que son corps ressemble à un événement Wave.",
      ],
    },

    eventStatuses: {
      checkoutCompletedExample: {
        checkout_status: "complete",
        payment_status: "succeeded",
      },

      paymentFailedExample: {
        checkout_status: "failed",
        payment_status: "failed",
      },

      note: "Ces exemples d'événements sont séparés des statuts documentés de l'objet Checkout Session. Ne pas fusionner les deux ensembles de statuts.",

      sourceUrl: "https://docs.wave.com/webhook",
    },

    paymentErrors: {
      field: "last_payment_error",

      note: "La documentation contient une incohérence entre les statuts d'un exemple payment_failed et la description de last_payment_error. Ne pas déduire une règle générale à partir de ce seul exemple.",

      rules: [
        "Traiter last_payment_error selon le type d'événement et le contenu réellement reçu.",
        "Ne pas supposer que ce champ est toujours présent.",
        "Ne pas inventer de codes d'erreur ni de messages absents de la documentation.",
      ],
    },

    delivery: {
      expectedResponseDeadlineSeconds: 5,
      successStatusCodes: "2xx",
      retryPeriod: "up to 3 days",

      deliveryCharacteristics: [
        "Des événements peuvent être livrés plusieurs fois.",
        "Des événements peuvent arriver dans le désordre.",
        "Des événements peuvent manquer et nécessiter une vérification de l'état auprès de l'API.",
      ],

      rules: [
        "Gérer les événements dupliqués de manière idempotente.",
        "Utiliser l'identifiant de l'événement pour éviter de traiter plusieurs fois le même événement.",
        "Ne pas supposer que les événements arrivent dans l'ordre chronologique.",
        "Si l'état d'un paiement est incertain, vérifier l'état réel via l'API lorsque cela est possible.",
        "Ne pas marquer une commande comme payée sur la seule base d'un retour navigateur.",
        "Enregistrer suffisamment d'informations pour diagnostiquer les événements et les erreurs de traitement.",
      ],

      sourceUrl: "https://docs.wave.com/webhook",
    },

    ipAllowlist: {
      appliesTo: "incoming_wave_webhooks",

      status: "check_current_official_documentation",

      rules: [
        "Distinguer les IP sources des webhooks Wave des IP autorisées à effectuer des appels API vers Wave.",
        "Si une liste d'IP est utilisée, récupérer les valeurs actuelles depuis la documentation officielle.",
        "Ne pas réutiliser une liste d'IP ancienne sans la vérifier.",
        "Ne pas inventer d'adresses IP.",
      ],

      sourceUrl: "https://docs.wave.com/webhook",
    },
  },

  errors: {
    categories: [
      {
        id: "http_authentication",
        name: "Authentification et autorisations",
        origin: "HTTP API response",
        examples: [
          "Clé API absente ou invalide.",
          "Permissions insuffisantes.",
          "Adresse IP non autorisée lorsque la restriction IP est activée.",
        ],
        rules: [
          "Vérifier le statut HTTP et le contenu de la réponse.",
          "Ne pas traiter une erreur d'authentification comme un échec de paiement.",
          "Ne pas exposer de clé API dans les logs ou les messages destinés à l'utilisateur.",
        ],
        sourceUrl: "https://docs.wave.com/checkout",
      },

      {
        id: "checkout_api_error",
        name: "Erreur de l'API Checkout",
        origin: "Checkout API response",
        errorField: "error_code",
        rules: [
          "Utiliser les codes réellement retournés et documentés.",
          "Distinguer les erreurs de requête, de permission et d'état de ressource.",
          "Ne pas inventer de codes d'erreur ou leur attribuer un sens non documenté.",
        ],
        sourceUrl: "https://docs.wave.com/checkout",
      },

      {
        id: "payment_error",
        name: "Erreur de paiement",
        origin: "Webhook event",
        errorField: "last_payment_error",
        rules: [
          "Traiter séparément l'erreur de paiement et l'erreur HTTP de l'API.",
          "Vérifier le type d'événement et les champs effectivement présents.",
          "Ne pas supposer qu'un champ optionnel est toujours renseigné.",
        ],
        sourceUrl: "https://docs.wave.com/webhook",
      },
    ],

    generalRules: [
      "Conserver les informations utiles pour le diagnostic sans enregistrer de secrets.",
      "Ne pas afficher directement des détails techniques sensibles à l'utilisateur final.",
      "Ne pas assimiler un timeout à un paiement échoué : vérifier l'état réel avant de décider.",
      "Ne pas relancer aveuglément une opération financière si son résultat est incertain.",
    ],
  },

  integrationWorkflow: [
    {
      step: 1,
      title: "Vérifier les prérequis",
      tasks: [
        "Confirmer que le marchand possède un compte et les autorisations nécessaires.",
        "Confirmer que Checkout est disponible pour le compte et le pays concernés.",
        "Récupérer les informations officielles nécessaires à l'intégration.",
      ],
    },

    {
      step: 2,
      title: "Préparer la configuration serveur",
      tasks: [
        "Configurer les secrets dans l'environnement serveur.",
        "Ne pas exposer les clés dans le frontend.",
        "Préparer une route serveur adaptée au framework du projet.",
      ],
    },

    {
      step: 3,
      title: "Créer la session Checkout",
      tasks: [
        "Valider le prix et la commande côté serveur.",
        "Envoyer la requête documentée vers l'API Wave.",
        "Traiter les erreurs et valider la réponse reçue.",
        "Associer la session à la commande interne.",
      ],
    },

    {
      step: 4,
      title: "Gérer le parcours utilisateur",
      tasks: [
        "Utiliser l'URL Checkout réellement retournée par l'API.",
        "Gérer les retours utilisateur sans les considérer comme une preuve de paiement.",
        "Prévoir un comportement explicite pour les erreurs et les interruptions.",
      ],
    },

    {
      step: 5,
      title: "Configurer les webhooks",
      tasks: [
        "Créer un endpoint HTTPS accessible depuis Wave.",
        "Valider l'authenticité des événements avec la stratégie configurée.",
        "Enregistrer les événements et gérer les doublons.",
        "Traiter les événements de manière robuste face aux retards et au désordre.",
      ],
    },

    {
      step: 6,
      title: "Confirmer le paiement",
      tasks: [
        "Vérifier l'état réel du paiement.",
        "Vérifier la correspondance entre le paiement et la commande.",
        "Ne confirmer la commande qu'après validation côté serveur.",
        "Rendre le traitement idempotent afin d'éviter les doubles confirmations.",
      ],
    },

    {
      step: 7,
      title: "Tester et diagnostiquer",
      tasks: [
        "Tester les réponses API et les erreurs possibles.",
        "Tester les webhooks dupliqués et les interruptions de traitement.",
        "Ne pas inventer de sandbox ou de scénario de test non documenté.",
        "Documenter les limites ou les prérequis qui restent à confirmer.",
      ],
    },
  ],

  architectureRecommendations: {
    framework: "Next.js App Router",

    note: "Les chemins ci-dessous sont des exemples d'architecture applicative, pas des endpoints de l'API Wave.",

    suggestedServerResponsibilities: [
      "Créer une session Checkout côté serveur.",
      "Valider les données de commande et les montants.",
      "Recevoir et authentifier les webhooks.",
      "Vérifier l'état du paiement.",
      "Mettre à jour la commande de manière idempotente.",
    ],

    suggestedRoutes: [
      {
        path: "/api/payments/wave/checkout",
        purpose:
          "Exemple de route locale pour créer une session Checkout depuis le serveur.",
        status: "suggestion",
      },
      {
        path: "/api/webhooks/wave",
        purpose: "Exemple de route locale pour recevoir les webhooks Wave.",
        status: "suggestion",
      },
    ],

    securityRules: [
      "Ne jamais placer la clé API dans un composant client.",
      "Ne jamais faire confiance au montant transmis sans validation serveur.",
      "Ne jamais utiliser success_url comme preuve de paiement.",
      "Vérifier les webhooks avant d'exécuter des actions métier.",
      "Éviter les doubles traitements des paiements et des commandes.",
      "Ne pas journaliser les secrets ou les données sensibles inutiles.",
    ],
  },

  limitations: [
    {
      topic: "merchant_country_eligibility",
      status: "requires_merchant_confirmation",
      reason:
        "Le pays cible du projet ne suffit pas à garantir l'éligibilité d'un compte marchand.",
    },
    {
      topic: "sandbox",
      status: "not_confirmed",
      reason: "Ne pas inventer une URL ou un environnement de test.",
    },
    {
      topic: "webhook_future_timestamp_tolerance",
      status: "not_confirmed",
      reason:
        "Ne pas transférer automatiquement la règle temporelle des signatures API aux signatures webhook.",
    },
    {
      topic: "session_statuses_vs_event_statuses",
      status: "documented_examples_need_separation",
      reason:
        "Les exemples d'événements webhook ne doivent pas être utilisés pour remplacer les statuts de l'objet session.",
    },
    {
      topic: "some_endpoint_details",
      status: "must_be_checked_before_implementation",
      reason:
        "Le chemin et les paramètres exacts de chaque opération doivent être repris de la documentation officielle avant de générer le code final.",
    },
  ],

  aiIntegrationPolicy: {
    objective:
      "Aider un développeur utilisant un agent de programmation à intégrer Wave Checkout dans un projet existant, étape par étape.",

    rules: [
      "Analyser le projet existant avant de proposer des modifications.",
      "Identifier le framework, la structure des fichiers, les conventions et les dépendances déjà utilisées.",
      "Fournir un prompt précis et directement exploitable par l'agent de programmation.",
      "Distinguer les faits documentés, les recommandations d'architecture et les éléments qui nécessitent une confirmation.",
      "Associer les affirmations techniques importantes à une source officielle lorsqu'elle est disponible.",
      "Ne jamais inventer d'endpoint, de paramètre, de code d'erreur, de secret, de clé, d'URL sandbox ou de capacité produit.",
      "Ne pas prétendre qu'un code a été testé si aucun test n'a été exécuté.",
      "Ne pas affirmer qu'une intégration fonctionne en production sans preuve.",
      "Ne pas remplacer le projet existant par une nouvelle architecture sans nécessité.",
      "Adapter le code généré au projet réel plutôt que d'imposer des chemins de fichiers arbitraires.",
      "Demander une confirmation lorsque le compte marchand, les permissions ou une fonctionnalité ne sont pas vérifiables.",
      "Signaler explicitement toute information contradictoire dans la documentation.",
    ],

    confidenceLevels: {
      documented:
        "Information présente dans la documentation officielle référencée.",
      tested:
        "Comportement effectivement testé dans un environnement identifié.",
      recommended:
        "Recommandation d'implémentation qui ne doit pas être présentée comme une exigence Wave.",
      requiresConfirmation:
        "Information à confirmer auprès de la documentation actuelle ou du marchand.",
      notConfirmed:
        "Information insuffisamment vérifiée pour être utilisée comme un fait.",
    },
  },
} as const;
