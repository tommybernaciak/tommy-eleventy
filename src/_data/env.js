const environment = process.env.ELEVENTY_ENV;
const PROD_ENV = 'prod';
const isProd = environment === PROD_ENV;
const gId = 'G-QRVYDZPEE0';

module.exports = {
	isProd,
	gId
};
