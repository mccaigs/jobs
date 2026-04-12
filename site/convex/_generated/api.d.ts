/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as crons from "../crons.js";
import type * as githubIngest from "../githubIngest.js";
import type * as http from "../http.js";
import type * as jobReportsMutations from "../jobReportsMutations.js";
import type * as jobReportsQueries from "../jobReportsQueries.js";
import type * as reports from "../reports.js";
import type * as syncLog from "../syncLog.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  crons: typeof crons;
  githubIngest: typeof githubIngest;
  http: typeof http;
  jobReportsMutations: typeof jobReportsMutations;
  jobReportsQueries: typeof jobReportsQueries;
  reports: typeof reports;
  syncLog: typeof syncLog;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
