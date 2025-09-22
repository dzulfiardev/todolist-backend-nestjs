export enum Status {
  PENDING = 'pending',
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  STUCK = 'stuck',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
  BEST_EFFORT = 'best_effort',
}

export enum Type {
  FEATURE_ENHANCEMENTS = 'feature_enhancements',
  OTHER = 'other',
  BUG = 'bug',
}