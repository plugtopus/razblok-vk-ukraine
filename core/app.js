const App = {
    domains: defaultDomains,
    proxyList: ["HTTPS frpxa.com:443", "HTTPS brwpks.com:443", "HTTPS pksfr.com:443", "HTTPS brwpx.com:443"],
    params: null,
    activeProxy: null,
    reapplyTimerId: null,
    proxy: {
        scope: "regular",
        applied: !1,
        type: "PAC",
        apply() {
            const a = this._onBeforeApply();
            a.then(() => {
                chrome.proxy.settings.set({
                    value: App.getPac(),
                    scope: this.scope
                }, () => {
                    App.reapplyTimerId && clearInterval(App.reapplyTimerId), App.reapplyTimerId = null, App.on.afterProxyApplied()
                })
            })
        },
        _onBeforeApply() {
            const a = this;
            return new Promise((b) => chrome.proxy.settings.clear({
                scope: a.scope
            }, b.bind(a)))
        }
    },
    getRandom: function(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a
    },
    getPac: function() {
        App.activeProxy = App.proxyList[App.getRandom(0, App.proxyList.length - 1)];
        var a = JSON.stringify(App.domains),
            b = {
                mode: "pac_script",
                pacScript: {
                    data: `function FindProxyForURL(url, host) {                                    if (shExpMatch(host, '*.bongacams.*') || shExpMatch(host, '*rutracker.*') ) {                        return "HTTPS nl13.postls.com:443; HTTPS nl5.postls.com:443; HTTPS nl6.postls.com:443; HTTPS uk8.postls.com:443; HTTPS uk19.postls.com:443; DIRECT;"                    }	        	                var activeProxy = '` + App.activeProxy + `';	                var domains     = ` + a + `;		             	                for(i = 0; i < domains.length; i++){	                    if (shExpMatch(host, domains[i])) {	                        return activeProxy;                        }	                }	        	                return "DIRECT";	            }`
                }
            };
        return b
    },
    load: function() {
        chrome.storage.local.get(function(a) {
            a.config && (a.config.proxy && (App.proxyList = a.config.proxy), a.config.domains && (App.domains = a.config.domains)), a.appLoads || (a.appLoads = 0), a.appLoads++, chrome.storage.local.set(a), $.ajax({
                url: "common/config2.php",
                success: function(b) {
                    chrome.storage.local.set({
                        config: b
                    }), b.proxy && (App.proxyList = b.proxy), b.domains && (App.domains = b.domains), (!a.config || b.hash && a.config.hash != b.hash) && App.proxy.apply()
                }
            }), App.proxy.apply()
        })
    }
};
App.load();