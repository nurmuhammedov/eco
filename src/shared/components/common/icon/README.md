# 🚀 Dynamic SVG Icon Component in React

## **📌 Overview**

`Icon.tsx` — bu **dynamic import va lazy loading** ishlatadigan **React componenti** bo‘lib, u **SVG fayllarni avtomatik yuklash va ulardan React component sifatida foydalanish imkonini beradi**.  
Bu component **`import.meta.glob()` va `vite-plugin-svgr` yordamida Type-safe va optimallashtirilgan SVG import qilishni** ta'minlaydi.

## **📌 Afzalliklari**

| Technology            | Purpose                                 |
| --------------------- | --------------------------------------- |
| **✅ Dynamic Import** | Faqat ishlatilayotgan iconlar yuklanadi |
| **✅ Lazy Loading**   | React.lazy() va Suspense ishlaydi       |
| **✅ Type-safe**      | Faqat mavjud iconlarni ishlatish mumkin |
| **✅ Tree shaking**   | Foydalanilmagan iconlar yuklanmaydi     |

---

### **📌 1. Vite loyihasida `vite-plugin-svgr` o‘rnatish**

```bash
yarn add -D vite-plugin-svgr
```

---

## Foydalanish yo'riqnomasi

```jsx
<Icon name="icon-name" className="size-5" />
```
