import { withPlausibleProxy } from "next-plausible";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withPlausibleProxy({
  src: "https://plausible.mozzius.dev/js/pa-ddPvAEXP4BI-FAyhPPuCD.js",
})(nextConfig);
