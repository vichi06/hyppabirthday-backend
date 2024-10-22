// path: src/api/media-submission/routes/media-submission.ts
export default {
  routes: [
    {
      method: "POST",
      path: "/media-submission/upload",
      handler: "media-submission.createMediaSubmission",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/media-submission",
      handler: "media-submission.find", // Default Strapi find
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/media-submission/:id",
      handler: "media-submission.findOne", // Default Strapi findOne
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/media-submission/:documentId",
      handler: "media-submission.delete",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
