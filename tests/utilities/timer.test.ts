import { createTimer } from '../../src/utilities/timer';
import createMockinstance from 'jest-create-mock-instance';
import Timer from '../../src/interfaces/Timer';
import { format } from 'url';

describe('createTimer', () => {
    let timer: Timer;
    let formatMock: jest.Mock;
    let nowMock: jest.Mock;

    beforeEach(() => {
        formatMock = jest.fn();
        nowMock = jest.fn();
        timer = createTimer(nowMock, formatMock)();
    });

    test('should print elapsed time', () => {
        formatMock.mockReturnValue('time');

        nowMock.mockReturnValue(5);
        timer.start();
        nowMock.mockReturnValue(15);
        timer.end();

        const printedTime = timer.print();

        expect(printedTime).toEqual('time');
        expect(formatMock).toBeCalledWith(10, undefined);
    });
});
