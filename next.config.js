module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "images.pexels.com", "dropbox.com"],
    loader: "imgix",
    path: "",
  },
  env: {
    NEXT_PUBLIC_URL : process.env.NEXT_PUBLIC_URL,
  }
};
