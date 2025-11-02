'use client'

import React, { Suspense, useEffect, useState } from 'react';

import Dialogue from "../Dialogue/Dialogue"
import { useSelector } from "@/hooks/useTypedSelector"
import { DialoguesListProps } from "@/interfaces/components/side-bar"
import { useSearchParams } from "next/navigation"
import { useCheckAuthQuery } from '@/redux/services/authApi';
import { selectTokenState } from '@/selectors/selectors';
import { UserData } from '@/interfaces/users';
import { getCachedUser } from '@/cashe/userCache';
import Loader from '@/components/ui/Loader/Loader';

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
        <Suspense fallback={<Loader isFade={true} />}>
            <ul data-testid="dialogues-list" className='max-h-[88%] h-full overflow-y-auto mt-5 pr-4'>
                {
                    dialoguesData?.map((dialogue) => (
                        <li className='not-first:mt-10 first:mt-1' data-testid="dialogues-item" key={dialogue.userId}>
                            <Dialogue isCache={dialogue.isCache!} id={getUserRecipient(dialogue.sender_id, dialogue.recipient_id)} name={dialogue?.nameSender}
                                quantityMessages={dialogue?.lengthMessages} lastMassage={dialogue.lastMessage}
                                isActiveUser={getUserRecipient(dialogue.sender_id, dialogue.recipient_id) === searchParams?.get('user')}
                                status={dialogue.status} profileColor={dialogue.colorProfile} />
                        </li>
                    ))
                }
            </ul>
        </Suspense>
    )
}

export default DialoguesList