const express = require("express");
const multer = require("multer");
// const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
// app.use(bodyParser.json());

//Normal Image Upload
const upload = multer({
    storage: multer.diskStorage({
        destination:function(req,file,cb)
        {
            cb(null,"uploads")
        },
        filename:function(req,file,cb)
        {
            cb(null,file.fieldname+"_"+Date.now()+".jpg")
        }
    })
}).single("file");

app.post('/api/fileUpload', upload, (req, resp) => {
            resp.json({ Status: 201, Data: true, Message: "Success" });
    });

//Base64 image upload
app.post('/api/base64ImageUpload', (req, res) => {
    const { base64Image } = req.body;  
    if (!base64Image) {
      return res.status(400).json({ error: 'Missing base64Image in the request body' });
    }  
    // Decode base64 image and save it to a file
    const data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(data, 'base64');  

    // Specify the directory where you want to save the file
    const uploadDir = path.join(__dirname, 'uploads');
    const fileName = `uploaded_image_${Date.now()}.png`; 
    const filePath = path.join(uploadDir, fileName);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving the image' });
      }  
      return res.json({ message: 'Image uploaded successfully', fileName });
    });
  });

app.listen(5000);
