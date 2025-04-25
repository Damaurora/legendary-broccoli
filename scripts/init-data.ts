import { db } from "../server/db";
import { users, brands, categories, locations, products, productAvailability } from "../shared/schema";
import { hashPassword } from "../server/auth";

async function main() {
  console.log("Инициализация данных...");

  // Создаем локации магазинов
  console.log("Создание локаций магазинов...");
  const [location1, location2] = await db.insert(locations).values([
    {
      name: "Магазин на ул. Гагарина",
      address: "ул. Гагарина, 12",
      phone: "+7 (999) 123-45-67",
      workingHours: "10:00 - 20:00",
    },
    {
      name: "Магазин на ул. Победы",
      address: "ул. Победы, 45",
      phone: "+7 (999) 765-43-21",
      workingHours: "10:00 - 21:00",
    },
  ]).returning();
  
  console.log(`Созданы локации: ${location1.name}, ${location2.name}`);

  // Создаем бренды
  console.log("Создание брендов...");
  const [elfbar, ijoy, smoant, smok, brusko] = await db.insert(brands).values([
    {
      name: "Elf Bar",
      description: "Популярный производитель одноразовых электронных сигарет",
      logo: "https://vapehome.ru/image/cache/catalog/brand/elfbar-130x100.png",
    },
    {
      name: "IJOY",
      description: "Известный производитель под-систем и баков",
      logo: "https://vapehome.ru/image/cache/catalog/brand/ijoy-130x100.png",
    },
    {
      name: "Smoant",
      description: "Премиальный производитель под-модов",
      logo: "https://vapehome.ru/image/cache/catalog/brand/smoant-130x100.png",
    },
    {
      name: "SMOK",
      description: "Ведущий производитель вейп-устройств",
      logo: "https://vapehome.ru/image/cache/catalog/brand/smok-130x100.png",
    },
    {
      name: "Brusko",
      description: "Российский производитель жидкостей для вейпа",
      logo: "https://vapehome.ru/image/cache/catalog/brand/brusko-130x100.png",
    },
  ]).returning();
  
  console.log(`Созданы бренды: ${elfbar.name}, ${ijoy.name}, ${smoant.name}, ${smok.name}, ${brusko.name}`);

  // Создаем категории
  console.log("Создание категорий...");
  const [cat1, cat2, cat3, cat4, cat5, cat6] = await db.insert(categories).values([
    {
      name: "Одноразовые устройства",
      description: "Удобные одноразовые электронные сигареты",
      slug: "disposable",
      image: "https://vapehome.ru/image/cache/catalog/product/2-800x800.png",
    },
    {
      name: "Поды",
      description: "Компактные устройства с многоразовыми картриджами",
      slug: "pods",
      image: "https://vapehome.ru/image/cache/catalog/product/3-800x800.png",
    },
    {
      name: "Под-моды",
      description: "Мощные устройства с регулировкой мощности",
      slug: "pod-mods",
      image: "https://vapehome.ru/image/cache/catalog/product/4-800x800.png",
    },
    {
      name: "Жидкости",
      description: "Премиальные жидкости для электронных сигарет",
      slug: "liquids",
      image: "https://vapehome.ru/image/cache/catalog/product/5-800x800.png",
    },
    {
      name: "Табак",
      description: "Табачные смеси для кальяна",
      slug: "tobacco",
      image: "https://vapehome.ru/image/cache/catalog/product/6-800x800.png",
    },
    {
      name: "Расходники",
      description: "Сменные испарители, картриджи и аксессуары",
      slug: "accessories",
      image: "https://vapehome.ru/image/cache/catalog/product/7-800x800.png",
    },
  ]).returning();
  
  console.log(`Созданы категории: ${cat1.name}, ${cat2.name}, ${cat3.name}, ${cat4.name}, ${cat5.name}, ${cat6.name}`);

  // Создаем товары категории "Одноразовые устройства"
  console.log("Создание одноразовых устройств...");
  const disposables = await db.insert(products).values([
    {
      name: "Elf Bar BC5000 Watermelon",
      description: "Одноразовая электронная сигарета со вкусом арбуза. До 5000 затяжек.",
      slug: "elf-bar-bc5000-watermelon",
      image: "https://vapehome.ru/image/cache/catalog/product/elfbar-bc5000-800x800.png",
      price: 1100,
      categoryId: cat1.id,
      brandId: elfbar.id,
      batteryCapacity: "650 mAh",
      liquidVolume: "13 ml",
      featured: true,
      isNew: true,
      specifications: {
        "Тип устройства": "Одноразовый",
        "Количество затяжек": "До 5000",
        "Никотин": "2%",
        "Аккумулятор": "650 mAh",
        "Объем жидкости": "13 ml",
        "Вкус": "Арбуз"
      },
      flavors: ["Арбуз"]
    },
    {
      name: "Elf Bar BC5000 Blueberry",
      description: "Одноразовая электронная сигарета со вкусом черники. До 5000 затяжек.",
      slug: "elf-bar-bc5000-blueberry",
      image: "https://vapehome.ru/image/cache/catalog/product/elfbar-bc5000-blue-800x800.png",
      price: 1100,
      categoryId: cat1.id,
      brandId: elfbar.id,
      batteryCapacity: "650 mAh",
      liquidVolume: "13 ml",
      featured: false,
      isNew: true,
      specifications: {
        "Тип устройства": "Одноразовый",
        "Количество затяжек": "До 5000",
        "Никотин": "2%",
        "Аккумулятор": "650 mAh",
        "Объем жидкости": "13 ml",
        "Вкус": "Черника"
      },
      flavors: ["Черника"]
    },
    {
      name: "SMOK NOVO Bar 10K Strawberry Ice",
      description: "Одноразовая электронная сигарета со вкусом клубники со льдом. До 10000 затяжек.",
      slug: "smok-novo-bar-10k-strawberry-ice",
      image: "https://vapehome.ru/image/cache/catalog/product/smok-novo-bar-800x800.png",
      price: 1500,
      categoryId: cat1.id,
      brandId: smok.id,
      batteryCapacity: "800 mAh",
      liquidVolume: "18 ml",
      featured: true,
      isNew: false,
      specifications: {
        "Тип устройства": "Одноразовый",
        "Количество затяжек": "До 10000",
        "Никотин": "2%",
        "Аккумулятор": "800 mAh",
        "Объем жидкости": "18 ml",
        "Вкус": "Клубника со льдом"
      },
      flavors: ["Клубника со льдом"]
    },
    {
      name: "Elf Bar 2500 Mango",
      description: "Компактная одноразовая электронная сигарета со вкусом манго. До 2500 затяжек.",
      slug: "elf-bar-2500-mango",
      image: "https://vapehome.ru/image/cache/catalog/product/elfbar-2500-800x800.png",
      price: 850,
      categoryId: cat1.id,
      brandId: elfbar.id,
      batteryCapacity: "550 mAh",
      liquidVolume: "6.5 ml",
      featured: false,
      isNew: false,
      specifications: {
        "Тип устройства": "Одноразовый",
        "Количество затяжек": "До 2500",
        "Никотин": "2%",
        "Аккумулятор": "550 mAh",
        "Объем жидкости": "6.5 ml",
        "Вкус": "Манго"
      },
      flavors: ["Манго"]
    },
    {
      name: "SMOK NOVO Bar 5K Grape Ice",
      description: "Одноразовая электронная сигарета со вкусом винограда со льдом. До 5000 затяжек.",
      slug: "smok-novo-bar-5k-grape-ice",
      image: "https://vapehome.ru/image/cache/catalog/product/smok-novo-bar-5k-800x800.png",
      price: 1200,
      categoryId: cat1.id,
      brandId: smok.id,
      batteryCapacity: "650 mAh",
      liquidVolume: "13 ml",
      featured: true,
      isNew: false,
      specifications: {
        "Тип устройства": "Одноразовый",
        "Количество затяжек": "До 5000",
        "Никотин": "2%",
        "Аккумулятор": "650 mAh",
        "Объем жидкости": "13 ml",
        "Вкус": "Виноград со льдом"
      },
      flavors: ["Виноград со льдом"]
    },
  ]).returning();
  
  console.log(`Созданы одноразовые устройства: ${disposables.length} шт.`);

  // Создаем товары категории "Поды"
  console.log("Создание подов...");
  const pods = await db.insert(products).values([
    {
      name: "IJOY Neptune Pod Kit",
      description: "Компактная под-система с картриджем на 2 мл. Аккумулятор 650 mAh.",
      slug: "ijoy-neptune-pod-kit",
      image: "https://vapehome.ru/image/cache/catalog/product/ijoy-neptune-800x800.png",
      price: 1900,
      categoryId: cat2.id,
      brandId: ijoy.id,
      batteryCapacity: "650 mAh",
      liquidVolume: "2 ml",
      featured: true,
      isNew: true,
      specifications: {
        "Тип устройства": "Под-система",
        "Аккумулятор": "650 mAh",
        "Объем картриджа": "2 ml",
        "Мощность": "11-15W",
        "Сопротивление испарителя": "1.0 Ом",
        "Индикация": "LED"
      },
      flavors: []
    },
    {
      name: "SMOK Novo 4 Pod Kit",
      description: "Под-система с вариативной мощностью и сменными картриджами.",
      slug: "smok-novo-4-pod-kit",
      image: "https://vapehome.ru/image/cache/catalog/product/smok-novo-4-800x800.png",
      price: 2200,
      categoryId: cat2.id,
      brandId: smok.id,
      batteryCapacity: "800 mAh",
      liquidVolume: "2 ml",
      featured: false,
      isNew: true,
      specifications: {
        "Тип устройства": "Под-система",
        "Аккумулятор": "800 mAh",
        "Объем картриджа": "2 ml",
        "Мощность": "5-25W",
        "Сопротивление испарителя": "0.8/1.2 Ом",
        "Индикация": "LED"
      },
      flavors: []
    },
    {
      name: "IJOY Jupiter Pod Kit",
      description: "Элегантная под-система с системой защиты от протечек.",
      slug: "ijoy-jupiter-pod-kit",
      image: "https://vapehome.ru/image/cache/catalog/product/ijoy-jupiter-800x800.png",
      price: 2100,
      categoryId: cat2.id,
      brandId: ijoy.id,
      batteryCapacity: "700 mAh",
      liquidVolume: "2 ml",
      featured: true,
      isNew: false,
      specifications: {
        "Тип устройства": "Под-система",
        "Аккумулятор": "700 mAh",
        "Объем картриджа": "2 ml",
        "Мощность": "9-15W",
        "Сопротивление испарителя": "1.2 Ом",
        "Индикация": "LED"
      },
      flavors: []
    },
    {
      name: "SMOK RPM 5 Pro Pod Kit",
      description: "Мощная под-система с крупным баком и экраном.",
      slug: "smok-rpm-5-pro-pod-kit",
      image: "https://vapehome.ru/image/cache/catalog/product/smok-rpm-5-pro-800x800.png",
      price: 2800,
      categoryId: cat2.id,
      brandId: smok.id,
      batteryCapacity: "1250 mAh",
      liquidVolume: "5 ml",
      featured: false,
      isNew: false,
      specifications: {
        "Тип устройства": "Под-система",
        "Аккумулятор": "1250 mAh",
        "Объем картриджа": "5 ml",
        "Мощность": "5-80W",
        "Сопротивление испарителя": "0.15-1.0 Ом",
        "Индикация": "OLED экран"
      },
      flavors: []
    },
    {
      name: "IJOY Luna Pod Kit",
      description: "Бюджетная под-система с автоматической активацией.",
      slug: "ijoy-luna-pod-kit",
      image: "https://vapehome.ru/image/cache/catalog/product/ijoy-luna-800x800.png",
      price: 1600,
      categoryId: cat2.id,
      brandId: ijoy.id,
      batteryCapacity: "500 mAh",
      liquidVolume: "1.8 ml",
      featured: true,
      isNew: false,
      specifications: {
        "Тип устройства": "Под-система",
        "Аккумулятор": "500 mAh",
        "Объем картриджа": "1.8 ml",
        "Мощность": "8-12W",
        "Сопротивление испарителя": "1.5 Ом",
        "Активация": "Автоматическая при затяжке"
      },
      flavors: []
    },
  ]).returning();
  
  console.log(`Созданы поды: ${pods.length} шт.`);

  // Создаем товары категории "Под-моды"
  console.log("Создание под-модов...");
  const podMods = await db.insert(products).values([
    {
      name: "Smoant Charon Baby Plus",
      description: "Компактный под-мод с регулировкой мощности и ярким дисплеем.",
      slug: "smoant-charon-baby-plus",
      image: "https://vapehome.ru/image/cache/catalog/product/smoant-charon-baby-plus-800x800.png",
      price: 3200,
      categoryId: cat3.id,
      brandId: smoant.id,
      batteryCapacity: "1500 mAh",
      liquidVolume: "3 ml",
      power: "5-40W",
      featured: true,
      isNew: true,
      specifications: {
        "Тип устройства": "Под-мод",
        "Аккумулятор": "1500 mAh",
        "Объем бака": "3 ml",
        "Мощность": "5-40W",
        "Сопротивление испарителя": "0.2-3.0 Ом",
        "Индикация": "Цветной дисплей",
        "Защита": "От короткого замыкания, перегрева, автоотключение"
      },
      flavors: []
    },
    {
      name: "SMOK Nord X Pod Mod Kit",
      description: "Мощный под-мод с большим аккумулятором и разнообразием испарителей.",
      slug: "smok-nord-x-pod-mod-kit",
      image: "https://vapehome.ru/image/cache/catalog/product/smok-nord-x-800x800.png",
      price: 2900,
      categoryId: cat3.id,
      brandId: smok.id,
      batteryCapacity: "1500 mAh",
      liquidVolume: "4.5 ml",
      power: "5-60W",
      featured: false,
      isNew: true,
      specifications: {
        "Тип устройства": "Под-мод",
        "Аккумулятор": "1500 mAh",
        "Объем бака": "4.5 ml",
        "Мощность": "5-60W",
        "Сопротивление испарителя": "0.15-2.5 Ом",
        "Индикация": "LED",
        "Защита": "От короткого замыкания, перегрева, перезарядки"
      },
      flavors: []
    },
    {
      name: "Smoant Knight 80",
      description: "Премиальный под-мод с регулировкой температуры и сменными аккумуляторами.",
      slug: "smoant-knight-80",
      image: "https://vapehome.ru/image/cache/catalog/product/smoant-knight-80-800x800.png",
      price: 3900,
      categoryId: cat3.id,
      brandId: smoant.id,
      liquidVolume: "4 ml",
      power: "1-80W",
      featured: true,
      isNew: false,
      specifications: {
        "Тип устройства": "Под-мод",
        "Аккумулятор": "Сменный 18650 (не входит в комплект)",
        "Объем бака": "4 ml",
        "Мощность": "1-80W",
        "Режимы": "VW/TC/Curve",
        "Сопротивление испарителя": "0.1-3.0 Ом",
        "Индикация": "Цветной дисплей 0.96 дюйма",
        "Материал корпуса": "Цинковый сплав + кожа"
      },
      flavors: []
    },
    {
      name: "IJOY Captain PM40",
      description: "Стильный под-мод с автоматическим определением сопротивления.",
      slug: "ijoy-captain-pm40",
      image: "https://vapehome.ru/image/cache/catalog/product/ijoy-captain-pm40-800x800.png",
      price: 2600,
      categoryId: cat3.id,
      brandId: ijoy.id,
      batteryCapacity: "1800 mAh",
      liquidVolume: "4 ml",
      power: "5-40W",
      featured: false,
      isNew: false,
      specifications: {
        "Тип устройства": "Под-мод",
        "Аккумулятор": "1800 mAh",
        "Объем бака": "4 ml",
        "Мощность": "5-40W",
        "Сопротивление испарителя": "0.15-3.0 Ом",
        "Индикация": "OLED экран",
        "Защита": "От короткого замыкания, перезарядки, таймер затяжки"
      },
      flavors: []
    },
    {
      name: "Smoant Pasito 2",
      description: "Компактный под-мод с обслуживаемой базой и регулировкой воздушного потока.",
      slug: "smoant-pasito-2",
      image: "https://vapehome.ru/image/cache/catalog/product/smoant-pasito-2-800x800.png",
      price: 2800,
      categoryId: cat3.id,
      brandId: smoant.id,
      batteryCapacity: "2500 mAh",
      liquidVolume: "6 ml",
      power: "10-30W",
      featured: true,
      isNew: false,
      specifications: {
        "Тип устройства": "Под-мод",
        "Аккумулятор": "2500 mAh",
        "Объем бака": "6 ml",
        "Мощность": "10-30W",
        "Сопротивление испарителя": "0.3-3.0 Ом",
        "Индикация": "LED",
        "Особенности": "Обслуживаемая база, регулировка воздушного потока"
      },
      flavors: []
    },
  ]).returning();
  
  console.log(`Созданы под-моды: ${podMods.length} шт.`);

  // Создаем товары категории "Жидкости"
  console.log("Создание жидкостей...");
  const liquids = await db.insert(products).values([
    {
      name: "Brusko Energy 60 мл",
      description: "Премиальная жидкость со вкусом энергетического напитка.",
      slug: "brusko-energy-60ml",
      image: "https://vapehome.ru/image/cache/catalog/product/brusko-energy-800x800.png",
      price: 750,
      categoryId: cat4.id,
      brandId: brusko.id,
      liquidVolume: "60 ml",
      featured: true,
      isNew: true,
      specifications: {
        "Тип": "Жидкость для вейпа",
        "Объем": "60 ml",
        "VG/PG": "70/30",
        "Никотин": "3 мг",
        "Вкус": "Энергетический напиток"
      },
      flavors: ["Энергетический напиток"]
    },
    {
      name: "Brusko Strawberry Milkshake 60 мл",
      description: "Десертная жидкость со вкусом клубничного милкшейка.",
      slug: "brusko-strawberry-milkshake-60ml",
      image: "https://vapehome.ru/image/cache/catalog/product/brusko-strawberry-milkshake-800x800.png",
      price: 750,
      categoryId: cat4.id,
      brandId: brusko.id,
      liquidVolume: "60 ml",
      featured: false,
      isNew: true,
      specifications: {
        "Тип": "Жидкость для вейпа",
        "Объем": "60 ml",
        "VG/PG": "70/30",
        "Никотин": "3 мг",
        "Вкус": "Клубничный милкшейк"
      },
      flavors: ["Клубничный милкшейк"]
    },
    {
      name: "Brusko Mango Ice 60 мл",
      description: "Освежающая жидкость со вкусом манго и ментола.",
      slug: "brusko-mango-ice-60ml",
      image: "https://vapehome.ru/image/cache/catalog/product/brusko-mango-ice-800x800.png",
      price: 750,
      categoryId: cat4.id,
      brandId: brusko.id,
      liquidVolume: "60 ml",
      featured: true,
      isNew: false,
      specifications: {
        "Тип": "Жидкость для вейпа",
        "Объем": "60 ml",
        "VG/PG": "70/30",
        "Никотин": "3 мг",
        "Вкус": "Манго со льдом"
      },
      flavors: ["Манго", "Лед"]
    },
    {
      name: "Brusko Crazy Melon 60 мл",
      description: "Фруктовая жидкость с миксом из различных дынь.",
      slug: "brusko-crazy-melon-60ml",
      image: "https://vapehome.ru/image/cache/catalog/product/brusko-crazy-melon-800x800.png",
      price: 750,
      categoryId: cat4.id,
      brandId: brusko.id,
      liquidVolume: "60 ml",
      featured: false,
      isNew: false,
      specifications: {
        "Тип": "Жидкость для вейпа",
        "Объем": "60 ml",
        "VG/PG": "70/30",
        "Никотин": "3 мг",
        "Вкус": "Дыня"
      },
      flavors: ["Дыня"]
    },
    {
      name: "Brusko Blueberry Muffin 60 мл",
      description: "Десертная жидкость со вкусом черничного маффина.",
      slug: "brusko-blueberry-muffin-60ml",
      image: "https://vapehome.ru/image/cache/catalog/product/brusko-blueberry-muffin-800x800.png",
      price: 750,
      categoryId: cat4.id,
      brandId: brusko.id,
      liquidVolume: "60 ml",
      featured: true,
      isNew: false,
      specifications: {
        "Тип": "Жидкость для вейпа",
        "Объем": "60 ml",
        "VG/PG": "70/30",
        "Никотин": "3 мг",
        "Вкус": "Черничный маффин"
      },
      flavors: ["Черничный маффин"]
    },
  ]).returning();
  
  console.log(`Созданы жидкости: ${liquids.length} шт.`);

  // Создаем товары категории "Табак"
  console.log("Создание табака...");
  const tobacco = await db.insert(products).values([
    {
      name: "Табак для кальяна Darkside Core Grape Core 30 г",
      description: "Средне-крепкий табак со вкусом сочного винограда.",
      slug: "darkside-grape-core-30g",
      image: "https://vapehome.ru/image/cache/catalog/product/darkside-grape-core-800x800.png",
      price: 890,
      categoryId: cat5.id,
      brandId: null,
      liquidVolume: "30 g",
      featured: true,
      isNew: true,
      specifications: {
        "Тип": "Табак для кальяна",
        "Вес": "30 г",
        "Крепость": "Средняя",
        "Вкус": "Виноград"
      },
      flavors: ["Виноград"]
    },
    {
      name: "Табак для кальяна Darkside Core Lemon Blast 30 г",
      description: "Средне-крепкий табак со вкусом кислого лимона.",
      slug: "darkside-lemon-blast-30g",
      image: "https://vapehome.ru/image/cache/catalog/product/darkside-lemon-blast-800x800.png",
      price: 890,
      categoryId: cat5.id,
      brandId: null,
      liquidVolume: "30 g",
      featured: false,
      isNew: true,
      specifications: {
        "Тип": "Табак для кальяна",
        "Вес": "30 г",
        "Крепость": "Средняя",
        "Вкус": "Лимон"
      },
      flavors: ["Лимон"]
    },
    {
      name: "Табак для кальяна Element Water Raspberry 30 г",
      description: "Легкий табак с ароматом сладкой малины.",
      slug: "element-water-raspberry-30g",
      image: "https://vapehome.ru/image/cache/catalog/product/element-water-raspberry-800x800.png",
      price: 790,
      categoryId: cat5.id,
      brandId: null,
      liquidVolume: "30 g",
      featured: true,
      isNew: false,
      specifications: {
        "Тип": "Табак для кальяна",
        "Вес": "30 г",
        "Крепость": "Легкая",
        "Вкус": "Малина"
      },
      flavors: ["Малина"]
    },
    {
      name: "Табак для кальяна Darkside Medium Blackberry 30 г",
      description: "Крепкий табак со вкусом ежевики.",
      slug: "darkside-medium-blackberry-30g",
      image: "https://vapehome.ru/image/cache/catalog/product/darkside-medium-blackberry-800x800.png",
      price: 890,
      categoryId: cat5.id,
      brandId: null,
      liquidVolume: "30 g",
      featured: false,
      isNew: false,
      specifications: {
        "Тип": "Табак для кальяна",
        "Вес": "30 г",
        "Крепость": "Крепкий",
        "Вкус": "Ежевика"
      },
      flavors: ["Ежевика"]
    },
    {
      name: "Табак для кальяна Element Fire Strawberry 30 г",
      description: "Крепкий табак с ароматом сладкой клубники.",
      slug: "element-fire-strawberry-30g",
      image: "https://vapehome.ru/image/cache/catalog/product/element-fire-strawberry-800x800.png",
      price: 790,
      categoryId: cat5.id,
      brandId: null,
      liquidVolume: "30 g",
      featured: true,
      isNew: false,
      specifications: {
        "Тип": "Табак для кальяна",
        "Вес": "30 г",
        "Крепость": "Крепкая",
        "Вкус": "Клубника"
      },
      flavors: ["Клубника"]
    },
  ]).returning();
  
  console.log(`Создан табак: ${tobacco.length} шт.`);

  // Создаем товары категории "Расходники"
  console.log("Создание расходников...");
  const accessories = await db.insert(products).values([
    {
      name: "Испаритель SMOK Nord 0.6 Ом (5 шт.)",
      description: "Сменные испарители для под-системы SMOK Nord с сопротивлением 0.6 Ом.",
      slug: "smok-nord-coil-0-6-ohm-5pcs",
      image: "https://vapehome.ru/image/cache/catalog/product/smok-nord-coil-800x800.png",
      price: 950,
      categoryId: cat6.id,
      brandId: smok.id,
      featured: true,
      isNew: true,
      specifications: {
        "Тип": "Сменные испарители",
        "Совместимость": "SMOK Nord, Nord 2, Nord 4, RPM40",
        "Сопротивление": "0.6 Ом",
        "Рекомендуемая мощность": "15-25W",
        "Количество в упаковке": "5 шт."
      },
      flavors: []
    },
    {
      name: "Картридж IJOY Neptune (2 мл)",
      description: "Сменный картридж для под-системы IJOY Neptune.",
      slug: "ijoy-neptune-cartridge-2ml",
      image: "https://vapehome.ru/image/cache/catalog/product/ijoy-neptune-cartridge-800x800.png",
      price: 450,
      categoryId: cat6.id,
      brandId: ijoy.id,
      liquidVolume: "2 ml",
      featured: false,
      isNew: true,
      specifications: {
        "Тип": "Сменный картридж",
        "Совместимость": "IJOY Neptune",
        "Объем": "2 мл",
        "Сопротивление испарителя": "1.0 Ом",
        "Материал": "PCTG"
      },
      flavors: []
    },
    {
      name: "Испаритель Smoant Pasito RBA",
      description: "Обслуживаемая база для под-системы Smoant Pasito.",
      slug: "smoant-pasito-rba",
      image: "https://vapehome.ru/image/cache/catalog/product/smoant-pasito-rba-800x800.png",
      price: 700,
      categoryId: cat6.id,
      brandId: smoant.id,
      featured: true,
      isNew: false,
      specifications: {
        "Тип": "Обслуживаемая база",
        "Совместимость": "Smoant Pasito, Pasito II",
        "Материал": "Нержавеющая сталь",
        "Особенности": "Возможность намотки своих спиралей"
      },
      flavors: []
    },
    {
      name: "Вата для намотки Cotton Bacon Prime",
      description: "Органический хлопок для намотки электронных сигарет.",
      slug: "cotton-bacon-prime",
      image: "https://vapehome.ru/image/cache/catalog/product/cotton-bacon-prime-800x800.png",
      price: 350,
      categoryId: cat6.id,
      brandId: null,
      featured: false,
      isNew: false,
      specifications: {
        "Тип": "Хлопок для намотки",
        "Материал": "Органический хлопок",
        "Вес": "10 г",
        "Особенности": "Быстрое впитывание, чистый вкус"
      },
      flavors: []
    },
    {
      name: "Набор инструментов для намотки Coil Master DIY Kit Mini",
      description: "Компактный набор инструментов для обслуживания электронных сигарет.",
      slug: "coil-master-diy-kit-mini",
      image: "https://vapehome.ru/image/cache/catalog/product/coil-master-diy-kit-mini-800x800.png",
      price: 1500,
      categoryId: cat6.id,
      brandId: null,
      featured: true,
      isNew: false,
      specifications: {
        "Тип": "Набор инструментов",
        "Комплектация": "Ножницы, пинцет, отвертка, шестигранники, коилджиг",
        "Материал чехла": "Искусственная кожа",
        "Размеры": "12x8x3 см"
      },
      flavors: []
    },
  ]).returning();
  
  console.log(`Созданы расходники: ${accessories.length} шт.`);

  // Заполняем наличие товаров в магазинах
  console.log("Заполнение наличия товаров в магазинах...");
  
  // Объединяем все товары в один массив
  const allProducts = [
    ...disposables, 
    ...pods, 
    ...podMods, 
    ...liquids, 
    ...tobacco, 
    ...accessories
  ];
  
  // Для каждого товара создаем запись о наличии в обоих магазинах
  const availabilityValues = [];
  
  allProducts.forEach(product => {
    // Генерируем случайное количество для каждого магазина
    const qty1 = Math.floor(Math.random() * 10) + 1; // от 1 до 10
    const qty2 = Math.floor(Math.random() * 10) + 1;
    
    availabilityValues.push({
      productId: product.id,
      locationId: location1.id,
      quantity: qty1
    });
    
    availabilityValues.push({
      productId: product.id,
      locationId: location2.id,
      quantity: qty2
    });
  });
  
  await db.insert(productAvailability).values(availabilityValues);
  
  console.log(`Создано записей о наличии: ${availabilityValues.length}`);
  
  // Создаем первого админа
  const admin = await db.insert(users).values({
    username: "admin",
    password: await hashPassword("admin123"), // в реальном проекте используйте более сложный пароль
    isAdmin: true
  }).returning();
  
  console.log(`Создан администратор: ${admin[0].username}`);
  
  console.log("Инициализация данных завершена!");
}

main().catch(e => {
  console.error("Ошибка при инициализации данных:", e);
  process.exit(1);
});