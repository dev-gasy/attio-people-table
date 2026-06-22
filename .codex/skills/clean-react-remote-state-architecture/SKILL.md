---
name: clean-react-remote-state-architecture
description: Scaffold, implement, or refactor React remote-state features into a strict five-layer TanStack Query architecture. Use when adding or changing API requests, lookup services, data-fetching hooks, query/mutation integrations, DTO mappings, or remote state in a browser React SPA.
---

# Clean React Remote State Architecture

Build every remote-state domain as an isolated, five-file module. Keep API contracts, transformations, transport, TanStack configuration, and component hooks separate.

## Required module shape

Create exactly these files in `src/services/<domain-name>/`:

```text
<domain-name>.types.ts     # DTO and UI-model contracts
<domain-name>.mapper.ts    # Pure DTO <-> model transformations
<domain-name>.service.ts   # HTTP operations over raw DTOs
<domain-name>.options.ts   # Query keys plus queryOptions/mutationOptions
<domain-name>.queries.ts   # React-facing useQuery/useMutation hooks
```

Use the singular entity for symbols (`contactService`, `ContactDTO`) and the hyphen-free domain name already established by the codebase for filenames. Do not create inline fetches, monolithic API files, or additional files inside the domain module. Place tests outside the module if the project keeps tests in source control.

## Boundary rules

Enforce these imports and responsibilities:

| Layer | May depend on | Must not contain or depend on |
| --- | --- | --- |
| UI component | `*.queries.ts`, `*.types.ts` | `*.service.ts`, `*.mapper.ts`, `*.options.ts`, HTTP details |
| `*.queries.ts` | TanStack hooks and `*.options.ts` | parsing, formatting, mapping, layout, direct HTTP |
| `*.options.ts` | TanStack factories, service, mapper | React layout or UI-specific behavior |
| `*.service.ts` | DTO types and injected HTTP client | UI models, React, mapper, TanStack |
| `*.mapper.ts` | DTO/model types | I/O, mutable global state, React |
| `*.types.ts` | nothing when practical | runtime behavior |

Treat DTOs as raw API contracts, including snake_case keys, nullable values, nesting, and wire-format strings. Treat models as clean component-facing values. Perform all normalization, fallbacks, flattening, parsing, and presentation-safe formatting in the mapper, never in the service, options, hooks, or components.

## Implement the five layers

Adapt names, method parameters, endpoints, and contracts to the requested domain. Preserve this dependency direction and use type-only imports for contracts.

### 1. Types

```ts
export interface ContactDTO {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email_address: string | null;
}

export interface ContactModel {
  id: string;
  displayName: string;
  email: string | null;
}

export interface UpdateContactInput {
  firstName: string;
  lastName: string;
}
```

Declare request input types here when they are part of the feature contract. Keep response DTOs distinct from UI models even when their initial shapes happen to match.

### 2. Mapper

```ts
import type { ContactDTO, ContactModel, UpdateContactInput } from "./contact.types";

export const contactMapper = {
  toModel(dto: ContactDTO): ContactModel {
    return {
      id: dto.id,
      displayName: [dto.first_name, dto.last_name].filter(Boolean).join(" ") || "Unnamed contact",
      email: dto.email_address,
    };
  },

  toUpdateDTO(input: UpdateContactInput): Pick<ContactDTO, "first_name" | "last_name"> {
    return {
      first_name: input.firstName,
      last_name: input.lastName,
    };
  },

  toEmptyModel(): ContactModel {
    return { id: "", displayName: "", email: null };
  },
};
```

Keep every mapper function deterministic and side-effect free. Add request mapping only when the UI input contract differs from the API payload contract.

### 3. Service

```ts
import type { ContactDTO } from "./contact.types";

export class ContactService {
  constructor(private readonly httpClient: typeof fetch) {}

  async getById(id: string): Promise<ContactDTO> {
    const response = await this.httpClient(`/api/contacts/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch contact data for ID: ${id}`);
    }
    return response.json() as Promise<ContactDTO>;
  }

  async update(id: string, body: Pick<ContactDTO, "first_name" | "last_name">): Promise<ContactDTO> {
    const response = await this.httpClient(`/api/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Failed to update contact data for ID: ${id}`);
    }
    return response.json() as Promise<ContactDTO>;
  }
}

export const contactService = new ContactService(window.fetch.bind(window));
```

Use the injected client in every request. Return only raw DTOs from the service. The default singleton targets browser SPAs; do not introduce SSR-specific composition unless the task explicitly requires it.

### 4. Options

```ts
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { contactMapper } from "./contact.mapper";
import { contactService } from "./contact.service";
import type { UpdateContactInput } from "./contact.types";

export const contactOptions = {
  all: () => ["contacts"] as const,

  detail: (id: string) =>
    queryOptions({
      queryKey: [...contactOptions.all(), "detail", id] as const,
      queryFn: () => contactService.getById(id),
      select: contactMapper.toModel,
      staleTime: 1000 * 60 * 5,
    }),

  update: (id: string) =>
    mutationOptions({
      mutationKey: [...contactOptions.all(), "update", id] as const,
      mutationFn: async (input: UpdateContactInput) =>
        contactMapper.toModel(
          await contactService.update(id, contactMapper.toUpdateDTO(input)),
        ),
    }),
};
```

Centralize keys here. Use `queryOptions` for reads and `mutationOptions` for writes. Map query responses only through `select`; map mutation variables before service calls and map mutation responses before returning them. Choose cache timing and invalidation targets based on the feature’s stated consistency needs; use five minutes only when no requirement exists.

### 5. Queries

```ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { contactOptions } from "./contact.options";

export const useContact = (id: string) => useQuery(contactOptions.detail(id));

export const useUpdateContact = (id: string) =>
  useMutation(contactOptions.update(id));
```

Expose concise, domain-named hooks only. Components consume these hooks and models/types; they never compose TanStack options or call services themselves. Add hook-level cache invalidation only when the requested write must refresh a known query, using the options key factory rather than hard-coded keys.

## Completion checks

Before finishing, verify all of the following:

- The feature directory has exactly the five required source files.
- DTOs never escape the service/options boundary into components; components receive models.
- Mappers have focused unit tests covering representative normalization and fallback cases.
- Service tests or mocks cover successful and non-OK HTTP responses.
- Query and mutation hooks use the centralized options, keys are stable, and requested invalidation/refetch behavior works.
- Run the project’s typecheck, lint, and relevant test commands when available.
