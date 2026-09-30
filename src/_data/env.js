const environment = process.env.ELEVENTY_ENV;
const PROD_ENV = 'prod';
const isProd = environment === PROD_ENV;
const gId = 'G-QRVYDZPEE0';
const currentYear = new Date().getFullYear();

module.exports = {
	isProd,
	gId,
	currentYear
};
