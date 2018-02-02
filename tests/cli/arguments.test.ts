import { getArguments, validateArguments } from '../../src/cli/arguments';

describe('getArguments', () => {
    test('should create an arguments object from cli flags', () => {
        const args: string[] = ['/usr/bin/node', 'foo.js', '--foo', 'bar', '--test', 'multiple', 'args'];

        expect(getArguments(args)).toEqual({
            foo: 'bar',
            test: 'multiple args'
        });
    });

    test('should ignore arguments that are not defined as flags', () => {
        const args: string[] = ['/usr/bin/node', 'foo.js', 'bar', '--test', 'multiple', 'args'];

        expect(getArguments(args)).toEqual({
            test: 'multiple args'
        });
    });
});

describe('validateArguments', () => {
    test('should throw an error for each argument that is missing', () => {
        const args = {};

        expect(validateArguments.bind(null, 'foo bar', args)).toThrowErrorMatchingSnapshot();
    });

    test('should pass args through if no validation errors occur', () => {
        const args = {
            foo: '',
            bar: ''
        };

        expect(validateArguments('foo bar', args)).toEqual({
            foo: '',
            bar: ''
        });
    });
});
