# Inventory Service

Microservice de gestion des événements et des réservations de places en mémoire. Gère le cycle de vie d'une réservation : création temporaire (`pending`), confirmation (`confirmed`) ou libération.

## Démarrage

```bash
npm install
cp .env.example .env
npm run dev   # ou npm start
```

Le service écoute sur le port **3001**.

## Configuration

| Variable | Description | Défaut |
| --- | --- | --- |
| `HOST_TOKEN` | Jeton partagé requis pour authentifier les appels inter-services | `tp-secret-host-token` |

## Authentification

Toutes les routes (hors `/` et `/api-docs`) nécessitent l'en-tête `X-Host-Token` correspondant à `HOST_TOKEN`. Une réponse `401` est renvoyée si le jeton est manquant ou invalide.

## Routes

| Méthode | Route | Description |
| --- | --- | --- |
| GET | `/events` | Liste tous les événements |
| GET | `/events/:id` | Récupère un événement par id (`400` si id invalide, `404` si introuvable) |
| POST | `/events/:id/reservations` | Réserve temporairement une place (`409` si plus de place disponible) |
| POST | `/reservations/:id/confirm` | Confirme définitivement une réservation `pending` (`409` sinon) |
| DELETE | `/reservations/:id` | Libère une réservation `pending` et restitue la place (`409` si elle n'est pas `pending`) |

## Documentation API

La documentation Swagger est disponible sur `/api-docs` une fois le service démarré.
