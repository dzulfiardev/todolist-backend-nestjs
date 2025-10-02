import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoQueryDto } from './dto/todo-query.dto';
import { BulkDeleteDto } from './dto/bulk-delete.dto';
import { TodoListHelper } from '../common/helpers/todo-list.helper';
import { Status } from '../common/enums';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TodosService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) { }

  async create(createTodoDto: CreateTodoDto) {
    try {
      const data: any = {
        title: createTodoDto.task || 'New Task',
        assigne: createTodoDto.developer || '',
        dueDate: createTodoDto.due_date ? new Date(createTodoDto.due_date) : new Date(),
        timeTracked: createTodoDto.time_tracked || 0,
        status: createTodoDto.status || Status.PENDING,
        priority: createTodoDto.priority || null,
        type: createTodoDto.type || null,
        estimatedSp: createTodoDto.estimated_sp || null,
        actualSp: createTodoDto.actual_sp || null,
      };

      const todo = await this.prisma.todoList.create({
        data,
      });

      // Emit event for real-time updates
      this.eventEmitter.emit('todo.created', todo);

      return {
        success: true,
        message: 'Todo list created successfully',
        data: todo,
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: 'Failed to create todo list',
        error: error.message,
      });
    }
  }

  async findAll(query: TodoQueryDto) {
    try {
      const orderBy = query.sort_by || 'id';
      const orderDirection = query.order_direction || 'desc';

      // Build where clause for search
      const where: any = {};
      if (query.search) {
        where.title = {
          startsWith: `%${query.search}%`,
        }
      }

      const todos = await this.prisma.todoList.findMany({
        where,
        orderBy: { [orderBy]: orderDirection },
      });

      // Format data similar to Laravel response
      const formattedData = todos.map(todo => ({
        id: todo.id,
        task: todo.title,
        developer: TodoListHelper.convertStringToArray(todo.assigne || ''),
        date: TodoListHelper.formatDate(todo.dueDate),
        time_tracked: todo.timeTracked,
        status: TodoListHelper.formatEnumValue(todo.status),
        status_raw: todo.status,
        priority: TodoListHelper.formatEnumValue(todo.priority || ''),
        type: TodoListHelper.formatEnumValue(todo.type || ''),
        estimated_sp: todo.estimatedSp,
        actual_sp: todo.actualSp,
      }));

      return {
        success: true,
        message: 'Todo lists retrieved successfully',
        data: formattedData,
        search: query.search || null,
        total_count: formattedData.length,
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: 'Failed to retrieve todo lists',
        error: error.message,
      });
    }
  }

  async findOne(id: number) {
    try {
      const todo = await this.prisma.todoList.findUnique({
        where: { id },
      });

      if (!todo) {
        throw new NotFoundException({
          success: false,
          message: 'Todo list not found',
        });
      }

      return {
        success: true,
        message: 'Todo list retrieved successfully',
        data: todo,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: 'Failed to retrieve todo list',
        error: error.message,
      });
    }
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    try {
      const existingTodo = await this.prisma.todoList.findUnique({
        where: { id },
      });

      if (!existingTodo) {
        throw new NotFoundException({
          success: false,
          message: 'Todo list not found',
        });
      }

      // Handle developer field (can be array or string)
      let assigneValue = existingTodo.assigne;
      if (updateTodoDto.developer !== undefined) {
        if (Array.isArray(updateTodoDto.developer)) {
          assigneValue = TodoListHelper.convertArrayToString(updateTodoDto.developer);
        } else {
          assigneValue = updateTodoDto.developer;
        }
      }

      // Prepare update data
      const updateData: any = {};
      if (updateTodoDto.task !== undefined) updateData.title = updateTodoDto.task;
      if (updateTodoDto.developer !== undefined) updateData.assigne = assigneValue;
      if (updateTodoDto.date !== undefined) updateData.dueDate = new Date(updateTodoDto.date);
      if (updateTodoDto.status !== undefined) updateData.status = updateTodoDto.status;
      if (updateTodoDto.priority !== undefined) updateData.priority = updateTodoDto.priority;
      if (updateTodoDto.type !== undefined) updateData.type = updateTodoDto.type;
      if (updateTodoDto.estimated_sp !== undefined) updateData.estimatedSp = updateTodoDto.estimated_sp;
      if (updateTodoDto.actual_sp !== undefined) updateData.actualSp = updateTodoDto.actual_sp;

      const updatedTodo = await this.prisma.todoList.update({
        where: { id },
        data: updateData,
      });

      // Emit event for real-time updates
      this.eventEmitter.emit('todo.updated', updatedTodo);

      return {
        success: true,
        message: 'Todo list updated successfully',
        data: updatedTodo,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: 'Failed to update todo list',
        error: error.message,
      });
    }
  }

  async remove(id: number) {
    try {
      const todo = await this.prisma.todoList.findUnique({
        where: { id },
      });

      if (!todo) {
        throw new NotFoundException({
          success: false,
          message: 'Todo list not found',
        });
      }

      await this.prisma.todoList.delete({
        where: { id },
      });

      // Emit event for real-time updates
      this.eventEmitter.emit('todo.deleted', { id, title: todo.title || undefined });

      return {
        success: true,
        message: 'Todo list deleted successfully',
        deleted_id: id,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: 'Failed to delete todo list',
        error: error.message,
      });
    }
  }

  async bulkDelete(bulkDeleteDto: BulkDeleteDto) {
    try {
      const { count } = await this.prisma.todoList.deleteMany({
        where: {
          id: {
            in: bulkDeleteDto.ids,
          },
        },
      });

      if (count === 0) {
        throw new NotFoundException({
          success: false,
          message: 'No todo lists found to delete',
        });
      }

      // Emit event for real-time updates
      this.eventEmitter.emit('todo.bulkDeleted', { ids: bulkDeleteDto.ids, count });

      return {
        success: true,
        message: `Successfully deleted ${count} todo list(s)`,
        deleted_count: count,
        deleted_ids: bulkDeleteDto.ids,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: 'Failed to delete todo lists',
        error: error.message,
      });
    }
  }
}