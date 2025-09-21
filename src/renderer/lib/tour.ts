import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const tourSteps = [
  {
    element: '[data-tour="home"]',
    popover: {
      title: 'مرحباً بك في لارافيل كِت!',
      description: 'هذا هو تطبيق سطح المكتب لإدارة مشاريع لارافيل الخاصة بك بسهولة ويسر.',
      side: 'left',
      align: 'start'
    }
  },
  {
    element: '[data-tour="open-project"]',
    popover: {
      title: 'فتح مشروع',
      description: 'انقر هنا لفتح مشروع لارافيل موجود على جهازك.',
      side: 'left',
      align: 'start'
    }
  },
  {
    element: '[data-tour="artisan-tab"]',
    popover: {
      title: 'تبويب أرتيزان',
      description: 'بعد فتح مشروع، يمكنك الوصول إلى جميع أوامر أرتيزان من هنا.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '[data-tour="tinker-tab"]',
    popover: {
      title: 'تبويب التنكر',
      description: 'استخدم هذا التبويب لتجربة كود PHP والتفاعل مع تطبيق لارافيل مباشرة.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '[data-tour="settings-tab"]',
    popover: {
      title: 'الإعدادات',
      description: 'يمكنك تخصيص إعدادات التطبيق من هنا، مثل مسار PHP ونمط الألوان.',
      side: 'top',
      align: 'start'
    }
  }
];

export function startTour() {
  const driverObj = driver({
    showProgress: true,
    steps: tourSteps,
    nextBtnText: 'التالي',
    prevBtnText: 'السابق',
    doneBtnText: 'انتهى',
    popoverClass: 'driverjs-theme-arabic',
    smoothScroll: true,
    allowClose: true,
    overlayClickNext: false,
    stagePadding: 4,
    stageRadius: 8
  });

  driverObj.drive();
}

export function shouldShowTour(): boolean {
  return !localStorage.getItem('laravel-kit-tour-completed');
}

export function completeTour() {
  localStorage.setItem('laravel-kit-tour-completed', 'true');
}