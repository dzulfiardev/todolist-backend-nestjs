import { PrismaClient } from '@prisma/client';

export class TestDatabaseHelper {
  private static prisma: PrismaClient;

  static async setupTestDatabase(): Promise<PrismaClient> {
    if (!this.prisma) {
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL || 'mysql://root:root@localhost:3309/todo_list_app_test',
          },
        },
      });
      
      await this.prisma.$connect();
    }
    
    return this.prisma;
  }

  static async cleanupTestDatabase(): Promise<void> {
    if (this.prisma) {
      // Clean all tables in reverse order due to foreign key constraints
      await this.prisma.todoList.deleteMany();
      
      await this.prisma.$disconnect();
      this.prisma = null as any;
    }
  }

  static async resetDatabase(): Promise<void> {
    if (this.prisma) {
      await this.prisma.todoList.deleteMany();
    }
  }

  static getPrismaClient(): PrismaClient {
    return this.prisma;
  }
}