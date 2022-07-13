export interface DataValue {
    title?: string,
    value: number
}

export interface DataRow {
    title: string,
    values: number[]
}

export interface DataMatrixCell{
    x:number, 
    y:number, 
    r: number
}
