import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'de', "ch"],

    defaultLocale: 'en'
});