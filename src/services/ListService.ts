export default class ListService {
    /**
     * Return random item in list
     * @param list
     */
    public getRandomItem (list: any[]): any {
        return list[Math.floor(Math.random() * list.length)];
    }
}
