const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
	// Emulated passthrough copy
	eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	eleventyConfig.ignores.add("src/_schemas/*");

	eleventyConfig.addPassthroughCopy("./src/*.{css,png}");
	eleventyConfig.addPassthroughCopy("./src/screenshots/*");

	// is-land loaded YouTube embed
	eleventyConfig.addPassthroughCopy({
		"node_modules/@11ty/is-land/is-land.js": "public/is-land.js",
		"node_modules/lite-youtube-embed/src/lite-yt-embed.js": "public/lite-yt-embed.js",
		"node_modules/lite-youtube-embed/src/lite-yt-embed.css": "public/lite-yt-embed.css"
	});

	eleventyConfig.addPlugin(pluginRss);

	eleventyConfig.addFilter("normalize", (subject, delimiter) => {
		if(Array.isArray(subject)) {
			return subject.join(delimiter || ", ");
		}
		return subject;
	});

	eleventyConfig.addFilter("toDateFormat", date => {
		return date.getFullYear();
	});

	eleventyConfig.addShortcode("embedScreenshot", async function(url, title) {
		let remoteUrl = `https://v1.screenshot.11ty.dev/${encodeURIComponent(url)}/opengraph/`
		let metadata = await Image(remoteUrl, {
			widths: [800],
			formats: ["avif", "webp", "jpeg"],
			outputDir: "./_site/screenshots/",
			urlPath: "/screenshots/",
		});

		let imageAttributes = {
			alt: `Screenshot of ${title}`,
			class: "site-screenshot",
			sizes: "(min-width: 37.5em) 50vw, 100vw",
			loading: "lazy",
			decoding: "async",
		};

		// You bet we throw an error on a missing alt (alt="" works okay)
		return Image.generateHTML(metadata, imageAttributes);
	});

	eleventyConfig.addShortcode("embedYouTube", function(slug, label) {
		let fallback = `https://i.ytimg.com/vi/${slug}/maxresdefault.jpg`;

		return `<is-land on:visible>
	<template data-island="once">
		<link rel="stylesheet" href="/public/lite-yt-embed.css">
		<script src="/public/lite-yt-embed.js"></script>
	</template>
	<lite-youtube videoid="${slug}" playlabel="Play${label ? `: ${label}` : ""}" style="background-image:url('${fallback}')">
		<a href="https://youtube.com/watch?v=${slug}" class="lty-playbtn" title="Play Video"><span class="lyt-visually-hidden">Play Video${label ? `: ${label}` : ""}</span></a>
	</lite-youtube>
</is-land>`;
	});

	return {
		dir: {
			input: "src",
		},
	};
};