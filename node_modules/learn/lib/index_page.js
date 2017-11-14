import fs from 'fs';
import path from 'path';

import Datauri from 'datauri';

export default function indexPage (context) {
  const logo = new Datauri(context.theme.logo);
  const {title, description, exercises, exercisesDir} = context;
  const body = `
    <h1>${title}</h1>
    <p><em>${description}</em></p>
    <ul>
      ${exercises.map(exercise => {
        const baseDir = path.join(exercisesDir, exercise);
        const meta = require(path.join(baseDir, 'exercise'));
        return `<li><a href="/exercise/${exercise}">${meta.name.toUpperCase()}</li>`;
      }).join('\n')}
    </ul>
    <br><br>
    <a href="${context.homePage}"><img src="${logo.content}"/></a>
  `;
  return context.template({title, body});
};
