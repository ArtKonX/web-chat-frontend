import { AuthQueries } from "@/interfaces/selectors";
import { UserData } from "@/interfaces/users";
import { RootState } from "@/redux/store";
import { createSelector } from 'reselect';

export const selectSideBarState = createSelector(
    (state: RootState) => state.sideBarState,

    (sideBarState) => ({
        ...sideBarState,
        isShow: sideBarState.isShow,
    })
);

export const selectTokenState = createSelector(
    (state: RootState) => state.tokenState,

    (tokenState) => ({
        ...tokenState
    })
);

export const selectbackgroundState = createSelector(
    (state: RootState) => state.backgroundState,

    (backgroundState) => ({
        ...backgroundState,
        bgColor: backgroundState.bgColor,
    })
);

export const selectCheckAuthState = createSelector(
    (state: RootState) => state.authApi.queries as AuthQueries,
    (data) => data
);

export const selectAuthState = createSelector(
    (state: RootState) => state.authState,

    (authState) => ({
        ...authState
    })
);

export const selectChangeMessageState = createSelector(
    (state: RootState) => state.changeMessageSlice,

    (changeMessageState) => ({
        ...changeMessageState
    })
);

export const selectImageState = createSelector(
    (state: RootState) => state.imageSlice,

    (imageState) => ({
        ...imageState
    })
);

export const selectUser = createSelector(
    selectCheckAuthState,
    (authData: AuthQueries | undefined): UserData | null => {
        const user = authData?.['checkAuth({})']?.data?.user;
        return user ?? null;
    }
);

export const selectMessagesState = createSelector(
    (state: RootState) => state.messagesSlice,

    (messagesState) => ({
        ...messagesState
    })
);

export const selectWindowState = createSelector(
    (state: RootState) => state.windowSlice,

    (windowState) => ({
        ...windowState
    })
);