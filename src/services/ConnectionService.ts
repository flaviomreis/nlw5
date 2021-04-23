import { getCustomRepository, Repository } from "typeorm"
import { Connection } from "../entities/Connection";
import { ConnectionRepository } from "../repositories/ConnectionRepository";

interface IConnectionCreate {
  user_id: string,
  admin_id?: string,
  socket_id: string,
  id?: string
}

class ConnectionService {
  private connectionRepository: Repository<Connection>;

  constructor() {
    this.connectionRepository = getCustomRepository(ConnectionRepository);
  }

  async create({ user_id, admin_id, socket_id, id }: IConnectionCreate) {
    const connection = this.connectionRepository.create({ user_id, admin_id, socket_id, id });

    await this.connectionRepository.save(connection);

    return connection;

  }

  async getByUserId(user_id: string) {
    const connection = this.connectionRepository.findOne({ user_id });

    return connection;
  }
}

export { ConnectionService }