const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const { DateTime } = require('luxon');

module.exports = function (config) {
	config.addPlugin(syntaxHighlight);
	config.addFilter('formatDate', dateObj => {
		return DateTime.fromJSDate(dateObj).toISODate();
	});

	return {
		dir: {
			input: 'src',
			output: 'public'
		}
	};
};
