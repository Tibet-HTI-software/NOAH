/* ==========================================================================
   NOAH — POST /api/upload
   Token-uitgifte voor client-side uploads naar Vercel Blob. De browser
   uploadt daarna rechtstreeks naar Blob, dus grote foto's passeren nooit
   deze function (en raken de 4,5 MB-bodylimiet niet).

   Toegang wordt al afgedwongen door middleware.js: zonder geldig
   noah_access-token komt een request hier niet voorbij (401).
   ========================================================================== */

import { handleUpload } from "@vercel/blob/client";

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
      const body = await request.json();
      const result = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname) => ({
          allowedContentTypes: [
            "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
            "application/pdf",
          ],
          maximumSizeInBytes: 25 * 1024 * 1024, // 25 MB per bestand
          addRandomSuffix: true,
          pathname: `klant/fotos/${pathname.replace(/^\/+/, "")}`,
        }),
        // Geen database bij te werken; de blob-lijst in het Vercel-dashboard
        // ís het overzicht. Callback bewust leeg gelaten.
        onUploadCompleted: async () => {},
      });
      return Response.json(result);
    } catch (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
  },
};
