{
// Adjustable config file.
const config = {
	"host": { "protocol": "http:", "base_url": "127.0.0.1", "port": 5000 },
	"page_scroll": { "iter_speed": 3000 },
	"page_load": { "iter_speed": 3000 },
	"content_type": {
		"avatar": {
			"download": true,
			"iter_speed": 0
		},
		"banner": {
			"download": true,
			"iter_speed": 0
		},
		"photo": {
			"download": true,
			"iter_speed": 50 
		},
		"video": {
			"download": true,
			"iter_speed": 50
		},
		"archived": {
			"download": true,
			"iter_speed": 50 
		}
	},
	"message": {
		"success": {
			0: '✔️ Fetch completed successfully!',
			1: '✔️ User information fetch completed successfully!',
			2: '✔️ Photos fetched successfully!',
			3: '✔️ Videos fetched successfully!',
			4: '✔️ Page loaded successfully!',
			5: '✔️ Fetched content sent over to the server to start the download.'
		},
		"error": {
			0: '❌ Could not fetch username, download failed.',
			1: '❌ Could not fetch avatar, download failed.',
			2: '❌ Could not fetch banner, download failed.',
			3: '❌ Could not fetch photo count, download failed.',
			4: '❌ Could not fetch video count, download failed.',
			5: '❌ Could not fetch archived count, download failed.'
		}
	} 
}

// Send user content to backend to download.
function sendContent(profile, route = '/') {
	const req = new XMLHttpRequest();
	req.open("POST", `${config.host.protocol}//${config.host.base_url}:${config.host.port}${route}`);
	console.info(`Request sent to: ${config.host.base_url}:${config.host.port}${route}`)
	req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	req.send(JSON.stringify(profile));
	return req.onload = function(rv) { console.info(rv.target.response)}
}

// Store user profile data.
const profiles = {}
const error = config['message']['error']
const success = config['message']['success']

// Fetch user info.
function fetchUserInfo () {
	// Fetch username of user subscription.
	const errors = []
	const username = document.getElementsByClassName('g-user-username')[2].innerText.slice(1)
	if (!username) { errors.push(error[0]) }
	profiles[username] = {'username': username, content_type: {} }

	if (config['content_type']['avatar']['download']) {
		const avatar = document.getElementsByClassName('g-avatar router-link-active online_status_class m-w150')[0].childNodes[0].src
		if (!avatar) { errors.push(error[1]) } else { profiles[username]['content_type']['avatar'] = { 'count': 1, 'source': [avatar] } }
	}

	if (config['content_type']['banner']['download']) {
		const banner = document.getElementsByClassName('b-profile__header__cover-img')[0].src
		if (!banner) { errors.push(error[2]) } else { profiles[username]['content_type']['banner'] = { 'count': 1, 'source': [banner] } }
	}

	if (config['content_type']['photo']['download']) {
		const photo_count = document.getElementsByClassName('b-tabs__nav__text')[1]
		if (!photo_count) { errors.push(error[3]) } else { profiles[username]['content_type']['photo'] = { 'count': parseInt(photo_count.innerText.split(' ')[1]), 'source': [] } }	
	}

	if (config['content_type']['video']['download']) {
		const video = document.getElementsByClassName('b-tabs__nav__text')[2]
		if (!video) { errors.push(error[4]) } else { profiles[username]['content_type']['video'] = { 'count': parseInt(video.innerText.split(' ')[1]), 'source': [] } }
	}

	if (config['content_type']['archived']['download']) {
		const archived = document.getElementsByClassName('b-tabs__nav__link__counter-title')[2]
		if (archived) profiles[username]['content_type']['archived'] = { 'count': parseInt(archived.innerText.split(' ')[0]), 'source': [] } 
	}

	if (errors.length) { errors.forEach(err => console.error(err)); return username}
	console.log(success[1]); return username;
}

// Pause async codes.
function pause (delay) { return new Promise ((resolve, reject) => { setTimeout(() => { resolve(true) }, delay) }) }

// Fetch photos.
function fetchPhoto (username) {
	return new Promise (async (resolve, reject) => {
		let ii = 0; i = 0;
		do {
			// setTimeout(() => { console.log(document.getElementsByClassName('pswp__img')); }, 2000)
			const photos = document.getElementsByClassName('pswp__img'); i++;
			for (let iii = 0; iii < photos.length; iii++) {
				let photo = photos[iii];
				if (photo.src && !profiles[username]['content_type'].photo.source.includes(photo.src)) {
					profiles[username]['content_type'].photo.source.push(photo.src); ii++;
					console.info(`✔️ [${ii}/${profiles[username]['content_type'].photo.count}] [PHOTO] = ${photo.src}`);
				}
			}
			document.getElementsByClassName('pswp__button pswp__button--arrow--right')[0].click();
			await pause(config.content_type.photo.iter_speed);
		} while(i < profiles[username]['content_type'].photo.count)
		resolve(username);
	});
}

// Fetch videos.
async function fetchVideo (username) {
	let ii = 0; i = 0;
	do {
		let videos = document.getElementsByClassName('vjs-tech'); i++;
		for (let i = 0; i < videos.length; i++) {
			let video = videos[i];
			if (video.firstElementChild.src && !profiles[username]['content_type'].video.source.includes(video.firstElementChild.src)) {
				profiles[username]['content_type'].video.source.push(video.firstElementChild.src); ii++;
				console.info(`✔️ [${ii}/${profiles[username]['content_type'].video.count}] [VIDEO] = ${video.firstElementChild.src}`);
			}
		}
		document.getElementsByClassName('pswp__button pswp__button--arrow--right')[0].click();
		await pause(config.content_type.video.iter_speed);
	} while(i <= profiles[username]['content_type'].video.count)
	return new Promise((resolve, reject) => { resolve(username) });
}

// Scroll to bottom.
async function scrollToBottom(speed = 3000) {
	return new Promise (async (resolve, reject) => {
		do {
			window.scrollTo(0, document.body.scrollHeight);
			await pause(speed);
		}
		while (Math.round(window.innerHeight + window.pageYOffset + 1) < document.body.offsetHeight);
		scroll(0, 0);
		resolve(true);
	});
};

// Auto navigate user content.
function autoNavigator () {
	document.getElementsByClassName('b-tabs__nav__link__counter-title')[1].click();
	document.getElementsByClassName('b-tabs__nav__text')[1].click();

	(async () => {
		username = fetchUserInfo();
		
		document.getElementsByClassName('b-tabs__nav__text')[1].click();
		await scrollToBottom();
		const photoAvailable = document.getElementsByClassName('b-photos__item__img');
		if (photoAvailable.length) {
			photoAvailable[0].click();
			await pause(config.page_load.iter_speed);
			await fetchPhoto(username);
		}

		// Close picture window.
		document.getElementsByClassName('pswp__button pswp__button--close')[0].click();

		// Video tab.
		document.getElementsByClassName('b-tabs__nav__text')[2].click();
		await scrollToBottom();
		const videoAvailable = document.getElementsByClassName('b-photos__item__img');
		if (videoAvailable.length) {
			videoAvailable[0].click();
			await pause(config.page_load.iter_speed);
			await fetchVideo(username);
		}
		
		// Send content to backend for download.
		sendContent(profiles[username], '/download_content');
	  })();
}

autoNavigator();
}