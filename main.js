const fs = require("fs")
const https = require("https")

const date = new Date()
date.setHours(0,0,0,0)
date.setYear(date.getYear() - 1)
const start_of_today = Math.round(date.valueOf() / 1000)

const generate_ticker_url = ticker => {
	const current_time = Math.round(new Date().valueOf() / 1000)
	return `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`
	// return `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}` +
	// 		"?symbol=%5EDJI" +
	// 		`&period1=${start_of_today}` +
	// 		`&period2=${current_time}` +
	// 		"&interval=1m" +
	// 		"&includePrePost=true" +
	// 		"&events=div%7Csplit%7Cearn" +
	// 		"&lang=en-US" +
	// 		"&region=US" +
	// 		"&crumb=ceRA8UAXtQK" +
	// 		"&corsDomain=finance.yahoo.com"
}


const options = {
	headers: {
		Cookie: "B=b7cadkteks3vu&b=3&s=t0; thamba=1; PRF=t%3D%255EDJI; GUCS=AV_XcUFH; GUC=AQEBAQFdT1teJEIh6QUC&s=AQAAAFvaZu1m&g=XU4R6g"
	}
}
const get_data = (ticker) => new Promise((resolve, reject) => {
	const url = generate_ticker_url(ticker)
	https.get(url, (resp) => {
		let data = ''
		resp.on('data', (chunk) => {
			// A chunk of data has been recieved.
			data += chunk
		}).on('end', () => {
			// The whole response has been received. Print out the result.
			resolve(JSON.parse(data))
		});
	}).on("error", (err) => {
		console.log("ERROR: " + err.message)
	})
})


const sybmols = process.argv.slice(2)
sybmols.forEach(symbol => {
	get_data(symbol).then(data => {
		const path = `output/${symbol}.json`
		fs.writeFileSync(path, JSON.stringify(data, null, 4), 'utf8')
		console.log("Written to: ", path)
	})
})

