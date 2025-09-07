import { useDispatch } from "react-redux"
import CloseBtn from "../ui/CloseBtn/CloseBtn"
import { resetUrl } from "@/redux/slices/imageSlice";

const ImageWindow = (
    { url }: { url: string }) => {

    const dispatch = useDispatch();

    const closeFileForm = () => {
        dispatch(resetUrl())
    }

    return (
        <div className={`z-60 flex justify-center items-center fixed top-0 left-0 w-full
            h-full bg-black/60 transition-all duration-200 ease-out
            opacity-100 scale-100 translate-y-0`}>
            <div className="w-full h-full flex flex-col items-center justify-center relative">
                <div className="w-[90%] h-[90%] relative">
                    <img className="w-full h-full object-contain" src={url} alt={url} />
                    <div className="absolute right-0 top-0">
                        <CloseBtn onClose={closeFileForm} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageWindow