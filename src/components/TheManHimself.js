import React from 'react';
import MrMiagi from '../../assets/miyagi.png';
import MrMiagiBlink from '../../assets/miyagi_blink.png';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class TheManHimself extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            src: MrMiagi
        }
    }

    componentDidMount () {
        this.blink();
    }

    componentWilUnmount () {
        clearTimeout(this.timeout);
    }

    async blink () {
        await this.setState({
            src: MrMiagiBlink
        });

        this.timeout = setTimeout(() => {
            this.setState({
                src: MrMiagi
            });

            this.timeout = setTimeout(this.blink.bind(this), getRandomInt(100, 6000));
        }, getRandomInt(150, 300));
    }

    render () {
        return (
            <div className="mr-miyagi">
                <img src={this.state.src} className="mr-miyagi__image"/>
            </div>
        )
    }
}
