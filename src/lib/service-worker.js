// service-worker.js
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  const options = {
    body: data.body || 'Time to log your transactions',
    icon: data.icon || '/images/android-chrome-192x192.png',
    badge: data.badge || '/images/android-chrome-192x192.png',
    tag: 'transaction-reminder'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Transaction Reminder', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/dashboard/new-transaction')
  );
});