'use strict'

import VModal from 'vue-js-modal/dist/index.nocss.js';
import VueProgressBar from 'vue-progressbar';
import MediaManagerComponent from './manager.vue';

function install (Vue, options = {}) {
    Vue.use(VueProgressBar, {
        color: '#00BC7E',
        failedColor: '#874b4b',
        thickness: '2px',
        transition: {
          speed: '0.2s',
          opacity: '0.6s',
          termination: 300
        },
        autoRevert: true,
        location: 'top',
        inverse: false
    })

    Vue.use(VModal)

    /**
     * Главный объект менеджера
     */
    const MediaManager = {
        data: {
            /**
             * Параметры, устанавливаемые при вызове менеджера
             */
            options: {
                /**
                 * Колбэк, выполняющийся при успешном использовании файла
                 * callback(file)
                 */
                use: null,

                /**
                 * ID активного файла по умолчанию
                 */
                id: null,

                /**
                 * Контекст вызова менеджера
                 */
                context: null,
            },

            /**
             * Флаг открытия окна (Открывает окно, если установлено значение true, и закрывает, если false)
             */
            isOpened: false,

            /**
             * Флаг загрузки списка файлов с сервера
             */
            filesIsLoaded: false,

            /**
             * Запрос живого поиска по файлам
             */
            search: '',

            /**
             * Массив списка файлов
             */
            files: [],

            /**
             * Выбранный файл
             */
            selected: null,
        },

        /**
         * Открыть менеджер
         * * Обрабатывает входные параметры, устанавливая ограничения менеджеру
         * * Запускает метод init()
         * @param options
         */
        open: function (options = {}) {
            // Коллбек при выборе изображения
            if (options.use !== undefined && options.use !== null){
                this.data.options.use = options.use;
            }

            // Задать активный файл
            if (options.id !== undefined && options.id !== null){
                this.data.options.id = options.id;
            }

            // Контекст
            if (options.context !== undefined && options.context !== null){
                this.data.options.context = options.context;
            }

            // Запуск окна
            this.data.isOpened = true;
        },

        /**
         * Парсит медиа ID и составляет полный URL до файла
         */
        getUrlById: function (id) {
            const year      = id.substring(0, 4);
            const month     = id.substring(4).substring(0, 2);
            const symbol    = id.substring(6).substring(0, 1);
            const extension = id.split('-')[1];

            return '/storage/media/' + year + '/' + month + '/' + symbol + '/' + id + '/default.' + extension;
        },
    }

    Vue.prototype.$MediaManager = MediaManager;
    Vue.component('image-manager', MediaManagerComponent);
}

export default {
    install
}
