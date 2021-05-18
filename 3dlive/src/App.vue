<template>
  <div id="app" class="AppComponent">
    <div class="stageWrapper">
      <CardStage
        :cards="stageStatus.cards"
        v-model:selected="stageStatus.selected"
        :perspective="stageStatus.perspective"
        :preserve="stageStatus.preserve"
        :perspectiveOrigin="`${stageStatus.perspectiveOriginX}% ${stageStatus.perspectiveOriginY}%`"
        :offsetCenter="stageStatus.offsetCenter"
      />
    </div>
    <div class="control">
      <div class="btns">
        <button @click="reset">リセット</button>
        <button @click="addCard">カードを追加</button>
      </div>
      <PropCont
        v-model:transforms="selectedCard.transforms"
        v-model:transformOriginX="selectedCard.originX"
        v-model:transformOriginY="selectedCard.originY"
        v-model:perspective="stageStatus.perspective"
        v-model:preserve="stageStatus.preserve"
        v-model:perspectiveOriginX="stageStatus.perspectiveOriginX"
        v-model:perspectiveOriginY="stageStatus.perspectiveOriginY"
        v-model:offsetCenter="stageStatus.offsetCenter"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch } from "vue";
import CardStage from "./components/CardStage.vue";
import PropCont from "./components/PropCont.vue";
import { CardProps } from "./types/CardProps";
import { DelayExec } from "./logics/DelayExec";

type StageStatus = {
  cards: CardProps[];
  selected: string;
  perspective: number;
  preserve: boolean;
  perspectiveOriginX: number;
  perspectiveOriginY: number;
  offsetCenter: boolean;
};

const DEFAULT_STAGE_STATUS: StageStatus = {
  cards: [],
  selected: "",
  perspective: 600,
  preserve: true,
  perspectiveOriginX: 50,
  perspectiveOriginY: 45,
  offsetCenter: true
};

const randomBetween = (min: number, max: number) => {
  return Math.round(min + (max - min) * Math.random());
};

const makeCard = (isRnd = false): CardProps => ({
  id: `card-${Math.ceil(Math.random() * 1000000)}`,
  transforms: [
    { id: "0", key: "x", value: isRnd ? randomBetween(-300, 200) : 0 },
    { id: "1", key: "y", value: isRnd ? randomBetween(-400, 200) : 0 },
    { id: "2", key: "z", value: isRnd ? randomBetween(-100, 100) : 0 },
    { id: "3", key: "rx", value: isRnd ? randomBetween(-30, 30) : 0 },
    { id: "4", key: "ry", value: isRnd ? randomBetween(-30, 30) : 0 },
    { id: "5", key: "rz", value: isRnd ? randomBetween(-30, 30) : 0 }
  ],
  originX: 50,
  originY: 50
});

const getDefaultStatus = (): StageStatus => {
  const status = JSON.parse(JSON.stringify(DEFAULT_STAGE_STATUS));
  return status as StageStatus;
};

const setStatus = (stageStatus: StageStatus) => {
  const str = JSON.stringify(stageStatus);
  history.replaceState(undefined, "", `#${encodeURIComponent(str)}`);
};

const loadStatus = (): StageStatus | undefined => {
  const hash = window.location.hash.substring(1);
  try {
    const obj = JSON.parse(decodeURIComponent(hash));
    if (!obj) return undefined;
    const status = getDefaultStatus();
    Object.assign(status, obj);
    return obj as StageStatus;
  } catch {
    return undefined;
  }
};

export default defineComponent({
  name: "App",
  components: {
    CardStage,
    PropCont
  },
  setup() {
    const stageStatus = reactive<StageStatus>(
      loadStatus() ?? getDefaultStatus()
    );
    const addCard = () => {
      const isRandom = stageStatus.cards.length !== 0;
      stageStatus.cards.push(makeCard(isRandom));
    };
    const reset = () => {
      Object.assign(stageStatus, getDefaultStatus());
      addCard();
    };
    const selectedCard = computed(
      () =>
        stageStatus.cards.find((card) => card.id === stageStatus.selected) ?? {}
    );

    // ステート変更時にアドレスバーを更新
    const saveThrottle = new DelayExec(350); // 実行頻度を回/350ms以下に制限
    watch(
      () => stageStatus,
      () => {
        saveThrottle.exec(() => setStatus(stageStatus));
      },
      {
        deep: true
      }
    );

    window.addEventListener("hashchange", () => {
      console.log("hash changed: load state");
      const st = loadStatus();
      Object.assign(stageStatus, st);
    });

    // 起動時にカード0舞なら最初のカードを追加
    if (!stageStatus.cards.length) addCard();

    return {
      stageStatus,
      reset,
      addCard,
      selectedCard
    };
  }
});
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
html,
body,
#app {
  margin: 0;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.AppComponent {
  display: grid;
  grid-template-columns: 1fr min(33vw, 250px);
  grid-template-areas: "stage cont";
  .stageWrapper {
    grid-area: stage;
  }
  .control {
    grid-area: cont;
    .btns {
      display: flex;
      button {
        flex-grow: 1;
        min-height: 24px;
        background-color: #61a6ce;
        border: none;
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        border-radius: 3px;
      }
      button + button {
        margin-left: 1px;
      }
    }
  }
}
</style>
