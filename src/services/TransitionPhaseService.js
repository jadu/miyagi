export default class TransitionPhaseService {
    constructor (transitionMap) {
        this.transitionMap = transitionMap;
        this.phase = this.transitionMap[Object.keys(this.transitionMap).shift()];
        this.active = false;
    }

    update (state, wait) {
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
