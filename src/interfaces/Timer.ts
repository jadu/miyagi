export default interface Timer {
    started: number;
    ended: number;
    start: () => void;
    end: () => void;
    print: () => string | number;
}
