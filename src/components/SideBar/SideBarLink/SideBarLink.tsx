import { SideBarActionLinkProps } from "@/interfaces/components/side-bar"
import Image from "next/image"
import Link from "next/link"

const SideBarActionLink = (
    { icon, alt, href, isActive }: SideBarActionLinkProps) => {

    return (
        <Link className={`hover:opacity-45 transition-opacity duration-700 ${isActive && 'opacity-30'}`} href={href}>
            <Image src={icon} alt={alt} width={40} />
        </Link>
    )
}

export default SideBarActionLink