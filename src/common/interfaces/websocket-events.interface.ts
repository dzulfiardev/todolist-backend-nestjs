export interface ServerToClientEvents {
  // Todo events
  todoCreated: (data: TodoEventData) => void;
  todoUpdated: (data: TodoEventData) => void;
  todoDeleted: (data: { id: number; deleted_id: number }) => void;
  todoBulkDeleted: (data: { ids: number[]; deleted_count: number }) => void;
  
  // List events
  todoListUpdated: (data: { total: number; todos: any[] }) => void;
  
  // System events
  error: (data: { message: string; error?: any }) => void;
  notification: (data: NotificationData) => void;
}

export interface ClientToServerEvents {
  // Join/Leave rooms
  joinTodoRoom: () => void;
  leaveTodoRoom: () => void;
  
  // Request current data
  getTodoList: (query?: any) => void;
  getTodo: (id: number) => void;
  
  // Ping/Pong for connection health
  ping: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId?: string;
  username?: string;
}

export interface TodoEventData {
  id: number;
  todo: any;
  action: 'created' | 'updated' | 'deleted';
  timestamp: Date;
  message?: string;
}

export interface NotificationData {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: Date;
  data?: any;
}