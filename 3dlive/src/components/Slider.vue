<template>
  <label class="SliderComponent">
    <span class="label">{{ label }}：</span>
    <span class="value">{{ value }}{{ suffix }}</span>
    <div class="slider" @pointerdown="cancelEvent" @pointermove="cancelEvent">
      <VueSlider :min="min" :max="max" :interval="step" v-model="value" />
    </div>
  </label>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

export default defineComponent({
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    label: {
      type: String,
      default: ""
    },
    suffix: {
      type: String,
      default: ""
    }
  },
  emits: ["update:modelValue"],
  components: {
    VueSlider
  },
  setup(props, ctx) {
    const value = computed({
      get: () => props.modelValue,
      set: (v) => ctx.emit("update:modelValue", v * 1)
    });
    const cancelEvent = (e: Event) => {
      e.stopPropagation();
    };
    return {
      value,
      cancelEvent
    };
  }
});
</script>
