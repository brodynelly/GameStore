export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Optional to exclude when storing in localStorage
}