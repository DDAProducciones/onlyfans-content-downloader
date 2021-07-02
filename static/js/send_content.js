import config from './config.js'

function sendContent(content, route = '/') {
	const req = new XMLHttpRequest();
	req.open("POST", `http://localhost:5000${route}`);
	req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	req.send(JSON.stringify(content));
	return req.onload = function(rv) { console.info(rv.target.response)}
}