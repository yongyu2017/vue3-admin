<template>
     <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script setup>
import { defineProps, toRefs, computed } from 'vue';

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    className: {
        type: String,
        default: '',
    },
})
const { icon, className } = toRefs(props)
const iconName = computed(() => {
    return `#icon-${ icon.value }`
})
const svgClass = computed(() => {
    if (className.value) {
        return 'svg-icon ' + className.value
    } else {
        return 'svg-icon'
    }
})
</script>

<style lang="scss" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
    overflow: hidden;
}
</style>
