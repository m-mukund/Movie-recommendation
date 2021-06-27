const express=require('express');
const app=express();
const path=require('path');
var bodyParser=require("body-parser");
const axios = require('axios');

// To use ejs as template
app.set('view engine','ejs')
// To use views from any directory we use set
app.set('views',path.join(__dirname,'/views'))
//when we use view engine, express assumes our views or templates are in a folder called views


//we use app.use(express.static('public'))
//to include css, js, etc
//where piblic is directory
app.use(express.static(path.join(__dirname,'/public')));


// For parsing application/x-www-form-urlencoded
// tells express to parse form encoded values from the body
// check middleware for json etc
app.use(express.urlencoded({ extended: true }));


app.get('/',(req,res)=>{
    num=2;
    res.render('home',{rand:num})
})


//express params to create the movie pages
//also templating
//also look at string temp literal


function get_recommendations(movie){
    const indices= require('./indices');
    // console.log(indices.title_x)
    const cos_sim=require('./content')
    let sims=[];
    // console.log(indices.title_x)
    for(let x in indices.title_x){
        
        if(indices.title_x[x]==movie){
            // console.log(cos_sim[x])
            for (let y in cos_sim[x]) {
                sims.push([y, cos_sim[x][y]]);
            }
            
            // console.log(sims.slice(1,10))
        }
    }
    sims.sort(function(a, b) {
        return b[1]-a[1];
    });

    let similar_movs=[];
    sims=sims.slice(1,11);
    for(let temp of sims){
        // console.log(temp)
        for(let temp2 in indices.title_x){
            // console.log(temp2)
            if(temp[0]==temp2){
                similar_movs.push(indices.title_x[temp2])
                // console.log(indices.title_x[temp2])
            }
            
        }
    }
    return similar_movs
}

function get_img_url(id){
    return axios.get('https://api.themoviedb.org/3/movie/'+id+'/images?api_key=9e945bd9892e1fc2fa0ea8a2a9b4d685')
    .then(response => {
        // console.log(response.data.backdrops[0].file_path);
        return "http://image.tmdb.org/t/p/w500"+response.data.backdrops[0].file_path;
        // console.log(img_url);
        // return img_url;
    })
    .catch(e=>{
        console.error(e);
        assert.isNotOk(e,'Promise error');
    })
}

app.post('/search',(req,res)=>{
    const movie_name= req.body.moviename;
    // console.log(movie_name)
    let red_link="/"+movie_name;
    res.redirect(red_link)

})

// app.get('/:movie_name',(req,res)=>{

//     // ... for dicts
//     const {subreddit}=req.params;
//     res.render()
// })

app.get('/:movie_name',(req,res)=>{
    const movie_name= req.params.movie_name;
    console.log(movie_name)

    const movies = require("./final");

    // console.log(movies.title_x)
    let similar_movs=get_recommendations(movie_name)
    let img_url;

    // console.log(similar_ind)
    console.log(similar_movs)
    for(let movie in movies.title_x){
        // console.log((movies.genres[movie][0]))
        if(movies.title_x[movie]==movie_name){
            let id=movies.id[movie]
            img_url=get_img_url(id).then(data=>{
                // console.log(data)
                res.render('movie',{movie:movies.title_x[movie], genres:movies.genres[movie],
                    overview:movies.overview[movie],runtime:movies.runtime[movie],director:movies.director[movie],
                    cast:movies.cast[movie], similar:similar_movs,image:data})
                return data;
            })
            .catch(error => {
                console.log(error);
                return ""
            });
            // console.log(img_url);
            // res.render('movie',{movie:movies.title_x[movie], genres:movies.genres[movie],
            //             overview:movies.overview[movie],runtime:movies.runtime[movie],director:movies.director[movie],
            //             cast:movies.cast[movie], similar:similar_movs,image:img_url})
        }
    }
})


//app.put or app.patch to update
// put fully modifies while patch partially modifies


//html forms only support post and get
//requests so we use method-override


app.listen(3000,()=>{
    console.log("Listening in 3000")
})

//Full crud: read, update, del, destroy

//Rest is a set of principles we follow when making a web app


// index => show all
// New => page with form
// Create => create in js
// Show => details of one particular element
// Edit
// Update
// Destroy