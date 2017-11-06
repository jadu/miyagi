export interface UserMap {
    [index: string]: number
}

export interface SortableUserMap extends Array<any> {
    [index: number]: any[]
}
