const express = require('express');
const multer = require("multer")
const converter = require("docx-pdf");
const zip = require("express-zip");


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('Static'))

const uploads = multer({ dest: 'Files/' })


app.post('/', uploads.array("words", 20), (req, res) => {
	var output = [];
	var len = req.files.length
	req.files.forEach((file) => {
			converter(file.path, `PDF/${file.filename}.pdf`, (err, result) => {
				if (err) {
					console.log(err);
				}
				else {
					const item = {
						path : result.filename,
						name : `${file.filename}.pdf`
					}
					output.push(item);
				}
			}
			)
		}
	)
	while (output[len - 1] === undefined) {
		require('deasync').sleep(100);
	}
	res.zip(output)
})

app.listen(PORT, (error) => {
	if (!error)
		console.log("Server is Successfully Running At " + PORT)
	else
		console.log("Error occurred, server can't start", error);
}
);
