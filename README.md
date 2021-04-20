
>composer require masterdmx/laravel-admin-media-ui

#### Подключение провайдера в config app.php
> 'providers' => [
> 
>       MasterDmx\LaravelAdminMediaUI\UIServiceProvider::class,
> ]

####Публикация ресурсов
>php artisan vendor:publish --provider="MasterDmx\LaravelAdminMediaUI\UIServiceProvider" --tag="resources" --force

####Настройки WebPack

Стили

>mix.sass('resources/sass/admin/modules/media-manager/media-manager.scss', 'public/assets/admin/css/modules').options(sassOptions);
> 
>mix.sass('resources/sass/admin/modules/media-fields/media-fields.scss', 'public/assets/admin/css/modules').options(sassOptions);

JS

>mix.js('resources/js/admin/compiled.js', 'public/assets/admin/js').vue();

####Настройка compiled.js

>import VModal from 'vue-js-modal/dist/index.nocss.js';
> 
>import MediaManager from './modules/media-manager/plugin.js';
> 
>Vue.use(VModal)
> 
>Vue.use(MediaManager)
> 
>Vue.component('media-image', require('./modules/media-fields/media-image.vue').default);

####NPM пакеты
>npm i vue@2.6.12
> 
>npm i vue-js-modal@2.0.0-rc.6
> 
>npm i vue-progressbar@0.7.5
