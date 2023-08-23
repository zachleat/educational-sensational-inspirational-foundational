const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
	eleventyConfig.ignores.add("src/_schemas/*");

	eleventyConfig.addPassthroughCopy("./src/style.css");
	eleventyConfig.addPassthroughCopy("./src/logo.png");

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

	return {
    dir: {
      input: "src",
    },
  };
};