function sendContent(profile, route = '/') {
	const req = new XMLHttpRequest();
	req.open("POST", `http://127.0.0.1:5000${route}`);
	req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	req.send(JSON.stringify(profile));
	return req.onload = function(rv) { console.info(rv.target.response)}
}