import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Status, Priority, Type } from '../common/enums';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TestDatabaseHelper } from '../../test/database-helper';

describe('TodosService', () => {
  let service: TodosService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const testPrisma = await TestDatabaseHelper.setupTestDatabase();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: testPrisma,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean the database before each test
    await TestDatabaseHelper.resetDatabase();
  });

  afterAll(async () => {
    await TestDatabaseHelper.cleanupTestDatabase();
  });

  describe('create', () => {
    it('should create a todo with default values when empty data is provided', async () => {
      const createTodoDto: CreateTodoDto = {};

      const result = await service.create(createTodoDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Todo list created successfully');
      expect(result.data).toEqual(expect.objectContaining({
        title: 'New Task',
        assigne: '',
        timeTracked: 0,
        status: Status.PENDING,
      }));
      expect(result.data.id).toBeDefined();
      expect(result.data.createdAt).toBeDefined();
    });

    it('should create a todo with provided values', async () => {
      const createTodoDto: CreateTodoDto = {
        task: 'Test Task',
        developer: 'John Doe',
        due_date: '2025-09-25',
        time_tracked: 120,
        status: Status.IN_PROGRESS,
        priority: Priority.HIGH,
        type: Type.FEATURE_ENHANCEMENTS,
        estimated_sp: 5,
        actual_sp: 3,
      };

      const result = await service.create(createTodoDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(expect.objectContaining({
        title: 'Test Task',
        assigne: 'John Doe',
        timeTracked: 120,
        status: Status.IN_PROGRESS,
        priority: Priority.HIGH,
        type: Type.FEATURE_ENHANCEMENTS,
        estimatedSp: 5,
        actualSp: 3,
      }));
    });

    it('should throw BadRequestException when creation fails', async () => {
      const createTodoDto: CreateTodoDto = { 
        task: 'Test Task',
        // Invalid enum value to cause error
        status: 'INVALID_STATUS' as any,
      };
      
      await expect(service.create(createTodoDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return formatted todo list data', async () => {
      // First create a todo to test with
      await service.create({
        task: 'Test Task',
        developer: 'John Doe,Jane Smith',
        due_date: '2025-09-25',
        time_tracked: 120,
        status: Status.IN_PROGRESS,
        priority: Priority.HIGH,
        type: Type.FEATURE_ENHANCEMENTS,
        estimated_sp: 5,
        actual_sp: 3,
      });

      const result = await service.findAll({});

      expect(result.success).toBe(true);
      expect(result.message).toBe('Todo lists retrieved successfully');
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(
        expect.objectContaining({
          task: 'Test Task',
          developer: ['John Doe', 'Jane Smith'],
          status_raw: Status.IN_PROGRESS,
        }),
      );
    });

    it('should apply search filter when provided', async () => {
      // Create two todos
      await service.create({ task: 'Test Todo' });
      await service.create({ task: 'Another Task' });

      const result = await service.findAll({ search: 'Test' });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].task).toBe('Test Todo');
    });
  });

  describe('findOne', () => {
    it('should return a todo when found', async () => {
      // Create a todo first
      const created = await service.create({
        task: 'Test Task',
        developer: 'John Doe',
      });

      const result = await service.findOne(created.data.id);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(expect.objectContaining({
        id: created.data.id,
        title: 'Test Task',
        assigne: 'John Doe',
        status: Status.PENDING,
      }));
    });

    it('should throw NotFoundException when todo not found', async () => {
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a todo successfully', async () => {
      // Create a todo first
      const created = await service.create({
        task: 'Original Task',
        developer: 'John Doe',
        status: Status.PENDING,
      });

      const updateDto: UpdateTodoDto = {
        task: 'Updated Task',
        status: Status.COMPLETED,
      };

      const result = await service.update(created.data.id, updateDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Todo list updated successfully');
      expect(result.data).toEqual(expect.objectContaining({
        id: created.data.id,
        title: 'Updated Task',
        status: Status.COMPLETED,
      }));
    });

    it('should throw NotFoundException when updating non-existent todo', async () => {
      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a todo successfully', async () => {
      // Create a todo first
      const created = await service.create({
        task: 'Test Task',
        developer: 'John Doe',
      });

      const result = await service.remove(created.data.id);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Todo list deleted successfully');
      expect(result.deleted_id).toBe(created.data.id);

      // Verify it's actually deleted
      await expect(service.findOne(created.data.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when deleting non-existent todo', async () => {
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('bulkDelete', () => {
    it('should delete multiple todos successfully', async () => {
      // Create multiple todos
      const created1 = await service.create({ task: 'Todo 1' });
      const created2 = await service.create({ task: 'Todo 2' });
      const created3 = await service.create({ task: 'Todo 3' });

      const bulkDeleteDto = { 
        ids: [created1.data.id, created2.data.id, created3.data.id] 
      };

      const result = await service.bulkDelete(bulkDeleteDto);

      expect(result.success).toBe(true);
      expect(result.deleted_count).toBe(3);
      expect(result.deleted_ids).toEqual(bulkDeleteDto.ids);

      // Verify todos are deleted
      await expect(service.findOne(created1.data.id)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(created2.data.id)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(created3.data.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when no todos found to delete', async () => {
      const bulkDeleteDto = { ids: [999, 998] };

      await expect(service.bulkDelete(bulkDeleteDto)).rejects.toThrow(NotFoundException);
    });
  });
});