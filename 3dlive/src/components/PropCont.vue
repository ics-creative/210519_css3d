<template>
  <div class="PropContComponent">
    <ul class="staticListGroup">
      <li class="listGroupItem">
        <div class="itemContent">
          <label>
            <input
              type="checkbox"
              v-model="stageProps.offsetCenter"
            />原点を画面中央にずらす</label
          >
        </div>
      </li>
    </ul>

    <div class="label">
      stage style <span class="info">（親要素のスタイル）</span>:
    </div>
    <ul class="staticListGroup">
      <li class="listGroupItem">
        <div class="itemContent">
          <Slider
            label="perspective"
            v-model="stageProps.perspective"
            :min="0"
            :max="1000"
            suffix="px"
          />
        </div>
      </li>
      <li class="listGroupItem">
        <div class="itemContent">
          <label>
            <input
              type="checkbox"
              v-model="stageProps.preserve"
            />tansform-style: preserve-3d</label
          >
        </div>
      </li>
      <li class="listGroupItem">
        <div class="itemContent">
          <div>perspective-origin:</div>
          <Slider
            label="X"
            v-model="stageProps.perspectiveOriginX"
            :min="-20"
            :max="120"
            :suffix="perspectiveOriginXSuffix"
          />
          <Slider
            label="Y"
            v-model="stageProps.perspectiveOriginY"
            :min="-20"
            :max="120"
            :suffix="perspectiveOriginYSuffix"
          />
        </div>
      </li>
    </ul>

    <div class="label">transform-origin:</div>
    <ul class="staticListGroup" v-if="cardProps.transformOriginX !== undefined">
      <li class="listGroupItem">
        <div class="itemContent">
          <Slider
            label="X"
            v-model="cardProps.transformOriginX"
            :min="0"
            :max="100"
            :suffix="transformOriginXSuffix"
          />
          <Slider
            label="Y"
            v-model="cardProps.transformOriginY"
            :min="0"
            :max="100"
            :suffix="transformOriginYSuffix"
          />
        </div>
      </li>
    </ul>

    <div class="label">transform <span class="info">（下から合成）</span>:</div>
    <draggable
      class="draggableListGroup"
      tag="transition-group"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        name: !state.drag ? 'flip-list' : null
      }"
      v-model="list"
      v-bind="state.dragOptions"
      @start="state.drag = true"
      @end="state.drag = false"
      item-key="id"
    >
      <template #item="{ element }">
        <li class="listGroupItem">
          <div class="itemContent">
            <Slider
              :label="names[element.key]"
              v-model="element.value"
              :min="ranges[element.key][0]"
              :max="ranges[element.key][1]"
              :suffix="units[element.key]"
            />
          </div>
        </li>
      </template>
    </draggable>
  </div>
</template>

<script lang="ts">
import { TransformPropKey, TransformProp } from "@/types/CardProps";
import { computed, defineComponent, PropType, reactive, ref } from "vue";
import draggable from "vuedraggable";
import Slider from "./Slider.vue";
import { transformPropName } from "@/logics/transformPropName";
import { transformPropUnit } from "@/logics/transformPropUnit";

type State = {
  drag: boolean;
  dragOptions: {
    animation: number;
    group: string;
    disabled: boolean;
    ghostClass: string;
  };
};

const PROPRANGES: { [k in TransformPropKey]: number[] } = {
  x: [-500, 500],
  y: [-500, 500],
  z: [-500, 500],
  rx: [-360, 360],
  ry: [-360, 360],
  rz: [-360, 360]
};

export default defineComponent({
  components: {
    draggable,
    Slider
  },
  props: {
    transforms: {
      type: Array as PropType<TransformProp[]>,
      default: () => []
    },
    transformOriginX: {
      type: Number
    },
    transformOriginY: {
      type: Number
    },
    perspective: {
      type: Number,
      default: 0
    },
    preserve: {
      type: Boolean,
      default: false
    },
    perspectiveOriginX: {
      type: Number,
      default: 0
    },
    perspectiveOriginY: {
      type: Number,
      default: 0
    },
    offsetCenter: {
      type: Boolean,
      default: true
    }
  },
  emits: [
    "update:transforms",
    "update:transformOriginX",
    "update:transformOriginY",
    "update:perspective",
    "update:preserve",
    "update:perspectiveOriginX",
    "update:perspectiveOriginY",
    "update:offsetCenter"
  ],
  setup(props, ctx) {
    const state = reactive<State>({
      drag: false,
      dragOptions: {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      }
    });

    const list = computed({
      get: () => props.transforms ?? [],
      set: (l) => {
        ctx.emit("update:transforms", l);
        console.log("update:transforms", l);
      }
    });
    const stageProps = reactive({
      perspective: computed({
        get: () => props.perspective,
        set: (v) => ctx.emit("update:perspective", v)
      }),
      preserve: computed({
        get: () => props.preserve,
        set: (v) => ctx.emit("update:preserve", v)
      }),
      perspectiveOriginX: computed({
        get: () => props.perspectiveOriginX,
        set: (v) => ctx.emit("update:perspectiveOriginX", v)
      }),
      perspectiveOriginY: computed({
        get: () => props.perspectiveOriginY,
        set: (v) => ctx.emit("update:perspectiveOriginY", v)
      }),
      offsetCenter: computed({
        get: () => props.offsetCenter,
        set: (v) => ctx.emit("update:offsetCenter", v)
      })
    });

    const cardProps = reactive({
      transformOriginX: computed({
        get: () => props.transformOriginX,
        set: (v) => ctx.emit("update:transformOriginX", v)
      }),
      transformOriginY: computed({
        get: () => props.transformOriginY,
        set: (v) => ctx.emit("update:transformOriginY", v)
      })
    });

    const ranges = ref(PROPRANGES);
    const names = ref(transformPropName);
    const units = ref(transformPropUnit);

    const originToSuffixStr = (o: number | undefined, isX: boolean) => {
      if (o == undefined) return "";
      if (o === 0) return "% = " + (isX ? "left" : "top");
      if (o === 50) return "% = center";
      if (o === 100) return "% = " + (isX ? "right" : "bottom");
      return "%";
    };
    const transformOriginXSuffix = computed(() =>
      originToSuffixStr(props.transformOriginX, true)
    );
    const transformOriginYSuffix = computed(() =>
      originToSuffixStr(props.transformOriginY, false)
    );
    const perspectiveOriginXSuffix = computed(() =>
      originToSuffixStr(props.perspectiveOriginX, true)
    );
    const perspectiveOriginYSuffix = computed(() =>
      originToSuffixStr(props.perspectiveOriginY, false)
    );

    return {
      state,
      list,
      ranges,
      stageProps,
      cardProps,
      names,
      units,
      transformOriginXSuffix,
      transformOriginYSuffix,
      perspectiveOriginXSuffix,
      perspectiveOriginYSuffix
    };
  }
});
</script>

<style lang="scss" scoped>
.PropContComponent {
  .label {
    font-weight: bold;
    .info {
      font-size: 11px;
    }
  }
  .staticListGroup {
    margin: 0 0 2px 0;
    padding: 0;
    border-bottom: 2px solid #aaa;
    .listGroupItem + .listGroupItem {
      border-top: 1px solid #aaa;
    }
  }
  .draggableListGroup {
    min-height: 20px;
    margin: 0;
    padding: 0;
    .flip-list-move {
      transition: transform 0.5s;
    }
    .no-move {
      transition: transform 0s;
    }
    .ghost {
      opacity: 0.5;
      background: #c8ebfb;
    }
    .listGroupItem {
      margin-bottom: 1px;
      border-radius: 4px;
      border: 1px solid #61a6ce;
      cursor: move;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 16px;
        height: 100%;
        border-radius: 2px 0 0 2px;
        background-color: #61a6ce;
      }
    }
  }
  .listGroupItem {
    list-style: none;
    padding-left: 16px;
    background-color: #fff;
    position: relative;
    .itemContent {
      padding: 4px 8px;
    }
  }
}
</style>
