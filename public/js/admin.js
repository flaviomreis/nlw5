const socket = io();
let connections = [];
let connectionInSupport = [];

socket.on('connections_without_admin', _connections => {
  connections = _connections;

  document.getElementById('list_users').innerHTML = '';

  let template = document.getElementById('template').innerHTML;

  _connections.forEach(_connection => {
    const renderedConnection = Mustache.render(template, {
      email: _connection.user.email,
      id: _connection.socket_id
    });

    document.getElementById('list_users').innerHTML += renderedConnection;
  });
});

function call(id) {
  const connection = connections.find(_connection => _connection.socket_id === id);

  connectionInSupport.push(connection);
  const template = document.getElementById('admin_template').innerHTML;

  const renderedConnection = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user_id
  });

  document.getElementById('supports').innerHTML += renderedConnection;

  const params = { user_id: connection.user_id };

  socket.emit('admin_user_in_support', params);

  socket.emit('admin_get_messages_by_user', params, messages => {
    const messagesDiv = document.getElementById(`allMessages${connection.user_id}`);

    messages.forEach(message => {
      const messageDiv = document.createElement('div');

      if (message.admin_id === null) {
        messageDiv.className = 'admin_message_client';
        messageDiv.innerHTML = `<span>${connection.user.email}</span>`;
        messageDiv.innerHTML += `<span>${message.text}</span>`;
        messageDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      } else {
        messageDiv.className = 'admin_message_admin';
        messageDiv.innerHTML = `<span>Atendente: ${message.text}</span>`;
        messageDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      }

      messagesDiv.appendChild(messageDiv);
    });

  });
}

function sendMessage(id) {
  const text = document.getElementById(`send_message_${id}`);

  const message = {
    text: text.value,
    user_id: id
  }

  socket.emit('admin_send_message', message);

  const messagesDiv = document.getElementById(`allMessages${message.user_id}`);

  const messageDiv = document.createElement('div');
  messageDiv.className = 'admin_message_admin';
  messageDiv.innerHTML = `<span>Atendente: ${message.text}</span>`;
  messageDiv.innerHTML += `<span class="admin_date">${dayjs().format("DD/MM/YYYY HH:mm:ss")}</span>`;

  messagesDiv.appendChild(messageDiv);

  text.value = '';
}

socket.on('show_user_message', params => {
  console.log('message', params.message);
  console.log('socket_id', params.socket_id);
  const connection = connectionInSupport.find(_connection => _connection.socket_id === params.socket_id);
  console.log('connection', connection);
  console.log('connections', connectionInSupport);

  const messagesDiv = document.getElementById(`allMessages${params.message.user_id}`);
  const messageDiv = document.createElement('div');

  messageDiv.className = 'admin_message_client';
  messageDiv.innerHTML = `<span>${connection.user.email}</span>`;
  messageDiv.innerHTML += `<span>${params.message.text}</span>`;
  messageDiv.innerHTML += `<span class="admin_date">${dayjs(params.message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;

  messagesDiv.appendChild(messageDiv);

})