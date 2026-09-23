

export const seedThreads = () => ({
  c1: [{
    me: false,
    t: "Hi Ananya! Loved your cafe reels. Are you free the week of the 1st?",
    at: "10:32 AM"
  }, {
    me: true,
    t: "Yes — mornings work best for shoots.",
    at: "10:34 AM"
  }, {
    me: false,
    t: "Perfect. We'll send the brief and a call sheet today.",
    at: "10:35 AM"
  }],
  c4: [{
    me: false,
    t: "Your Bandra breakfast reel is exactly the energy for Hidden gems.",
    at: "Yesterday"
  }, {
    me: true,
    t: "Love that. How many spots are you thinking?",
    at: "Yesterday"
  }],
  u1: [{
    me: true,
    t: "Hi Ananya! Loved your cafe reels. Are you free the week of the 1st?",
    at: "10:32 AM"
  }, {
    me: false,
    t: "Yes — mornings work best for shoots.",
    at: "10:34 AM"
  }],
  u3: [{
    me: true,
    t: "Meher, the festive edit would look great on your grid.",
    at: "Mon"
  }, {
    me: false,
    t: "Thank you! Can you share the lookbook?",
    at: "Mon"
  }, {
    me: true,
    t: "Sending it over now.",
    at: "Mon"
  }]
});
export const replyFor = v => /budget|rate|₹|price/i.test(v) ? "That works for us — I'll confirm the number in the brief." : /when|date|time|week/i.test(v) ? "That timing works. Sending a calendar hold." : "Sounds good. Let's lock it in.";
