import { EntityManager } from "typeorm";
import {
  UserDTO,
  UserStatus,
  UsersRepository,
} from "../../../repositories/UsersRepository";
import { formatDatetime } from "../../../helpers/dateHelper";
import { UserData } from "../../../services/dto/CreateUserService.dto";

class UsersTypeORMRepository implements UsersRepository {
  database: EntityManager;

  constructor(database: EntityManager) {
    this.database = database;
  }

  async getById(id: number): Promise<UserDTO | undefined> {
    const users = await this.database.query(`SELECT * FROM user WHERE id=?`, [
      id,
    ]);

    return users[0];
  }

  async getByName(name: string): Promise<UserDTO | undefined> {
    const users = await this.database.query(`SELECT * FROM user WHERE name=?`, [
      name,
    ]);

    return users[0];
  }

  async updateById(user: UserDTO) {
    const currentDate = new Date();
    const now = formatDatetime(currentDate);

    await this.database.query(
      `UPDATE user SET
    name=?, 
    description=?, 
    updated_at=?
    WHERE id=?`,
      [user.name, user.description, now, user.id]
    );

    user.updated_at = currentDate;

    return user;
  }

  async deleteById(id: number): Promise<boolean> {
    await this.database.query(
      `UPDATE user SET 
    status=?,  
    updated_at=?
    WHERE id=?`,
      [UserStatus.CANCELLED, formatDatetime(new Date()), id]
    );

    return true;
  }

  async create(user: UserData): Promise<UserDTO> {
    const currentDate = new Date();
    const now = formatDatetime(currentDate);
    const row = await this.database.query(
      `INSERT INTO user(name, description, status, created_at, updated_at) 
      VALUES(
        ?, 
        ?, 
        ?,
        ?,
        ?
      )
    `,
      [user.name, user.description, UserStatus.ACTIVE, now, now]
    );

    let newUser: UserDTO = user as UserDTO;
    newUser.id = row.insertId;
    newUser.status = UserStatus.ACTIVE;
    newUser.created_at = currentDate;
    newUser.updated_at = currentDate;

    return newUser;
  }
}

export default UsersTypeORMRepository;
