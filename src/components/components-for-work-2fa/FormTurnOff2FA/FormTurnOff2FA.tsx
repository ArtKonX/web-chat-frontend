import Btn from "@/components/ui/Btn/Btn";
import CloseBtn from "@/components/ui/CloseBtn/CloseBtn";
import HeadingWithTitle from "@/components/ui/HeadingWithTitle/HeadingWithTitle"
import InputWithLabelAndInfo from "@/components/ui/InputWithLabelAndInfo/InputWithLabelAndInfo";
import { FA2Data, FormTurnOff2FAProps } from "@/interfaces/components/components-for-work-2fa";
import { useTurnOff2FAMutation } from "@/redux/services/authApi";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const FormTurnOff2FA = (
    { userId, closeShowTornOff2FAForm, authDataRefetch }: FormTurnOff2FAProps) => {

    const [turnOff2FA, { data: turnOff2FAData, isLoading: isLoadingTurnOff2FaLoading, error: errorTurnOff2FA }] = useTurnOff2FAMutation<FA2Data>();

    const [savePin, setSavePin] = useState('');
    const [attempt, setAttempt] = useState<null | number>(null);
    const [isErrorTurnOff2FA, setIsErrorTurnOff2FA] = useState(false);

    const onActionTurnOff2FA = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (userId) {
                turnOff2FA({ id: userId, pin: savePin });
            }
        } catch (err) {
            console.error('Ошибка отключения 2FA ', err)
        }
    }

    const onChangePin = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setSavePin(value)
    }

    useEffect(() => {

        if (turnOff2FAData?.status === 'ok') {
            closeShowTornOff2FAForm()
            setSavePin('');
            authDataRefetch()
        } else {
            setAttempt(errorTurnOff2FA?.data?.attempt)
            setIsErrorTurnOff2FA(Boolean(errorTurnOff2FA));
            setTimeout(() => {
                setIsErrorTurnOff2FA(false);
                setSavePin('');
            }, 2000)
        }
    }, [errorTurnOff2FA, turnOff2FAData, isLoadingTurnOff2FaLoading])

    return (
        <form onSubmit={onActionTurnOff2FA}
            className="z-100 bg-white py-6 px-9 rounded-2xl
        max-w-2/5 max-lg:max-w-9/11 max-sm:max-w-9/10
        w-full flex flex-col items-center relative">
            <div className="absolute right-5 top-2">
                <CloseBtn onClose={closeShowTornOff2FAForm} />
            </div>
            <HeadingWithTitle text='Введите код для отключения двойной защиты:' >
                {attempt &&
                    (<span className="font-bold mb-2 text-red-500">
                        Осталось попыток: {attempt}
                    </span>)
                }
                <InputWithLabelAndInfo error={isErrorTurnOff2FA} text='Код' type='text' value={savePin} onChange={onChangePin} />
                <span>
                    При отключении двойной защиты риск потери аккаунта возрастает, подумайте прежде чем это делать!
                </span>
                <div className="w-full text-end">
                    <Btn text='Отключить' type='submit' />
                </div>
            </HeadingWithTitle>
        </form>
    )
}

export default FormTurnOff2FA