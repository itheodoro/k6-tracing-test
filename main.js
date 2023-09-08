import { sleep } from 'k6';
import tracing from 'k6/x/tracing';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { traceTemplates } from './templates.js';

export const options = {
    vus: 1,
    duration: '10s',
};

const sleepTime = __ENV.SLEEP_TIME_IN_SECONDS
    ? parseFloat(__ENV.SLEEP_TIME_IN_SECONDS)
    : null;

const client = new tracing.Client({
    endpoint: __ENV.OTLP_ENDPOINT || 'localhost:4317',
    exporter: tracing.EXPORTER_OTLP,
    insecure: true,
});

export default function () {
    const templateIndex = randomIntBetween(0, traceTemplates.length - 1);
    const gen = new tracing.TemplatedGenerator(traceTemplates[templateIndex]);
    client.push(gen.traces());

    if (sleepTime) {
        sleep(sleepTime);
    }
}

export function teardown() {
    client.shutdown();
}
