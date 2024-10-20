import type { ActivityLog, Prisma } from '@prisma/client';

import type { ActivityLogRepo } from '@/repositories/activityLog.repo';

export class ActivityLogService {
  constructor(private activityLogRepo: ActivityLogRepo) {
    this.activityLogRepo = activityLogRepo;
  }

  async createActivityLog(
    activityLog: Prisma.ActivityLogCreateInput,
  ): Promise<ActivityLog> {
    return this.activityLogRepo.createActivityLog(activityLog);
  }
}
