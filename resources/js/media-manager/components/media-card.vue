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
            return this.state.selected !== null && this.state.selected !== undefined && this.file.id === this.state.selected.id;
        }
    },
    methods: {
        select: function () {

            console.log('//////////////////////////////////')
            console.log(this.state)
            console.log('//////////////////////////////////')

            if (this.state.selected === null || this.state.selected === undefined || this.file.id !== this.state.selected.id) {
                this.$emit('file-selected', this.file);
            }
        },
        use: function () {
            this.$emit('file-uses');
        },
    }
}
</script>
