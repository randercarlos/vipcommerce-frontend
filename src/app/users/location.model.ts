export interface Location {
  uuid: string;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  latitude: string;
  longitude: string;
  timezone_offset: string;
  timezone_description: string;
  person_uuid: string;
  created_at: Date;
  updated_at: Date;
}
