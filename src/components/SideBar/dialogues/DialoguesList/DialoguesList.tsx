'use client'

import React from 'react';

import UserItem from "../Dialogue/Dialogue"
import { useSelector } from "@/hooks/useTypedSelector"
import { DialoguesListProps } from "@/interfaces/components/side-bar"
import { useSearchParams } from "next/navigation"
import { useCheckAuthQuery } from '@/redux/services/authApi';
import { selectTokenState } from '@/selectors/selectors';

const DialoguesList = (
    { dialoguesData }: DialoguesListProps
) => {

    const tokenState = useSelector(selectTokenState);
    const { data: authData } = useCheckAuthQuery({ token: tokenState.token });

    const searchParams = useSearchParams();

    const getUserrRecipient = (senderId: string, recipientId: string) => {
        return senderId === authData?.user?.id ? recipientId : senderId
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