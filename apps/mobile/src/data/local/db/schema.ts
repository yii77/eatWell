import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

// ========================
// 分类方式表
// ========================
export const categoryType = sqliteTable('category_type', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  orderIndex: integer('order_index').notNull(),
});

// ========================
// 一级分类表
// ========================
export const categoryLevel1 = sqliteTable('category_level1', {
  id: text('id').primaryKey(),
  typeId: text('type_id')
    .notNull()
    .references(() => categoryType.id),

  name: text('name').notNull(),
  orderIndex: integer('order_index').notNull(),
});

// ========================
// 二级分类表
// ========================
export const categoryLevel2 = sqliteTable('category_level2', {
  id: text('id').primaryKey(),
  level1Id: text('level1_id')
    .notNull()
    .references(() => categoryLevel1.id),
  name: text('name').notNull(),
  orderIndex: integer('order_index').notNull(),
});

// ========================
// 一级食谱表（recipe_group）
// ========================
export const recipeGroup = sqliteTable('recipe_group', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  image: text('image'),
});

// ========================
// 一级食谱 - 分类映射
// ========================
export const recipeGroupCategory = sqliteTable(
  'recipe_group_category',
  {
    recipeGroupId: text('recipe_group_id')
      .notNull()
      .references(() => recipeGroup.id),
    categoryLevel2Id: text('category_level2_id')
      .notNull()
      .references(() => categoryLevel2.id),
    orderIndex: integer('order_index').notNull(),
  },
  table => ({
    pk: primaryKey({
      columns: [table.recipeGroupId, table.categoryLevel2Id],
    }),
  }),
);
// ========================
// 二级食谱表
// ========================
export const recipe = sqliteTable('recipe', {
  id: text('id').primaryKey(),

  recipeGroupId: text('recipe_group_id')
    .notNull()
    .references(() => recipeGroup.id, { onDelete: 'cascade' }),

  name: text('name').notNull(),
  tags: text('tags'),
  time: integer('time'),
  description: text('description'),
  calories: integer('calories'),
  image: text('image'),
  orderIndex: integer('order_index').notNull(),
});

// ========================
// 步骤表
// ========================
export const recipeStep = sqliteTable('recipe_step', {
  id: text('id').primaryKey(),

  recipeId: text('recipe_id')
    .notNull()
    .references(() => recipe.id, { onDelete: 'cascade' }),

  stepOrder: integer('step_order').notNull(),
  content: text('content').notNull(),
  duration: integer('duration'),
  image: text('image'),
  note: text('note'),
});

// ========================
// 食材表
// ========================
export const ingredient = sqliteTable('ingredient', {
  id: text('id').primaryKey(),

  recipeId: text('recipe_id').references(() => recipe.id, {
    onDelete: 'cascade',
  }),

  stepId: text('step_id').references(() => recipeStep.id, {
    onDelete: 'cascade',
  }),

  name: text('name').notNull(),
  amount: real('amount'),
  type: text('type'),
  orderIndex: integer('order_index').notNull(),
});

// ========================
// 冰箱库存表
// ========================
export const fridgeStock = sqliteTable('fridge_stock', {
  id: text('id').primaryKey(),

  foodName: text('food_name').notNull(),
  category: text('category'),

  storeDate: text('store_date'),
  expireDate: text('expire_date'),
});

// ========================
// 日程表
// ========================
export const mealSchedule = sqliteTable(
  'meal_schedule',
  {
    date: text('date').notNull(),

    recipeId: text('recipe_id')
      .notNull()
      .references(() => recipe.id),

    stage: text('stage').notNull(),

    quantity: integer('quantity').default(1),

    completed: integer('completed'),
  },
  table => ({
    pk: primaryKey({
      columns: [table.date, table.recipeId, table.stage],
    }),
  }),
);
