clear();
{
	// Configuration.
	const config = {
		'avatar': {
			'download': true,
			'element': () => document.getElementsByClassName("g-avatar")[3],
			'fetch': () => fetchAvatar()
		},
		'banner': {
			'download': true,
			'element': () => document.getElementsByClassName('b-profile__header__cover-img')[0],
			'fetch': () => fetchBanner()
		},
		'photos': {
			'download': false,
			'iterationSpeedDelayInSeconds': 0,  // How fast the app will iterate over the media content. 0 means instantly.
			'scrollIntervalDelayInSeconds': 0,  // The delay time between each scroll interval.
			'scrollExtentInMinutes': 0, // 0 means download everything.
			'content': () => document.getElementsByClassName('pswp__img'), // The currently opened grid photo.
			'source': element => element.src, 
			'fetch': mediaType => loadPhotoVideo(mediaType),
			'element': () => {  // The "Photo <<N>> button-tab."
				for(element of document.getElementsByClassName('b-tabs__nav__text')) {
					if (element.outerText.match("Photo")) return element;
				}
			}
		},
		'videos': {
			'download': false,
			'iterationSpeedDelayInSeconds': 0.2,
			'scrollIntervalDelayInSeconds': 0,
			'scrollExtentInMinutes': 0, // 0 means download everything.
			'content': () => document.getElementsByClassName('vjs-tech'),
			'source': element => element.firstElementChild.src, 
			'fetch': mediaType => loadPhotoVideo(mediaType),
			'element': () => {  // The "Photo <<N>> button-tab."
				for(element of document.getElementsByClassName('b-tabs__nav__text')) {
					if (element.outerText.match("Video")) return element;
				}
			}
		},
		'archived': {
			'download': false,
			'element': () => document.getElementsByClassName('b-tabs__nav__link__counter-title')[2]
		},
	};

	// Load next content section of page.
	function loadContent () {
		const loadBtn = document.getElementsByClassName('g-btn m-rounded m-block w-100')[0]
		if (loadBtn) loadBtn.click()
	}

	// Global variables.
	const profiles = {}; // Store content-creator storage object.
	const username = window.location.pathname.split('/')[1]; // Username of content-creator.
	const media = document.getElementsByClassName('b-tabs__nav__link__counter-title')[1]; // Media tab.

	// Current URL pathname.
	function pathname () {
		const pathname = window.location.pathname.split('/').slice(-1)[0];
		return pathname[pathname.length - 1].toLocaleLowerCase();
	}

	// Freeze/pauze/sleep the code for a certain amount of time.
	function freeze (time = 3000) { return new Promise(resolve => setTimeout(() => { resolve(true); }, time)); }

	// Current page offset height in percentages.
	function pageYOffsetPercentage() { return Math.round((window.innerHeight + window.pageYOffset) / document.body.offsetHeight * 100); }

	// Get the current media type.
	function currentMediaType() {
		return window.location.href.split('/').slice(-1)[0];
	}

	// Scroll to bottom.
	function scrollToBottom (scrollIntervalDelayInSeconds = 1, scrollExtentInMinutes = 0) {
		console.info('⌛ Page scroll in progress...');
		
		// Stop scroll early if user specified scroll extent in minutes.
		let scrollLimitTimer; scrollActive = true;
		if (scrollExtentInMinutes !== 0) {
			console.warn(`⚠️ Scrolling for ${currentMediaType()} will not take any longer than ${scrollExtentInMinutes} minute(s) because of the set configuration.`);
			scrollLimitTimer = setTimeout(() => scrollActive = false, scrollExtentInMinutes * 1000 * 60);
		}

		let currentPageYOffset = pageYOffsetPercentage();
		return new Promise (async resolve => {
			while (scrollActive) {
				// Scroll down.
				window.scrollTo(0, document.body.scrollHeight);
				await freeze(scrollIntervalDelayInSeconds * 1000 + 1000); // The "+ 1000" is a safety mechanism to make sure the "loading icon" on the page appears.
				const infiniteStatusPrompt = document.getElementsByClassName('infinite-status-prompt')[0];
        if (infiniteStatusPrompt) {
          if (window.getComputedStyle(document.getElementsByClassName('infinite-status-prompt')[0]).display !== 'none') { continue; }  // Check if page is still loading for content.
        }
				if (document.getElementsByClassName('g-btn m-rounded m-block w-100')[0]) { document.getElementsByClassName('g-btn m-rounded m-block w-100')[0].click(); continue; }  // Check if manual load button appeared on the page.
				const newPageYOffset = pageYOffsetPercentage();  // Get the new Y scroll offset of the page.
				if (newPageYOffset > currentPageYOffset) { currentPageYOffset = newPageYOffset; continue; }  // Update page Y offset.
				if (currentPageYOffset !==  100 && newPageYOffset !== 100) { continue; } // Check if page scroll is complete. Continue if not.
				break;  // Page is done scrolling from 0 to 100.
			}
			clearTimeout(scrollLimitTimer);  // Clear the timeout, content can finish before timer reaches limit.
			scroll(0, 0); console.info('✔️ Finished scrolling page.'); resolve(true);
		});
	}

  // Fetch avatar/banner.
	function fetchAvatar () { 
    const avatarImage = config.avatar.element().outerHTML.match(/(((https?:\/\/)|(www\.))[^\s]+)/g)[0].replace('\"', '').replace('thumbs/c144/', '');
    profiles[username].avatar.sources.push(avatarImage)
    profiles[username].avatar.amount = 1;
  }
	function fetchBanner () {
    profiles[username].banner.sources.push(config.banner.element().src.replace('thumbs/w480/', ''));
    profiles[username].banner.amount = 1;
  }

	// Fetch photo/video.
	function loadPhotoVideo(mediaType) {
		return new Promise (async resolve => {
			const media = config[mediaType]; const profileMedia = profiles[username][mediaType];
			let progress = 0; let currentProgressInPercentage = 0; newProgressInPercentage = 0; let downloaded = 0; media.element().click(); await freeze(1000);
			await scrollToBottom(config[mediaType].scrollIntervalDelayInSeconds, config[mediaType].scrollExtentInMinutes);
			firstItem = document.getElementsByClassName('b-photos__item__img')[0];
			if (!firstItem) { console.warn(`⚠️ No downloadable ${mediaType}.`); return resolve(true); }
			firstItem.click(); await freeze(1000);
			while (profileMedia.amount > progress) {
				progress += 1; newProgressInPercentage = Math.round(progress / profileMedia.amount * 100);
				if (newProgressInPercentage > currentProgressInPercentage) {
					currentProgressInPercentage = newProgressInPercentage;
					console.info(`⌚ [${mediaType.toUpperCase()}]`, currentProgressInPercentage + "%");
				}

				for (let i = 0; i < media.content().length; i++) {
					const item = media.source(media.content()[i]); const profileMediaTypeSources = profileMedia.sources;
					if (item && !profileMediaTypeSources.includes(item)) {
						profileMediaTypeSources.push(item); downloaded++;
					}
					document.getElementsByClassName('pswp__button pswp__button--arrow--right')[0].click();
					await freeze(media.iterationSpeedDelayInSeconds * 1000);
				}
			}
			if (config[mediaType].scrollExtentInMinutes !== 0) { console.warn(`⚠️ ${profileMedia.amount - downloaded} not downloaded for ${mediaType} because the max scroll extent for it was set to ${config[mediaType].scrollExtentInMinutes} minutes.`); }
			else { console.warn(`🔒 ${profileMedia.amount - downloaded} locked/hidden for ${mediaType}.`); }
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
				const currentMediaElement = config[o].element();
				if (!currentMediaElement) {
					console.warn(`⚠️ Download process for ${o} skipped because @${username} didn't post any.`);
					continue;
				}
				profiles[username][o] = {
					'sources': [],
					'amount': parseInt(currentMediaElement.innerText.replace(/\D/g, ''))
				}; if (config[o].fetch) await config[o].fetch(o);
			} resolve(true);
		});
	}

	function downloadContentRequest () {
		fetch('http://127.0.0.1:5224/download_content', { // Send content to the server for download.
			method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({ [username]: profiles[username] })
		}).then(response => response.text()).then(rv => console.info(rv));
	}

	// Auto clicker.
	async function autoClicker() {
		if (!document.getElementsByClassName('b-tabs__nav__item m-current')[0].firstChild.href.split('/')[4]) {
			media.click(); await freeze(); // Click media tab.
		} await fetchContent(); await freeze(1000); // Freeze the code so the page can load.
		document.getElementsByClassName('pswp__button pswp__button--close')[0].click();
		console.log("↪️ Check the backend code terminal output for the download status.")
		downloadContentRequest();
	}

	// Execute the code.
	autoClicker();
}