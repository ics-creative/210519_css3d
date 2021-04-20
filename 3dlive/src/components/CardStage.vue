<template>
  <div class="CardStageComponent" :style="rootStyle">
    <div class="info">transform: {{ selectedTransform }}</div>
    <div class="offsetMover" :class="{ offsetCenter }">
      <div class="axis axisX"></div>
      <div class="axis axisY"></div>
      <div class="axis axisZ"></div>
      <FlyingCard
        v-for="card in cards"
        :key="card.id"
        :transforms="card.transforms"
        :origin="`${card.originX}% ${card.originY}%`"
        :isfocused="card.id === selected"
        @click="select(card)"
      ></FlyingCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import FlyingCard from "./FlyingCard.vue";
import { CardProps } from "@/types/CardProps";
import { transformPropFuncName } from "@/logics/transformPropFuncName";
import { transformPropUnit } from "@/logics/transformPropUnit";

export default defineComponent({
  components: {
    FlyingCard
  },
  props: {
    cards: {
      type: Array as PropType<CardProps[]>,
      default: () => []
    },
    perspective: {
      type: Number,
      default: 600
    },
    preserve: {
      type: Boolean,
      default: false
    },
    perspectiveOrigin: {
      type: String,
      default: "0% 0%"
    },
    selected: {
      type: String,
      default: ""
    },
    offsetCenter: {
      type: Boolean,
      default: true
    }
  },
  emits: ["update:selected"],
  setup(props, ctx) {
    const rootStyle = computed(() => ({
      perspective: props.perspective + "px",
      transformStyle: props.preserve ? "preserve-3d" : "initial",
      perspectiveOrigin: props.perspectiveOrigin
    }));
    const select = (card: CardProps) => {
      ctx.emit("update:selected", card.id);
    };
    const selectedTransform = computed(() => {
      const card = props.cards.find((c) => c.id === props.selected);
      if (!card) return "";
      return card.transforms
        .map(
          (t) =>
            `${transformPropFuncName[t.key]}(${t.value}${
              transformPropUnit[t.key]
            })`
        )
        .join(" ");
    });
    return {
      rootStyle,
      select,
      selectedTransform
    };
  }
});
</script>

<style scoped lang="scss">
.CardStageComponent {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url(../assets/grid.svg);
  background-size: 200px;
  background-position: center;
  .info {
    background-color: #ffffffcc;
    position: relative;
    z-index: 1;
    padding: 2px 8px;
  }
  .offsetMover {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    transform-style: inherit;
    &.offsetCenter {
      left: 50%;
      top: 50%;
    }
  }
  .axis {
    &.axisX {
      position: absolute;
      width: 100%;
      height: 4px;
      top: -2px;
      left: -50%;
      background-color: red;
    }
    &.axisY {
      position: absolute;
      width: 4px;
      height: 100%;
      left: -2px;
      top: -50%;
      background-color: green;
    }
    &.axisZ {
      position: absolute;
      width: 4px;
      height: 100%;
      left: -2px;
      top: -50%;
      background-color: blue;
      transform: rotateX(90deg);
    }
  }
}
</style>
