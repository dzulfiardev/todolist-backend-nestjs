import { validate } from 'class-validator';
import { CreateTodoDto } from '../../todos/dto/create-todo.dto';
import { UpdateTodoDto } from '../../todos/dto/update-todo.dto';

describe('Date Validation', () => {
  describe('CreateTodoDto', () => {
    it('should pass validation with future date', async () => {
      const dto = new CreateTodoDto();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dto.due_date = tomorrow.toISOString().split('T')[0];

      const errors = await validate(dto);
      const dateErrors = errors.filter(error => error.property === 'due_date');
      expect(dateErrors).toHaveLength(0);
    });

    it('should pass validation with today date', async () => {
      const dto = new CreateTodoDto();
      const today = new Date();
      dto.due_date = today.toISOString().split('T')[0];

      const errors = await validate(dto);
      const dateErrors = errors.filter(error => error.property === 'due_date');
      expect(dateErrors).toHaveLength(0);
    });

    it('should fail validation with past date', async () => {
      const dto = new CreateTodoDto();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      dto.due_date = yesterday.toISOString().split('T')[0];

      const errors = await validate(dto);
      const dateErrors = errors.filter(error => error.property === 'due_date');
      expect(dateErrors).toHaveLength(1);
      expect(dateErrors[0].constraints).toHaveProperty('isFutureDate');
    });

    it('should pass validation with empty date', async () => {
      const dto = new CreateTodoDto();
      // due_date is undefined

      const errors = await validate(dto);
      const dateErrors = errors.filter(error => error.property === 'due_date');
      expect(dateErrors).toHaveLength(0);
    });
  });

  describe('UpdateTodoDto', () => {
    it('should pass validation with future date', async () => {
      const dto = new UpdateTodoDto();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dto.date = tomorrow.toISOString().split('T')[0];

      const errors = await validate(dto);
      const dateErrors = errors.filter(error => error.property === 'date');
      expect(dateErrors).toHaveLength(0);
    });

    it('should fail validation with past date', async () => {
      const dto = new UpdateTodoDto();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      dto.date = yesterday.toISOString().split('T')[0];

      const errors = await validate(dto);
      const dateErrors = errors.filter(error => error.property === 'date');
      expect(dateErrors).toHaveLength(1);
      expect(dateErrors[0].constraints).toHaveProperty('isFutureDate');
    });
  });
});