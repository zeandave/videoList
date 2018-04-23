if(process.env.NODE_ENV === 'production'){
  module.exports={mongoURI:'mongodb://<knot>:<k0874480127>@ds255539.mlab.com:55539/video-dev'}
}else{
  module.exports ={mongoURI:'mongodb://localhost/video-dev'}
}