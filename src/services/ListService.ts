export default class ListService {
    /**
     * Return random item in list
     * @param list
     */
    public getRandomItem (list: any[]): any {
        return Math.random() * list.length;
    }
}
