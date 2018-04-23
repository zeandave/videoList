if(process.env.NODE_ENV === 'production'){
  module.exports={mongoURI:'mongodb://<knot>:<11362>@ds255539.mlab.com:55539/video-dev'}
}else{
  module.exports ={mongoURI:'mongodb://localhost/video-dev'}
}