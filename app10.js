//adding error handling

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

const jellybeanBag = {
  mystery: {
    number: 4
  },
  lemon: {
    number: 5
  },
  rootBeer: {
    number: 25
  },
  cherry: {
    number: 3
  },
  licorice: {
    number: 1
  }
};

app.use(morgan('tiny'));
app.use(bodyParser.json());

//refactor the routes to send error to use error handler
app.use('/beans/:beanName', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    // return res.status(404).send('Bean with that name does not exist');
    const error = new Error('Bean with that name does not exis')
    error.status = 400;
    return next(error);
  }
  req.bean = jellybeanBag[beanName];
  req.beanName = beanName;
  next();
})

app.get('/beans/', (req, res, next) => {
  res.send(jellybeanBag);
});

app.post('/beans', (req, res, next) => {
  const body = req.body
  const beanName = body.name;
  if (jellybeanBag[beanName] || jellybeanBag[beanName] === 0) {
    // return res.status(400).send('Bean with that name already exists!');
    const error = new Error('Bean with that name already exists!')
    error.status = 400;
    return next(error);
  }
  const numberOfBeans = Number(body.number) || 0;
  jellybeanBag[beanName] = {
    number: numberOfBeans
  };
  res.send(jellybeanBag[beanName]);
});

app.get('/beans/:beanName', (req, res, next) => {
  res.send(req.bean);
});

app.post('/beans/:beanName/add', (req, res, next) => {  
  const numberOfBeans = Number(req.body.number) || 0;
  req.bean.number += numberOfBeans;
  res.send(req.bean);
});

app.post('/beans/:beanName/remove', (req, res, next) => {
  const numberOfBeans = Number(req.body.number) || 0;
  if (req.bean.number < numberOfBeans) {  
    // return res.status(400).send('Not enough beans in the jar to remove!');
    const error = new Error('Not enough beans in the jar to remove!')
    error.status = 400;
    return next(error);
  }
  req.bean.number -= numberOfBeans;
  res.send(req.bean);
});

app.delete('/beans/:beanName', (req, res, next) => {
  req.bean = null;
  res.status(204).send();
});

app.put('/beans/:beanName/name', (req, res, next) => {
  const newName = req.body.name;
  jellybeanBag[newName] = jellybeanBag[req.beanName];
  jellybeanBag[req.beanName] = null;
  res.send(jellybeanBag[newName]);
});

app.use((err, req, res, next) => {
  if(!err.status) {
    err.status = 500;
  }
  res.status(err.status).send(err.message);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});