import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChartType } from './dto/chart-query.dto';
import { TodoListHelper } from '../common/helpers/todo-list.helper';

@Injectable()
export class ChartsService {
  constructor(private prisma: PrismaService) {}

  async getChartData(type: ChartType) {
    try {
      switch (type) {
        case ChartType.STATUS:
          return this.getStatusSummary();
        case ChartType.PRIORITY:
          return this.getPrioritySummary();
        case ChartType.ASSIGNEE:
          return this.getAssigneeSummary();
        default:
          throw new BadRequestException({
            success: false,
            message: 'Invalid chart type',
            error: 'Supported types: status, priority, assignee',
          });
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: 'An error occurred while generating chart data',
        error: error.message,
      });
    }
  }

  private async getStatusSummary() {
    const statusCounts = await this.prisma.todoList.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // Create a complete status summary with all possible statuses
    const allStatuses = {
      pending: 0,
      open: 0,
      in_progress: 0,
      stuck: 0,
      completed: 0,
    };

    // Fill in the actual counts
    statusCounts.forEach(item => {
      allStatuses[item.status] = item._count.status;
    });

    return {
      success: true,
      message: 'Status summary retrieved successfully',
      data: {
        status_summary: allStatuses,
      },
    };
  }

  private async getPrioritySummary() {
    const priorityCounts = await this.prisma.todoList.groupBy({
      by: ['priority'],
      _count: {
        priority: true,
      },
    });

    // Create a complete priority summary with all possible priorities
    const allPriorities = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
      best_effort: 0,
    };

    // Fill in the actual counts
    priorityCounts.forEach(item => {
      if (item.priority) {
        allPriorities[item.priority] = item._count.priority;
      }
    });

    return {
      success: true,
      message: 'Priority summary retrieved successfully',
      data: {
        priority_summary: allPriorities,
      },
    };
  }

  private async getAssigneeSummary() {
    const dataRaw = await this.prisma.todoList.findMany({
      select: {
        assigne: true,
      },
      where: {
        assigne: {
          not: null,
        },
        AND: {
          assigne: {
            not: '',
          },
        },
      },
    });

    const allAssignees: { [key: string]: number } = {};

    // Process assignees similar to Laravel logic
    dataRaw.forEach(data => {
      if (data.assigne) {
        const assignees = TodoListHelper.convertStringToArray(data.assigne);
        assignees.forEach(assignee => {
          if (assignee) {
            allAssignees[assignee] = (allAssignees[assignee] || 0) + 1;
          }
        });
      }
    });

    const assigneeKeys = Object.keys(allAssignees);
    const finalData: Array<{ [key: string]: any }> = [];

    // Get detailed stats for each assignee
    for (const assignee of assigneeKeys) {
      const totalTodos = await this.prisma.todoList.count({
        where: {
          assigne: {
            contains: assignee,
          },
        },
      });

      const totalPendingTodos = await this.prisma.todoList.count({
        where: {
          assigne: {
            contains: assignee,
          },
          status: 'pending' as any,
        },
      });

      const totalTimeTracked = await this.prisma.todoList.aggregate({
        _sum: {
          timeTracked: true,
        },
        where: {
          assigne: {
            contains: assignee,
          },
        },
      });

      finalData.push({
        [assignee]: {
          total_todos: totalTodos,
          total_pending_todos: totalPendingTodos,
          total_timetracked_todos: totalTimeTracked._sum.timeTracked || 0,
        },
      });
    }

    return {
      success: true,
      message: 'Assignee summary retrieved successfully',
      data: {
        assignee_summary: finalData,
      },
    };
  }
}