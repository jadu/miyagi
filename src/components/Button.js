import React from 'react';
import doneIcon from '../../assets/done.png';
import TransitionPhaseService from '../services/TransitionPhaseService';

export default class Button extends React.Component {
    constructor (props) {
        super(props);

        this.transitionPhaseService = new TransitionPhaseService({
            idle: { className: '', next: 'in' },
            in: { className: 'selected-in', next: 'out' },
            out: { className: 'selected-out', next: 'idle', end: true, state: { overwrittenValue: 'Thank you', overwrittenIcon: doneIcon } }
        });

        this.state = {
            phase: this.transitionPhaseService.getPhase(),
            overwrittenValue: '',
            overwrittenIcon: ''
        }
    }

    async nextState () {
        const wait = parseFloat(window.getComputedStyle(this.refs.label).animationDuration) * 1000;
        const { state, proceed } = await this.transitionPhaseService.update(this.state, wait);

        await this.setState(state);

        if (proceed) {
            return await this.nextState();
        } else {
            return new Promise(resolve => {
                setTimeout(resolve, wait + 500);
            });
        }
    }

    async handleClick () {
        this.props.handleClick();
        await this.nextState();
        await this.props.handleSuggestion();
        this.reset();
    }

    reset () {
        this.setState(
            Object.assign({}, this.state, this.transitionPhaseService.reset(this.state), {
                overwrittenIcon: '',
                overwrittenValue: ''
            })
        );
    }

    render () {
        const { value, handleClick, icon, active, id } = this.props;
        const { overwrittenValue, overwrittenIcon } = this.state;
        const modifier = value.toLowerCase().trim().replace(/\s/g, '-');
        const isActive = active === null || active === id;

        return (
            <button
                className={`button button--${modifier} ${this.state.phase.className} ${isActive ? '' : 'disabled'}`}
                onClick={this.handleClick.bind(this)}
            >
                { icon && <img className="button__icon" src={overwrittenIcon ? overwrittenIcon : icon}/> }
                <span ref="label" className="button__label">{ overwrittenValue ? overwrittenValue : value }</span>
            </button>
        );
    }
};
