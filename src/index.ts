import express from "express";
import { events } from "./models/eventModel.js";
import { reservations, createReservation } from "./models/reservationModel.js";

const app = express();

app.get("/", (_req, res) => {
  res.send("Inventory Service");
});

// Consultation des événements
app.get("/events", (_req, res) => {
  res.json(events);
});

app.get("/events/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid event id" });
  }

  const event = events.find((e) => e.id === id);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  res.json(event);
});

// Réservation temporaire d'une place
app.post("/events/:id/reservations", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid event id" });
  }

  const event = events.find((e) => e.id === id);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  if (event.availableSeats <= 0) {
    return res.status(409).json({ error: "No seats available" });
  }

  event.availableSeats -= 1;
  const reservation = createReservation(event.id);
  res.status(201).json(reservation);
});

// Confirmation définitive d'une réservation
app.post("/reservations/:id/confirm", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid reservation id" });
  }

  const reservation = reservations.find((r) => r.id === id);
  if (!reservation) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  if (reservation.status !== "pending") {
    return res.status(409).json({ error: "Reservation is not pending" });
  }

  reservation.status = "confirmed";
  res.json(reservation);
});

// Libération d'une place
app.delete("/reservations/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid reservation id" });
  }

  const index = reservations.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  const [reservation] = reservations.splice(index, 1);
  const event = events.find((e) => e.id === reservation!.eventId);
  if (event) {
    event.availableSeats += 1;
  }

  res.status(204).send();
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});