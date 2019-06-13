import Vue from 'vue';
import Vuex, { Module } from 'vuex';
import Minefield from '@/store/modules/minefield';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Minefield,
  },
  state: {
    difficulty_ratios: {
      easy: 0.15,
      medium: 0.25,
      hard: 0.35,
    },
    game_states: {
      initializing: 'INITIALIZING',
      ready: 'READY',
      in_progress: 'IN_PROGRESS',
      complete: 'COMPLETE',
      failed: 'FAILED',
    },
    grid_sizes: {
      small: 9,
      medium: 16,
      large: 32,
    },
    selected_difficulty: 'easy',
    selected_grid_size: 'small',
  },
});
