import { Router } from 'express';
import { MessageController } from './controllers/MessageController';
import { SettingController } from './controllers/SettingController';
import { UserController } from './controllers/UserController';

const routes = Router();

const settingController = new SettingController();
const userController = new UserController();
const messageController = new MessageController();

routes.post('/setting', settingController.create);
routes.post('/user', userController.create);
routes.post('/message', messageController.create);
routes.get('/message/:id', messageController.showByUser);

export { routes };