import React from 'react';

import UserItem from "../Dialogue/Dialogue"
import { useSelector } from "@/hooks/useTypedSelector"
import { DialoguesListProps } from "@/interfaces/components/side-bar"
import { selectUser } from "@/selectors/selectors"
import { useSearchParams } from "next/navigation"

const DialoguesList = (
    { dialoguesData }: DialoguesListProps
) => {

    const userData = useSelector(selectUser);

    const searchParams = useSearchParams();

    const getUserrRecipient = (senderId: string, recipientId: string) => {
        return senderId === userData?.id ? recipientId : senderId
    }

    return (
        <ul>
            {
                dialoguesData?.map((dialogue) => (
                    <li key={dialogue.userId}>
                        <UserItem id={getUserrRecipient(dialogue.sender_id, dialogue.recipient_id)} name={dialogue?.nameSender}
                            quantityMessages={dialogue?.lengthMessages} lastMassage={dialogue.lastMessage}
                            isActiveUser={getUserrRecipient(dialogue.sender_id, dialogue.recipient_id) === searchParams?.get('user')}
                            status={dialogue.status} profileColor={dialogue.colorProfile} />
                    </li>
                ))
            }
        </ul>
    )
}

export default DialoguesList