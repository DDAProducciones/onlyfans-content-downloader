clear();
{
	// Configuration.
	const config = {
		'avatar': {
			'download': true,
			'element': () => document.getElementsByClassName('g-avatar router-link-active online_status_class m-w150')[0],
			'fetch': () => fetchAvatar
		},
		'banner': {
			'download': true,
			'element': () => document.getElementsByClassName('b-profile__header__cover-img')[0],
			'fetch': () => fetchBanner
		},
		'photos': {
			'download': true,
			'element': () => document.getElementsByClassName('b-tabs__nav__text')[1],
			'content': () => document.getElementsByClassName('pswp__img'),
			'source': element => element.src, 
			'fetch': mediaType => loadPhotoVideo(mediaType),
			'iter_speed': 100
		},
		'videos': {
			'download': true,
			'element': () => document.getElementsByClassName('b-tabs__nav__text')[2],
			'content': () => document.getElementsByClassName('vjs-tech'),
			'source': element => element.firstElementChild.src, 
			'fetch': mediaType => loadPhotoVideo(mediaType),
			'iter_speed': 100
		},
		'archived': {
			'download': false,
			'element': () => document.getElementsByClassName('b-tabs__nav__link__counter-title')[2]
		}
	};

	// Global variables.
	const profiles = {}; // Store content-creator storage object.
	const username = window.location.pathname.split('/')[1]; // Username of content-creator.
	const media = document.getElementsByClassName('b-tabs__nav__link__counter-title')[1]; // Media tab.

	// Current URL pathname.
	function pathname () {
		const pathname = window.location.pathname.split('/');
		return pathname[pathname.length - 1].toLocaleLowerCase();
	}

	// Freeze/pauze/sleep the code for a certain amount of time.
	function freeze (time = 3000) { return new Promise(resolve => setTimeout(() => { resolve(true); }, time)); }

	// Scroll to the bottom of the page.
	function scrollToBottom (speed = 3000, backToTop = true) {
		return new Promise (async resolve => {
			console.info('⌛ Page scroll in progress...');
			while ((window.innerHeight + window.pageYOffset + 1) <= document.body.offsetHeight) {
				window.scrollTo(0, document.body.scrollHeight); await freeze(speed);
			} if (backToTop) scroll(0, 0); console.info('✔️ Finished scrolling page.'); resolve(true);
		});
	}

    // Fetch avatar/banner.
	function fetchAvatar () { profiles[username].avatar.sources.push(config.avatar.element().firstChild.src); } 
	function fetchBanner () { profiles[username].banner.sources.push(config.banner.element().src); }

	// Fetch photo/video.
	function loadPhotoVideo(mediaType) {
		return new Promise (async resolve => {
			const media = config[mediaType]; const profileMedia = profiles[username][mediaType];
			let progress = 0; let downloaded = 0; media.element().click(); await freeze(1000);
			await scrollToBottom();
			firstItem = document.getElementsByClassName('b-photos__item__img')[0]
			if (!firstItem) { console.warn(`⚠️ No downloadable ${mediaType}.`); return resolve(true); }
			firstItem.click(); await freeze(1000);
			while (profileMedia.amount >= progress) {
				progress += 1; for (let i = 0; i < media.content().length; i++) {
					const item = media.source(media.content()[i]); const profileMediaTypeSources = profileMedia.sources;
					if (item && !profileMediaTypeSources.includes(item)) {
						profileMediaTypeSources.push(item); downloaded++;
						console.info(`✔️ [${mediaType.toUpperCase()}] [${downloaded}/${profileMedia.amount}] - ${item}`);
					} await freeze(media.iter_speed);
					document.getElementsByClassName('pswp__button pswp__button--arrow--right')[0].click();
				}
			}
			console.warn(`⚠️ ${profileMedia.amount - downloaded} locked/hidden for ${mediaType}.`);
			profileMedia.amount = downloaded; resolve(true); 
		});
	}

	// Fetch content.
	function fetchContent () {
		return new Promise (async resolve => {
			profiles[username] = {}; const keys = Object.keys(config); const index = keys.indexOf(pathname());
			if (index !== -1) { [keys[0], keys[index]] = [keys[index], keys[0]]; }
			for (const o of keys) {
				if (!config[o].download) continue;
				profiles[username][o] = {
					'sources': [],
					'amount': parseInt(config[o].element().innerText.replace(/\D/g, '')) || 1
				}; if (config[o].fetch) await config[o].fetch(o);
			} resolve(true);
		});
	}
		
	// Auto clicker.
	async function autoClicker() {
		if (!document.getElementsByClassName('b-tabs__nav__item m-current')[0].firstChild.href.split('/')[4]) {
			media.click(); await freeze(); // Click media tab.
		} await fetchContent(); await freeze(1000); // Freeze the code so the page can load.
		document.getElementsByClassName('pswp__button pswp__button--close')[0].click();
		fetch('http://127.0.0.1:5000/download_content', { // Send content to the server for download.
			method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ [username]: profiles[username] })
		}).then(response => response.text()).then(rv => console.info(rv));
	}

	// Execute the code.
	autoClicker();
}