import { DataSource } from 'typeorm';
import { databaseOptions } from './database.options.js';
import { CreateMessagesTable1791920000000 } from './migrations/1791920000000-create-messages-table.js';
import { Message } from '../messages/message.entity.js';

export default new DataSource({
  ...databaseOptions,
  entities: [Message],
  migrations: [CreateMessagesTable1791920000000],
});