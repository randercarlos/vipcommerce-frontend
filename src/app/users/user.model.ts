import { Person } from './person.model';
import { Picture } from './picture.model';
import { Location } from './location.model';

export interface User {
  uuid: string;
  username: string;
  person: Person;
  location: Location;
  picture: Picture;
  created_at: Date;
  updated_at: Date;
}
