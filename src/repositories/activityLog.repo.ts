import type {
  ActionType,
  ActivityLog,
  Prisma,
  PrismaClient,
} from '@prisma/client';

export class ActivityLogRepo {
  constructor(private prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private static getColorForActionType(actionType: ActionType): string {
    const colorMap: Record<ActionType, string> = {
      USER: 'blue',
      SUBSCRIPTION: 'green',
      PROJECT: 'red',
      TASK: 'yellow',
    };
    return colorMap[actionType] || 'gray';
  }

  async createActivityLog(
    activityLog: Prisma.ActivityLogCreateInput,
  ): Promise<ActivityLog> {
    const color = ActivityLogRepo.getColorForActionType(activityLog.actionType);
    return this.prisma.activityLog.create({
      data: {
        ...activityLog,
        color,
      },
    });
  }
}
