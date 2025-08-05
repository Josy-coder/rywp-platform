/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as careers from "../careers.js";
import type * as contact from "../contact.js";
import type * as crons from "../crons.js";
import type * as emails from "../emails.js";
import type * as events from "../events.js";
import type * as files from "../files.js";
import type * as hubs from "../hubs.js";
import type * as media from "../media.js";
import type * as membership from "../membership.js";
import type * as newsletter from "../newsletter.js";
import type * as organization from "../organization.js";
import type * as partners from "../partners.js";
import type * as projects from "../projects.js";
import type * as publications from "../publications.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  careers: typeof careers;
  contact: typeof contact;
  crons: typeof crons;
  emails: typeof emails;
  events: typeof events;
  files: typeof files;
  hubs: typeof hubs;
  media: typeof media;
  membership: typeof membership;
  newsletter: typeof newsletter;
  organization: typeof organization;
  partners: typeof partners;
  projects: typeof projects;
  publications: typeof publications;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
