import * as React from 'react';
import * as MrMiyagi from '../../assets/miyagi.png';
import * as MrMiyagiBlink from '../../assets/miyagi_blink.png';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface TheManHimselfState {
    src: string;
}

export default class TheManHimself extends React.Component {
    private timeout: number;
    private blinkSprite: string;
    private defaultSprite: string;
    public state: TheManHimselfState;

    constructor () {
        super();
        this.defaultSprite = MrMiyagi;
        this.blinkSprite = MrMiyagiBlink;
        this.state = {
            src: this.defaultSprite
        }
    }

    componentDidMount () {
        this.blink();
    }

    componentWillUnmount () {
        clearTimeout(this.timeout);
    }

    async blink () {
        await this.setState({
            src: this.blinkSprite
        });

        this.timeout = setTimeout(() => {
            this.setState({
                src: this.defaultSprite
            });

            this.timeout = setTimeout(this.blink.bind(this), getRandomInt(100, 8000));
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
