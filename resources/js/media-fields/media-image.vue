<template>
    <div class="row media-image-list">

        <!-- Установленное изображение -->
        <div class="col-md-4 col-lg-3 media-image-list__item media-image" v-if="isDefined">
            <div class="media-image__content">
                <img class="media-image__img" :src="url" alt="" @click="replace()">

                <div class="media-image__actions">
                    <a class="media-image__action" target="_blank" :href="url"><i class="fal fa-eye"></i></a>
                    <button type="button" class="media-image__action  media-image__action--remove" @click="reset()"><i class="fal fa-times"></i></button>
                </div>
            </div>
            <div class="media-image__description">
                <input type="text" :name="'media[' + name + '][title]'" class="media-image__description" v-model="title" placeholder="Описание">
            </div>

            <input type="hidden" :name="'media[' + name + '][id]'" v-model="id">
        </div>

        <!-- Выбор изображения -->
        <div class="col-md-4 col-lg-3 media-image-list__item media-image-select" @click="select()" v-else>
            <div class="media-image-select__wrapper">
                <img class="media-image-select__dilator" src="/assets/admin/img/modules/media-manager/wrapper.png" alt="">
                <div class="media-image-select__content">
                    <div class="media-image-select__icon"><i class="fal fa-file-image"></i></div>
                    Выбрать
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    props: ['name', 'context', 'settableId', 'settableTitle'],
    computed: {
        isDefined: function () {
            return this.id !== undefined && this.id !== null;
        },
        url: function () {
            if (this.id !== undefined && this.id !== null) {
                return this.$MediaManager.getUrlById(this.id);
            } else {
                return '#';
            }
        }
    },
    data: function () {
        return {
            id: null,
            title: null,
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            if (this.settableId !== undefined && this.settableId !== null && this.settableId.trim() !== '') {
                this.id = this.settableId;
            }

            if (this.settableTitle !== undefined && this.settableTitle !== null && this.settableTitle.trim() !== '') {
                this.title = this.settableTitle;
            }
        })
    },
    methods: {

        /**
         * Перввичный выбор изображения
         */
        select: function () {
            this.$MediaManager.open({
                context: this.context,
                use: (file) => {
                    this.id = file.id;

                    return true;
                }
            });
        },

        /**
         * Замена выбранного изображения
         */
        replace: function () {
            this.$MediaManager.open({
                id: this.id,
                context: this.context,
                use: (file) => {
                    this.id = file.id;

                    return true;
                }
            });
        },

        /**
         * Сброс изображения
         */
        reset: function () {
            this.id = null;
            this.title = null;
        }
    }
}
</script>
