<?php

namespace MasterDmx\LaravelAdminMediaUI;

use Illuminate\Support\ServiceProvider;

class UIServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Загрузка маршрутов
        $this->loadRoutesFrom(substr(__DIR__, 0, -4) . DIRECTORY_SEPARATOR . 'routes.php');

        // Публикация конфига
        $this->publishes([__DIR__.'/../config.php' => config_path('media_ui.php')], 'config');

        // Публикация ресурсов
        $this->publishes([
            __DIR__.'/../public/img'     => public_path('assets/admin/img/modules/media-manager'),
            __DIR__.'/../resources/js'   => resource_path('js/admin/modules'),
            __DIR__.'/../resources/sass' => resource_path('sass/admin/modules'),
        ], 'resources');

        // Подгружаем вьюхи с ключом admin
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'admin');

        // Подгружаем компоненты
        $this->loadViewComponentsAs('admin', config('media_ui.components'));
    }

    public function register()
    {
        $this->mergeConfigFrom( __DIR__.'/../config.php', 'media_ui');
    }

}
