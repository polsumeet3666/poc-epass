const mongoose = require("mongoose");

var Applicant = mongoose.Schema({
	district: String,
	isinter_state: String,
	name: String,
	essential_service_type: String,
	vehicle_number: String,
	mobile_number: String,
	email_id: String,
	from_date: String,
	to_date: String,
	purpose: String,
	address: String,
	vehicle_type: String,
	starting_point: String,
	destination: String,
	no_co_passenger: String,
	is_home_quarantine: String,
	is_criminial_background: String,
	attached_file: String,
	attachde_document: String,
	token: String,
	status: String,
	approved_by: String,
});

module.exports = Applicant;
