const { securityHeaders } = require('../security/shield');
const { validateRequest, sanitizeInput } = require('../security/protection');
const { applyCors } = require('../security/cors');

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 */

/**
 * @param {IncomingMessage} req
 * @returns {Record<string, string>}
 */
function parseQuery(req) {
	const query = {};
	const raw = (req.url || '/').split('?')[1] || '';

	if (!raw) return query;

	for (const part of raw.split('&')) {
		if (!part) continue;

		const [key, value = ''] = part.split('=');
		if (!key) continue;

		try {
			query[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
		} catch {
			continue;
		}
	}

	return query;
}

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {() => void} next
 */
function applyProductionSecurity(req, res, next) {
	applyCors(req, res, () => {
		securityHeaders(req, res, () => {
			validateRequest(req, res, () => {
				req.query = parseQuery(req);
				next();
			});
		});
	});
}

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {() => void} next
 * @param {Array<Function>} middlewares
 */
function runStack(req, res, next, middlewares) {
	let index = 0;

	const step = () => {
		const middleware = middlewares[index];
		index += 1;

		if (!middleware) {
			next();
			return;
		}

		middleware(req, res, step);
	};

	step();
}

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {() => void} next
 */
function requestGuard(req, res, next) {
	const url = req.url || '/';

	if (url.includes('\0') || url.includes('..')) {
		res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
		res.end('Forbidden');
		return;
	}

	next();
}

module.exports = {
	applyProductionSecurity,
	parseQuery,
	requestGuard,
	runStack,
	sanitizeInput
};
