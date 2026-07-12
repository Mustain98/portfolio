# public/

**Action needed: drop your `CV.pdf` here.**

The Resume button in the nav and the hero both link to `/CV.pdf`, which resolves to
`public/CV.pdf`. That file is not in the repo yet — until you add it, those links 404.

Name it exactly `CV.pdf`, or change `profile.resume` in [`data/profile.ts`](../data/profile.ts)
to match whatever you name it.
