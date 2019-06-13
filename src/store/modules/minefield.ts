import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { Cell } from '@/models/cell';
import { Mine } from '@/models/mine';

// lodash helpers
import { random } from 'lodash';
const _ = { random };

@Module({ namespaced: true })
export default class Minefield extends VuexModule {
    private __grid: Cell[][] = [ [new Cell()] ];  // initialize two-dimensional array
    private __flags_available: number = 0;
    private __mine_limit: number = 0;

    @Action
    public init(): void {
        const { rootState, commit, dispatch } = this.context,
            { grid_sizes, selected_grid_size } = rootState,
            grid_size = grid_sizes[selected_grid_size];

        let rows = [];

        for (let i = 0; i < grid_size; i++) {
            const columns = [];
            for (let j = 0; j < grid_size; j++) {
                const cell_obj = new Cell();
                columns.push(cell_obj);
            }
            rows.push(columns);
        }

        dispatch('placeMines', rows).then((grid) => {
            rows = grid;
            commit('setGrid', rows);
        });
    }

    @Action
    public triggerCell(coordinates: any): void {
        const { commit, getters } = this.context,
            { row_i, col_i } = coordinates,
            cell_obj = new Cell(this.__grid[row_i][col_i]);
        
        if (cell_obj.is_flagged) {
            return;
        }

        if (cell_obj.mine) {
            // @todo: GAME OVER!
            commit('triggerMine', coordinates);
        }
    }

    // example of getter with a parameter -- useful for finding in collection
    get cellByIndex(): any {
        const self = this;
        return (row_i: number, col_i: number) =>  {
            return self.grid[row_i][col_i];
        };
    }

    get game_over() {
        return this.__grid.some((row) => {
            return row.some((cell: Cell) => {
                const { mine } = cell;
                return (mine && mine.is_triggered);
            });
        });
    }

    /**
     * get keyword will function as a vuex getters entry, but you can't
     * define an accompanying set keyword and have it behave like a real
     * ES6 class! attempting to set `this.grid = some_array` will create
     * a new, dynamic property within the module's `state` object
     */
    get grid(): Cell[][] {
        return this.__grid;
    }

    get mine_limit(): number {
        return this.__mine_limit;
    }

    get flags_available(): number {
        return this.__flags_available;
    }

    @Mutation
    public decrementFlagsAvailable(): void {
        this.__flags_available--;
    }

    @Mutation
    public increaseFlagsAvailable(): void {
        this.__flags_available++;
    }

    @Mutation
    public setFlagsAvailable(flag_count: number): void {
        this.__flags_available = flag_count;
    }

    @Mutation
    public setMineCount(mine_count: number): void {
        this.__mine_limit = mine_count;
    }

    @Mutation
    public setGrid(cell_matrix: Cell[][]): void {
        this.__grid = cell_matrix;
    }

    /**
     * can't access getters within mutations!
     * 
     * even though this file looks like a class, it doesn't really *function*
     * like one: everything seems to get compiled to a traditional vuex
     * object structure. while a class would easily allow you to access
     * `this.grid` within the method, it doesn't actually exist as a property
     * within `state`; and `mutations` doesn't expose any `getters` to the
     * method. the normal first argument of `state` is simply exposed as `this`.
     */
    @Mutation
    public toggleCellFlag({ row_i, col_i }: any): void {
        const cell_obj = new Cell(this.__grid[row_i][col_i]);
        cell_obj.toggleFlag();

        /**
         * vuex doesn't react to mutating collection item attributes; must
         * be spliced. simply replacing the collection item doesn't trigger
         * changes in the components that maps state/getters
         */
        this.__grid[row_i].splice(col_i, 1, cell_obj);
    }

    @Mutation
    public triggerMine({ row_i, col_i }: any): void {
        const cell_obj = new Cell(this.__grid[row_i][col_i]);
        if (cell_obj.mine) {
            cell_obj.mine.explode();
        }
        this.__grid[row_i].splice(col_i, 1, cell_obj);
    }

    @Action
    public placeMines(grid: Cell[][]): Promise<Cell[][]> {
        const { rootState, commit } = this.context,
            { grid_sizes, selected_grid_size, difficulty_ratios, selected_difficulty } = rootState,
            grid_size = grid_sizes[selected_grid_size],
            difficulty_ratio = difficulty_ratios[selected_difficulty];

        return new Promise((resolve) => {
            const mine_limit = Math.ceil(Math.pow(grid_size, 2) * difficulty_ratio),
                flags_available = mine_limit;

            commit('setFlagsAvailable', flags_available);
            commit('setMineCount', mine_limit);

            let mine_count = 0;
            while (mine_count < mine_limit) {
                const row = _.random(0, grid_size - 1),
                    col = _.random(0, grid_size - 1),
                    cell_obj: Cell = grid[row][col];
                if (!(cell_obj.mine ? true : false)) {
                    cell_obj.mine = new Mine();
                    mine_count++;
                }
            }

            // @todo: now with the mines placed, store a number in non-mined cells
            // representing number of adjacent mines
            
            resolve(grid);
        });
    }
}
