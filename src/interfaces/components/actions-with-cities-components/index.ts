import { CityData, Coordinates } from "@/interfaces/position";
import { Ref } from "react";

export interface СhoosingCitiesOnMapProps {
    position: Coordinates | null;
    mapCity: string | undefined;
    setMapCity: (mapCity: string) => void,
    setSelectedCity: (selectedCity: string) => void,
    testSetNewPosition?: Coordinates | null,
    refWindowChooseMapCity?: Ref<HTMLDivElement> | null
}

export interface ChoosingCitiesItemProps {
    onChooseCity: (city: string) => void,
    city: string
}

export interface ChoosingCitiesListProps {
    onChooseCity: (city: string) => void,
    cities: CityData[]
}

export interface ChoosingCitiesProps {
    searchCity: string,
    cities?: CityData[],
    cityFromServer: string,
    setSelectedCity: (selectedCity: string) => void
    setSearchCity: (searchCity: string) => void,
    refWindowChooseCity?: Ref<HTMLDivElement> | null
}