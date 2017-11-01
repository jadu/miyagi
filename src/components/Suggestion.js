import React from 'react';
import doneIcon from '../../assets/done.png';
import TransitionPhaseService from '../services/TransitionPhaseService';
import Button from './Button';

export default class Suggestion extends React.Component {
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

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    handleKeyPress (event) {
        if (event.keyCode === this.props.shortcut) {
            this.handleClick(document.getElementById(this.props.id))
        }
    }

    async nextState (label) {
        const wait = parseFloat(window.getComputedStyle(label).animationDuration) * 1000;
        const { state, proceed } = await this.transitionPhaseService.update(this.state, wait);

        await this.setState(state);

        if (proceed) {
            return await this.nextState(label);
        } else {
            return new Promise(resolve => {
                setTimeout(resolve, wait + 500);
            });
        }
    }

    async handleClick (label) {
        console.log(label)

        this.props.handleClick();
        await this.nextState(label);
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
        const isActive = active === null || active === id;
        const modifiers = []

        modifiers.push(`button--${value.toLowerCase().trim().replace(/\s/g, '-')}`);
        modifiers.push(this.state.phase.className)

        return (
            <Button
                id={id}
                ref="button"
                value={overwrittenValue ? overwrittenValue : value}
                icon={overwrittenIcon ? overwrittenIcon : icon}
                onClick={this.handleClick.bind(this)}
                modifiers={modifiers}
                active={isActive}
            />
        );
    }
};
