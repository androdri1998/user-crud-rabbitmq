import { UserData } from "../services/dto/CreateUserService.dto";

export enum UserStatus {
  ACTIVE = "Active",
  CANCELLED = "Cancelled",
}

export interface UserDTO {
  id: number;
  name: string;
  description: string;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
}

export interface UsersRepository {
  getById: (id: number) => Promise<UserDTO | undefined>;
  getByName: (name: string) => Promise<UserDTO | undefined>;
  updateById: (data: UserDTO) => Promise<UserDTO>;
  deleteById: (id: number) => Promise<boolean>;
  create: (data: UserData) => Promise<UserDTO>;
}
