import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserStatus } from "../../../../repositories/UsersRepository";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: "enum", enum: UserStatus, nullable: false })
  status: UserStatus;

  @Column({ type: "datetime", nullable: false })
  created_at: Date;

  @Column({ type: "datetime", nullable: false })
  updated_at: Date;
}
