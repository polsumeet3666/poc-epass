const express = require("express");
const db = require("./db/db");
const logger = require("./logging");
const dtlquery = require("./dlt/query");
const dtlInvoke = require("./dlt/invoke");
const router = express.Router();

let logmw = (req, res, next) => {
	logger.info(`url : ${req.url}, host : ${req.hostname}`);
	next();
};

router.get("/", logmw, (req, res) => {
	res.send("hello world");
});

router.post("/pass/create", logmw, async (req, res) => {
	let txnID = req.id;
	let response;
	try {
		let token = await db.insert(txnID, req.body);
		response = getResponse(false, null, token);
	} catch (error) {
		logger.error(error);
		response = getResponse(true, error, null);
	}
	logger.debug(`txn : ${txnID}, time : ${Date.now() - req.txnStart}ms`);
	res.send(response);
});

router.get("/pass/:id", logmw, async (req, res) => {
	let txnID = req.id;
	let response;
	logger.debug(`txn : ${txnID}, id: ${req.params.id}`);
	try {
		let obj = await db.get(txnID, req.params.id);
		response = getResponse(false, null, obj);
		logger.debug(`txn : ${txnID}, res: ${JSON.stringify(obj)}`);
	} catch (error) {
		logger.error(error);
		response = getResponse(true, error, null);
	}

	logger.debug(`txn : ${txnID}, time : ${Date.now() - req.txnStart}ms`);
	res.send(response);
});

function getResponse(isError, err, data) {
	errorMsg = err == null ? "" : err.message;
	return {
		error: isError,
		errorMsg: errorMsg,
		data: data,
	};
}

//dlt
router.get("/dlt/pass/:id", logmw, async (req, res) => {
	let txnID = req.id;
	logger.debug(`txn : ${txnID}, id: ${req.params.id}`);
	let response;
	try {
		result = await dtlquery.query(req.params.id);
		response = getResponse(false, null, result);
	} catch (error) {
		logger.error(error);
		response = getResponse(true, error, null);
	}
	logger.debug(`txn : ${txnID}, time : ${Date.now() - req.txnStart}ms`);
	res.send(response);
});

router.post("/dlt/pass/approve", logmw, async (req, res) => {
	let txnID = req.id;

	let response;
	try {
		result = await dtlInvoke.approveRequest(
			req.body.token,
			req.body.approver
		);
		response = getResponse(false, null, result);
	} catch (error) {
		logger.error(error);
		response = getResponse(true, error, null);
	}
	logger.debug(`txn : ${txnID}, time : ${Date.now() - req.txnStart}ms`);
	res.send(response);
});

module.exports = router;
