import { TransitionMap, Transition, TransitionState } from '../interfaces/Transition';

export default class TransitionPhaseService {
    private active: boolean;
    private phase: Transition;

    constructor (
        private transitionMap: TransitionMap
    ) {
        this.phase = this.transitionMap[Object.keys(this.transitionMap).shift()];
        this.active = false;
    }

    update (state, wait): Promise<TransitionState> {
        const nextPhase = this.transitionMap[state.phase.next];

        this.active = true;

        return new Promise(resolve => {
            setTimeout(() => {
                this.active = false;

                resolve({
                    state: Object.assign({}, state, {
                         phase: nextPhase
                        }, nextPhase.state),
                    proceed: !nextPhase.end
                });
            }, wait);
        });
    }

    getActive () {
        return this.active;
    }

    getPhase () {
        return this.phase;
    }

    reset (state) {
        return Object.assign({}, state, {
            phase: this.transitionMap[Object.keys(this.transitionMap).shift()]
        });
    }
}
