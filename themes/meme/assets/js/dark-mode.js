// Reactive Dark Mode
// https://web.dev/prefers-color-scheme/#reacting-on-dark-mode-changes
// https://twitter.com/ChromeDevTools/status/1197175265643745282

const userPrefers = localStorage.getItem('theme');
if (userPrefers === 'dark') {
    changeModeMeta('dark');
} else if (userPrefers === 'light') {
    changeModeMeta('light');
}

window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
    changeMode();
});

window.addEventListener("DOMContentLoaded", event => {
    // Update meta tags and code highlighting
    changeMode();

    // Theme Switcher
    // https://derekkedziora.com/blog/dark-mode

    const themeSwitcher = document.getElementById('theme-switcher');

    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', (e) => {
            e.preventDefault();
            if (getCurrentTheme() == "dark") {
                changeModeMeta('light');
            } else {
                changeModeMeta('dark');
            }
            changeMode();
            storePrefers();
        });
    }
}, {once: true});

// Sync Across Tabs
// https://codepen.io/tevko/pen/GgWYpg

window.addEventListener('storage', function (event) {
    if (event.key !== 'theme') {
      return;
    }

    if (event.newValue === 'dark') {
        changeModeMeta('dark');
    } else {
        changeModeMeta('light');
    }
    changeMode();
});

// Functions

function getCurrentTheme() {
    return JSON.parse(window.getComputedStyle(document.documentElement, null).getPropertyValue("--theme-name"));
}

function changeModeMeta(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

function changeMode() {
    const isDark = getCurrentTheme() === 'dark';

    // Change theme color meta
    const themeColor = isDark ? '{{ .Site.Params.themeColorDark }}': '{{ .Site.Params.themeColor }}';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);

    {{ if and .Site.Params.enableUtterances (eq hugo.Environment "production") }}
        // Change Utterances Comments Theme
        // https://github.com/utterance/utterances/issues/229
        if (isDark) {
            changeUtterancesTheme('{{ .Site.Params.utterancesThemeDark }}');
        } else {
            changeUtterancesTheme('{{ .Site.Params.utterancesTheme }}');
        }
        function changeUtterancesTheme(theme) {
            const iframe = document.querySelector('.utterances-frame');
            if (iframe !== null) {
                const message = {
                    type: 'set-theme',
                    theme: theme
                };
                iframe.contentWindow.postMessage(message, 'https://utteranc.es');
            }
        }
    {{ end }}
}

function storePrefers() {
    window.localStorage.setItem('theme', getCurrentTheme());
}
