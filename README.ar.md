<p align="center">
  <img src="./build/icon.png" height="128">
</p>
<h1 align="center">Laravel Kit</h1>
<div align="center">
  تطبيق سطح مكتب بسيط وأنيق لإدارة تطبيقات Laravel الخاصة بك.<br>
  <sub>متاح لأنظمة Windows و Linux و macOS.</sub>
  <br><br>
  <sub>📖 <a href="README.md">English Documentation</a></sub>
</div>
<br>
<div align="center">
  <!-- Version -->
  <a href="https://github.com/tmdh/laravel-kit/releases/latest">
    <img src="https://badgen.net/github/release/tmdh/laravel-kit" alt="احصل على أحدث إصدار">
  </a>
</div>
<div align="center">
  <h3>
    <a href="https://tmdh.github.io/laravel-kit/">
      الموقع الإلكتروني
    </a>
    <span> | </span>
    <a href="https://github.com/tmdh/laravel-kit#features">
      الميزات
    </a>
    <span> | </span>
    <a href="https://github.com/tmdh/laravel-kit#download">
      التثبيت
    </a>
    <span> | </span>
    <a href="https://github.com/tmdh/laravel-kit#contribution">
      المساهمة
    </a>
    <span> | </span>
    <a href="https://github.com/tmdh/laravel-kit/wiki">
      الوثائق
    </a>
  </h3>
</div>
<div align="center">
  <sub>
  بُني بكل ❤︎ بواسطة <a href="https://github.com/tmdh">Tareque Md Hanif</a>
  </sub>
</div>

## الميزات

- لا يتطلب أي تكوين.
- تنفيذ أوامر Artisan بسهولة في واجهة جميلة.
- تطوير مشروعك في محرر أكواد سحري.
- تشغيل تطبيق Laravel الخاص بك محليًا بنقرة زر واحدة (مريح جدًا :star_struck: ).
- واجهة مستخدم جميلة مستوحاة من VSCode وسمة داكنة.
- يتم استرجاع أوامر Artisan من مشروع Laravel الخاص بك.

## التثبيت

يجب تثبيت PHP على نظامك.

### Windows

[قم بتنزيل ملف الإعداد (.exe)](https://github.com/tmdh/laravel-kit/releases/latest) وقم بتثبيته. سيتم فحص التحديثات تلقائيًا.

### macOS

الطريقة الموصى بها للتثبيت على macOS هي باستخدام [brew](https://brew.sh/).

```
brew install laravel-kit --no-quarantine
```

أو يمكنك تنزيل ملف dmg من صفحة [الإصدارات](https://github.com/tmdh/laravel-kit/releases/latest). لاحظ أن إصدار dmg غير موقع بالكود. [تعليمات التثبيت لملف dmg](https://github.com/tmdh/laravel-kit/issues/40#issuecomment-1085726076)

### Ubuntu والمشتقات الأخرى

قم بتشغيل هذه الأوامر من الطرفية:

```
wget https://github.com/tmdh/laravel-kit/releases/download/v2.0.9/laravel-kit_2.0.9_amd64.deb
sudo apt install ./laravel-kit_2.0.9_amd64.deb
```

### Arch Linux

هو متاح في مستودع مستخدمي Arch (AUR) باسم [laravel-kit](https://aur.archlinux.org/packages/laravel-kit).

### توزيعات Linux الأخرى

فقط تنسيق AppImage متاح لتوزيعات Linux الأخرى. قم بتنزيله من صفحة [الإصدارات](https://github.com/tmdh/laravel-kit/releases/latest). سيتم إضافة طرق مناسبة قريبًا جدًا.

## لقطات الشاشة

<h4 align="center"> :high_brightness: السمات :crescent_moon: </h4>

|               فاتح                |               داكن                |
| :--------------------------------: | :-------------------------------: |
| ![](screenshots/artisan-light.jpg) | ![](screenshots/artisan-dark.jpg) |
| ![](screenshots/tinker-light.jpg)  | ![](screenshots/tinker-dark.jpg)  |

## التطوير

Laravel Kit مبني باستخدام [Electron](https://electronjs.org) و [Vue.js 3](https://vuejs.org) و [Tailwind CSS](https://tailwindcss.com) و [Vite](https://vitejs.dev).

```bash
# للتطوير،
# ابدأ خادم التطوير مع Vite
yarn run dev:one
# ابدأ Electron
yarn run dev:two

# للإنتاج،
# ابنِ الملفات باستخدام Vite
yarn run prod
# أنشئ ملف قابل للتنفيذ
yarn run pack
```

## الوثائق

انتقل إلى [ويكي Laravel Kit](https://github.com/tmdh/laravel-kit/wiki).

---

حقوق النشر © 2018-2022 بواسطة [Tareque Md Hanif](https://github.com/tmdh)
