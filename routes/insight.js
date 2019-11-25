var express = require('express');
var request = require('axios');
var logger = require('winston');
var router = express.Router();
const urlConfig = require('../url.json');

/* POST notify */
router.post('/notify', function (req, res, next) {
	console.log(urlConfig.dingTalk.insight)
	// dingtalk webhook
	const dingtalkUrl = urlConfig.dingTalk.insight;

	const params = {
		msgtype: 'text',
		text: {
			content: 'CI 测试@恒哲',
		},
	}

	// dingtalk notify
	request.post(dingtalkUrl, params).then(() => {
		res.send(params);
	}).catch(err => {
		res.status(500).send(err);
	});
});

module.exports = router;
