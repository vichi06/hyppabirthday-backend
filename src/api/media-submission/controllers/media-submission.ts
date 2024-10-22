/**
 * media-submission controller
 */

import { factories } from "@strapi/strapi";
import { Context } from "koa";

export default factories.createCoreController(
  "api::media-submission.media-submission",
  {
    async createMediaSubmission(ctx: Context) {
      const { type, birthdayId, quote } = ctx.request.body;

      // Ensure the user is authenticated
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("You need to be logged in");

      // Check if the person (birthday account) exists
      const birthday = await strapi.db.query("api::birthday.birthday").findOne({
        where: { id: birthdayId },
      });
      if (!birthday) return ctx.badRequest("Birthday not found");

      // Handle file uploads if it's an image or video submission
      if (type === "image" || type === "video") {
        const file = ctx.request.files?.file; // Assuming the file comes from a form-data request

        if (!file) return ctx.badRequest("No file uploaded");

        // Upload file to Strapi media library
        const uploadedFiles = await strapi.plugins[
          "upload"
        ].services.upload.upload({
          data: { fileInfo: { alternativeText: "Uploaded media" } },
          files: file,
        });

        if (!uploadedFiles || !uploadedFiles[0])
          return ctx.internalServerError("File upload failed");

        // Create media submission in the database
        const submission = await strapi.entityService.create(
          "api::media-submission.media-submission",
          {
            data: {
              type,
              [type === "image" ? "image" : "video"]: uploadedFiles[0].id, // Attach the media file
              //   submittedBy: user.id,
              birthday: birthdayId,
            },
          }
        );

        return ctx.send({ submission });
      }

      // Handle quote submission
      if (type === "quote") {
        const submission = await strapi.entityService.create(
          "api::media-submission.media-submission",
          {
            data: {
              type,
              quote: JSON.parse(quote),
              //   submittedBy: user.id,
              birthday: birthdayId,
            },
          }
        );

        return ctx.send({ submission });
      }

      return ctx.badRequest("Invalid submission type");
    },
    async delete(ctx: Context) {
      const { documentId } = ctx.params;

      try {
        // Find the MediaSubmission entry by documentId
        const mediaSubmission = await strapi
          .documents("api::media-submission.media-submission")
          .findOne({
            documentId: documentId,
            populate: { image: true, video: true },
          });

        // Check if MediaSubmission entry exists
        if (!mediaSubmission) {
          return ctx.notFound("MediaSubmission not found");
        }

        // Get the media id from the mediaSubmission entry
        const media = mediaSubmission.image ?? mediaSubmission.video; // Adjust according to your actual relation field structure

        // Delete the MediaSubmission entry
        await strapi
          .documents("api::media-submission.media-submission")
          .delete({ documentId: documentId });

        // Delete the associated media file from the media library
        await strapi.plugins["upload"].services.upload.remove(media);

        return ctx.send({
          message: "MediaSubmission and associated media deleted successfully.",
        });
      } catch (error) {
        console.error(error);
        return ctx.internalServerError("Unable to delete MediaSubmission");
      }
    },
  }
);
