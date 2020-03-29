const db = require("../models");

module.exports = (app) => {
  
  app.post('/api/exercise/new-user', (req,res)=>{
    db.User.create({userName: req.body.username})
      .then(data => {
      res.json({data});
    });
  });

  app.get('/api/exercise/users', (req,res)=>{
    db.User.find({})
      .then(data => {
      res.json({data});
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
            res.json(user);
          })
      });
  })
      //.catch(err => res.json(err));

  app.get('/api/exercise/log/', (req,res)=>{
    const userId = req.query.userId;
    const queryParams = {_id:userId};
    // set the default options for the populated
    const popMatch = {};
    // if(req.query.limit) popMatch.limit = req.query.limit;
    // if there is a "to" or "from" query, create date object
    if(req.query.to || req.query.from){
      popMatch.date = {};
    }
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

    db.User.findOne(queryParams)
      .populate({
        path: 'exercises',
        match: popMatch,
        // limit the number of returned docs if the limit query is present
        options: {limit: req.query.limit}
      })
      .then(data => {
        // send along the data with an additional "count" key / val pair that 
        // corresponds to the number of returned exercises
        res.json({...data._doc, count: data._doc.exercises.length});
      })
      .catch(err => res.json(err));
  })
};