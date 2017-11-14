import fs from 'fs';
import path from 'path';

import marked from 'marked';

export default function exercisePage (context, exercise) {
  const baseDir = path.join(context.exercisesDir, exercise);
  const meta = require(path.join(baseDir, 'exercise'));
  const title = meta.title;
  const overview = fs.readFileSync(path.join(baseDir, 'overview.md'));
  const body = `
    <a href="/">BACK</a> | <a href="/files/${exercise}">VIEW FILES</a>
    <div class="exercise">
    ${marked(overview.toString())}
    </div>
    <a href="/">BACK</a> | <a href="/files/${exercise}">VIEW FILES</a>
  `;
  return context.template({title, body});
};
