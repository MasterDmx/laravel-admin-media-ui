<template>
    <div>

        <div class="media-manager">
            <modal name="media-manager" width="95%" height="auto" @before-close="beforeCloseModal">
                <vue-progress-bar></vue-progress-bar>

                <input id="media-manager-file-selector" ref="fileSelector" type="file" @change="upload" hidden>

                <div class="media-ui">
                    <div class="media-ui__row">

                        <div class="media-ui__col">

                            <div class="media-workspace">
                                <div class="media-workspace__row media-workspace__row--min-height">
                                    <div class="media-workspace__col">
                                        <div class="media-toolbar">
                                            <div class="media-search">
                                                <input type="text" v-model="search" placeholder="Поиск ...">
                                                <div class="media-search__icon"><i class="fal fa-search"></i></div>
                                            </div>

                                            <div class="media-control">
                                                <button @click="chooseFileForUpload()" title="Загрузить файл с компьютера" class="btn btn-media btn-media--icon btn-media--default mr-5"><i class="fal fa-cloud-upload"></i></button>
                                                <button @click="close()" title="Закрыть менеджер"  class="btn btn-media btn-media--icon btn-media--default"><i class="fal fa-times"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="media-workspace__row">

                                    <!-- Список файлов (если флаг filesIsLoaded установлен в true) -->
                                    <div class="media-workspace__col media-main-col" v-if="filesIsLoaded">
                                        <div class="media-main">
                                            <div class="media-cards">
                                                <media-card v-for="file in getFiles" :key="file.id" :file="file" :state="state" @file-selected="activate" @file-uses="use"></media-card>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Лоадер списка файлов (если флаг filesIsLoaded установлен в false) -->
                                    <div class="media-workspace__loader" v-else>
                                        <div class="spinner-border text-success" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>

                                </div>
                            </div>


                        </div>

                        <div class="media-details-col media-details-nothing" v-if="!hasActiveFile">
                            <div class="media-details-nothing__icon"><i class="fal fa-eye-slash"></i></div>
                            Файл не выбран
                        </div>

                        <div class="media-details-col media-details" v-else>

                            <div class="media-details-control">
                                <button class="btn btn-media btn-media--icon btn-media--default media-details-control__item" @click="use()"><i class="fal fa-check-circle"></i></button>
                                <button class="btn btn-media btn-media--icon btn-media--default media-details-control__item" @click="remove()" ><i class="far fa-trash-alt"></i></button>
                                <button class="btn btn-media btn-media--icon btn-media--default media-details-control__item" @click="deactivate()"><i class="fal fa-times"></i></button>
                            </div>

                            <div class="media-details__section">
                                <div class="media-details__img">
                                    <a target="_blank" :href="activeFile.url">
                                        <img :src="activeFile.url" alt="">
                                    </a>
                                </div>
                            </div>

                            <div class="media-details-information">
                                <div class="media-info">
                                    <div class="media-info__name">ID</div>
                                    <div class="media-info__value">{{ activeFile.id }}</div>
                                </div>
                                <div class="media-info">
                                    <div class="media-info__name">Название</div>
                                    <div class="media-info__value">{{ activeFile.name }}</div>
                                </div>
                                <div class="media-info">
                                    <div class="media-info__name">Alt</div>
                                    <div class="media-info__value">{{ activeFile.title }}</div>
                                </div>
                                <div class="media-info">
                                    <div class="media-info__name">Расширение</div>
                                    <div class="media-info__value">{{ activeFile.extension }}</div>
                                </div>
                                <div class="media-info">
                                    <div class="media-info__name">Разрешение</div>
                                    <div class="media-info__value">{{ activeFile.width }}x{{ activeFile.height }}</div>
                                </div>
                                <div class="media-info">
                                    <div class="media-info__name">Загружен</div>
                                    <div class="media-info__value">{{ getUploadDateForActiveFile }}</div>
                                </div>
                            </div>

                            <div class="media-details-variations">
                                <div class="media-details-variations__item">
                                    <div class="media-details-variations__name">Оригинал</div>
                                    <a target="_blank" :href="activeFile.url" class="media-details-variations__view"><i class="fal fa-eye"></i></a>
                                </div>

                                <div class="media-details-variations__item" v-for="variation in getVariations" :key="variation.name">
                                    <div class="media-details-variations__name">{{ variation.name }}</div>
                                    <a target="_blank" :href="variation.url" class="media-details-variations__view"><i class="fal fa-eye"></i></a>
                                </div>
                            </div>

                            <div class="media-details__editor">
                                <div class="form-group">
                                    <label class="form-label media-form-label media-form-label" for="media-manager-details-edit-name">Название</label>
                                    <input type="text" id="media-manager-details-edit-name" ref="metaName" class="form-control media-form-control" :value="activeFile.name">
                                </div>

                                <div class="form-group">
                                    <label class="form-label media-form-label media-form-label" for="media-manager-details-edit-a-title">Title \ Alt</label>
                                    <input type="text" id="media-manager-details-edit-a-title" ref="metaTitle" class="form-control media-form-control" :value="activeFile.title">
                                </div>

                                <button type="button" class="btn btn-outline-success waves-effect waves-themed" @click="updateMeta()"> <span class="fal fa-download mr-1"></span> Сохранить </button>
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
        return this.$MediaManager.state;
    },

    computed: {
        hasActiveFile: function () {
            return this.activeFile !== null && this.activeFile !== undefined;
        },

        // Весь объект данных для передачи дочерним компонентам
        state: function () {
            return this.plugin().state;
        },

        getVariations: function () {
            return this.activeFile.variations;
        },

        getUploadDateForActiveFile: function () {
            const date = new Date(this.activeFile.uploaded_at * 1000);
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
        // Отслеживаем аттрибут isOpened, который открывает \ закрывает окно
        isOpened: function () {
            if (this.isOpened) {
                this.open();
            } else {
                this.close();
            }
        },

        filesIsLoaded: function () {

            console.log('--------------------------');
            console.log(this.files);
            console.log('--------------------------');

            if (this.plugin().options.active !== null && this.plugin().options.active !== undefined) {
                this.activate(this.plugin().options.active)
            }
        }
    },

    methods: {
        /**
         * Запускает колбек, который прилетел при открытии менеджера
         * Закрывает менеджер
         */
        use: function () {
            this.progressStart();
            this.plugin().use({
                success: () => {
                    this.progressSuccess();
                    this.close();
                },
                error: () => {
                    this.progressFail();
                    Swal.fire({
                        icon: 'error',
                        title: 'Ошибка обработки',
                    })
                },
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

            if (file) {
                const data = new FormData();
                data.append('file', file);

                this.progressStart();
                this.plugin().uploadFile({
                    data: data,
                    success: (file) => {
                        this.add(file);
                        this.activate(file);
                        this.progressSuccess();
                    },
                    validateError: (messages) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Ошибка валидации',
                            text: messages.join('. '),
                        })
                    },
                    error: (error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Ошибка загрузки',
                        })
                        this.progressFail();
                    }
                })
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
                confirmButtonText: "Да, сделай это!",
                cancelButtonText: "Нет, я передумал"
            }).then((result) => {
                if (result.value) {
                    this.progressStart();

                    axios.delete(this.plugin().getApiUrlForRemove(this.activeFile.id)).then(response => {
                        this.removeFileFromListById(this.activeFile.id);
                        this.deactivate();
                        this.progressSuccess();
                    }).catch(error => {
                        this.progressFail();
                    })
                }
            });
        },

        /**
         * Удаляет объект файла из списка по ID
         */
        removeFileFromListById: function (id) {
            this.files.splice(this.plugin().getIndexFileById(id), 1);
        },

        /**
         * Устанавливает файл в качестве активного
         * Показ детальной информации + выделение в рабочей области
         */
        activate: function (file) {
            this.activeFile = file;
        },

        /**
         * Деактивирует активный выбранный файл
         */
        deactivate: function () {
            this.activeFile = null;
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

            const data  = new FormData();
            const name  = this.$refs.metaName.value;
            const title = this.$refs.metaTitle.value;

            data.append('name', name);
            data.append('title', title);

            axios.post(this.plugin().getApiUrlForUpdate(this.activeFile.id), data).then(response => {
                this.activeFile.name = name;
                this.activeFile.title = title;
                this.progressSuccess();
            }).catch(error => {
                console.log(error);
                this.progressFail();
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
            this.plugin().reset();
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


    }
}
</script>
