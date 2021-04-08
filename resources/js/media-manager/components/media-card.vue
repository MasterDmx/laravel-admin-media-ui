<template>
    <div class="media-card" v-bind:class="{ 'active': isSelected }" @dblclick="use()" @click="select()">
        <div class="media-card__wrapper">
            <div class="media-card__img">
                <img :src="file.url" alt="">
            </div>

            <div class="media-card__name">{{ file.name }}</div>
            <div class="media-card__meta">
                <span>{{ file.width }}x{{ file.height }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        file: Object,
        state: Object,
    },
    data: function () {
        return {
            rename: false,
        }
    },
    computed: {
        isSelected: function () {
            return this.state.activeFile !== null && this.state.activeFile !== undefined && this.file.id === this.state.activeFile.id;
        }
    },
    methods: {
        select: function () {
            if (this.state.activeFile === null || this.state.activeFile === undefined || this.file.id !== this.state.activeFile.id) {
                this.$emit('file-selected', this.file);
            }
        },
        use: function () {
            this.$emit('file-uses');
        },
    }
}
</script>
