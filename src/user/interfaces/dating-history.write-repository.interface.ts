import { DatingHistoryType } from '../user.constant';

export interface IDatingHistoryWriteRepository {
  todayExist(userId: string, partnerId: string): Promise<boolean>;
  create(userId: string, partnerId: string, type: DatingHistoryType): Promise<void>;
}
