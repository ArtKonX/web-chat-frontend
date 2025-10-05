import React from "react"

import store from "@/redux/store"
import { render } from "@testing-library/react"
import { ReactNode } from "react"
import { Provider } from "react-redux"

const getProviderWithStore = (children: ReactNode) => {

    const { container } = render(
        <Provider store={store}>
            {children}
        </Provider>
    )

    return { container }
}

export default getProviderWithStore