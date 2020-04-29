// internal
const mongoose = require("mongoose");
const logger = require("../logging");
const applicantSchema = require("./applicant");
const { v4: uuid4 } = require("uuid");
const dltinvoke = require("../dlt/invoke");
let applicantModel = mongoose.model("Applicant", applicantSchema);

let insert = async (txnId, data) => {
	data["token"] = uuid4().toString();
	data["status"] = "";
	data["approved_by"] = "";
	let obj = new applicantModel(data);
	obj = await obj.save();
	//console.log(obj);
	logger.debug(`txnid : ${txnId}, data : ${JSON.stringify(obj)}`);
	await dltinvoke.createRequest(data);
	logger.debug(`txnid : ${txnId}, created in dlt`);
	return obj.token;
};

let get = (txnId, id) => {
	return new Promise((resolve, reject) => {
		applicantModel.findById(id, (err, doc) => {
			if (err) {
				//console.log(err);
				logger.error(err);
				reject(err);
			}
			//return doc;
			logger.debug(`txnid : ${txnId} data : ${JSON.stringify(doc)}`);
			resolve(doc);
		});
	});
};

module.exports = {
	insert,
	get,
};
