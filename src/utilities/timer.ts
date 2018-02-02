import Timer from '../interfaces/Timer';

/**
 * Create Timer instances
 * @param Time
 * @param formatTime
 */
export function createTimer (
    now: () => number,
    formatTime: (time: number, ...any) => string | number
) {
    return (formatTimeOptions?: any): Timer => ({
        started: undefined,
        ended: undefined,

        start: () => {
            this.started = now();
        },
        end: () => {
            this.ended = now();
        },
        print: () => {
            return formatTime.call(null, (this.ended - this.started), formatTimeOptions);
        }
    });
}
