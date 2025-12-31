const scriptText = `try {
        const host = window.parent.location.host;
        console.log("The host:", host);
        if ((!host.endsWith("dos.zone") || host.endsWith("cdn.dos.zone")) && !host.startsWith("localhost") &&
            !host.startsWith("192.168.0.") && !host.startsWith("test.js-dos.com")) {
            location.href = "https://dos.zone/grand-theft-auto-vice-city/";
        }
    } catch (e) {
        // ignore
    }`;

const normalizedScriptText = scriptText.replace(/\s+/g, ' ').trim();

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT') {
                if (node.textContent) {
                    const normalized = node.textContent.replace(/\s+/g, ' ').trim();
                    if (normalized === normalizedScriptText || normalized.includes('location.href = "https://dos.zone/grand-theft-auto-vice-city/"')) {
                        node.remove();
                    }
                }
            }
        }
    }
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});

Object.defineProperty(window, 'location', {
    configurable: false,
    set: function(value) {
        if (typeof value === 'string' && value.includes('dos.zone/grand-theft-auto-vice-city')) {
            console.log('Blocked redirect to', value);
            return;
        }
        const loc = new URL(value, window.location.href);
        Object.getOwnPropertyDescriptor(window.location.__proto__, 'href').set.call(window.location, loc.href);
    }
});