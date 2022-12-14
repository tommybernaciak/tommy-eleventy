const environment = process.env.ELEVENTY_ENV;
const PROD_ENV = 'prod';
const isProd = environment === PROD_ENV;
const gId = 'UA-96253829-1';

module.exports = {
	isProd,
	gId
};
