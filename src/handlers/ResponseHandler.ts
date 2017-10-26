import { Request, Response } from 'express';
import { InteractiveComponentPayload } from '../../src/interfaces/Slack';
import ResponseService from '../services/ResponseService';
import { LoggerInstance } from 'winston';

export default class ResponseHandler {
    private responseMap: {
        [index: string]: (
            extractId?: string,
            userId?: string,
            value?: string
        ) => void
    };

    constructor (
        private responseService: ResponseService,
        private logger: LoggerInstance,
        private limit: number
    ) {
        // response types
        this.responseMap = {
            positive: this.responseService.continue,
            neutral: this.responseService.continue,
            negative: this.responseService.continue,
            not_sure: this.responseService.continue,
            had_enough: this.responseService.end
        };
    }

    public respond (
        request: Request,
        response: Response
    ): void {
        // Slack payload
        const payload: InteractiveComponentPayload = JSON.parse(request.body.payload);
        // parsed IDs
        const [ type, extractId, userId ]: string[] = payload.callback_id.split(':');
        // Suggestion value
        const value = payload.actions[0].value;
        // Check we can handle the response value
        if (!this.responseMap[value]) {
            throw new Error(`Did not recgonise reponse "${value}"`);
        }
        // Limit requests to Slack
        setTimeout(() => {
            // Send OK response back to Slack
            // we do this after the timeout so the user gets a loading state on the client
            response.status(200);
            response.send();
            this.responseMap[value].call(this.responseService, extractId, userId, value);
        }, this.limit);
    }
}
