import express from 'express';
import { jsPDF } from "jspdf";
import fs from 'fs';
import AWS from 'aws-sdk';
import sendLinkEmail from './sendLinkEmail.js';

const s3 = new AWS.S3({
    accessKeyId: PUT_YOUR_AWS_ACCESS_KEY_HERE,
    secretAccessKey: PUT_YOUR_AWS_SECRET_ACCESS_KEY_HERE,
});

const app = express();
app.get("/", async function(req, res) {
    //1. CREATE A PDF  
    const doc = new jsPDF();
    await doc.text("Hello world!", 10, 10);
    await doc.text("Hello world!", 10, 20);
    await doc.save("a4.pdf");

    //2. READ THE PDF FROM LOCAL SYSTEM, SEND TO S3
    fs.readFile(process.cwd()+"/a4.pdf", (err, data) => {
        if (err) throw err;
        const params = {
            Bucket: 'pointful-bucket', // pass your bucket name
            Key: 'a4.pdf', // file will be saved as testBucket/contacts.csv
            Body: data
        };
        s3.upload(params, function(s3Err, data) {
            if (s3Err) throw s3Err
            console.log(`File uploaded successfully at ${data.Location}`)
            //3. SEND S3 LINK VIA EMAIL
            sendLinkEmail(data.Location, INSERT_RECIPIENT_EMAIL_HERE);
            res.send(data);
        });
     });
    
});

app.listen(4564, () => {
    console.log('Server running on port 4564');
    }
);