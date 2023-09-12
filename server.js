
const dotenv = require("dotenv").config();
const express=require("express"); 
const fetch =require("node-fetch");
const cors = require('cors');

const tf_node = require('@tensorflow/tfjs-node');
// tf_node.setBackend('cpu');
// const tf = require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');
const app = express();
app.use(express.static(__dirname+'/public')); 
app.use(cors());
app.use(express.json());

//  tf_node.setBackend('cpu');
// console.log(tf_node.getBackend());
app.get("/search/:word",async (req,res) =>{
    let word = req.params.word;

    console.log("getting recent tweets with word:",word);
    
    fetch(`https://api.twitter.com/2/tweets/search/recent?query=${word}&max_results=100`, {headers:{"Authorization": `Bearer ${process.env.BEARER_TOKEN}`}})
    .then(function (response){
        return response.json();
    })
    .then(function(data){

        // extract tweets into array
        const t_info = data.data;
      console.log(t_info);
        const t_arr = [];
        t_info.forEach(element => {
          t_arr.push(element.text);
        });

        console.log("sending tweets")
        res.json(t_arr);
    })
    .catch(function (error){
        console.log("error", error);
    })
    
});

app.post('/toxicity', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ',req.body);
    
    let tweets = req.body;
  
    const threshold = 0.9;

        // determine toxicity
        toxicity.load(threshold).then(model => {
            
            console.log("loading");
            model.classify(tweets).then(predictions => {
            // `predictions` is an array of objects, one for each prediction head,
            // that contains the raw probabilities for each input along with the
            // final prediction in `match` (either `true` or `false`).
            // If neither prediction exceeds the threshold, `match` is `null`.
        
            // console.log(predictions);
            const t_toxic = predictions[6].results;
            console.log(t_toxic);
            res.json(t_toxic);
            });
        });
    
});

app.get("/biden",async (req,res) =>{
    console.log("getting recent tweets with biden");
    
    fetch("https://api.twitter.com/2/tweets/search/recent?query=biden&max_results=100", {headers:{"Authorization": `Bearer ${process.env.BEARER_TOKEN}`}})
    .then(function (response){
        return response.json();
    })
    .then(function(data){
        // extract tweets into array
        const b_info = data.data;
        const b_arr = [];
        b_info.forEach(element => {
        b_arr.push(element.text);
        });

        const threshold = 0.9;

        // determine toxicity
        toxicity.load(threshold).then(model => {
            const sentences = b_arr;
            console.log("loading");
            model.classify(sentences).then(predictions => {
            // `predictions` is an array of objects, one for each prediction head,
            // that contains the raw probabilities for each input along with the
            // final prediction in `match` (either `true` or `false`).
            // If neither prediction exceeds the threshold, `match` is `null`.
        
            console.log(predictions);
            const b_toxic = predictions[6].results.match;
            res.json({"tweets":b_arr, "ratings":b_toxic});
            });
        });
    })
    .catch(function (error){
        console.log("error", error);
    })
    
});

app.listen(3000, ()=> {
    console.log("listening on port localhost:3000");
  });


