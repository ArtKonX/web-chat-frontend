import Link from "next/link"

const CloseLink = (
    { path }: { path: string }
) => {

    return (
        <Link href={path}
            className="text-4xl cursor-pointer hover:opacity-70
        transition-opacity duration-500"
        >
            Ⓧ
        </Link>
    )
}

export default CloseLink