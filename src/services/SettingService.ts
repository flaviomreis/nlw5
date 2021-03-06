import { getCustomRepository, Repository } from "typeorm";
import { Setting } from "../entities/Setting";
import { SettingRepository } from '../repositories/SettingRepository';

interface ISettingCreate {
  chat: boolean;
  username: string;
}

class SettingService {
  private settingRepository: Repository<Setting>;

  constructor () {
    this.settingRepository = getCustomRepository(SettingRepository);
  }

  async create({ chat, username }: ISettingCreate) {
    const userExists = await this.settingRepository.findOne({ username });

    if (userExists) {
      throw new Error(`User ${username} already exists!`);
    }

    const setting = this.settingRepository.create({
      chat,
      username
    });

    await this.settingRepository.save(setting);

    return setting;
  }

  async getByUsername(username: string) {
    const setting = this.settingRepository.findOne({ username });

    return setting;
  }

  async update(username: string, chat: boolean) {
    const setting = this.settingRepository
    .createQueryBuilder()
    .update(Setting)
    .set({ chat })
    .where('username = :username', { username })
    .execute();

    return setting;
  }
}

export { SettingService }