import ListService from '../../src/services/ListService';

describe('ListService', () => {
    let listService: ListService;

    beforeEach(() => {
        listService = new ListService();
    });

    describe('getRandomItem', () => {
        test('should return a random item in an array', () => {
            const list: any[] = ['foo', 'bar', 'baz'];
            const actual = listService.getRandomItem(list);

            expect(list.find((i: string) => i === actual)).toBeTruthy();
        });
    });
});
