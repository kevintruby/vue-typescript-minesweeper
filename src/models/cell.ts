import { Mine } from '@/models/mine';

// lodash helpers
import { get } from 'lodash';
const _ = { get };

export class Cell {
    private __is_flagged: boolean = false;
    private __mine?: Mine;

    constructor(cell_obj: object = {}) {
        this.is_flagged = _.get(cell_obj, 'is_flagged', false);
        this.mine = _.get(cell_obj, 'mine', undefined);
    }

    public get is_flagged() {
        return this.__is_flagged;
    }
    public set is_flagged(is_flagged: boolean) {
        this.__is_flagged = is_flagged;
    }

    public get mine() {
        return this.__mine;
    }
    public set mine(mine_obj) {
        this.__mine = mine_obj;
    }

    public toggleFlag(): void {
        this.is_flagged = !this.is_flagged;
    }
}
