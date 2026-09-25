import AuthFooter from "../../components/auth/AuthFooter.jsx";
// Visual markup preserved from the supplied prototype. Behavior is in adjacent controllers.
export default function RoleSelectionPage({
  wide = false
}) {
  return wide ? <><div className={"dsplit"} data-side={"creator"}><div className={"promo"}><div className={"glow"}></div><div className={"mk2"}>{"Influencer"}<br /><em>{"Mandi"}</em></div><div><h2>{"Find your people."}</h2><p>{"Creators find campaigns worth their time. Brands find creators worth their budget."}</p><p className={"say"}>{"Creators. Brands. Ideas."}</p></div><span className={"lbl"}>{"Real people. Real stories. Real impact."}</span></div><div className={"formside"}><div className={"formcard"}><span className={"lbl"}>{"Welcome to Influencer Mandi"}</span><h3>{"Pick your side"}</h3><span className={"role-choice chosen"}><span className={"lbl"}>{"For the storytellers"}</span><h3>{"I’m a "}<em>{"creator"}</em></h3><p>{"Discover campaigns. Show your work. Connect with brands."}</p><svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinecap={"round"}><circle cx={"12"} cy={"8.5"} r={"3.6"}></circle><path d={"M4.8 20c.9-3.6 3.7-5.5 7.2-5.5S18.3 16.4 19.2 20"}></path></svg></span><span className={"role-choice brand-choice"}><span className={"lbl"}>{"For the businesses"}</span><h3>{"I’m a "}<em>{"brand"}</em></h3><p>{"Find creators. Share your brief. Start a collaboration."}</p><svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinejoin={"round"}><path d={"M4 10v4h3l7 4V6l-7 4H4z"}></path><path d={"M18 9.2a4 4 0 010 5.6"}></path></svg></span><span className={"btn solid"}>{"Continue"}</span><p className={"quiet"}>{"Already part of the mandi? "}<span>{"Log in"}</span></p></div></div></div></> : <div className="ph auth-layout home-page" data-side="creator">
    <header className="home-hero">
      <div className="home-logo">Influencer<br /><em>Mandi</em></div>
      <h1>Find your people.</h1>
      <p>Creators find campaigns worth their time. Brands find creators worth their budget.</p>
    </header>
    <div className="home-choices">
      <span className="lbl">Welcome to Influencer Mandi</span>
      <h2>Pick your side</h2>
      <button type="button" className="role-choice chosen" data-act="side:creator">
        <span className="lbl">For the storytellers</span>
        <h3><span>I'm a</span><em>creator</em></h3>
        <p>Discover campaigns. Show your work. Connect with brands.</p>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="12" cy="8.5" r="3.6" /><path d="M4.8 20c.9-3.6 3.7-5.5 7.2-5.5S18.3 16.4 19.2 20" /></svg>
      </button>
      <button type="button" className="role-choice brand-choice" data-act="side:brand">
        <span className="lbl">For the businesses</span>
        <h3><span>I'm a</span><em>brand</em></h3>
        <p>Find creators. Share your brief. Start a collaboration.</p>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M4 10v4h3l7 4V6l-7 4H4z" /><path d="M18 9.2a4 4 0 010 5.6" /></svg>
      </button>
      <button type="button" className="btn solid" data-act="go:signup">Continue</button>
      <p className="quiet">Already part of the mandi? <span data-act="go:login">Log in</span></p>
    </div>
    <AuthFooter showImpact />
  </div>;
}

