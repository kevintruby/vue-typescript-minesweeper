<template>
  <div class="home minefield">
    <img alt="Vue logo" src="../assets/logo.png">
    <div class="container">
      <div v-for="(row, row_i) in grid" :key="row_i" class="row">
        <div v-for="(column, col_i) in row" :key="col_i" class="col col-auto p-0 m-0">
          <Cell :row="row_i" :column="col_i" :key="`${row_i}:${col_i}`" />
        </div>
      </div>
      <div v-if="game_over" class="mt-5">
        <h3>GAME OVER!</h3>
        <button @click.prevent="init" class="btn btn-primary">Try Again</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Cell from '@/components/Cell.vue';
import { namespace } from 'vuex-class';

// TS way of mapping mutations/getters
const minefieldModule = namespace('Minefield');

@Component({
  components: {
    Cell,
  },
})
export default class Home extends Vue {
  @minefieldModule.Getter
  private grid!: any[][];

  @minefieldModule.Getter
  private game_over!: boolean;

  @minefieldModule.Action
  private init!: () => void;

  private mounted() {
    this.init();
  }
}
</script>

<style lang="scss">
  .minefield {
    .row {
      line-height: 10px; // fixes too much space between rows
    }
  }
</style>
