import { UserRole } from "../types/userRole";

export interface IUserEntity {
  id: string;
  name: string;
  email: string;
  imagePath: string;
  role: UserRole;
}
