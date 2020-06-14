const Scraper = require('ampritra-scraper');
const request = require('request');
const fetch = require("node-fetch");
const axios = require('axios');


///////////////////////////
// cron
///////////////////////////



	let url = "https://amp-db.herokuapp.com/"


getAll = async () => {
	return await fetch(url + 'all')
		  .then((response) => {
			return response.json();
		  })
		  .then((data) => {
			return data
		  });
	
}

const headers = {
    'Content-Type': 'application/json'
}
		
		
updateOne = async (newData) => {
	const x = await fetch(url + "updateOne", {
            method: 'PUT',
			body: JSON.stringify(newData),
		//	body: newData,
            headers: headers
        })
        .then( res => {
		//	console.log(res)
        //    return res.json()
        })
        .then( res => {
		//	console.log("res " + res)
        })
        .catch(e => console.log(e))
}





getNewData = async () => {
	const item = await getAll()
	console.log(item)
	const target_1 = "https://pupptest.herokuapp.com/getPrice"
	//	const target_2 = "165.22.74.102:5100/getPrice"		
	const target_2 = "https://pupptest.herokuapp.com/getInfo"
		
		
	const newData = async item => {
		const processedURL = encodeURIComponent(item.url)
			try {
				let newPrice = await getCurrentPrice(target_1, processedURL)
				console.log("scraper_1: " + newPrice)
				if(newPrice !== "error" && newPrice !== "undefined"){
					updateOne({
						id: item.id,
						price: newPrice
					})
				} else {
					let secondTry = await getCurrentPrice(target_2, processedURL)
					console.log("scraper_2: " + secondTry)
					if(secondTry !== "error" && newPrice !== "undefined"){
						updateOne({
							id: item.id,
							price: secondTry
						})
					} else {
					//	console.log("both failed")
					}
				}
			} catch (error) {
				console.log("error2")
			}
	}
}


getCurrentPrice = async (target, processedURL) => {
	
		return await axios.post(target, {
			url: processedURL,
		})
		.then(function (response) {
			return response.data.price
		})
		.catch(function (error) {

			return "error"
		});
	
}



// -------------------------------------
getNewData()

