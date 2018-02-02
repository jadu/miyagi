import { question } from '../../src/cli/readline';
import readline = require('readline');
import { ReadLine } from 'readline';
import createMockInstance from 'jest-create-mock-instance';

describe('question', () => {
    let rlMock;

    beforeEach(() => {
        rlMock = {
            question: (t: string, cb: (...any) => void) => cb('answer')
        }
    });

    test('should return a promise', () => {
        const q = question(rlMock, 'how are you?');

        return expect(q).resolves.toEqual('answer')
    });
});
