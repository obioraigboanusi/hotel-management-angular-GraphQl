export interface Listing {
  _id: string;
  listing_title: string;
  description: string;
  postal_code: string;
  city: string;
  street: string;
  price: string;
}
export interface Booking {
  _id: string;
  booking_date: string;
  booking_start: string;
  booking_end: string;
  username: string;
  listing_id: String;
}
