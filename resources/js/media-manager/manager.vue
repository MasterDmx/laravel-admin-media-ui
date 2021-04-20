<template>
    <div>

        <div class="media-manager">
            <modal name="media-manager" width="95%" height="auto" @before-close="beforeCloseModal">
                <vue-progress-bar></vue-progress-bar>

                <input id="media-manager-file-selector" ref="fileSelector" type="file" @change="upload" hidden>

                <div class="media-ui">
                    <div class="media-ui__row media-ui__row--min">
                        <div class="media-ui__col media-ui__col--min">
                            <div class="media-toolbar">
                                <div class="media-search">
                                    <input type="text" v-model="search" placeholder="Поиск ...">
                                    <div class="media-search__icon"><i class="fal fa-search"></i></div>
                                </div>
                                <div class="media-control">
                                    <button @click="chooseFileForUpload()" title="Загрузить с компьютера" class="btn btn-media btn-media--icon btn-media--default mr-5"><i class="fal fa-upload"></i></button>
                                    <button @click="uploadByUrl()" title="Загрузить по ссылке" class="btn btn-media btn-media--icon btn-media--default mr-5"><i class="fal fa-cloud-upload"></i></button>
                                    <button @click="reload()" title="Перезагрузить менеджер" class="btn btn-media btn-media--icon btn-media--default mr-5"><i class="fal fa-undo"></i></button>
                                    <button @click="close()" title="Закрыть менеджер"  class="btn btn-media btn-media--icon btn-media--default"><i class="fal fa-times"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="media-ui__row">
                        <div class="media-ui__col">

                            <div class="media-workspace">
                                <div class="media-workspace__row">


                                    <!-- Список файлов (если флаг filesIsLoaded установлен в true) -->
                                    <div class="media-workspace__col media-main-col" v-if="filesIsLoaded">
                                        <div class="media-main">
                                            <div class="media-cards">
                                                <media-card v-for="file in getFiles" :key="file.id" :file="file" :state="state" @file-selected="select" @file-uses="use"></media-card>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Лоадер списка файлов (если флаг filesIsLoaded установлен в false) -->
                                    <div class="media-workspace__loader" v-else>
                                        <div class="spinner-border text-success" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>


                                    <div class="media-details-col media-details-nothing" v-if="!hasActiveFile">
                                        <div class="media-details-nothing__icon"><i class="fal fa-eye-slash"></i></div>
                                        Файл не выбран
                                    </div>

                                    <div class="media-details-col" v-else>
                                        <div class="media-details">

                                            <div class="media-details__content">
                                                <div class="media-details__section">
                                                    <div class="media-details__img">
                                                        <a target="_blank" :href="selected.url">
                                                            <img :src="selected.url" alt="">
                                                        </a>
                                                    </div>
                                                </div>

                                                <div class="media-details-information media-details__section media-details__section--no-top-padding">
                                                    <div class="media-info">
                                                        <div class="media-info__name">ID</div>
                                                        <div class="media-info__value">{{ selected.id }}</div>
                                                    </div>
                                                    <div class="media-info">
                                                        <div class="media-info__name">Название</div>
                                                        <div class="media-info__value">{{ selected.name }}</div>
                                                    </div>
                                                    <div class="media-info">
                                                        <div class="media-info__name">Alt</div>
                                                        <div class="media-info__value">{{ selected.title }}</div>
                                                    </div>
                                                    <div class="media-info">
                                                        <div class="media-info__name">Расширение</div>
                                                        <div class="media-info__value">{{ selected.extension }}</div>
                                                    </div>
                                                    <div class="media-info">
                                                        <div class="media-info__name">Разрешение</div>
                                                        <div class="media-info__value">{{ selected.width }}x{{ selected.height }}</div>
                                                    </div>
                                                    <div class="media-info">
                                                        <div class="media-info__name">Загружен</div>
                                                        <div class="media-info__value">{{ getUploadDateForActiveFile }}</div>
                                                    </div>
                                                </div>

                                                <div class="media-details-variations media-details__section">
                                                    <div class="media-details-variations__item">
                                                        <div class="media-details-variations__name">Оригинал</div>
                                                        <a target="_blank" :href="selected.url" class="media-details-variations__view"><i class="fal fa-eye"></i></a>
                                                    </div>

                                                    <div class="media-details-variations__item" v-for="variation in getVariations" :key="variation.name">
                                                        <div class="media-details-variations__name">{{ variation.name }}</div>
                                                        <a target="_blank" :href="variation.url" class="media-details-variations__view"><i class="fal fa-eye"></i></a>
                                                    </div>
                                                </div>

                                                <div class="media-details__editor media-details__section">
                                                    <div class="form-group">
                                                        <label class="form-label media-form-label media-form-label" for="media-manager-details-edit-name">Название</label>
                                                        <input type="text" id="media-manager-details-edit-name" ref="metaName" class="form-control media-form-control" :value="selected.name">
                                                    </div>

                                                    <div class="form-group">
                                                        <label class="form-label media-form-label media-form-label" for="media-manager-details-edit-a-title">Title \ Alt</label>
                                                        <input type="text" id="media-manager-details-edit-a-title" ref="metaTitle" class="form-control media-form-control" :value="selected.title">
                                                    </div>

                                                    <div class="text-center">
                                                        <button type="button" class="btn btn-outline-success waves-effect waves-themed" @click="updateMeta()"> <span class="fal fa-download mr-1"></span> Сохранить </button>
                                                    </div>
                                                </div>

                                            </div>

                                            <div class="media-details__footer media-details__section media-details__section--top-border">
                                                <div class="media-details-control">
                                                    <button class="btn btn-media btn-media--icon btn-media--default media-details-control__item" @click="remove()" ><i class="far fa-trash-alt"></i></button>
                                                    <button class="btn btn-media btn-media--icon btn-media--default media-details-control__item" @click="unselect()"><i class="fal fa-times"></i></button>
                                                </div>

                                                <button class="btn btn-outline-success waves-effect waves-themed media-details-use" @click="use()">Использовать</button>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>


                        </div>

                    </div>
                </div>

            </modal>
        </div>

    </div>
</template>

<script>
import mediaCard from './components/media-card.vue'

export default {
    components: {
        mediaCard,
    },

    data: function () {
        return this.$MediaManager.data;
    },

    computed: {
        hasActiveFile: function () {
            return this.selected !== null && this.selected !== undefined;
        },

        // Весь объект данных для передачи дочерним компонентам
        state: function () {
            return this.$MediaManager.data;
        },

        getVariations: function () {
            return this.selected.variations;
        },

        getUploadDateForActiveFile: function () {
            const date = new Date(this.selected.uploaded_at * 1000);
            const month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
            const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

            return date.getFullYear() + '-' + month + '-' + day + ' в ' + hour + ':' + minute;
        },

        // Функция, отображающая список файлов после поиска и прочих фильтров
        getFiles: function () {
            if (this.filesIsLoaded) {
                let files = this.files;

                // Живой поиск
                if (this.search !== '' && this.search !== undefined && this.search !== null) {
                    files = files.filter(file => file.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1)
                }

                return files;
            }

            return [];
        },
    },


    watch: {
        /**
         * Отслеживает аттрибут isOpened (открыто ли окно)
         * * При TRUE посмотрит на статус загрузки файлов, и если загрузки небыло - запустит загрузку файлов
         */
        isOpened: function () {
            if (this.isOpened) {
                if (!this.filesIsLoaded) {
                    this.loadFiles()
                } else {
                    this.selectFromOption();
                }

                this.open();
            } else {
                this.close();
            }
        },
    },

    methods: {

        /**
         * Загружает файлы с сервера
         */
        loadFiles: function () {
            // Сбрасываем состояние загрузки файлов
            this.filesIsLoaded = false;

            // Получаем данные с сервера
            axios.get('/vendor/media-manager/files').then(response => {
                this.files = response.data;
                this.selectFromOption();
            }).finally(() => {
                this.filesIsLoaded = true;
            });
        },

        /**
         * Заного загружает список
         */
        reload: function () {
            this.files = []
            this.filesIsLoaded = false
            this.loadFiles()
        },

        /**
         * Запускает колбек, который прилетел при открытии менеджера
         * Закрывает менеджер
         */
        use: function () {
            this.progressStart();

            axios.post('/vendor/media-manager/use', {
                context: this.options.context,
                id: this.selected.id
            }).then(response => {
                const file = response.data;

                // Установим новые вариации в менеджер
                this.selected.variations = file.variations;

                // Выполним внешний колбек, если он есть
                if (this.options.use !== null && this.options.use !== undefined) {
                    this.options.use(this.selected);
                }

                this.progressSuccess();

                // Закрое окно
                this.close();
            }).catch(error => {
                this.processApiErrorsSupport(error, () => this.progressFail())
            });
        },

        /**
         * Открывает окно выбора файла с компа
         * * Эмулирует клик по <input type=file>, который скрыт
         */
        uploadByUrl: function() {
            Swal.fire({
                title: "Введите URL",
                input: "text",
                inputAttributes: {
                    autocapitalize: "off"
                },
                showCancelButton: true,
                confirmButtonText: "Загрузить",
                cancelButtonText: "Отмена",
                showLoaderOnConfirm: true,
                preConfirm: (url) => {
                    this.progressStart();

                    if (url !== '' && url !== null && url !== undefined) {
                        axios.post('/vendor/media-manager/upload_by_url', {url: url}).then(response => {
                            const file = response.data;

                            this.add(file);
                            this.select(file);
                            this.progressSuccess();
                        }).catch(error => {
                            this.processApiErrorsSupport(error, () => this.progressFail())
                        })
                    }
                },
                allowOutsideClick: function allowOutsideClick() {
                    return !Swal.isLoading();
                }
            });
        },

        /**
         * Открывает окно выбора файла с компа
         * * Эмулирует клик по <input type=file>, который скрыт
         */
        chooseFileForUpload: function() {
            document.getElementById("media-manager-file-selector").click();
        },

        /**
         * Загружает файл на сервер, после чего добавляет в список файлов и активирует
         * * Запускается за счет мониторинка поля <input id="media-manager-file-selector" type=file>
         */
        upload: function() {
            const file = this.$refs.fileSelector.files[0];
            const data = new FormData();

            if (file) {
                data.append('file', file);

                axios.post('/vendor/media-manager/upload', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    this.add(response.data);
                    this.select(response.data);
                    this.progressSuccess();
                }).catch(error => {
                    this.processApiErrorsSupport(error, () => this.progressFail())
                });
            }
        },

        /**
         * Удаляет активный файл с сервера (с подтверждением)
         */
        remove: function() {
            Swal.fire( {
                title: "Удалить файл?",
                text: "Это действие необратимо!",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Да",
                cancelButtonText: "Нет"
            }).then((result) => {
                if (result.value) {
                    this.progressStart();

                    axios.delete('/vendor/media-manager/remove/' + this.selected.id).then(response => {
                        this.removeFileFromListById(this.selected.id);
                        this.unselect();
                        this.progressSuccess();
                    }).catch(error => {
                        this.processApiErrorsSupport(error, () => this.progressFail())
                    })
                }
            });
        },

        /**
         * Удаляет объект файла из списка по ID
         */
        removeFileFromListById: function (id) {
            this.files.splice(this.getIndexFileById(id), 1);
        },

        /**
         * Устанавливает файл в качестве активного
         * Показ детальной информации + выделение в рабочей области
         */
        select: function (file) {
            this.selected = file;
        },

        /**
         * Активирует файл по ID
         */
        selectById: function (id) {
            this.select(this.getFileById(id));
        },

        /**
         * Выбирает файл по ID, установленному при открытии окна
         * (позволяет сразу установить в менеджере активный файл, хз как еще описать)
         */
        selectFromOption: function () {
            if (this.options.id !== null && this.options.id !== undefined) {
                this.selectById(this.options.id);
            }
        },

        /**
         * Деактивирует активный выбранный файл
         */
        unselect: function () {
            this.selected = null;
        },

        /**
         * Добавляет объект файла в общий список файлов
         */
        add: function (file) {
            this.files.unshift(file)
        },

        /**
         * Обновляет мета информацию файла
         */
        updateMeta: function () {
            this.progressStart();

            const data  = {
                name:  this.$refs.metaName.value,
                title: this.$refs.metaTitle.value,
            };

            axios.post('/vendor/media-manager/update/' +  this.selected.id, data).then(response => {
                this.selected.name  = data.name;
                this.selected.title = data.title;
                this.progressSuccess();
            }).catch(error => {
                this.processApiErrorsSupport(error, () => this.progressFail())
            })
        },

        // ---------------------------------------------------
        // Modal
        // ---------------------------------------------------

        /**
         * Закрывает менеджер изображений
         * Выполняет закрытие модального окна + сброс + изменения параметра состояния isOpen = false
         */
        close: function () {
            this.$modal.hide('media-manager');
        },

        /**
         * Открывает модальное окно
         */
        open: function () {
            $('body').addClass('media-manager-body-disable');
            this.$modal.show('media-manager');
        },

        /**
         * Срабатывает при закрытии модалки любыми способами
         * Данный метод необходим, так как закно можно закрыть кнопкой ESC
         */
        beforeCloseModal: function () {
            $('body').removeClass('media-manager-body-disable');

            this.isOpened = false;
            this.reset();
        },

        /**
         * Сбрасывает состояние менеджера, за исключением загруженных файлов
         */
        reset: function () {
            this.selected        = null;
            this.search          = '';

            this.options.id      = null;
            this.options.context = null;
            this.options.use     = null;
        },

        // ---------------------------------------------------
        // Plugin
        // ---------------------------------------------------

        /**
         * Возвращает главный объект плагина
         */
        plugin: function () {
            return this.$MediaManager;
        },

        // ---------------------------------------------------
        // Progress Bar
        // ---------------------------------------------------

        /**
         * Запускает прогресс бар
         */
        progressStart: function () {
            this.$Progress.start();
        },

        /**
         * Завершает прогресс бар
         */
        progressSuccess: function () {
            this.$Progress.finish();
        },

        /**
         * Завершает прогресс бар меняя цвет на красный
         */
        progressFail: function () {
            this.$Progress.fail();
        },

        // ---------------------------------------------------
        // Support
        // ---------------------------------------------------

        /**
         * Получает объект файла по ID
         */
        getFileById: function (id) {
            return this.files[this.getIndexFileById(id)];
        },

        /**
         * Возвращает индекс файла в массиве файлов, проверяя ID
         */
        getIndexFileById: function (id) {
            for (let index = 0; index < this.files.length; index++) {
                const file = this.files[index];

                if (file.id === id) {
                    return index
                }
            }
        },

        /**
         * Обработка ошибок от сервера
         *
         * extra
         * * invalid - выполнит коллбек, если зафиксирована ошибка валидации
         * * error   - выполняется при неизвестной ошибке
         *
         * @param error
         * @param then
         * @param extra
         */
        processApiErrorsSupport: function (error, then, extra) {
            extra = extra || {}

            console.log('//// Media Manager  ---------------------------')
            console.log('API error')
            console.log(error);
            console.log(error.response);
            console.log('//// ------------------------------------------')

            if (error.response !== undefined && error.response.status !== undefined && error.response.status === 422) {
                const messages = [];

                error.response.data.errors.forEach(function(item, i, arr) {
                    messages.push(item.message);
                });

                Swal.fire({
                    icon: 'error',
                    title: 'Ошибка валидации',
                    text: messages.join('. '),
                })

                if (extra.invalid !== null && extra.invalid !== undefined) {
                    extra.error();
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ошибка',
                    text: error.response.data.message || ''
                })

                if (extra.error !== null && extra.error !== undefined) {
                    extra.error();
                }
            }

            if (then !== null && then !== undefined) {
                then();
            }
        },

    }
}
</script>
