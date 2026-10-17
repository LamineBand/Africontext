/**
 * docs/sms-gateway.ts
 *
 * Fiche technique SMS pour AfriContext.
 *
 * Fournisseurs à distinguer :
 * - SMSPro Africa : https://smspro.africa/developers/api-sms
 * - SMS Africa : https://docs.sms.africa/
 *
 * IMPORTANT :
 * Les endpoints, paramètres et mécanismes d'authentification exacts
 * doivent être confirmés dans la documentation technique du fournisseur
 * choisi ou auprès de son support.
 *
 * Cette fiche ne prétend pas qu'un appel API a été testé.
 * Aucune clé secrète réelle ne doit être stockée dans ce fichier.
 */

export const smsGatewayKnowledge = {
  provider: "SMS Gateway",
  product: "SMS Outbound, OTP & Delivery Reports",

  metadata: {
    purpose:
      "Aider les développeurs à intégrer l'envoi de SMS et les rapports de livraison dans une application.",

    supportedProviders: [
      {
        name: "SMSPro Africa",
        website: "https://smspro.africa/",
        apiDocumentation: "https://smspro.africa/developers/api-sms",
        documentationStatus:
          "Le site public présente les services SMS et l'accès API, mais les détails techniques des endpoints restent à confirmer.",
      },
      {
        name: "SMS Africa",
        website: "https://docs.sms.africa/",
        apiDocumentation: "https://docs.sms.africa/",
        documentationStatus:
          "Documentation technique à consulter avant de définir les requêtes exactes.",
      },
    ],

    lastReviewed: "2026-10-14",

    warning:
      "Ne pas mélanger les configurations de plusieurs fournisseurs. Chaque fournisseur peut avoir sa propre API, ses propres identifiants et ses propres statuts.",
  },

  country: {
    name: "Côte d'Ivoire",
    isoCode: "CI",
    callingCode: "+225",

    phoneNumberFormat: {
      recommended: "E.164",
      example: "+2250700000000",
      notes: [
        "Valider le numéro selon le plan de numérotation applicable.",
        "Ne pas ajouter automatiquement l'indicatif si le numéro le contient déjà.",
        "Vérifier le format exact accepté par l'API du fournisseur.",
      ],
    },
  },

  configuration: {
    provider: {
      environmentVariable: "SMS_PROVIDER",
      exampleValue: "smspro",
      allowedValues: ["smspro", "sms_africa"],
      note: "Ces valeurs sont des choix internes à l'application AfriContext, pas des valeurs imposées par les fournisseurs.",
    },

    baseUrl: {
      environmentVariable: "SMS_API_BASE_URL",
      defaultValue: null,
      note: "Renseigner la base URL exacte indiquée par la documentation du fournisseur sélectionné. Ne pas supposer qu'elle se termine par /v1.",
    },

    apiKey: {
      environmentVariable: "SMS_API_KEY",
      secretMustRemainServerSide: true,
    },

    apiSecret: {
      environmentVariable: "SMS_API_SECRET",
      requiredOnlyIfProviderUsesIt: true,
      secretMustRemainServerSide: true,
    },

    accountId: {
      environmentVariable: "SMS_ACCOUNT_ID",
      requiredOnlyIfProviderUsesIt: true,
    },

    senderId: {
      environmentVariable: "SMS_SENDER_ID",
      description: "Nom ou identifiant expéditeur validé par le fournisseur.",
      approvalMayBeRequired: true,
    },

    webhookSecret: {
      environmentVariable: "SMS_WEBHOOK_SECRET",
      requiredOnlyIfProviderSupportsIt: true,
    },
  },

  authentication: {
    confirmedForSelectedProvider: false,

    possiblePatterns: [
      "Clé API dans un en-tête HTTP dédié.",
      "Identifiant de compte et clé API dans plusieurs en-têtes.",
      "Jeton Bearer si le fournisseur le documente.",
      "Authentification par identifiants de compte si le fournisseur le documente.",
    ],

    rule: "Ces possibilités ne sont pas interchangeables. Utiliser exclusivement la méthode décrite dans la documentation du fournisseur sélectionné.",

    doNotAssume: [
      "Authorization: Bearer <API_KEY>",
      "api-key: <API_KEY>",
      "user-id: <USER_ID>",
    ],

    security: [
      "Ne jamais exposer une clé API dans un composant client React.",
      "Ne pas utiliser de variable NEXT_PUBLIC_ pour une clé secrète.",
      "Conserver les identifiants dans les variables d'environnement du serveur.",
      "Ne jamais enregistrer une clé secrète dans les journaux de requêtes.",
    ],
  },

  endpoints: {
    sendSms: {
      method: "POST",

      path: null,

      pathStatus:
        "À confirmer dans la documentation officielle du fournisseur sélectionné.",

      purpose: "Envoyer un SMS transactionnel, une notification ou un OTP.",

      requiredFields: null,

      optionalFields: null,

      requestSchemaStatus:
        "Ne pas générer le corps de la requête définitif tant que les noms des champs n'ont pas été vérifiés.",

      conceptualFields: {
        recipient:
          "Numéro de téléphone du destinataire au format accepté par le fournisseur.",

        message: "Contenu textuel du SMS.",

        sender:
          "Expéditeur validé, si le fournisseur demande ce champ dans la requête.",

        messageType:
          "Type transactionnel ou marketing uniquement si cette distinction est prise en charge par l'API.",

        scheduledAt:
          "Date de programmation uniquement si la programmation est prise en charge par l'API.",
      },

      expectedResponseFields: null,

      responseNote:
        "Le nom de l'identifiant du message, le format de succès et les erreurs doivent être confirmés dans la documentation officielle.",

      examplePayloadStatus:
        "Aucun corps JSON présenté ici comme requête réelle : les champs génériques ne constituent pas un schéma API confirmé.",
    },

    getBalance: {
      method: "GET",

      path: null,

      availability: "À confirmer",

      purpose:
        "Consulter les crédits ou le solde du compte, si le fournisseur expose cette fonctionnalité par API.",

      responseSchema: null,

      note: "Ne pas supposer qu'un endpoint /user/balance existe chez les deux fournisseurs.",
    },

    getMessageStatus: {
      method: null,

      path: null,

      availability: "À confirmer",

      purpose:
        "Récupérer le statut d'un SMS à partir de son identifiant, si cette fonctionnalité est disponible.",

      note: "Vérifier si le fournisseur propose une consultation par API, des DLR par webhook, ou les deux.",
    },

    deliveryReports: {
      availability: "À confirmer",

      purpose:
        "Recevoir les mises à jour de livraison lorsque le fournisseur et l'opérateur les rendent disponibles.",

      webhookMethod: null,

      webhookPayload: null,

      signatureHeader: null,

      security:
        "Ne pas inventer le nom de l'en-tête de signature ni considérer un webhook comme authentique sans appliquer la méthode de vérification documentée.",
    },
  },

  smsEncoding: {
    gsm7: {
      encoding: "GSM-7",

      singleSegmentCharacters: 160,

      concatenatedSegmentCharacters: 153,

      notes: [
        "Les caractères disponibles dépendent de l'alphabet GSM utilisé.",
        "Certains caractères de l'alphabet étendu occupent deux unités.",
        "Le nombre de segments peut dépendre de l'encodage et du fournisseur.",
      ],
    },

    unicode: {
      encoding: "UCS-2 ou encodage Unicode pris en charge",

      singleSegmentCharacters: 70,

      concatenatedSegmentCharacters: 67,

      notes: [
        "Les émojis et certains caractères non présents dans l'alphabet GSM peuvent nécessiter un encodage Unicode.",
        "Les accents français ne provoquent pas tous systématiquement un passage à Unicode : cela dépend du caractère exact.",
        "La longueur réelle doit être calculée selon l'encodage, et non uniquement avec JavaScript String.length.",
      ],
    },

    billingWarning:
      "Le nombre de crédits facturés dépend de l'encodage, du nombre de segments et des règles tarifaires du fournisseur. Ne pas supposer qu'un message correspond toujours à un seul crédit.",
  },

  otp: {
    recommendedUseCases: [
      "Vérification d'un numéro de téléphone.",
      "Confirmation d'une opération sensible.",
      "Authentification lorsque ce mécanisme est approprié.",
    ],

    securityRules: [
      "Générer le code côté serveur avec un générateur cryptographiquement sûr.",
      "Associer le code à une finalité et à un destinataire précis.",
      "Définir une durée de validité limitée.",
      "Limiter le nombre de tentatives de validation.",
      "Limiter la fréquence d'envoi pour éviter les abus et les dépenses inattendues.",
      "Ne jamais enregistrer un OTP en clair dans les journaux.",
      "Invalider le code après validation ou expiration.",
      "Ne pas retourner l'OTP dans la réponse HTTP destinée au navigateur.",
    ],

    messageExample:
      "Votre code de vérification est : 482913. Il expire dans 5 minutes.",

    exampleWarning:
      "Ce texte est un exemple de contenu SMS, pas un format de requête propre à un fournisseur.",
  },

  deliveryStatuses: {
    providerSpecific: true,

    normalizedInternalStatuses: [
      "queued",
      "sent",
      "delivered",
      "failed",
      "expired",
      "unknown",
    ],

    mappingRule:
      "Ces statuts sont une convention interne possible pour AfriContext. Il faut créer un mapping à partir des statuts réellement documentés par chaque fournisseur.",

    importantDistinction: [
      "Une requête acceptée par l'API ne signifie pas que le SMS a été livré.",
      "Un SMS envoyé au réseau n'est pas nécessairement livré au téléphone.",
      "Un rapport de livraison peut être indisponible, tardif ou incomplet selon le fournisseur et l'opérateur.",
    ],
  },

  nextJsArchitecture: {
    recommendedFiles: [
      {
        path: "lib/sms/types.ts",
        purpose:
          "Définir les types internes communs pour les destinataires, les messages et les résultats d'envoi.",
      },
      {
        path: "lib/sms/providers/smspro.ts",
        purpose:
          "Implémenter l'adaptateur SMSPro à partir de sa documentation officielle confirmée.",
      },
      {
        path: "lib/sms/providers/sms-africa.ts",
        purpose:
          "Implémenter séparément l'adaptateur SMS Africa si ce fournisseur est choisi.",
      },
      {
        path: "lib/sms/index.ts",
        purpose: "Exposer une fonction serveur commune, par exemple sendSms().",
      },
      {
        path: "app/api/sms/send/route.ts",
        purpose:
          "Valider la demande, appliquer les limites de fréquence et appeler le fournisseur côté serveur.",
      },
      {
        path: "app/api/webhooks/sms/route.ts",
        purpose:
          "Recevoir les rapports de livraison si le fournisseur prend en charge les webhooks.",
      },
    ],

    sendSmsConcept: {
      functionName: "sendSms",

      conceptualInput: {
        to: "+2250700000000",
        message: "Votre commande est confirmée.",
      },

      conceptualOutput: {
        success: true,
        provider: "smspro",
        messageId: null,
        status: "queued",
      },

      warning:
        "Ce format est un contrat interne proposé pour AfriContext. Il ne représente pas la réponse native de SMSPro ou de SMS Africa.",
    },

    securityRecommendations: [
      "Appliquer un rate limiting par utilisateur, IP et destinataire selon le cas d'usage.",
      "Ajouter des quotas et des plafonds de dépenses.",
      "Empêcher l'envoi à des listes arbitraires de numéros sans contrôle d'autorisation.",
      "Vérifier que l'utilisateur est autorisé à déclencher l'envoi.",
      "Valider la longueur du message et les numéros côté serveur.",
      "Utiliser une clé d'idempotence interne si le client peut répéter une demande.",
      "Ne pas exposer le solde, les identifiants ou les réponses brutes du fournisseur sans nécessité.",
      "Conserver les identifiants de message et les événements utiles à l'audit sans stocker inutilement de données personnelles.",
    ],
  },

  integrationWorkflow: [
    "1. Choisir explicitement SMSPro Africa ou SMS Africa.",
    "2. Consulter la documentation API propre à ce fournisseur et confirmer la version utilisée.",
    "3. Confirmer la base URL, la méthode d'authentification, les endpoints et les schémas de requête/réponse.",
    "4. Créer les variables d'environnement côté serveur.",
    "5. Implémenter l'adaptateur du fournisseur sans exposer les identifiants au navigateur.",
    "6. Tester les cas de succès, d'erreur, de numéro invalide et de crédits insuffisants si ces erreurs sont documentées.",
    "7. Configurer les rapports de livraison uniquement si leur protocole est confirmé.",
    "8. Déployer après validation des tests et des conditions du compte marchand.",
  ],

  officialSources: [
    {
      name: "SMSPro Africa — API SMS",
      url: "https://smspro.africa/developers/api-sms",
      note: "Page de référence à consulter pour confirmer les endpoints et les champs API.",
    },
    {
      name: "SMSPro Africa — site officiel",
      url: "https://smspro.africa/",
      note: "Présentation des services SMS, des notifications et des rapports de livraison.",
    },
    {
      name: "SMS Africa — documentation",
      url: "https://docs.sms.africa/",
      note: "Documentation distincte à vérifier si ce fournisseur est sélectionné.",
    },
  ],

  aiIntegrationPolicy: [
    "Ne jamais inventer un endpoint, un header, un champ JSON ou un format de réponse.",
    "Ne jamais considérer SMSPro Africa et SMS Africa comme une seule API sans preuve documentaire.",
    "Utiliser les noms exacts des champs dans la documentation officielle du fournisseur choisi.",
    "Distinguer les fonctionnalités confirmées des fonctionnalités à vérifier.",
    "Ne jamais prétendre qu'un envoi a été testé en production sans preuve.",
    "Générer une implémentation Next.js étape par étape et expliquer les fichiers créés.",
    "Protéger les clés API et limiter les abus d'envoi de SMS.",
  ],
} as const;
