import { io } from '../http';
import { ConnectionService } from '../services/ConnectionService';
import { MessageService } from '../services/MessageService';

io.on('connect', async (socket) => {
  const connectionService = new ConnectionService();
  const messageService = new MessageService();

  const connectionsWithoutAdmin = await connectionService.listConnectionsWithoutAdmin();

  io.emit('connections_without_admin', connectionsWithoutAdmin);

  socket.on('admin_get_messages_by_user', async (params, callback) => {
    const { user_id } = params;

    const messages = await messageService.listByUser(user_id);

    callback(messages);

    //await connectionService.updateAdminId(user_id, socket.id);
    //io.emit('connections_without_admin', connectionsWithoutAdmin);
  });

  socket.on('admin_send_message', async (message) => {
    const { text, user_id } = message;

    await messageService.create({
      user_id,
      admin_id: socket.id,
      text
    });

    console.log('admin_id', socket.id);

    const { socket_id } = await connectionService.getByUserId(user_id);

    io.to(socket_id).emit('admin_send_to_client', {
      text,
      socket_id: socket.id
    });
  });

  socket.on('admin_user_in_support', async params => {
    const { user_id } = params;
    await connectionService.updateAdminId(user_id, socket.id);

    const allConnectionsWithoutAdmin = await connectionService.listConnectionsWithoutAdmin();

    io.emit('connections_without_admin', allConnectionsWithoutAdmin);
  });

});