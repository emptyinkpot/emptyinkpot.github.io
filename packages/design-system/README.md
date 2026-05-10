# Design System

`packages/design-system` is the shared contract for MyBlog interaction quality.

It is not a UI component library yet. It defines the runtime experience tokens that future shadcn/Radix/Vaul/Motion migrations must use.

## Current Status

P0 token contract only.

## Owns

- Motion durations and easing.
- Runtime depth scale.
- Elevation scale.
- Focus ring contract.
- Runtime surface vocabulary.

## Does Not Own

- Data authority.
- Runtime API envelopes.
- KnowledgeObject identity.
- Component implementation.
- Brand copy or content.

## Rule

Do not add a new overlay, drawer, command layer or object-continuity animation without using or extending these tokens.
