import AuthFooter from "../../components/auth/AuthFooter.jsx";
// Visual markup preserved from the supplied prototype. Behavior is in adjacent controllers.
export default function VerifyCodePage({
  wide = false
}) {
  return wide ? <><div className={"dsplit auth-layout"} data-side={"creator"}><div className={"promo"}><div className={"glow"}></div><div className={"mk2"}>{"Influencer"}<br /><em>{"Mandi"}</em></div><div><h2>{"One small check."}</h2><p>{"Verify your email before you start meeting your next collaborators."}</p></div><span className={"lbl"}>{"Real people. Real stories. Real impact."}</span></div><div className={"formside"}><div className={"formcard"}><span className={"lbl"}>{"Welcome to Influencer Mandi"}</span><h3>{"Enter code"}</h3><p className={"para"}>{"Enter the code sent to "}<b>{"ananya@example.com"}</b>{"."}</p><div className={"code-box"}>{"7 K Q 2 X B"}</div><span className={"btn solid"}>{"Verify email"}</span><p className={"quiet"}>{"Resend code in 30 seconds"}</p><span className={"btn ghost"}>{"Change email"}</span></div><AuthFooter /></div></div></> : <><div className={"ph auth-layout"} data-side={"creator"}><div className={"top"}><span className={"bk"}><svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M15 5l-7 7 7 7"}></path></svg></span><span className={"t"}>{"Enter code"}</span></div>{"\n  "}<p className={"sup"}>{"We sent a code to "}<b>{"ananya@example.com"}</b></p>{"\n  "}<div className={"body mid"}>{"\n    "}<div className={"fld act"}><div className={"in"} style={{
            "height": "64px",
            "justifyContent": "center",
            "fontFamily": "var(--display)",
            "fontSize": "25px",
            "letterSpacing": ".32em"
          }}>{"7KQ2XB"}</div></div>{"\n    "}<div className={"btn solid"}>{"Verify"}</div>{"\n    "}<p className={"sup"} style={{
          "textAlign": "center",
          "margin": "0"
        }}>{"Resend in 30s"}</p>{"\n  "}</div><AuthFooter showImpact /></div></>;
}
