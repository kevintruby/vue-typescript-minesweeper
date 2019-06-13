import { get } from 'lodash';
const _ = { get };

export class Mine {
    private __is_disarmed: boolean = false;
    private __is_triggered: boolean = false;

    constructor(mine_obj: object = {}) {
        this.is_disarmed = _.get(mine_obj, 'is_disarmed', false);
        this.is_triggered = _.get(mine_obj, 'is_triggered', false);
    }

    get is_disarmed() {
        return this.__is_disarmed;
    }
    set is_disarmed(is_disarmed: boolean) {
        this.__is_disarmed = is_disarmed;
    }

    get is_triggered() {
        return this.__is_triggered;
    }
    set is_triggered(is_triggered: boolean) {
        this.__is_triggered = is_triggered;
    }

    public explode(): void {
        this.is_triggered = true;
    }
}
