import requireContext from 'require-context.macro';
import { configure } from '@storybook/react';

function loadStories() {
  const req = requireContext('../src', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
