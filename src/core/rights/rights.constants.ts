// User Permissions
export const USER_READ = 1n << 0n;
export const USER_UPDATE = 1n << 1n;
export const USER_DELETE = 1n << 2n;

// Habit Permissions
export const HABITS_CREATE = 1n << 3n;
export const HABITS_READ = 1n << 4n;
export const HABITS_UPDATE = 1n << 5n;
export const HABITS_DELETE = 1n << 6n;

// Stats Permissions
export const STATS_READ = 1n << 7n;

// Tracking Permissions
export const TRACKING_CREATE = 1n << 8n;
export const TRACKING_READ = 1n << 9n;
export const TRACKING_UPDATE = 1n << 10n;
export const TRACKING_DELETE = 1n << 11n;

// Admin Permissions (System level)
export const SYSTEM_MANAGE = 1n << 60n; // High bit for admin stuff

// Group Permissions
export const GROUPS_CREATE = 1n << 12n;
export const GROUPS_READ = 1n << 13n;
export const GROUPS_UPDATE = 1n << 14n;
export const GROUPS_DELETE = 1n << 15n;
