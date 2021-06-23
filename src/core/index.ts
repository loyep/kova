import { v4 as uuidv4 } from 'uuid';

export const appVersion = uuidv4().replace(/-/g, '')

export { CacheModule } from './cache'
export { ConfigModule } from './config'
export { LoggerModule } from './logger'