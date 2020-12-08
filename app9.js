//incorporating body parser library

//lets import a vetted body parser middleware to replace our body parser function

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

// const bodyParser = (req, res, next) => {
//   let bodyData = '';
//   req.on('data', (data) => {
//     bodyData += data;
//   });
//   req.on('end', () => {
//     if(bodyData) {
//       req.body = JSON.parse(bodyData);
//     }
//     next();
//   });
// }

app.use('/beans/:beanName', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    console.log('Response Sent');
    return res.status(404).send('Bean with that name does not exist');
  }
  req.bean = jellybeanBag[beanName];
  req.beanName = beanName;
  next();
})

app.get('/beans/', (req, res, next) => {
  res.send(jellybeanBag);
});

//we can remove from all post and put routes as it will automatically attach the parsed body to req

// app.post('/beans/', bodyParser, (req, res, next) => {
app.post('/beans', (req, res, next) => {
  const body = req.body
  const beanName = body.name;
  if (jellybeanBag[beanName] || jellybeanBag[beanName] === 0) {
    return res.status(400).send('Bean with that name already exists!');
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

// app.post('/beans/:beanName/add', bodyParser, (req, res, next) => {  
app.post('/beans/:beanName/add', (req, res, next) => {  
  const numberOfBeans = Number(req.body.number) || 0;
  req.bean.number += numberOfBeans;
  res.send(req.bean);
});

// app.post('/beans/:beanName/remove', bodyParser, (req, res, next) => {
app.post('/beans/:beanName/remove', (req, res, next) => {
  const numberOfBeans = Number(req.body.number) || 0;
  if (req.bean.number < numberOfBeans) {  
    return res.status(400).send('Not enough beans in the jar to remove!');
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

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});