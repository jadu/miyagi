import { ReadLine } from 'readline';

/**
 * Wrap readline.question in a promise
 * @param rl
 * @param question
 */
export function question (
    rl: ReadLine,
    question: string
) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}
