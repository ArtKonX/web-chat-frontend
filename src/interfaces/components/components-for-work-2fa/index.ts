export interface FormTurnOff2FAProps {
    userId?: string,
    closeShowTornOff2FAForm: () => void,
    authDataRefetch: () => void
}

export interface FA2Data {
    isLoading: boolean,
    data: {
        data: {
            attempt: number,
            pinCode: number
        },
        status: string
    },
    error: {
        data: {
            attempt: number,
            data: {
                succesPinCode: string
            }
        }
    }
}

export interface PopUpPin2FAProps {
    pin?: string | null,
    isShow2FA: boolean,
    isShow2FAFade: boolean,
    setIsShow2FA: (isShow2FA: boolean) => void,
    setIsShow2FAFade: (isShow2FAFade: boolean) => void,
    authDataRefetch: () => void
}