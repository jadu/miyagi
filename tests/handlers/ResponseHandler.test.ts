import ResponseHandler from '../../src/handlers/ResponseHandler';
import ResponseService from '../../src/services/ResponseService';
import { mock, instance, verify } from 'ts-mockito';
import { InteractiveComponentPayload } from '../../src/interfaces/Slack';
import LoggerMock from '../mocks/Logger';

jest.useFakeTimers();

describe('ResponseHandler', () => {
    let responseHandler: ResponseHandler;
    let responseService: ResponseService;
    let logger: LoggerMock;

    beforeEach(() => {
        logger = new LoggerMock();
        responseService = mock(ResponseService);
        responseHandler = new ResponseHandler(
            instance(responseService),
            logger as any,
            2000
        );
    });

    describe('respond', () => {
        const request = {
            body: {
                payload: JSON.stringify({
                    callback_id: 'type:extract_id:user_id',
                    actions: [ { value: 'positive' } ]
                })
            }
        };
        const response = {
            status: jest.fn(),
            send: jest.fn()
        };

        test('should send a response', () => {
            responseHandler.respond(request as any, response as any);

            jest.runAllTimers();

            expect(response.status).toHaveBeenCalled();
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.send).toHaveBeenCalled();
            verify(responseService.continue('extract_id', 'user_id', 'positive')).called();
        });

        test('should throw if the value is not recognised', () => {
            const invalidRequest = Object.assign({}, request);

            invalidRequest.body = {
                payload: JSON.stringify({
                    callback_id: 'type:extract_id:user_id',
                    actions: [ { value: 'test' }]
                })
            };

            expect(() => {
                responseHandler.respond(invalidRequest as any, response as any);
            }).toThrowError();
        });
    });
});
