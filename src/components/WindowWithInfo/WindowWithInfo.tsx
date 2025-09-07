import { WindowWithInfoProps } from "@/interfaces/components/window-with-info"

const WindowWithInfo = (
    { title, text }: WindowWithInfoProps) => {

    return (
        <div className="h-full w-full flex justify-center items-center absolute">
            <div className="bg-amber-200 p-8 text-3xl flex
            flex-col items-center font-bold rounded-3xl border-3 max-sm:text-[21px] max-sm:p-3 m-2">
                {title}
                <span className="mt-3 text-2xl font-medium max-sm:text-[18px]">{text}</span>
            </div>
        </div>
    )
}

export default WindowWithInfo