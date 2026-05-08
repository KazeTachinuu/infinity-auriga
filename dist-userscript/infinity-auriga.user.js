// ==UserScript==
// @name         Infinity Auriga
// @namespace    infinity-auriga
// @version      1.9.7
// @description  Make Auriga Great Again - enhanced grades UI for EPITA
// @author       KazeTachinuu & contributors
// @match        https://auriga.epita.fr/*
// @grant        none
// @run-at       document-start
// @homepageURL  https://github.com/KazeTachinuu/infinity-auriga
// @supportURL   https://github.com/KazeTachinuu/infinity-auriga/issues
// @updateURL    https://raw.githubusercontent.com/KazeTachinuu/infinity-auriga/master/dist-userscript/infinity-auriga.user.js
// @downloadURL  https://raw.githubusercontent.com/KazeTachinuu/infinity-auriga/master/dist-userscript/infinity-auriga.user.js
// ==/UserScript==

;(function(){if(localStorage.getItem('infinity_auriga_enabled')==='0')return;var s=document.createElement('style');s.setAttribute('data-infinity','1');s.textContent="*,*:before,*:after{box-sizing:border-box}body{margin:0;overflow:hidden}div{display:flex}div,hr{box-sizing:border-box}button{outline:none;border:none;background:none}a{color:inherit;text-decoration:inherit}:root{--bg-dark: #343D55;--bg-darker: #151925;--text-primary: #151925;--text-muted: #868DA0;--text-meta: #909090;--surface: #FFFFFF;--surface-alt: #F3F4F5;--dot-color: #D5D9DC;--accent: #3D69ED;--radius: 6px;--content-px: clamp(25px, 5vw, 75px);--font-header: clamp(20px, 3vw, 32px);--font-body: clamp(13px, 1.5vw, 18px);-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif}#app{height:100dvh}button,a,.clickable{cursor:pointer;user-select:none;transition:opacity .15s}button:not(.opaque):hover,a:not(.opaque):hover,.clickable:not(.opaque):hover{opacity:.8}button:not(.opaque):active,a:not(.opaque):active,.clickable:not(.opaque):active{opacity:.6}.subtext{color:var(--text-muted);font-size:clamp(13px,1.5vw,16px);line-height:22px;text-align:center}.link.colored{color:var(--accent)}.card{border-radius:var(--radius);box-shadow:#00000026 0 2px 8px;transition:all .2s}.card.clickable:hover{box-shadow:#00000040 0 2px 9px;transform:translateY(-1px)}.variable{transition:width .6s cubic-bezier(.65,0,.35,1),margin .6s cubic-bezier(.65,0,.35,1)}.class-average{color:var(--text-meta)}.point{flex-shrink:0;width:8px;height:8px;background-color:var(--dot-color);border-radius:50%}.point.big{width:10px;height:10px}.point.small{width:6px;height:6px}#background{position:relative;z-index:1;width:clamp(200px,30vw,450px);flex-shrink:0;overflow:hidden;background:linear-gradient(-212deg,var(--bg-dark) 0%,var(--bg-darker) 95%)}.triangle{position:absolute}#top-triangle{top:-175px;left:-175px;width:500px;filter:drop-shadow(3px 3px 15px rgba(0,0,0,.25))}#bottom-triangle{bottom:-75px;right:-100px;width:600px;filter:drop-shadow(-3px -3px 15px rgba(0,0,0,.25))}#content{flex-direction:column;justify-content:space-between;align-items:center;z-index:2;flex:1;min-width:0;padding:35px 0;overflow-y:auto;background-color:var(--surface)}#content.wide #header #logo{width:300px;margin:0}#header{width:100%;padding:20px var(--content-px);justify-content:space-between;align-items:center;flex-shrink:0;overflow:hidden}#header #logo{flex-shrink:0;width:400px;margin-top:25px;margin-left:12.5px}#header #logo svg{width:100%;height:auto}.header-actions{align-items:center;gap:clamp(12px,2vw,20px)}#export-btn,#export-btn-en{display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:8px;background:var(--surface-alt);color:var(--text-primary);font-size:clamp(13px,1.5vw,16px);font-weight:600;transition:background .15s,opacity .15s}#export-btn:hover,#export-btn-en:hover{background:var(--dot-color)}.export-icon{display:flex;align-items:center}.export-icon svg{width:clamp(14px,1.5vw,18px);height:auto}#update-btn{display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:8px;background:var(--accent);color:#fff;font-size:clamp(13px,1.5vw,16px);font-weight:600;transition:background .15s,opacity .15s}#update-btn:hover{opacity:.85}.update-icon{display:flex;align-items:center}.update-icon svg{width:clamp(14px,1.5vw,18px);height:auto}#header #logout{color:#251515;font-size:clamp(16px,2vw,22px);font-weight:500}#footer{flex-direction:column;flex-shrink:0}#footer #links{justify-content:center;margin-bottom:8px;font-weight:500;font-size:clamp(16px,2vw,22px);color:var(--text-primary)}#main{flex-direction:column;flex-grow:1;justify-content:center;width:100%}.loading{flex-direction:column;align-items:center;padding:0 var(--content-px)}.loading-step{margin-top:clamp(20px,4vw,40px);font-size:clamp(16px,2vw,20px);font-weight:600;color:var(--text-primary);text-align:center}.loading-request{margin-top:6px;min-height:1.4em;max-width:100%;font-size:clamp(11px,1.2vw,13px);font-family:SF Mono,Cascadia Code,Fira Code,monospace;color:var(--text-muted);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:0;transition:opacity .15s}.loading-request:not(:empty){opacity:1}.loading-quote{margin-top:clamp(25px,4vw,40px);font-size:clamp(13px,1.4vw,15px);font-style:italic;color:var(--text-muted);text-align:center;opacity:.6}.spinner{width:clamp(60px,8vw,85px);animation:spin .75s linear infinite}.spinner svg{width:100%;height:100%}@keyframes spin{to{transform:rotate(360deg)}}.content{flex-direction:column;flex-grow:1;align-items:flex-start;padding:5px var(--content-px);margin-bottom:25px;overflow-y:auto}.header{flex-direction:column;position:relative;font-weight:700;font-size:var(--font-header)}.header hr{width:100%;border-bottom:0;border-color:var(--surface);position:relative;z-index:-1}.filters{justify-content:space-between;width:100%;margin-bottom:clamp(30px,4vw,50px)}.combo-box{flex-direction:column;position:relative}.combo-box .name{height:20px;margin-bottom:clamp(5px,1vw,8px);margin-left:1px;color:#343434;font-size:clamp(14px,1.5vw,16px)}.combo-box .box{justify-content:space-between;align-items:center;min-width:clamp(200px,30vw,400px);height:clamp(32px,4vw,40px);padding:0 12px;border-radius:var(--radius);background-color:var(--surface-alt);font-size:clamp(12px,1.5vw,16px)}.combo-box .box svg{height:clamp(8px,1vw,10px);margin-top:2px;transition:transform .125s}.combo-box .box.opened svg{transform:rotate(180deg)}.combo-box .choices{flex-direction:column;position:absolute;top:75px;z-index:2;width:100%;background-color:var(--surface);border-radius:var(--radius);font-size:clamp(12px,1.5vw,16px)}.combo-box .choices .choice{padding:8px 12px;transition:background-color .15s}.combo-box .choices .choice:hover{background-color:#0000000d}.combo-box .choices .choice:active{background-color:#0000001a}.combo-box .choices .choice:first-child{border-top-left-radius:var(--radius);border-top-right-radius:var(--radius)}.combo-box .choices .choice:last-child{border-bottom-left-radius:var(--radius);border-bottom-right-radius:var(--radius)}.no-updates{margin-bottom:20px;font-size:var(--font-body)}.updates{flex-direction:column;width:100%;margin-bottom:15px}.updates .update{align-items:center;margin-bottom:10px;padding-left:35px;font-size:clamp(18px,2.5vw,28px)}.updates .update .top{align-items:center}.updates .update .top .id{margin-left:15px;margin-right:10px;font-weight:700}.updates .update .top .dash{margin-right:10px;font-size:clamp(18px,2vw,24px)}.updates .update .top .name{font-size:var(--font-body);margin-right:10px}.updates .update .top .name .target{font-weight:500}.updates .update .mark{align-items:center;margin-bottom:1px;font-weight:500}.updates .update .mark .point{margin-left:2px;margin-right:12px}.updates .update .mark .from{color:#a5a9b5;text-decoration:line-through}.updates .update .mark .update-arrow{margin:0 10px}.updates .update .mark .type-sign{margin-left:12px;margin-bottom:2px}.updates .update .mark .type-sign svg{width:30px}.big-list{flex-direction:column;margin-bottom:20px;padding-top:5px;transition:opacity .15s}.big-list .entry{align-items:center;margin-bottom:12px;padding-left:clamp(15px,3vw,35px);font-size:clamp(18px,2.8vw,26px)}.big-list .entry .name{margin-left:12px;margin-right:10px}.big-list .entry .mark{margin-left:10px}.big-list .entry .mark .value{font-weight:700}.track-info{flex-direction:column}.track-info-name{font-weight:700;font-size:var(--font-header)}.track-info-detail{font-size:clamp(12px,1.4vw,15px);color:var(--text-muted);margin-top:2px}.coeff-info{flex-direction:column;margin-top:8px;padding-left:clamp(15px,3vw,35px);font-size:clamp(14px,1.8vw,18px)}.coeff-main{align-items:center;gap:12px;font-weight:500}.coeff-muted{color:var(--text-muted);font-weight:400}.coeff-links{margin-top:5px;margin-left:20px;font-size:clamp(12px,1.4vw,15px);font-weight:500}.coeff-copied{color:#44b732!important}.api-error-panel{flex-direction:column;align-items:center;justify-content:center;text-align:center;width:100%;height:100%;padding:40px 30px;gap:16px;z-index:2}.api-error-title{font-size:22px;font-weight:700;color:#e34e4e}.api-error-desc{font-size:14px;color:#aaa;line-height:1.6;max-width:400px}.api-error-box{background:#1e2233;color:#ff6b6b;padding:12px 18px;border-radius:10px;font-size:11px;max-width:100%;overflow-x:auto;text-align:left;white-space:pre-wrap;word-break:break-word}.api-error-actions{gap:10px;flex-wrap:wrap;justify-content:center}.api-error-btn{padding:8px 20px;border-radius:10px;font-weight:600;font-size:13px;cursor:pointer;border:1px solid #444;background:none;color:#aaa;text-decoration:none}.api-error-btn.primary{background:#fff;color:#151925;border-color:#fff}.api-error-btn.muted{color:#666;border-color:#444;font-weight:400}.api-error-btn:hover{opacity:.85}.empty-state{flex-direction:column;align-items:center;justify-content:center;width:100%;flex-grow:1;padding:60px 20px;text-align:center;gap:8px}.empty-state-text{font-size:18px;font-weight:600;color:var(--text-primary)}.empty-state-hint{font-size:14px;color:var(--text-muted)}hr.separator{width:100%;margin-top:25px;opacity:.3;border-bottom:0;border-color:var(--surface)}.header.module{max-width:100%;margin-top:50px}.header.module .text{align-items:center}.header.module .name,.header.module .average,.header.module .class-average,.header.module .max{white-space:nowrap}.header.module .name{display:inline-block;overflow:hidden;text-overflow:ellipsis;padding-bottom:2px}.header.module .point{margin:2px 10px 0}.header.module .class-average{margin-left:10px;font-weight:400}.subject{width:100%;margin:15px 0}.subject .info{flex-direction:column;align-items:center;flex-shrink:0;width:250px;padding-top:15px;padding-bottom:17px}.subject .info .top,.subject .info .bottom{display:contents}.subject .info .id{font-weight:700;font-size:24px;word-break:break-word}.subject .info .point{display:none}.subject .info .average{margin-top:10px;font-size:24px}.subject .info .average .value{font-weight:700}.subject .info .class-average{font-size:14px}.subject .info .bottom-line{display:none}.subject .marks{flex-direction:column;flex-grow:1;justify-content:center;max-width:calc(100% - 275px);padding:15px 0;font-size:16px}.subject .marks .marks-title{font-weight:600;font-size:15px;margin-bottom:6px;color:#444}.subject .marks .mark{align-items:center;max-width:100%;margin:3px 0}.subject .marks .mark .point{margin-bottom:1px}.subject .marks .mark .line{display:contents}.subject .marks .mark .name,.subject .marks .mark .value,.subject .marks .mark .class-average{white-space:nowrap}.subject .marks .mark .name{display:inline-block;margin-left:15px;overflow:hidden;text-overflow:ellipsis;padding-bottom:2px}.subject .marks .mark .value{justify-content:flex-end;margin-left:1px;font-weight:700}.subject .marks .mark .class-average{margin-left:10px}.coeff-badge{display:inline-block;margin-left:8px;padding:1px 7px;border-radius:4px;font-size:.7em;font-weight:600;letter-spacing:.02em;vertical-align:middle}.coeff-badge.ects{background:#e8f5e9;color:#2e7d32}.coeff-badge.coef{background:var(--surface-alt);color:var(--text-muted)}.copy-code{display:inline-block;border-bottom:1px dashed var(--dot-color)}.copy-code:hover{border-bottom-color:var(--text-muted)}.code-tooltip{position:fixed;z-index:9999;padding:5px 12px;border-radius:5px;background:var(--bg-darker);color:#e8eaed;font-size:13px;font-weight:500;letter-spacing:.3px;font-family:SF Mono,Cascadia Code,Fira Code,monospace;white-space:nowrap;pointer-events:none;box-shadow:0 4px 12px #0000004d;opacity:0;transition:opacity .12s}.code-tooltip.copied{background:var(--accent);color:#fff;font-family:inherit}.no-marks{flex-grow:1;justify-content:center;align-items:center;width:100%;font-size:28px}@media (max-width: 850px){.filters{flex-direction:column;gap:15px}.header hr{margin-top:9px}.updates{margin-top:4px;margin-bottom:12px}.updates .update{display:grid;grid-template-columns:17px 100%;margin-bottom:6px;padding-left:15px}.updates .update>.point{width:6px;height:6px}.updates .update .top .id{margin-left:0;margin-right:6px}.updates .update .top .name{display:inline-block;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.updates .update .top .name .target{display:none}.updates .update .mark{grid-column:2 / 3;height:23px}.updates .update .mark .point{display:none}.updates .update .mark .update-arrow{width:20px;margin:0 6px 1px}.updates .update .mark .type-sign{width:14px;margin-left:6px;margin-bottom:2px}.header.module{margin-top:20px;margin-bottom:6px}.header.module .text{flex-direction:column;align-items:flex-start;margin-left:-1px}.header.module .text .name{max-width:100%;margin-bottom:2px;font-size:20px}.header.module .text .point{display:none}.header.module .text .bottom{align-items:center;font-size:16px}.header.module .text .bottom .class-average{margin-left:5px;font-size:14px}.header.module .bottom-line{margin-top:7px;margin-bottom:1px;opacity:.6}.subject{flex-direction:column;margin:10px 0;padding:10px 14px}.subject .no-marks{margin:4px 0;font-size:14px}.subject .info{align-items:flex-start;width:100%;padding:0}.subject .info .top,.subject .info .bottom{display:flex;align-items:center;max-width:100%}.subject .info .id{font-size:18px}.subject .info .point{display:block;width:5px;height:5px;margin:0 8px}.subject .info .average{margin:0;font-size:14px}.subject .info .class-average{margin-left:5px;font-size:12px}.subject .info .bottom-line{display:block;width:100%;border-bottom:0;border-color:var(--surface);opacity:.3}.subject .marks{max-width:100%;padding:0}.subject .marks .mark{display:grid;grid-template-columns:12px calc(100% - 5px);padding:0 5px}.subject .marks .mark .point{width:5px;height:5px;margin-top:1px}.subject .marks .mark .line{display:flex;flex-direction:row-reverse;justify-content:flex-end;font-size:13px}.subject .marks .mark .line .name{margin-left:0}.subject .marks .mark .line .value{width:auto;margin-left:0}.subject .marks .mark .class-average{grid-column:2 / 3;margin-left:0;font-size:11px}.subject .marks .mark .class-average .parenthesis{display:none}}@media (max-width: 575px){#background{display:none}#header{flex-direction:column;padding:0;justify-content:center;margin-bottom:20px}#header #logo{margin-top:15px;margin-left:0;max-width:80%}#content{padding:15px 0}hr.separator{margin-top:0;margin-bottom:5px}}@media (max-height: 650px){#header #logo{margin-top:0}#header #logo svg{height:115px}}@media (max-height: 550px){#header{margin-bottom:10px}#header #logo svg{height:100px}#header #logout{font-size:16px}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--dot-color);border-radius:3px}#print-view{display:none}@media print{@page{size:A4 portrait;margin:0}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}body{overflow:visible;margin:0;background:#fff}#app{height:auto;display:block}#print-view{padding:18mm 16mm!important}#background,#content,#view-switcher{display:none!important}#print-view{display:block!important;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1a1a2e}.p-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:22px;padding-bottom:16px;border-bottom:2.5px solid #3b6fa0}.p-header-left{display:flex;flex-direction:column;gap:1px}.p-info{font-size:11.5px;color:#555;line-height:1.5}.p-student{font-size:13px;font-weight:700;margin-top:6px;color:#1a1a2e}.p-header-right{font-size:24px;font-weight:800;color:#1a1a2e;letter-spacing:-.01em;text-align:right;flex-shrink:0;margin-left:30px}.p-table{width:100%;border-collapse:collapse;font-size:12px;line-height:1.35}.p-table th,.p-table td{padding:7px 12px;border:1px solid #c0ccd8;vertical-align:middle}.p-left{text-align:left!important}.p-col-name{width:48%}.p-col-ects{width:12%}.p-col-avg{width:20%}.p-table thead th{background:#4a7fb5!important;color:#fff!important;font-weight:700;font-size:11px;text-align:center;text-transform:uppercase;letter-spacing:.05em;padding:10px 12px}.p-table .p-ue td{background:#d6e4f0!important;font-weight:800;text-align:center;font-size:13px;padding:9px 12px;border-color:#a8bdd2}.p-table .p-sub td{text-align:center;font-size:11.5px;padding:5px 12px}.p-table .p-sub td:first-child{padding-left:22px}.p-table .p-sub td:last-child{font-weight:700}.p-coef{margin-left:6px;font-size:9px;color:#7a8a9e;font-weight:600}.p-table .p-total td{background:#4a7fb5!important;color:#fff!important;font-weight:800;font-size:13px;text-align:center;padding:9px 12px;border-color:#3a6a9a}.p-notes{margin-top:16px;font-size:10px;color:#555;line-height:1.6}.p-footer{margin-top:12px;font-size:9px;color:#aaa;text-align:center;letter-spacing:.02em}}\n";(document.head||document.documentElement).appendChild(s)})();
(function() {
	//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __esmMin = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
	var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	//#endregion
	//#region src/auriga/api.js
	var AURIGA_API = "/api";
	var _accessToken = null;
	var _onApiRequest = null;
	function setApiRequestHook(fn) {
		_onApiRequest = fn;
	}
	function setAccessToken(token) {
		_accessToken = token;
	}
	function getAccessToken() {
		return _accessToken;
	}
	async function apiFetch(path, options = {}, _retried = false) {
		if (!_accessToken) throw new Error("No access token available");
		const url = path.startsWith("http") ? path : `${AURIGA_API}${path}`;
		_onApiRequest?.(url);
		const response = await fetch(url, {
			...options,
			headers: {
				"Authorization": `Bearer ${_accessToken}`,
				"Content-Type": "application/json",
				...options.headers
			}
		});
		const TOKEN_REFRESH_DELAY_MS = 2e3;
		if (response.status === 401 && !_retried) {
			await new Promise((r) => setTimeout(r, TOKEN_REFRESH_DELAY_MS));
			return apiFetch(path, options, true);
		}
		if (!response.ok) throw new Error(`Auriga API error: ${response.status} ${response.statusText} (${url})`);
		const text = await response.text();
		try {
			return JSON.parse(text);
		} catch {
			throw new Error(`Auriga API returned invalid JSON for ${url} (got ${text.substring(0, 100)}...)`);
		}
	}
	/** Fetch all pages of a search result endpoint, returning all lines across pages. */
	async function fetchAllSearchResults(menuEntryId, queryId) {
		const body = (await apiFetch(`/menuEntries/${menuEntryId}/query/${queryId}`)).queryDefinition;
		let allLines = [];
		let page = 1;
		let totalPages = 1;
		do {
			const result = await apiFetch(`/menuEntries/${menuEntryId}/searchResult?size=100&page=${page}&sort=id&disableWarnings=true`, {
				method: "POST",
				body: JSON.stringify(body)
			});
			allLines = allLines.concat(result.content.lines);
			totalPages = result.totalPages;
			page++;
		} while (page <= totalPages);
		return allLines;
	}
	//#endregion
	//#region src/auriga/auth.js
	var _userInfo = null;
	var _tokenListeners = [];
	/**
	* Intercept XHR calls to the Keycloak token endpoint to capture fresh tokens.
	* The Angular app refreshes the token on load and every ~60s — we piggyback on that.
	*/
	function installTokenInterceptor() {
		const origOpen = XMLHttpRequest.prototype.open;
		const origSend = XMLHttpRequest.prototype.send;
		XMLHttpRequest.prototype.open = function(method, url, ...args) {
			this._aurigaUrl = url;
			return origOpen.call(this, method, url, ...args);
		};
		XMLHttpRequest.prototype.send = function(body) {
			if (this._aurigaUrl && this._aurigaUrl.includes("openid-connect/token")) this.addEventListener("load", function() {
				try {
					const data = JSON.parse(this.responseText);
					if (data.access_token) {
						setAccessToken(data.access_token);
						_tokenListeners.forEach((fn) => fn());
						_tokenListeners = [];
					}
				} catch (e) {}
			});
			return origSend.call(this, body);
		};
	}
	/**
	* Wait for the token interceptor to capture a valid token.
	*
	* Resolves immediately if a token is already available.
	* Otherwise, waits for the next token capture event.
	*
	* No artificial timeout — if the user isn't logged in, Angular will
	* redirect to Keycloak (different domain) and this promise simply
	* never resolves, which is fine since our script dies with the navigation.
	*/
	function waitForToken() {
		if (getAccessToken()) return Promise.resolve();
		return new Promise((resolve) => {
			_tokenListeners.push(resolve);
		});
	}
	/**
	* Fetch and cache user info from /api/me.
	* Returns { firstName, lastName, fullName, personId }.
	*/
	async function getUserInfo() {
		if (_userInfo) return _userInfo;
		if (window.location.hostname === "localhost") {
			_userInfo = {
				firstName: "Dev",
				lastName: "User",
				fullName: "Dev User",
				personId: 0
			};
			return _userInfo;
		}
		const data = await apiFetch("/me");
		_userInfo = {
			firstName: data.person.currentFirstName,
			lastName: data.person.currentLastName,
			fullName: `${data.person.currentFirstName} ${data.person.currentLastName}`,
			personId: data.person.id
		};
		return _userInfo;
	}
	/**
	* Get user display name.
	*/
	async function getName() {
		return (await getUserInfo()).fullName;
	}
	//#endregion
	//#region src/toggle.js
	var PREF_KEY = "infinity_auriga_enabled";
	function isInfinityEnabled() {
		return localStorage.getItem(PREF_KEY) !== "0";
	}
	/**
	* Create the view switcher. Switching modes reloads the page.
	*/
	function setupToggle(active) {
		const style = document.createElement("style");
		style.textContent = `
        #view-switcher { display:flex; position:fixed; bottom:28px; left:28px; z-index:9999; padding:4px; border-radius:14px; background:#fff; box-shadow:0 4px 20px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.06); font-family:system-ui,-apple-system,sans-serif; }
        #view-switcher .switcher-pill { position:absolute; top:4px; left:4px; width:calc(50% - 4px); height:calc(100% - 8px); border-radius:11px; background:#151925; transition:transform .3s cubic-bezier(.4,0,.2,1); pointer-events:none; }
        #view-switcher .switcher-option { position:relative; z-index:1; padding:10px 24px; border-radius:11px; background:none; border:none; outline:none; color:#868DA0; font-size:14px; font-weight:600; font-family:inherit; letter-spacing:.3px; cursor:pointer; user-select:none; white-space:nowrap; transition:color .25s; }
        #view-switcher .switcher-option:hover { color:#151925; }
        #view-switcher .switcher-option.active { color:#fff; }
    `;
		document.head.appendChild(style);
		const switcher = document.createElement("div");
		switcher.id = "view-switcher";
		const pill = document.createElement("div");
		pill.className = "switcher-pill";
		const btnInfinity = document.createElement("button");
		btnInfinity.className = "switcher-option" + (active === "infinity" ? " active" : "");
		btnInfinity.textContent = "Infinity";
		const btnClassic = document.createElement("button");
		btnClassic.className = "switcher-option" + (active === "classic" ? " active" : "");
		btnClassic.textContent = "Classique";
		pill.style.transform = active === "infinity" ? "translateX(0)" : "translateX(100%)";
		switcher.append(pill, btnInfinity, btnClassic);
		document.body.appendChild(switcher);
		btnInfinity.addEventListener("click", () => {
			if (active === "infinity") return;
			localStorage.setItem(PREF_KEY, "1");
			window.location.reload();
		});
		btnClassic.addEventListener("click", () => {
			if (active === "classic") return;
			localStorage.setItem(PREF_KEY, "0");
			window.location.reload();
		});
	}
	//#endregion
	//#region src/auriga/hierarchy.js
	/**
	* Parse an Auriga exam code into its hierarchical components.
	*
	* Code anatomy:
	*   2526_I_INF_FISA_S07_CS_GR_WS_EX
	*   │    │ │   │    │   └── path segments ──┘ └─ evalType
	*   [0]  1 2   3    4       5...               last (if in EVAL_TYPES)
	*
	*   [0] year       — academic year (25/26)
	*   [1] constant   — always "I"
	*   [2] school     — school code (INF for EPITA informatique)
	*   [3] track      — FISA, FISE, GISTRE, ...
	*   [4] semester   — S07, S08, ...
	*   [5+] path      — module / subject / exam segments
	*   [last] evalType — EX, PRJ, etc. (stripped from path if recognized)
	*/
	var EVAL_TYPES = new Set([
		"EX",
		"PRJ",
		"EXF",
		"EXO",
		"FAF",
		"PROJ"
	]);
	var EVAL_LABELS = {
		EX: "Examen",
		EXF: "Examen final",
		EXO: "Examen oral",
		PRJ: "Projet",
		PROJ: "Projet",
		FAF: "Contrôle continu"
	};
	/**
	* @param {string} code - The full exam code
	* @param {string|null} [apiExamType] - Exam type from the API column (skips guessing when present)
	*/
	function parseExamCode(code, apiExamType = null) {
		const parts = code.split("_");
		if (parts.length < 5) return null;
		const year = parts[0];
		const school = parts[2];
		const track = parts[3];
		const semester = parts[4];
		const rest = parts.slice(5);
		let evalType = apiExamType;
		let path = rest;
		if (!evalType && rest.length > 0 && EVAL_TYPES.has(rest[rest.length - 1])) {
			evalType = rest[rest.length - 1];
			path = rest.slice(0, -1);
		}
		return {
			year,
			school,
			track,
			semester,
			path,
			evalType,
			fullCode: code
		};
	}
	/**
	* Build a name lookup from parsed synthesis entries.
	*/
	function buildNameLookup(entries) {
		const lookup = /* @__PURE__ */ new Map();
		for (const entry of entries) lookup.set(entry.examCode, {
			name: entry.name,
			nameEn: entry.nameEn,
			avgPreRatt: entry.avgPreRatt,
			avgFinal: entry.avgFinal
		});
		return lookup;
	}
	/**
	* Detect transparent path prefixes — codes that are containers (semester wrappers,
	* phantom groupings like SAE) rather than real UEs.
	*
	* A prefix is transparent if:
	*   1. Pedagogical API marks it as "Semester" type, OR
	*   2. Its synthesis name contains "semestre", OR
	*   3. It has no synthesis name AND has multiple distinct children
	*      (phantom grouping — e.g. SAE groups DEVSEC + INT but isn't a real UE)
	*
	* Detection is applied recursively: if CS is transparent and SAE (under CS) is also
	* transparent, both are stripped. CS_SAE_INT_PEN → [INT, PEN].
	*/
	function detectTransparentPrefixes(grades, nameLookup, componentTypes) {
		const children = /* @__PURE__ */ new Map();
		for (const grade of grades) {
			const parsed = parseExamCode(grade.examCode, grade.examType);
			if (!parsed || parsed.path.length < 2) continue;
			const id0 = parsed.path[0];
			if (!children.has(id0)) children.set(id0, /* @__PURE__ */ new Set());
			children.get(id0).add(parsed.path[1]);
			if (parsed.path.length >= 3) {
				const key = id0 + ">" + parsed.path[1];
				if (!children.has(key)) children.set(key, /* @__PURE__ */ new Set());
				children.get(key).add(parsed.path[2]);
			}
		}
		const transparent = /* @__PURE__ */ new Set();
		function isTransparent(pathId, fullCode, key) {
			if (componentTypes) {
				const type = componentTypes.get(fullCode);
				if (type && /semester/i.test(type)) return true;
			}
			const info = resolveName(fullCode, "_" + pathId, nameLookup);
			if (info && /semestre/i.test(info.name)) return true;
			if (!info && (children.get(key)?.size ?? 0) > 1) return true;
			return false;
		}
		const checked = /* @__PURE__ */ new Set();
		for (const grade of grades) {
			const parsed = parseExamCode(grade.examCode, grade.examType);
			if (!parsed || parsed.path.length < 2) continue;
			const prefix = `${parsed.year}_I_${parsed.school}_${parsed.track}_${parsed.semester}`;
			const id0 = parsed.path[0];
			if (!checked.has(id0)) {
				checked.add(id0);
				if (isTransparent(id0, `${prefix}_${id0}`, id0)) transparent.add(id0);
			}
			if (transparent.has(id0) && parsed.path.length >= 3) {
				const id1 = parsed.path[1];
				const key = id0 + ">" + id1;
				if (!checked.has(key)) {
					checked.add(key);
					if (isTransparent(id1, `${prefix}_${id0}_${id1}`, key)) transparent.add(key);
				}
			}
		}
		return transparent;
	}
	/**
	* Get the effective path for a grade, skipping transparent prefixes.
	* CS_SAE_INT_PEN → [INT, PEN] (CS and SAE both skipped)
	* CS_CN_COCO     → [CN, COCO] (CS skipped)
	* CN_COLIN       → [CN, COLIN] (no skip)
	*/
	function effectivePath(path, transparentPrefixes) {
		let p = path;
		if (p.length >= 2 && transparentPrefixes.has(p[0])) {
			const key = p[0] + ">" + p[1];
			if (p.length >= 3 && transparentPrefixes.has(key)) p = p.slice(2);
			else p = p.slice(1);
		}
		return p;
	}
	/**
	* Pre-scan to detect which depth-2 path prefixes need depth-3 subject grouping.
	* Only promotes when depth-3 entries have children (path length >= 4),
	* meaning they're sub-subject groupings, not leaf exams.
	*/
	function detectSubjectDepths(grades, transparentPrefixes) {
		const info = /* @__PURE__ */ new Map();
		for (const grade of grades) {
			const parsed = parseExamCode(grade.examCode, grade.examType);
			if (!parsed) continue;
			const path = effectivePath(parsed.path, transparentPrefixes);
			if (path.length < 3) continue;
			const key = path.slice(0, 2).join("_");
			if (!info.has(key)) info.set(key, {
				subGroups: /* @__PURE__ */ new Set(),
				maxDepth: 0
			});
			const entry = info.get(key);
			entry.subGroups.add(path[2]);
			entry.maxDepth = Math.max(entry.maxDepth, path.length);
		}
		const deep = /* @__PURE__ */ new Set();
		for (const [key, { subGroups, maxDepth }] of info) if (subGroups.size > 1 && maxDepth >= 4) deep.add(key);
		return deep;
	}
	/**
	* Find the subject grouping level for a path.
	* Default depth 2, promoted to depth 3 when detected as deep.
	*/
	function findSubjectLevel(prefix, path, deepPrefixes) {
		if (path.length >= 3) {
			const d2 = path.slice(0, 2).join("_");
			if (deepPrefixes.has(d2)) {
				const id = path.slice(0, 3).join("_");
				return {
					id,
					code: `${prefix}_${id}`
				};
			}
		}
		if (path.length >= 2) {
			const id = path.slice(0, 2).join("_");
			return {
				id,
				code: `${prefix}_${id}`
			};
		}
		return {
			id: path[0] || "TC",
			code: `${prefix}_${path[0] || "TC"}`
		};
	}
	/**
	* Resolve a name from the lookup, falling back to cross-semester suffix matching.
	*/
	function resolveName(code, suffix, nameLookup) {
		const info = nameLookup.get(code);
		if (info) return info;
		for (const [key, val] of nameLookup) if (key.endsWith(suffix)) return val;
		return null;
	}
	/**
	* Build the grade tree from parsed grade entries.
	*
	* Hierarchy: Module (UE) → Subject (ECUE) → Mark (individual grade)
	*
	* Semester containers (e.g. CS) are detected and made transparent —
	* their children are promoted to top-level modules. This merges
	* entries like CS_CN_* and CN_* into the same module.
	*/
	function buildGradeTree(grades, nameLookup, componentTypes = null) {
		const transparentPrefixes = detectTransparentPrefixes(grades, nameLookup, componentTypes);
		const deepPrefixes = detectSubjectDepths(grades, transparentPrefixes);
		const modules = /* @__PURE__ */ new Map();
		for (const grade of grades) {
			const parsed = parseExamCode(grade.examCode, grade.examType);
			if (!parsed) continue;
			const { semester, school } = parsed;
			const prefix = `${parsed.year}_I_${school}_${parsed.track}_${semester}`;
			const path = effectivePath(parsed.path, transparentPrefixes);
			const moduleId = path[0] || "TC";
			const moduleCode = `${prefix}_${moduleId}`;
			const subject = findSubjectLevel(prefix, path, deepPrefixes);
			if (!modules.has(moduleCode)) {
				const info = resolveName(moduleCode, "_" + moduleId, nameLookup);
				let name = moduleId;
				let nameEn = moduleId;
				if (info) {
					name = info.name.length <= 40 ? info.name : moduleId;
					const en = info.nameEn || info.name;
					nameEn = en.length <= 40 ? en : moduleId;
				}
				const modPromo = info?.avgPreRatt ? parseFloat(info.avgPreRatt) : NaN;
				modules.set(moduleCode, {
					id: moduleId,
					_code: moduleCode,
					name,
					nameEn,
					average: null,
					classAverage: isNaN(modPromo) ? null : modPromo,
					subjects: /* @__PURE__ */ new Map()
				});
			}
			const mod = modules.get(moduleCode);
			if (!mod.subjects.has(subject.code)) {
				const info = resolveName(subject.code, "_" + subject.id, nameLookup);
				const subPromo = info?.avgPreRatt ? parseFloat(info.avgPreRatt) : NaN;
				const fallbackName = subject.id.replace(/_/g, " ");
				mod.subjects.set(subject.code, {
					id: subject.id,
					_code: subject.code,
					name: info ? info.name : fallbackName,
					nameEn: info ? info.nameEn || info.name : fallbackName,
					average: null,
					classAverage: isNaN(subPromo) ? null : subPromo,
					coefficient: 1,
					marks: []
				});
			}
			const sub = mod.subjects.get(subject.code);
			if (sub.marks.some((m) => m._code === grade.examCode)) continue;
			const examInfo = nameLookup.get(grade.examCode);
			const promoAvg = examInfo?.avgPreRatt ? parseFloat(examInfo.avgPreRatt) : null;
			sub.marks.push({
				id: sub.marks.length,
				_code: grade.examCode,
				name: examInfo ? examInfo.name : parsed.evalType || "Note",
				value: grade.mark,
				classAverage: isNaN(promoAvg) ? null : promoAvg,
				coefficient: grade.coefficient
			});
		}
		const result = [];
		for (const [, mod] of modules) {
			mod.subjects = [...mod.subjects.values()];
			for (const sub of mod.subjects) {
				if (sub.marks.length < 2) continue;
				const baseName = (name) => {
					const i = name.lastIndexOf(" - ");
					return i > 0 ? name.slice(0, i) : name;
				};
				const baseCounts = /* @__PURE__ */ new Map();
				for (const mark of sub.marks) {
					const base = baseName(mark.name);
					baseCounts.set(base, (baseCounts.get(base) || 0) + 1);
				}
				for (const mark of sub.marks) {
					const base = baseName(mark.name);
					if (baseCounts.get(base) < 2) continue;
					mark._group = base;
					if (mark.name === base) {
						const parsed = parseExamCode(mark._code);
						mark.name = parsed?.evalType ? EVAL_LABELS[parsed.evalType] || parsed.evalType : base;
					}
				}
			}
			result.push(mod);
		}
		return result;
	}
	//#endregion
	//#region src/auriga/schema.js
	/**
	* Auriga API response schema — column mappings and line parsers.
	*
	* ┌─────────────────────────────────────────────────────────────────┐
	* │  THIS IS THE SINGLE FILE TO UPDATE IF AURIGA CHANGES FORMAT.   │
	* └─────────────────────────────────────────────────────────────────┘
	*
	* Auriga search endpoints return { content: { columns: [...], lines: [...] } }.
	* Each line is an array of values whose positions are defined below.
	*
	* GRADES endpoint (APP_040_010_MES_NOTES, e.g. menuEntry 1036):
	*   [0] internalId   [1] mark (string)  [2] coefficient  [3] examCode  [4] examType
	*
	* SYNTHESIS endpoint (APP_040_010_MES_NOTES_SYNT, e.g. menuEntry 1144):
	*   [0] personId     [1] avgPreRatt     [2] examCode      [3] caption {fr,en}  [4] avgFinal
	*
	* PEDAGOGICAL REGISTRATION endpoint (APP_000_014_INSC_PEDA, e.g. menuEntry 1034):
	*   [0] internalId   [1] examCode       [2] obligationType {en,fr}   [3] registrationStatus {en,fr}
	*   Component types (en): "Semester", "EU Resource", "EU Authentic Assessment Situation",
	*                         "Educational unit (ECUE)"
	*
	* Last verified: 2026-03-26 against capture auriga-capture-1774299604740.json
	*/
	var MENU_CODES = {
		grades: "APP_040_010_MES_NOTES",
		synthesis: "APP_040_010_MES_NOTES_SYNT",
		pedagogical: "APP_000_014_INSC_PEDA"
	};
	var GRADES = {
		internalId: 0,
		mark: 1,
		coefficient: 2,
		examCode: 3,
		examType: 4
	};
	var SYNTHESIS = {
		personId: 0,
		avgPreRatt: 1,
		examCode: 2,
		caption: 3,
		avgFinal: 4
	};
	var PEDAGOGICAL = {
		internalId: 0,
		examCode: 1,
		obligationType: 2,
		registrationStatus: 3
	};
	/**
	* Check parsed results for signs that the API format has changed.
	* Call after parsing a batch of lines — throws if most lines failed to parse.
	*
	* @param {string} endpoint - Human-readable name ("grades" or "synthesis")
	* @param {Array} rawLines - Original raw lines from the API
	* @param {Array} parsed - Successfully parsed entries (nulls filtered out)
	*/
	function validateParseResults(endpoint, rawLines, parsed) {
		if (rawLines.length === 0) return;
		const failRate = 1 - parsed.length / rawLines.length;
		if (failRate > .5) throw new Error(`API format changed: ${Math.round(failRate * 100)}% of ${endpoint} lines failed to parse (${parsed.length}/${rawLines.length} succeeded). Check schema.js column indices against a fresh capture.`);
	}
	/**
	* Parse a raw grade line into a named object.
	*
	* @param {Array} line - Raw array from Auriga searchResult
	* @returns {{ mark: number, coefficient: number, examCode: string, examType: string|null } | null}
	*/
	function parseGradeLine(line) {
		const examCode = line[GRADES.examCode];
		if (!examCode || typeof examCode !== "string") {
			console.warn("[Infinity] Unexpected grade line — examCode missing at index", GRADES.examCode, line);
			return null;
		}
		const mark = parseFloat(line[GRADES.mark]);
		if (isNaN(mark)) return null;
		return {
			mark,
			coefficient: line[GRADES.coefficient] || 100,
			examCode,
			examType: line[GRADES.examType] || null
		};
	}
	/**
	* Parse a raw synthesis line into a named object.
	*
	* @param {Array} line - Raw array from Auriga searchResult
	* @returns {{ examCode: string, name: string, avgPreRatt: *, avgFinal: * } | null}
	*/
	function parseSynthesisLine(line) {
		const examCode = line[SYNTHESIS.examCode];
		if (!examCode || typeof examCode !== "string") {
			console.warn("[Infinity] Unexpected synthesis line — examCode missing at index", SYNTHESIS.examCode, line);
			return null;
		}
		const caption = line[SYNTHESIS.caption] || {};
		return {
			examCode,
			name: caption.fr || caption.en || examCode,
			nameEn: caption.en || caption.fr || examCode,
			avgPreRatt: line[SYNTHESIS.avgPreRatt],
			avgFinal: line[SYNTHESIS.avgFinal]
		};
	}
	/**
	* Parse a pedagogical registration line into a named object.
	* Returns the component type (en) which tells us the hierarchy level.
	*
	* @param {Array} line - Raw array from Auriga searchResult
	* @returns {{ examCode: string, componentType: string } | null}
	*/
	function parsePedagogicalLine(line) {
		const examCode = line[PEDAGOGICAL.examCode];
		if (!examCode || typeof examCode !== "string") return null;
		const typeCaption = line[PEDAGOGICAL.obligationType] || {};
		return {
			examCode,
			componentType: typeCaption.en || typeCaption.fr || ""
		};
	}
	//#endregion
	//#region src/auriga/marks.js
	var _menuConfig = null;
	async function getMenuConfig() {
		if (_menuConfig) return _menuConfig;
		const menus = await apiFetch("/menus");
		const entries = {};
		for (const menu of menus.menus) for (const obj of menu.objects || []) entries[obj.menuEntryCode] = {
			menuEntryId: obj.menuEntryId,
			queryId: obj.queryId,
			formId: obj.formId
		};
		_menuConfig = {
			grades: entries[MENU_CODES.grades],
			synthesis: entries[MENU_CODES.synthesis],
			pedagogical: entries[MENU_CODES.pedagogical]
		};
		if (!_menuConfig.grades) throw new Error(`Menu entries not found: grades (${MENU_CODES.grades}). Available: ${Object.keys(entries).join(", ")}. Auriga may have renamed its menu structure.`);
		if (!_menuConfig.synthesis) throw new Error(`Menu entries not found: synthesis (${MENU_CODES.synthesis}). Available: ${Object.keys(entries).join(", ")}. Auriga may have renamed its menu structure.`);
		return _menuConfig;
	}
	var _cachedSynthesisEntries = null;
	var _componentTypesPromise;
	/** Fetch component type map from the pedagogical endpoint, or null if unavailable. */
	function getComponentTypes() {
		if (_componentTypesPromise) return _componentTypesPromise;
		_componentTypesPromise = (async () => {
			const config = await getMenuConfig();
			if (!config.pedagogical) return null;
			try {
				const entries = (await fetchAllSearchResults(config.pedagogical.menuEntryId, config.pedagogical.queryId)).map(parsePedagogicalLine).filter(Boolean);
				const types = /* @__PURE__ */ new Map();
				for (const { examCode, componentType } of entries) types.set(examCode, componentType);
				return types;
			} catch (err) {
				console.warn("[Infinity Auriga] Failed to fetch pedagogical data, using fallback:", err.message);
				return null;
			}
		})();
		return _componentTypesPromise;
	}
	async function getMarksFilters() {
		const synth = (await getMenuConfig()).synthesis;
		const rawLines = await fetchAllSearchResults(synth.menuEntryId, synth.queryId);
		const entries = rawLines.map(parseSynthesisLine).filter(Boolean);
		validateParseResults("synthesis", rawLines, entries);
		_cachedSynthesisEntries = entries;
		const semesters = /* @__PURE__ */ new Map();
		for (const entry of entries) {
			const parsed = parseExamCode(entry.examCode);
			if (!parsed) continue;
			const key = `${parsed.semester}_${parsed.year}`;
			if (!semesters.has(key)) {
				const semNum = parsed.semester.replace("S", "");
				const yearStart = "20" + parsed.year.substring(0, 2);
				const yearEnd = "20" + parsed.year.substring(2, 4);
				semesters.set(key, {
					name: `Semestre ${semNum} - ${yearStart}/${yearEnd}`,
					value: key
				});
			}
		}
		return [{
			id: "semester",
			name: "Semestre",
			values: Array.from(semesters.values()).sort((a, b) => b.value.localeCompare(a.value))
		}];
	}
	async function getMarks(filters) {
		const semFilter = filters.semester;
		if (!semFilter) throw new Error("No semester selected");
		const [semester, year] = semFilter.split("_");
		const config = await getMenuConfig();
		const [rawGrades, synthesisEntries, componentTypes] = await Promise.all([
			fetchAllSearchResults(config.grades.menuEntryId, config.grades.queryId).then((raw) => {
				const entries = raw.map(parseGradeLine).filter(Boolean);
				validateParseResults("grades", raw, entries);
				return entries;
			}),
			_cachedSynthesisEntries ? Promise.resolve(_cachedSynthesisEntries) : fetchAllSearchResults(config.synthesis.menuEntryId, config.synthesis.queryId).then((raw) => {
				const entries = raw.map(parseSynthesisLine).filter(Boolean);
				validateParseResults("synthesis", raw, entries);
				return entries;
			}),
			getComponentTypes()
		]);
		const filteredGrades = rawGrades.filter((g) => {
			const parsed = parseExamCode(g.examCode);
			return parsed && parsed.year === year && parsed.semester === semester;
		});
		const filteredSynthesis = synthesisEntries.filter((e) => {
			const parsed = parseExamCode(e.examCode);
			return parsed && parsed.year === year && parsed.semester === semester;
		});
		const nameLookup = buildNameLookup(synthesisEntries);
		let gradesToBuild = filteredGrades;
		if (filteredGrades.length === 0) {
			const parents = /* @__PURE__ */ new Set();
			const candidates = filteredSynthesis.filter((e) => {
				const p = parseExamCode(e.examCode);
				return p && p.path.length >= 2;
			});
			for (const e of candidates) {
				const parts = e.examCode.split("_");
				for (let i = 1; i < parts.length; i++) parents.add(parts.slice(0, i).join("_"));
			}
			gradesToBuild = candidates.filter((e) => !parents.has(e.examCode)).map((e) => ({
				examCode: e.examCode,
				mark: null,
				coefficient: 100,
				examType: null
			}));
		}
		const marks = buildGradeTree(gradesToBuild, nameLookup, componentTypes);
		let classAverage = null;
		const promoValues = filteredSynthesis.filter((e) => e.avgPreRatt != null).map((e) => parseFloat(e.avgPreRatt)).filter((v) => !isNaN(v) && v > 0);
		if (promoValues.length > 0) classAverage = promoValues.reduce((s, v) => s + v, 0) / promoValues.length;
		return {
			classAverage,
			marks
		};
	}
	//#endregion
	//#region src/updates.js
	var UPDATE_EXPIRATION_MS = 1e3 * 60 * 60 * 24 * 7;
	function getUpdates(filters, marks) {
		const save = JSON.parse(localStorage.getItem("auriga_marks_save") || "{}");
		const updates = JSON.parse(localStorage.getItem("auriga_updates") || "{}");
		const key = JSON.stringify(filters);
		const previous = save[key];
		if (!previous) {
			save[key] = marks;
			localStorage.setItem("auriga_marks_save", JSON.stringify(save));
			return [];
		}
		if (marks.every((m) => m.subjects.every((s) => s.marks.every((mk) => mk.value === void 0)))) return [];
		let result = updates[key] || [];
		for (const module of marks) {
			const prevModule = previous.find((m) => m.name === module.name);
			if (!prevModule) continue;
			for (const subject of module.subjects) {
				const prevSubject = prevModule.subjects.find((s) => s.name === subject.name);
				if (!prevSubject) continue;
				for (const { id, name, value, classAverage } of subject.marks) {
					const prevMark = prevSubject.marks.find((m) => m.id === id && m.name === name);
					if (!prevMark) {
						if (value !== null) pushUpdate(result, subject.id, "add", id, name, value);
					} else if (prevMark.value !== value) {
						let type = "update";
						if (prevMark.value === void 0) type = "add";
						else if (value === void 0) type = "remove";
						pushUpdate(result, subject.id, type, id, name, value, prevMark.value);
					} else if (prevMark.classAverage !== classAverage) pushUpdate(result, subject.id, "average-update", id, name, classAverage, prevMark.classAverage);
				}
				for (const mark of prevSubject.marks) if (!subject.marks.find((m) => m.name === mark.name)) pushUpdate(result, subject.id, "remove", mark.id, mark.name, void 0, mark.value);
			}
		}
		result = removeExpired(result).sort((a, b) => new Date(b.date) - new Date(a.date));
		save[key] = marks;
		updates[key] = result;
		localStorage.setItem("auriga_marks_save", JSON.stringify(save));
		localStorage.setItem("auriga_updates", JSON.stringify(updates));
		return result;
	}
	/** Add or merge an update entry into the result list. */
	function pushUpdate(result, subjectId, type, id, name, value, old) {
		const existing = result.find((u) => u.subject === subjectId && u.id === id && u.name === name);
		if (existing && (existing.type === type || existing.type !== "average-update" && type !== "average-update")) {
			existing.type = type;
			existing.date = /* @__PURE__ */ new Date();
			existing.value = value;
			existing.old = old;
			return;
		}
		result.push({
			date: /* @__PURE__ */ new Date(),
			type,
			subject: subjectId,
			id,
			name,
			...value != null ? { value } : {},
			...old != null ? { old } : {}
		});
	}
	/** Remove updates older than the expiration delay. */
	function removeExpired(updates) {
		const cutoff = Date.now() - UPDATE_EXPIRATION_MS;
		return updates.filter((u) => new Date(u.date).getTime() > cutoff);
	}
	//#endregion
	//#region package.json
	var version;
	var init_package = __esmMin((() => {
		version = "1.9.7";
	}));
	//#endregion
	//#region src/app.js
	var app;
	var init_app$1 = __esmMin((() => {
		init_package();
		app = {
			name: "Infinity Auriga",
			version,
			repository: "https://github.com/KazeTachinuu/infinity-auriga",
			rawBase: "https://raw.githubusercontent.com/KazeTachinuu/infinity-auriga/master"
		};
	}));
	//#endregion
	//#region coefficients/s03_2526_fise.js
	var s03_2526_fise_exports = /* @__PURE__ */ __exportAll({
		default: () => s03_2526_fise_default,
		meta: () => meta$2
	});
	var meta$2, s03_2526_fise_default;
	var init_s03_2526_fise = __esmMin((() => {
		meta$2 = {
			semester: "S03",
			year: "2526",
			track: "FISE",
			major: null,
			name: "Formation initiale"
		};
		s03_2526_fise_default = {
			"2526_I_INF_FISE_S03_AG": 1,
			"2526_I_INF_FISE_S03_AG_ANAC": 1,
			"2526_I_INF_FISE_S03_AG_COM3": 3,
			"2526_I_INF_FISE_S03_AG_COM4": 3,
			"2526_I_INF_FISE_S03_AG_ET1": 3,
			"2526_I_INF_FISE_S03_AG_ET2": 3,
			"2526_I_INF_FISE_S03_AG_HC": 3,
			"2526_I_INF_FISE_S03_AG_LR": 3,
			"2526_I_INF_FISE_S03_CN": 1,
			"2526_I_INF_FISE_S03_CN_ELM": 1,
			"2526_I_INF_FISE_S03_CN_PC_AL": 3,
			"2526_I_INF_FISE_S03_CN_PC_ASN": 2,
			"2526_I_INF_FISE_S03_CN_PC_PSE": 2,
			"2526_I_INF_FISE_S03_CN_QUANT": 1,
			"2526_I_INF_FISE_S03_CN_THLR": 1,
			"2526_I_INF_FISE_S03_PR": 1,
			"2526_I_INF_FISE_S03_PR_AR2": 3,
			"2526_I_INF_FISE_S03_PR_BA": 3,
			"2526_I_INF_FISE_S03_PR_GM": 2,
			"2526_I_INF_FISE_S03_PR_GRAPHS": 3,
			"2526_I_INF_FISE_S03_PR_NAC": 3,
			"2526_I_INF_FISE_S03_PR_RIE_EXA": 1,
			"2526_I_INF_FISE_S03_PR_RIE_PRJ": 1,
			"2526_I_INF_FISE_S03_PR_SEM": 1
		};
	}));
	//#endregion
	//#region coefficients/s07_2526_fisa_cs.js
	var s07_2526_fisa_cs_exports = /* @__PURE__ */ __exportAll({
		default: () => s07_2526_fisa_cs_default,
		meta: () => meta$1
	});
	var meta$1, s07_2526_fisa_cs_default;
	var init_s07_2526_fisa_cs = __esmMin((() => {
		meta$1 = {
			semester: "S07",
			year: "2526",
			track: "FISA",
			major: "CS",
			name: "Cybersécurité et Systèmes"
		};
		s07_2526_fisa_cs_default = {
			"2526_I_INF_FISA_S07_AEE": 8,
			"2526_I_INF_FISA_S07_AG": 1,
			"2526_I_INF_FISA_S07_CN": 3,
			"2526_I_INF_FISA_S07_FR": 2,
			"2526_I_INF_FISA_S07_GR": 3,
			"2526_I_INF_FISA_S07_GR_WS": 2,
			"2526_I_INF_FISA_S07_PR": 3,
			"2526_I_INF_FISA_S07_PR_42SH": {
				"ects": 2,
				"module": "SAE 42SH",
				"name": "Projet Shell"
			},
			"2526_I_INF_FISA_S07_DEVSEC": 3,
			"2526_I_INF_FISA_S07_INT": 4,
			"2526_I_INF_FISA_S07_PL": 1
		};
	}));
	//#endregion
	//#region coefficients/s07_2526_fisa_dev.js
	var s07_2526_fisa_dev_exports = /* @__PURE__ */ __exportAll({
		default: () => s07_2526_fisa_dev_default,
		meta: () => meta
	});
	var meta, s07_2526_fisa_dev_default;
	var init_s07_2526_fisa_dev = __esmMin((() => {
		meta = {
			semester: "S07",
			year: "2526",
			track: "FISA",
			major: "DEV",
			name: "Développement web et nouvelles applications"
		};
		s07_2526_fisa_dev_default = {
			"2526_I_INF_FISA_S07_AEE": 8,
			"2526_I_INF_FISA_S07_AG": 1,
			"2526_I_INF_FISA_S07_CN": 1,
			"2526_I_INF_FISA_S07_FR": 2,
			"2526_I_INF_FISA_S07_GR": 3,
			"2526_I_INF_FISA_S07_PR": 3,
			"2526_I_INF_FISA_S07_PR_42SH": {
				"ects": 2,
				"module": "SAE 42SH",
				"name": "Projet Shell"
			},
			"2526_I_INF_FISA_S07_DEVSEC": 3,
			"2526_I_INF_FISA_S07_INT": 4,
			"2526_I_INF_FISA_S07_PL": 1,
			"2526_I_INF_FISA_S07_CI": 2,
			"2526_I_INF_FISA_S07_DEV_CI_BADG1_EX": 2,
			"2526_I_INF_FISA_S07_OC": 3,
			"2526_I_INF_FISA_S07_DEV_OC_PPAR_EX": 2,
			"2526_I_INF_FISA_S07_WMM": 9,
			"2526_I_INF_FISA_S07_DEV_WMM_AWEB_EX": 3,
			"2526_I_INF_FISA_S07_DEV_WMM_IANDO_EX": 1.5,
			"2526_I_INF_FISA_S07_DEV_WMM_IJST_EX": 1.5,
			"2526_I_INF_FISA_S07_DEV_WMM_J2E_EX": .75,
			"2526_I_INF_FISA_S07_DEV_WMM_J2E_PROJET": 2.25,
			"2526_I_INF_FISA_S07_WEB1": 3
		};
	}));
	//#endregion
	//#region src/coefficients/index.js
	init_app$1();
	var CDN_BASE = `${app.rawBase}/coefficients`;
	/** Bundled coefficients as fallback when CDN is unreachable. */
	var bundled = /* @__PURE__ */ Object.assign({
		"../../coefficients/s03_2526_fise.js": () => Promise.resolve().then(() => (init_s03_2526_fise(), s03_2526_fise_exports)),
		"../../coefficients/s07_2526_fisa_cs.js": () => Promise.resolve().then(() => (init_s07_2526_fisa_cs(), s07_2526_fisa_cs_exports)),
		"../../coefficients/s07_2526_fisa_dev.js": () => Promise.resolve().then(() => (init_s07_2526_fisa_dev(), s07_2526_fisa_dev_exports))
	});
	/** Parse filename: s07_2526_fisa_cs.js → { semester, year, track, major } */
	function parseFilename(path) {
		const parts = path.replace(/^.*\//, "").replace(".js", "").split("_");
		if (parts.length < 3) return null;
		return {
			semester: parts[0].toUpperCase(),
			year: parts[1],
			track: parts[2].toUpperCase(),
			major: parts[3]?.toUpperCase() || null
		};
	}
	/** Parse raw JS module text into { meta, default } without eval. */
	function parseModuleText(text) {
		const clean = text.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
		const extractObject = (prefix) => {
			const idx = clean.indexOf(prefix);
			if (idx === -1) return null;
			const start = clean.indexOf("{", idx);
			if (start === -1) return null;
			let depth = 0, end = start;
			for (; end < clean.length; end++) if (clean[end] === "{") depth++;
			else if (clean[end] === "}") {
				depth--;
				if (depth === 0) break;
			}
			const raw = clean.slice(start, end + 1).replace(/'/g, "\"").replace(/(\w+)\s*:/g, "\"$1\":").replace(/,\s*([}\]])/g, "$1");
			return JSON.parse(raw);
		};
		return {
			meta: extractObject("const meta"),
			default: extractObject("export default")
		};
	}
	/** Build the expected filename for a semester/track/major combo. */
	function buildFilename(semester, year, track, major) {
		const parts = [
			semester.toLowerCase(),
			year,
			track.toLowerCase()
		];
		if (major) parts.push(major.toLowerCase());
		return parts.join("_") + ".js";
	}
	/** Try fetching a coefficient file from jsDelivr CDN. */
	async function fetchRemote(filename) {
		const url = `${CDN_BASE}/${filename}`;
		const res = await fetch(url, { cache: "no-cache" });
		if (!res.ok) return null;
		return parseModuleText(await res.text());
	}
	/** Try loading from bundled import.meta.glob. */
	async function loadBundled(semester, year, track, wantMajor) {
		const hit = Object.entries(bundled).find(([path]) => {
			const f = parseFilename(path);
			if (!f) return false;
			return f.semester === semester && f.year === year && f.track === track && (wantMajor ? f.major?.toLowerCase() === wantMajor : !f.major);
		});
		if (!hit) return null;
		const mod = await hit[1]();
		return {
			meta: mod.meta,
			default: mod.default,
			file: hit[0].replace(/^.*\//, "")
		};
	}
	/** Load coefficients for a semester/track/major. Tries CDN first, falls back to bundled. */
	async function loadCoefficients(semesterKey, track, major = null) {
		const [semester, year] = semesterKey.split("_");
		const passes = major ? [major.toLowerCase(), null] : [null];
		for (const wantMajor of passes) {
			const filename = buildFilename(semester, year, track, wantMajor);
			try {
				const mod = await fetchRemote(filename);
				if (mod?.meta && mod.default) {
					const { meta } = mod;
					if (meta.semester?.toUpperCase() === semester && meta.year === year && meta.track?.toUpperCase() === track && (wantMajor ? meta.major?.toLowerCase() === wantMajor : !meta.major)) {
						console.log(`[Infinity] Loaded coefficients from CDN: ${filename}`);
						return {
							overrides: new Map(Object.entries(mod.default)),
							file: filename,
							meta
						};
					}
				}
			} catch {}
			const local = await loadBundled(semester, year, track, wantMajor);
			if (local?.meta) {
				const { meta } = local;
				if (meta.semester?.toUpperCase() === semester && meta.year === year && meta.track?.toUpperCase() === track && (wantMajor ? meta.major?.toLowerCase() === wantMajor : !meta.major)) {
					console.log(`[Infinity] Loaded coefficients from bundle: ${local.file}`);
					return {
						overrides: new Map(Object.entries(local.default)),
						file: local.file,
						meta
					};
				}
			}
		}
		return null;
	}
	/** Generate a pre-filled template from the grade tree for contributors. */
	function generateTemplate(marks, semesterKey, track, major = null, overrides = null) {
		const [semester, year] = semesterKey.split("_");
		const filename = `${semesterKey}_${track}${major ? `_${major}` : ""}`.toLowerCase() + ".js";
		const yearLabel = `20${year.slice(0, 2)}/20${year.slice(2)}`;
		const majorLabel = major ? ` [${major.toUpperCase()}]` : "";
		const allCodes = marks.flatMap((mod) => [mod._code, ...mod.subjects.map((s) => s._code)]);
		const maxLen = Math.max(...allCodes.map((c) => c.length));
		const lines = [
			`/**`,
			` * Coefficients — ${semester} ${track}${majorLabel} ${yearLabel}`,
			` * Filename: ${filename}`,
			` */`,
			`export const meta = {`,
			`    semester: '${semester}',`,
			`    year: '${year}',`,
			`    track: '${track}',`,
			...major ? [`    major: '${major.toUpperCase()}',`] : [`    major: null,`],
			`    name: '',  // TODO: fill in display name`,
			`};`,
			``,
			`export default {`
		];
		const modsWithMarks = marks.filter((m) => m.subjects.some((s) => s.marks.length > 0));
		for (let i = 0; i < modsWithMarks.length; i++) {
			const mod = modsWithMarks[i];
			const rawCoef = overrides?.get(mod._code) ?? 1;
			const coef = typeof rawCoef === "object" ? JSON.stringify(rawCoef) : rawCoef;
			const pad = " ".repeat(Math.max(1, maxLen - mod._code.length));
			lines.push(`    '${mod._code}': ${coef},${pad} // ${mod.name}`);
			if (mod.subjects.length > 1) {
				if (!mod.subjects.some((s) => overrides?.has(s._code))) lines.push(`    // Uncomment below to override individual subjects:`);
				for (const sub of mod.subjects) {
					const raw = overrides?.get(sub._code);
					const subPad = " ".repeat(Math.max(1, maxLen - sub._code.length));
					if (raw != null) {
						const val = typeof raw === "object" ? JSON.stringify(raw) : raw;
						lines.push(`    '${sub._code}': ${val},${subPad} // └ ${sub.name || sub.id}`);
					} else lines.push(`    // '${sub._code}': ?,${subPad} // └ ${sub.name || sub.id}`);
				}
			}
			if (i < modsWithMarks.length - 1) lines.push("");
		}
		lines.push(`};`, "");
		return {
			filename,
			content: lines.join("\n")
		};
	}
	/** Apply coefficient overrides and compute all averages (mutates marks in place). */
	function applyCoefficients(marks, overrides) {
		function applyOverride(node) {
			if (!overrides?.has(node._code)) return;
			const val = overrides.get(node._code);
			if (typeof val === "object" && val !== null) {
				node.coefficient = val.ects;
				if (val.name) node.name = val.name;
				if (val.module) node._promoteTo = val.module;
			} else node.coefficient = val;
			node._overridden = true;
		}
		function normalize(node) {
			applyOverride(node);
			if (!node.coefficient || node.coefficient === 100) node.coefficient = 1;
		}
		for (const mod of marks) {
			normalize(mod);
			for (const sub of mod.subjects) {
				normalize(sub);
				for (const mark of sub.marks) normalize(mark);
			}
		}
		const promoted = /* @__PURE__ */ new Map();
		for (const mod of marks) {
			const detached = mod.subjects.filter((s) => s._promoteTo);
			if (!detached.length) continue;
			mod.subjects = mod.subjects.filter((s) => !s._promoteTo);
			for (const sub of detached) if (promoted.has(sub._promoteTo)) promoted.get(sub._promoteTo).subjects.push(sub);
			else {
				const newMod = {
					id: sub.id,
					_code: sub._code,
					name: sub._promoteTo,
					average: null,
					classAverage: sub.classAverage,
					coefficient: sub.coefficient,
					_overridden: true,
					subjects: [sub]
				};
				promoted.set(sub._promoteTo, newMod);
				marks.push(newMod);
			}
		}
		for (const mod of marks) {
			const hasOverrides = mod.subjects.some((s) => s._overridden);
			for (const sub of mod.subjects) {
				const ratt = sub.marks.find((m) => m._code?.endsWith("_RATT") && m.value != null && m.value !== .01);
				if (ratt) {
					sub.average = ratt.value;
					sub._ratt = true;
					for (const mark of sub.marks) {
						mark._rawCoefficient = mark.coefficient;
						mark.coefficient = mark === ratt ? 1 : 0;
					}
				} else {
					let subTotal = 0, subWeight = 0;
					for (const mark of sub.marks) if (mark.value != null && mark.value !== .01) {
						subTotal += mark.value * mark.coefficient;
						subWeight += mark.coefficient;
					}
					sub.average = subWeight > 0 ? subTotal / subWeight : null;
					if (!sub._overridden && !hasOverrides) sub.coefficient = subWeight || 1;
					if (subWeight > 0) for (const mark of sub.marks) {
						mark._rawCoefficient = mark.coefficient;
						mark.coefficient /= subWeight;
					}
				}
			}
			let modTotal = 0, modWeight = 0;
			for (const sub of mod.subjects) if (sub.average != null) {
				modTotal += sub.average * sub.coefficient;
				modWeight += sub.coefficient;
			}
			mod.average = modWeight > 0 ? modTotal / modWeight : null;
			if (!mod._overridden) mod.coefficient = modWeight || 1;
		}
		let totalSum = 0, totalWeight = 0;
		for (const mod of marks) if (mod.average != null) {
			totalSum += mod.average * mod.coefficient;
			totalWeight += mod.coefficient;
		}
		return { average: totalWeight > 0 ? totalSum / totalWeight : null };
	}
	//#endregion
	//#region src/session.js
	var FILTERS_KEY = "auriga_filters";
	/** Detect track (e.g. "FISA") from grade codes. */
	function detectTrack(marks) {
		return (marks.flatMap((m) => m.subjects.flatMap((s) => s.marks)).find((m) => m._code)?._code)?.split("_")[3] ?? null;
	}
	/**
	* Detect major (e.g. "cs") from the transparent prefix in grade codes.
	* After buildGradeTree, the transparent prefix (CS, DEV, ...) is stripped
	* from module IDs but still present in raw mark codes. If mark._code has a
	* path segment that doesn't match its module ID, that segment is the major.
	*/
	function detectMajor(marks) {
		for (const mod of marks) for (const sub of mod.subjects) for (const mark of sub.marks) {
			const parts = mark._code.split("_");
			if (parts.length < 7) continue;
			const afterSem = parts[5];
			if (afterSem !== mod.id) return afterSem.toLowerCase();
		}
		return null;
	}
	/** Load coefficients + generate template for a given marks tree. */
	async function loadCoeffData(marks, filtersValues) {
		const track = detectTrack(marks);
		if (!track) return {
			coeffData: null,
			coeffTemplate: null
		};
		const major = detectMajor(marks);
		const coeffData = await loadCoefficients(filtersValues.semester, track, major);
		return {
			coeffData,
			coeffTemplate: generateTemplate(marks, filtersValues.semester, track, major, coeffData?.overrides ?? null)
		};
	}
	/** Load initial session: user name, available filters, last selection. */
	async function loadSession(status) {
		status?.step("Récupération du profil...");
		const name = await getName().catch(() => "Etudiant");
		status?.step("Récupération des filtres...");
		const filters = await getMarksFilters();
		const saved = localStorage.getItem(FILTERS_KEY);
		return {
			name,
			filters,
			filtersValues: saved ? JSON.parse(saved) : filters[0]?.values.length > 0 ? { semester: filters[0].values[0].value } : {}
		};
	}
	/** Fetch marks, apply coefficient overrides, and compute updates. */
	async function fetchMarksAndUpdates(filtersValues, status) {
		status?.step("Récupération des notes...");
		const { marks, classAverage } = await getMarks(filtersValues);
		status?.step("Application des coefficients...");
		const { coeffData, coeffTemplate } = await loadCoeffData(marks, filtersValues);
		const { average } = applyCoefficients(marks, coeffData?.overrides ?? null);
		status?.step("Calcul des changements...");
		const updates = getUpdates(filtersValues, marks);
		return {
			marks,
			averages: {
				student: average,
				promo: classAverage
			},
			updates,
			coeffSource: coeffData?.file ?? null,
			coeffMeta: coeffData?.meta ?? null,
			coeffTemplate
		};
	}
	/** Load marks from localStorage cache, or null if no cache exists. */
	async function loadCachedMarks(filtersValues) {
		const save = JSON.parse(localStorage.getItem("auriga_marks_save") || "{}");
		const key = JSON.stringify(filtersValues);
		const marks = save[key];
		if (!marks || marks.length === 0) return null;
		const { coeffData, coeffTemplate } = await loadCoeffData(marks, filtersValues);
		const { average } = applyCoefficients(marks, coeffData?.overrides ?? null);
		const updates = JSON.parse(localStorage.getItem("auriga_updates") || "{}");
		return {
			marks,
			averages: {
				student: average,
				promo: null
			},
			updates: updates[key] || [],
			coeffSource: coeffData?.file ?? null,
			coeffMeta: coeffData?.meta ?? null,
			coeffTemplate
		};
	}
	/** Load saved semester filter from localStorage. */
	function loadSavedFilters() {
		const saved = localStorage.getItem(FILTERS_KEY);
		return saved ? JSON.parse(saved) : {};
	}
	/** Persist semester selection to localStorage. */
	function saveSemesterFilter(value) {
		const filtersValues = { semester: value };
		localStorage.setItem(FILTERS_KEY, JSON.stringify(filtersValues));
		return filtersValues;
	}
	//#endregion
	//#region src/assets/images/top_triangle.svg?raw
	var top_triangle_default;
	var init_top_triangle = __esmMin((() => {
		top_triangle_default = "<svg width=\"517\" height=\"402\" viewBox=\"0 0 517 402\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"a\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(-357.189,-156.656,156.656,-357.189,499.959,834.755)\"><stop offset=\"0\" stop-color=\"rgb(49,66,222)\"/><stop offset=\"1\" stop-color=\"rgb(20,12,124)\"/></linearGradient><linearGradient id=\"b\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(-124.762,-268.039,308.094,-108.541,505.5,838.787)\"><stop offset=\"0\" stop-color=\"rgb(50,71,255)\"/><stop offset=\"1\" stop-color=\"rgb(22,11,168)\"/></linearGradient></defs><path d=\"M622.959,432.755L499.959,834.755L105.994,696.755Z\" transform=\"translate(-105.994,-432.755)\" fill=\"url(#a)\"/><path d=\"M492.461,816.973L615.828,466.193L168.497,665.143Z\" transform=\"matrix(0.997024,0,0,1.14602,-97.0293,-534.265)\" fill=\"url(#b)\"/></svg>\n";
	}));
	//#endregion
	//#region src/assets/images/bottom_triangle.svg?raw
	var bottom_triangle_default;
	var init_bottom_triangle = __esmMin((() => {
		bottom_triangle_default = "<svg width=\"676\" height=\"303\" viewBox=\"0 0 676 303\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"a\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(-269,316.5,-316.5,-269,1754,593.5)\"><stop offset=\"0\" stop-color=\"rgb(49,66,222)\"/><stop offset=\"1\" stop-color=\"rgb(20,12,124)\"/></linearGradient><linearGradient id=\"b\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"matrix(41.8528,307.949,-307.949,41.8528,1782,653)\"><stop offset=\"0\" stop-color=\"rgb(50,71,255)\"/><stop offset=\"1\" stop-color=\"rgb(22,11,168)\"/></linearGradient></defs><path d=\"M1741.5,614L2111,854L1435,917Z\" transform=\"translate(-1435,-614)\" fill=\"url(#a)\"/><path d=\"M1786.5,690L2156,930L1555,986Z\" transform=\"translate(-1480,-690)\" fill=\"url(#b)\"/></svg>\n";
	}));
	//#endregion
	//#region src/assets/images/logo.svg?raw
	var logo_default;
	var init_logo = __esmMin((() => {
		logo_default = "<svg viewBox=\"0 0 300 100\" xmlns=\"http://www.w3.org/2000/svg\">\n  <text x=\"0\" y=\"38\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,sans-serif\" font-size=\"26\" font-weight=\"500\" fill=\"#343D55\">Infinity</text>\n  <text x=\"0\" y=\"92\" font-family=\"system-ui,-apple-system,'Segoe UI',Roboto,sans-serif\" font-size=\"52\" font-weight=\"bold\" fill=\"#151925\" letter-spacing=\"2\">AURIGA</text>\n</svg>\n";
	}));
	//#endregion
	//#region src/assets/images/spinner.svg?raw
	var spinner_default;
	var init_spinner = __esmMin((() => {
		spinner_default = "<svg width=\"100%\" height=\"100%\" viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M139.5,34C139.5,31.239 137.261,29 134.5,29C77.339,29 31,75.339 31,132.5C31,189.623 77.377,236 134.5,236C191.623,236 238,189.623 238,132.5C238,105.05 227.096,78.724 207.686,59.314C205.733,57.362 202.567,57.362 200.614,59.314L199.918,60.011C197.965,61.964 197.965,65.129 199.918,67.082C217.268,84.432 227.015,107.963 227.015,132.5C227.015,183.56 185.56,225.015 134.5,225.015C83.44,225.015 41.985,183.56 41.985,132.5C41.985,81.405 83.405,39.985 134.5,39.985C137.261,39.985 139.5,37.746 139.5,34.985Z\" transform=\"translate(-6.5,-4.5)\" fill=\"#151925\"/></svg>\n";
	}));
	//#endregion
	//#region src/assets/images/combo_box_arrow.svg?raw
	var combo_box_arrow_default;
	var init_combo_box_arrow = __esmMin((() => {
		combo_box_arrow_default = "<svg width=\"21\" height=\"13\" viewBox=\"0 0 21 13\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"#979797\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M1.529 2L9.822 10.293a1 1 0 001.414 0L15.529 2\"/></svg>\n";
	}));
	//#endregion
	//#region src/assets/images/update_arrow.svg?raw
	var update_arrow_default;
	var init_update_arrow = __esmMin((() => {
		update_arrow_default = "<svg width=\"40\" height=\"21\" viewBox=\"0 0 40 21\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"#A5A9B5\" stroke-width=\"3\" stroke-linecap=\"round\"><line x1=\"0\" y1=\"10.5\" x2=\"30\" y2=\"10.5\"/><polyline points=\"21,19 30,10.5 21,2\"/></svg>\n";
	}));
	//#endregion
	//#region src/assets/images/increase_arrow.svg?raw
	var increase_arrow_default;
	var init_increase_arrow = __esmMin((() => {
		increase_arrow_default = "<svg width=\"29\" height=\"29\" viewBox=\"0 0 29 29\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"#44B728\" stroke-width=\"3\" stroke-linecap=\"round\"><line x1=\"0\" y1=\"20\" x2=\"24\" y2=\"8\"/><polyline points=\"15,3 24,8 19,17\"/></svg>\n";
	}));
	//#endregion
	//#region src/assets/images/decrease_arrow.svg?raw
	var decrease_arrow_default;
	var init_decrease_arrow = __esmMin((() => {
		decrease_arrow_default = "<svg width=\"29\" height=\"29\" viewBox=\"0 0 29 29\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"#D52121\" stroke-width=\"3\" stroke-linecap=\"round\"><line x1=\"0\" y1=\"8\" x2=\"24\" y2=\"20\"/><polyline points=\"15,26 24,20 19,11\"/></svg>\n";
	}));
	//#endregion
	//#region src/assets/images/plus.svg?raw
	var plus_default;
	var init_plus = __esmMin((() => {
		plus_default = "<svg width=\"29\" height=\"29\" viewBox=\"0 0 29 29\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"#44B728\" stroke-width=\"3\" stroke-linecap=\"round\"><line x1=\"14.5\" y1=\"2\" x2=\"14.5\" y2=\"27\"/><line x1=\"2\" y1=\"14.5\" x2=\"27\" y2=\"14.5\"/></svg>\n";
	}));
	//#endregion
	//#region src/assets/images/minus.svg?raw
	var minus_default;
	var init_minus = __esmMin((() => {
		minus_default = "<svg width=\"29\" height=\"4\" viewBox=\"0 0 29 4\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"#D52121\" stroke-width=\"3\" stroke-linecap=\"round\"><line x1=\"2\" y1=\"2\" x2=\"27\" y2=\"2\"/></svg>\n";
	}));
	//#endregion
	//#region src/render/dom.js
	function h(tag, attrs = {}, ...children) {
		const el = document.createElement(tag);
		for (const [k, v] of Object.entries(attrs)) if (k === "class") el.className = v;
		else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
		else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
		else el.setAttribute(k, v);
		for (const c of children.flat()) {
			if (c == null) continue;
			el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
		}
		return el;
	}
	/**
	* Create an element and set its innerHTML to a trusted build-time SVG string.
	* Only use with Vite ?raw imports — never with user-supplied content.
	*/
	function html(tag, attrs, trustedSvg) {
		const el = h(tag, attrs);
		el.innerHTML = trustedSvg;
		return el;
	}
	function gradeColor(value) {
		if (value === .01) return "#666670";
		if (value == null) return "auto";
		const yellow = [
			255,
			206,
			40
		];
		let v = value;
		const min = v >= 10 ? yellow : [
			227,
			14,
			14
		];
		const max = v < 10 ? yellow : [
			68,
			183,
			50
		];
		if (v >= 10) v -= 10;
		let result = "#";
		for (let i = 0; i < 3; i++) result += Math.round(min[i] + (max[i] - min[i]) * (v / 10)).toString(16).padStart(2, "0");
		return result;
	}
	function formatGrade(value) {
		if (value === .01) return "Abs.";
		if (value !== 0 && !value) return "--,--";
		return value.toFixed(2).replace(".", ",");
	}
	function gradeSpan(value) {
		return h("span", {
			class: "value",
			style: { color: gradeColor(value) }
		}, formatGrade(value));
	}
	function signSvg(type, value, old) {
		switch (type) {
			case "average-update":
			case "update": return value > old ? increase_arrow_default : decrease_arrow_default;
			case "add": return plus_default;
			case "remove": return minus_default;
		}
	}
	function hasEqualCoefficients(subject) {
		return subject.marks.every((m) => m.coefficient === subject.marks[0].coefficient);
	}
	var init_dom = __esmMin((() => {
		init_top_triangle();
		init_bottom_triangle();
		init_logo();
		init_spinner();
		init_combo_box_arrow();
		init_update_arrow();
		init_increase_arrow();
		init_decrease_arrow();
		init_plus();
		init_minus();
	}));
	//#endregion
	//#region src/render/tooltip.js
	function showTooltip(anchor, text, type) {
		if (!_tooltip) {
			_tooltip = h("div", { class: "code-tooltip" });
			document.body.appendChild(_tooltip);
		}
		_tooltip.textContent = text;
		_tooltip.className = "code-tooltip " + (type || "");
		_tooltip.style.opacity = "1";
		const rect = anchor.getBoundingClientRect();
		_tooltip.style.left = rect.left + "px";
		_tooltip.style.top = rect.top - _tooltip.offsetHeight - 6 + "px";
		const tipRect = _tooltip.getBoundingClientRect();
		if (tipRect.right > window.innerWidth - 8) _tooltip.style.left = window.innerWidth - 8 - tipRect.width + "px";
	}
	function hideTooltip() {
		if (_tooltip) _tooltip.style.opacity = "0";
	}
	function copyCodeEl(code, label) {
		if (!code) return h("span", {}, label);
		let copyTimeout = null;
		const el = h("span", {
			class: "copy-code clickable",
			onmouseenter: () => {
				if (!copyTimeout) showTooltip(el, code);
			},
			onmouseleave: () => {
				if (!copyTimeout) hideTooltip();
			},
			onclick: () => {
				navigator.clipboard.writeText(code);
				showTooltip(el, "Copié !", "copied");
				clearTimeout(copyTimeout);
				copyTimeout = setTimeout(() => {
					copyTimeout = null;
					hideTooltip();
				}, 1200);
			}
		}, label);
		return el;
	}
	var _tooltip;
	var init_tooltip = __esmMin((() => {
		init_dom();
		_tooltip = null;
	}));
	//#endregion
	//#region src/render/components.js
	function renderComboBox(name, values, currentValue, onUpdate) {
		const wrapper = h("div", { class: "combo-box" });
		const selected = (values.find((v) => v.value === currentValue) || { name: "..." }).name;
		const box = h("div", { class: "box clickable" });
		const setBoxContent = (text) => {
			box.textContent = "";
			box.append(text + " ");
			const arrow = html("span", {}, combo_box_arrow_default);
			box.appendChild(arrow.firstElementChild || arrow);
		};
		setBoxContent(selected);
		let opened = false;
		let choicesEl = null;
		const close = () => {
			opened = false;
			box.classList.remove("opened");
			choicesEl?.remove();
			choicesEl = null;
		};
		box.addEventListener("click", () => {
			if (opened) return close();
			opened = true;
			box.classList.add("opened");
			choicesEl = h("div", { class: "choices card" }, ...values.map((choice) => h("div", {
				class: "choice clickable opaque",
				onclick: () => {
					close();
					setBoxContent(choice.name);
					onUpdate(choice);
				}
			}, choice.name)));
			wrapper.appendChild(choicesEl);
		});
		document.addEventListener("click", (e) => {
			if (opened && !wrapper.contains(e.target)) close();
		});
		wrapper.append(h("span", { class: "name" }, name), box);
		return wrapper;
	}
	function renderUpdate(upd) {
		const hasValue = upd.value === 0 || upd.value;
		const hasOld = upd.old === 0 || upd.old;
		const displayValue = hasValue ? upd.value : upd.old;
		const targetLabel = upd.type.includes("average") ? "moyenne" : "note";
		const sign = signSvg(upd.type, upd.value, upd.old);
		return h("div", { class: "update" }, h("div", { class: "point big" }), h("div", { class: "top" }, h("div", { class: "id" }, upd.subject), h("div", { class: "dash" }, "-"), h("div", { class: "name" }, upd.name + "\xA0", html("span", { class: "target" }, `\u00b7\u00a0 ${targetLabel}`))), h("div", { class: "mark" }, h("div", { class: "point" }), ...hasValue && hasOld ? [h("div", { class: "from" }, formatGrade(upd.old)), html("div", { class: "update-arrow" }, update_arrow_default)] : [], h("div", { class: "to" }, gradeSpan(displayValue), "\xA0/ 20"), ...sign ? [html("div", { class: "type-sign" }, sign)] : []));
	}
	function renderSubject(subject, moduleId) {
		const rawCode = (subject.id.startsWith(moduleId + "_") ? subject.id.slice(moduleId.length + 1) : subject.id).replace(/_/g, " ");
		const fullName = subject.name !== subject.id.replace(/_/g, " ") ? subject.name : null;
		const useNameAsLabel = fullName && rawCode.length < 5 && fullName.length <= 16;
		const codeLabel = useNameAsLabel ? fullName : rawCode;
		const metaParts = [];
		if (subject.classAverage != null) metaParts.push(`promo: ${formatGrade(subject.classAverage)}`);
		if (!subject._overridden && subject.coefficient != null && subject.coefficient !== 1) metaParts.push(`coeff. ${formatGrade(subject.coefficient)}`);
		const bottomChildren = [h("div", { class: "average" }, gradeSpan(subject.average), "\xA0/ 20")];
		if (metaParts.length || subject._overridden) {
			const metaChildren = [];
			if (metaParts.length) metaChildren.push(`(${metaParts.join(", ")})`);
			if (subject._overridden) metaChildren.push(h("span", { class: "coeff-badge coef" }, `coef. ${subject.coefficient}`));
			bottomChildren.push(h("div", { class: "class-average" }, ...metaChildren));
		}
		const info = h("div", { class: "info" }, h("div", { class: "top" }, h("div", { class: "id" }, copyCodeEl(subject._code, codeLabel))), h("div", { class: "bottom" }, ...bottomChildren), h("hr", { class: "bottom-line" }));
		function renderMark(mark) {
			const meta = [];
			if (mark.classAverage != null) meta.push(`moyenne: ${formatGrade(mark.classAverage)}`);
			if (!hasEqualCoefficients(subject) && !mark._overridden) meta.push(`${Math.round(mark.coefficient * 100)}%`);
			const hasOverride = mark._overridden && mark._rawCoefficient != null;
			let markName = mark.name;
			const prefix = mark._group || fullName;
			if (prefix) {
				if (markName.startsWith(prefix + " - ")) markName = markName.slice(prefix.length + 3);
				else if (markName.startsWith(prefix + " ")) markName = markName.slice(prefix.length + 1);
			}
			const markChildren = [h("div", { class: "point" }), h("div", { class: "line" }, h("div", { class: "name" }, copyCodeEl(mark._code, markName)), "\xA0:\xA0", h("div", { class: "value" }, h("span", {
				class: "itself",
				style: { color: gradeColor(mark.value) }
			}, formatGrade(mark.value)), "\xA0/ 20"))];
			if (meta.length || hasOverride) {
				const metaChildren = [];
				if (meta.length) metaChildren.push(h("span", { class: "parenthesis" }, "("), meta.join(", "), h("span", { class: "parenthesis" }, ")"));
				if (hasOverride) metaChildren.push(h("span", { class: "coeff-badge coef" }, `coef. ${mark._rawCoefficient}`));
				markChildren.push(h("div", { class: "class-average" }, ...metaChildren));
			}
			return h("div", { class: "mark" }, ...markChildren);
		}
		const marksContent = [];
		let lastGroup = null;
		for (const mark of subject.marks) {
			if (mark._group && mark._group !== lastGroup) {
				marksContent.push(h("div", { class: "marks-title" }, mark._group));
				lastGroup = mark._group;
			}
			marksContent.push(renderMark(mark));
		}
		return h("div", { class: "subject card" }, info, subject.marks.length === 0 ? h("div", { class: "no-marks" }, "Aucune note") : h("div", { class: "marks" }, ...fullName && !useNameAsLabel && !lastGroup ? [h("div", { class: "marks-title" }, fullName)] : [], ...marksContent));
	}
	function renderFooter() {
		const resetLink = h("a", {
			href: "#",
			onclick: (e) => {
				e.preventDefault();
				localStorage.clear();
				window.location.reload();
			}
		}, "Reset");
		return h("div", { id: "footer" }, h("div", { id: "links" }, h("a", {
			href: "#",
			onclick: (e) => {
				e.preventDefault();
				window.print();
			}
		}, "Exporter PDF"), "\xA0·\xA0", h("a", {
			href: `${app.repository}/tree/master/coefficients`,
			target: "_blank"
		}, "Coefficients"), "\xA0·\xA0", h("a", {
			href: app.repository,
			target: "_blank"
		}, "Sources"), "\xA0·\xA0", resetLink), h("p", { class: "subtext" }, h("span", {}, `${app.name} v${app.version} \u00a9 ${(/* @__PURE__ */ new Date()).getFullYear()} KazeTachinuu`), h("br"), h("span", {}, "Licensed under "), h("a", {
			class: "link colored",
			href: `${app.repository}/blob/master/LICENSE`,
			target: "_blank"
		}, "MIT License")));
	}
	var init_components = __esmMin((() => {
		init_app$1();
		init_dom();
		init_tooltip();
	}));
	//#endregion
	//#region src/i18n.js
	/** Resolve a dotted key against an explicit language; falls back to the key on miss. */
	function tFor(lang, key, ...args) {
		const root = dict[lang] || dict[currentLang];
		const node = key.split(".").reduce((o, k) => o == null ? o : o[k], root);
		if (node == null) return key;
		return typeof node === "function" ? node(...args) : node;
	}
	/** Resolve a dotted key against the current language; falls back to the key on miss. */
	function t(key, ...args) {
		return tFor(currentLang, key, ...args);
	}
	function setLang(lang) {
		if (!dict[lang] || lang === currentLang) return;
		currentLang = lang;
		if (hasLocalStorage) try {
			localStorage.setItem(STORAGE_KEY, lang);
		} catch {}
		if (hasDocument) try {
			document.documentElement.setAttribute("lang", lang);
		} catch {}
		subscribers.forEach((fn) => {
			try {
				fn(lang);
			} catch (e) {
				console.error("[i18n] subscriber error:", e);
			}
		});
	}
	var dict, STORAGE_KEY, hasLocalStorage, hasNavigator, hasDocument, currentLang, subscribers, getLang, availableLangs;
	var init_i18n = __esmMin((() => {
		dict = {
			fr: {
				header: {
					logout: "Se deconnecter",
					exportFr: "PDF",
					exportEn: "PDF EN"
				},
				sidebar: {
					changes: "Derniers changements",
					noChanges: "Aucun changement depuis votre derniere visite.",
					averages: "Moyennes",
					promotion: "Promotion"
				},
				filters: {
					semester: "Semestre",
					semesterValue: (n, y1, y2) => `Semestre ${n} - ${y1}/${y2}`
				},
				badges: {
					coef: (n) => `coef. ${n}`,
					ects: (n) => `${n} ECTS`,
					promoMeta: (g) => `promo: ${g}`,
					coeffMeta: (g) => `coeff. ${g}`,
					avgMeta: (g) => `moyenne: ${g}`
				},
				update: {
					average: "moyenne",
					mark: "note"
				},
				marks: { none: "Aucune note" },
				coeff: {
					corrected: "Coefficients corrigés par la communauté",
					uncorrected: "Coefficients non corrigés ",
					uncorrectedHint: "(Auriga les considère tous égaux)",
					viewSource: "Voir la source",
					copyCodes: "Copier les codes",
					copied: "Copié !"
				},
				empty: { hint: "Les notes seront disponibles ici une fois la connexion rétablie." },
				errors: {
					title: "Oups, quelque chose a cassé",
					menuChanged: "Le format du menu Auriga a peut-être changé. ",
					apiDown: "Le serveur Auriga ne répond pas correctement. ",
					sessionExpired: "Votre session a expiré. ",
					formatChanged: "Le format des données Auriga a changé. ",
					cachedSuffix: "Vos notes en cache sont affichées à droite, mais elles peuvent être obsolètes.",
					retrySuffix: "Essayez de recharger la page. Si le problème persiste, signalez-le.",
					reload: "Recharger",
					report: "Signaler",
					resetCache: "Reset cache",
					noCachedTitle: "Aucune note en cache",
					issueTitlePrefix: "Erreur: ",
					issueBodyError: "## Erreur",
					issueBodyContext: "## Contexte"
				},
				coeff2: { contribute: "Contribuer" },
				footer: {
					exportPdf: "Exporter PDF",
					coefficients: "Coefficients",
					sources: "Sources",
					reset: "Reset",
					licensed: "Licensed under "
				},
				loading: {
					initial: "Chargement...",
					student: "Etudiant",
					profile: "Récupération du profil...",
					filters: "Récupération des filtres...",
					grades: "Récupération des notes...",
					coefficients: "Application des coefficients...",
					changes: "Calcul des changements...",
					quotes: [
						"Auriga va moins vite que votre grand-mère...",
						"On négocie avec le serveur...",
						"Pendant ce temps, les profs corrigent vos copies...",
						"Chargement plus rapide qu'un rendu de projet EPITA...",
						"Patience, même Auriga a besoin de café le matin...",
						"Calcul de votre moyenne... priez.",
						"On hack le système pour vous (légalement)...",
						"Les notes arrivent... comme les bus, par paquets.",
						"Optimisation en cours... contrairement à votre code.",
						"Bientôt prêt, promis (pas comme vos deadlines)."
					]
				},
				print: {
					cycleYear: (track, year) => `Cycle ${track} — Année universitaire : ${year}`,
					bulletin: (semNum) => `Bulletin du Semestre ${semNum}`,
					colSemester: (semNum) => `Semestre ${semNum}`,
					colEcts: "ECTS ACQUIS",
					colAvgPromoL1: "Moyenne",
					colAvgPromoL2: "Promotion",
					colAvgStudentL1: "Moyenne",
					colAvgStudentL2: "Étudiant",
					overallAvg: "MOYENNE GÉNÉRALE",
					footer: (version) => `Exporté depuis Infinity Auriga v${version} — ${(/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", {
						day: "numeric",
						month: "long",
						year: "numeric"
					})}`,
					filenameBase: "Bulletin"
				}
			},
			en: {
				header: {
					logout: "Log out",
					exportFr: "PDF",
					exportEn: "PDF EN"
				},
				sidebar: {
					changes: "Recent changes",
					noChanges: "No changes since your last visit.",
					averages: "Averages",
					promotion: "Class"
				},
				filters: {
					semester: "Semester",
					semesterValue: (n, y1, y2) => `Semester ${n} - ${y1}/${y2}`
				},
				badges: {
					coef: (n) => `coef. ${n}`,
					ects: (n) => `${n} ECTS`,
					promoMeta: (g) => `class: ${g}`,
					coeffMeta: (g) => `coeff. ${g}`,
					avgMeta: (g) => `avg: ${g}`
				},
				update: {
					average: "average",
					mark: "mark"
				},
				marks: { none: "No marks yet" },
				coeff: {
					corrected: "Coefficients fixed by the community",
					uncorrected: "Uncorrected coefficients ",
					uncorrectedHint: "(Auriga treats them all as equal)",
					viewSource: "View source",
					copyCodes: "Copy codes",
					copied: "Copied!"
				},
				empty: { hint: "Grades will appear here once the connection is restored." },
				errors: {
					title: "Oops, something broke",
					menuChanged: "Auriga's menu format may have changed. ",
					apiDown: "The Auriga server is not responding correctly. ",
					sessionExpired: "Your session has expired. ",
					formatChanged: "Auriga's data format has changed. ",
					cachedSuffix: "Your cached grades are shown on the right, but they may be out of date.",
					retrySuffix: "Try reloading the page. If the issue persists, please report it.",
					reload: "Reload",
					report: "Report",
					resetCache: "Reset cache",
					noCachedTitle: "No cached grades",
					issueTitlePrefix: "Error: ",
					issueBodyError: "## Error",
					issueBodyContext: "## Context"
				},
				coeff2: { contribute: "Contribute" },
				footer: {
					exportPdf: "Export PDF",
					coefficients: "Coefficients",
					sources: "Sources",
					reset: "Reset",
					licensed: "Licensed under "
				},
				loading: {
					initial: "Loading...",
					student: "Student",
					profile: "Fetching profile...",
					filters: "Fetching filters...",
					grades: "Fetching grades...",
					coefficients: "Applying coefficients...",
					changes: "Computing changes...",
					quotes: [
						"Auriga's slower than your grandma...",
						"Negotiating with the server...",
						"Meanwhile, profs are grading your papers...",
						"Loading faster than an EPITA project submission...",
						"Patience, even Auriga needs morning coffee...",
						"Computing your average... pray.",
						"Hacking the system for you (legally)...",
						"Grades arrive... like buses, in batches.",
						"Optimization in progress... unlike your code.",
						"Almost ready, promise (not like your deadlines)."
					]
				},
				print: {
					cycleYear: (track, year) => `Cycle ${track} — Academic Year: ${year}`,
					bulletin: (semNum) => `Semester ${semNum} Report Card`,
					colSemester: (semNum) => `Semester ${semNum}`,
					colEcts: "ECTS CREDITS EARNED",
					colAvgPromoL1: "Average",
					colAvgPromoL2: "Promotion",
					colAvgStudentL1: "Student",
					colAvgStudentL2: "Average",
					overallAvg: "OVERALL AVERAGE",
					footer: (version) => `Exported from Infinity Auriga v${version} — ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", {
						day: "numeric",
						month: "long",
						year: "numeric"
					})}`,
					filenameBase: "Report Card"
				}
			}
		};
		STORAGE_KEY = "auriga-lang";
		hasLocalStorage = typeof localStorage !== "undefined";
		hasNavigator = typeof navigator !== "undefined";
		hasDocument = typeof document !== "undefined";
		currentLang = (() => {
			if (hasLocalStorage) try {
				const stored = localStorage.getItem(STORAGE_KEY);
				if (stored && dict[stored]) return stored;
			} catch {}
			if (hasNavigator && navigator.language?.toLowerCase().startsWith("fr")) return "fr";
			return "en";
		})();
		subscribers = /* @__PURE__ */ new Set();
		getLang = () => currentLang;
		availableLangs = () => Object.keys(dict);
		if (hasDocument) try {
			document.documentElement.setAttribute("lang", currentLang);
		} catch {}
	}));
	//#endregion
	//#region src/render/print.js
	function fmt(v) {
		if (v === .01) return "Abs.";
		if (v !== 0 && !v) return "";
		return v.toFixed(2).replace(".", ",");
	}
	function renderPrintView(marks, averages, coeffMeta, name, lang = getLang()) {
		const tr = (key, ...args) => tFor(lang, key, ...args);
		const pickName = (mod) => lang === "en" ? mod.nameEn || mod.name : mod.name;
		const rows = [];
		for (const mod of marks) {
			rows.push(h("tr", { class: "p-ue" }, h("td", { class: "p-left" }, pickName(mod)), h("td", {}, mod._overridden ? String(mod.coefficient) : ""), h("td", {}, fmt(mod.classAverage)), h("td", {}, fmt(mod.average))));
			for (const sub of mod.subjects) {
				const subDisplayName = pickName(sub);
				const hasRealName = subDisplayName !== sub.id.replace(/_/g, " ");
				const shortId = sub.id.startsWith(mod.id + "_") ? sub.id.slice(mod.id.length + 1) : sub.id;
				const subName = hasRealName ? subDisplayName : shortId.replace(/_/g, " ");
				const coefTag = sub._overridden ? h("span", { class: "p-coef" }, tr("badges.coef", sub.coefficient)) : null;
				rows.push(h("tr", { class: "p-sub" }, h("td", { class: "p-left" }, subName, ...coefTag ? [coefTag] : []), h("td", {}), h("td", {}, fmt(sub.classAverage)), h("td", {}, fmt(sub.average))));
			}
		}
		rows.push(h("tr", { class: "p-total" }, h("td", {
			class: "p-left",
			colspan: "2"
		}, tr("print.overallAvg")), h("td", {}, fmt(averages.promo)), h("td", {}, fmt(averages.student))));
		const year = coeffMeta ? `20${coeffMeta.year.slice(0, 2)}/20${coeffMeta.year.slice(2)}` : "";
		const semNum = (coeffMeta?.semester || "").replace(/\D/g, "");
		const trackLabel = coeffMeta ? coeffMeta.name || `${coeffMeta.track} ${coeffMeta.major || ""}`.trim() : "";
		const trackCode = coeffMeta ? `${coeffMeta.track}${coeffMeta.major ? " " + coeffMeta.major : ""}` : "";
		return h("div", { id: "print-view" }, h("div", { class: "p-header" }, h("div", { class: "p-header-left" }, ...trackCode && year ? [h("div", { class: "p-info" }, tr("print.cycleYear", trackCode, year))] : [], ...semNum ? [h("div", { class: "p-info" }, tr("print.bulletin", semNum))] : [], ...name ? [h("div", { class: "p-student" }, name)] : []), ...trackLabel ? [h("div", { class: "p-header-right" }, trackLabel)] : []), h("table", { class: "p-table" }, h("thead", {}, h("tr", {}, h("th", { class: "p-left p-col-name" }, tr("print.colSemester", semNum)), h("th", { class: "p-col-ects" }, tr("print.colEcts")), h("th", { class: "p-col-avg" }, tr("print.colAvgPromoL1"), h("br"), tr("print.colAvgPromoL2")), h("th", { class: "p-col-avg" }, tr("print.colAvgStudentL1"), h("br"), tr("print.colAvgStudentL2")))), h("tbody", {}, ...rows)), h("div", { class: "p-footer" }, tr("print.footer", app.version)));
	}
	var init_print = __esmMin((() => {
		init_dom();
		init_app$1();
		init_i18n();
	}));
	//#endregion
	//#region src/version-check.js
	/** Compare semver strings. Returns true if remote > local. */
	function isNewer(remote, local) {
		const r = remote.split(".").map(Number);
		const l = local.split(".").map(Number);
		for (let i = 0; i < 3; i++) {
			if ((r[i] || 0) > (l[i] || 0)) return true;
			if ((r[i] || 0) < (l[i] || 0)) return false;
		}
		return false;
	}
	/**
	* Check if a newer version is available.
	* Returns { available: true, version, url } or { available: false }.
	*/
	async function checkForUpdate() {
		try {
			const res = await fetch(`${app.rawBase}/package.json`, { cache: "no-cache" });
			if (!res.ok) return { available: false };
			const pkg = await res.json();
			if (isNewer(pkg.version, app.version)) return {
				available: true,
				version: pkg.version,
				url: `${app.repository}/raw/refs/heads/master/dist-userscript/infinity-auriga.user.js`
			};
		} catch {}
		return { available: false };
	}
	var init_version_check = __esmMin((() => {
		init_app$1();
	}));
	//#endregion
	//#region src/render/app.js
	/**
	* Build the error panel shown in the #background sidebar when the API fails.
	* Adapts its message depending on whether cached grades are available.
	*/
	function createApiErrorPanel(error, hasCachedData) {
		const message = error?.message || String(error);
		let hint = "";
		if (message.includes("Menu entries not found") || message.includes("menu")) hint = t("errors.menuChanged");
		else if (message.includes("API error") || message.includes("fetch")) hint = t("errors.apiDown");
		else if (message.includes("access token") || message.includes("401")) hint = t("errors.sessionExpired");
		else if (message.includes("API format changed") || message.includes("parse")) hint = t("errors.formatChanged");
		const desc = hasCachedData ? hint + t("errors.cachedSuffix") : hint + t("errors.retrySuffix");
		const reportUrl = `${app.repository}/issues/new?title=${encodeURIComponent(t("errors.issueTitlePrefix") + message.substring(0, 80))}&body=${encodeURIComponent(t("errors.issueBodyError") + "\n```\n" + message + "\n```\n\n" + t("errors.issueBodyContext") + "\n- Version: " + app.version + "\n- URL: " + window.location.href + "\n- Date: " + (/* @__PURE__ */ new Date()).toISOString())}`;
		return h("div", { class: "api-error-panel" }, h("div", { class: "api-error-title" }, t("errors.title")), h("div", { class: "api-error-desc" }, desc), h("pre", { class: "api-error-box" }, message), h("div", { class: "api-error-actions" }, h("button", {
			class: "api-error-btn primary",
			onclick: () => window.location.reload()
		}, t("errors.reload")), h("a", {
			href: reportUrl,
			target: "_blank",
			class: "api-error-btn"
		}, t("errors.report")), h("button", {
			class: "api-error-btn muted",
			onclick: () => {
				localStorage.clear();
				window.location.reload();
			}
		}, t("errors.resetCache"))));
	}
	/**
	* Copy coefficient template to clipboard.
	*/
	function createCopyTemplateBtn({ content }) {
		const btn = h("a", {
			href: "#",
			class: "link colored",
			onclick: (e) => {
				e.preventDefault();
				navigator.clipboard.writeText(content).then(() => {
					btn.textContent = t("coeff.copied");
					btn.classList.add("coeff-copied");
				});
			}
		}, t("coeff.copyCodes"));
		return btn;
	}
	/**
	* Compact FR | EN segmented toggle. setLang triggers all subscribers,
	* which includes boot.js's re-render of the whole app.
	*/
	function renderLangToggle() {
		const current = getLang();
		return h("div", {
			class: "lang-toggle",
			role: "group",
			"aria-label": "Language"
		}, ...availableLangs().map((code) => h("button", {
			class: "lang-btn" + (code === current ? " active" : ""),
			onclick: () => setLang(code),
			"aria-pressed": code === current ? "true" : "false"
		}, code.toUpperCase())));
	}
	function renderApp(container, { name, marks, averages, filters, filtersValues, updates, coeffSource, coeffMeta, coeffTemplate, apiError, onSemesterChange }) {
		container.replaceChildren();
		const hasCachedData = marks.length > 0;
		container.appendChild(apiError ? h("div", { id: "background" }, createApiErrorPanel(apiError, hasCachedData)) : h("div", { id: "background" }, html("div", {
			id: "top-triangle",
			class: "triangle"
		}, top_triangle_default), html("div", {
			id: "bottom-triangle",
			class: "triangle"
		}, bottom_triangle_default)));
		const visibleUpdates = updates.filter((u) => u.type !== "average-update");
		const avgEntries = [{
			label: t("loading.student"),
			value: averages.student,
			colored: true
		}, {
			label: t("sidebar.promotion"),
			value: averages.promo,
			colored: false
		}];
		const moduleEls = marks.flatMap((mod) => {
			const modOverriddenEl = mod._overridden ? h("span", { class: "coeff-badge ects" }, t("badges.ects", mod.coefficient)) : null;
			const modName = getLang() === "en" ? mod.nameEn || mod.name : mod.name;
			return [h("div", { class: "header module" }, h("div", { class: "text" }, h("div", { class: "name" }, copyCodeEl(mod._code, modName)), h("div", { class: "point" }), h("div", { class: "bottom" }, h("span", {
				class: "average",
				style: { color: gradeColor(mod.average) }
			}, formatGrade(mod.average)), h("span", { class: "max" }, "\xA0/ 20"), ...mod.classAverage != null ? [h("span", { class: "class-average" }, `(${t("badges.promoMeta", formatGrade(mod.classAverage))})`)] : [], ...modOverriddenEl ? [modOverriddenEl] : [])), h("hr", { class: "bottom-line" })), ...mod.subjects.map((s) => renderSubject(s, mod.id))];
		});
		const printAs = (lang) => {
			if (!hasCachedData) {
				window.print();
				return;
			}
			const existing = document.getElementById("print-view");
			if (existing) existing.remove();
			container.appendChild(renderPrintView(marks, averages, coeffMeta, name, lang));
			const parts = [tFor(lang, "print.filenameBase")];
			if (coeffMeta?.semester) parts.push(coeffMeta.semester);
			if (name) parts.push(name);
			document.title = parts.join(" — ");
			window.print();
		};
		container.appendChild(h("div", {
			id: "content",
			class: "variable wide"
		}, h("div", { id: "header" }, html("div", {
			id: "logo",
			class: "variable"
		}, logo_default), ...name ? [h("div", { class: "header-actions" }, renderLangToggle(), h("a", {
			id: "update-btn",
			style: { display: "none" }
		}), h("a", {
			id: "export-btn",
			href: "#",
			onclick: (e) => {
				e.preventDefault();
				printAs("fr");
			}
		}, html("span", { class: "export-icon" }, ExportSvg), t("header.exportFr")), h("a", {
			id: "export-btn-en",
			href: "#",
			onclick: (e) => {
				e.preventDefault();
				printAs("en");
			}
		}, html("span", { class: "export-icon" }, ExportSvg), t("header.exportEn")), h("a", {
			id: "logout",
			href: "#",
			onclick: (e) => {
				e.preventDefault();
				window.location.href = "https://ionisepita-auth.np-auriga.nfrance.net/auth/realms/npionisepita/protocol/openid-connect/logout?post_logout_redirect_uri=" + encodeURIComponent("https://auriga.epita.fr");
			}
		}, t("header.logout")))] : []), h("div", { id: "main" }, h("div", { class: "content" }, ...!apiError ? [
			h("div", { class: "filters" }, ...filters.map((f) => renderComboBox(f.name, f.values, filtersValues[f.id], (choice) => {
				if (f.id === "semester") onSemesterChange(choice.value);
			}))),
			h("div", { class: "header" }, t("sidebar.changes"), h("hr")),
			...visibleUpdates.length === 0 ? [h("div", { class: "no-updates" }, t("sidebar.noChanges"))] : [],
			h("div", { class: "updates" }, ...visibleUpdates.map(renderUpdate)),
			h("div", { class: "header" }, t("sidebar.averages"), h("hr")),
			h("div", { class: "big-list" }, ...avgEntries.map((e) => h("div", { class: "entry" }, h("div", { class: "point" }), h("div", { class: "name" }, e.label), h("div", { class: "point small" }), h("div", { class: "mark" }, h("span", {
				class: "value",
				style: { color: e.colored ? gradeColor(e.value) : "auto" }
			}, formatGrade(e.value)), "\xA0/ 20"))))
		] : [], ...!hasCachedData && apiError ? [h("div", { class: "empty-state" }, h("div", { class: "empty-state-text" }, t("errors.noCachedTitle")), h("div", { class: "empty-state-hint" }, t("empty.hint")))] : [
			...coeffMeta ? [h("div", { class: "header" }, h("div", { class: "track-info" }, h("span", { class: "track-info-name" }, coeffMeta.name || [coeffMeta.track, coeffMeta.major].filter(Boolean).join(" ")), h("span", { class: "track-info-detail" }, `${coeffMeta.track} ${coeffMeta.semester} — 20${coeffMeta.year.slice(0, 2)}/20${coeffMeta.year.slice(2)}`)), h("hr"))] : [],
			h("div", { class: "coeff-info" }, h("div", { class: "coeff-main" }, h("div", { class: "point" }), h("div", { class: "coeff-content" }, coeffSource ? h("span", {}, t("coeff.corrected")) : h("span", {}, t("coeff.uncorrected"), h("span", { class: "coeff-muted" }, t("coeff.uncorrectedHint"))))), h("div", { class: "coeff-links" }, ...coeffSource ? [h("a", {
				href: `${app.repository}/blob/master/coefficients/${coeffSource}`,
				target: "_blank",
				class: "link colored"
			}, t("coeff.viewSource")), ...coeffTemplate ? ["\xA0·\xA0", createCopyTemplateBtn(coeffTemplate)] : []] : [...coeffTemplate ? [createCopyTemplateBtn(coeffTemplate), "\xA0·\xA0"] : [], h("a", {
				href: `${app.repository}/tree/master/coefficients`,
				target: "_blank",
				class: "link colored"
			}, t("coeff2.contribute"))])),
			h("hr", { class: "separator" }),
			...moduleEls
		])), renderFooter()));
		if (hasCachedData) {
			container.appendChild(renderPrintView(marks, averages, coeffMeta, name));
			const parts = [t("print.filenameBase")];
			if (coeffMeta?.semester) parts.push(coeffMeta.semester);
			if (name) parts.push(name);
			document.title = parts.join(" — ");
		}
		checkForUpdate().then(({ available, version, url }) => {
			if (!available) return;
			const btn = document.getElementById("update-btn");
			if (!btn) return;
			btn.href = url;
			btn.target = "_blank";
			btn.append(html("span", { class: "update-icon" }, UpdateSvg), "v" + version);
			btn.style.display = "";
		});
	}
	var ExportSvg, UpdateSvg;
	var init_app = __esmMin((() => {
		init_app$1();
		init_dom();
		init_tooltip();
		init_components();
		init_print();
		init_version_check();
		init_i18n();
		ExportSvg = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/><line x1=\"12\" y1=\"18\" x2=\"12\" y2=\"12\"/><polyline points=\"9 15 12 18 15 15\"/></svg>";
		UpdateSvg = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 2v6h-6\"/><path d=\"M3 12a9 9 0 0 1 15-6.7L21 8\"/><path d=\"M3 22v-6h6\"/><path d=\"M21 12a9 9 0 0 1-15 6.7L3 16\"/></svg>";
	}));
	//#endregion
	//#region src/render/loading.js
	function renderLoadingScreen(container, message) {
		container.replaceChildren();
		container.appendChild(h("div", { id: "background" }, html("div", {
			id: "top-triangle",
			class: "triangle"
		}, top_triangle_default), html("div", {
			id: "bottom-triangle",
			class: "triangle"
		}, bottom_triangle_default)));
		const quote = LOADING_QUOTES[Math.floor(Math.random() * LOADING_QUOTES.length)];
		const stepLabel = h("div", { class: "loading-step" }, message || "Chargement...");
		const requestLabel = h("div", { class: "loading-request" });
		const quoteLabel = h("div", { class: "loading-quote" }, quote);
		const loading = h("div", { class: "loading" }, html("div", { class: "spinner" }, spinner_default), stepLabel, requestLabel, quoteLabel);
		container.appendChild(h("div", {
			id: "content",
			class: "variable"
		}, h("div", { id: "header" }, html("div", {
			id: "logo",
			class: "variable"
		}, logo_default)), h("div", { id: "main" }, loading), renderFooter()));
		return {
			step(text) {
				stepLabel.textContent = text;
				requestLabel.textContent = "";
			},
			request(url) {
				requestLabel.textContent = url;
			}
		};
	}
	var LOADING_QUOTES;
	var init_loading = __esmMin((() => {
		init_dom();
		init_components();
		LOADING_QUOTES = [
			"Auriga va moins vite que votre grand-mère...",
			"On négocie avec le serveur...",
			"Pendant ce temps, les profs corrigent vos copies...",
			"Chargement plus rapide qu'un rendu de projet EPITA...",
			"Patience, même Auriga a besoin de café le matin...",
			"Calcul de votre moyenne... priez.",
			"On hack le système pour vous (légalement)...",
			"Les notes arrivent... comme les bus, par paquets.",
			"Optimisation en cours... contrairement à votre code.",
			"Bientôt prêt, promis (pas comme vos deadlines)."
		];
	}));
	//#endregion
	//#region src/render/index.js
	var render_exports = /* @__PURE__ */ __exportAll({
		renderApp: () => renderApp,
		renderLoadingScreen: () => renderLoadingScreen
	});
	var init_render = __esmMin((() => {
		init_app();
		init_loading();
	}));
	//#endregion
	//#region src/boot.js
	var EMPTY_DATA = {
		marks: [],
		averages: {
			student: null,
			promo: null
		},
		updates: [],
		coeffSource: null,
		coeffMeta: null,
		coeffTemplate: null
	};
	/**
	* Shared boot sequence for both dev (main.js) and prod (userscript-entry.js).
	*
	* Both entry points handle their own environment setup (mock tokens, DOM takeover,
	* token interception, etc.) then call this function with a ready container.
	*
	* Flow: setupToggle → loadSession → refresh loop (fetch marks → render)
	*
	* @param {HTMLElement} container - The #app element, already in the DOM
	*/
	async function boot(container) {
		setupToggle("infinity");
		const { renderLoadingScreen, renderApp } = await Promise.resolve().then(() => (init_render(), render_exports));
		try {
			const status = renderLoadingScreen(container, "Chargement...");
			setApiRequestHook((url) => status.request(url));
			const session = await loadSession(status);
			let { filtersValues } = session;
			const { name, filters } = session;
			async function refresh() {
				const onSemesterChange = (value) => {
					filtersValues = saveSemesterFilter(value);
					refresh();
				};
				try {
					const s = renderLoadingScreen(container);
					setApiRequestHook((url) => s.request(url));
					const data = await fetchMarksAndUpdates(filtersValues, s);
					renderApp(container, {
						name,
						filters,
						filtersValues,
						...data,
						onSemesterChange
					});
				} catch (err) {
					console.error("[Infinity Auriga]", err);
					const cached = await loadCachedMarks(filtersValues);
					renderApp(container, {
						name,
						filters,
						filtersValues,
						...cached || EMPTY_DATA,
						apiError: err,
						onSemesterChange
					});
				}
			}
			await refresh();
		} catch (err) {
			console.error("[Infinity Auriga]", err);
			const filtersValues = loadSavedFilters();
			renderApp(container, {
				name: "Etudiant",
				filters: [],
				filtersValues,
				...await loadCachedMarks(filtersValues) || EMPTY_DATA,
				apiError: err,
				onSemesterChange(value) {
					saveSemesterFilter(value);
					window.location.reload();
				}
			});
		}
	}
	//#endregion
	//#region src/style.css
	var require_style = /* @__PURE__ */ __commonJSMin((() => {}));
	//#endregion
	//#region src/userscript-entry.js
	installTokenInterceptor();
	async function main() {
		if (document.readyState === "loading") await new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve));
		if (!isInfinityEnabled()) {
			setupToggle("classic");
			return;
		}
		await waitForToken();
		await Promise.resolve().then(() => /* @__PURE__ */ __toESM(require_style(), 1));
		document.title = "Infinity Auriga";
		while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
		for (const el of document.querySelectorAll("link[rel=\"stylesheet\"], style:not([data-infinity])")) el.remove();
		const container = document.createElement("div");
		container.id = "app";
		document.body.appendChild(container);
		await boot(container);
	}
	main().catch((err) => console.error("[Infinity Auriga]", err));
	//#endregion
})();
