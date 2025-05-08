import * as SQLite from 'expo-sqlite';
let db:any
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}



// ✅ Initialize database once
export const initDb = async () => {
     db = await SQLite.openDatabaseAsync('todos');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// ✅ Get all todos
export const getTodos = async (): Promise<Todo[]> => {
  const rows = await db.getAllAsync<Todo>('SELECT * FROM todos ORDER BY created_at DESC');
  return rows.map(row => ({
    ...row,
    completed: !!row.completed,
  }));
};

// ✅ Insert a new todo
export const insertTodo = async (title: string): Promise<void> => {
  await db.runAsync('INSERT INTO todos (title) VALUES (?)', title);
};

// ✅ Toggle todo status
export const toggleTodoStatus = async (id: number): Promise<void> => {
  await db.runAsync(
    'UPDATE todos SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END WHERE id = ?',
    id
  );
};

// ✅ Delete a todo
export const deleteTodo = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM todos WHERE id = ?', id);
};

// ✅ Get todo statistics
export const getStats = async (): Promise<{ total: number; completed: number; pending: number }> => {
  const row = await db.getFirstAsync<{ total: number; completed: number }>(
    'SELECT COUNT(*) as total, SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed FROM todos'
  );

  const total = row?.total ?? 0;
  const completed = row?.completed ?? 0;
  return { total, completed, pending: total - completed };
};
