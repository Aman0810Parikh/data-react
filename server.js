const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3001;

app.use(cors());
app.use(express.json());
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/CRM', { useUnifiedTopology: true, useNewUrlParser: true });
var conn = mongoose.connection;
conn.on('connected', function () {
    console.log('database is connected successfully');
});
conn.on('disconnected', function () {
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.post('/Create', (req, res, next) => {
    let Data = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "mobile": req.body.mobile,
        "dob": req.body.dob
    };

    console.log(Data);

    mongoose.connection.collection('user').insertOne(Data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("record insert sucessfully");
    });

})

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var Schema = mongoose.Schema;
var DataSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: Number,
    dob: Date
});

var model = mongoose.model('Data', DataSchema, 'user');


app.get('/View', (req, res, next) => {
    model.find({}, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
})

//================================================================================================================================================================================================================================================================================================
app.delete('/View/:_id', function (req, res) {
    model.remove({ _id: req.params._id }, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});

//====================================================================================================================================================================================================================================================

app.put('/View/:_id', function (req, res) {
    model.findOneAndUpdate({ _id: req.params._id }, {
        $set: {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "mobile": req.body.mobile,
            "dob": req.body.dob
        }
    })
        .then(result => {
            res.status(200).json({
                updated_data: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});


//====================================================================================================================================================================================================================================================

