// Visual markup preserved from the supplied prototype. Behavior is in adjacent controllers.
export default function AdminLoginPage({
  wide = false
}) {
  return wide ? <><div className={"dsplit"} data-side={"creator"}><div className={"promo"}><div className={"glow"}></div><div className={"mk2"}>{"Influencer"}<br /><em>{"Mandi"}</em></div><div><h2>{"Team Kabira."}</h2><p>{"Internal operations for accounts, verification, campaigns and support."}</p><p className={"say"}>{"Creators. Brands. Ideas."}</p></div><span className={"lbl"}>{"Internal workspace"}</span></div><div className={"formside"}><div className={"formcard"}><span className={"lbl"}>{"Admin"}</span><h3>{"Admin login"}</h3><div className={"fld"}><span className={"lbl"}>{"Work email"}</span>{"\n  "}<div className={"in"}>{"ops@teamkabira.com"}</div></div><div className={"fld"}><span className={"lbl"}>{"Password"}</span>{"\n  "}<div className={"in"}>{"••••••••••"}</div></div><span className={"btn solid"}>{"Log in"}</span><p className={"quiet"}>{"Team Kabira · Internal access only"}</p></div></div></div></> : <><div className={"ph"} data-side={"creator"}><div className={"top"}><span className={"t"}>{"Admin"}</span></div>{"\n  "}<div className={"body mid"}><div className={"fld"}><span className={"lbl"}>{"Email"}</span>{"\n  "}<div className={"in"}>{"ops@teamkabira.com"}</div></div><div className={"fld"}><span className={"lbl"}>{"Password"}</span>{"\n  "}<div className={"in"}>{"••••••••••"}</div></div><div className={"btn solid"}>{"Log in"}</div>{"\n  "}<p className={"sup"} style={{
          "textAlign": "center",
          "margin": "0"
        }}>{"Internal. Desktop only."}</p></div></div></>;
}
