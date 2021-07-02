import config from './config.js'

// Store user profile data.
const profiles = {}

// Error dictionary.
const error = config['message']['error']
const success = config['message']['success']

function fetchUserInfo () {
	// Fetch username of user subscription.
	const errors = []
	const username = document.getElementsByClassName('g-user-username')[2].innerText.slice(1)
	if (!username) { errors.push(error[0]) }
	profiles[username] = {}

	if (config['content_type']['avatar']['download']) {
		const avatar = document.getElementsByClassName('g-avatar router-link-active online_status_class m-w150')[0].childNodes[0].src
		if (!avatar) { errors.push(error[1]) } else { profiles[username]['avatar'] = { 'content': avatar } }
	}

	if (config['content_type']['banner']['download']) {
		const banner = document.getElementsByClassName('b-profile__header__cover-img')[0].src
		if (!banner) { errors.push(error[2]) } else { profiles[username]['banner'] = { 'content': banner } }
	}

	if (config['content_type']['photo']['download']) {
		const photo_count = document.getElementsByClassName('b-tabs__nav__text')[1]
		if (!photo_count) { errors.push(error[3]) } else { profiles[username]['photo'] = { 'count': parseInt(photo_count.innerText.split(' ')[1]), 'source': [] } }	
	}

	if (config['content_type']['video']['download']) {
		const video = document.getElementsByClassName('b-tabs__nav__text')[2]
		if (!video) { errors.push(error[4]) } else { profiles[username]['video'] = { 'count': parseInt(video.innerText.split(' ')[1]), 'source': [] } }
	}

	if (config['content_type']['archived']['download']) {
		const archived = document.getElementsByClassName('b-tabs__nav__link__counter-title')[2]
		if (archived) profiles[username]['archived'] = { 'count': parseInt(archived.innerText.split(' ')[0]), 'source': [] } 
	}

	if (errors.length) { errors.forEach(err => console.error(err)); return username}
	console.log(success[1]); return username;
}


function fetchPhoto (username, i = 0, 	ii = 0) {
	// Base case.
	if (i === profiles[username].photo.count) { console.info(success[2]); return username; }

	const photos = document.getElementsByClassName('pswp__img');
	for (let i = 0; i < photos.length; i++) {
		let photo = photos[i];
		if (photo.src && !profiles[username].photo.source.includes(photo.src)) {
			profiles[username].photo.source.push(photo.src);
			ii++
			console.info(`✔️ [${ii}/${profiles[username].photo.count}] [PHOTO] = ${photo.src}`);
		}
	}
	i++;
	document.getElementsByClassName('pswp__button pswp__button--arrow--right')[0].click();
	setTimeout(function(){ fetchPhoto(username, i, ii) }, config.content_type.photo.iter_speed);
}

const username = fetchPhoto(fetchUserInfo());

// sendContent(userPhoto);

// // function fetchVideo (i = 0) {
// // 	i++;

// // 	// Base case.
// // 	if (i === content.userInfo.video_count) {
// // 		content.vids.forEach(e => console.log(content.vids.length, e, '\n'));
// // 		sendContent(content);
// // 		return content;
// // 	}

// // 	let vids = document.getElementsByClassName('vjs-tech');
// // 	for (let i = 0; i < vids.length; i++) {
// // 		let vid = vids[i];

// // 		if (vid.firstElementChild.src && !content.vids.includes(vid.firstElementChild.src)) {
// //    			content.vids.push(vid.firstElementChild.src);
// // 		}
// // 	}

// // 	document.getElementsByClassName('pswp__button pswp__button--arrow--right')[0].click();
// // 	setTimeout(function(){ fetchVideo(i) }, 50);
// // }

// // function scrollToBottom () {
// // 	if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
// // 		console.info('Page-load completed.');
// // 		return true
// // 	}
// // 	try {
// // 		window.scrollTo(0,document.body.scrollHeight);
// // 		setTimeout(function(){ scrollToBottom(); }, 3000);
// // 	} catch { return true }
// // }


// function fetchContent () {

// }