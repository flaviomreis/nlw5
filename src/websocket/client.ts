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

    const userMessages = await messageService.listByUser(user_id);

    socket.emit('show_user_messages', userMessages);

    const connectionsWithoutAdmin = await connectionService.listConnectionsWithoutAdmin();
    io.emit('connections_without_admin', connectionsWithoutAdmin);
  });

  socket.on('client_send_to_admin', async (_message) => {
    const { text, socket_admin_id } = _message;
    const socket_id = socket.id;
    console.log(socket.id)

    const { user_id } = await connectionService.getBySocketId(socket_id);

    const message = await messageService.create({ user_id, text });

    if (socket_admin_id) {
      io.to(socket_admin_id).emit('show_user_message', {
        message,
        socket_id
      });
    }
  })
});