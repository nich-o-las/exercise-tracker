const db = require("../models");

module.exports = (app) => {
  
  app.post('/api/exercise/new-user', (req,res)=>{
    db.User.create({userName: req.body.username})
      .then(data => {
      const returnData = {
        username:data.userName,
        _id: data._id
      };
      res.json(returnData);
    });
  });

  app.get('/api/exercise/users', (req,res)=>{
    db.User.find({})
      .then(data => {
      const returnData = [];
      data.forEach((o,i) =>{
        returnData.push({
          username: o.userName, 
          _id: o._id
        });
      });
      res.json(returnData);
    });
  });

  app.post('/api/exercise/add', (req,res)=>{
    if(!req.body.date) req.body.date = undefined;
    db.Exercise.create(req.body)
      .then(data => {
        db.User.findOne({ _id: data.userId })
          .populate('exercises')
          .then(user => {
            user.exercises.push(data)
            user.save()
            const returnData = {
              username : user.userName,
              description: req.body.description,
              duration: req.body.duration,
              _id: data._id,
              date: data.date
            }
            res.json(returnData);
          })
          .catch(err => res.json(err))
      });
  })

  app.get('/api/exercise/log/', (req,res)=>{
    const userId = req.query.userId;
    // set the default options for the populated
    const popMatch = {};
    // if(req.query.limit) popMatch.limit = req.query.limit;
    // if there is a "to" or "from" query, create date object
    if(req.query.to || req.query.from){
      popMatch.date = {};
      // if there is "from" query, make it into a date obj and insert it
      // into the popMatch.date object
      if(req.query.from){
        startDate = new Date(req.query.from);
        // setUTCHours() instead of setHOURS() to ignores local timezone
        startDate.setUTCHours(0);
        popMatch.date.$gte = startDate;
      }
      // if there is "to" query, make it into a date obj and insert it
      // into the popMatch.date object
      if(req.query.to){
        endDate = new Date(req.query.to);
        endDate.setUTCHours(23, 59, 59);
        popMatch.date.$lt = endDate;
      }
    }

    db.User.findOne({_id: userId})
      .populate({
        path: 'exercises',
        // only matches the params where the 
        match: popMatch,
        // limit the number of returned docs if the limit query is present
        // sort workouts by newest first
        options: {limit: req.query.limit, sort : {date: -1}},
      })
      .then(data => {
        // send along the data with an additional "count" key / val pair that 
        // corresponds to the number of returned exercises
        const returnData = {
          username: data._doc.username,
          _id: data._doc._id,
          log: data._doc.exercises,
          count: data._doc.exercises.length
        }
        res.json(returnData);
      })
      .catch(err => res.json(err));
  })
};