export interface GetCitiesResponse {
    cities: {
        name: string,
        district_id: number,
        region_id: number,
        coordinates: string
    }[]
}
export interface GetCitiesData {
    q: string
}