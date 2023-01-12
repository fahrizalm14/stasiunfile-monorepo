/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    "intro",
    {
      type: "category",
      label: "Tutorials Basics",
      collapsed: false,
      link: {
        type: "generated-index",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "tutorial-basics", // Generate sidebar slice from docs/tutorials/easy
        },
      ],
    },
    {
      type: "category",
      label: "Tutorials Extras",
      link: {
        type: "generated-index",
        title: "Docusaurus Guides",
        description: "Let's learn about the most important Docusaurus concepts!",
        keywords: ["guides"],
        image: "/img/docusaurus.png",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "tutorial-extras", // Generate sidebar slice from docs/tutorials/easy
        },
      ],
    },
  ],
  faq: [
    "faq",
    {
      type: "autogenerated",
      dirName: "faq",
    },
  ],
};

module.exports = sidebars;
