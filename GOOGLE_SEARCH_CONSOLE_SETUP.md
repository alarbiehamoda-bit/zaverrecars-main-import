# Google Search Console Setup After Publishing

## Readiness status

ZAVERRE already serves the two discovery endpoints needed for the connection: `/sitemap.xml` and `/robots.txt`. The robots file declares the sitemap and prevents crawling of `/admin` and `/api/`. The verification must wait until the site is published on its final public domain because a property must match the actual domain or URL prefix used in search.

> Search Console verification remains valid only while Google can confirm the verification token. Keep the chosen DNS record, file, or tag in place after success. [1]

## Recommended property choice

| Final hosting situation | Recommended Search Console property | Verification method | Why |
| --- | --- | --- |
| A custom domain is connected, such as `zaverrecar.com` | **Domain property** | DNS TXT record | Covers all subdomains and protocol variants in one property; Google documents DNS as the verification path for this property type. [2] |
| The site remains on a Manus subdomain or DNS access is unavailable | **URL-prefix property** for the exact published `https://…/` address | HTML meta tag or HTML file supplied by Google | Targets precisely the deployed URL prefix and can be verified without editing the domain's DNS. [1] |

## Execution checklist

| Step | Owner | Action | Success condition |
| --- | --- | --- | --- |
| 1 | Site owner | Publish the latest checkpoint and decide the canonical public URL. | `https://YOUR-DOMAIN/` returns the ZAVERRE homepage. |
| 2 | Site owner | Open [Search Console](https://search.google.com/search-console/welcome), select **Add property**, and enter the final domain or exact URL prefix. | The intended property appears in the selector. [2] |
| 3 | Site owner | Copy the verification token shown by Google. For a domain property, add the exact DNS TXT record. For a URL-prefix property, provide the HTML meta tag or verification-file name to the development workflow. | Google reports ownership verified. [1] |
| 4 | Site owner and developer | Keep the verification mechanism live; use a second method where practical as a recovery path. | Ownership remains robust if one token source changes. [1] |
| 5 | Site owner | In **Sitemaps**, submit `sitemap.xml` against the verified property. | The Sitemaps report reports a readable sitemap and discovered URLs. [3] |
| 6 | Site owner | Inspect the homepage and one vehicle URL in **URL Inspection**, then request indexing only after confirming the final public content. | Google can fetch the page and see the published canonical URL. |

## Values to use after publication

Replace the placeholder with the final published domain. Do not submit the temporary local URL or a development preview URL.

| Item | Value |
| --- | --- |
| Property (custom domain) | `zaverrecar.com` — enter without protocol for a Domain property. |
| Property (hosted subdomain) | `https://YOUR-PUBLISHED-SUBDOMAIN.manus.space/` — enter exactly, including protocol and trailing slash. |
| Sitemap submission | `https://YOUR-FINAL-DOMAIN/sitemap.xml` or the `sitemap.xml` path in the Sitemaps report. |
| Robots verification | `https://YOUR-FINAL-DOMAIN/robots.txt` should contain the sitemap reference and the existing administration exclusions. |

## Post-connection checks

Google notes that data can take several days to begin accumulating after a property is added. Sitemap submission is a discovery hint, not an indexing guarantee; use the Sitemaps report to review fetching and parsing status. [2] [3] [4]

After the first crawl, review the Page indexing and Enhancements reports for unexpected exclusions, then review Performance after enough data has accumulated. Do not remove the ownership token, alter the final canonical host, or redirect the sitemap without updating the property and retesting the endpoints.

## References

[1] [Google Search Console Help — Verify your site ownership](https://support.google.com/webmasters/answer/9008080?hl=en)

[2] [Google Search Console Help — Add a website or platform property](https://support.google.com/webmasters/answer/34592?hl=en)

[3] [Google Search Console Help — Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=en)

[4] [Google Search Central — Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
