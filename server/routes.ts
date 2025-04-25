import { Express, Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAdmin } from "./auth";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { products, categories, brands, locations, productAvailability } from "@shared/schema";
import { hashPassword } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Устанавливаем аутентификацию
  setupAuth(app);
  
  // API для категорий
  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await storage.getCategories();
      res.json(allCategories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
  
  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });
  
  app.post("/api/categories", requireAdmin, async (req, res) => {
    try {
      const category = await storage.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to create category" });
    }
  });
  
  // API для брендов
  app.get("/api/brands", async (req, res) => {
    try {
      const allBrands = await storage.getBrands();
      res.json(allBrands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });
  
  app.post("/api/brands", requireAdmin, async (req, res) => {
    try {
      const brand = await storage.createBrand(req.body);
      res.status(201).json(brand);
    } catch (error) {
      res.status(500).json({ error: "Failed to create brand" });
    }
  });
  
  // API для локаций
  app.get("/api/locations", async (req, res) => {
    try {
      const allLocations = await storage.getLocations();
      res.json(allLocations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });
  
  app.post("/api/locations", requireAdmin, async (req, res) => {
    try {
      const location = await storage.createLocation(req.body);
      res.status(201).json(location);
    } catch (error) {
      res.status(500).json({ error: "Failed to create location" });
    }
  });
  
  // API для товаров
  app.get("/api/products", async (req, res) => {
    try {
      const options: any = {};
      
      // Фильтрация по категории
      if (req.query.category) {
        options.categorySlug = req.query.category as string;
      }
      
      // Поиск
      if (req.query.search) {
        options.search = req.query.search as string;
      }
      
      // Популярные товары
      if (req.query.featured !== undefined) {
        options.featured = req.query.featured === 'true';
      }
      
      // Пагинация
      if (req.query.page) {
        options.page = parseInt(req.query.page as string);
      }
      
      if (req.query.pageSize) {
        options.pageSize = parseInt(req.query.pageSize as string);
      }
      
      // Фильтрация по брендам
      if (req.query.brands) {
        options.brands = (req.query.brands as string).split(',');
      }
      
      // Фильтрация по локациям
      if (req.query.locations) {
        options.locations = (req.query.locations as string).split(',');
      }
      
      const result = await storage.getProducts(options);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });
  
  app.get("/api/products/admin", requireAdmin, async (req, res) => {
    try {
      // Получаем все товары для админки (включая неактивные)
      const result = await db.select({
        product: products,
        category: categories,
        brand: brands,
      })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(brands, eq(products.brandId, brands.id));
        
      const productsWithRelations = result.map(({ product, category, brand }) => ({
        ...product,
        category,
        brand,
      }));
      
      res.json(productsWithRelations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });
  
  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });
  
  app.get("/api/products/:slug/availability", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      const availability = await storage.getProductAvailability(product.id);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product availability" });
    }
  });
  
  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      // Добавляем ID создателя
      const product = await storage.createProduct({
        ...req.body,
        createdBy: req.user?.id,
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  });
  
  app.patch("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.updateProduct(id, req.body);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });
  
  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });
  
  // API для наличия товаров
  app.post("/api/product-availability", requireAdmin, async (req, res) => {
    try {
      const availability = await storage.createProductAvailability(req.body);
      res.status(201).json(availability);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product availability" });
    }
  });
  
  app.patch("/api/product-availability/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quantity = req.body.quantity;
      const availability = await storage.updateProductAvailability(id, quantity);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product availability" });
    }
  });
  
  // Инициализация данных (создание первого админа)
  app.post("/api/init", async (req, res) => {
    try {
      // Проверяем, есть ли уже пользователи в системе
      const users = await db.query.users.findMany();
      
      if (users.length === 0) {
        // Создаем первого админа
        const adminUser = await storage.createUser({
          username: "admin",
          password: await hashPassword("admin123"),
          isAdmin: true
        });
        
        res.status(201).json({ message: "System initialized with admin user", user: adminUser });
      } else {
        res.status(400).json({ error: "System already initialized" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to initialize system" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}