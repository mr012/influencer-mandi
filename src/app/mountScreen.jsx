import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {screens} from './screenRegistry.jsx';
import ScreenLayout from '../layouts/ScreenLayout.jsx';
const roots = new WeakMap();
export function mountScreen(host, name, wide) {
 const Screen = screens[name];
 if (!Screen) throw new Error('Unknown screen: '+name);
 const root=createRoot(host); roots.set(host,root);
 flushSync(()=>root.render(<ScreenLayout wide={wide}><Screen wide={wide}/></ScreenLayout>));
}
export function unmountScreen(host) {
 const root=roots.get(host);
 if(root){root.unmount(); roots.delete(host);}
 host.remove();
}
