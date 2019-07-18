# hexo-articled-webpush
Integrate the [Articled.io](https://articled.io/) widget with your Hexo blog and start sending webpush notifications immediately!

## Installation

``` bash
$ npm install hexo-articled-webpush --save
```

## Options
_config.yml: 
``` yaml
articled:
  api_public_key: 
  app_public_key:
```

## Service Worker
```javascript
self.addEventListener("push", function(event) {
    var data = {};
    if (event.data) {
        data = event.data.json();
    }
    var title = data.title || "Untitled";
    var message = data.message || "Empty";
    var tag = data.tag || null;
    var icon = data.icon || null;
    var url = data.url;
    var image = data.image;
    event.waitUntil(self.registration.showNotification(title, {
        body: message,
        tag: tag,
        icon: icon,
        image: image,
        data: url
    }));
});
self.addEventListener("notificationclick", function(event) {
    var url = event.notification.data;
    if (url) {
        clients.openWindow(url);
    } else {
        return;
    }
});
self.addEventListener("activate", function(event) {
    event.waitUntil(self.clients.claim());
});
```
## Guide
* Get your `API Public Key` and `App Public Key` in the [Articled.io dashboard](https://articled.io/dashboard).
* Edit your `_config.yml` to include Articled.io settings.
* Save service worker as `service-worker.js` in the root of your domain.
* Use `{% articled_webpush %}` tag in `.md` files

## License
MIT
