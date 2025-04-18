# index Hook

`index` - React ilovalarida URL parametrlari asosidagi filtrlash tizimini boshqarish uchun kuchli va moslashuvchan Hook. Bu `nuqs` paketidan foydalanib, URL parametrlari va dastur holati o'rtasida ikki tomonlama sinxronizatsiyani ta'minlaydi.

## O'rnatish

Birinchi navbatda kerakli paketlarni o'rnating:

```bash
npm install nuqs
# yoki
yarn add nuqs
```

## Asosiy xususiyatlar

- 🔄 URL va filtrlar o'rtasida ikki tomonlama sinxronizatsiya
- 📊 Tizimli va tiplardan foydalanilgan API
- 🧩 Modullarga ajratiladigan arxitektura
- 🛠 Oldindan tayyorlangan filtr parserlari
- 🔍 Konfiguratsiyalanadigan sozlamalar
- 📝 Kengaytirilgan metama'lumotlar
- 🚀 O'zgarishlarni kuzatish imkoniyati
- 🐞 Debug rejimi

## Foydalanish

### Asosiy foydalanish

```tsx
import { index, filterParsers } from '@/shared/hooks/use-filters';

function ProductsPage() {
  // Filtrlarni e'lon qilish va hookni chaqirish
  const { filters, setFilters, clearFilter } = useFilters({
    category: filterParsers.string('all'),
    minPrice: filterParsers.integer(0),
    maxPrice: filterParsers.integer(1000),
    inStock: filterParsers.boolean(true),
  });

  // Filtrni o'zgartirish
  const handleCategoryChange = (category) => {
    setFilters({ category });
  };

  // Filter qiymatiga kirish
  const currentCategory = filters.category; // 'all' yoki boshqa qiymat
  const isInStock = filters.inStock; // true yoki false

  return (
    <div>
      <h1>Mahsulotlar</h1>

      <div>
        <label>Kategoriya:</label>
        <select value={currentCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="all">Barchasi</option>
          <option value="electronics">Elektronika</option>
          <option value="clothing">Kiyimlar</option>
        </select>

        <label>
          <input type="checkbox" checked={isInStock} onChange={(e) => setFilters({ inStock: e.target.checked })} />
          Faqat mavjudlar
        </label>

        <button onClick={() => clearFilter('category')}>Kategoriyani tozalash</button>

        <button onClick={() => clearAllFilters()}>Barcha filtrlarni tozalash</button>
      </div>

      {/* Sahifalashtirish avtomatik ravishda ishlaydi */}
      <div>
        <button onClick={() => setFilters({ page: (filters.page || 1) - 1 })}>Oldingi</button>
        <span>Sahifa {filters.page}</span>
        <button onClick={() => setFilters({ page: (filters.page || 1) + 1 })}>Keyingi</button>
      </div>
    </div>
  );
}
```

### Kengaytirilgan foydalanish

```tsx
import { index, filterParsers } from '@/shared/hooks/use-filters';
import { useEffect } from 'react';

function AdvancedFiltersPage() {
  // Kengaytirilgan konfiguratsiya bilan foydalanish
  const { filters, setFilters, clearFilter, clearAllFilters, resetFilters, metadata } = useFilters(
    // Modul uchun filtrlar
    {
      search: filterParsers.string(''),
      dateRange: filterParsers.stringArray(['', '']),
      tags: filterParsers.stringArray([]),
      status: filterParsers.string('active'),
    },
    // Konfiguratsiya
    {
      baseFilters: {
        sortBy: filterParsers.string('createdAt'),
        sortOrder: filterParsers.string('desc'),
      },
      defaultPage: 1,
      defaultSize: 25,
      preserveParams: true,
      onFiltersChange: (updatedFilters) => {
        console.log("Filtrlar o'zgardi:", updatedFilters);
        // Ma'lumotlarni yuklash yoki analitika yuborish
      },
      debug: process.env.NODE_ENV === 'development',
    },
  );

  // URL o'zgarganda, ma'lumotlarni yuklash
  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  // Metama'lumotlardan foydalanish
  const { hasFilters, activeFiltersCount } = metadata;

  return (
    <div>
      {/* ... UI komponentlari ... */}

      {hasFilters && (
        <div>
          <span>Faol filtrlar: {activeFiltersCount}</span>
          <button onClick={resetFilters}>Standart holat</button>
        </div>
      )}
    </div>
  );
}
```

## API Reference

#### Parametrlar

- **moduleFilters**: Modulga tegishli filtrlar - key/parser juftligidagi obyekt
- **config**: Hook konfiguratsiyasi
  - **baseFilters**: Asosiy filtrlar (barcha modullarda bo'lishi mumkin bo'lgan)
  - **defaultPage**: Standart sahifa raqami (standart: 1)
  - **defaultSize**: Standart sahifa hajmi (standart: 20)
  - **preserveParams**: URL dagi boshqa parametrlarni saqlash (standart: true)
  - **onFiltersChange**: Filtrlar o'zgarganda chaqiriladigan function
  - **debug**: Debug rejimini yoqish (standart: false)

#### Qaytaradigan qiymat (`UseFiltersResult`)

- **filters**: Joriy filtr qiymatlari obyekti
- **setFilters**: Filtrlarni o'zgartirish funksiyasi
- **clearFilter**: Bitta filterni tozalash funksiyasi
- **clearAllFilters**: Barcha filtrlarni tozalash funksiyasi
- **resetFilters**: Filtrlarni standart holatga qaytarish funksiyasi
- **metadata**: Filtrlar haqida metama'lumotlar
  - **filterKeys**: Filtr kalitlari ro'yxati
  - **hasFilters**: Filtrlar mavjudligi
  - **activeFiltersCount**: Faol filtrlar soni

### `filterParsers` Utility

URL parametrlarini kerakli tiplarga aylantirish uchun oldindan tayyorlangan parserlar:

- **integer**: Butun son uchun parser
- **string**: Matn uchun parser
- **boolean**: Boolean uchun parser
- **integerArray**: Butun sonlar massivi uchun parser
- **stringArray**: Matnlar massivi uchun parser

## Misollar

### Sahifalashtirish va Saralash

```tsx
const { filters, setFilters } = useFilters({
  sortBy: filterParsers.string('createdAt'),
  sortOrder: filterParsers.string('desc'),
});

// Saralashni o'zgartirish
const toggleSortOrder = () => {
  setFilters({
    sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
  });
};

// Sahifaga o'tish
const goToPage = (pageNumber) => {
  setFilters({ page: pageNumber });
};
```

### Filtrlar Formasi

```tsx
const { filters, setFilters, clearAllFilters } = useFilters({
  name: filterParsers.string(''),
  minAge: filterParsers.integer(),
  maxAge: filterParsers.integer(),
  status: filterParsers.string('all'),
});

const handleSubmit = (e) => {
  e.preventDefault();
  // Form qiymatlarini olish
  const formData = new FormData(e.target);

  setFilters({
    name: formData.get('name'),
    minAge: formData.get('minAge'),
    maxAge: formData.get('maxAge'),
    status: formData.get('status'),
    page: 1, // Yangi qidiruv uchun birinchi sahifaga qaytish
  });
};

return (
  <form onSubmit={handleSubmit}>
    <input name="name" defaultValue={filters.name} />
    <input name="minAge" type="number" defaultValue={filters.minAge} />
    <input name="maxAge" type="number" defaultValue={filters.maxAge} />
    <select name="status" defaultValue={filters.status}>
      <option value="all">Barchasi</option>
      <option value="active">Faol</option>
      <option value="inactive">Nofaol</option>
    </select>

    <button type="submit">Qidirish</button>
    <button type="button" onClick={clearAllFilters}>
      Tozalash
    </button>
  </form>
);
```

### Murakkab Qidiruvlar

```tsx
const { filters, setFilters } = useFilters({
  search: filterParsers.string(''),
  filters: filterParsers.stringArray([]),
});

// Debounced qidiruv
const [searchQuery, setSearchQuery] = useState(filters.search || '');

useEffect(() => {
  const timer = setTimeout(() => {
    setFilters({ search: searchQuery });
  }, 500);

  return () => clearTimeout(timer);
}, [searchQuery]);

// Tag filtrlarini qo'shish/o'chirish
const toggleTag = (tag) => {
  const currentTags = filters.tags || [];

  if (currentTags.includes(tag)) {
    setFilters({
      tags: currentTags.filter((t) => t !== tag),
    });
  } else {
    setFilters({
      tags: [...currentTags, tag],
    });
  }
};
```

### URL Bilan Ishlaganda

`index` xuki URL parametrlarini boshqaradi. Misol uchun, agar filtrlar qo'llanilsa:

```
https://example.com/products?category=electronics&minPrice=100&maxPrice=500&page=2&size=24
```

Bu holatda `filters` obyekti quyidagi ma'lumotlarni o'z ichiga oladi:

```js
{
  category: "electronics",
  minPrice: 100,
  maxPrice: 500,
  page: 2,
  size: 24
}
```

## Tavsiyalar va eng yaxshi amaliyotlar

1. **Standart qiymatlardan foydalaning**

   ```tsx
   // Har doim standart qiymatlarni belgilang
   const { filters } = useFilters({
     status: filterParsers.string('active'),
     sortBy: filterParsers.string('createdAt'),
   });
   ```

2. **Filtrlar o'zgarganda sahifani yangilang**

   ```tsx
   // Qidiruv o'zgarganda 1-sahifaga qaytaring
   const handleSearchChange = (query) => {
     setFilters({
       search: query,
       page: 1, // Sahifani yangilash
     });
   };
   ```

3. **O'rtacha (debounced) qidiruvdan foydalaning**

   ```tsx
   // Bir necha marta serverga so'rov yubormaslik uchun
   const debouncedSearch = debounce((query) => {
     setFilters({ search: query, page: 1 });
   }, 300);
   ```

4. **Filtrlarni guruhlash**

   ```tsx
   // Mantiqan bog'liq filtrlarni birlashtiring
   const applyDateRange = (startDate, endDate) => {
     setFilters({
       dateFrom: startDate,
       dateTo: endDate,
       page: 1,
     });
   };
   ```

5. **URL parametrlari uchun o'qilishi oson nomlar tanlang**
   ```tsx
   // Tushunarli va qisqa nomlar ishlatildi
   const { filters } = useFilters({
     q: filterParsers.string(''), // 'query' o'rniga
     cat: filterParsers.string('all'), // 'category' o'rniga
   });
   ```

## Xatolar bartaraf etish

### Tiplarni yuklay olmaslik

TypeScript bilan ishlaganda, generik turlarini to'g'ri belgilang:

```tsx
// Filtrlar sxemasini yarating
type ProductFilters = {
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
};

// Filtrlar sxemasini ishlatishda
const { filters } = index<ProductFilters>({
  category: filterParsers.string('all'),
  minPrice: filterParsers.integer(0),
  maxPrice: filterParsers.integer(1000),
  inStock: filterParsers.boolean(true),
});
```

### Filter o'zgarishlari yo'qoldi

URL parametrlarini saqlash kerakligiga ishonch hosil qiling:

```tsx
const { filters } = index(moduleFilters, {
  preserveParams: true, // Bu parametr URL dagi boshqa parametrlarni saqlaydi
});
```

### Sayt Sahifalari Orasida Filtrlar Saqlanishi

SPA ilovalarida sahifalar o'rtasida harakatlanish paytida filtrlar saqlanishi kerak. Bu `preserveParams` parametri orqali amalga oshiriladi. Sahifalar orasida filtrlar saqlanishi uchun quyidagi yo'llardan foydalanishingiz mumkin:

1. `preserveParams: true` parametrini ishlating
2. React Router bilan ishlayotganda, URL parametrlarini saqlash uchun React Router xususiyatlaridan foydalaning
