const GeoCityName = (
    { city }: { city: string }
) => {

    return (
        <span
            className="font-bold text-xl mr-4 max-sm:text-[17px]"
        >
            ⚲ {city}
        </span>
    )
}

export default GeoCityName