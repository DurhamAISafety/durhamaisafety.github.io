import { defineMiddleware } from "astro:middleware";
import { onRequest as originalOnRequest } from "@tinacms/astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const referer = context.request.headers.get("Referer");
  const dest = context.request.headers.get("Sec-Fetch-Dest");
  const cookieHeader = context.request.headers.get("Cookie") || "";
  const hasTinaEditCookie = cookieHeader.includes("__tina_edit=1");

  let shouldBeEditMode = url.searchParams.get("tina-edit") === "1" || hasTinaEditCookie;

  if (!shouldBeEditMode && referer) {
    try {
      const refererUrl = new URL(referer);
      if (
        refererUrl.pathname.includes("/admin/") ||
        refererUrl.hostname === "app.tina.io" ||
        refererUrl.hostname.endsWith(".tina.io")
      ) {
        shouldBeEditMode = true;
      }
    } catch {
      if (referer.includes("tina.io") || referer.includes("/admin/")) {
        shouldBeEditMode = true;
      }
    }
  }

  // Also fallback if we are in an iframe and a referrer is present
  if (!shouldBeEditMode && dest === "iframe" && referer) {
    shouldBeEditMode = true;
  }

  if (shouldBeEditMode) {
    // Spoof the URL of the request so `@tinacms/astro/middleware`'s internal `isEditMode` evaluates to true.
    const originalRequest = context.request;
    const newUrl = new URL(originalRequest.url);
    newUrl.searchParams.set("tina-edit", "1");

    const modifiedRequest = new Proxy(originalRequest, {
      get(target, prop) {
        if (prop === "url") {
          return newUrl.toString();
        }
        const value = Reflect.get(target, prop);
        if (typeof value === "function") {
          return value.bind(target);
        }
        return value;
      }
    });

    context.request = modifiedRequest;
  }

  const response = await originalOnRequest(context, next);
  if (!response || !(response instanceof Response)) {
    return await next();
  }

  // If the response sets the tina edit cookie, relax SameSite restrictions for iframe/preview context
  const setCookie = response.headers.get("Set-Cookie");
  if (setCookie && setCookie.includes("__tina_edit=")) {
    const headers = new Headers(response.headers);
    let relaxedCookie = setCookie;
    
    // In production (HTTPS), use SameSite=None; Secure for cross-site iframe cookies.
    // On localhost, relax to SameSite=Lax.
    if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
      relaxedCookie = setCookie.replace("SameSite=Strict", "SameSite=None; Secure");
    } else {
      relaxedCookie = setCookie.replace("SameSite=Strict", "SameSite=Lax");
    }
    
    headers.set("Set-Cookie", relaxedCookie);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  return response;
});
