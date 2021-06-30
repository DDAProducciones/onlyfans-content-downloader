const content = { 
	'userInfo': {
		'username': document.getElementsByClassName('g-user-username')[2].innerText.slice(1),
		'photo_count': parseInt(document.getElementsByClassName('b-tabs__nav__text')[1].innerText.split(' ')[1]),
		'video_count': parseInt(document.getElementsByClassName('b-tabs__nav__text')[2].innerText.split(' ')[1])
	},
	'imgs': [],
	'vids': []
};

function sendPostData(data) {
	const req = new XMLHttpRequest();
	req.onload = function () { console.log('Hello, world!') }
	req.open("POST", "http://localhost:5000/test");
	req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	req.send(JSON.stringify(data));
}

function nextItem (i = 0) {
	i++;

	// Base case.
	if (i === content.userInfo.photo_count) {
		content.imgs.forEach(e => console.log(content.imgs.length, e, '\n'));
		sendPostData(content);
		return content;
	}

	let imgs = document.getElementsByClassName('pswp__img');
	for (let i = 0; i < imgs.length; i++) {
		let img = imgs[i];

		if (img.src && !content.imgs.includes(img.src)) {
			console.log(i, img.src);
   			content.imgs.push(img.src);
		}
	}

    	document.getElementsByClassName('pswp__button pswp__button--arrow--right')[0].click();
    	setTimeout(function(){ nextItem(i) }, 2000);
}

function fetchVideo (i = 0) {
	i++;

	// Base case.
	if (i === content.userInfo.video_count) {
		content.vids.forEach(e => console.log(content.vids.length, e, '\n'));
		sendPostData(content);
		return content;
	}

	let vids = document.getElementsByClassName('vjs-tech');
	for (let i = 0; i < vids.length; i++) {
		let vid = vids[i];
		console.log(i, vid.firstElementChild.src);

		if (vid.firstElementChild.src && !content.vids.includes(vid.firstElementChild.src)) {
			console.log(i, vid.firstElementChild.src);
   			content.vids.push(vid.firstElementChild.src);
		}
	}

	document.getElementsByClassName('pswp__button pswp__button--arrow--right')[0].click();
	setTimeout(function(){ fetchVideo(i) }, 50);
}

function scrollToBottom () {
	if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
		console.info('Page fully loaded.');
		return true
	}
	try {
		window.scrollTo(0,document.body.scrollHeight);
		setTimeout(function(){ scrollToBottom(); }, 3000);
	} catch { return true }
	
}

const download = new Promise(function(resolve, reject){
	resolve(scrollToBottom());
	reject(console.error('Failed loading page completely thus failing to download.'));
})

download.then(() => { nextItem }).then(data => sendPostData(data))
