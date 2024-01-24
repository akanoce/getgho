import mixpanel from 'mixpanel-browser';
import * as uuid from 'uuid';

let isInitialized = false;

export interface Properties {
    [key: string]: unknown;
}

export const initialise = (mixpanelToken?: string) => {
    if (mixpanelToken) {
        mixpanel.init(mixpanelToken, {
            // debug: true,
            track_pageview: true,
            ignore_dnt: true
        });
        mixpanel.identify(uuid.v4());

        isInitialized = true;
        console.log('Mixpanel initialized');
    } else {
        console.warn('Mixpanel token not found');
    }
};

export const trackEvent = (event: string, properties?: Properties): void => {
    try {
        // const securitySettings = getSecuritySettings(getState())

        if (isInitialized) {
            mixpanel.track(event, properties);
        } else {
            console.warn('Mixpanel not initialized or anbled');
        }
    } catch (e) {
        console.warn('Error tracking event', e);
    }
};

export default {
    initialise,
    trackEvent
};
