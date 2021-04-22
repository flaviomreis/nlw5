import { Request, Response } from "express";
import { MessageService } from "../services/MessageService";


class MessageController {
  async create(request: Request, response: Response) {
    const { admin_id, user_id, text } = request.body;

    const messageService = new MessageService();

    const message = await messageService.create({ admin_id, user_id, text });

    return response.json(message);
  }

  async showByUser(request: Request, response: Response) {
    const { id } = request.params;

    const messageService = new MessageService();

    const messages = await messageService.listByUser(id);

    return response.json(messages);
  }
}

export { MessageController }