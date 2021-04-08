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
     * Конфигурация
     */
    const config = {
        api: {
            files: '/vendor/media-manager/files',
            upload: '/vendor/media-manager/upload',
            remove: '/vendor/media-manager/remove',
            update: '/vendor/media-manager/update',
            use: '/vendor/media-manager/use',
        },

        'baseUrl': '/storage/media',
    }

    /**
     * Состояние менеджера
     */
    const state = {
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
         * Активный файл
         */
        activeFile: null,
    }

    /**
     * Главный объект менеджера
     */
    const MediaManager = {
        config: config,
        state: state,
        options: {
            use: null,
            id: null,
            context: null,
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
                this.options.use = options.use;
            }

            // Задать активный файл
            if (options.id !== undefined && options.id !== null){
                this.options.id = options.id;
            }

            // Контекст
            if (options.context !== undefined && options.context !== null){
                this.options.context = options.context;
            }

            // Запуск загрузчика файлов, если флаг установлен в false
            if (!this.state.filesIsLoaded) {
                this.loadFiles();
            } else {
                this.activateFromOptionIdAfterLoadedFiles();
            }

            // Запуск окна
            this.state.isOpened = true;
        },

        /**
         * Загружает файлы с сервера и устанавливает флаг загрузки файлов
         */
        loadFiles: function () {
            axios.get(this.getApiUrlForFiles()).then(response => {
                this.state.files = response.data;
                this.activateFromOptionIdAfterLoadedFiles();
            }).finally(() => {
                this.state.filesIsLoaded = true;
            });
        },

        /**
         * Активирует файл путем прямой записи объекта в состояние
         */
        activate: function (file) {
            this.state.activeFile = file;
        },

        /**
         * Активирует файл по ID
         */
        activateById: function (id) {
            this.activate(this.getFileById(id));
        },

        /**
         * Активирует файл по ID, установленному из вне (метод open параметр id)
         */
        activateFromOptionIdAfterLoadedFiles: function () {
            if (this.options.id !== null && this.options.id !== undefined) {
                this.activateById(this.options.id);
            }
        },

        /**
         * Получает объект файла по ID
         */
        getFileById: function (id) {
            return this.state.files[this.getIndexFileById(id)];
        },

        /**
         * Возвращает индекс файла в массиве файлов, проверяя ID
         */
        getIndexFileById: function (id) {
            for (let index = 0; index < this.state.files.length; index++) {
                const file = this.state.files[index];

                if (file.id === id) {
                    return index
                }
            }
        },

        /**
         * Парсит медиа ID и составляет полный URL до файла
         */
        getUrlById: function (id) {
            const year      = id.substring(0, 4);
            const month     = id.substring(4).substring(0, 2);
            const symbol    = id.substring(6).substring(0, 1);
            const extension = id.split('-')[1];

            return this.config.baseUrl + '/' + year + '/' + month + '/' + symbol + '/' + id + '/default.' + extension;
        },

        /**
         * API запрос на загрузку файла с компа
         *
         * options.validateError(messages) - Коллбек, срабатывающий при ошибке валидации
         * options.success(file)           - Коллбек, срабатывающий при успешной загрузке файла
         * options.error(error)            - Коллбек, срабатывающий при любой ошибке
         */
        uploadFile: function (options) {
            options.data.append('context', this.options.context);

            // Выполнение запроса
            axios.post(this.config.api.upload, options.data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                if (options.success !== null && options.success !== undefined) {
                    options.success(response.data);
                }
            }).catch(error => {
                console.log('Upload error ---------------------------')
                console.log(error);
                console.log(error.response);
                console.log('----------------------------------------')

                if (error.response.status === 422) {

                    alert('123123');

                    if (options.validateError !== null && options.validateError !== undefined) {
                        const messages = [];

                        error.response.data.errors.forEach(function(item, i, arr) {
                            messages.push(item.message);
                        });

                        options.validateError(messages);
                    }
                }

                if (options.error !== null && options.error !== undefined) {
                    options.error(error);
                }
            });
        },

        /**
         * Применение контекста к выбранному файлу
         */
        applyContext: function (id, options) {
            axios.post(this.config.api.use + '/' + id, {context: this.options.context}).then(response => {
                if (options.success !== null && options.success !== undefined) {
                    options.success(response.data);
                }
            }).catch(error => {
                console.log('Upload error ---------------------------')
                console.log(error);
                console.log(error.response);
                console.log('----------------------------------------')

                if (options.error !== null && options.error !== undefined) {
                    options.error(error);
                }
            });
        },

        /**
         * Выбор файла в менеджере
         * Отправка запроса на сервер с целью досоздания нужных вариаций
         * Запускает установленный в методе Open callback
         */
        use: function (options) {
            this.applyContext(this.state.activeFile.id, {
                success: (file) => {
                    this.state.activeFile.variations = file.variations

                    if (this.options.use !== null && this.options.use !== undefined) {
                        this.options.use(this.state.activeFile);
                    }

                    if (options.success !== null && options.success !== undefined) {
                        options.success(file);
                    }
                },
                error: options.error
            });
        },

        /**
         * Сброс состояния и установленных параметров менеджера
         */
        reset: function () {
            this.state.activeFile = null;
            this.state.search = '';

            this.options.id = null;
            this.options.context = null;
            this.options.use = null;
        },

        getApiUrlForFiles: function () {
            return this.config.api.files;
        },

        getApiUrlForRemove: function (id) {
            return this.config.api.remove + '/' + id;
        },

        getApiUrlForUpdate: function (id) {
            return this.config.api.update + '/' + id;
        },
    }

    Vue.prototype.$MediaManager = MediaManager;
    Vue.component('image-manager', MediaManagerComponent);
}

export default {
    install
}
