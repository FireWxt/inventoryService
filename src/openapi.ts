export const openapiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Inventory Service",
    version: "1.0.0",
    description:
      "API de gestion des événements et des réservations de places.",
  },
  servers: [{ url: "http://localhost:3001" }],
  security: [{ HostToken: [] }],
  paths: {
    "/events": {
      get: {
        summary: "Lister les événements",
        tags: ["Events"],
        responses: {
          "200": {
            description: "Liste des événements",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Event" },
                },
              },
            },
          },
          "401": { description: "Jeton inter-services manquant ou invalide" },
        },
      },
    },
    "/events/{id}": {
      get: {
        summary: "Consulter un événement",
        tags: ["Events"],
        parameters: [{ $ref: "#/components/parameters/EventId" }],
        responses: {
          "200": {
            description: "Événement trouvé",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Event" },
              },
            },
          },
          "400": { description: "Identifiant invalide" },
          "401": { description: "Jeton inter-services manquant ou invalide" },
          "404": { description: "Événement non trouvé" },
        },
      },
    },
    "/events/{id}/reservations": {
      post: {
        summary: "Réserver temporairement une place",
        tags: ["Reservations"],
        parameters: [{ $ref: "#/components/parameters/EventId" }],
        responses: {
          "201": {
            description: "Réservation créée (statut pending)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Reservation" },
              },
            },
          },
          "400": { description: "Identifiant invalide" },
          "401": { description: "Jeton inter-services manquant ou invalide" },
          "404": { description: "Événement non trouvé" },
          "409": { description: "Plus de places disponibles" },
        },
      },
    },
    "/reservations/{id}/confirm": {
      post: {
        summary: "Confirmer définitivement une réservation",
        tags: ["Reservations"],
        parameters: [{ $ref: "#/components/parameters/ReservationId" }],
        responses: {
          "200": {
            description: "Réservation confirmée",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Reservation" },
              },
            },
          },
          "400": { description: "Identifiant invalide" },
          "401": { description: "Jeton inter-services manquant ou invalide" },
          "404": { description: "Réservation non trouvée" },
          "409": { description: "Réservation non pending" },
        },
      },
    },
    "/reservations/{id}": {
      delete: {
        summary: "Annuler une réservation temporaire / libérer une place",
        tags: ["Reservations"],
        parameters: [{ $ref: "#/components/parameters/ReservationId" }],
        responses: {
          "204": { description: "Place libérée" },
          "400": { description: "Identifiant invalide" },
          "401": { description: "Jeton inter-services manquant ou invalide" },
          "404": { description: "Réservation non trouvée" },
          "409": {
            description:
              "Seule une réservation au statut pending peut être libérée",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      HostToken: {
        type: "apiKey",
        in: "header",
        name: "X-Host-Token",
        description: "Jeton partagé entre les microservices",
      },
    },
    parameters: {
      EventId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "integer" },
        description: "Identifiant de l'événement",
      },
      ReservationId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "integer" },
        description: "Identifiant de la réservation",
      },
    },
    schemas: {
      Event: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Concert" },
          availableSeats: { type: "integer", example: 50 },
        },
        required: ["id", "name", "availableSeats"],
      },
      Reservation: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          eventId: { type: "integer", example: 1 },
          status: {
            type: "string",
            enum: ["pending", "confirmed"],
            example: "pending",
          },
        },
        required: ["id", "eventId", "status"],
      },
    },
  },
};
