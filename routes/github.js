var express = require('express');
var request = require('axios');
var logger = require('winston');
var router = express.Router();

// github event type
const GITHUB_EVENT_TYPE = {
	ISSUES: 'issues',
	ISSUE_COMMENT: 'issue_comment',
};

// event action
const ACTION = {
	CREATED: 'created',
	OPENED: 'opened',
};

/* POST github notify */
router.post('/notify', function (req, res, next) {
	const eventType = req.headers['x-github-event'];
	// dingtalk webhook
	const dingtalkUrl = req.query.dingtalk;

	const {
		action,
		comment,
		issue,
		sender,
		repository,
	} = req.body;

	const user = sender.login;

	let params = null;

	if (eventType === GITHUB_EVENT_TYPE.ISSUES && action === ACTION.OPENED) {
		// opened a issue
		const repoName = repository.name;
		const issueTitle = issue.title;
		const issueUrl = issue.html_url;
		params = {
			msgtype: 'markdown',
			markdown: {
				title: `${user} 在 ${repoName} 下添加了 issue`,
				text: `${user} 在 ${repoName} 下添加了 issue：[${issueTitle}](${issueUrl})`,
			}
		}
	}

	if (eventType === GITHUB_EVENT_TYPE.ISSUE_COMMENT && action === ACTION.CREATED) {
		// created a issue comment
		const issueTitle = issue.title;
		const issueUrl = issue.html_url;
		const commentBody = comment.body || '';
		const lines = commentBody.split('\r\n');
		let summary = lines.slice(0, 10);

		if (lines.length > 10) {
			summary.push(`......[更多](${issueUrl})`);
		}

		summary = summary.map(line => `> ${line}`).join('\r\n');

		params = {
			msgtype: 'markdown',
			markdown: {
				title: `${user} 在 ${issueTitle} 下发表了评论`,
				text: `${user} 在 [${issueTitle}](${issueUrl}) 下发表了评论：\r\n ${summary}`,
			}
		}
	}

	if (!params) {
		return res.status(400).send('not supported event type');
	}

	// dingtalk notify
	request.post(dingtalkUrl, params).then(() => {
		res.send(params);
	}).catch(err => {
		res.status(500).send(err);
	});
});

module.exports = router;