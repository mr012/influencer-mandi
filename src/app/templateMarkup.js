import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { screens } from './screenRegistry.jsx';
export const T = Object.fromEntries(Object.entries(screens).map(([name, Screen]) => [name, {
 get d() { return renderToStaticMarkup(createElement(Screen, {wide:true})); },
 get m() { return renderToStaticMarkup(createElement(Screen, {wide:false})); }
}]));
