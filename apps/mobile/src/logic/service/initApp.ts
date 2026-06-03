import { initDatabase } from '../../data/local/db';

export async function initApp() {
  try {
    await initDatabase();
  } catch (error) {
    console.log('数据库初始化失败', error);
    return;
  }
}
