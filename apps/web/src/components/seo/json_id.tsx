import type { ReactElement } from "react";

// The only sanctioned way to emit JSON-LD on fluxlearn pages.
// Use this Server Component instead of writing raw <script> tags.

export function JsonLd({
  json,
}: {
  json: Record<string, unknown>;
}): ReactElement {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify with no replacer is safe - we encode the inner braces
      // so the closing </script> sequence cannot terminate the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(json).replace(/</g, "\\u003c"),
      }}
    />
  );
}
