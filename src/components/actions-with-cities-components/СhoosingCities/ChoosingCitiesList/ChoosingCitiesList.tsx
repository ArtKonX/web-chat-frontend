import { ChoosingCitiesListProps } from "@/interfaces/components/actions-with-cities-components"
import ChoosingCitiesItem from "../ChoosingCitiesItem/ChoosingCitiesItem"

const ChoosingCitiesList = (
    { onChooseCity, cities }: ChoosingCitiesListProps
) => {

    return (
        <ul className="bottom-t-1 max-h-80 overflow-y-auto w-full flex flex-col">
            {cities.map((city, indx) => (
                <li key={indx}>
                    <ChoosingCitiesItem onChooseCity={onChooseCity} city={city.name} />
                </li>
            ))}
        </ul>
    )
}

export default ChoosingCitiesList