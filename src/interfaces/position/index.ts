export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface FetchCityFromCoorsProps {
    position: Coordinates
}

export interface CityData {
    name: string,
    district_id: number,
    region_id: number,
    coordinates: string
}