import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Status, Priority, Type } from '../common/enums';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockPrismaService = {
  todoList: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
};

describe('TodosService', () => {
  let service: TodosService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a todo with default values when empty data is provided', async () => {
      const createTodoDto: CreateTodoDto = {};
      const expectedTodo = {
        id: 1,
        title: 'New Task',
        assigne: '',
        dueDate: new Date(),
        timeTracked: 0,
        status: Status.PENDING,
        priority: null,
        type: null,
        estimatedSp: null,
        actualSp: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.todoList.create.mockResolvedValue(expectedTodo);

      const result = await service.create(createTodoDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Todo list created successfully');
      expect(result.data).toEqual(expectedTodo);
      expect(prisma.todoList.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'New Task',
          assigne: '',
          timeTracked: 0,
          status: Status.PENDING,
        }),
      });
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

      const expectedTodo = {
        id: 1,
        title: 'Test Task',
        assigne: 'John Doe',
        dueDate: new Date('2025-09-25'),
        timeTracked: 120,
        status: Status.IN_PROGRESS,
        priority: Priority.HIGH,
        type: Type.FEATURE_ENHANCEMENTS,
        estimatedSp: 5,
        actualSp: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.todoList.create.mockResolvedValue(expectedTodo);

      const result = await service.create(createTodoDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(expectedTodo);
      expect(prisma.todoList.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Test Task',
          assigne: 'John Doe',
          status: Status.IN_PROGRESS,
          priority: Priority.HIGH,
        }),
      });
    });

    it('should throw BadRequestException when creation fails', async () => {
      const createTodoDto: CreateTodoDto = { task: 'Test Task' };
      
      prisma.todoList.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createTodoDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return formatted todo list data', async () => {
      const mockTodos = [
        {
          id: 1,
          title: 'Test Task',
          assigne: 'John Doe,Jane Smith',
          dueDate: new Date('2025-09-25'),
          timeTracked: 120,
          status: 'in_progress',
          priority: 'high',
          type: 'feature_enhancements',
          estimatedSp: 5,
          actualSp: 3,
        },
      ];

      prisma.todoList.findMany.mockResolvedValue(mockTodos);

      const result = await service.findAll({});

      expect(result.success).toBe(true);
      expect(result.message).toBe('Todo lists retrieved successfully');
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(
        expect.objectContaining({
          id: 1,
          task: 'Test Task',
          developer: ['John Doe', 'Jane Smith'],
          status_raw: 'in_progress',
        }),
      );
    });

    it('should apply search filter when provided', async () => {
      const query = { search: 'test' };
      
      prisma.todoList.findMany.mockResolvedValue([]);

      await service.findAll(query);

      expect(prisma.todoList.findMany).toHaveBeenCalledWith({
        where: {
          title: {
            contains: 'test',
            mode: 'insensitive',
          },
        },
        orderBy: { id: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a todo when found', async () => {
      const mockTodo = {
        id: 1,
        title: 'Test Task',
        assigne: 'John Doe',
        dueDate: new Date(),
        timeTracked: 0,
        status: Status.PENDING,
      };

      prisma.todoList.findUnique.mockResolvedValue(mockTodo);

      const result = await service.findOne(1);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTodo);
    });

    it('should throw NotFoundException when todo not found', async () => {
      prisma.todoList.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a todo successfully', async () => {
      const existingTodo = {
        id: 1,
        title: 'Original Task',
        assigne: 'John Doe',
        dueDate: new Date(),
        timeTracked: 0,
        status: Status.PENDING,
      };

      const updateDto: UpdateTodoDto = {
        task: 'Updated Task',
        status: Status.COMPLETED,
      };

      const updatedTodo = {
        ...existingTodo,
        title: 'Updated Task',
        status: Status.COMPLETED,
      };

      prisma.todoList.findUnique.mockResolvedValue(existingTodo);
      prisma.todoList.update.mockResolvedValue(updatedTodo);

      const result = await service.update(1, updateDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Todo list updated successfully');
      expect(result.data).toEqual(updatedTodo);
    });

    it('should throw NotFoundException when updating non-existent todo', async () => {
      prisma.todoList.findUnique.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a todo successfully', async () => {
      const mockTodo = { id: 1, title: 'Test Task' };
      
      prisma.todoList.findUnique.mockResolvedValue(mockTodo);
      prisma.todoList.delete.mockResolvedValue(mockTodo);

      const result = await service.remove(1);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Todo list deleted successfully');
      expect(result.deleted_id).toBe(1);
    });

    it('should throw NotFoundException when deleting non-existent todo', async () => {
      prisma.todoList.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('bulkDelete', () => {
    it('should delete multiple todos successfully', async () => {
      const bulkDeleteDto = { ids: [1, 2, 3] };
      
      prisma.todoList.deleteMany.mockResolvedValue({ count: 3 });

      const result = await service.bulkDelete(bulkDeleteDto);

      expect(result.success).toBe(true);
      expect(result.deleted_count).toBe(3);
      expect(result.deleted_ids).toEqual([1, 2, 3]);
    });

    it('should throw NotFoundException when no todos found to delete', async () => {
      const bulkDeleteDto = { ids: [999, 998] };
      
      prisma.todoList.deleteMany.mockResolvedValue({ count: 0 });

      await expect(service.bulkDelete(bulkDeleteDto)).rejects.toThrow(NotFoundException);
    });
  });
});