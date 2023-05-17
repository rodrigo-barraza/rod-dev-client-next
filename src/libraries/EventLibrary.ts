// import crypto from 'crypto';
import EventApiLibrary from './EventApiLibrary';

type Session = {
    id: string,
    timestamp: number
}

function createSession() {
    const timestamp = Math.round(+new Date() / 1000);
    
    const local = {
        id: crypto.randomUUID(),
        timestamp: timestamp
    }

    const session = {
        id: crypto.randomUUID(),
        timestamp: timestamp
    }

    // if local id exists, use its id and timestamp
    if (localStorage && localStorage.id) {
        local.id = localStorage.id;
        local.timestamp = localStorage.timestamp;
    }

    // if previous session id exists, use its id
    if (sessionStorage && sessionStorage.id) {
        session.id = sessionStorage.id;
    }


    storeLocalInLocalStorage(local);
    storeSessionInSessionStorage(session);
    return session;
}

function storeLocalInLocalStorage(local: Session) {
    localStorage.id = local.id;
    localStorage.timestamp = local.timestamp;
}

function storeSessionInSessionStorage(session: Session) {
    sessionStorage.id = session.id;
    sessionStorage.timestamp = session.timestamp;
}

function postEvent(category: string, action: string, label: string | undefined, value: string | undefined) {
    const session = createSession();
    const event = {
        timestamp: session.timestamp,
        category: category,
        action: action,
        label: label,
        value: value
    }
    EventApiLibrary.postEvent(event);
}

const EventLibrary = {
    postSession: (duration: number, width: number, height: number) => {
        EventApiLibrary.postSession(duration, width, height);
    },
    postEventSessionNew: (referrer: string, url: string) => {
        const category = 'session';
        const action = 'new-visit';
        const label = referrer;
        const value = url;
        postEvent(category, action, label, value);
    },
    postEventSessionReturning: (referrer: string, url: string) => {
        const category = 'session';
        const action = 'returning-visit';
        const label = referrer;
        const value = url;
        postEvent(category, action, label, value);
    },
    postEventNavigationClick: (url: string) => {
        const category = 'navigation';
        const action = 'click';
        const label = url;
        const value = undefined;
        postEvent(category, action, label, value);
    },
    // postEventNavigationScroll: (scrollPercentage: string) => {
    //     const category = 'navigation';
    //     const action = 'scroll';
    //     const label = scrollPercentage;
    //     const value = undefined;
    //     postEvent(category, action, label, value);
    // },
    postEventLinkClick: (url: string) => {
        const category = 'link';
        const action = 'click';
        const label = url;
        const value = undefined;
        postEvent(category, action, label, value);
    },
    // postEventVideoUnmute: (videoName: string) => {
    //     const category = 'video';
    //     const action = 'unmute';
    //     const label = videoName;
    //     const value = undefined;
    //     postEvent(category, action, label, value);
    // },
    postEventImageFullscreen: (imageName: string) => {
        const category = 'image';
        const action = 'fullscreen';
        const label = imageName;
        const value = undefined;
        postEvent(category, action, label, value);
    },
    postEventMenuOpen: () => {
        const category = 'menu';
        const action = 'open';
        const label = undefined;
        const value = undefined;
        postEvent(category, action, label, value);
    },
    postEventMenuClose: () => {
        const category = 'menu';
        const action = 'close';
        const label = undefined;
        const value = undefined;
        postEvent(category, action, label, value);
    },
};

export default EventLibrary;