var express = require('express');
var request = require('axios');
var logger = require('winston');
var router = express.Router();

/* POST github notify */
router.post('/notify', function(req, res, next) {
	const dingtalkUrl = req.query.dingtalk;
	const type = req.headers['x-github-event'];
	const {
		action,
		comment,
		issue,
		sender,
		repository,
	} = req.body;
	const user = sender.login;
	
	let params = null;

	if (type === 'issue_comment' && action === 'created') {
		// create a issue comment
		const issueTitle = issue.title;
		const issueUrl = issue.html_url;

		params = {
			msgtype: 'markdown',
			markdown: {
				title: `${user} 在 ${issueTitle} 下发表了评论`,
				text: `${user} 在 [${issueTitle}](${issueUrl}) 下发表了评论：\n > ${comment.body}`,
			}
		}
	}

	if (type === 'issues' && action === 'opened') {
		const issueTitle = issue.title;
		const issueUrl = issue.html_url;
		const repoName = repository.name;
		
		params = {
                        msgtype: 'markdown',
                        markdown: {
                                title: `${user} 在 ${repoName} 下添加了 issue`,
                                text: `${user} 在 ${repoName} 下添加了 issue：[${issueTitle}](${issueUrl})`,
                        }
                }		
        }

	if (!params) {
		return res.send('no content');
	}
	
	request.post(dingtalkUrl, params).then(() => {
		res.send(params);
	}).catch(err => {
		res.send(err);
	});
});

module.exports = router;
