export const ENDPOINTS = {
    auth: {
        login: '/auth/token/',
        refresh: '/auth/token/refresh/',
        register: '/auth/register/',
        me: '/auth/me/',
    },
    products: {
        list: '/products/',
        detail: (id: number) => `/products/${id}/`,
    },
} as const;