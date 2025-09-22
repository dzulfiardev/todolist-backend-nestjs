import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExportQueryDto } from './dto/export-query.dto';
import { TodoListHelper } from '../common/helpers/todo-list.helper';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async exportExcel(filters: ExportQueryDto): Promise<any> {
    try {
      // Build where clause similar to Laravel logic
      const where: any = {};

      if (filters.title) {
        where.title = {
          contains: filters.title,
        };
      }

      if (filters.assigne) {
        const assignees = filters.assigne.split(',').map(a => a.trim());
        where.OR = assignees.map(assignee => ({
          assigne: {
            contains: assignee,
          },
        }));
      }

      if (filters.start && filters.end) {
        where.dueDate = {
          gte: new Date(filters.start),
          lte: new Date(filters.end),
        };
      }

      if (filters.min !== undefined && filters.max !== undefined) {
        where.timeTracked = {
          gte: Number(filters.min),
          lte: Number(filters.max),
        };
      }

      if (filters.status) {
        const statuses = filters.status.split(',').map(s => s.trim());
        where.status = {
          in: statuses,
        };
      }

      if (filters.priority) {
        const priorities = filters.priority.split(',').map(p => p.trim());
        where.priority = {
          in: priorities,
        };
      }

      // Get filtered data
      const todos = await this.prisma.todoList.findMany({
        where,
        select: {
          title: true,
          assigne: true,
          dueDate: true,
          timeTracked: true,
          status: true,
          priority: true,
        },
        orderBy: {
          dueDate: 'asc',
        },
      });

      // Calculate total time tracked
      const totalTimeTracked = todos.reduce((sum, todo) => sum + todo.timeTracked, 0);

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('TodoList Report');

      // Add headers
      const headers = ['Title', 'Assignee', 'Due Date', 'Time Tracked (Hours)', 'Status', 'Priority'];
      worksheet.addRow(headers);

      // Style headers
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, size: 12 };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2E8F0' },
      };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

      // Add data rows
      todos.forEach(todo => {
        const row = [
          todo.title || '',
          todo.assigne || '-',
          todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '-',
          todo.timeTracked || 0,
          TodoListHelper.formatEnumValue(todo.status) || '',
          TodoListHelper.formatEnumValue(todo.priority || '') || '',
        ];
        worksheet.addRow(row);
      });

      // Add summary row
      const summaryRowIndex = worksheet.rowCount + 2;
      worksheet.getCell(`A${summaryRowIndex}`).value = 'SUMMARY';
      worksheet.getCell(`C${summaryRowIndex}`).value = 'Total Time Tracked:';
      worksheet.getCell(`D${summaryRowIndex}`).value = `${totalTimeTracked} hours`;

      // Style summary row
      const summaryRow = worksheet.getRow(summaryRowIndex);
      summaryRow.font = { bold: true, size: 11 };
      summaryRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFEF3C7' },
      };

      // Auto-size columns
      worksheet.columns.forEach(column => {
        if (column.values) {
          const lengths = column.values.map(v => v ? v.toString().length : 0);
          const maxLength = Math.max(...lengths);
          column.width = Math.min(maxLength + 2, 50);
        }
      });

      // Add borders to all data
      const range = `A1:F${summaryRowIndex}`;
      worksheet.getCell(range.split(':')[0]).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      // Apply borders to all cells in range
      for (let row = 1; row <= summaryRowIndex; row++) {
        for (let col = 1; col <= 6; col++) {
          worksheet.getCell(row, col).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }
      }

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer as any;
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: 'An error occurred while generating the report',
        error: error.message,
      });
    }
  }

  async previewData(filters: ExportQueryDto) {
    try {
      // Use same filtering logic as export
      const where: any = {};

      if (filters.title) {
        where.title = {
          contains: filters.title,
          mode: 'insensitive',
        };
      }

      if (filters.assigne) {
        const assignees = filters.assigne.split(',').map(a => a.trim());
        where.OR = assignees.map(assignee => ({
          assigne: {
            contains: assignee,
            mode: 'insensitive',
          },
        }));
      }

      if (filters.start && filters.end) {
        where.dueDate = {
          gte: new Date(filters.start),
          lte: new Date(filters.end),
        };
      }

      if (filters.min !== undefined && filters.max !== undefined) {
        where.timeTracked = {
          gte: Number(filters.min),
          lte: Number(filters.max),
        };
      }

      if (filters.status) {
        const statuses = filters.status.split(',').map(s => s.trim());
        where.status = {
          in: statuses,
        };
      }

      if (filters.priority) {
        const priorities = filters.priority.split(',').map(p => p.trim());
        where.priority = {
          in: priorities,
        };
      }

      const todos = await this.prisma.todoList.findMany({
        where,
        select: {
          title: true,
          assigne: true,
          dueDate: true,
          timeTracked: true,
          status: true,
          priority: true,
        },
        orderBy: {
          dueDate: 'asc',
        },
      });

      const totalTimeTracked = todos.reduce((sum, todo) => sum + todo.timeTracked, 0);

      const formattedTodos = todos.map(todo => ({
        title: todo.title || '',
        assigne: todo.assigne || '-',
        due_date: todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '-',
        time_tracked: todo.timeTracked || 0,
        status: TodoListHelper.formatEnumValue(todo.status) || '',
        priority: TodoListHelper.formatEnumValue(todo.priority || '') || '',
      }));

      return {
        success: true,
        message: 'Preview data retrieved successfully',
        data: {
          todos: formattedTodos,
          summary: {
            total_records: formattedTodos.length,
            total_time_tracked: totalTimeTracked,
          },
          filters_applied: filters,
        },
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: 'An error occurred while retrieving preview data',
        error: error.message,
      });
    }
  }
}