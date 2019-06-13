<template>
    <div class="minefield-cell"
        :class="{
            'flagged': cell_obj.is_flagged, 'reveal-mine': reveal_mine,
            'exploded-mine': is_mine_exploded
        }"
        @click.left="clickCell" @click.right.prevent="toggleFlag">
        <!-- @todo: content representing flag/mine -->
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { Cell } from '@/models/cell';

// TS way of mapping mutations/getters
const minefieldModule = namespace('Minefield');

@Component
export default class CellComponent extends Vue {
    @Prop({ required: true, type: Number, default: 0 })
    private readonly row!: number;
    @Prop({ required: true, type: Number, default: 0 })
    private readonly column!: number;

    /**
     * typescript class version of vuex mappers
     * 
     * `@minefieldModule` exposes the individual attributes that are
     * normally provided by vuex mapping helpers (i.e. mapState). TS
     * views these as attributes though, including the methods, and
     * wants them declared above the private methods.
     */
    @minefieldModule.Getter
    private cellByIndex!: (row_i: number, col_i: number) => Cell;

    @minefieldModule.Getter
    private game_over!: boolean;

    @minefieldModule.Action
    private triggerCell!: ({row_i, col_i}: any) => void;

    @minefieldModule.Mutation
    private toggleCellFlag!: ({row_i, col_i}: any) => void;

    private get cell_obj(): Cell {
        return this.cellByIndex(this.row, this.column);
    }

    private clickCell() {
        this.triggerCell(this.coordinates);
    }

    private toggleFlag() {
        this.toggleCellFlag(this.coordinates);
    }

    private get coordinates() {
        return {
            row_i: this.row,
            col_i: this.column,
        };
    }

    private get has_mine() {
        return this.cell_obj.mine ? true : false;
    }

    private get is_mine_exploded() {
        if (this.cell_obj.mine && this.cell_obj.mine.is_triggered)
            return true;
        return false;
    }

    private get reveal_mine() {
        return (this.has_mine && this.game_over);
    }
}
</script>

<style lang="scss" scoped>
    .minefield-cell {
        width: 32px;
        height: 32px;
        display: inline-block;
        background-color: #bbbbbb;
        border: 1px solid black;

        &:hover {
            background-color: #dddddd;
            cursor: pointer;
        }

        &.flagged {
            background-color: #cc0000;

            &:hover {
                background-color: #ff0000;
            }
        }

        &.reveal-mine {
            background-color: #333333;

            &.exploded-mine {
                background-color: #ff0000;
            }
        }
    }
</style>
