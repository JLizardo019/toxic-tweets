
let a=[];
let b=[];
let stop=false;
let sentiment;

let keyword1="biden";
let keyword2="trump";

let div = document.getElementById("info");
let button = document.getElementById("submit");
button.addEventListener("click", onClick);

async function setup(){
    let cnv = createCanvas(800,600);
    cnv.parent("canvas");

    // Create a new Sentiment method
    sentiment = ml5.sentiment('movieReviews', modelReady);

    // is it within the canvas
    cnv.mouseOver(inside);
    cnv.mouseOut(out);   

    noStroke();
  
    //getting tweets
    const response = await fetch(`https://toxic-tweets.glitch.me/search/biden`);
    let a_data =  await response.json();

    const response2 = await fetch(`https://toxic-tweets.glitch.me/search/trump`);
    let b_data =  await response2.json();
    

    // getting toxic levels
    const options = {
      
      method:"POST",
      headers: {
            "Content-Type": "application/json"
      },
      body: JSON.stringify(a_data)
    }
    const options2 = {
      
      method:"POST",
      headers: {
            "Content-Type": "application/json"
      },
      body: JSON.stringify(a_data)
    }
        
  
    const response3 = await fetch('/toxicity',options);
    const toxic1 = await response3.json();
  
    const response4 = await fetch('/toxicity',options);
    const toxic2 = await response4.json();
    
    console.log(toxic1);
    let a_stats = [];
    let b_stats = [];
  
  
  
    for (let i =0; i<100; i++){

      const prediction1 = sentiment.predict(a_data[i]);
      const score1 = prediction1.score;
      a_stats.push([a_data[i], score1, toxic1[i].match]);
      
      const prediction2 = sentiment.predict(b_data[i]);
      const score2 = prediction2.score;
      b_stats.push([b_data[i], score2, toxic2[i].match]);
  }
   a_stats.sort(sortFunction);
   b_stats.sort(sortFunction);

    let x = 0;
    let y = 0;
    for (let i =0; i<100; i++){
       // print(i,i%10 == 0);
      if (i%10 == 0){
          y += 60;
          x = 40;
        
        if (i==0){
          y = 30;
        }
      }
      else{
        x= 35*((i%10)+1);
      }

      a.push(new Dot(round(random(0+15, width/2-15)),round(random(0+15,height-15)), a_stats[i][2], "#98c1d9", [0,width/2],x,y, a_stats[i][0], a_stats[i][1]));
      
      b.push(new Dot(round(random(width/2+15, width-15)),round(random(0+15,height-15)), b_stats[i][2], "#98c1d9", [width/2,width],(width/2) +x,y, b_stats[i][0], b_stats[i][1]));
      }
  
  

    
}


function draw(){
  background(240);
  
  push();
  stroke(41, 50, 65,200);
  strokeWeight(5);
  line(400,0,400,height);
  pop();

  push();
  fill(41, 50, 65,80);
  
  textSize(30);
  const x = (width/2 - textWidth(keyword1))/2;
  const y = (height - (textAscent()-textDescent()))/2-40;
  text(keyword1,x,y);
  pop();
  
  push();
  fill(41, 50, 65,80);
  
  textSize(30);
  const x2 = width/2 +(width/2 - textWidth(keyword2))/2;
  const y2 = (height - (textAscent()-textDescent()))/2-40;
  text(keyword2,x2,y2);
  pop();


  if(a && b){
     
    if(stop && mouseX > width/2){
    b.forEach(element => {
      element.display();
      element.align();
      element.hover();
      });
    }
    else{

    b.forEach(element => {
      element.display();
      element.move();
    });
  }
    
   if (stop && mouseX < width/2){
      a.forEach(element => {
        element.display();
        element.align();
        element.hover();
      });   
    }
    else{

    a.forEach(element => {
      element.display();
      element.move();
    });
  }
    
  }
  else{ // loading page
    
  }

}

function inside(){ 
  if (a.length!==0 && b.length!==0){
    stop = true; 
    div.style.display = "block";
  }
  
}

function out(){
  stop = false;
  div.style.display = "none";

  a.forEach(element => {
    element.xdirection = round(random(1,2));
    element.ydirection = round(random(1,2));
    element.xdirection = round(random([-1,1]));
    element.ydirection =round(random([-1,1]));
  });
  b.forEach(element => {
    element.direction = round(random(1,2));
    element.yspeed = round(random(1,2));
    element.xdirection = round(random([-1,1]));
    element.ydirection =round(random([-1,1]));
  });
}

function modelReady() {
  // model is ready
  console.log('Model Loaded!');
}

function onClick(event){
  event.preventDefault();
  submit();
}

async function submit(){
  stop =false;
  let input1 = document.getElementById("word1");
  let input2 = document.getElementById("word2");

  keyword1 = input1.value;
  keyword2 = input2.value;

  if (keyword1 === "" || keyword2 ===""){
    alert("You must enter 2 words before submitting!");
  }
  else{

    a =[];
    b=[];
    //getting tweets
    const response = await fetch(`https://toxic-tweets.glitch.me/search/${keyword1}`);
    let a_data =  await response.json();

    const response2 = await fetch(`https://toxic-tweets.glitch.me/search/${keyword2}`);
    let b_data =  await response2.json();
    

    // getting toxic levels
    const options = {
      
      method:"POST",
      headers: {
            "Content-Type": "application/json"
      },
      body: JSON.stringify(a_data)
    }
    const options2 = {
      
      method:"POST",
      headers: {
            "Content-Type": "application/json"
      },
      body: JSON.stringify(a_data)
    }
        
  
    const response3 = await fetch('/toxicity',options);
    const toxic1 = await response3.json();
  
    const response4 = await fetch('/toxicity',options);
    const toxic2 = await response4.json();
    
    console.log(toxic1);
    let a_stats = [];
    let b_stats = [];
  
  
  
    for (let i =0; i<100; i++){

      const prediction1 = sentiment.predict(a_data[i]);
      const score1 = prediction1.score;
      a_stats.push([a_data[i], score1, toxic1[i].match]);
      
      const prediction2 = sentiment.predict(b_data[i]);
      const score2 = prediction2.score;
      b_stats.push([b_data[i], score2, toxic2[i].match]);
  }
   a_stats.sort(sortFunction);
   b_stats.sort(sortFunction);

    let x = 0;
    let y = 0;
    for (let i =0; i<100; i++){
       // print(i,i%10 == 0);
      if (i%10 == 0){
          y += 60;
          x = 40;
        
        if (i==0){
          y = 30;
        }
      }
      else{
        x= 35*((i%10)+1);
      }

      a.push(new Dot(round(random(0+15, width/2-15)),round(random(0+15,height-15)), a_stats[i][2], "#98c1d9", [0,width/2],x,y, a_stats[i][0], a_stats[i][1]));
      
      b.push(new Dot(round(random(width/2+15, width-15)),round(random(0+15,height-15)), b_stats[i][2], "#98c1d9", [width/2,width],(width/2) +x,y, b_stats[i][0], b_stats[i][1]));
      }
  
  }
  input1.value = "";
  input2.value = "";
}
  
function typing(){
  let input1 = document.getElementById("word1");
  let input2 = document.getElementById("word2");
  input1.value = input1.value.toLowerCase();
  input1.value = input1.value.replace(" ", "-");
  input2.value = input2.value.toLowerCase();
  input2.value = input2.value.replace(" ", "-");
  
  if(input1.value.length >=19){
    input1.value = input1.value.substring(0,20);
  }
  else if (input2.value.length >=19){
    input2.value = input2.value.substring(0,20);
  }

}

function sortFunction(a, b) {
  if (a[1] === b[1]) {
      return 0;
  }
  else {
      return (a[1] < b[1]) ? -1 : 1;
  }
}

class Dot{

  constructor(x, y, rating, color, xboundaries, alignX, alignY, tweet, score)
  {
    this.x = x;
    this.y = y;
    this.xspeed = round(random(1,2));
    this.yspeed = round(random(1,2));
    this.xdirection = round(random([-1,1]));
    this.ydirection =round(random([-1,1]));
    this.size = map(score, 0,1,15,5);
    this.boundaries = xboundaries;
    this.alignX = alignX;
    this.alignY = alignY;
    this.tweet = tweet;
    this.rating = rating;
    this.score = score;

    if (this.rating){
      this.color = "#EE6C4D";
    }
    else{
      this.color = color;
    }
  }

  display(){
    
    fill(this.color);
    ellipse(this.x, this.y, this.size);

  }

  move(){
    if (this.x < this.boundaries[0]+this.size||this.x > this.boundaries[1]-this.size){
      this.xdirection *= -1;
    }
    this.x += this.xspeed * this.xdirection;

    if (this.y < 0 +this.size||this.y > height-this.size){
      this.ydirection *= -1;
    }
    this.y += this.yspeed *  this.ydirection;
  }
  
  align(){
    
    if(this.x !== this.alignX){ // fix vibrating issue
    if (abs(this.x-this.alignX) === 1){
        this.x = this.alignX;
    }
    else if (this.x < this.alignX){
      this.x += this.xspeed;
    }
    else if (this.x > this.alignX){
      this.x -= this.xspeed;
    }
    }
    
    if(this.y !== this.alignY){
      if (abs(this.y-this.alignY) === 1){ // fix vibrating issue
        this.y = this.alignY;
      }
      else if (this.y < this.alignY){
        this.y += this.yspeed;
      }
      else if (this.y > this.alignY){
        this.y -= this.yspeed;
      }
   
    }
    
  }
  
  hover(){
    if(dist(this.x, this.y, mouseX, mouseY) <= this.size){
      
      // highlight circle
      push();
      if(this.color === "#98c1d9"){
        fill("#839fc3");
      }
      else{
        fill("#ec5732");
      }
      ellipse(this.x, this.y, this.size*1.5);
      pop();

    
    div.innerHTML =`<p>${this.tweet}</p><p> Toxic: ${this.rating}</p> <p>Sentiment Score: ${this.score}</p>`
    
    }
  }

  
}