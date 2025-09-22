import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoQueryDto } from './dto/todo-query.dto';
import { BulkDeleteDto } from './dto/bulk-delete.dto';

@ApiTags('Todo Lists')
@Controller('todo-lists')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo list item' })
  @ApiResponse({ status: 201, description: 'Todo list created successfully' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  @ApiResponse({ status: 500, description: 'Failed to create todo list' })
  create(@Body() createTodoDto: CreateTodoDto) {
    console.log('Received createTodoDto:', createTodoDto);
    return this.todosService.create(createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todo lists with optional search and sorting' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for filtering' })
  @ApiQuery({ name: 'sort_by', required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'order_direction', required: false, description: 'Sort direction (asc/desc)' })
  @ApiResponse({ status: 200, description: 'Todo lists retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Failed to retrieve todo lists' })
  findAll(@Query() query: TodoQueryDto) {
    return this.todosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific todo list item' })
  @ApiParam({ name: 'id', description: 'Todo list ID' })
  @ApiResponse({ status: 200, description: 'Todo list retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Todo list not found' })
  @ApiResponse({ status: 500, description: 'Failed to retrieve todo list' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo list item (PATCH)' })
  @ApiParam({ name: 'id', description: 'Todo list ID' })
  @ApiResponse({ status: 200, description: 'Todo list updated successfully' })
  @ApiResponse({ status: 404, description: 'Todo list not found' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  @ApiResponse({ status: 500, description: 'Failed to update todo list' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a todo list item (PUT)' })
  @ApiParam({ name: 'id', description: 'Todo list ID' })
  @ApiResponse({ status: 200, description: 'Todo list updated successfully' })
  @ApiResponse({ status: 404, description: 'Todo list not found' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  @ApiResponse({ status: 500, description: 'Failed to update todo list' })
  updatePut(@Param('id', ParseIntPipe) id: number, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific todo list item' })
  @ApiParam({ name: 'id', description: 'Todo list ID' })
  @ApiResponse({ status: 200, description: 'Todo list deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo list not found' })
  @ApiResponse({ status: 500, description: 'Failed to delete todo list' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(id);
  }

  @Post('bulk-delete')
  @ApiOperation({ summary: 'Delete multiple todo list items' })
  @ApiResponse({ status: 200, description: 'Todo lists deleted successfully' })
  @ApiResponse({ status: 404, description: 'No todo lists found to delete' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  @ApiResponse({ status: 500, description: 'Failed to delete todo lists' })
  bulkDelete(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.todosService.bulkDelete(bulkDeleteDto);
  }
}