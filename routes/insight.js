var express = require('express');
var request = require('axios');
var logger = require('winston');
var router = express.Router();
const urlConfig = require('../url.json');

router.options('/notify', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'content-type')
	res.send();
})

/* POST notify */
router.post('/notify', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');

	const message = req.body.data;

	// dingTalk hook url
	const dingTalkUrl = urlConfig.dingTalk.insight;

	const params = {
		msgtype: 'text',
		text: {
			content: message,
		},
	}

	console.log('receive:', message)

	// dingTalk notify
	request.post(dingTalkUrl, params).then(() => {
		res.send(params);
	}).catch(err => {
		res.status(500).send(err);
	});
});

module.exports = router;
