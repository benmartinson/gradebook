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
import type * as ResendOTPPasswordReset from "../ResendOTPPasswordReset.js";
import type * as assignments from "../assignments.js";
import type * as auth from "../auth.js";
import type * as bedrock from "../bedrock.js";
import type * as chats from "../chats.js";
import type * as classes from "../classes.js";
import type * as componentOverrides from "../componentOverrides.js";
import type * as enrollments from "../enrollments.js";
import type * as grades from "../grades.js";
import type * as http from "../http.js";
import type * as students from "../students.js";
import type * as teachers from "../teachers.js";
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
  ResendOTPPasswordReset: typeof ResendOTPPasswordReset;
  assignments: typeof assignments;
  auth: typeof auth;
  bedrock: typeof bedrock;
  chats: typeof chats;
  classes: typeof classes;
  componentOverrides: typeof componentOverrides;
  enrollments: typeof enrollments;
  grades: typeof grades;
  http: typeof http;
  students: typeof students;
  teachers: typeof teachers;
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
