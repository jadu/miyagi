import Arguments from '../interfaces/Arguments';

/**
 * Convert process arguments to an argument object.
 * Expects arguments to be passed as flags e.g. "--foo bar"
 * @param argv
 */
export function getArguments (
    argv: string[]
): Arguments {
    const args: string[] = argv.splice(2);
    const flagTest = new RegExp(/^--/);
    let activeFlag: string;

    // generate arguments object from flags
    return args.reduce((argumentObj: Arguments, arg: string) => {
        // test for flags
        if (flagTest.exec(arg) !== null) {
            // strip "--"
            const argName = arg.substring(2);
            // set active flag
            activeFlag = argName;
            // create empty argument value string
            argumentObj[argName] = '';
        } else if (activeFlag !== undefined) {
            // concat argument values to the active flag, seperate values with a space
            argumentObj[activeFlag] += (argumentObj[activeFlag].length ? ' ' : '') + arg;
        }

        return argumentObj;
    }, {});
}

export function validateArguments (
    required: string,
    args: Arguments
): Arguments {
    // Create array of argument keys
    const argsObj: string[] = Object.keys(args);
    // Search required arguments
    const errors = required.split(' ').filter((req: string) => argsObj.indexOf(req) === -1);
    // Throw error detailing each error
    if (errors.length) {
        throw new Error(errors.map((e: string) => `Required argument "--${e}" is missing`).join('\n'));
    }

    return args;
}
