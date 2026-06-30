export interface Event {
  id: number;
  name: string;
  availableSeats: number;
}

export type ReservationStatus = "pending" | "confirmed";

export interface Reservation {
  id: number;
  eventId: number;
  status: ReservationStatus;
}