# TodoList REST API - NestJS

A comprehensive TodoList management API built with NestJS, TypeScript, and Prisma ORM. This project is a complete conversion from a Laravel TodoList backend, maintaining all original features while leveraging modern NestJS architecture patterns.

## 🚀 Features

### Core Functionality
- **Full CRUD Operations** - Create, Read, Update, Delete todo items
- **Advanced Search & Filtering** - Search by title with sorting capabilities
- **Bulk Operations** - Delete multiple items at once
- **Data Validation** - Comprehensive input validation using class-validator
- **Error Handling** - Structured error responses with proper HTTP status codes

### Business Logic
- **Status Management** - pending, open, in_progress, completed, stuck
- **Priority Levels** - low, medium, high, critical, best_effort  
- **Task Types** - feature_enhancements, bug, other
- **Assignee Management** - Comma-separated multiple assignees
- **Time Tracking** - Track estimated vs actual story points and time
- **Due Date Management** - Date validation and formatting

### Analytics & Reporting
- **Chart Endpoints** - Status, priority, and assignee distribution
- **Excel Export** - Advanced filtering with styled Excel reports
- **Data Preview** - Preview export data before generating files
- **Summary Statistics** - Total time tracked, task counts by assignee

### Technical Features
- **TypeScript** - Full type safety with strict typing
- **Prisma ORM** - Type-safe database operations with auto-generated client
- **Swagger Documentation** - Complete API documentation at `/api/docs`
- **Unit Testing** - Comprehensive test coverage using Jest
- **Docker Support** - Multi-container setup with MySQL, Redis, PHPMyAdmin
- **Clean Architecture** - Modular design with separation of concerns

## 🏗️ Project Structure

```
src/
├── common/
│   ├── enums/           # Status, Priority, Type enums
│   ├── helpers/         # Utility functions (TodoListHelper)
│   ├── filters/         # Exception filters
│   └── guards/          # Authentication guards
├── todos/
│   ├── dto/             # Data Transfer Objects
│   ├── entities/        # Domain entities
│   ├── todos.controller.ts
│   ├── todos.service.ts
│   └── todos.module.ts
├── charts/
│   ├── dto/             # Chart query DTOs
│   ├── charts.controller.ts
│   ├── charts.service.ts
│   └── charts.module.ts
├── reports/
│   ├── dto/             # Export filter DTOs
│   ├── reports.controller.ts
│   ├── reports.service.ts
│   └── reports.module.ts
├── prisma/
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── app.module.ts
└── main.ts
```

## 📋 API Endpoints

### Todo Lists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todo-lists` | Get all todos with search/filter |
| POST | `/api/todo-lists` | Create new todo |
| GET | `/api/todo-lists/:id` | Get specific todo |
| PUT/PATCH | `/api/todo-lists/:id` | Update todo |
| DELETE | `/api/todo-lists/:id` | Delete todo |
| POST | `/api/todo-lists/bulk-delete` | Delete multiple todos |

### Charts & Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chart?type=status` | Status distribution |
| GET | `/api/chart?type=priority` | Priority distribution |
| GET | `/api/chart?type=assignee` | Assignee statistics |

### Reports & Export
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/todo-lists/export` | Excel export with filters |
| GET | `/api/reports/todo-lists/preview` | Preview export data |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MySQL 8.0
- Docker & Docker Compose (optional)

### Local Development

1. **Clone and Install**
```bash
git clone <repository-url>
cd Todo-List-Rest-Api-NestJs
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
```
Edit `.env` with your database configuration:
```env
DATABASE_URL="mysql://username:password@localhost:3306/todo_list_nestjs"
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

3. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations (after setting up your MySQL database)
npx prisma db push

# Optional: Seed database
npx prisma db seed
```

4. **Start Development Server**
```bash
npm run start:dev
```

### Docker Deployment

1. **Start all services**
```bash
docker-compose up -d
```

2. **Run database migrations**
```bash
docker-compose exec app npx prisma db push
```

3. **Access services**
- API: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs
- PHPMyAdmin: http://localhost:8080

## 🧪 Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## 📖 API Documentation

### Create Todo
```json
POST /api/todo-lists
{
  "task": "Complete project documentation",
  "developer": "John Doe, Jane Smith",
  "due_date": "2025-09-25",
  "time_tracked": 120,
  "status": "in_progress",
  "priority": "high",
  "type": "feature_enhancements",
  "estimated_sp": 5,
  "actual_sp": 3
}
```

### Search & Filter
```bash
GET /api/todo-lists?search=project&sort_by=due_date&order_direction=asc
```

### Chart Data
```bash
GET /api/chart?type=status
GET /api/chart?type=priority  
GET /api/chart?type=assignee
```

### Excel Export
```bash
GET /api/reports/todo-lists/export?title=project&status=pending,in_progress&start=2025-09-01&end=2025-09-30
```

## 🔧 Configuration

### Database Schema (Prisma)
The application uses Prisma with MySQL, supporting:
- **TodoList** - Main todo items with all fields
- **User** - User management (ready for authentication)
- **Enums** - Status, Priority, Type with proper mapping

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | Required |
| `PORT` | Application port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `JWT_SECRET` | JWT secret for auth | Required |

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Docker Production
```bash
# Build production image
docker build -t todolist-api .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🧩 Architecture Patterns

### Clean Architecture
- **Controllers** - Handle HTTP requests/responses
- **Services** - Business logic and data operations
- **DTOs** - Data validation and transformation
- **Entities** - Domain models
- **Helpers** - Utility functions

### Error Handling
- Structured error responses
- HTTP status code mapping
- Validation error details
- Database error handling

### Testing Strategy
- Unit tests for services and helpers
- Integration tests for controllers
- E2E tests for complete workflows
- Mock database for fast testing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆚 Laravel vs NestJS Comparison

This NestJS implementation maintains 100% feature parity with the original Laravel version while offering:

### Advantages
- **Type Safety** - Full TypeScript support
- **Modern Architecture** - Decorator-based, modular design
- **Better Testing** - Built-in testing utilities
- **Performance** - Node.js event loop efficiency
- **Developer Experience** - Hot reload, auto-completion

### Maintained Features
- ✅ Exact same API endpoints and responses
- ✅ Identical validation rules and error handling
- ✅ Same Excel export functionality with styling
- ✅ Chart/statistics calculations match Laravel
- ✅ Bulk operations and search functionality
- ✅ Database schema and relationships

---

**Built with ❤️ using NestJS, TypeScript, Prisma, and Docker**
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
