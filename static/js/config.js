export default {
	"host": { "base_url": "127.0.0.1", "port": 5000 },
	"page_scroll": { "iter_speed": 3000 },
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
			"iter_speed": 200 
		},
		"video": {
			"download": true,
			"iter_speed": 400
		},
		"archived": {
			"download": true,
			"iter_speed": 200 
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
