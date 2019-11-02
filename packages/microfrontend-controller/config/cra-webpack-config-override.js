

const { getAppFile } = require('../utils/fs');

const package = getAppFile('package.json');

const { override, overrideDevServer } = require('customize-cra');

const overrideWebpackConfigs = () => config => {
	config.output.jsonpFunction = package.name;

	if (process.env.NODE_ENV === 'production') {
		if (process.env.IS_MICROFRONTEND) {
			config.output.publicPath = `/microfrontends/${package.name}/`;
		}
	} else {
		if (process.env.IS_MICROFRONTEND) {
			config.output.publicPath = `http://localhost:${process.env.PORT}/`;
		}
	}

	return config;
};

const overrideDevServerConfigs  = () => config => {
	if (process.env.IS_MICROFRONTEND) {
		console.info(require.resolve('./CustomClient'))
		// config.transportMode = {
		// 	client: require.resolve('./CustomClient'),
		// 	server: 'ws'
		// }
		// config.port = '3001';
		// config.sockPath = 'xablau'
		// config.sockHost = `localhost`;

		console.info(config)
	}
	return config;
};

module.exports = {
	webpack: override(
		overrideWebpackConfigs()
	),
	devServer: overrideDevServer(
		// dev server plugin
		overrideDevServerConfigs()
	  )
}