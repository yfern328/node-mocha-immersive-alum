import fs from 'fs';
import path from 'path';

import wrench from 'wrench';
import tildify from 'tildify';
import open from 'open';

import terminalMenu from 'terminal-menu';
import R from 'ramda';

const WIDTH = 72;
const BAR = Array(WIDTH).join('─');
const CLEAR = Array(WIDTH).join(' ');
const LONG_PAUSE = 2500;
const SHORT_PAUSE = 1000;

function choose (context, menu, name, idx) {
  const exercise = context.exercises[idx];
  const src = path.join(context.exercisesDir, exercise);
  const dest = path.join(process.cwd(), exercise);
  let waitForCopy = LONG_PAUSE;
  try {
    fs.lstatSync(dest).isDirectory();
    waitForCopy = 0;
  } catch (e) {
    menu.write(CLEAR);
    menu.write(`Copying files to ${tildify(dest)}...`);
    setTimeout(() => { menu.write(CLEAR) }, LONG_PAUSE);
    wrench.copyDirSyncRecursive(src, dest);
  }
  setTimeout(() => {
    menu.write(CLEAR);
    menu.write('Opening exercise in browser...');
    setTimeout(() => {
      open(`http://localhost:8000/exercise/${exercise}`);
      menu.write(CLEAR);
    }, SHORT_PAUSE);
  }, waitForCopy);
}

function draw (menu, context) {
  menu.reset();
  menu.write(`${context.title}\n`);
  menu.write(`${BAR}\n`);
  context.exercises.forEach(exercise => {
    const baseDir = path.join(context.exercisesDir, exercise);
    const meta = require(path.join(baseDir, 'exercise'));
    menu.add(`▪ ${meta.name.toUpperCase()}`, choose.bind(null, context, menu))
  });
  menu.write(`${BAR}\n`);
  menu.add('EXIT');
  menu.write(`Running exercises will copy files to ${tildify(process.cwd())}`);
}

function setup (context) {
  const menu = terminalMenu({
    width: WIDTH,
    bg: context.bg,
    fg: context.fg,
    padding: {
      left: 4,
      right: 4,
      top: 2,
      bottom: 2
    }
  });
  menu.setMaxListeners(100);
  menu.on('close', function () {
    process.stdin.setRawMode(false);
    process.stdin.end();
    process.exit();
  });
  process.stdin.setRawMode(true);
  process.stdin.pipe(menu.createStream()).pipe(process.stdout);
  return menu;
}

export default function menu (context) {
  const menu = setup({
    bg: context.theme.menuBgColor,
    fg: context.theme.menuFgColor
  });
  menu.on('select', function (command) {
    if (command === 'EXIT') {
      menu.close();
    }
  });
  draw(menu, context);
};
