export default function ScreenLayout({wide, children}) {
 return wide ? <div className="preview-canvas proto">{children}</div> : <div className="mobile-preview scr-m"><div className="preview-canvas mobile-canvas proto">{children}</div></div>;
}
