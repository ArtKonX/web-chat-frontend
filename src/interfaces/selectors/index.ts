interface AuthQuery {
    data?: {
        user?: {
            id: string;
            name: string;
            email: string;
            city: string,
            color_profile: string,
        },
    }
}

export interface AuthQueries {
    'checkAuth({})'?: AuthQuery;
}