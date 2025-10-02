import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  TodoEventData,
  NotificationData,
} from '../common/interfaces/websocket-events.interface';
import { TodoQueryDto } from './dto/todo-query.dto';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'https://todolist.dzulfikardev.site',
      'https://todolistapinest.dzulfikardev.site',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
  // namespace: '/todos',
})
export class TodosGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

  private logger: Logger = new Logger('TodosGateway');

  constructor() { }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);

    // Send welcome message
    client.emit('notification', {
      message: 'Connected to TodoList real-time updates',
      type: 'success',
      timestamp: new Date(),
    });

    // Auto-join the todo room
    client.join('todos');
    this.logger.log(`Client ${client.id} joined todos room`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinTodoRoom')
  handleJoinTodoRoom(@ConnectedSocket() client: Socket): void {
    client.join('todos');
    this.logger.log(`Client ${client.id} joined todos room`);

    client.emit('notification', {
      message: 'Joined todo updates room',
      type: 'info',
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('leaveTodoRoom')
  handleLeaveTodoRoom(@ConnectedSocket() client: Socket): void {
    client.leave('todos');
    this.logger.log(`Client ${client.id} left todos room`);

    client.emit('notification', {
      message: 'Left todo updates room',
      type: 'info',
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('getTodoList')
  async handleGetTodoList(
    @ConnectedSocket() client: Socket,
    @MessageBody() query: TodoQueryDto = {},
  ): Promise<void> {
    // This will be handled by the controller or service calling the gateway
    client.emit('notification', {
      message: 'getTodoList request received - use REST API to fetch data',
      type: 'info',
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('getTodo')
  async handleGetTodo(
    @ConnectedSocket() client: Socket,
    @MessageBody() id: number,
  ): Promise<void> {
    // This will be handled by the controller or service calling the gateway
    client.emit('notification', {
      message: `getTodo request for ${id} - use REST API to fetch data`,
      type: 'info',
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): void {
    client.emit('notification', {
      message: 'pong',
      type: 'info',
      timestamp: new Date(),
    });
  }

  // Event listeners for TodosService events
  @OnEvent('todo.created')
  handleTodoCreatedEvent(todo: any): void {
    this.emitTodoCreated(todo);
  }

  @OnEvent('todo.updated')
  handleTodoUpdatedEvent(todo: any): void {
    this.emitTodoUpdated(todo);
  }

  @OnEvent('todo.deleted')
  handleTodoDeletedEvent(payload: { id: number; title?: string }): void {
    this.emitTodoDeleted(payload.id, payload.title);
  }

  @OnEvent('todo.bulkDeleted')
  handleTodoBulkDeletedEvent(payload: { ids: number[]; count: number }): void {
    this.emitTodoBulkDeleted(payload.ids, payload.count);
  }

  // Methods to emit events from service
  emitTodoCreated(todo: any): void {
    const eventData: TodoEventData = {
      id: todo.id,
      todo,
      action: 'created',
      timestamp: new Date(),
      message: `Todo "${todo.title}" was created`,
    };

    this.server.to('todos').emit('todoCreated', eventData);
    this.logger.log(`Emitted todoCreated event for todo ${todo.id}`);
  }

  emitTodoUpdated(todo: any): void {
    const eventData: TodoEventData = {
      id: todo.id,
      todo,
      action: 'updated',
      timestamp: new Date(),
      message: `Todo "${todo.title}" was updated`,
    };

    this.server.to('todos').emit('todoUpdated', eventData);
    this.logger.log(`Emitted todoUpdated event for todo ${todo.id}`);
  }

  emitTodoDeleted(todoId: number, title?: string): void {
    this.server.to('todos').emit('todoDeleted', {
      id: todoId,
      deleted_id: todoId,
    });

    this.server.to('todos').emit('notification', {
      message: `Todo "${title || todoId}" was deleted`,
      type: 'info',
      timestamp: new Date(),
    });

    this.logger.log(`Emitted todoDeleted event for todo ${todoId}`);
  }

  emitTodoBulkDeleted(deletedIds: number[], count: number): void {
    this.server.to('todos').emit('todoBulkDeleted', {
      ids: deletedIds,
      deleted_count: count,
    });

    this.server.to('todos').emit('notification', {
      message: `${count} todos were deleted`,
      type: 'info',
      timestamp: new Date(),
    });

    this.logger.log(`Emitted todoBulkDeleted event for ${count} todos`);
  }

  emitNotification(notification: NotificationData): void {
    this.server.to('todos').emit('notification', notification);
    this.logger.log(`Emitted notification: ${notification.message}`);
  }

  // Get connected clients count
  getConnectedClientsCount(): number {
    return this.server.sockets.sockets.size;
  }

  // Get clients in todos room
  getTodoRoomClientsCount(): number {
    const room = this.server.sockets.adapter.rooms.get('todos');
    return room ? room.size : 0;
  }
}