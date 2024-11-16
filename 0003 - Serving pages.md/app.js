const express = require('express');
const ejs = require('ejs');


const app = express();
const port = 3000;


app.get('/', (req, res) => {
    let userName = 'Robby';  
    let data = {
        userName: userName,
    };
    ejs.renderFile('views/index.ejs', data, (err, str) => {
        if (err) {
            res.status(500).send('An error occurred while rendering the page');
        } else {
            res.send(str);
        }
    });
});


app.listen(port, () => {
    console.log('App is listening');
});
