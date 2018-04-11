import sanitizeHtml from "sanitize-html";

export const filterIframe = dirty => {
  const clean = sanitizeHtml(dirty, {
    allowedTags: ["iframe"],
    allowedAttributes: {
      iframe: [
        "src",
        "data-*",
        "width",
        "height",
        "referrerpolicy",
        "allow",
        "allowfullscreen",
        "frameborder",
        "scrolling",
      ],
    },
    allowedSchemes: ["http", "https"],
    allowedSchemesAppliedToAttributes: ["src"],
    allowProtocolRelative: false,
    allowedIframeHostnames: [
      "www.youtube.com",
      "www.youtube-nocookie.com",
      "player.vimeo.com",
      "w.soundcloud.com",
      "www.google.com",
    ],
    parser: {
      lowerCaseTags: true,
    },
    textFilter: () => "",
  });

  return clean;
};
