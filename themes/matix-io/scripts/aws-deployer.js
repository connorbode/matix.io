var exec = require('child_process').spawn;
var fs   = require('fs');
var path = require('path');

hexo.extend.deployer.register('aws-s3', function (deploy) {
	var script = path.join(path.dirname(fs.realpathSync(__filename)), '..', 'scripts-sh', 'aws-deployer.sh');
	var log = this.log;
	log.info('=> START SHELL SCRIPT OUTPUT');
	var proc = exec('bash', [script]);

	return new Promise((resolve, reject) => {
		var out = '';
		var err = '';

		function bufferLog(buf, data) {
			buf += data.toString();
			if (buf.substr(buf.length - 1) === '\n') {
				buf = buf.substr(0, buf.length - 1);
				return [true, buf];
			}

			return [false, buf];
		}

		proc.stdout.on('data', (data) => {
			var outputData = bufferLog(out, data);
			if (outputData[0]) {
				log.info(`==> ${outputData[1]}`);
			} else {
				out = outputData[1];
			}
		});

		proc.stderr.on('data', (data) => {
			var outputData = bufferLog(err, data);
			if (outputData[0]) {
				log.error(`==> ${outputData[1]}`);
			} else {
				err = outputData[1];
			}
		})

		proc.on('close', (code) => {
			log.info('=> END SHELL SCRIPT OUTPUT')
			resolve();
		})
	});
});