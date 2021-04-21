import { Router } from 'express';
import { SettingController } from './controllers/SettingController';

const routes = Router();

const settingController = new SettingController();

routes.post('/setting', settingController.create);

export { routes };