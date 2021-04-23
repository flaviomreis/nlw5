import { Request, Response } from 'express';
import { SettingService } from '../services/SettingService';

class SettingController {
  async create(request: Request, response: Response) {
    const { chat, username } = request.body;

    const settingService = new SettingService();

    try {
      const setting = await settingService.create({ chat, username });

      return response.json(setting);
    } catch (err) {
      return response.status(400).json({ message: err.message });
    }
  }

  async getByUsername(request: Request, response: Response) {
    const { username } = request.params;

    const settingService = new SettingService();

    const setting = await settingService.getByUsername(username);

    return response.json(setting);
  }

  async update(request: Request, response: Response) {
    const { username } = request.params;
    const { chat } = request.body;

    const settingService = new SettingService();

    const setting = await settingService.update(username, chat);

    return response.json(setting);
  }
}

export { SettingController };