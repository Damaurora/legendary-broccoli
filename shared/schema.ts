import { pgTable, serial, text, boolean, integer, timestamp, foreignKey, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Пользователи системы
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Категории товаров
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  slug: true,
  image: true,
  isActive: true,
});

// Бренды
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  logo: text("logo"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const insertBrandSchema = createInsertSchema(brands).pick({
  name: true,
  description: true,
  logo: true,
  isActive: true,
});

// Теги для товаров
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").default("#e63900"),
  description: text("description"),
  isSystem: boolean("is_system").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  productTags: many(productTags),
}));

export const insertTagSchema = createInsertSchema(tags).pick({
  name: true,
  color: true,
  description: true,
  isSystem: true,
});

// Связь тегов с продуктами
export const productTags = pgTable("product_tags", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  tagId: integer("tag_id").notNull().references(() => tags.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productTagsRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.id],
  }),
}));

export const insertProductTagSchema = createInsertSchema(productTags).pick({
  productId: true,
  tagId: true,
});

// Магазины/локации
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  workingHours: text("working_hours"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const locationsRelations = relations(locations, ({ many }) => ({
  productAvailability: many(productAvailability),
}));

export const insertLocationSchema = createInsertSchema(locations).pick({
  name: true,
  address: true,
  phone: true,
  workingHours: true,
  isActive: true,
});

// Товары
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  price: integer("price").notNull(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: 'set null' }),
  brandId: integer("brand_id").references(() => brands.id, { onDelete: 'set null' }),
  batteryCapacity: text("battery_capacity"),
  liquidVolume: text("liquid_volume"),
  power: text("power"),
  featured: boolean("featured").default(false),
  isNew: boolean("is_new").default(false),
  isActive: boolean("is_active").default(true),
  specifications: jsonb("specifications").$type<Record<string, string>>().default({}),
  flavors: text("flavors").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id, { onDelete: 'set null' }),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  creator: one(users, {
    fields: [products.createdBy],
    references: [users.id],
  }),
  availability: many(productAvailability),
}));

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  slug: true,
  image: true,
  price: true,
  categoryId: true,
  brandId: true,
  batteryCapacity: true,
  liquidVolume: true,
  power: true,
  featured: true,
  isNew: true,
  isActive: true,
  specifications: true,
  flavors: true,
  createdBy: true,
});

// Наличие товаров в магазинах
export const productAvailability = pgTable("product_availability", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  locationId: integer("location_id").notNull().references(() => locations.id, { onDelete: 'cascade' }),
  quantity: integer("quantity").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productAvailabilityRelations = relations(productAvailability, ({ one }) => ({
  product: one(products, {
    fields: [productAvailability.productId],
    references: [products.id],
  }),
  location: one(locations, {
    fields: [productAvailability.locationId],
    references: [locations.id],
  }),
}));

export const insertProductAvailabilitySchema = createInsertSchema(productAvailability).pick({
  productId: true,
  locationId: true,
  quantity: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type ProductAvailability = typeof productAvailability.$inferSelect;
export type InsertProductAvailability = z.infer<typeof insertProductAvailabilitySchema>;
