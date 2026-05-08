# ADR-002: Feed Tabs Must Not Navigate

## Status

Accepted.

## Context

Feed tabs are part of the runtime surface. If tabs become links to routes, the surface loses scroll, drawer and filter continuity.

## Decision

Feed tabs filter client-side inside the homepage runtime surface.

## Consequences

- Tabs are buttons, not route links.
- Opening a tab does not reload the page.
- Runtime scroll context remains intact.
