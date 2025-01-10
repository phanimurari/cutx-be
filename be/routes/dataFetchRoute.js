// importing packages
const express = require('express');
const router = express.Router();
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

router.get(`/`, async function (req, res) {
	const url = 'https://randomuser.me/api/';
	const options = {
		method: 'GET',
	};

	try {
		let response = await fetch(url, options);
		let responseJson = await response.json();
		const user = responseJson?.results[0];

		const { age } = user.dob;
		const eligibility = age < 30 ? "Low-interest student loans available"
			: age < 50 ? "Competitive mortgage rates just for you"
			: "Secure your retirement with our senior loans";

		const filteredResponse = {
			picture: user.picture.thumbnail,
			name: `${user.name.first} ${user.name.last}`,
			age: user.dob.age,
			location: {
				city: user.location.city,
				country: user.location.country
			},
			nationality: user.nat,
			email: user.email,
			eligibility
		};

		res.status(200).json(filteredResponse);
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: `Internal Server Error.` });
	}
});
module.exports = router;