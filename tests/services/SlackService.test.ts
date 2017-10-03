import { Logger, LoggerInstance } from 'winston';
import SlackService from '../../src/services/SlackService';
import { Channel } from '../../src/types';

describe('SlackService', () => {
    const client = {
        channels: {
            list: jest.fn()
        }
    };
    let slackService: SlackService;
    let logger: jest.Mocked<LoggerInstance>;

    beforeEach(() => {
        logger = new Logger() as any;
        slackService = new SlackService(
            client,
            logger
        );
    });

    describe('getChannel', () => {
        beforeEach(() => {
            client.channels.list.mockReturnValue(
                Promise.resolve({
                    channels: [
                        { name: 'foo' },
                        { name: 'bar' }
                    ]
                })
            );
        });

        test('should get the requested channel from the client', () => {
            expect.assertions(1);

            return slackService.getChannel('foo').then((channel: Channel) => {
                expect(channel).toEqual({ name: 'foo' });
            });
        });

        test('should throw if we cannot get the channel', () => {
            expect.assertions(1);

            return slackService.getChannel('non-existent').catch((error: string) => {
                expect(error).toBeTruthy();
            });
        });

        test('should throw if the client fails to get channels', () => {
            expect.assertions(1);
            client.channels.list.mockReturnValue(Promise.reject('channel list error'));

            return slackService.getChannel('non-existent').catch((error: string) => {
                expect(error).toEqual('channel list error');
            });
        });
    });
});
