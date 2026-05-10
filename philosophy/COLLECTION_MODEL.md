# Collection Model

Collection is context.

It is not a CMS page, directory page, or replacement homepage.

## Allowed Collection Roles

- focus the feed
- open a ReaderSession
- provide compact TOC/context rail
- connect objects for graph/search
- preserve reading continuity

## Basis Rules

| Basis | Static Page | Homepage Card | Role |
| --- | --- | --- | --- |
| folder | yes | yes | reading session lens |
| series | yes | yes | reading session lens |
| topic | no | no | metadata/search/Graph dimension |

Topic collections are intentionally not static reading pages. They can exist in the runtime index for search and graph, but they must not become `/collections/topic-*` pages.

## Forbidden

- collection-only homepage
- card recursion
- drawer card wall
- topic collection static route generation
- collection route takeover as primary flow
