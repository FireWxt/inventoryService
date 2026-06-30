import type { Reservation } from "../types.js";

export const reservations: Reservation[] = [];

let nextId = 1;

export function createReservation(eventId: number): Reservation {
  const reservation: Reservation = { id: nextId++, eventId, status: "pending" };
  reservations.push(reservation);
  return reservation;
}