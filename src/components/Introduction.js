import React from 'react';
import { Link } from 'react-router-dom';

export default function Introduction () {
    return (
        <div className="introduction">
            <h2>Introduction to Miyagi</h2>

            <p>Miyagi is our Machine Learning sensei, he needs your help to train our Machine Learning platform in the art of sentiment analysis.</p>
            <p>You will be shown real messages gathered from the CXM platform and asked whether you think the person who wrote the message meant it in a happy, positive way, if they were neutral (neither happy nor sad/angry, just kinda… normal) or negative (sad, angry, upset etc).</p>

            <h2>Frequently asked questions</h2>

            <h4>I’m not sure what I should choose for this message</h4>
            <p>If the person sounds neither happy, nor angry, then choose neutral. If you really can’t tell then you can hit the ‘Not Sure’ button and move along.</p>

            <h4>When should I stop?</h4>
            <p>Whenever you want, or whenever you’ve had enough. The more sentiments you can rate, the better our system will be but please don’t let it swallow hours of your time, if you can spare 5 minutes a day, that’s awesome.</p>

            <h4>I’m choosing ‘neutral’ a lot, is that ok?</h4>
            <p>Yes. We believe most messages will be neutral, but go with your instincts.</p>

            <h4>There's more than one sentiment in the message</h4>
            <p>A message may start negative but then end positive, or be mostly neutral with a positive sign-off. In these cases you might be able to make a judgement call by trying to judge the authors overall sentiment. A neutral message with a happy 'Thank you! :)' at the end would probably be best being rated as neutral, but a mostly neutral message with a negative opening would probably be better rated as negative.</p>

            <h4>This message contains personal information</h4>
            <p>Messages are redacted when they’re fetched from CXM. Names, numbers and other personally identifying information is removed as best we can. If you see a message that hasn’t been properly redacted, let us know in the #miyagi channel.</p>

            <h4>There’s not enough context to choose a sentiment</h4>
            <p>That will happen, if you’re not sure please hit the handy ‘Not Sure’ unicorn and play again!</p>

            <h4>Who wrote the messages?</h4>
            <p>Real-life CXM users! We chose not to use messages from CXM admins as training data at this point, we didn’t want you to feel like your responses were being scrutinised by the whole company. Admin sentiment will still be analysed, but by the trained model only.</p>

            <h4>Should I be allowed to see these messages?</h4>
            <p>Only Jadugars have access to Miyagi, and it’s the same as you logging into CXM and viewing them yourself.</p>

            <h4>Wouldn't this be better as a slackbot?</h4>
            <p>We’re still hoping to ask you to help train Miyagi directly within Slack so you can do it quicker and easier, we just need to figure out the security implications of delivering messages like this over a public API to a slackbot.</p>

            <Link to="/" className="button button--primary button--block">Let's get started!</Link>
        </div>
    );
};
