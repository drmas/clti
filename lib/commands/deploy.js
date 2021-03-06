var 
string = require('../string.js'),
shell = require('shelljs');

function help () {
	// print any additional arguments
	console.log([
		"Command options:".bold.yellow,
		"",
		"  " + string.rpad("--ios|android", 15) + "Deploys app on an iOS / Android device (for iOS, it uses fruitstrap!)".grey,
		"",
		"  Optional:",
		"  " + string.rpad("--debug", 15) + "Builds using debug configuration (only iOS)".grey,
		"  " + string.rpad("--universal", 15) + "As universal app (only iOS)".grey,
		"  " + string.rpad("--ipad", 15) + "As iPad app (only iOS)".grey
	].join("\n"));
	
	console.log();
}

function execute (argv, cfg, tiapp) {
	if (argv.ios || argv.ipad) {
		shell.silent(false);

		var 
		pwd =  process.cwd(),
		target = tiapp.name + (argv.ipad ? '-iPad' : (argv.universal ? '-universal' : '')),
		configuration = argv.debug ? 'Debug' : 'Release';

		shell.exec('(rm -rf ' + pwd + '/build/iphone/build/' + configuration + '-iphoneos; pushd ' + pwd + '/build/iphone; xcodebuild -target ' + target + ' -configuration ' + configuration + ' -sdk iphoneos -arch "armv6 armv7"; popd)', {
			async: false
		});
		shell.exec(__dirname + '/../../bin/fruitstrap install --bundle=' + pwd + '/build/iphone/build/' + configuration + '-iphoneos/' + tiapp.name + '.app', {
			async: true
		});
	}
	else if (argv.android) {
	}
	else {
		help();
		return;
	}
}

module.exports.execute = execute;
module.exports.help = help;