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

  app.get('/api/exercise/log/:userId', (req,res)=>{
    const userId = req.params.userId;
    db.User.find({_id:userId})
      .populate('exercises')
      .then(data => {
        res.json(data);
      })
      .catch(err => res.json(err));
  })


  

};