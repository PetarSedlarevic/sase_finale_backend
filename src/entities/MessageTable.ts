import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserTable } from "./UserTable";

@Index("message_id_UNIQUE", ["messageId"], { unique: true })
@Index("user_id_UNIQUE", ["userId"], { unique: true })
@Entity("message_table", { schema: "sase_finale_schema" })
export class MessageTable {
  @PrimaryGeneratedColumn({ type: "int", name: "message_id", unsigned: true })
  messageId: number;

  @Column("int", { name: "user_id", unique: true, unsigned: true })
  userId: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("text", { name: "title" })
  title: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => UserTable, (userTable) => userTable.messageTable, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: UserTable;
}
