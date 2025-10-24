'use client'

import React, { useEffect, useState } from 'react';

import UserItem from "../Dialogue/Dialogue"
import { useSelector } from "@/hooks/useTypedSelector"
import { DialoguesListProps } from "@/interfaces/components/side-bar"
import { useSearchParams } from "next/navigation"
import { useCheckAuthQuery } from '@/redux/services/authApi';
import { selectTokenState } from '@/selectors/selectors';
import { UserData } from '@/interfaces/users';
import { getCachedUser } from '@/cashe/userCache';

const DialoguesList = (
    { dialoguesData }: DialoguesListProps
) => {

    const tokenState = useSelector(selectTokenState);
    const { data: authData } = useCheckAuthQuery({ token: tokenState?.token });

    const searchParams = useSearchParams();

    const [userInfo, setUserInfo] = useState<UserData | null>(null)

    useEffect(() => {
        (async () => {
            try {
                const userData = await getCachedUser();

                if (userData) {
                    setUserInfo(userData[0])
                } else {
                    setUserInfo(authData!.user)
                }
            } catch (err) {
                console.log(err)
            }
        })()
    }, [authData?.user,])

    const getUserRecipient = (senderId: string, recipientId: string) => {
        const userSuccessData = authData?.user?.id || userInfo?.id;

        return senderId === userSuccessData ? recipientId : senderId
    }

    return (
        <ul data-testid="dialogues-list">
            {
                dialoguesData?.map((dialogue) => (
                    <li data-testid="dialogues-item" key={dialogue.userId}>
                        <UserItem isCache={dialogue.isCache!} id={getUserRecipient(dialogue.sender_id, dialogue.recipient_id)} name={dialogue?.nameSender}
                            quantityMessages={dialogue?.lengthMessages} lastMassage={dialogue.lastMessage}
                            isActiveUser={getUserRecipient(dialogue.sender_id, dialogue.recipient_id) === searchParams?.get('user')}
                            status={dialogue.status} profileColor={dialogue.colorProfile} />
                    </li>
                ))
            }
        </ul>
    )
}

export default DialoguesList