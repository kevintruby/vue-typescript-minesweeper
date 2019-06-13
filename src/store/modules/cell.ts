import { Module, VuexModule, Mutation } from 'vuex-module-decorators';

@Module({ namespaced: true, stateFactory: true })
export default class Cell extends VuexModule {
    private __is_flagged = false;

    @Mutation
    public toggleFlag(): void {
        this.is_flagged = !this.is_flagged;
    }

    get is_flagged() {
        return this.__is_flagged;
    }
    set is_flagged(is_flagged: boolean) {
        this.__is_flagged = is_flagged;
    }
}
