import handlebars from 'handlebars';

import server from './lib/server';
import menu from './lib/menu';

export default function learn(config) {
  if (!config) {
    throw new Error('No configuration supplied.');
  }
  if (!config.exercisesDir) {
    throw new Error('No exercises directory provided in configuration.');
  }
  if (!config.exercises) {
    throw new Error('No exercise list provided in configuration.');
  }
  if (!config.title) {
    throw new Error('No title provided in configuration.');
  }
  if (!config.description) {
    throw new Error('No description provided in configuration.');
  }
  const markdownCss = require.resolve
  const {title, description, homePage, theme, exercises, exercisesDir} = config;
  const template = handlebars.compile(config.template);
  const context = {
    title,
    description,
    homePage,
    theme,
    template,
    exercises,
    exercisesDir
  };
  return {
    server: server(context).listen(8000),
    menu: menu(context)
  };
}
