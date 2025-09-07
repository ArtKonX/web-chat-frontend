type onClose = () => void

const CloseBtn = (
    { onClose }: { onClose: onClose }
) => {

    return (
        <button type="button" onClick={onClose}
            className="text-3xl hover:text-amber-500/90 transition-colors
        duration-300 cursor-pointer px-3 pb-1 rounded-full bg-white"
        >
            x
        </button>
    )
}

export default CloseBtn