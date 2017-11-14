import path from 'path';

import express from 'express';
import serveIndex from 'serve-index';
import serveStatic from 'serve-static';

import indexPage from './index_page';
import exercisePage from './exercise_page';

function webserver (context) {
  const exercises = context.exercises;
  const app = express();
  app.get('/', (req, res) => {
    res.send(indexPage(context));
  });
  app.use('/files', serveIndex(context.exercisesDir, { icons:true }));
  app.use('/files', serveStatic(context.exercisesDir));
  exercises.forEach(exercise => {
    app.get(`/exercise/${exercise}`, (req, res) => {
      res.send(exercisePage(context, exercise));
    });
  });
  return app;
}

module.exports = webserver
