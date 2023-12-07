const express = require('express');
const app = express();
const { mongoose } = require('./db/mongoose')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');


// Route handlers
//list routes

//middleware
app.use(bodyParser.json());

//cors middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    next();
  });


//load the models (mongose)
const { List, Task } = require('./db/models')


app.get('/list', (req, res) => {
    //will return array of list from db
    List.find({}).then((lists) => {
        res.send(lists);
    });
})

app.post('/list', (req, res) => {
    //add new list
    let title = req.body.title;
    

    let newList = new List({
        title  
    }
    );
    newList.save().then((listDoc) => {
        //full list is returned
        res.send(listDoc);
    })

})

app.patch('/list/:id', (req, res) => {
    //update list 
    List.findByIdAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

app.delete('/list/:id', (req, res) => {
    //to delete list
    List.findOneAndDelete({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);
    })

})

//list all task belonging to a specific list
app.get('/list/:listId/tasks', (req, res) => {
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
})

//create task
app.post('/list/:listId/tasks', (req, res) => {
    let newTask = new Task({
        title: req.body.title,
        _listId:req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    })
})

//update task
app.patch('/list/:listid/tasks/:taskId',(req,res)=>{
    Task.findOneAndUpdate({
        _id:req.params.taskId,
        _listId:req.params.listid
    
    },{
        $set:req.body
    }
    ).then(()=>{
        res.sendStatus(200)
    })
})

//delete task
app.delete('/list/:listId/tasks/:Id',(req,res)=>{
    Task.findOneAndDelete({
        _id:req.params.Id,
        _listId: req.params.listId
    }).then((removedTaskDoc)=>{
        res.send(removedTaskDoc);
    })
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log('Server is listening to port 3000')
})