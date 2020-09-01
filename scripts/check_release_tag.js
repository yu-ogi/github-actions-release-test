const { execSync } = require("child_process");
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit();
const pkg = require("../package.json");
const version = pkg.version;

const owner = "yu-ogi";
const repo = "github-actions-release-test";
const tag = `v${version}`;

(async () => {
	try {
		await octokit.git.getRef({
			owner,
			repo,
			ref: `tags/${tag}`
		});
		console.log(`tags/${tag} already exists`);
		process.exit();
	} catch (e) {
		if (e.status !== 404) {
			console.error(e);
			process.exit(1);
		}
	}

	try {
		execSync(`git tag -a ${tag} -m ${tag}`);
		execSync(`git push origin ${tag}`);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
})();
