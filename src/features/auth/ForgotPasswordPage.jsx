// Visual markup preserved from the supplied prototype. Behavior is in adjacent controllers.
export default function ForgotPasswordPage({
  wide = false
}) {
  return wide ? <><div className={"dsplit"} data-side={"creator"}><div className={"promo"}><div className={"glow"}></div><div className={"mk2"}>{"Influencer"}<br /><em>{"Mandi"}</em></div><div><h2>{"Let’s get you back in."}</h2><p>{"Use your account email to start resetting your password."}</p><p className={"say"}>{"Creators. Brands. Ideas."}</p></div><span className={"lbl"}>{"Real people. Real stories. Real impact."}</span></div><div className={"formside"}><div className={"formcard"}><span className={"lbl"}>{"Welcome to Influencer Mandi"}</span><h3>{"Forgot password"}</h3><div className={"fld"}><span className={"lbl"}>{"Account email"}</span>{"\n  "}<div className={"in"}>{"ananya@example.com"}</div></div><p className={"para"}>{"We’ll send reset instructions to this email if it belongs to an account."}</p><span className={"btn solid"}>{"Send reset link"}</span><span className={"btn ghost"}>{"Back to log in"}</span></div></div></div></> : <><div className={"ph"} data-side={"creator"}><div className={"top"}><span className={"bk"}><svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M15 5l-7 7 7 7"}></path></svg></span><span className={"t"}>{"Forgot password"}</span></div>{"\n  "}<div className={"body mid"}>{"\n    "}<div className={"fld"}><span className={"lbl"}>{"Email"}</span>{"\n  "}<div className={"in"}>{"ananya@example.com"}</div></div>{"\n    "}<div className={"btn solid"}>{"Send reset link"}</div>{"\n    "}<p className={"scrawl"} style={{
          "textAlign": "center"
        }}>{"no leaks."}</p>{"\n    "}<p className={"sup"} style={{
          "textAlign": "center",
          "margin": "0"
        }}>{"If that email is registered, we've sent a link."}</p>{"\n  "}</div></div></>;
}
