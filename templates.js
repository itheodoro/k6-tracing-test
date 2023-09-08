import tracing from 'k6/x/tracing';

const serviceNames = {
    AUTH: 'auth-service',
    NAVIGATION: 'navigation',
    CATALOG: 'catalog',
    CORE: 'core',
    ARTICLE: 'article',
    POSTGRES: 'postgres',
    MONGODB: 'mongodb',
    CART: 'cart',
};

const traceDefaults = {
    attributeSemantics: tracing.SEMANTICS_HTTP,
    attributes: { test: 'true' },
    randomAttributes: { count: 2, cardinality: 5 },
};

export const traceTemplates = [
    {
        defaults: traceDefaults,
        spans: [
            {
                service: serviceNames.NAVIGATION,
                name: 'view-item',
                attributes: {
                    'http.status_code': 200,
                    'http.method': 'GET',
                },
            },
            {
                service: serviceNames.NAVIGATION,
                name: 'authenticate',
                parentIdx: 0,
                duration: { min: 50, max: 100 },
            },
            {
                service: serviceNames.AUTH,
                name: 'authenticate',
            },
            {
                service: serviceNames.NAVIGATION,
                name: 'fetch-item',
                parentIdx: 0,
            },
            {
                service: serviceNames.CATALOG,
                name: 'fetch-item',
            },
            {
                service: serviceNames.CATALOG,
                name: 'query-item',
                attributeSemantics: tracing.SEMANTICS_DB,
            },
            {
                service: serviceNames.MONGODB,
                name: 'select-item',
                attributeSemantics: tracing.SEMANTICS_DB,
                randomAttributes: { count: 2 },
            },
        ],
    },
    {
        defaults: traceDefaults,
        spans: [
            {
                service: serviceNames.CORE,
                name: 'list-articles',
                duration: { min: 200, max: 900 },
            },
            {
                service: serviceNames.CORE,
                name: 'authenticate',
                duration: { min: 50, max: 100 },
            },
            {
                service: serviceNames.AUTH,
                name: 'authenticate',
            },
            {
                service: serviceNames.CORE,
                name: 'fetch-articles',
                parentIdx: 0,
            },
            {
                service: serviceNames.ARTICLE,
                name: 'list-articles',
            },
            {
                service: serviceNames.ARTICLE,
                name: 'select-articles',
                attributeSemantics: tracing.SEMANTICS_DB,
            },
            {
                service: serviceNames.POSTGRES,
                name: 'query-articles',
                attributeSemantics: tracing.SEMANTICS_DB,
                randomAttributes: { count: 5 },
            },
        ],
    },
    {
        defaults: {
            attributeSemantics: tracing.SEMANTICS_HTTP,
        },
        spans: [
            {
                service: serviceNames.CORE,
                name: 'article-to-cart',
                duration: { min: 400, max: 1200 },
            },
            {
                service: serviceNames.CORE,
                name: 'authenticate',
                duration: { min: 70, max: 200 },
            },
            {
                service: serviceNames.AUTH,
                name: 'authenticate',
            },
            {
                service: serviceNames.CORE,
                name: 'get-article',
                parentIdx: 0,
            },
            {
                service: serviceNames.ARTICLE,
                name: 'get-article',
            },
            {
                service: serviceNames.ARTICLE,
                name: 'select-articles',
                attributeSemantics: tracing.SEMANTICS_DB,
            },
            {
                service: serviceNames.POSTGRES,
                name: 'query-articles',
                attributeSemantics: tracing.SEMANTICS_DB,
                randomAttributes: { count: 2 },
            },
            {
                service: serviceNames.CORE,
                name: 'place-articles',
                parentIdx: 0,
            },
            {
                service: serviceNames.CART,
                name: 'place-articles',
                attributes: {
                    'article.count': 1,
                    'http.status_code': 201,
                },
            },
            {
                service: serviceNames.CART,
                name: 'persist-cart',
            },
        ],
    },
    {
        defaults: traceDefaults,
        spans: [
            {
                service: serviceNames.CORE,
                attributes: { 'http.status_code': 403 },
            },
            { service: serviceNames.CORE, name: 'authenticate' },
            {
                service: serviceNames.AUTH,
                name: 'authenticate',
                attributes: { 'http.status_code': 403 },
            },
        ],
    },
];
