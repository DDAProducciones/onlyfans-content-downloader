import config from './config.js'
import sendContent from './send_content.js'

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


function fetchPhoto (username, i = 0, 	ii = 0) {
	// Base case.
	if (i === profiles[username]['content_type'].photo.count) { console.info(success[2]); return username; }

	const photos = document.getElementsByClassName('pswp__img');
	for (let i = 0; i < photos.length; i++) {
		let photo = photos[i];
		if (photo.src && !profiles[username]['content_type'].photo.source.includes(photo.src)) {
			profiles[username]['content_type'].photo.source.push(photo.src);
			ii++
			console.info(`✔️ [${ii}/${profiles[username]['content_type'].photo.count}] [PHOTO] = ${photo.src}`);
		}
	}
	i++;
	document.getElementsByClassName('pswp__button pswp__button--arrow--right')[0].click();
	setTimeout(function(){ fetchPhoto(username, i, ii) }, config.content_type.photo.iter_speed);
}

function fetchVideo (username, i = 0, ii = 0) {
	// Base case.
	if (i === profiles[username]['content_type'].video.count) { return username; }

	let videos = document.getElementsByClassName('vjs-tech');
	for (let i = 0; i < videos.length; i++) {
		let video = videos[i];
		if (video.firstElementChild.src && !profiles[username]['content_type'].video.source.includes(video.firstElementChild.src)) {
   			profiles[username]['content_type'].video.source.push(video.firstElementChild.src);
			ii++;
			console.info(`✔️ [${ii}/${profiles[username]['content_type'].video.count}] [VIDEO] = ${video.firstElementChild.src}`);
		}
	}

	i++;
	document.getElementsByClassName('pswp__button pswp__button--arrow--right')[0].click();
	setTimeout(function(){ fetchVideo(username, i, ii) }, config.content_type.video.iter_speed);
}





function scrollToBottom (top = true) {
	if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
		if (top) { scroll(0,0) }
		console.info(success[4]);
		return true
	}
	try {
		window.scrollTo(0,document.body.scrollHeight);
		setTimeout(function(){ scrollToBottom(); }, config.page_scroll.iter_speed);
	} catch { return true }
}

function fetchContent () {
	console.log(message[5])
	const username = fetchVideo(fetchPhoto(fetchUserInfo()))
	return sendContent(profiles[username], '/download_content');
}

function autoNavigator () {
	const route = window.location.pathname.split('/').pop()
	switch (route) {
		// Path: /<username>
		case window.location.pathname.split('/')[1]:
			document.getElementsByClassName('b-tabs__nav__link__counter-title')[1].click()
			document.getElementsByClassName('b-tabs__nav__text')[1].click()
			scrollToBottom()
			console.log('Good')
		    document.getElementsByClassName('b-photos__item__img')[0].click()
			// username = fetchUserInfo()
			// fetchPhoto(username)

			// document.getElementsByClassName('b-tabs__nav__text')[2].click()
			// const videoEle = document.getElementsByClassName('b-photos__item__img')[0]
			// if (videoEle) { scrollToBottom(); fetchVideo(username); videoEle.click()}
			break;

	// 	// Path: /media
	// 	case document.getElementsByClassName('b-tabs__nav__text')[0].innerText.split(' ')[0]:
	// 	  break ;
		
	// 	// Path: /photos
	// 	case document.getElementsByClassName('b-tabs__nav__text')[1].innerText.split(' ')[0]:
	// 	  break;
		
	// 	// Path: /videos
	// 	case document.getElementsByClassName('b-tabs__nav__text')[2].innerText.split(' ')[0]:
	// 		break;
	  } 
}
autoNavigator()