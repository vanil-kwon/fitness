const CACHE_NAME = 'kwon-fitness-v1';

// Список файлов приложения для предварительного кэширования
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './config.js',
  './translations.js',
  './utils.js',
  './app.js',
  './profile.js',
  './game.js',
  './auth.js',
  './dailyQuests.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Установка Service Worker и кэширование файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Кэширование файлов приложения...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Заставляем Service Worker активироваться немедленно
  self.skipWaiting();
});

// Активация и очистка старого кэша при обновлении версии (CACHE_NAME)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехват сетевых запросов (Стратегия: Кэш, затем сеть)
self.addEventListener('fetch', (event) => {
  // Игнорируем запросы, которые не являются GET или не относятся к http/https (например, расширения браузера)
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Возвращаем файл из кэша, если он там есть
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Если файла нет в кэше, скачиваем из сети
      return fetch(event.request).then((networkResponse) => {
        // Проверяем, что ответ валиден
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Динамически кэшируем новые файлы (например, внешние шрифты или картинки)
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // 3. Fallback: если нет интернета и запрашивается страница, отдаем index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
