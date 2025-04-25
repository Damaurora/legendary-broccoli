import session from "express-session";
import connectPg from "connect-pg-simple";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { pool } from "./db";
import {
  users,
  categories,
  brands,
  locations,
  products,
  productAvailability,
  User,
  InsertUser,
  Category,
  InsertCategory,
  Brand,
  InsertBrand,
  Location,
  InsertLocation,
  Product,
  InsertProduct,
  ProductAvailability,
  InsertProductAvailability
} from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Пользователи
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Категории
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Бренды
  getBrands(): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;

  // Локации
  getLocations(): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;

  // Товары
  getProducts(options?: {
    categorySlug?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    pageSize?: number;
    brands?: string[];
    locations?: string[];
  }): Promise<{ products: Product[]; pagination: any }>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Наличие товаров
  getProductAvailability(productId: number): Promise<ProductAvailability[]>;
  createProductAvailability(availability: InsertProductAvailability): Promise<ProductAvailability>;
  updateProductAvailability(id: number, quantity: number): Promise<ProductAvailability>;

  // Сессии
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true 
    });
  }

  // Пользователи
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Категории
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).where(eq(categories.isActive, true));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories)
      .where(eq(categories.slug, slug))
      .where(eq(categories.isActive, true));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Бренды
  async getBrands(): Promise<Brand[]> {
    return db.select().from(brands).where(eq(brands.isActive, true));
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const [newBrand] = await db.insert(brands).values(brand).returning();
    return newBrand;
  }

  // Локации
  async getLocations(): Promise<Location[]> {
    return db.select().from(locations).where(eq(locations.isActive, true));
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }

  // Товары
  async getProducts(options?: {
    categorySlug?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    pageSize?: number;
    brands?: string[];
    locations?: string[];
  }): Promise<{ products: Product[]; pagination: any }> {
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 12;
    const offset = (page - 1) * pageSize;

    let query = db.select({
      product: products,
      category: categories,
      brand: brands,
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(eq(products.isActive, true));

    // Применяем фильтры
    if (options?.categorySlug) {
      const category = await this.getCategoryBySlug(options.categorySlug);
      if (category) {
        query = query.where(eq(products.categoryId, category.id));
      }
    }

    if (options?.featured !== undefined) {
      query = query.where(eq(products.featured, options.featured));
    }

    if (options?.search) {
      query = query.where(
        sql`${products.name} ILIKE ${'%' + options.search + '%'} OR ${products.description} ILIKE ${'%' + options.search + '%'}`
      );
    }

    // Выполняем запрос
    const result = await query.limit(pageSize).offset(offset);

    // Получаем общее количество для пагинации
    const [{ count }] = await db.select({
      count: sql<number>`count(*)`,
    }).from(products);

    const totalPages = Math.ceil(Number(count) / pageSize);

    // Преобразуем результаты
    const productsWithRelations = result.map(({ product, category, brand }) => ({
      ...product,
      category,
      brand,
    }));

    return {
      products: productsWithRelations,
      pagination: {
        page,
        pageSize,
        totalCount: Number(count),
        totalPages
      }
    };
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [result] = await db.select({
      product: products,
      category: categories,
      brand: brands,
    })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(eq(products.slug, slug))
      .where(eq(products.isActive, true));

    if (!result) return undefined;

    return {
      ...result.product,
      category: result.category,
      brand: result.brand,
    } as Product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db.update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.update(products)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(products.id, id));
  }

  // Наличие товаров
  async getProductAvailability(productId: number): Promise<ProductAvailability[]> {
    const result = await db.select({
      availability: productAvailability,
      location: locations,
    })
      .from(productAvailability)
      .leftJoin(locations, eq(productAvailability.locationId, locations.id))
      .where(eq(productAvailability.productId, productId));

    return result.map(({ availability, location }) => ({
      ...availability,
      location,
    })) as ProductAvailability[];
  }

  async createProductAvailability(availability: InsertProductAvailability): Promise<ProductAvailability> {
    const [newAvailability] = await db.insert(productAvailability)
      .values(availability)
      .returning();
    return newAvailability;
  }

  async updateProductAvailability(id: number, quantity: number): Promise<ProductAvailability> {
    const [updatedAvailability] = await db.update(productAvailability)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(productAvailability.id, id))
      .returning();
    return updatedAvailability;
  }
}

// Импортируем sql для сложных запросов
import { sql } from "drizzle-orm";

export const storage = new DatabaseStorage();
