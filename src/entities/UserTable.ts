import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MessageTable } from "./MessageTable";

@Index("email_UNIQUE", ["email"], { unique: true })
@Index("user_id_UNIQUE", ["userId"], { unique: true })
@Entity("user_table", { schema: "sase_finale_schema" })
export class UserTable {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "user_name", length: 255 })
  userName: string;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("int", { name: "message_num", default: () => "'0'" })
  messageNum: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => MessageTable, (messageTable) => messageTable.user)
  messageTable: MessageTable;
}
