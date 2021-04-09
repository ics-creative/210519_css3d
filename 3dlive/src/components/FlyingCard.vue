<template>
  <!--<div class="FlyingCardInfo" v-if="isfocused">{{ rootStyle.transform }}</div>-->
  <div class="FlyingCardComponent" :style="rootStyle" @click="onclick">
    <Card />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import Card from "./Card.vue";
import { TransformProp } from "@/types/CardProps";
import { transformPropFuncName } from "@/logics/transformPropFuncName";
import { transformPropUnit } from "@/logics/transformPropUnit";

export default defineComponent({
  props: {
    transforms: { type: Array as PropType<TransformProp[]>, default: () => [] },
    origin: {
      type: String,
      default: "center center"
    },
    isfocused: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Card
  },
  emits: ["click", "change"],
  setup(props, ctx) {
    const transform = computed(() => {
      const tr = props.transforms
        .map(
          (t) =>
            `${transformPropFuncName[t.key]}(${t.value}${
              transformPropUnit[t.key]
            })`
        )
        .join(" ");
      ctx.emit("change", tr);
      return tr;
    });
    const rootStyle = computed(() => ({
      transform: transform.value,
      transformOrigin: props.origin,
      border: props.isfocused ? "2px solid #000" : "none"
    }));

    const onclick = () => {
      ctx.emit("click");
    };

    return {
      rootStyle,
      onclick
    };
  }
});
</script>

<style scoped lang="scss">
.FlyingCardInfo {
  position: absolute;
  width: 50%;
  z-index: 1;
  font-size: 15px;
  padding: 2px 4px;
  color: rgb(50, 59, 65);
  background-color: #ffffffaa;
}
.FlyingCardComponent {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 400px;
}
</style>
