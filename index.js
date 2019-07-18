'use strict';

var fs = require('fs');
var path = require('path');
var axios = require('axios');

var articled_path = path.join(__dirname, 'articled.json');
var articled = JSON.parse(fs.readFileSync(articled_path));


hexo.extend.tag.register('articled_webpush', function() {

    if (!hexo.config.articled) {
        console.log('hexo-articled-webpush: Config missing');
        return;
    }

    if (!articled.running) {
   
        Promise.all([
            axios.post('https://articled.io/api/user/public', {
                apiPublicKey: hexo.config.articled.api_public_key
            }), 
            axios.post('https://webpush.articled.io/api/app/public', {
                apiPublicKey: hexo.config.articled.api_public_key
            })
        ])
        .then(function([user, apps]) {

            var userDir;
            var appName;

            if (user.data.status) {
                userDir = user.data.userDir;
            }
            if (apps.data.status) {
                for (var i = 0; i < apps.data.apps.length; i++) {
                    if (apps.data.apps[i].appPublicKey === hexo.config.articled.app_public_key) {
                        appName = apps.data.apps[i].name;
                    }
                }
            }
            
            if (!userDir || !appName) {
                console.log('hexo-articled-webpush: Invalid API Keys');
                return;
            } else {
                
                articled = {
                    running: true,
                    userDir: userDir,
                    appName: appName
                };
                
                fs.writeFileSync(articled_path, JSON.stringify(articled));
                
                return articledScript(userDir, appName);
            }

        })
        .catch(function(err) {
            console.log('hexo-articled-webpush: Error with articled servers');
            return ;
        });

        return;
    } else {
        return articledScript(articled.userDir, articled.appName);
    }

});

function articledScript(userDir, appName) {

    return `<script>
                (function(a,r,t,i,c,l) {
                    i=r.getElementsByTagName("head")[0],
                    c=r.createElement("script"), 
                    l=r.createElement("link");
                    c.type="text/javascript";c.src=t+a+".js";
                    l.type="text/css";l.rel="stylesheet";
                    l.href=t+a+".css";i.appendChild(l);
                    i.appendChild(c);
                })('articled',document,"https://articled.io/widget/` + userDir + `/` + appName + `/");
            </script>`;

}