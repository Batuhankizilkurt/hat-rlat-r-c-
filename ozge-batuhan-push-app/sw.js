self.addEventListener('install',event=>{self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim())});
self.addEventListener('push',event=>{
 let data={title:'Özge ♥ Batuhan',body:'Bugün de güzel bir gün! 🌼'};
 try{if(event.data)data={...data,...event.data.json()}}catch(e){}
 event.waitUntil(self.registration.showNotification(data.title,{
  body:data.body,icon:'/icon-192.png',badge:'/icon-192.png',
  tag:'ob-hourly-day-reminder',renotify:true,
  data:{url:'/'}
 }));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
  for(const client of list){if('focus'in client)return client.focus()}
  return clients.openWindow('/');
 }));
});
