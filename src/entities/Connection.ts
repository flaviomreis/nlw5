import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { v4 as uuid } from 'uuid';

@Entity('connection')
class Connection {

  @PrimaryColumn()
  id: string;

  @Column()
  user_id: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne( () => User)
  user: User;

  @Column()
  admin_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  socket_id: string;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Connection }