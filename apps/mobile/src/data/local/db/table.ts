export async function createTables(sqlite: any) {
  sqlite.execute('PRAGMA foreign_keys = ON;');

  // ========================
  // 分类方式表
  // ========================
  sqlite.execute(`
    CREATE TABLE IF NOT EXISTS category_type (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL
    );
  `);

  // ========================
  // 一级分类表
  // ========================
  sqlite.execute(`
    CREATE TABLE IF NOT EXISTS category_level1 (
      id TEXT PRIMARY KEY,
      type_id TEXT NOT NULL,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      FOREIGN KEY (type_id) REFERENCES category_type(id)
    );
  `);

  sqlite.execute(`
    CREATE INDEX IF NOT EXISTS idx_category_level1_type_id ON category_level1(type_id);  
  `);

  // ========================
  // 二级分类表
  // ========================
  sqlite.execute(`
    CREATE TABLE IF NOT EXISTS category_level2 (
      id TEXT PRIMARY KEY,
      level1_id TEXT NOT NULL,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      FOREIGN KEY (level1_id) REFERENCES category_level1(id)
    );
  `);

  sqlite.execute(`
    CREATE INDEX IF NOT EXISTS idx_category_level2_level1_id ON category_level2(level1_id);  
  `);

  // ========================
  // 一级食谱表
  // ========================
  sqlite.execute(`
    CREATE TABLE IF NOT EXISTS recipe_group (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT
    );
  `);

  // ========================
  // 一级食谱 - 二级分类映射表
  // ========================
  sqlite.execute(`
    CREATE TABLE IF NOT EXISTS recipe_group_category (
      recipe_group_id TEXT NOT NULL,
      category_level2_id TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      PRIMARY KEY (recipe_group_id, category_level2_id),
      FOREIGN KEY (recipe_group_id) REFERENCES recipe_group(id),
      FOREIGN KEY (category_level2_id) REFERENCES category_level2(id)
    );
  `);

  sqlite.execute(`
    CREATE INDEX IF NOT EXISTS idx_recipe_group_category_category_level2_id ON recipe_group_category(category_level2_id);  
  `);

  // ========================
  // 二级食谱表
  // ========================
  sqlite.execute(`
    CREATE TABLE IF NOT EXISTS recipe (
      id TEXT PRIMARY KEY,
      recipe_group_id TEXT NOT NULL,
      name TEXT NOT NULL,
      tags TEXT,
      time INTEGER,
      description TEXT,
      calories INTEGER,
      image TEXT,
      order_index INTEGER NOT NULL,
      FOREIGN KEY (recipe_group_id) REFERENCES recipe_group(id) ON DELETE CASCADE
    );
  `);

  // ========================
  // 步骤表
  // ========================
  sqlite.execute(`
    CREATE TABLE IF NOT EXISTS recipe_step (
      id TEXT PRIMARY KEY,
      recipe_id TEXT NOT NULL,
      step_order INTEGER NOT NULL,
      content TEXT NOT NULL,
      duration INTEGER,
      image TEXT,
      note TEXT,
      FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE
    );
  `);

  // ========================
  // 食材表
  // ========================
  sqlite.execute(`
    CREATE TABLE IF NOT EXISTS ingredient (
      id TEXT PRIMARY KEY,
      recipe_id TEXT,
      step_id TEXT,
      name TEXT NOT NULL,
      amount REAL,
      type TEXT,
      order_index INTEGER NOT NULL,
      FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE,
      FOREIGN KEY (step_id) REFERENCES recipe_step(id) ON DELETE CASCADE
    );
  `);

  sqlite.execute(`
    CREATE INDEX IF NOT EXISTS idx_ingredient_recipe_id ON ingredient(recipe_id);  
  `);

  // ========================
  // 冰箱库存表
  // ========================
  sqlite.execute(`
    CREATE TABLE IF NOT EXISTS fridge_stock (
      id TEXT PRIMARY KEY,
      food_name TEXT NOT NULL,
      category TEXT,
      store_date TEXT,
      expire_date TEXT
    );
  `);

  // ========================
  // 日程表
  // ========================
  sqlite.execute(`
    CREATE TABLE IF NOT EXISTS meal_schedule (
      date TEXT NOT NULL,
      recipe_id TEXT NOT NULL,
      stage TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      completed INTEGER,  -- 0未完成 1已完成
      PRIMARY KEY (date, recipe_id, stage),
      FOREIGN KEY (recipe_id) REFERENCES recipe(id) 
    );
  `);
}
