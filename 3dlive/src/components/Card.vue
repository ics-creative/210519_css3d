<template>
  <div class="CardComponent">
    <img :src="`https://picsum.photos/seed/${imgSeed}/300/150`" />
    <h2 class="title">Click to Select</h2>
    <div class="text">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip...
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

let instanceCount = 0;

export default defineComponent({
  setup() {
    instanceCount++;
    const imgSeed = instanceCount + 100;

    return {
      imgSeed
    };
  }
});
</script>

<style lang="scss" scoped>
.CardComponent {
  height: 100%;
  border-radius: 4px;
  border: 1px solid rgb(105, 122, 138);
  overflow: hidden;
  background-color: white;
  position: relative;
  > img {
    width: 100%;
    min-height: 150px;
    background-color: rgb(181, 196, 209);
  }
  .title {
    padding: 2px 8px;
    font-weight: bold;
    font-size: 20px;
    color: rgb(60, 69, 78);
  }
  .text {
    padding: 2px 8px 8px 8px;
    font-size: 12px;
    line-height: 16px;
  }
}
</style>
