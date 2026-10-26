export const site = {
  name: "Tadabbur Studio",
  description:
    "A free app to learn the 99 names of Allah, one a day: memorize them, understand them, and live by them. Coming soon. Join the list and get the free book of all 99 Names.",
  youtube: "https://youtube.com/@tadabburstudio-19x",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
};

export const book = {
  title: "99 Names: Know Him, Call on Him",
  // The PDF is a static file in /public (Vercel can't send a 4.8 MB file through a function, the cap is 4.5 MB).
  // It sits in a folder with a random name, and /api/book only redirects to it after checking the personal link.
  // To rotate: rename the folder in /public/b and change `folder` here.
  folder: "3ffc373f535d384b",
  file: "99-Names-Know-Him-Call-on-Him.pdf",
  get path() {
    return `/b/${this.folder}/${this.file}`;
  },
};
