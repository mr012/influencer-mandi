// Visual markup preserved from the supplied prototype. Behavior is in adjacent controllers.
export default function RoleSelectionPage({
  wide = false
}) {
  return wide ? <><div className={"dsplit"} data-side={"creator"}><div className={"promo"}><div className={"glow"}></div><div className={"mk2"}>{"Influencer"}<br /><em>{"Mandi"}</em></div><div><h2>{"Find your people."}</h2><p>{"Creators find campaigns worth their time. Brands find creators worth their budget."}</p><p className={"say"}>{"Creators. Brands. Ideas."}</p></div><span className={"lbl"}>{"Real people. Real stories. Real impact."}</span></div><div className={"formside"}><div className={"formcard"}><span className={"lbl"}>{"Welcome to Influencer Mandi"}</span><h3>{"Pick your side"}</h3><span className={"role-choice chosen"}><span className={"lbl"}>{"For the storytellers"}</span><h3>{"I’m a "}<em>{"creator"}</em></h3><p>{"Discover campaigns. Show your work. Connect with brands."}</p><svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinecap={"round"}><circle cx={"12"} cy={"8.5"} r={"3.6"}></circle><path d={"M4.8 20c.9-3.6 3.7-5.5 7.2-5.5S18.3 16.4 19.2 20"}></path></svg></span><span className={"role-choice brand-choice"}><span className={"lbl"}>{"For the businesses"}</span><h3>{"I’m a "}<em>{"brand"}</em></h3><p>{"Find creators. Share your brief. Start a collaboration."}</p><svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinejoin={"round"}><path d={"M4 10v4h3l7 4V6l-7 4H4z"}></path><path d={"M18 9.2a4 4 0 010 5.6"}></path></svg></span><span className={"btn solid"}>{"Continue"}</span><p className={"quiet"}>{"Already part of the mandi? "}<span>{"Log in"}</span></p></div></div></div></> : <><div className={"ph"} data-side={"creator"}><div className={"top"}><span className={"t"}>{"Influencer"}<br />{"Mandi"}</span></div>{"\n  "}<p className={"sup"}>{"Two sides of the same mandi. Pick yours — it decides what you see and what you're seen as."}</p>{"\n  "}<div className={"body"}>{"\n    "}<div className={"row sel"} style={{
          "flexDirection": "column",
          "alignItems": "flex-start",
          "gap": "5px",
          "padding": "17px",
          "flex": "1",
          "justifyContent": "flex-end"
        }}>{"\n      "}<div className={"ttl"} style={{
            "fontSize": "24px"
          }}>{"I'm a "}<span style={{
              "color": "var(--orange)"
            }}>{"creator"}</span></div>{"\n      "}<small style={{
            "fontSize": "11px",
            "color": "var(--grey)"
          }}>{"Browse campaigns. Get picked by brands."}</small></div>{"\n    "}<div className={"row"} style={{
          "flexDirection": "column",
          "alignItems": "flex-start",
          "gap": "5px",
          "padding": "17px",
          "flex": "1",
          "justifyContent": "flex-end"
        }}>{"\n      "}<div className={"ttl"} style={{
            "fontSize": "24px"
          }}>{"I'm a "}<span style={{
              "color": "var(--lime)"
            }}>{"brand"}</span></div>{"\n      "}<small style={{
            "fontSize": "11px",
            "color": "var(--grey)"
          }}>{"Find creators. Run campaigns."}</small></div>{"\n    "}<div className={"btn solid"}>{"Continue"}</div>{"\n  "}</div></div></>;
}
