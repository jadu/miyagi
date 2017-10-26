import IdleService from '../../src/services/IdleService';
import LoggerMock from '../mocks/Logger';

jest.useFakeTimers();

describe('IdleService', () => {
    let idleService: IdleService;
    let logger: LoggerMock;

    beforeEach(() => {
        logger = new LoggerMock();
        idleService = new IdleService(
            666,
            logger as any
        );
    });

    describe('start', () => {
        test('should create a timout and invoke an action', () => {
            const action = jest.fn();

            idleService.start(action);
            jest.runTimersToTime(666);

            expect(action).toBeCalled();
        });
    });

    describe('clear', () => {
        test('should clear a timer if it exists', () => {
            const action = jest.fn();

            idleService.start(action);
            jest.runTimersToTime(665);
            idleService.clear();
            jest.runAllTimers();

            expect(action).not.toBeCalled();
        });

        test('should do nothing if no idle timeout is defined', () => {
            expect(() => {
                idleService.clear();
            }).not.toThrow();
        });
    });
});
