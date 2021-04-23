import { io } from '../http';
import { ConnectionService } from '../services/ConnectionService';
import { UserService } from '../services/UserService';
import { MessageService } from '../services/MessageService';

interface IParams {
  email: string;
  text: string;
}

io.on('connect', (socket) => {
  const connectionService = new ConnectionService();
  const userService = new UserService();
  const messageService = new MessageService();

  socket.on('client_first_access', async (params) => {
    const socket_id = socket.id;
    const { email, text } = params as IParams;

    const userExists = await userService.getByEmail(email);
    let user_id: string;

    if (!userExists) {
      const user = await userService.create(email);
      user_id = user.id;

      await connectionService.create({ socket_id, user_id });
    } else {
      user_id = userExists.id;
      const connection = await connectionService.getByUserId(user_id);

      if (!connection) {
        await connectionService.create({ socket_id, user_id });
      } else {
        connection.socket_id = socket.id;
        await connectionService.create(connection);
      }
    }

    await messageService.create({ text, user_id });

  })
})