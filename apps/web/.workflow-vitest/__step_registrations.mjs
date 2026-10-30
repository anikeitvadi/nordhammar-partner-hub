// biome-ignore-all lint: generated file
/* eslint-disable */
import { createRequire as __createRequire } from "node:module";
import { fileURLToPath as __fileURLToPath } from "node:url";
import { dirname as __pathDirname } from "node:path";
var require = __createRequire(import.meta.url);
var __filename = __fileURLToPath(import.meta.url);
var __dirname = __pathDirname(__filename);

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/.pnpm/@workflow+utils@5.0.2/node_modules/@workflow/utils/dist/global-singleton.js
function globalSingleton(name, shapeVersion, create) {
  const key = /* @__PURE__ */ Symbol.for(`${name}/v${shapeVersion}`);
  const store = globalThis;
  const existing = store[key];
  if (existing !== void 0) {
    return existing;
  }
  const created = create();
  store[key] = created;
  return created;
}
var init_global_singleton = __esm({
  "../../node_modules/.pnpm/@workflow+utils@5.0.2/node_modules/@workflow/utils/dist/global-singleton.js"() {
    __name(globalSingleton, "globalSingleton");
  }
});

// ../../node_modules/.pnpm/@workflow+utils@5.0.2/node_modules/@workflow/utils/dist/parse-name.js
function parseName(tag, name) {
  if (typeof name !== "string") {
    return null;
  }
  const [prefix, moduleSpecifier, ...functionNameParts] = name.split("//");
  if (prefix !== tag || !moduleSpecifier || functionNameParts.length === 0) {
    return null;
  }
  const functionName = functionNameParts.join("//");
  let shortName = functionName.split("/").at(-1) ?? "";
  let moduleShortName = "";
  if (moduleSpecifier.startsWith("./")) {
    moduleShortName = moduleSpecifier.split("/").at(-1) ?? "";
  } else {
    const withoutVersion = moduleSpecifier.split("@").slice(0, -1).join("@") || moduleSpecifier.split("@")[0];
    moduleShortName = withoutVersion?.split("/").at(-1) ?? "";
  }
  if ([
    "default",
    "__default"
  ].includes(shortName) && moduleShortName) {
    shortName = moduleShortName;
  }
  return {
    shortName,
    moduleSpecifier,
    functionName
  };
}
function parseWorkflowName(name) {
  return parseName("workflow", name);
}
function parseStepName(name) {
  return parseName("step", name);
}
function formatStepName(name) {
  return formatParsedName(parseStepName(name), name);
}
function formatWorkflowName(name) {
  return formatParsedName(parseWorkflowName(name), name);
}
function workflowDisplayName(name) {
  return parseWorkflowName(name)?.shortName ?? shortNameFromSanitized("workflow", name) ?? name;
}
function shortNameFromSanitized(tag, name) {
  if (!name.startsWith(`${tag}--`)) return null;
  const segments = name.split("--").filter(Boolean);
  const functionPart = segments.at(-1);
  let shortName = functionPart?.split("-").filter(Boolean).at(-1) ?? "";
  if ([
    "default",
    "__default"
  ].includes(shortName)) {
    const moduleShortName = segments.at(-2)?.split("-").filter(Boolean).at(-1);
    if (moduleShortName && moduleShortName !== tag) {
      shortName = moduleShortName;
    }
  }
  return shortName || null;
}
function formatParsedName(parsed, fallback) {
  if (!parsed) return fallback;
  return `${parsed.shortName} (${parsed.moduleSpecifier})`;
}
var init_parse_name = __esm({
  "../../node_modules/.pnpm/@workflow+utils@5.0.2/node_modules/@workflow/utils/dist/parse-name.js"() {
    __name(parseName, "parseName");
    __name(parseWorkflowName, "parseWorkflowName");
    __name(parseStepName, "parseStepName");
    __name(formatStepName, "formatStepName");
    __name(formatWorkflowName, "formatWorkflowName");
    __name(workflowDisplayName, "workflowDisplayName");
    __name(shortNameFromSanitized, "shortNameFromSanitized");
    __name(formatParsedName, "formatParsedName");
  }
});

// ../../node_modules/.pnpm/@workflow+utils@5.0.2/node_modules/@workflow/utils/dist/pluralize.js
function pluralize(singular, plural, count) {
  return count === 1 ? singular : plural;
}
var init_pluralize = __esm({
  "../../node_modules/.pnpm/@workflow+utils@5.0.2/node_modules/@workflow/utils/dist/pluralize.js"() {
    __name(pluralize, "pluralize");
  }
});

// ../../node_modules/.pnpm/@workflow+utils@5.0.2/node_modules/@workflow/utils/dist/promise.js
function withResolvers() {
  let resolve;
  let reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    promise,
    resolve,
    reject
  };
}
function once(fn) {
  const result = {
    get value() {
      const value = fn();
      Object.defineProperty(result, "value", {
        value
      });
      return value;
    }
  };
  return result;
}
var init_promise = __esm({
  "../../node_modules/.pnpm/@workflow+utils@5.0.2/node_modules/@workflow/utils/dist/promise.js"() {
    __name(withResolvers, "withResolvers");
    __name(once, "once");
  }
});

// ../../node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js
var require_ms = __commonJS({
  "../../node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse5(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
    };
    function parse5(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    __name(parse5, "parse");
    function fmtShort(ms2) {
      var msAbs = Math.abs(ms2);
      if (msAbs >= d) {
        return Math.round(ms2 / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms2 / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms2 / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms2 / s) + "s";
      }
      return ms2 + "ms";
    }
    __name(fmtShort, "fmtShort");
    function fmtLong(ms2) {
      var msAbs = Math.abs(ms2);
      if (msAbs >= d) {
        return plural(ms2, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms2, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms2, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms2, msAbs, s, "second");
      }
      return ms2 + " ms";
    }
    __name(fmtLong, "fmtLong");
    function plural(ms2, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
    }
    __name(plural, "plural");
  }
});

// ../../node_modules/.pnpm/@workflow+utils@5.0.2/node_modules/@workflow/utils/dist/time.js
function parseDurationToDate(param) {
  const date = durationToDate(param);
  if (Number.isNaN(date.getTime())) {
    throw new Error(typeof param === "object" ? "Invalid date: the Date object does not hold a valid time." : `Invalid duration: ${JSON.stringify(param)} ends past the latest time a Date can represent.`);
  }
  return date;
}
function durationToDate(param) {
  if (typeof param === "string") {
    const durationMs = (0, import_ms.default)(param);
    if (typeof durationMs !== "number" || durationMs < 0) {
      throw new Error(`Invalid duration: "${param}". Expected a valid duration string like "1s", "1m", "1h", etc.`);
    }
    return new Date(Date.now() + durationMs);
  } else if (typeof param === "number") {
    if (param < 0 || !Number.isFinite(param)) {
      throw new Error(`Invalid duration: ${param}. Expected a non-negative finite number of milliseconds.`);
    }
    return new Date(Date.now() + param);
  } else if (param instanceof Date || param && typeof param === "object" && typeof param.getTime === "function") {
    return param instanceof Date ? param : new Date(param.getTime());
  } else {
    throw new Error(`Invalid duration parameter. Expected a duration string, number (milliseconds), or Date object.`);
  }
}
var import_ms;
var init_time = __esm({
  "../../node_modules/.pnpm/@workflow+utils@5.0.2/node_modules/@workflow/utils/dist/time.js"() {
    import_ms = __toESM(require_ms(), 1);
    __name(parseDurationToDate, "parseDurationToDate");
    __name(durationToDate, "durationToDate");
  }
});

// ../../node_modules/.pnpm/@workflow+utils@5.0.2/node_modules/@workflow/utils/dist/index.js
var init_dist = __esm({
  "../../node_modules/.pnpm/@workflow+utils@5.0.2/node_modules/@workflow/utils/dist/index.js"() {
    init_global_singleton();
    init_parse_name();
    init_pluralize();
    init_promise();
    init_time();
  }
});

// ../../node_modules/.pnpm/@workflow+errors@5.0.5/node_modules/@workflow/errors/dist/error-codes.js
var RUN_ERROR_CODES;
var init_error_codes = __esm({
  "../../node_modules/.pnpm/@workflow+errors@5.0.5/node_modules/@workflow/errors/dist/error-codes.js"() {
    RUN_ERROR_CODES = {
      /** Error thrown in user workflow or step code */
      USER_ERROR: "USER_ERROR",
      /** Internal runtime error (missing timestamps, runtime invariant failures) */
      RUNTIME_ERROR: "RUNTIME_ERROR",
      /** Event log contains orphaned or mismatched events and cannot be replayed */
      CORRUPTED_EVENT_LOG: "CORRUPTED_EVENT_LOG",
      /** One replay could not consume the event log deterministically; retryable */
      REPLAY_DIVERGENCE: "REPLAY_DIVERGENCE",
      /** Run exceeded the maximum number of queue deliveries */
      MAX_DELIVERIES_EXCEEDED: "MAX_DELIVERIES_EXCEEDED",
      /** Run exceeded the maximum number of events per run */
      MAX_EVENTS_EXCEEDED: "MAX_EVENTS_EXCEEDED",
      /** Workflow replay exceeded the maximum allowed duration */
      REPLAY_TIMEOUT: "REPLAY_TIMEOUT",
      /** Workflow stream infrastructure failed while reading or writing data */
      STREAM_ERROR: "STREAM_ERROR",
      /** World response violated the SDK contract and cannot be retried safely */
      WORLD_CONTRACT_ERROR: "WORLD_CONTRACT_ERROR",
      /** Run was delivered to a deployment other than the one it is pinned to */
      DEPLOYMENT_MISMATCH: "DEPLOYMENT_MISMATCH"
    };
  }
});

// ../../node_modules/.pnpm/@workflow+errors@5.0.5/node_modules/@workflow/errors/dist/index.js
function isError(value) {
  return typeof value === "object" && value !== null && "name" in value && "message" in value;
}
function appendFramedDetails(title, details) {
  if (details.length === 0) return title;
  const lines = [
    title
  ];
  details.forEach((detail, index) => {
    const isLast = index === details.length - 1;
    const head = isLast ? "\u2570\u25B6 " : "\u251C\u25B6 ";
    const cont = isLast ? "   " : "\u2502  ";
    const text = `${detail.label}: ${detail.value}`;
    text.split("\n").forEach((line, i2) => {
      lines.push(`${i2 === 0 ? head : cont}${line}`);
    });
  });
  return lines.join("\n");
}
function buildFramedDetails(hint2, slug) {
  const out = [];
  if (hint2) out.push({
    label: "hint",
    value: hint2
  });
  if (slug) out.push({
    label: "docs",
    value: `${BASE_URL}/${slug}`
  });
  return out;
}
var BASE_URL, ERROR_SLUGS, WorkflowError, WorkflowWorldError, WorkflowRunFailedError, WorkflowRunNotCompletedError, WorkflowRuntimeError, RuntimeDecryptionError, SerializationError, StepNotRegisteredError, WorkflowNotRegisteredError, WorkflowRunNotFoundError, HookConflictError, HookForceClaimedError, HookNotFoundError, EntityConflictError, RunExpiredError, StreamError, StreamExpiredError, ThrottleError, WorkflowRunCancelledError, FatalError, RetryableError, FATAL_ERROR_KEY, RETRYABLE_ERROR_KEY, HOOK_CONFLICT_ERROR_KEY, HOOK_FORCE_CLAIMED_ERROR_KEY, RUNTIME_DECRYPTION_ERROR_KEY, STREAM_ERROR_KEY;
var init_dist2 = __esm({
  "../../node_modules/.pnpm/@workflow+errors@5.0.5/node_modules/@workflow/errors/dist/index.js"() {
    init_dist();
    init_error_codes();
    init_error_codes();
    BASE_URL = "https://workflow-sdk.dev/err";
    __name(isError, "isError");
    __name(appendFramedDetails, "appendFramedDetails");
    __name(buildFramedDetails, "buildFramedDetails");
    ERROR_SLUGS = {
      NODE_JS_MODULE_IN_WORKFLOW: "node-js-module-in-workflow",
      START_INVALID_WORKFLOW_FUNCTION: "start-invalid-workflow-function",
      SERIALIZATION_FAILED: "serialization-failed",
      WEBHOOK_INVALID_RESPOND_WITH_VALUE: "webhook-invalid-respond-with-value",
      WEBHOOK_RESPONSE_NOT_SENT: "webhook-response-not-sent",
      FETCH_IN_WORKFLOW_FUNCTION: "fetch-in-workflow",
      TIMEOUT_FUNCTIONS_IN_WORKFLOW: "timeout-in-workflow",
      HOOK_CONFLICT: "hook-conflict",
      HOOK_FORCE_CLAIMED: "hook-force-claimed",
      CORRUPTED_EVENT_LOG: "corrupted-event-log",
      REPLAY_DIVERGENCE: "replay-divergence",
      STEP_NOT_REGISTERED: "step-not-registered",
      WORKFLOW_NOT_REGISTERED: "workflow-not-registered",
      RUNTIME_DECRYPTION_FAILED: "runtime-decryption-failed",
      DEPLOYMENT_MISMATCH: "deployment-mismatch",
      MAX_EVENTS_EXCEEDED: "max-events-exceeded",
      REPLAY_TIMEOUT: "replay-timeout"
    };
    WorkflowError = class extends Error {
      static {
        __name(this, "WorkflowError");
      }
      cause;
      constructor(message, options) {
        const msgDocs = appendFramedDetails(message, buildFramedDetails(void 0, options?.slug));
        super(msgDocs, {
          cause: options?.cause
        });
        if (options?.cause !== void 0) {
          this.cause = options.cause;
        }
        if (options?.cause instanceof Error) {
          this.stack = `${this.stack}
Caused by: ${options.cause.stack}`;
        }
      }
      static is(value) {
        return isError(value) && value.name === "WorkflowError";
      }
    };
    WorkflowWorldError = class extends WorkflowError {
      static {
        __name(this, "WorkflowWorldError");
      }
      status;
      code;
      url;
      /** Retry-After value in seconds, present on 429 and 425 responses */
      retryAfter;
      /**
       * The offending argument, present on client-side validation failures
       * (`code: 'INVALID_ARGUMENT'`). Lets a caller correct the specific
       * parameter without parsing the message.
       */
      field;
      constructor(message, options) {
        super(message, {
          cause: options?.cause
        });
        this.name = "WorkflowWorldError";
        this.status = options?.status;
        this.code = options?.code;
        this.url = options?.url;
        this.retryAfter = options?.retryAfter;
        this.field = options?.field;
      }
      static is(value) {
        return isError(value) && value.name === "WorkflowWorldError";
      }
    };
    WorkflowRunFailedError = class extends WorkflowError {
      static {
        __name(this, "WorkflowRunFailedError");
      }
      /**
       * `failed` is terminal, and a run's terminal state is immutable. This error
       * is only ever thrown after a *successful* read of such a run, so re-running
       * the read returns the same record and throws the same error. Marking it
       * non-retryable is what stops the step executor from spending a retry budget
       * on that when the read happens inside a step — a parent awaiting a child's
       * `returnValue` — and then replacing this error with its retry-exhaustion
       * wrapper. A read that *fails* throws something else and stays retryable.
       * See `FatalError.is()`.
       */
      fatal = true;
      runId;
      /**
       * The high-level error category (e.g. USER_ERROR, RUNTIME_ERROR) for the
       * failed run, from the run_failed event's `errorCode` field.
       */
      errorCode;
      constructor(runId, error, options = {}) {
        const message = error instanceof Error ? error.message : typeof error === "string" ? error : error && typeof error === "object" && "message" in error ? String(error.message) : "Unknown error";
        super(`Workflow run "${runId}" failed: ${message}`, {
          cause: error
        });
        this.name = "WorkflowRunFailedError";
        this.runId = runId;
        if (options.errorCode !== void 0) {
          this.errorCode = options.errorCode;
        }
      }
      static is(value) {
        return isError(value) && value.name === "WorkflowRunFailedError";
      }
    };
    WorkflowRunNotCompletedError = class extends WorkflowError {
      static {
        __name(this, "WorkflowRunNotCompletedError");
      }
      runId;
      status;
      constructor(runId, status) {
        super(`Workflow run "${runId}" has not completed`, {});
        this.name = "WorkflowRunNotCompletedError";
        this.runId = runId;
        this.status = status;
      }
      static is(value) {
        return isError(value) && value.name === "WorkflowRunNotCompletedError";
      }
    };
    WorkflowRuntimeError = class extends WorkflowError {
      static {
        __name(this, "WorkflowRuntimeError");
      }
      constructor(message, options) {
        super(message, {
          ...options
        });
        this.name = "WorkflowRuntimeError";
      }
      static is(value) {
        return isError(value) && value.name === "WorkflowRuntimeError";
      }
    };
    RuntimeDecryptionError = class extends WorkflowRuntimeError {
      static {
        __name(this, "RuntimeDecryptionError");
      }
      constructor(message, options) {
        super(message, {
          cause: options?.cause,
          slug: ERROR_SLUGS.RUNTIME_DECRYPTION_FAILED
        });
        this.name = "RuntimeDecryptionError";
        if (options?.context !== void 0) {
          this.context = options.context;
        }
      }
      static is(value) {
        return isError(value) && value.name === "RuntimeDecryptionError";
      }
    };
    SerializationError = class extends WorkflowError {
      static {
        __name(this, "SerializationError");
      }
      hint;
      /**
       * Serialization errors are deterministic: if a step returns a non-POJO,
       * replaying the step will always produce the same non-serializable value.
       * Retrying is guaranteed to fail, so these errors are surfaced as fatal
       * and skip the step-retry loop. `FatalError.is()` recognizes any error
       * with `fatal: true` (see `packages/errors/src/index.ts`), so no other
       * wiring is required for user-thrown SerializationErrors.
       */
      fatal = true;
      constructor(message, options) {
        const body = appendFramedDetails(message, buildFramedDetails(options?.hint, void 0));
        super(body, {
          cause: options?.cause
        });
        this.name = "SerializationError";
        this.hint = options?.hint;
      }
      static is(value) {
        return isError(value) && value.name === "SerializationError";
      }
    };
    StepNotRegisteredError = class extends WorkflowRuntimeError {
      static {
        __name(this, "StepNotRegisteredError");
      }
      stepName;
      constructor(stepName) {
        super(`Step "${stepName}" is not registered in the current deployment. This usually indicates a build or bundling issue that caused the step to not be included in the deployment.`, {
          slug: ERROR_SLUGS.STEP_NOT_REGISTERED
        });
        this.name = "StepNotRegisteredError";
        this.stepName = stepName;
      }
      static is(value) {
        return isError(value) && value.name === "StepNotRegisteredError";
      }
    };
    WorkflowNotRegisteredError = class extends WorkflowRuntimeError {
      static {
        __name(this, "WorkflowNotRegisteredError");
      }
      workflowName;
      constructor(workflowName) {
        super(`Workflow "${workflowName}" is not registered in the current deployment. This usually means a run was started against a deployment that does not have this workflow, or there was a build/bundling issue.`, {
          slug: ERROR_SLUGS.WORKFLOW_NOT_REGISTERED
        });
        this.name = "WorkflowNotRegisteredError";
        this.workflowName = workflowName;
      }
      static is(value) {
        return isError(value) && value.name === "WorkflowNotRegisteredError";
      }
    };
    WorkflowRunNotFoundError = class extends WorkflowError {
      static {
        __name(this, "WorkflowRunNotFoundError");
      }
      runId;
      constructor(runId) {
        super(`Workflow run "${runId}" not found`, {});
        this.name = "WorkflowRunNotFoundError";
        this.runId = runId;
      }
      static is(value) {
        return isError(value) && value.name === "WorkflowRunNotFoundError";
      }
    };
    HookConflictError = class extends WorkflowError {
      static {
        __name(this, "HookConflictError");
      }
      token;
      // TODO: Make this required once all persisted hook_conflict events and World
      // implementations always include the active hook owner's run ID.
      conflictingRunId;
      constructor(token, conflictingRunId) {
        super(`Hook token "${token}" is already in use by another workflow${conflictingRunId ? ` (run "${conflictingRunId}")` : ""}`, {
          slug: ERROR_SLUGS.HOOK_CONFLICT
        });
        this.name = "HookConflictError";
        this.token = token;
        if (conflictingRunId !== void 0) {
          this.conflictingRunId = conflictingRunId;
        }
      }
      static is(value) {
        return isError(value) && value.name === "HookConflictError";
      }
    };
    HookForceClaimedError = class extends WorkflowError {
      static {
        __name(this, "HookForceClaimedError");
      }
      token;
      /** The run that took the token. */
      claimedByRunId;
      /** The hook (in `claimedByRunId`) the token now belongs to. */
      claimedByHookId;
      constructor(token, claimedByRunId, claimedByHookId) {
        super(`Hook token "${token}" was force-claimed by another workflow (run "${claimedByRunId}")`, {
          slug: ERROR_SLUGS.HOOK_FORCE_CLAIMED
        });
        this.name = "HookForceClaimedError";
        this.token = token;
        this.claimedByRunId = claimedByRunId;
        if (claimedByHookId !== void 0) {
          this.claimedByHookId = claimedByHookId;
        }
      }
      static is(value) {
        return isError(value) && value.name === "HookForceClaimedError";
      }
    };
    HookNotFoundError = class extends WorkflowError {
      static {
        __name(this, "HookNotFoundError");
      }
      token;
      constructor(token) {
        super("Hook not found", {});
        this.name = "HookNotFoundError";
        this.token = token;
      }
      static is(value) {
        return isError(value) && value.name === "HookNotFoundError";
      }
    };
    EntityConflictError = class extends WorkflowWorldError {
      static {
        __name(this, "EntityConflictError");
      }
      constructor(message) {
        super(message);
        this.name = "EntityConflictError";
      }
      static is(value) {
        return isError(value) && value.name === "EntityConflictError";
      }
    };
    RunExpiredError = class extends WorkflowWorldError {
      static {
        __name(this, "RunExpiredError");
      }
      runId;
      runStatus;
      expiredAt;
      constructor(message, runId, runStatus, expiredAt) {
        super(message, {
          status: 410,
          code: "run-expired"
        });
        this.runId = runId;
        this.runStatus = runStatus;
        this.expiredAt = expiredAt;
        this.name = "RunExpiredError";
      }
      static is(value) {
        return isError(value) && value.name === "RunExpiredError";
      }
    };
    StreamError = class extends WorkflowWorldError {
      static {
        __name(this, "StreamError");
      }
      constructor(message, options) {
        super(message, {
          code: RUN_ERROR_CODES.STREAM_ERROR,
          cause: options?.cause,
          url: options?.url,
          status: options?.status
        });
        this.name = "StreamError";
      }
      static is(value) {
        return isError(value) && value.name === "StreamError";
      }
    };
    StreamExpiredError = class extends WorkflowWorldError {
      static {
        __name(this, "StreamExpiredError");
      }
      runId;
      streamId;
      expiredAt;
      constructor(message, runId, streamId, expiredAt) {
        super(message, {
          status: 410,
          code: "stream-expired"
        });
        this.runId = runId;
        this.streamId = streamId;
        this.expiredAt = expiredAt;
        this.name = "StreamExpiredError";
      }
      static is(value) {
        return isError(value) && value.name === "StreamExpiredError";
      }
    };
    ThrottleError = class extends WorkflowWorldError {
      static {
        __name(this, "ThrottleError");
      }
      retryAfter;
      constructor(message, options) {
        super(message);
        this.name = "ThrottleError";
        this.retryAfter = options?.retryAfter;
      }
      static is(value) {
        return isError(value) && value.name === "ThrottleError";
      }
    };
    WorkflowRunCancelledError = class extends WorkflowError {
      static {
        __name(this, "WorkflowRunCancelledError");
      }
      /** Terminal and immutable, for the same reason as {@link WorkflowRunFailedError.fatal}. */
      fatal = true;
      runId;
      constructor(runId) {
        super(`Workflow run "${runId}" cancelled`, {});
        this.name = "WorkflowRunCancelledError";
        this.runId = runId;
      }
      static is(value) {
        return isError(value) && value.name === "WorkflowRunCancelledError";
      }
    };
    FatalError = class extends Error {
      static {
        __name(this, "FatalError");
      }
      fatal = true;
      constructor(message) {
        super(message);
        this.name = "FatalError";
      }
      static is(value) {
        if (!isError(value)) return false;
        if (value.name === "FatalError") return true;
        return value.fatal === true;
      }
    };
    RetryableError = class extends Error {
      static {
        __name(this, "RetryableError");
      }
      /**
       * The Date when the step should be retried.
       */
      retryAfter;
      constructor(message, options = {}) {
        super(message);
        this.name = "RetryableError";
        if (options.retryAfter !== void 0) {
          this.retryAfter = parseDurationToDate(options.retryAfter);
        } else {
          this.retryAfter = new Date(Date.now() + 1e3);
        }
      }
      static is(value) {
        return isError(value) && value.name === "RetryableError";
      }
    };
    FATAL_ERROR_KEY = /* @__PURE__ */ Symbol.for("@workflow/errors//FatalError");
    RETRYABLE_ERROR_KEY = /* @__PURE__ */ Symbol.for("@workflow/errors//RetryableError");
    HOOK_CONFLICT_ERROR_KEY = /* @__PURE__ */ Symbol.for("@workflow/errors//HookConflictError");
    HOOK_FORCE_CLAIMED_ERROR_KEY = /* @__PURE__ */ Symbol.for("@workflow/errors//HookForceClaimedError");
    RUNTIME_DECRYPTION_ERROR_KEY = /* @__PURE__ */ Symbol.for("@workflow/errors//RuntimeDecryptionError");
    STREAM_ERROR_KEY = /* @__PURE__ */ Symbol.for("@workflow/errors//StreamError");
    if (typeof globalThis !== "undefined") {
      if (!Object.hasOwn(globalThis, FATAL_ERROR_KEY)) {
        Object.defineProperty(globalThis, FATAL_ERROR_KEY, {
          value: FatalError,
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
      if (!Object.hasOwn(globalThis, RETRYABLE_ERROR_KEY)) {
        Object.defineProperty(globalThis, RETRYABLE_ERROR_KEY, {
          value: RetryableError,
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
      if (!Object.hasOwn(globalThis, HOOK_CONFLICT_ERROR_KEY)) {
        Object.defineProperty(globalThis, HOOK_CONFLICT_ERROR_KEY, {
          value: HookConflictError,
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
      if (!Object.hasOwn(globalThis, HOOK_FORCE_CLAIMED_ERROR_KEY)) {
        Object.defineProperty(globalThis, HOOK_FORCE_CLAIMED_ERROR_KEY, {
          value: HookForceClaimedError,
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
      if (!Object.hasOwn(globalThis, RUNTIME_DECRYPTION_ERROR_KEY)) {
        Object.defineProperty(globalThis, RUNTIME_DECRYPTION_ERROR_KEY, {
          value: RuntimeDecryptionError,
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
      if (!Object.hasOwn(globalThis, STREAM_ERROR_KEY)) {
        Object.defineProperty(globalThis, STREAM_ERROR_KEY, {
          value: StreamError,
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
    }
  }
});

// ../../node_modules/.pnpm/@workflow+errors@5.0.5/node_modules/@workflow/errors/dist/internal-chalk.js
var colorEnabled, sgr, chalk, internal_chalk_default;
var init_internal_chalk = __esm({
  "../../node_modules/.pnpm/@workflow+errors@5.0.5/node_modules/@workflow/errors/dist/internal-chalk.js"() {
    colorEnabled = (() => {
      const p = globalThis.process;
      if (!p?.env) return false;
      if (p.env.FORCE_COLOR && p.env.FORCE_COLOR !== "0") return true;
      if (p.env.NO_COLOR) return false;
      return Boolean(p.stdout?.isTTY);
    })();
    sgr = /* @__PURE__ */ __name((open2, close) => (s) => colorEnabled ? `\x1B[${open2}m${s}\x1B[${close}m` : s, "sgr");
    chalk = {
      bold: sgr(1, 22),
      dim: sgr(2, 22),
      italic: sgr(3, 23),
      red: sgr(31, 39),
      blue: sgr(34, 39),
      cyan: sgr(36, 39),
      yellow: sgr(33, 39),
      magenta: sgr(35, 39)
    };
    internal_chalk_default = chalk;
  }
});

// ../../node_modules/.pnpm/@workflow+errors@5.0.5/node_modules/@workflow/errors/dist/ansi.js
function hint(messages) {
  const message = Array.isArray(messages) ? messages.join("\n") : messages;
  return styles.info(`${internal_chalk_default.bold("hint:")} ${message}`);
}
function docs(url) {
  return styles.info(`${internal_chalk_default.bold("docs:")} ${url}`);
}
function code(str) {
  return internal_chalk_default.italic(`${internal_chalk_default.dim("`")}${str}${internal_chalk_default.dim("`")}`);
}
function dim(str) {
  return internal_chalk_default.dim(str);
}
function bold(str) {
  return internal_chalk_default.bold(str);
}
function red(str) {
  return internal_chalk_default.red(str);
}
function magenta(str) {
  return internal_chalk_default.magenta(str);
}
function frame(title, contents) {
  const result = [
    title
  ];
  contents.forEach((content, index) => {
    const lines = content.split("\n");
    const isLastContent = index === contents.length - 1;
    const firstLinePrefix = isLastContent ? "\u2570\u25B6 " : "\u251C\u25B6 ";
    const continuationPrefix = isLastContent ? "   " : "\u2502  ";
    const framedLines = lines.map((line, lineIndex) => {
      const prefix = lineIndex === 0 ? firstLinePrefix : continuationPrefix;
      return `${prefix}${line}`;
    });
    result.push(...framedLines);
  });
  return result.join("\n");
}
var styles;
var init_ansi = __esm({
  "../../node_modules/.pnpm/@workflow+errors@5.0.5/node_modules/@workflow/errors/dist/ansi.js"() {
    init_internal_chalk();
    styles = {
      info: internal_chalk_default.blue,
      help: internal_chalk_default.cyan,
      warn: internal_chalk_default.yellow,
      error: internal_chalk_default.red
    };
    __name(hint, "hint");
    __name(docs, "docs");
    __name(code, "code");
    __name(dim, "dim");
    __name(bold, "bold");
    __name(red, "red");
    __name(magenta, "magenta");
    __name(frame, "frame");
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/attributes-validation.js
function validateAttributeEventDataSize(eventData) {
  const bytes = textEncoder.encode(JSON.stringify(eventData)).length;
  if (bytes > ATTRIBUTE_EVENT_DATA_MAX_BYTES) {
    throw new AttributeValidationError(`Attribute eventData exceeds limit ${ATTRIBUTE_EVENT_DATA_MAX_BYTES} UTF-8 JSON bytes (received ${bytes} bytes). Split the changes into smaller setAttributes() calls.`);
  }
}
function assertValidAttributeKey(key, allowReservedAttributes) {
  if (typeof key !== "string") {
    throw new AttributeValidationError(`Attribute key must be a string, got ${typeof key}`);
  }
  if (key.length === 0) {
    throw new AttributeValidationError("Attribute key must not be empty");
  }
  if (key.length > ATTRIBUTE_KEY_MAX_LENGTH) {
    throw new AttributeValidationError(`Attribute key length ${key.length} exceeds limit ${ATTRIBUTE_KEY_MAX_LENGTH}: ${JSON.stringify(key.slice(0, 32))}\u2026`);
  }
  if (!allowReservedAttributes && key.startsWith(RESERVED_ATTRIBUTE_KEY_PREFIX)) {
    throw new AttributeValidationError(`Attribute key ${JSON.stringify(key)} starts with reserved prefix "${RESERVED_ATTRIBUTE_KEY_PREFIX}" \u2014 that namespace is reserved for framework/library code. Set { allowReservedAttributes: true } only if your caller is framework-level.`);
  }
}
function assertValidAttributeValue(value) {
  if (value !== null && typeof value !== "string") {
    throw new AttributeValidationError(`Attribute value must be a string or null, got ${typeof value}`);
  }
  if (value === null) return;
  const bytes = textEncoder.encode(value).length;
  if (bytes > ATTRIBUTE_VALUE_MAX_BYTES) {
    throw new AttributeValidationError(`Attribute value byte length ${bytes} exceeds limit ${ATTRIBUTE_VALUE_MAX_BYTES}`);
  }
}
function attributeCountDelta(key, value, existingKeys) {
  if (value === null) return existingKeys?.has(key) ? -1 : 0;
  return existingKeys === void 0 || !existingKeys.has(key) ? 1 : 0;
}
function validateAttributeBatchConstraints(changes, context = {}) {
  const seenKeys = /* @__PURE__ */ new Set();
  const existingKeys = context.existingKeys === void 0 ? void 0 : context.existingKeys instanceof Set ? context.existingKeys : new Set(context.existingKeys);
  let postMergeCount = existingKeys?.size ?? 0;
  for (const { key, value } of changes) {
    if (seenKeys.has(key)) {
      throw new AttributeValidationError(`Attribute key ${JSON.stringify(key)} appears more than once in the same batch`);
    }
    seenKeys.add(key);
    postMergeCount += attributeCountDelta(key, value, existingKeys);
  }
  if (postMergeCount > ATTRIBUTE_MAX_PER_RUN) {
    throw new AttributeValidationError(`Run attribute count would exceed limit ${ATTRIBUTE_MAX_PER_RUN} (post-merge ${postMergeCount})`);
  }
}
function validateAttributeChanges(changes, context = {}) {
  for (const { key, value } of changes) {
    assertValidAttributeKey(key, context.allowReservedAttributes === true);
    assertValidAttributeValue(value);
  }
  validateAttributeBatchConstraints(changes, context);
}
var RESERVED_ATTRIBUTE_KEY_PREFIX, ROOT_RUN_ID_ATTRIBUTE, PARENT_RUN_ID_ATTRIBUTE, RETENTION_ATTRIBUTE, ATTRIBUTE_KEY_MAX_LENGTH, ATTRIBUTE_VALUE_MAX_BYTES, ATTRIBUTE_MAX_PER_RUN, ATTRIBUTE_EVENT_DATA_MAX_BYTES, textEncoder, AttributeValidationError;
var init_attributes_validation = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/attributes-validation.js"() {
    RESERVED_ATTRIBUTE_KEY_PREFIX = "$";
    ROOT_RUN_ID_ATTRIBUTE = `${RESERVED_ATTRIBUTE_KEY_PREFIX}rootRunId`;
    PARENT_RUN_ID_ATTRIBUTE = `${RESERVED_ATTRIBUTE_KEY_PREFIX}parentRunId`;
    RETENTION_ATTRIBUTE = `${RESERVED_ATTRIBUTE_KEY_PREFIX}retention`;
    ATTRIBUTE_KEY_MAX_LENGTH = 256;
    ATTRIBUTE_VALUE_MAX_BYTES = 256;
    ATTRIBUTE_MAX_PER_RUN = 64;
    ATTRIBUTE_EVENT_DATA_MAX_BYTES = 8192;
    textEncoder = new TextEncoder();
    AttributeValidationError = class extends Error {
      static {
        __name(this, "AttributeValidationError");
      }
      constructor(message) {
        super(message);
        this.name = "AttributeValidationError";
      }
    };
    __name(validateAttributeEventDataSize, "validateAttributeEventDataSize");
    __name(assertValidAttributeKey, "assertValidAttributeKey");
    __name(assertValidAttributeValue, "assertValidAttributeValue");
    __name(attributeCountDelta, "attributeCountDelta");
    __name(validateAttributeBatchConstraints, "validateAttributeBatchConstraints");
    __name(validateAttributeChanges, "validateAttributeChanges");
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/attributes.js
import * as z from "zod";
var textEncoder2, AttributeKeySchema, AttributeValueSchema, AttributeChangeSchema, AttributeChangesSchema;
var init_attributes = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/attributes.js"() {
    init_attributes_validation();
    init_attributes_validation();
    textEncoder2 = new TextEncoder();
    AttributeKeySchema = z.compile(z.string().min(1, {
      error: "Attribute key must not be empty"
    }).max(ATTRIBUTE_KEY_MAX_LENGTH, {
      error: `Attribute key exceeds limit ${ATTRIBUTE_KEY_MAX_LENGTH}`
    }));
    AttributeValueSchema = z.compile(z.string().refine((value) => textEncoder2.encode(value).length <= ATTRIBUTE_VALUE_MAX_BYTES, {
      error: `Attribute value exceeds limit ${ATTRIBUTE_VALUE_MAX_BYTES} UTF-8 bytes`
    }).nullable());
    AttributeChangeSchema = z.compile(z.object({
      key: AttributeKeySchema,
      value: AttributeValueSchema
    }));
    AttributeChangesSchema = z.compile(z.array(AttributeChangeSchema).superRefine((changes, context) => {
      try {
        validateAttributeBatchConstraints(changes);
      } catch (error) {
        if (!(error instanceof AttributeValidationError)) throw error;
        context.addIssue({
          code: "custom",
          message: error.message,
          input: changes
        });
      }
    }));
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/event-metadata.js
var init_event_metadata = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/event-metadata.js"() {
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/serialization.js
import { z as z2 } from "zod";
var BinarySerializedDataSchema, LegacySerializedDataSchemaV1, SerializedDataSchema;
var init_serialization = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/serialization.js"() {
    BinarySerializedDataSchema = z2.compile(z2.instanceof(Uint8Array));
    LegacySerializedDataSchemaV1 = z2.compile(z2.any());
    SerializedDataSchema = z2.compile(z2.union([
      BinarySerializedDataSchema,
      LegacySerializedDataSchemaV1
    ]));
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/events.js
import { z as z3 } from "zod";
var EventTypeSchema, RunEventTypeSchema, RUN_EVENT_TYPES, TerminalRunEventTypeSchema, TERMINAL_RUN_EVENT_TYPES, StepEventTypeSchema, STEP_EVENT_TYPES, TerminalStepEventTypeSchema, TERMINAL_STEP_EVENT_TYPES, HookLifecycleEventTypeSchema, HOOK_LIFECYCLE_EVENT_TYPES, HookEventRequiringExistenceTypeSchema, HOOK_EVENTS_REQUIRING_EXISTENCE, WaitEventTypeSchema, WAIT_EVENT_TYPES, ChildEntityCreationEventTypeSchema, CHILD_ENTITY_CREATION_EVENT_TYPES, BaseEventSchema, stepLatencyTelemetryFields, StepCompletedEventSchema, StepFailedEventSchema, StepRetryingEventSchema, StepStartedEventSchema, StepCreatedEventSchema, HookCreatedEventSchema, HookReceivedEventSchema, HookDisposedEventSchema, HookConflictEventSchema, NoopEventSchema, WaitCreatedEventSchema, WaitCompletedEventSchema, AttributeWriterSchema, AttrSetEventSchema, RunCreatedEventSchema, RunStartedEventSchema, RunCompletedEventSchema, RunFailedEventSchema, RunCancelledEventSchema, CreateEventSchema, AllEventsSchema, EventSchema;
var init_events = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/events.js"() {
    init_attributes();
    init_event_metadata();
    init_serialization();
    init_event_metadata();
    EventTypeSchema = z3.compile(z3.enum([
      // Run lifecycle events
      "run_created",
      "run_started",
      "run_completed",
      "run_failed",
      "run_cancelled",
      // Run attribute events
      "attr_set",
      // Step lifecycle events
      "step_created",
      "step_completed",
      "step_failed",
      "step_retrying",
      "step_started",
      // Hook lifecycle events
      "hook_created",
      "hook_received",
      "hook_disposed",
      "hook_conflict",
      // Wait lifecycle events
      "wait_created",
      "wait_completed",
      // Sealed-log filler (specVersion >= 7): written ONLY by the World's backend
      // to occupy a slot whose writer allocated it and died. Carries no workflow
      // meaning; replay skips it (see EventsConsumer). Never user-creatable.
      "noop"
    ]));
    RunEventTypeSchema = EventTypeSchema.extract([
      "run_created",
      "run_started",
      "run_completed",
      "run_failed",
      "run_cancelled"
    ]);
    RUN_EVENT_TYPES = RunEventTypeSchema.options;
    TerminalRunEventTypeSchema = z3.compile(EventTypeSchema.extract([
      "run_completed",
      "run_failed",
      "run_cancelled"
    ]));
    TERMINAL_RUN_EVENT_TYPES = TerminalRunEventTypeSchema.options;
    StepEventTypeSchema = EventTypeSchema.extract([
      "step_created",
      "step_completed",
      "step_failed",
      "step_retrying",
      "step_started"
    ]);
    STEP_EVENT_TYPES = StepEventTypeSchema.options;
    TerminalStepEventTypeSchema = EventTypeSchema.extract([
      "step_completed",
      "step_failed"
    ]);
    TERMINAL_STEP_EVENT_TYPES = TerminalStepEventTypeSchema.options;
    HookLifecycleEventTypeSchema = EventTypeSchema.extract([
      "hook_created",
      "hook_received",
      "hook_disposed"
    ]);
    HOOK_LIFECYCLE_EVENT_TYPES = HookLifecycleEventTypeSchema.options;
    HookEventRequiringExistenceTypeSchema = EventTypeSchema.extract([
      "hook_disposed",
      "hook_received"
    ]);
    HOOK_EVENTS_REQUIRING_EXISTENCE = HookEventRequiringExistenceTypeSchema.options;
    WaitEventTypeSchema = EventTypeSchema.extract([
      "wait_created",
      "wait_completed"
    ]);
    WAIT_EVENT_TYPES = WaitEventTypeSchema.options;
    ChildEntityCreationEventTypeSchema = EventTypeSchema.extract([
      "step_created",
      "hook_created",
      "wait_created"
    ]);
    CHILD_ENTITY_CREATION_EVENT_TYPES = ChildEntityCreationEventTypeSchema.options;
    BaseEventSchema = z3.compile(z3.object({
      eventType: EventTypeSchema,
      correlationId: z3.string().optional(),
      specVersion: z3.number().optional()
    }));
    stepLatencyTelemetryFields = {
      // Time-to-first-step: milliseconds from run creation until the run's first
      // step body began executing, minus time spent committing hook_created
      // events. Only reported when nothing else (hooks received, waits,
      // attributes, other steps) happened before the first step.
      ttfs: z3.number().optional(),
      // Step-to-step overhead: milliseconds between the previous step's terminal
      // event and this step's body beginning to execute. Only reported when the
      // two steps ran back-to-back (the previous event-log entry is a
      // step_completed/step_failed).
      stso: z3.number().optional(),
      // Progress counters taken when the STSO gap began. Only present alongside
      // stso.
      stepCount: z3.number().int().positive().optional(),
      eventCount: z3.number().int().positive().optional(),
      // Run-started-to-first-step: milliseconds from the `run_started` response
      // landing (or, under turbo, the local run synthesis instant) until this
      // step's start POST was issued. A sub-window of ttfs. Only reported
      // alongside the same eligibility as ttfs.
      rsfs: z3.number().optional(),
      // Synchronous workflow-function replay duration of only the FINAL replay
      // pass within the rsfs window (the pass that scheduled the first step),
      // excluding awaited network I/O. Not accumulated across earlier
      // pre-first-step passes, so it is not "the replay portion of rsfs". Only
      // present alongside rsfs, and only for the run's first step.
      finalSchedulingReplay: z3.number().optional(),
      // Names of the runtime's optional startup-latency optimizations that were
      // active for this measurement (e.g. 'turbo', 'lazyStepStart',
      // 'optimisticStart'), so latency metrics can be segmented by them.
      optimizations: z3.array(z3.string()).optional()
    };
    StepCompletedEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("step_completed"),
      correlationId: z3.string(),
      eventData: z3.object({
        stepName: z3.string().optional(),
        // Carried so a backend that keys payload refs by workflow name can build
        // the key without an extra run lookup on this hot per-step write.
        // Optional: older runtimes omit it and the backend falls back to a read.
        workflowName: z3.string().optional(),
        result: SerializedDataSchema,
        ...stepLatencyTelemetryFields
      })
    });
    StepFailedEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("step_failed"),
      correlationId: z3.string(),
      eventData: z3.object({
        stepName: z3.string().optional(),
        // The thrown value, serialized via the workflow serialization pipeline.
        // Can be any JavaScript value (string, number, object, Error, etc.)
        error: SerializedDataSchema,
        ...stepLatencyTelemetryFields
      })
    });
    StepRetryingEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("step_retrying"),
      correlationId: z3.string(),
      eventData: z3.object({
        stepName: z3.string().optional(),
        // The thrown value, serialized via the workflow serialization pipeline.
        // Can be any JavaScript value (string, number, object, Error, etc.)
        error: SerializedDataSchema,
        retryAfter: z3.coerce.date().optional()
      })
    });
    StepStartedEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("step_started"),
      correlationId: z3.string(),
      eventData: z3.object({
        stepName: z3.string().optional(),
        attempt: z3.number().optional(),
        // Carried on the lazy-start path (where `input` is present) so the
        // backend can build the payload ref key without re-reading the run.
        workflowName: z3.string().optional(),
        // Lazy-start: the dehydrated step input, present only when this
        // step_started is also responsible for creating the step.
        input: SerializedDataSchema.optional(),
        // Inline step ownership: the queue message ID of the invocation whose
        // handler is executing this step's body inline. Stamped on the lazy
        // step_started (and re-stamped on an owner-recovery bare start) so
        // that a wake replay can tell "this attempt is in flight in a live
        // invocation" apart from "this attempt died with its process": the
        // owner's queue message doubles as the liveness lease (a crash means
        // the queue redelivers that same messageId, which is allowed to
        // re-execute). Ownership derives from the step's LATEST step_started:
        // an unstamped bare start (a retry attempt driven by a queued step
        // message) clears it. Absent on eager steps and from older runtimes.
        // Requires the queue's messageId to be stable across redeliveries of
        // one message (see the Queue.createQueueHandler meta contract).
        ownerMessageId: z3.string().optional()
      }).optional()
    });
    StepCreatedEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("step_created"),
      correlationId: z3.string(),
      eventData: z3.object({
        stepName: z3.string(),
        workflowName: z3.string().optional(),
        input: SerializedDataSchema
      })
    });
    HookCreatedEventSchema = z3.compile(BaseEventSchema.extend({
      eventType: z3.literal("hook_created"),
      correlationId: z3.string(),
      eventData: z3.object({
        token: z3.string(),
        tokenRetentionUntil: z3.coerce.date().optional(),
        metadata: SerializedDataSchema.optional(),
        isWebhook: z3.boolean().optional(),
        isSystem: z3.boolean().optional(),
        /**
         * `createHook({ experimental_force: true })`: when the token belongs to
         * another live run, the World takes it over — journaling
         * `hook_disposed{forceClaimedBy}` in that run's log and re-pointing the
         * token — instead of answering `hook_conflict`. Requires the
         * `hookForceClaim` capability.
         */
        force: z3.boolean().optional(),
        /**
         * World-written on a forced creation that did take a token over: the
         * run and hook it was taken from, plus what a queue message to that run
         * needs (`workflowName`, `deploymentId`, `runSpecVersion`). Absent when
         * the token was free. The wake-targeting fields are in the LOG, not only
         * on the hook entity, so a replay can republish the victim's wake from
         * the row alone; see `publishForceClaimVictimWake` in @workflow/core.
         */
        forceClaimedFrom: z3.object({
          runId: z3.string(),
          hookId: z3.string(),
          workflowName: z3.string().optional(),
          deploymentId: z3.string().optional(),
          runSpecVersion: z3.number().optional()
        }).optional()
      })
    }));
    HookReceivedEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("hook_received"),
      correlationId: z3.string(),
      eventData: z3.object({
        token: z3.string().optional(),
        payload: SerializedDataSchema
      })
    });
    HookDisposedEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("hook_disposed"),
      correlationId: z3.string(),
      eventData: z3.object({
        token: z3.string().optional(),
        /**
         * World-written: this disposal was not the run's own. Another run
         * took the hook's token with `experimental_force`, and this names
         * it. The hook consumer rejects the hook's awaiters with
         * `HookForceClaimedError` when it reads this row.
         */
        forceClaimedBy: z3.object({
          runId: z3.string(),
          hookId: z3.string()
        }).optional()
      }).optional()
    });
    HookConflictEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("hook_conflict"),
      correlationId: z3.string(),
      eventData: z3.object({
        token: z3.string(),
        // TODO: Make this required once all persisted hook_conflict events and
        // remote World implementations always include the active hook owner's run ID.
        conflictingRunId: z3.string().optional(),
        /**
         * Set when the creation asked for `force` and the World declined to take
         * the token over. `victim-spec-version`: the run holding the token was
         * started at a spec version below
         * `SPEC_VERSION_SUPPORTS_HOOK_FORCE_CLAIM`, so its runtime would not
         * understand the involuntary disposal — the forced hook gets the
         * ordinary `HookConflictError` it opted out of instead of stranding
         * that run. Absent on a conflict answered by a World that does not
         * implement forcing at all.
         */
        forceRefusedReason: z3.literal("victim-spec-version").optional()
      })
    });
    NoopEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("noop"),
      eventData: z3.object({
        sealed: z3.boolean().optional()
      }).passthrough().optional()
    });
    WaitCreatedEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("wait_created"),
      correlationId: z3.string(),
      eventData: z3.object({
        resumeAt: z3.coerce.date()
      })
    });
    WaitCompletedEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("wait_completed"),
      correlationId: z3.string(),
      eventData: z3.object({
        resumeAt: z3.coerce.date().optional()
      }).optional()
    });
    AttributeWriterSchema = z3.discriminatedUnion("type", [
      z3.object({
        type: z3.literal("workflow")
      }),
      z3.object({
        type: z3.literal("step"),
        stepId: z3.string(),
        attempt: z3.number()
      })
    ]);
    AttrSetEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("attr_set"),
      correlationId: z3.string().optional(),
      eventData: z3.object({
        changes: AttributeChangesSchema,
        writer: AttributeWriterSchema,
        allowReservedAttributes: z3.literal(true).optional()
      })
    });
    RunCreatedEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("run_created"),
      eventData: z3.object({
        deploymentId: z3.string(),
        workflowName: z3.string(),
        input: SerializedDataSchema,
        executionContext: z3.record(z3.string(), z3.any()).optional(),
        attributes: z3.record(z3.string(), z3.string()).optional(),
        allowReservedAttributes: z3.literal(true).optional(),
        /**
         * A dynamic run's serialized workflow VM code. The World materializes it
         * onto the run record and does not keep a second copy on the event.
         * Mutually exclusive with `dynamicWorkflowCodeRef`.
         */
        dynamicWorkflowCode: SerializedDataSchema.optional(),
        /**
         * Ref for dynamic workflow code uploaded before this write. Worlds must
         * validate it against the caller and run before attaching it.
         */
        dynamicWorkflowCodeRef: z3.string().optional(),
        /**
         * The run's X25519 public key (base64), stamped by SDKs that support
         * sealed (`encp`) envelopes. Persisted onto the run entity so that
         * cross-run writers can seal payloads to this run without holding its
         * symmetric key. Not secret. See `WorkflowRunBaseSchema`.
         */
        encryptionPublicKey: z3.string().optional()
      }).refine((value) => value.dynamicWorkflowCode === void 0 || value.dynamicWorkflowCodeRef === void 0, {
        path: [
          "dynamicWorkflowCodeRef"
        ],
        message: "dynamicWorkflowCode and dynamicWorkflowCodeRef are mutually exclusive"
      })
    });
    RunStartedEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("run_started"),
      eventData: z3.object({
        input: SerializedDataSchema.optional(),
        deploymentId: z3.string().optional(),
        workflowName: z3.string().optional(),
        executionContext: z3.record(z3.string(), z3.any()).optional(),
        attributes: z3.record(z3.string(), z3.string()).optional(),
        allowReservedAttributes: z3.literal(true).optional(),
        /**
         * Mirrors `run_created.eventData.encryptionPublicKey`. Carried here for
         * the resilient-start path: when the `run_created` write failed, the
         * server creates the run from this event instead, and without the key
         * the run would silently lose its ability to receive sealed writes.
         */
        encryptionPublicKey: z3.string().optional(),
        /** Dynamic code carried for resilient run creation. */
        dynamicWorkflowCode: SerializedDataSchema.optional(),
        dynamicWorkflowCodeRef: z3.string().optional()
      }).refine((value) => value.dynamicWorkflowCode === void 0 || value.dynamicWorkflowCodeRef === void 0, {
        path: [
          "dynamicWorkflowCodeRef"
        ],
        message: "dynamicWorkflowCode and dynamicWorkflowCodeRef are mutually exclusive"
      }).optional()
    });
    RunCompletedEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("run_completed"),
      eventData: z3.object({
        output: SerializedDataSchema.optional()
      })
    });
    RunFailedEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("run_failed"),
      eventData: z3.object({
        // The thrown value, serialized via the workflow serialization pipeline.
        // Can be any JavaScript value (string, number, object, Error, etc.)
        error: SerializedDataSchema,
        // The high-level error category (USER_ERROR, RUNTIME_ERROR, etc.) used
        // for routing and classification. Kept as plaintext metadata so
        // observability tools can filter/categorize without needing to decrypt
        // the full error payload.
        errorCode: z3.string().optional()
      })
    });
    RunCancelledEventSchema = BaseEventSchema.extend({
      eventType: z3.literal("run_cancelled"),
      eventData: z3.object({
        // Optional free-text reason for the cancellation. Kept as small
        // plaintext metadata (like run_failed's errorCode) so it survives
        // resolveData: 'none' and can be displayed without decryption.
        cancelReason: z3.string().max(512).optional()
      }).optional()
    });
    CreateEventSchema = z3.compile(z3.discriminatedUnion("eventType", [
      // Run lifecycle events
      RunCreatedEventSchema,
      RunStartedEventSchema,
      RunCompletedEventSchema,
      RunFailedEventSchema,
      RunCancelledEventSchema,
      AttrSetEventSchema,
      // Step lifecycle events
      StepCreatedEventSchema,
      StepCompletedEventSchema,
      StepFailedEventSchema,
      StepRetryingEventSchema,
      StepStartedEventSchema,
      // Hook lifecycle events
      HookCreatedEventSchema,
      HookReceivedEventSchema,
      HookDisposedEventSchema,
      // Wait lifecycle events
      WaitCreatedEventSchema,
      WaitCompletedEventSchema
    ]));
    AllEventsSchema = z3.discriminatedUnion("eventType", [
      // Run lifecycle events
      RunCreatedEventSchema,
      RunStartedEventSchema,
      RunCompletedEventSchema,
      RunFailedEventSchema,
      RunCancelledEventSchema,
      AttrSetEventSchema,
      // Step lifecycle events
      StepCreatedEventSchema,
      StepCompletedEventSchema,
      StepFailedEventSchema,
      StepRetryingEventSchema,
      StepStartedEventSchema,
      // Hook lifecycle events
      HookCreatedEventSchema,
      HookReceivedEventSchema,
      HookDisposedEventSchema,
      HookConflictEventSchema,
      // Wait lifecycle events
      WaitCreatedEventSchema,
      WaitCompletedEventSchema,
      NoopEventSchema
    ]);
    EventSchema = z3.compile(AllEventsSchema.and(z3.object({
      runId: z3.string(),
      eventId: z3.string(),
      createdAt: z3.coerce.date(),
      occurredAt: z3.coerce.date().optional(),
      specVersion: z3.number().optional(),
      /**
       * Lazy hook resume idempotency key, persisted on `hook_received` events so
       * the queue consumer can detect that the producer's concurrent direct write
       * already landed in the run_started preload and skip its own re-ensure.
       * Mirrors {@link CreateEventParams.resumeId}; absent on all other events and
       * on legacy (non-lazy) resumes.
       */
      resumeId: z3.string().optional()
    })));
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/runs.js
import { z as z4 } from "zod";
function isTerminalWorkflowRunStatus(status) {
  return TERMINAL_WORKFLOW_RUN_STATUSES.includes(status);
}
var WorkflowRunStatusSchema, TerminalWorkflowRunStatusSchema, TERMINAL_WORKFLOW_RUN_STATUSES, WorkflowRunBaseSchema, WorkflowRunSchema, BULK_CANCEL_MAX_RUN_IDS, BulkCancelWorkflowRunsRequestSchema, BulkCancelWorkflowRunResultSchema, BulkCancelWorkflowRunsResultSchema;
var init_runs = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/runs.js"() {
    init_serialization();
    WorkflowRunStatusSchema = z4.compile(z4.enum([
      "pending",
      "running",
      "completed",
      "failed",
      "cancelled"
    ]));
    TerminalWorkflowRunStatusSchema = z4.compile(WorkflowRunStatusSchema.extract([
      "completed",
      "failed",
      "cancelled"
    ]));
    TERMINAL_WORKFLOW_RUN_STATUSES = TerminalWorkflowRunStatusSchema.options;
    __name(isTerminalWorkflowRunStatus, "isTerminalWorkflowRunStatus");
    WorkflowRunBaseSchema = z4.compile(z4.object({
      runId: z4.string(),
      status: WorkflowRunStatusSchema,
      deploymentId: z4.string(),
      /**
       * The machine-readable name of the workflow function.
       *
       * This field contains a structured identifier like `workflow//./src/workflows/order//processOrder`
       * that encodes the workflow's module specifier and function name.
       *
       * Use `parseWorkflowName()` from `@workflow/utils/parse-name` to extract:
       * - `shortName`: User-friendly display name (e.g., `"processOrder"`)
       * - `moduleSpecifier`: The module path or package (e.g., `"./src/workflows/order"`)
       * - `functionName`: The full function path (e.g., `"processOrder"`)
       *
       * @example
       * ```ts
       * import { parseWorkflowName } from "@workflow/utils/parse-name";
       *
       * const parsed = parseWorkflowName(run.workflowName);
       * // parsed.shortName → "processOrder"
       * // parsed.moduleSpecifier → "./src/workflows/order"
       * ```
       */
      workflowName: z4.string(),
      // Optional in database for backward compatibility, defaults to 1 (legacy) when reading
      specVersion: z4.number().optional(),
      executionContext: z4.record(z4.string(), z4.any()).optional(),
      input: SerializedDataSchema.optional(),
      output: SerializedDataSchema.optional(),
      /**
       * A dynamic run's workflow VM code, serialized through the run-payload
       * pipeline. Compression is conditional on protocol support and benefit;
       * encryption is conditional on the World supplying run key material.
       * Replay reads this opaque payload from the run rather than creation events.
       */
      dynamicWorkflowCode: SerializedDataSchema.optional(),
      /**
       * The thrown value from a run_failed event, serialized via the workflow
       * serialization pipeline. To display the error to a user, hydrate it via
       * `hydrateRunError` (with the encryption key if encryption is enabled).
       * Observability tools cannot view the error without going through the
       * decryption + hydration pipeline.
       */
      error: SerializedDataSchema.optional(),
      /**
       * The high-level error category (USER_ERROR, RUNTIME_ERROR, etc.) from a
       * run_failed event. Kept as plaintext metadata for routing and filtering
       * without needing to decrypt the full error payload.
       */
      errorCode: z4.string().optional(),
      /**
       * Plaintext string-string metadata attached to the run via
       * `setAttributes()` (or, in the future, materialized
       * from `attr_set` events). Stored unencrypted alongside other
       * plaintext fields so observability surfaces can read it without
       * going through the decryption pipeline.
       *
       * Defaults to `{}` after schema parsing so consumers always receive
       * a record regardless of world. World adapters need not initialize
       * the field on disk: `world-local` JSON files written before this
       * field existed, and rows from any other adapter that omits the
       * column, both read as `{}` after Zod parses them.
       *
       * EXPERIMENTAL (MVP): the full Workflow Attributes feature replaces
       * the direct-mutation MVP path with an event-sourced model. See
       * the attributes-mvp changelog entry.
       */
      attributes: z4.record(z4.string(), z4.string()).default({}),
      /**
       * The run's X25519 public key, base64-encoded (~44 chars).
       *
       * Lets any party that can read this run seal a payload *to* it without
       * being able to read the run's data. This is used for cross-run writes
       * such as a hook resumption from another deployment, or a child workflow
       * writing into a forwarded stream. The matching private scalar is never
       * stored: it is re-derived on demand from the deployment's own key
       * material, so this field is not secret and its presence does not weaken
       * the run's confidentiality.
       *
       * Stamped at run creation by SDKs that support sealed (`encp`) envelopes.
       * **Presence is the writer-side gate**: a run only carries a public key if
       * the runtime that created it could also open sealed payloads, and runs are
       * pinned to their creating deployment. Writers therefore seal iff this
       * field is set, and otherwise fall back to fetching the symmetric per-run
       * key. Absent on runs created by older SDKs, and on worlds that do not
       * implement `getEncryptionKeyForRun` (encryption disabled).
       */
      encryptionPublicKey: z4.string().optional(),
      expiredAt: z4.coerce.date().optional(),
      startedAt: z4.coerce.date().optional(),
      completedAt: z4.coerce.date().optional(),
      createdAt: z4.coerce.date(),
      updatedAt: z4.coerce.date()
    }));
    WorkflowRunSchema = z4.compile(z4.discriminatedUnion("status", [
      // Non-final states
      WorkflowRunBaseSchema.extend({
        status: z4.enum([
          "pending",
          "running"
        ]),
        output: z4.undefined().optional(),
        error: z4.undefined().optional(),
        completedAt: z4.undefined().optional()
      }),
      // Cancelled state
      WorkflowRunBaseSchema.extend({
        status: z4.literal("cancelled"),
        output: z4.undefined().optional(),
        error: z4.undefined().optional(),
        completedAt: z4.coerce.date()
      }),
      // Completed state - output can be v1 or v2 format
      WorkflowRunBaseSchema.extend({
        status: z4.literal("completed"),
        output: SerializedDataSchema.optional(),
        error: z4.undefined().optional(),
        completedAt: z4.coerce.date()
      }),
      // Failed state
      WorkflowRunBaseSchema.extend({
        status: z4.literal("failed"),
        output: z4.undefined().optional(),
        error: SerializedDataSchema.optional(),
        completedAt: z4.coerce.date()
      })
    ]));
    BULK_CANCEL_MAX_RUN_IDS = 500;
    BulkCancelWorkflowRunsRequestSchema = z4.compile(z4.object({
      runIds: z4.array(z4.string()).min(1).max(BULK_CANCEL_MAX_RUN_IDS).refine((ids) => new Set(ids).size === ids.length, {
        message: "runIds must not contain duplicates"
      }),
      cancelReason: z4.string().max(512).optional()
    }));
    BulkCancelWorkflowRunResultSchema = z4.compile(z4.discriminatedUnion("outcome", [
      z4.object({
        runId: z4.string(),
        outcome: z4.literal("cancelled")
      }),
      z4.object({
        runId: z4.string(),
        outcome: z4.literal("already_cancelled")
      }),
      z4.object({
        runId: z4.string(),
        outcome: z4.literal("not_cancellable"),
        status: z4.string()
      }),
      z4.object({
        runId: z4.string(),
        outcome: z4.literal("not_found")
      }),
      z4.object({
        runId: z4.string(),
        outcome: z4.literal("failed"),
        code: z4.string(),
        retryable: z4.boolean()
      })
    ]));
    BulkCancelWorkflowRunsResultSchema = z4.compile(z4.object({
      summary: z4.object({
        requested: z4.number(),
        cancelled: z4.number(),
        alreadyCancelled: z4.number(),
        notCancellable: z4.number(),
        notFound: z4.number(),
        failed: z4.number()
      }),
      results: z4.array(BulkCancelWorkflowRunResultSchema)
    }));
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/steps.js
import { z as z5 } from "zod";
var StepStatusSchema, StepSchema, TerminalStepStatusSchema, TERMINAL_STEP_STATUSES;
var init_steps = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/steps.js"() {
    init_serialization();
    StepStatusSchema = z5.compile(z5.enum([
      "pending",
      "running",
      "completed",
      "failed",
      "cancelled"
    ]));
    StepSchema = z5.compile(z5.object({
      runId: z5.string(),
      stepId: z5.string(),
      /**
       * The machine-readable name of the step function.
       *
       * This field contains a structured identifier like `step//./src/workflows/order//processPayment`
       * that encodes the step's module specifier and function name.
       *
       * Use `parseStepName()` from `@workflow/utils/parse-name` to extract:
       * - `shortName`: User-friendly display name (e.g., `"processPayment"`)
       * - `moduleSpecifier`: The module path or package (e.g., `"./src/workflows/order"`)
       * - `functionName`: The full function path (e.g., `"processPayment"` or `"outer/nested"`)
       *
       * @example
       * ```ts
       * import { parseStepName } from "@workflow/utils/parse-name";
       *
       * const parsed = parseStepName(step.stepName);
       * // parsed.shortName → "processPayment"
       * // parsed.moduleSpecifier → "./src/workflows/order"
       * ```
       */
      stepName: z5.string(),
      status: StepStatusSchema,
      input: SerializedDataSchema.optional(),
      output: SerializedDataSchema.optional(),
      /**
       * The thrown value from a step_retrying or step_failed event, serialized
       * via the workflow serialization pipeline. Tracks the most recent error
       * the step encountered, which may be from a retry attempt (step_retrying)
       * or the final failure (step_failed).
       *
       * To display the error to a user, hydrate it via `hydrateStepError` (with
       * the encryption key if encryption is enabled). Observability tools cannot
       * view the error without going through the decryption + hydration pipeline.
       */
      error: SerializedDataSchema.optional(),
      attempt: z5.number(),
      /**
       * When the step first started executing. Set by the first step_started event
       * and not updated on subsequent retries.
       */
      startedAt: z5.coerce.date().optional(),
      completedAt: z5.coerce.date().optional(),
      createdAt: z5.coerce.date(),
      updatedAt: z5.coerce.date(),
      retryAfter: z5.coerce.date().optional(),
      // Optional in database for backwards compatibility, defaults to 1 (legacy) when reading
      specVersion: z5.number().optional()
    }));
    TerminalStepStatusSchema = z5.compile(StepStatusSchema.extract([
      "completed",
      "failed",
      "cancelled"
    ]));
    TERMINAL_STEP_STATUSES = TerminalStepStatusSchema.options;
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/waits.js
import { z as z6 } from "zod";
var WaitStatusSchema, WaitSchema;
var init_waits = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/waits.js"() {
    WaitStatusSchema = z6.compile(z6.enum([
      "waiting",
      "completed"
    ]));
    WaitSchema = z6.compile(z6.object({
      waitId: z6.string(),
      runId: z6.string(),
      status: WaitStatusSchema,
      resumeAt: z6.coerce.date().optional(),
      completedAt: z6.coerce.date().optional(),
      createdAt: z6.coerce.date(),
      updatedAt: z6.coerce.date(),
      specVersion: z6.number().optional()
    }));
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/analytics.js
import { z as z7 } from "zod";
var NAIVE_DATETIME, UTCDateSchema, NullableDateSchema, NullableStringSchema, NullableBooleanSchema, AnalyticsRunSchema, AnalyticsStepSchema, AnalyticsEventSchema, AnalyticsHookSchema, AnalyticsWaitSchema, AnalyticsAttributeKeySchema;
var init_analytics = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/analytics.js"() {
    init_events();
    init_runs();
    init_steps();
    init_waits();
    NAIVE_DATETIME = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?$/;
    UTCDateSchema = z7.compile(z7.preprocess((value) => {
      if (typeof value === "string" && NAIVE_DATETIME.test(value)) {
        return `${value.replace(" ", "T")}Z`;
      }
      return value;
    }, z7.coerce.date()));
    NullableDateSchema = z7.compile(UTCDateSchema.nullable().optional());
    NullableStringSchema = z7.compile(z7.string().nullable().optional());
    NullableBooleanSchema = z7.compile(z7.boolean().nullable().optional());
    AnalyticsRunSchema = z7.compile(z7.object({
      runId: z7.string(),
      status: WorkflowRunStatusSchema,
      deploymentId: z7.string(),
      workflowName: z7.string(),
      specVersion: z7.coerce.number().optional(),
      attributes: z7.record(z7.string(), z7.string()).default({}),
      createdAt: UTCDateSchema,
      updatedAt: UTCDateSchema,
      startedAt: NullableDateSchema,
      completedAt: NullableDateSchema,
      errorCode: NullableStringSchema,
      workflowCoreVersion: NullableStringSchema,
      workflowEncryptionEnabled: NullableBooleanSchema
    }));
    AnalyticsStepSchema = z7.compile(z7.object({
      runId: z7.string(),
      stepId: z7.string(),
      stepName: NullableStringSchema,
      status: StepStatusSchema,
      attempt: z7.number().optional(),
      createdAt: UTCDateSchema,
      updatedAt: UTCDateSchema,
      startedAt: NullableDateSchema,
      completedAt: NullableDateSchema,
      retryAfter: NullableDateSchema,
      errorCode: NullableStringSchema,
      workflowCoreVersion: NullableStringSchema,
      workflowEncryptionEnabled: NullableBooleanSchema,
      /** Compute instance of the latest attempt's `step_started`. */
      computeInstanceId: NullableStringSchema
    }));
    AnalyticsEventSchema = z7.compile(z7.object({
      runId: z7.string(),
      eventId: z7.string(),
      eventType: EventTypeSchema,
      correlationId: NullableStringSchema,
      entityId: NullableStringSchema,
      stepName: NullableStringSchema,
      workflowName: z7.string(),
      deploymentId: z7.string(),
      specVersion: z7.coerce.number().optional(),
      runCreatedAt: UTCDateSchema,
      createdAt: UTCDateSchema,
      region: NullableStringSchema,
      vercelId: NullableStringSchema,
      requestId: NullableStringSchema,
      /** Compute instance that wrote the event. See CreateEventParams. */
      computeInstanceId: NullableStringSchema,
      resumeAt: NullableDateSchema,
      retryAfter: NullableDateSchema,
      errorCode: NullableStringSchema,
      workflowCoreVersion: NullableStringSchema,
      isWebhook: NullableBooleanSchema,
      isSystem: NullableBooleanSchema,
      workflowEncryptionEnabled: NullableBooleanSchema
    }));
    AnalyticsHookSchema = z7.compile(z7.object({
      runId: z7.string(),
      hookId: z7.string(),
      status: z7.enum([
        "created",
        "received",
        "disposed",
        "conflict"
      ]),
      createdAt: UTCDateSchema,
      updatedAt: UTCDateSchema,
      receivedAt: NullableDateSchema,
      disposedAt: NullableDateSchema,
      isWebhook: NullableBooleanSchema,
      isSystem: NullableBooleanSchema,
      workflowCoreVersion: NullableStringSchema,
      workflowEncryptionEnabled: NullableBooleanSchema
    }));
    AnalyticsWaitSchema = z7.compile(z7.object({
      runId: z7.string(),
      waitId: z7.string(),
      status: WaitStatusSchema,
      resumeAt: NullableDateSchema,
      createdAt: UTCDateSchema,
      updatedAt: UTCDateSchema,
      completedAt: NullableDateSchema,
      workflowCoreVersion: NullableStringSchema,
      workflowEncryptionEnabled: NullableBooleanSchema
    }));
    AnalyticsAttributeKeySchema = z7.compile(z7.object({
      key: z7.string(),
      runCount: z7.coerce.number(),
      firstSeenAt: UTCDateSchema,
      lastSeenAt: UTCDateSchema
    }));
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/env-config.js
function warnOnce(key, message) {
  if (warnedEnvValues.has(key)) return;
  warnedEnvValues.add(key);
  console.warn(`[workflow] ${message}`);
}
function envNumber(name, fallback, options = {}) {
  const raw = process.env[name];
  if (raw === void 0 || raw === "") return fallback;
  const { min = 0, max, integer = false } = options;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || integer && !Number.isInteger(parsed)) {
    warnOnce(`${name}=${raw}`, `Ignoring ${name}: not a ${integer ? "finite integer" : "finite number"}; using default ${fallback}`);
    return fallback;
  }
  if (parsed < min) {
    warnOnce(`${name}=${raw}`, `${name} below minimum ${min}; clamped`);
    return min;
  }
  if (max !== void 0 && parsed > max) {
    warnOnce(`${name}=${raw}`, `${name} above maximum ${max}; clamped`);
    return max;
  }
  return parsed;
}
var WarnedEnvValuesKey, globalStore, warnedEnvValues;
var init_env_config = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/env-config.js"() {
    WarnedEnvValuesKey = /* @__PURE__ */ Symbol.for("@workflow/world//warnedEnvValues/v1");
    globalStore = globalThis;
    warnedEnvValues = globalStore[WarnedEnvValuesKey] ??= /* @__PURE__ */ new Set();
    __name(warnOnce, "warnOnce");
    __name(envNumber, "envNumber");
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/queue.js
import { z as z8 } from "zod/v4";
function resolveQueueNamespace(namespace) {
  return namespace ?? process.env.WORKFLOW_QUEUE_NAMESPACE ?? void 0;
}
function getQueueTopicPrefix(kind, namespace) {
  if (kind !== "workflow") {
    throw new Error(`Unsupported queue kind: ${kind}`);
  }
  if (namespace !== void 0) {
    QueueNamespace.parse(namespace);
    return `__${namespace}_wkf_workflow_`;
  }
  return "__wkf_workflow_";
}
var QueuePrefix, ValidQueueName, QueueNamespace, MessageId, TraceCarrierSchema, RunInputSchema, StepDispatchInputSchema, RunDispatchContextSchema, HookResumeInputSchema, HookResumeTimingSchema, WorkflowInvokePayloadSchema, HealthCheckPayloadSchema, QueuePayloadSchema;
var init_queue = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/queue.js"() {
    init_serialization();
    QueuePrefix = z8.compile(z8.string().regex(/^__(?:[a-z][a-z0-9]*_)?wkf_workflow_$/, "Must match __wkf_workflow_ or __{namespace}_wkf_workflow_"));
    ValidQueueName = z8.compile(z8.string().regex(/^__(?:[a-z][a-z0-9]*_)?wkf_workflow_.+$/, "Must be a valid queue name with a recognized prefix"));
    QueueNamespace = z8.compile(z8.string().regex(/^[a-z][a-z0-9]*$/, "Must be lowercase alphanumeric, starting with a letter"));
    __name(resolveQueueNamespace, "resolveQueueNamespace");
    __name(getQueueTopicPrefix, "getQueueTopicPrefix");
    MessageId = z8.compile(z8.string().brand().describe("A stored queue message ID"));
    TraceCarrierSchema = z8.compile(z8.record(z8.string(), z8.string()));
    RunInputSchema = z8.compile(z8.object({
      input: z8.unknown(),
      deploymentId: z8.string(),
      workflowName: z8.string(),
      specVersion: z8.number(),
      executionContext: z8.record(z8.string(), z8.any()).optional(),
      /** Dynamic workflow code carried for resilient run creation. */
      dynamicWorkflowCode: SerializedDataSchema.optional(),
      /** Ref for deferred dynamic workflow code; mutually exclusive with bytes. */
      dynamicWorkflowCodeRef: z8.string().optional(),
      /** Initial plaintext run attributes, for resilient run creation. */
      attributes: z8.record(z8.string(), z8.string()).optional(),
      /**
       * Permits reserved `$`-prefixed keys in `attributes`, mirrored from the
       * `start()` option so resilient run creation validates the same way as
       * the original `run_created` attempt.
       */
      allowReservedAttributes: z8.literal(true).optional(),
      /**
       * The environment the creating client's writes are attributed to, as
       * reported by {@link World.getEnvironment} at `start()` time (on Vercel:
       * `'production' | 'preview' | 'development'`).
       *
       * This exists so the resilient-start path can be checked for a tenant
       * mismatch. `start()` writes `run_created` under the caller's own
       * credentials while pinning the queue message to a deployment, and those
       * two can disagree: if the message is consumed by a deployment in a
       * DIFFERENT environment, that consumer's `run_started` re-creates the run
       * under ITS tenant, so the same client-minted `wrun_` id ends up existing
       * in two environments: one stuck pending forever, the other executing.
       * Carrying the creator's environment lets the consumer compare it against
       * its own and refuse the delivery instead of forking the run.
       *
       * Absent for worlds with no environment dimension (local, Postgres), and
       * for older SDKs. Consumers must treat it as advisory and skip the check
       * when it is missing.
       */
      environment: z8.string().optional()
    }).refine((value) => value.dynamicWorkflowCode === void 0 || value.dynamicWorkflowCodeRef === void 0, {
      path: [
        "dynamicWorkflowCodeRef"
      ],
      message: "dynamicWorkflowCode and dynamicWorkflowCodeRef are mutually exclusive"
    }));
    StepDispatchInputSchema = z8.compile(z8.object({
      /**
       * The serialized step input, reused verbatim from the direct write. Always
       * binary: producers only attach `stepInput` when the dehydrated input is a
       * `Uint8Array` and the run's queue transport preserves bytes (CBOR).
       * Validated here so a malformed or transport-mangled payload fails the
       * message parse instead of being silently written into a `step_created` as
       * non-binary data. `Buffer` is a `Uint8Array` subclass and passes.
       */
      input: z8.custom((value) => value instanceof Uint8Array, {
        message: "stepInput.input must be a Uint8Array"
      })
    }));
    RunDispatchContextSchema = z8.compile(z8.object({
      /** The deployment the run is pinned to (`WorkflowRun.deploymentId`). */
      deploymentId: z8.string(),
      /** The run's spec version (`WorkflowRun.specVersion`). */
      specVersion: z8.number(),
      /** The run's start time as epoch ms (`WorkflowRun.startedAt`). Numeric so
       *  it survives both queue transports without Date revival concerns. */
      startedAt: z8.number().optional(),
      /** The run's lineage root (its `$rootRunId` attribute, or its own id). */
      rootRunId: z8.string().optional()
    }));
    HookResumeInputSchema = z8.compile(z8.object({
      /** Stable idempotency key minted once per `resumeHook()` call. */
      resumeId: z8.string(),
      /** The hook being resumed. */
      hookId: z8.string(),
      /**
       * The hook's token, written into the `hook_received` event's `eventData` so
       * the consumer's re-ensured event carries the same token the producer
       * would. Replay validates `eventData.token` against the `createHook` token.
       */
      token: z8.string(),
      /** The serialized resume payload, reused verbatim from the direct write. */
      payload: z8.unknown(),
      /**
       * Content digest of `payload`, computed once by the producer over the
       * serialized bytes and forwarded verbatim on both the direct `events.create`
       * and this queue message. The consumer forwards it back to the server so both
       * writers of the same `resumeId` record an identical digest on the
       * `(runId, resumeId)` constraint, required because the v4 payload ref is not
       * content-stable server-side.
       */
      payloadDigest: z8.string(),
      /**
       * The deployment the run is pinned to, from the producer's resume context.
       * Lets the consumer detect a misrouted delivery with a cheap ambient
       * deployment-id comparison BEFORE its hoisted `hook_received` replay-preload
       * write: only a detected mismatch pays for the authoritative run fetch and
       * the deployment-affinity guard. Optional for queued-message compatibility:
       * messages from older producers omit it and skip the pre-write
       * check (the authoritative guard before replay still protects them).
       */
      deploymentId: z8.string().optional()
    }));
    HookResumeTimingSchema = z8.compile(z8.object({
      /** Epoch ms at entry into `resumeHook()`: the start of the TTR window. */
      resumeRequestedAtMs: z8.number(),
      /** Epoch ms immediately before the queue publish was requested. */
      queuePublishRequestedAtMs: z8.number(),
      /**
       * Which `resumeHook()` dispatch path ran. Current producers always report
       * `sequential` (durable write, then wake); older producers may report
       * `lazy` or `parallel`.
       */
      strategy: z8.string().optional(),
      /** Epoch ms the final consumer's queue handler was entered. */
      consumerStartedAtMs: z8.number().optional(),
      /** Epoch ms this invocation's first replay pass began. */
      replayStartedAtMs: z8.number().optional(),
      /** Epoch ms replay first encountered a durable step after the resume. */
      nextStepEncounteredAtMs: z8.number().optional(),
      /** How the consumer initialized replay state: see `ResumeSetupSource`. */
      setupSource: z8.string().optional()
    }));
    WorkflowInvokePayloadSchema = z8.compile(z8.object({
      runId: z8.string(),
      /** Process this input and return the handler's result as response data. */
      invoke: z8.literal(true).optional(),
      /** Identifies one input across retries, separately from the queue delivery ID. */
      requestId: z8.string().optional(),
      input: z8.unknown().optional(),
      traceCarrier: TraceCarrierSchema.optional(),
      requestedAt: z8.coerce.date().optional(),
      /**
       * Consecutive replay divergences in this recovery chain and latest position.
       *
       * `eventIds` is every divergent event id in the chain, oldest first, so the
       * terminal failure can say whether each recovery replay diverged at the same
       * event or wandered. The producer bounds it to the recovery budget plus one.
       * `.catch(undefined)` on the field for the reason `hookResumeTiming` has it:
       * a malformed history must degrade to "no history" rather than fail the
       * parse of every delivery of this message. A consumer that predates the
       * field ignores it; a producer that predates it sends none, and the consumer
       * restarts the history from `eventId`.
       */
      replayDivergence: z8.object({
        eventId: z8.string(),
        count: z8.number().int().positive(),
        eventIds: z8.array(z8.string()).optional().catch(void 0)
      }).optional(),
      /**
       * Re-invocations so far in this chain of stale-snapshot (precondition)
       * rejections. Counted on the message because the in-process restart budget
       * lives in the invocation closure and the queue's delivery count resets on
       * every fresh enqueue, so without this a permanently fenced run would cycle
       * forever instead of failing.
       */
      preconditionReinvocations: z8.number().int().positive().optional(),
      /** Number of times this message has been re-enqueued due to server errors (5xx) */
      serverErrorRetryCount: z8.number().int().optional(),
      /** Number of times this message has been re-routed after a deployment mismatch */
      deploymentMismatchRetryCount: z8.number().int().nonnegative().optional(),
      /**
       * The wait this message is the delayed continuation for, and which attempt
       * in that wait's chain it is.
       *
       * Present only on wait-continuation messages. It exists so the invocation a
       * continuation wakes can recognize itself as that continuation: if the wait
       * is STILL pending when it replays — the continuation arrived before its
       * deadline — then its own idempotency key is already spent, and re-enqueueing
       * under the same key is silently dropped by the world's dedupe window. The
       * attempt number is what makes the next key fresh, so an early delivery
       * costs one extra hop instead of losing the wait's timer permanently.
       *
       * Counted on the message for the same reason as
       * {@link WorkflowInvokePayloadSchema.shape.preconditionReinvocations}: the
       * budget has to survive across invocations, and a fresh enqueue resets
       * anything the queue tracks itself. Absent on the first continuation, so a
       * producer that predates this field is indistinguishable from attempt 0 and
       * a consumer that predates it simply ignores the field.
       */
      /**
      * `.catch(undefined)` for the reason `hookResumeTiming` has it: this field
      * must never be able to fail the parse of the invocation payload. A
      * malformed value would otherwise throw on every delivery of the message
      * and burn the run's delivery budget. Degrading to `undefined` reads as
      * "not a continuation", which costs at worst the pre-attempt behavior for
      * that one wait rather than killing the run.
      */
      waitContinuation: z8.object({
        correlationId: z8.string(),
        attempt: z8.number().int().nonnegative()
      }).optional().catch(void 0),
      /** Step ID for inline step execution in combined handler. If provided, the flow execution
       * will jump directly to execute the step with the given ID before doing an event replay. */
      stepId: z8.string().optional(),
      /** Step name, sent alongside stepId to avoid loading the event log to resolve the name. */
      stepName: z8.string().optional(),
      /** Run creation data, only present on the first queue delivery from start() */
      runInput: RunInputSchema.optional(),
      /**
       * Legacy lazy hook resume data. A consumer that understands this field
       * idempotently ensures the `hook_received` event exists (keyed by `resumeId`)
       * before replaying.
       */
      hookInput: HookResumeInputSchema.optional(),
      /**
       * Resilient step dispatch data, only present alongside `stepId` when the
       * producer parallelized the `step_created` write with this queue publish. A
       * consumer that understands this field idempotently ensures the
       * `step_created` event exists (keyed by `stepId`) before executing the step.
       */
      stepInput: StepDispatchInputSchema.optional(),
      /**
       * Immutable run identity for step-execution messages (`stepId` present).
       * Lets the consumer skip the blocking `runs.get` before starting the step.
       * See {@link RunDispatchContextSchema}.
       */
      runContext: RunDispatchContextSchema.optional(),
      /**
       * Hook-resume TTR timing. Present on both `resumeHook()` dispatch paths
       * (unlike legacy `hookInput`), and
       * forwarded onto a dispatched step message when the resuming invocation
       * hands the next durable step to another invocation. Purely observational.
       * See {@link HookResumeTimingSchema}.
       *
       * `.catch(undefined)` because this field must never be able to fail the
       * parse of the invocation payload: a malformed value (a NaN boundary, a
       * shape change from a future producer) would otherwise throw on every
       * delivery of that message and burn the run's delivery budget over a
       * telemetry field. Anything unparseable degrades to "no measurement".
       */
      hookResumeTiming: HookResumeTimingSchema.optional().catch(void 0)
    }));
    HealthCheckPayloadSchema = z8.compile(z8.object({
      __healthCheck: z8.literal(true),
      correlationId: z8.string(),
      /**
       * The run id the caller is about to create, when the probe is being used to
       * prepare a cross-deployment `start()`.
       *
       * The responder runs inside the target deployment, so it can derive that
       * run's public key locally from its own key material and return it in the
       * probe response. That lets the caller seal the workflow arguments without
       * a separate key lookup. Absent for probes issued for other reasons (CLI
       * health command, dashboard), in which case no key is returned.
       *
       * Deliberately not named `runId`: `runId` is the only required field of
       * `WorkflowInvokePayloadSchema`, and 4.x deployments parse queue payloads
       * with a union that tries the invoke schema before the health check. A
       * probe carrying `runId` is read there as "replay this run", which POSTs
       * `run_started` for a run that does not exist yet (404) and retries the
       * delivery, so the probe never answers.
       */
      probeRunId: z8.string().optional(),
      /**
       * Legacy spelling of {@link probeRunId}, sent by 5.x callers released
       * before the rename. Accepted so those callers still get a public key
       * back from this deployment; never sent.
       */
      runId: z8.string().optional()
    }));
    QueuePayloadSchema = z8.compile(z8.union([
      HealthCheckPayloadSchema,
      WorkflowInvokePayloadSchema
    ]));
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/hooks.js
import { z as z9 } from "zod";
var HookResumeContextSchema, HOOK_RESUME_INPUT_VERSION, HOOK_RESUME_DEDUP_VERSION, HookResumeCapabilitiesSchema, HookClaimedFromSchema, HookSchema;
var init_hooks = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/hooks.js"() {
    init_queue();
    init_serialization();
    HookResumeContextSchema = z9.compile(z9.object({
      deploymentId: z9.string(),
      workflowName: z9.string(),
      // Named `runSpecVersion` to distinguish it from the hook's own `specVersion`.
      runSpecVersion: z9.number().optional(),
      workflowCoreVersion: z9.string().optional(),
      // Node.js version of the run's creating deployment, mirrored from
      // `executionContext.nodeVersion`. Decides whether a resume may write zstd
      // (which needs Node.js >= 22.15) or must use gzip. Absent on runs created
      // before the field existed and on non-Node runtimes, where writers use gzip.
      nodeVersion: z9.string().optional(),
      traceCarrier: TraceCarrierSchema.optional(),
      // The run's published X25519 public key (base64), mirrored from the run
      // entity. Lets a resume seal (`encp`) its payload to the run without reading
      // the run or fetching its symmetric key. Absent on runs created before
      // sealed envelopes and on projects with encryption disabled, where the
      // resume falls back to the symmetric per-run key.
      encryptionPublicKey: z9.string().optional(),
      // Feature marker: the version of the lazy-hook-resume consumer protocol the
      // run's creating deployment supports. Present (>= 1) means that deployment's
      // `@workflow/core` re-ensures the `hook_received` event from a queue
      // message's `hookInput` on replay. Current producers no longer send
      // `hookInput` (the durable write happens before the wake is published), so
      // they never read this marker; it remains stamped so OLDER producers, which
      // still gate their lazy path on it, keep working against new runs. Because a
      // run is pinned to its creating deployment, this marker is a reliable
      // per-run attestation, unlike inferring support from a version compare
      // against a predicted release cutoff.
      hookResumeInputVersion: z9.number().optional()
    }));
    HOOK_RESUME_INPUT_VERSION = 1;
    HOOK_RESUME_DEDUP_VERSION = 1;
    HookResumeCapabilitiesSchema = z9.compile(z9.object({
      // Present (>= HOOK_RESUME_DEDUP_VERSION) when the live backend enforces the
      // `(runId, resumeId)` dedup constraint AND no server-side kill switch is
      // active. Absent against an older/rolled-back server or when the kill switch
      // is engaged.
      hookResumeDedupVersion: z9.number()
    }));
    HookClaimedFromSchema = z9.compile(z9.object({
      runId: z9.string(),
      hookId: z9.string(),
      workflowName: z9.string().optional(),
      deploymentId: z9.string().optional(),
      runSpecVersion: z9.number().optional()
    }));
    HookSchema = z9.compile(z9.object({
      runId: z9.string(),
      hookId: z9.string(),
      token: z9.string(),
      ownerId: z9.string(),
      projectId: z9.string(),
      environment: z9.string(),
      metadata: SerializedDataSchema.optional(),
      createdAt: z9.coerce.date(),
      // Optional in database for backward compatibility, defaults to 1 (legacy) when reading
      specVersion: z9.number().optional(),
      isWebhook: z9.boolean().optional(),
      isSystem: z9.boolean().optional(),
      // Earliest time the token can become available after the owning run ends.
      // An active run keeps the token beyond this deadline.
      tokenRetentionUntil: z9.coerce.date().optional(),
      // Present when the server stored it (new hooks) or synthesized it from the
      // run (old hooks). Absent only against an old server, where the resume path
      // falls back to `runs.get`.
      resumeContext: HookResumeContextSchema.optional(),
      // Backend dedup capability, computed FRESH by the server on every by-token
      // lookup: RESPONSE-ONLY and TRANSIENT. Never persisted on the hook entity
      // and never part of `resumeContext`, so a server rollback or kill switch
      // takes effect on the next lookup (the field stops appearing).
      // `resumeHook()` gates its lazy path on this being present and
      // current. Absent against an older/rolled-back server or when the kill switch
      // is active.
      resumeCapabilities: HookResumeCapabilitiesSchema.optional(),
      // Set when this hook took its token from another run
      // (`experimental_force`). The wake-targeting fields are the victim run's,
      // so the claimer's runtime can publish the victim's wake without reading
      // a run it may not be able to reach; see `HookClaimedFromSchema`.
      claimedFrom: HookClaimedFromSchema.optional()
    }));
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/node-http-flag.js
var init_node_http_flag = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/node-http-flag.js"() {
    init_env_config();
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/recovery.js
var init_recovery = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/recovery.js"() {
    init_queue();
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/shared.js
import { z as z10 } from "zod";
var zodJsonSchema, PageInfoSchema, StructuredErrorSchema;
var init_shared = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/shared.js"() {
    zodJsonSchema = z10.lazy(() => {
      return z10.union([
        z10.string(),
        z10.number(),
        z10.boolean(),
        z10.null(),
        z10.array(zodJsonSchema),
        z10.record(z10.string(), zodJsonSchema)
      ]);
    });
    PageInfoSchema = z10.compile(z10.object({
      currentLookbackDays: z10.number(),
      maxLookbackDays: z10.number(),
      currentWindowStart: z10.coerce.date(),
      maxWindowStart: z10.coerce.date(),
      upgradeAvailable: z10.boolean()
    }));
    StructuredErrorSchema = z10.compile(z10.object({
      message: z10.string(),
      stack: z10.string().optional(),
      code: z10.string().optional()
    }));
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/slot-identity.js
var MAX_EVENT_SLOT;
var init_slot_identity = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/slot-identity.js"() {
    MAX_EVENT_SLOT = Number.MAX_SAFE_INTEGER;
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/snapshots.js
import { z as z11 } from "zod";
var SnapshotMetadataSchema;
var init_snapshots = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/snapshots.js"() {
    SnapshotMetadataSchema = z11.object({
      /**
       * Pagination cursor for events.list() — the snapshot was taken at
       * this point in the event log. On restore, only events AFTER this
       * cursor need to be fetched.
       */
      eventsCursor: z11.string().nullable(),
      /** Timestamp when the snapshot was created */
      createdAt: z11.coerce.date(),
      /**
       * Number of events the run had processed when the snapshot was taken.
       * Restores see only the delta after `eventsCursor`, so guards that need
       * the TOTAL log size (the server-supplied max-events ceiling) add this
       * to the delta. Optional for snapshots written before the field existed
       * (treated as 0 — the ceiling degrades to delta-only for those, exactly
       * the pre-field behavior).
       */
      eventCount: z11.number().int().nonnegative().optional(),
      /**
       * Number of draws the run's seeded PRNG had consumed when the snapshot
       * was taken. On restore the runtime re-seeds from the run's BASE seed
       * and fast-forwards this many draws, so correlation-id generation
       * continues at the exact position full replay would have reached —
       * keeping ids identical across snapshot generations AND identical to a
       * no-snapshot run (which is what makes concurrent invocations restored
       * from different snapshots of the same run still collide on the world's
       * per-(runId, correlationId) dedup).
       */
      rngDraws: z11.number().int().nonnegative().optional(),
      /**
       * Snapshot-portable token of the engine's host-serde capture root: the
       * container of pristine intrinsics/samples/symbols captured before any
       * user code ran, whose box lives inside the snapshot's memory image. A
       * restore re-adopts it by this token so serde initialization executes
       * no guest code after user code has run. Required to restore (format
       * version >= 2); snapshots without it are treated as a miss.
       */
      serdeRootPtr: z11.number().int().optional(),
      /**
       * The monotonic correlation-id ULID factory's last output when the
       * snapshot was taken (undefined if the run had drawn none). The
       * factory's state lives host-side and does not survive into the memory
       * image; on restore the runtime continues the sequence from this value
       * (same-timestamp base32 increment), so a restored invocation emits
       * the exact ids a full replay would — keeping concurrent invocations
       * of the same run dedupable via per-(runId, correlationId) uniqueness.
       */
      lastUlid: z11.string().optional(),
      /**
       * Exact engine build (quickjs-wasi package version) that captured the
       * heap image. The image's own QJSS header is identical across builds,
       * so restoring under a different build would pass deserialization and
       * execute as undefined behavior in the interpreter — a real hazard
       * during a rolling deploy that bumps quickjs-wasi, when live snapshots
       * from the old build meet instances running the new one. Readers MUST
       * treat a mismatch (or absence) as a clean miss.
       */
      engineVersion: z11.string().optional(),
      /**
       * The deterministic replay clock's high-water mark (ms since epoch) at
       * capture. The clock lives host-side; without this a restored VM's
       * `Date.now()` regresses to the run-creation time until the first
       * delta event advances it, so restores initialize the clock to
       * `max(derived, clockMs)`.
       */
      clockMs: z11.number().optional(),
      /**
       * Snapshot format tag. A reader that doesn't recognize the version
       * treats the snapshot as a clean miss (full replay) instead of handing
       * an incompatible heap to the WASM engine.
       */
      formatVersion: z11.number().int().optional()
    });
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/spec-version.js
function isLegacySpecVersion(v) {
  return v === void 0 || v === null || v <= SPEC_VERSION_LEGACY;
}
var SPEC_VERSION_LEGACY, SPEC_VERSION_SUPPORTS_EVENT_SOURCING, SPEC_VERSION_SUPPORTS_CBOR_QUEUE_TRANSPORT, SPEC_VERSION_SUPPORTS_ATTRIBUTES, SPEC_VERSION_SUPPORTS_COMPRESSION, SPEC_VERSION_SUPPORTS_SLOT_IDENTITY, SPEC_VERSION_SUPPORTS_HOOK_FORCE_CLAIM, SPEC_VERSION_CURRENT, SPEC_VERSION_MAX_SUPPORTED;
var init_spec_version = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/spec-version.js"() {
    init_env_config();
    SPEC_VERSION_LEGACY = 1;
    SPEC_VERSION_SUPPORTS_EVENT_SOURCING = 2;
    SPEC_VERSION_SUPPORTS_CBOR_QUEUE_TRANSPORT = 3;
    SPEC_VERSION_SUPPORTS_ATTRIBUTES = 4;
    SPEC_VERSION_SUPPORTS_COMPRESSION = 5;
    SPEC_VERSION_SUPPORTS_SLOT_IDENTITY = 6;
    SPEC_VERSION_SUPPORTS_HOOK_FORCE_CLAIM = 8;
    SPEC_VERSION_CURRENT = SPEC_VERSION_SUPPORTS_HOOK_FORCE_CLAIM;
    SPEC_VERSION_MAX_SUPPORTED = SPEC_VERSION_SUPPORTS_HOOK_FORCE_CLAIM;
    __name(isLegacySpecVersion, "isLegacySpecVersion");
  }
});

// ../../node_modules/.pnpm/ulid@3.0.2/node_modules/ulid/dist/node/index.js
import crypto2 from "node:crypto";
function randomChar(prng) {
  const randomPosition = Math.floor(prng() * ENCODING_LEN) % ENCODING_LEN;
  return ENCODING.charAt(randomPosition);
}
function replaceCharAt(str, index, char) {
  if (index > str.length - 1) {
    return str;
  }
  return str.substr(0, index) + char + str.substr(index + 1);
}
function incrementBase32(str) {
  let done = void 0, index = str.length, char, charIndex, output = str;
  const maxCharIndex = ENCODING_LEN - 1;
  while (!done && index-- >= 0) {
    char = output[index];
    charIndex = ENCODING.indexOf(char);
    if (charIndex === -1) {
      throw new ULIDError(ULIDErrorCode.Base32IncorrectEncoding, "Incorrectly encoded string");
    }
    if (charIndex === maxCharIndex) {
      output = replaceCharAt(output, index, ENCODING[0]);
      continue;
    }
    done = replaceCharAt(output, index, ENCODING[charIndex + 1]);
  }
  if (typeof done === "string") {
    return done;
  }
  throw new ULIDError(ULIDErrorCode.Base32IncorrectEncoding, "Failed incrementing string");
}
function detectPRNG(root) {
  const rootLookup = detectRoot();
  const globalCrypto = rootLookup && (rootLookup.crypto || rootLookup.msCrypto) || (typeof crypto2 !== "undefined" ? crypto2 : null);
  if (typeof globalCrypto?.getRandomValues === "function") {
    return () => {
      const buffer2 = new Uint8Array(1);
      globalCrypto.getRandomValues(buffer2);
      return buffer2[0] / 256;
    };
  } else if (typeof globalCrypto?.randomBytes === "function") {
    return () => globalCrypto.randomBytes(1).readUInt8() / 256;
  } else if (crypto2?.randomBytes) {
    return () => crypto2.randomBytes(1).readUInt8() / 256;
  }
  throw new ULIDError(ULIDErrorCode.PRNGDetectFailure, "Failed to find a reliable PRNG");
}
function detectRoot() {
  if (inWebWorker()) return self;
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  return null;
}
function encodeRandom(len, prng) {
  let str = "";
  for (; len > 0; len--) {
    str = randomChar(prng) + str;
  }
  return str;
}
function encodeTime(now, len = TIME_LEN) {
  if (isNaN(now)) {
    throw new ULIDError(ULIDErrorCode.EncodeTimeValueMalformed, `Time must be a number: ${now}`);
  } else if (now > TIME_MAX) {
    throw new ULIDError(ULIDErrorCode.EncodeTimeSizeExceeded, `Cannot encode a time larger than ${TIME_MAX}: ${now}`);
  } else if (now < 0) {
    throw new ULIDError(ULIDErrorCode.EncodeTimeNegative, `Time must be positive: ${now}`);
  } else if (Number.isInteger(now) === false) {
    throw new ULIDError(ULIDErrorCode.EncodeTimeValueMalformed, `Time must be an integer: ${now}`);
  }
  let mod, str = "";
  for (let currentLen = len; currentLen > 0; currentLen--) {
    mod = now % ENCODING_LEN;
    str = ENCODING.charAt(mod) + str;
    now = (now - mod) / ENCODING_LEN;
  }
  return str;
}
function inWebWorker() {
  return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
}
function monotonicFactory(prng) {
  const currentPRNG = prng || detectPRNG();
  let lastTime = 0, lastRandom;
  return /* @__PURE__ */ __name(function _ulid(seedTime) {
    const seed = !seedTime || isNaN(seedTime) ? Date.now() : seedTime;
    if (seed <= lastTime) {
      const incrementedRandom = lastRandom = incrementBase32(lastRandom);
      return encodeTime(lastTime, TIME_LEN) + incrementedRandom;
    }
    lastTime = seed;
    const newRandom = lastRandom = encodeRandom(RANDOM_LEN, currentPRNG);
    return encodeTime(seed, TIME_LEN) + newRandom;
  }, "_ulid");
}
var ENCODING, ENCODING_LEN, RANDOM_LEN, TIME_LEN, TIME_MAX, ULIDErrorCode, ULIDError;
var init_node = __esm({
  "../../node_modules/.pnpm/ulid@3.0.2/node_modules/ulid/dist/node/index.js"() {
    ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    ENCODING_LEN = 32;
    RANDOM_LEN = 16;
    TIME_LEN = 10;
    TIME_MAX = 281474976710655;
    (function(ULIDErrorCode2) {
      ULIDErrorCode2["Base32IncorrectEncoding"] = "B32_ENC_INVALID";
      ULIDErrorCode2["DecodeTimeInvalidCharacter"] = "DEC_TIME_CHAR";
      ULIDErrorCode2["DecodeTimeValueMalformed"] = "DEC_TIME_MALFORMED";
      ULIDErrorCode2["EncodeTimeNegative"] = "ENC_TIME_NEG";
      ULIDErrorCode2["EncodeTimeSizeExceeded"] = "ENC_TIME_SIZE_EXCEED";
      ULIDErrorCode2["EncodeTimeValueMalformed"] = "ENC_TIME_MALFORMED";
      ULIDErrorCode2["PRNGDetectFailure"] = "PRNG_DETECT";
      ULIDErrorCode2["ULIDInvalid"] = "ULID_INVALID";
      ULIDErrorCode2["Unexpected"] = "UNEXPECTED";
      ULIDErrorCode2["UUIDInvalid"] = "UUID_INVALID";
    })(ULIDErrorCode || (ULIDErrorCode = {}));
    ULIDError = class extends Error {
      static {
        __name(this, "ULIDError");
      }
      constructor(errorCode, message) {
        super(`${message} (${errorCode})`);
        this.name = "ULIDError";
        this.code = errorCode;
      }
    };
    __name(randomChar, "randomChar");
    __name(replaceCharAt, "replaceCharAt");
    __name(incrementBase32, "incrementBase32");
    __name(detectPRNG, "detectPRNG");
    __name(detectRoot, "detectRoot");
    __name(encodeRandom, "encodeRandom");
    __name(encodeTime, "encodeTime");
    __name(inWebWorker, "inWebWorker");
    __name(monotonicFactory, "monotonicFactory");
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/ulid.js
import { z as z12 } from "zod";
var UlidSchema, workflowRunIdSchema, DEFAULT_TIMESTAMP_THRESHOLD_PAST_MS, DEFAULT_TIMESTAMP_THRESHOLD_FUTURE_MS;
var init_ulid = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/ulid.js"() {
    init_slot_identity();
    UlidSchema = z12.compile(z12.string().ulid());
    workflowRunIdSchema = z12.compile(z12.templateLiteral([
      "wrun_",
      z12.ulid()
    ]));
    DEFAULT_TIMESTAMP_THRESHOLD_PAST_MS = 24 * 60 * 60 * 1e3;
    DEFAULT_TIMESTAMP_THRESHOLD_FUTURE_MS = 5 * 60 * 1e3;
  }
});

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/index.js
var init_dist3 = __esm({
  "../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/index.js"() {
    init_analytics();
    init_attributes();
    init_env_config();
    init_events();
    init_hooks();
    init_node_http_flag();
    init_queue();
    init_recovery();
    init_runs();
    init_serialization();
    init_shared();
    init_slot_identity();
    init_snapshots();
    init_spec_version();
    init_steps();
    init_ulid();
    init_waits();
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/constants.js"(exports, module) {
    "use strict";
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/debug.js"(exports, module) {
    "use strict";
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module.exports = debug;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/re.js
var require_re = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/re.js"(exports, module) {
    "use strict";
    var { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = require_constants();
    var debug = require_debug();
    exports = module.exports = {};
    var re = exports.re = [];
    var safeRe = exports.safeRe = [];
    var src = exports.src = [];
    var safeSrc = exports.safeSrc = [];
    var t = exports.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      [
        "\\s",
        1
      ],
      [
        "\\d",
        MAX_LENGTH
      ],
      [
        LETTERDASHNUMBER,
        MAX_SAFE_BUILD_LENGTH
      ]
    ];
    var makeSafeRegex = /* @__PURE__ */ __name((value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    }, "makeSafeRegex");
    var createToken = /* @__PURE__ */ __name((name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    }, "createToken");
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/parse-options.js"(exports, module) {
    "use strict";
    var looseOption = Object.freeze({
      loose: true
    });
    var emptyOpts = Object.freeze({});
    var parseOptions2 = /* @__PURE__ */ __name((options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    }, "parseOptions");
    module.exports = parseOptions2;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/identifiers.js"(exports, module) {
    "use strict";
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = /* @__PURE__ */ __name((a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a === b ? 0 : a < b ? -1 : 1;
      }
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    }, "compareIdentifiers");
    var rcompareIdentifiers = /* @__PURE__ */ __name((a, b) => compareIdentifiers(b, a), "rcompareIdentifiers");
    module.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/semver.js"(exports, module) {
    "use strict";
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions2 = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class _SemVer {
      static {
        __name(this, "SemVer");
      }
      constructor(version3, options) {
        options = parseOptions2(options);
        if (version3 instanceof _SemVer) {
          if (version3.loose === !!options.loose && version3.includePrerelease === !!options.includePrerelease) {
            return version3;
          } else {
            version3 = version3.version;
          }
        } else if (typeof version3 !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version3}".`);
        }
        if (version3.length > MAX_LENGTH) {
          throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
        }
        debug("SemVer", version3, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version3.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version3}`);
        }
        this.raw = version3;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.major < other.major) {
          return -1;
        }
        if (this.major > other.major) {
          return 1;
        }
        if (this.minor < other.minor) {
          return -1;
        }
        if (this.minor > other.minor) {
          return 1;
        }
        if (this.patch < other.patch) {
          return -1;
        }
        if (this.patch > other.patch) {
          return 1;
        }
        return 0;
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i2 = 0;
        do {
          const a = this.prerelease[i2];
          const b = other.prerelease[i2];
          debug("prerelease compare", i2, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i2);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i2 = 0;
        do {
          const a = this.build[i2];
          const b = other.build[i2];
          debug("build compare", i2, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i2);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        if (release.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match || match[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [
                base
              ];
            } else {
              let i2 = this.prerelease.length;
              while (--i2 >= 0) {
                if (typeof this.prerelease[i2] === "number") {
                  this.prerelease[i2]++;
                  i2 = -2;
                }
              }
              if (i2 === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [
                identifier,
                base
              ];
              if (identifierBase === false) {
                prerelease = [
                  identifier
                ];
              }
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module.exports = SemVer;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/parse.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var parse5 = /* @__PURE__ */ __name((version3, options, throwErrors = false) => {
      if (version3 instanceof SemVer) {
        return version3;
      }
      try {
        return new SemVer(version3, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    }, "parse");
    module.exports = parse5;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/valid.js"(exports, module) {
    "use strict";
    var parse5 = require_parse();
    var valid = /* @__PURE__ */ __name((version3, options) => {
      const v = parse5(version3, options);
      return v ? v.version : null;
    }, "valid");
    module.exports = valid;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/clean.js"(exports, module) {
    "use strict";
    var parse5 = require_parse();
    var clean = /* @__PURE__ */ __name((version3, options) => {
      const s = parse5(version3.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    }, "clean");
    module.exports = clean;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/inc.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var inc = /* @__PURE__ */ __name((version3, release, options, identifier, identifierBase) => {
      if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(version3 instanceof SemVer ? version3.version : version3, options).inc(release, identifier, identifierBase).version;
      } catch (er) {
        return null;
      }
    }, "inc");
    module.exports = inc;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/diff.js"(exports, module) {
    "use strict";
    var parse5 = require_parse();
    var diff = /* @__PURE__ */ __name((version1, version22) => {
      const v1 = parse5(version1, null, true);
      const v2 = parse5(version22, null, true);
      const comparison = v1.compare(v2);
      if (comparison === 0) {
        return null;
      }
      const v1Higher = comparison > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return "major";
        }
        if (lowVersion.compareMain(highVersion) === 0) {
          if (lowVersion.minor && !lowVersion.patch) {
            return "minor";
          }
          return "patch";
        }
      }
      const prefix = highHasPre ? "pre" : "";
      if (v1.major !== v2.major) {
        return prefix + "major";
      }
      if (v1.minor !== v2.minor) {
        return prefix + "minor";
      }
      if (v1.patch !== v2.patch) {
        return prefix + "patch";
      }
      return "prerelease";
    }, "diff");
    module.exports = diff;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/major.js
var require_major = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/major.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var major = /* @__PURE__ */ __name((a, loose) => new SemVer(a, loose).major, "major");
    module.exports = major;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/minor.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var minor = /* @__PURE__ */ __name((a, loose) => new SemVer(a, loose).minor, "minor");
    module.exports = minor;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/patch.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var patch = /* @__PURE__ */ __name((a, loose) => new SemVer(a, loose).patch, "patch");
    module.exports = patch;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/prerelease.js"(exports, module) {
    "use strict";
    var parse5 = require_parse();
    var prerelease = /* @__PURE__ */ __name((version3, options) => {
      const parsed = parse5(version3, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    }, "prerelease");
    module.exports = prerelease;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var compare = /* @__PURE__ */ __name((a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose)), "compare");
    module.exports = compare;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/rcompare.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var rcompare = /* @__PURE__ */ __name((a, b, loose) => compare(b, a, loose), "rcompare");
    module.exports = rcompare;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare-loose.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var compareLoose = /* @__PURE__ */ __name((a, b) => compare(a, b, true), "compareLoose");
    module.exports = compareLoose;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare-build.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var compareBuild = /* @__PURE__ */ __name((a, b, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    }, "compareBuild");
    module.exports = compareBuild;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/sort.js"(exports, module) {
    "use strict";
    var compareBuild = require_compare_build();
    var sort = /* @__PURE__ */ __name((list2, loose) => list2.sort((a, b) => compareBuild(a, b, loose)), "sort");
    module.exports = sort;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/rsort.js"(exports, module) {
    "use strict";
    var compareBuild = require_compare_build();
    var rsort = /* @__PURE__ */ __name((list2, loose) => list2.sort((a, b) => compareBuild(b, a, loose)), "rsort");
    module.exports = rsort;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gt.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var gt = /* @__PURE__ */ __name((a, b, loose) => compare(a, b, loose) > 0, "gt");
    module.exports = gt;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lt.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var lt = /* @__PURE__ */ __name((a, b, loose) => compare(a, b, loose) < 0, "lt");
    module.exports = lt;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/eq.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var eq = /* @__PURE__ */ __name((a, b, loose) => compare(a, b, loose) === 0, "eq");
    module.exports = eq;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/neq.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var neq = /* @__PURE__ */ __name((a, b, loose) => compare(a, b, loose) !== 0, "neq");
    module.exports = neq;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gte.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var gte = /* @__PURE__ */ __name((a, b, loose) => compare(a, b, loose) >= 0, "gte");
    module.exports = gte;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lte.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var lte = /* @__PURE__ */ __name((a, b, loose) => compare(a, b, loose) <= 0, "lte");
    module.exports = lte;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/cmp.js"(exports, module) {
    "use strict";
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = /* @__PURE__ */ __name((a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    }, "cmp");
    module.exports = cmp;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/coerce.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var parse5 = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = /* @__PURE__ */ __name((version3, options) => {
      if (version3 instanceof SemVer) {
        return version3;
      }
      if (typeof version3 === "number") {
        version3 = String(version3);
      }
      if (typeof version3 !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version3.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next2;
        while ((next2 = coerceRtlRegex.exec(version3)) && (!match || match.index + match[0].length !== version3.length)) {
          if (!match || next2.index + next2[0].length !== match.index + match[0].length) {
            match = next2;
          }
          coerceRtlRegex.lastIndex = next2.index + next2[1].length + next2[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse5(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    }, "coerce");
    module.exports = coerce;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/lrucache.js"(exports, module) {
    "use strict";
    var LRUCache = class {
      static {
        __name(this, "LRUCache");
      }
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    module.exports = LRUCache;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/range.js
var require_range = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/range.js"(exports, module) {
    "use strict";
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      static {
        __name(this, "Range");
      }
      constructor(range, options) {
        options = parseOptions2(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [
            [
              range
            ]
          ];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [
              first
            ];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [
                  c
                ];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i2 = 0; i2 < this.set.length; i2++) {
            if (i2 > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i2];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [
              comp
            ];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [
          ...rangeMap.values()
        ];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version3) {
        if (!version3) {
          return false;
        }
        if (typeof version3 === "string") {
          try {
            version3 = new SemVer(version3, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i2 = 0; i2 < this.set.length; i2++) {
          if (testSet(this.set[i2], version3, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions2 = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var { safeRe: re, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var isNullSet = /* @__PURE__ */ __name((c) => c.value === "<0.0.0-0", "isNullSet");
    var isAny = /* @__PURE__ */ __name((c) => c.value === "", "isAny");
    var isSatisfiable = /* @__PURE__ */ __name((comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    }, "isSatisfiable");
    var parseComparator = /* @__PURE__ */ __name((comp, options) => {
      comp = comp.replace(re[t.BUILD], "");
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    }, "parseComparator");
    var isX = /* @__PURE__ */ __name((id) => !id || id.toLowerCase() === "x" || id === "*", "isX");
    var replaceTildes = /* @__PURE__ */ __name((comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    }, "replaceTildes");
    var replaceTilde = /* @__PURE__ */ __name((comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    }, "replaceTilde");
    var replaceCarets = /* @__PURE__ */ __name((comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    }, "replaceCarets");
    var replaceCaret = /* @__PURE__ */ __name((comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z14 = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z14} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z14} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z14} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}${z14} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}${z14} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    }, "replaceCaret");
    var replaceXRanges = /* @__PURE__ */ __name((comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    }, "replaceXRanges");
    var replaceXRange = /* @__PURE__ */ __name((comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    }, "replaceXRange");
    var replaceStars = /* @__PURE__ */ __name((comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    }, "replaceStars");
    var replaceGTE0 = /* @__PURE__ */ __name((comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    }, "replaceGTE0");
    var hyphenReplace = /* @__PURE__ */ __name((incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    }, "hyphenReplace");
    var testSet = /* @__PURE__ */ __name((set, version3, options) => {
      for (let i2 = 0; i2 < set.length; i2++) {
        if (!set[i2].test(version3)) {
          return false;
        }
      }
      if (version3.prerelease.length && !options.includePrerelease) {
        for (let i2 = 0; i2 < set.length; i2++) {
          debug(set[i2].semver);
          if (set[i2].semver === Comparator.ANY) {
            continue;
          }
          if (set[i2].semver.prerelease.length > 0) {
            const allowed = set[i2].semver;
            if (allowed.major === version3.major && allowed.minor === version3.minor && allowed.patch === version3.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    }, "testSet");
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/comparator.js"(exports, module) {
    "use strict";
    var ANY = /* @__PURE__ */ Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static {
        __name(this, "Comparator");
      }
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions2(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version3) {
        debug("Comparator.test", version3, this.options.loose);
        if (this.semver === ANY || version3 === ANY) {
          return true;
        }
        if (typeof version3 === "string") {
          try {
            version3 = new SemVer(version3, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version3, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions2(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module.exports = Comparator;
    var parseOptions2 = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/satisfies.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var satisfies = /* @__PURE__ */ __name((version3, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version3);
    }, "satisfies");
    module.exports = satisfies;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/to-comparators.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var toComparators = /* @__PURE__ */ __name((range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" ")), "toComparators");
    module.exports = toComparators;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/max-satisfying.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = /* @__PURE__ */ __name((versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    }, "maxSatisfying");
    module.exports = maxSatisfying;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/min-satisfying.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = /* @__PURE__ */ __name((versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    }, "minSatisfying");
    module.exports = minSatisfying;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/min-version.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = /* @__PURE__ */ __name((range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i2 = 0; i2 < range.set.length; ++i2) {
        const comparators = range.set[i2];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            /* fallthrough */
            case "":
            case ">=":
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            /* istanbul ignore next */
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    }, "minVersion");
    module.exports = minVersion;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/valid.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var validRange = /* @__PURE__ */ __name((range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    }, "validRange");
    module.exports = validRange;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/outside.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = /* @__PURE__ */ __name((version3, range, hilo, options) => {
      version3 = new SemVer(version3, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version3, range, options)) {
        return false;
      }
      for (let i2 = 0; i2 < range.set.length; ++i2) {
        const comparators = range.set[i2];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version3, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version3, low.semver)) {
          return false;
        }
      }
      return true;
    }, "outside");
    module.exports = outside;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/gtr.js"(exports, module) {
    "use strict";
    var outside = require_outside();
    var gtr = /* @__PURE__ */ __name((version3, range, options) => outside(version3, range, ">", options), "gtr");
    module.exports = gtr;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/ltr.js"(exports, module) {
    "use strict";
    var outside = require_outside();
    var ltr = /* @__PURE__ */ __name((version3, range, options) => outside(version3, range, "<", options), "ltr");
    module.exports = ltr;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/intersects.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var intersects = /* @__PURE__ */ __name((r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    }, "intersects");
    module.exports = intersects;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/simplify.js"(exports, module) {
    "use strict";
    var satisfies = require_satisfies();
    var compare = require_compare();
    module.exports = (versions, range, options) => {
      const set = [];
      let first = null;
      let prev = null;
      const v = versions.sort((a, b) => compare(a, b, options));
      for (const version3 of v) {
        const included = satisfies(version3, range, options);
        if (included) {
          prev = version3;
          if (!first) {
            first = version3;
          }
        } else {
          if (prev) {
            set.push([
              first,
              prev
            ]);
          }
          prev = null;
          first = null;
        }
      }
      if (first) {
        set.push([
          first,
          null
        ]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v[0]) {
          ranges.push("*");
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(" || ");
      const original = typeof range.raw === "string" ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/subset.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare = require_compare();
    var subset = /* @__PURE__ */ __name((sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER: for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) {
            continue OUTER;
          }
        }
        if (sawNonNull) {
          return false;
        }
      }
      return true;
    }, "subset");
    var minimumVersionWithPreRelease = [
      new Comparator(">=0.0.0-0")
    ];
    var minimumVersion = [
      new Comparator(">=0.0.0")
    ];
    var simpleSubset = /* @__PURE__ */ __name((sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === ">" || c.operator === ">=") {
          gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
          lt = lowerLT(lt, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
          return null;
        }
      }
      for (const eq of eqSet) {
        if (gt && !satisfies(eq, String(gt), options)) {
          return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies(eq, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
          if (needDomGTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
              needDomGTPre = false;
            }
          }
          if (c.operator === ">" || c.operator === ">=") {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) {
              return false;
            }
          } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) {
            return false;
          }
        }
        if (lt) {
          if (needDomLTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
              needDomLTPre = false;
            }
          }
          if (c.operator === "<" || c.operator === "<=") {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) {
              return false;
            }
          } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) {
            return false;
          }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
      }
      if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    }, "simpleSubset");
    var higherGT = /* @__PURE__ */ __name((a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
    }, "higherGT");
    var lowerLT = /* @__PURE__ */ __name((a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
    }, "lowerLT");
    module.exports = subset;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/index.js
var require_semver2 = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/index.js"(exports, module) {
    "use strict";
    var internalRe = require_re();
    var constants = require_constants();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse5 = require_parse();
    var valid = require_valid();
    var clean = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt = require_gt();
    var lt = require_lt();
    var eq = require_eq();
    var neq = require_neq();
    var gte = require_gte();
    var lte = require_lte();
    var cmp = require_cmp();
    var coerce = require_coerce();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module.exports = {
      parse: parse5,
      valid,
      clean,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt,
      lt,
      eq,
      neq,
      gte,
      lte,
      cmp,
      coerce,
      Comparator,
      Range,
      satisfies,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange,
      outside,
      gtr,
      ltr,
      intersects,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers
    };
  }
});

// ../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/constants.js
var UNDEFINED, HOLE, NAN, POSITIVE_INFINITY, NEGATIVE_INFINITY, NEGATIVE_ZERO, SPARSE, MAX_ARRAY_LEN, MAX_ARRAY_INDEX;
var init_constants = __esm({
  "../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/constants.js"() {
    UNDEFINED = -1;
    HOLE = -2;
    NAN = -3;
    POSITIVE_INFINITY = -4;
    NEGATIVE_INFINITY = -5;
    NEGATIVE_ZERO = -6;
    SPARSE = -7;
    MAX_ARRAY_LEN = 2 ** 32 - 1;
    MAX_ARRAY_INDEX = MAX_ARRAY_LEN - 1;
  }
});

// ../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/utils.js
function format_path(keys, format_map_key) {
  const path = [];
  for (let i2 = 0; i2 < keys.length; i2 += 1) {
    const segment = keys[i2];
    if (segment === MAP_KEY) {
      path.push(`.get(${format_map_key(keys[++i2])})`);
    } else if (typeof segment === "number") {
      path.push(`[${segment}]`);
    } else {
      path.push(stringify_key(segment));
    }
  }
  return path;
}
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function is_buffer(thing) {
  return typeof Buffer !== "undefined" && Buffer.isBuffer(thing);
}
function escape_raw(char) {
  return raw_escapes[char];
}
function stringify_string(str) {
  if (!needs_escape.test(str) && str.isWellFormed()) return `"${str}"`;
  return JSON.stringify(str).replace(json_leaves_raw, escape_raw);
}
function quote_key(key) {
  if (key.length > MAX_CACHED_KEY_LENGTH) return stringify_string(key);
  let quoted = quoted_keys.get(key);
  if (quoted === void 0) {
    if (quoted_keys.size >= 1024) quoted_keys.clear();
    quoted = stringify_string(key);
    quoted_keys.set(key, quoted);
  }
  return quoted;
}
function enumerable_symbols(object2) {
  const symbols = Object.getOwnPropertySymbols(object2);
  return symbols.length === 0 ? symbols : symbols.filter((symbol) => Object.getOwnPropertyDescriptor(object2, symbol)?.enumerable);
}
function stringify_key(key) {
  return is_identifier.test(key) ? "." + key : "[" + JSON.stringify(key) + "]";
}
function is_valid_array_index(n) {
  if (!Number.isInteger(n)) return false;
  if (n < 0) return false;
  if (n > MAX_ARRAY_INDEX) return false;
  return true;
}
function is_valid_array_len(n) {
  if (!Number.isInteger(n)) return false;
  if (n < 0) return false;
  if (n > MAX_ARRAY_LEN) return false;
  return true;
}
function is_valid_array_index_string(s) {
  if (s.length === 0) return false;
  if (s.length > 1 && s.charCodeAt(0) === 48) return false;
  for (let i2 = 0; i2 < s.length; i2++) {
    const c = s.charCodeAt(i2);
    if (c < 48 || c > 57) return false;
  }
  return is_valid_array_index(+s);
}
function array_index_cut(keys) {
  for (var i2 = keys.length - 1; i2 >= 0; i2--) {
    if (is_valid_array_index_string(keys[i2])) {
      break;
    }
  }
  return i2 + 1;
}
function valid_array_indices(array2) {
  const keys = Object.keys(array2);
  keys.length = array_index_cut(keys);
  return keys;
}
var DevalueError, MAP_KEY, object_proto_names, needs_escape, json_leaves_raw, raw_escapes, MAX_CACHED_KEY_LENGTH, quoted_keys, is_identifier;
var init_utils = __esm({
  "../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/utils.js"() {
    init_constants();
    DevalueError = class extends Error {
      static {
        __name(this, "DevalueError");
      }
      /**
      * @param {string} message
      * @param {string[]} keys
      * @param {any} [value] - The value that failed to be serialized
      * @param {any} [root] - The root value being serialized
      */
      constructor(message, keys, value, root) {
        super(message);
        this.name = "DevalueError";
        this.path = keys.join("");
        this.value = value;
        this.root = root;
      }
    };
    MAP_KEY = /* @__PURE__ */ Symbol();
    __name(format_path, "format_path");
    object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
    __name(is_plain_object, "is_plain_object");
    __name(get_type, "get_type");
    __name(is_buffer, "is_buffer");
    needs_escape = /["<\\\u0000-\u001f\u2028\u2029]/;
    json_leaves_raw = /[<\u2028\u2029]/g;
    raw_escapes = {
      "<": "\\u003C",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    __name(escape_raw, "escape_raw");
    __name(stringify_string, "stringify_string");
    MAX_CACHED_KEY_LENGTH = 64;
    quoted_keys = /* @__PURE__ */ new Map();
    __name(quote_key, "quote_key");
    __name(enumerable_symbols, "enumerable_symbols");
    is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
    __name(stringify_key, "stringify_key");
    __name(is_valid_array_index, "is_valid_array_index");
    __name(is_valid_array_len, "is_valid_array_len");
    __name(is_valid_array_index_string, "is_valid_array_index_string");
    __name(array_index_cut, "array_index_cut");
    __name(valid_array_indices, "valid_array_indices");
  }
});

// ../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/base64.js
function encode_native(array_buffer) {
  return new Uint8Array(array_buffer).toBase64();
}
function decode_native(base64) {
  return Uint8Array.fromBase64(base64).buffer;
}
function encode_buffer(array_buffer) {
  return Buffer.from(array_buffer).toString("base64");
}
function decode_buffer(base64) {
  return Uint8Array.from(Buffer.from(base64, "base64")).buffer;
}
function encode_legacy(array_buffer) {
  const array2 = new Uint8Array(array_buffer);
  let binary = "";
  const chunk_size = 32768;
  for (let i2 = 0; i2 < array2.length; i2 += chunk_size) {
    const chunk = array2.subarray(i2, i2 + chunk_size);
    binary += String.fromCharCode.apply(
      null,
      /** @type {unknown} */
      chunk
    );
  }
  return btoa(binary);
}
function decode_legacy(base64) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const array2 = new Uint8Array(len);
  for (let i2 = 0; i2 < len; i2++) {
    array2[i2] = binary_string.charCodeAt(i2);
  }
  return array2.buffer;
}
var native, buffer, encode64, decode64;
var init_base64 = __esm({
  "../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/base64.js"() {
    __name(encode_native, "encode_native");
    __name(decode_native, "decode_native");
    __name(encode_buffer, "encode_buffer");
    __name(decode_buffer, "decode_buffer");
    __name(encode_legacy, "encode_legacy");
    __name(decode_legacy, "decode_legacy");
    native = typeof Uint8Array.fromBase64 === "function";
    buffer = typeof process === "object" && process.versions?.node !== void 0;
    encode64 = native ? encode_native : buffer ? encode_buffer : encode_legacy;
    decode64 = native ? decode_native : buffer ? decode_buffer : decode_legacy;
  }
});

// ../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/operations.js
function merge_operations(defaults, overrides) {
  if (!overrides) return defaults;
  const merged = (
    /** @type {T} */
    {}
  );
  for (const key of Object.keys(defaults)) {
    merged[key] = overrides[key] ?? defaults[key];
  }
  return merged;
}
var NOT_PLAIN, SYMBOL_KEYS, stringify_operations, default_stringify_operations, array_buffer_byte_length, shared_array_buffer_byte_length, parse_operations, default_parse_operations;
var init_operations = __esm({
  "../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/operations.js"() {
    init_constants();
    init_utils();
    __name(merge_operations, "merge_operations");
    NOT_PLAIN = /* @__PURE__ */ Object.freeze({
      kind: "not-plain"
    });
    SYMBOL_KEYS = /* @__PURE__ */ Object.freeze({
      kind: "symbol-keys"
    });
    stringify_operations = {
      identify: /* @__PURE__ */ __name((value) => value, "identify"),
      typeOf: /* @__PURE__ */ __name((value) => value === null ? "null" : typeof value, "typeOf"),
      toPrimitive: /* @__PURE__ */ __name((value) => value, "toPrimitive"),
      tagOf: /* @__PURE__ */ __name((value) => get_type(value), "tagOf"),
      isThenable: /* @__PURE__ */ __name((value) => typeof value.then === "function", "isThenable"),
      toPromise: /* @__PURE__ */ __name((thenable) => Promise.resolve(thenable), "toPromise"),
      unbox: /* @__PURE__ */ __name((boxed) => boxed.valueOf(), "unbox"),
      toISOString: /* @__PURE__ */ __name((date) => isNaN(date.getDate()) ? "" : date.toISOString(), "toISOString"),
      toStringValue: /* @__PURE__ */ __name((value) => value.toString(), "toStringValue"),
      regExpInfo: /* @__PURE__ */ __name((regexp) => ({
        source: regexp.source,
        flags: regexp.flags
      }), "regExpInfo"),
      valuesOf: /* @__PURE__ */ __name((set) => set, "valuesOf"),
      entriesOf: /* @__PURE__ */ __name((map) => map, "entriesOf"),
      viewInfo: /* @__PURE__ */ __name((view) => {
        if (is_buffer(view)) view = new Uint8Array(view);
        return {
          buffer: view.buffer,
          byteOffset: view.byteOffset,
          byteLength: view.byteLength,
          length: view.length,
          bufferByteLength: view.buffer.byteLength
        };
      }, "viewInfo"),
      toArrayBuffer: /* @__PURE__ */ __name((buffer2) => buffer2, "toArrayBuffer"),
      lengthOf: /* @__PURE__ */ __name((array2) => array2.length, "lengthOf"),
      hasOwn: /* @__PURE__ */ __name((value, key) => Object.hasOwn(value, key), "hasOwn"),
      indicesOf: /* @__PURE__ */ __name((array2) => valid_array_indices(array2), "indicesOf"),
      shapeOf: /* @__PURE__ */ __name((value) => {
        if (!is_plain_object(value)) return NOT_PLAIN;
        if (enumerable_symbols(value).length > 0) return SYMBOL_KEYS;
        return {
          kind: Object.getPrototypeOf(value) === null ? "null-proto" : "plain",
          keys: Object.keys(value)
        };
      }, "shapeOf"),
      get: /* @__PURE__ */ __name((value, key) => value[key], "get")
    };
    default_stringify_operations = /* @__PURE__ */ Object.freeze(stringify_operations);
    array_buffer_byte_length = /** @type {() => number} */
    Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength")?.get;
    shared_array_buffer_byte_length = typeof SharedArrayBuffer === "undefined" ? void 0 : Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength")?.get;
    parse_operations = {
      fromPrimitive: /* @__PURE__ */ __name((primitive) => primitive, "fromPrimitive"),
      fromISOString: /* @__PURE__ */ __name((iso) => new Date(iso), "fromISOString"),
      fromStringValue: /* @__PURE__ */ __name((tag, text) => {
        if (tag === "URL") return new URL(text);
        if (tag === "URLSearchParams") return new URLSearchParams(text);
        return Temporal[tag.slice(9)].from(text);
      }, "fromStringValue"),
      fromArrayBuffer: /* @__PURE__ */ __name((buffer2) => buffer2, "fromArrayBuffer"),
      fromRegExpInfo: /* @__PURE__ */ __name((source, flags) => new RegExp(source, flags), "fromRegExpInfo"),
      fromViewInfo: /* @__PURE__ */ __name((tag, buffer2, byteOffset, length) => {
        try {
          array_buffer_byte_length.call(buffer2);
        } catch (error) {
          if (!shared_array_buffer_byte_length) throw error;
          shared_array_buffer_byte_length.call(buffer2);
        }
        const Constructor = (
          /** @type {any} */
          globalThis[tag]
        );
        return byteOffset !== void 0 ? new Constructor(buffer2, byteOffset, length) : new Constructor(buffer2);
      }, "fromViewInfo"),
      box: /* @__PURE__ */ __name((value) => Object(value), "box"),
      createArray: /* @__PURE__ */ __name((length) => new Array(length), "createArray"),
      createSparseArray: /* @__PURE__ */ __name((length) => {
        const array2 = [];
        array2[MAX_ARRAY_INDEX] = void 0;
        delete array2[MAX_ARRAY_INDEX];
        array2.length = length;
        return array2;
      }, "createSparseArray"),
      createObject: /* @__PURE__ */ __name(() => ({}), "createObject"),
      createNullPrototypeObject: /* @__PURE__ */ __name(() => /* @__PURE__ */ Object.create(null), "createNullPrototypeObject"),
      createSet: /* @__PURE__ */ __name(() => /* @__PURE__ */ new Set(), "createSet"),
      createMap: /* @__PURE__ */ __name(() => /* @__PURE__ */ new Map(), "createMap"),
      set: /* @__PURE__ */ __name((target, key, value) => {
        target[key] = value;
      }, "set"),
      addValue: /* @__PURE__ */ __name((set, value) => {
        set.add(value);
      }, "addValue"),
      addEntry: /* @__PURE__ */ __name((map, key, value) => {
        map.set(key, value);
      }, "addEntry")
    };
    default_parse_operations = /* @__PURE__ */ Object.freeze(parse_operations);
  }
});

// ../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/parse.js
function invalid() {
  throw new Error("Invalid input");
}
function parse(serialized, revivers, options) {
  return unflatten(JSON.parse(serialized), revivers, options);
}
function unflatten(parsed, revivers, options) {
  const ops = merge_operations(default_parse_operations, options?.operations);
  if (typeof parsed === "number") return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    invalid();
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  let hydrating = null;
  function get_raw(index) {
    if (!is_valid_array_index(index) || index >= values.length) {
      invalid();
    }
    return values[index];
  }
  __name(get_raw, "get_raw");
  function hydrate(index, standalone = false) {
    if (index === UNDEFINED) return ops.fromPrimitive(void 0);
    if (index === NAN) return ops.fromPrimitive(NaN);
    if (index === POSITIVE_INFINITY) return ops.fromPrimitive(Infinity);
    if (index === NEGATIVE_INFINITY) return ops.fromPrimitive(-Infinity);
    if (index === NEGATIVE_ZERO) return ops.fromPrimitive(-0);
    if (standalone || typeof index !== "number") {
      invalid();
    }
    if (index in hydrated) return hydrated[index];
    if (index >= values.length) {
      invalid();
    }
    const value = values[index];
    if (!value || typeof value !== "object") {
      hydrated[index] = ops.fromPrimitive(value);
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers && Object.hasOwn(revivers, type) ? revivers[type] : void 0;
        if (reviver) {
          let i2 = value[1];
          if (typeof i2 !== "number") {
            i2 = values.push(value[1]) - 1;
          }
          if (Object.hasOwn(hydrated, i2)) {
            return hydrated[index] = reviver(hydrated[i2]);
          }
          hydrating ??= /* @__PURE__ */ new Set();
          if (hydrating.has(i2)) {
            throw new Error("Invalid circular reference");
          }
          hydrating.add(i2);
          hydrated[index] = reviver(hydrate(i2));
          hydrating.delete(i2);
          return hydrated[index];
        }
        switch (type) {
          case "Date":
            hydrated[index] = ops.fromISOString(value[1]);
            break;
          case "Set":
            const set = ops.createSet();
            hydrated[index] = set;
            for (let i2 = 1; i2 < value.length; i2 += 1) {
              ops.addValue(set, hydrate(value[i2]));
            }
            break;
          case "Map":
            const map = ops.createMap();
            hydrated[index] = map;
            for (let i2 = 1; i2 < value.length; i2 += 2) {
              ops.addEntry(map, hydrate(value[i2]), hydrate(value[i2 + 1]));
            }
            break;
          case "RegExp":
            hydrated[index] = ops.fromRegExpInfo(value[1], value[2]);
            break;
          case "Object": {
            const wrapped_index = value[1];
            const is_boxable_sentinel = wrapped_index === NAN || wrapped_index === POSITIVE_INFINITY || wrapped_index === NEGATIVE_INFINITY || wrapped_index === NEGATIVE_ZERO;
            if (!is_boxable_sentinel) {
              const wrapped = get_raw(wrapped_index);
              const is_bigint = Array.isArray(wrapped) && wrapped[0] === "BigInt";
              if ((wrapped === void 0 || typeof wrapped === "object") && !is_bigint) {
                invalid();
              }
            }
            hydrated[index] = ops.box(hydrate(wrapped_index));
            break;
          }
          case "BigInt":
            hydrated[index] = ops.fromPrimitive(BigInt(value[1]));
            break;
          case "null":
            const obj = ops.createNullPrototypeObject();
            hydrated[index] = obj;
            for (let i2 = 1; i2 < value.length; i2 += 2) {
              const key = value[i2];
              if (typeof key !== "string") {
                throw new Error("Cannot parse an object with a non-string key");
              }
              if (key === "__proto__") {
                throw new Error("Cannot parse an object with a `__proto__` property");
              }
              ops.set(obj, key, hydrate(value[i2 + 1]));
            }
            break;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Float16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array":
          case "DataView": {
            const buffer_index = value[1];
            const raw = get_raw(buffer_index);
            if (!Array.isArray(raw) || raw[0] !== "ArrayBuffer") {
              invalid();
            }
            const buffer2 = hydrate(buffer_index);
            hydrated[index] = ops.fromViewInfo(type, buffer2, value[2], value[3]);
            break;
          }
          case "ArrayBuffer": {
            const base64 = value[1];
            if (typeof base64 !== "string") {
              throw new Error("Invalid ArrayBuffer encoding");
            }
            hydrated[index] = ops.fromArrayBuffer(decode64(base64));
            break;
          }
          case "URL":
          case "URLSearchParams":
          case "Temporal.Duration":
          case "Temporal.Instant":
          case "Temporal.PlainDate":
          case "Temporal.PlainTime":
          case "Temporal.PlainDateTime":
          case "Temporal.PlainMonthDay":
          case "Temporal.PlainYearMonth":
          case "Temporal.ZonedDateTime": {
            hydrated[index] = ops.fromStringValue(type, value[1]);
            break;
          }
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else if (value[0] === SPARSE) {
        const len = value[1];
        if (!is_valid_array_len(len)) {
          invalid();
        }
        const array2 = ops.createSparseArray(len);
        hydrated[index] = array2;
        for (let i2 = 2; i2 < value.length; i2 += 2) {
          const idx = value[i2];
          if (!is_valid_array_index(idx) || idx >= len) {
            invalid();
          }
          ops.set(array2, idx, hydrate(value[i2 + 1]));
        }
      } else {
        const array2 = ops.createArray(value.length);
        hydrated[index] = array2;
        for (let i2 = 0; i2 < value.length; i2 += 1) {
          const n = value[i2];
          if (n === HOLE) continue;
          ops.set(array2, i2, hydrate(n));
        }
      }
    } else {
      const object2 = ops.createObject();
      hydrated[index] = object2;
      for (const key of Object.keys(value)) {
        if (key === "__proto__") {
          throw new Error("Cannot parse an object with a `__proto__` property");
        }
        ops.set(object2, key, hydrate(value[key]));
      }
    }
    return hydrated[index];
  }
  __name(hydrate, "hydrate");
  return hydrate(0);
}
var init_parse = __esm({
  "../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/parse.js"() {
    init_base64();
    init_constants();
    init_operations();
    init_utils();
    __name(invalid, "invalid");
    __name(parse, "parse");
    __name(unflatten, "unflatten");
  }
});

// ../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/stringify.js
function stringify(value, reducers, options) {
  const stringified = run(false, value, reducers, options);
  return typeof stringified === "string" ? stringified : `[${stringified.join(",")}]`;
}
function run(async, value, reducers, options) {
  const ops = merge_operations(default_stringify_operations, options?.operations);
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom = [];
  if (reducers) {
    for (const key of Object.getOwnPropertyNames(reducers)) {
      custom.push({
        key,
        fn: reducers[key]
      });
    }
  }
  let keys = [];
  let p = 0;
  function error(message, thing) {
    const path = format_path(keys, (key) => {
      const key_type = ops.typeOf(key);
      const key_is_primitive = key_type !== "object" && key_type !== "function" && key_type !== "symbol";
      return key_is_primitive ? stringify_primitive(ops.toPrimitive(key)) : "...";
    });
    throw new DevalueError(message, path, thing, value);
  }
  __name(error, "error");
  function flatten(thing, index2) {
    const type = ops.typeOf(thing);
    if (type === "undefined") return UNDEFINED;
    let number;
    if (type === "number") {
      number = /** @type {number} */
      ops.toPrimitive(thing);
      if (Number.isNaN(number)) return NAN;
      if (number === Infinity) return POSITIVE_INFINITY;
      if (number === -Infinity) return NEGATIVE_INFINITY;
      if (number === 0 && 1 / number < 0) return NEGATIVE_ZERO;
    }
    const id = ops.identify(thing);
    if (indexes.has(id)) return (
      /** @type {number} */
      indexes.get(id)
    );
    index2 ??= p++;
    indexes.set(id, index2);
    for (const { key, fn } of custom) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index2] = `["${key}",${flatten(value2)}]`;
        return index2;
      }
    }
    if (type === "function") {
      error(`Cannot stringify a function`, thing);
    } else if (type === "symbol") {
      error(`Cannot stringify a Symbol primitive`, thing);
    }
    let str = "";
    if (type !== "object") {
      str = stringify_primitive(type === "number" ? number : ops.toPrimitive(thing));
    } else if (ops.isThenable(thing)) {
      if (!async) {
        error(`Cannot stringify a Promise or thenable \u2014 use stringifyAsync instead`, thing);
      }
      const prev_keys = keys.slice();
      str = ops.toPromise(thing).then((value2) => {
        keys = prev_keys;
        const i2 = flatten(value2, index2);
        if (i2 < 0) stringified[index2] = i2;
      });
      str.catch(() => {
      });
    } else {
      const tag = ops.tagOf(thing);
      switch (tag) {
        case "Number":
        case "String":
        case "Boolean":
        case "BigInt":
          str = `["Object",${flatten(ops.unbox(thing))}]`;
          break;
        case "Date":
          str = `["Date","${ops.toISOString(thing)}"]`;
          break;
        case "URL":
          str = `["URL",${stringify_string(ops.toStringValue(thing))}]`;
          break;
        case "URLSearchParams":
          str = `["URLSearchParams",${stringify_string(ops.toStringValue(thing))}]`;
          break;
        case "RegExp":
          const { source, flags } = ops.regExpInfo(thing);
          str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array": {
          let mostly_dense = false;
          const length = ops.lengthOf(thing);
          str = "[";
          for (let i2 = 0; i2 < length; i2 += 1) {
            if (i2 > 0) str += ",";
            if (ops.hasOwn(thing, i2)) {
              keys.push(i2);
              str += flatten(ops.get(thing, i2));
              keys.pop();
            } else if (mostly_dense) {
              str += HOLE;
            } else {
              const populated_keys = ops.indicesOf(thing);
              const population = populated_keys.length;
              const d = String(length).length;
              const hole_cost = (length - population) * 3;
              const sparse_cost = 4 + d + population * (d + 1);
              if (hole_cost > sparse_cost) {
                str = "[" + SPARSE + "," + length;
                for (let j = 0; j < populated_keys.length; j++) {
                  const key = populated_keys[j];
                  keys.push(+key);
                  str += "," + key + "," + flatten(ops.get(thing, key));
                  keys.pop();
                }
                break;
              } else {
                mostly_dense = true;
                str += HOLE;
              }
            }
          }
          str += "]";
          break;
        }
        case "Set":
          str = '["Set"';
          for (const value2 of ops.valuesOf(thing)) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key, value2] of ops.entriesOf(thing)) {
            keys.push(MAP_KEY, key);
            str += `,${flatten(key)},${flatten(value2)}`;
            keys.pop();
            keys.pop();
          }
          str += "]";
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Float16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array": {
          const info = ops.viewInfo(thing);
          str = '["' + tag + '",' + flatten(info.buffer);
          if (info.byteLength !== info.bufferByteLength) {
            str += `,${info.byteOffset},${info.length}`;
          }
          str += "]";
          break;
        }
        case "DataView": {
          const info = ops.viewInfo(thing);
          str = '["' + tag + '",' + flatten(info.buffer);
          if (info.byteLength !== info.bufferByteLength) {
            str += `,${info.byteOffset},${info.byteLength}`;
          }
          str += "]";
          break;
        }
        case "ArrayBuffer": {
          const base64 = encode64(ops.toArrayBuffer(thing));
          str = `["ArrayBuffer","${base64}"]`;
          break;
        }
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          str = `["${tag}",${stringify_string(ops.toStringValue(thing))}]`;
          break;
        default: {
          const shape = ops.shapeOf(thing);
          if (shape.kind === "not-plain") {
            error(`Cannot stringify arbitrary non-POJOs`, thing);
          }
          if (shape.kind === "symbol-keys") {
            error(`Cannot stringify POJOs with symbolic keys`, thing);
          }
          if (shape.kind === "null-proto") {
            str = '["null"';
            for (const key of shape.keys) {
              if (key === "__proto__") {
                error(`Cannot stringify objects with __proto__ keys`, thing);
              }
              keys.push(key);
              str += `,${quote_key(key)},${flatten(ops.get(thing, key))}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key of shape.keys) {
              if (key === "__proto__") {
                error(`Cannot stringify objects with __proto__ keys`, thing);
              }
              if (started) str += ",";
              started = true;
              keys.push(key);
              str += `${quote_key(key)}:${flatten(ops.get(thing, key))}`;
              keys.pop();
            }
            str += "}";
          }
        }
      }
    }
    stringified[index2] = str;
    return index2;
  }
  __name(flatten, "flatten");
  const index = flatten(value);
  if (index < 0) return `${index}`;
  return stringified;
}
function stringify_primitive(thing) {
  const type = typeof thing;
  if (type === "string") return stringify_string(thing);
  if (thing === void 0) return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO.toString();
  if (type === "bigint") return `["BigInt","${thing}"]`;
  return String(thing);
}
var init_stringify = __esm({
  "../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/stringify.js"() {
    init_utils();
    init_constants();
    init_base64();
    init_operations();
    __name(stringify, "stringify");
    __name(run, "run");
    __name(stringify_primitive, "stringify_primitive");
  }
});

// ../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/index.js
var init_src = __esm({
  "../../node_modules/.pnpm/devalue@6.0.3/node_modules/devalue/src/index.js"() {
    init_parse();
    init_stringify();
    init_operations();
    init_utils();
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/encryption.js
async function importKey(raw, usages = [
  "encrypt",
  "decrypt"
]) {
  if (raw.byteLength !== KEY_LENGTH) {
    throw new WorkflowRuntimeError(`Encryption key must be exactly ${KEY_LENGTH} bytes, got ${raw.byteLength}`);
  }
  return globalThis.crypto.subtle.importKey(
    "raw",
    raw,
    "AES-GCM",
    false,
    // `KeyUsage` is a DOM-lib type that's not in scope under `es2022`.
    // The `ReadonlyArray<'encrypt' | 'decrypt'>` parameter type matches
    // a strict subset of `KeyUsage[]`, so this cast is sound.
    usages
  );
}
async function encrypt(key, data2, aad) {
  const nonce = globalThis.crypto.getRandomValues(new Uint8Array(NONCE_LENGTH));
  let ciphertext;
  try {
    ciphertext = await globalThis.crypto.subtle.encrypt({
      name: "AES-GCM",
      iv: nonce,
      tagLength: TAG_LENGTH,
      ...aad ? {
        additionalData: aad
      } : {}
    }, key, data2);
  } catch (cause) {
    throw new RuntimeDecryptionError(`AES-256-GCM encryption failed: ${cause instanceof Error ? cause.message : String(cause)}`, {
      cause,
      context: {
        operation: "encrypt",
        byteLength: data2.byteLength
      }
    });
  }
  const result = new Uint8Array(NONCE_LENGTH + ciphertext.byteLength);
  result.set(nonce, 0);
  result.set(new Uint8Array(ciphertext), NONCE_LENGTH);
  return result;
}
async function decrypt(key, data2, aad) {
  const minLength = NONCE_LENGTH + TAG_LENGTH / 8;
  if (data2.byteLength < minLength) {
    throw new RuntimeDecryptionError(`Encrypted data too short: expected at least ${minLength} bytes, got ${data2.byteLength}`, {
      context: {
        operation: "decrypt",
        byteLength: data2.byteLength
      }
    });
  }
  const nonce = data2.subarray(0, NONCE_LENGTH);
  const ciphertext = data2.subarray(NONCE_LENGTH);
  let plaintext;
  try {
    plaintext = await globalThis.crypto.subtle.decrypt({
      name: "AES-GCM",
      iv: nonce,
      tagLength: TAG_LENGTH,
      ...aad ? {
        additionalData: aad
      } : {}
    }, key, ciphertext);
  } catch (cause) {
    const causeMsg = cause instanceof Error ? cause.message : String(cause);
    throw new RuntimeDecryptionError(`AES-256-GCM decryption failed: ${causeMsg}`, {
      cause,
      context: {
        operation: "decrypt",
        byteLength: data2.byteLength
      }
    });
  }
  return new Uint8Array(plaintext);
}
var NONCE_LENGTH, TAG_LENGTH, TAG_BYTES, KEY_LENGTH;
var init_encryption = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/encryption.js"() {
    init_dist2();
    NONCE_LENGTH = 12;
    TAG_LENGTH = 128;
    TAG_BYTES = TAG_LENGTH / 8;
    KEY_LENGTH = 32;
    __name(importKey, "importKey");
    __name(encrypt, "encrypt");
    __name(decrypt, "decrypt");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/symbols.js
var STABLE_ULID, STREAM_NAME_SYMBOL, STREAM_TYPE_SYMBOL, STREAM_FRAMING_SYMBOL, STREAM_SERVER_RUN_ID_SYMBOL, STREAM_SERVER_DEPLOYMENT_ID_SYMBOL, STREAM_SERVER_PUBLIC_KEY_SYMBOL, STREAM_DRAIN_SYMBOL, STREAM_RELEASE_SYMBOL, BODY_INIT_SYMBOL, WEBHOOK_RESPONSE_WRITABLE, WORKFLOW_CLASS_REGISTRY, ABORT_STREAM_NAME, ABORT_HOOK_TOKEN, ABORT_LISTENER_ATTACHED, ABORT_READER_CANCEL;
var init_symbols = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/symbols.js"() {
    STABLE_ULID = /* @__PURE__ */ Symbol.for("WORKFLOW_STABLE_ULID");
    STREAM_NAME_SYMBOL = /* @__PURE__ */ Symbol.for("WORKFLOW_STREAM_NAME");
    STREAM_TYPE_SYMBOL = /* @__PURE__ */ Symbol.for("WORKFLOW_STREAM_TYPE");
    STREAM_FRAMING_SYMBOL = /* @__PURE__ */ Symbol.for("WORKFLOW_STREAM_FRAMING");
    STREAM_SERVER_RUN_ID_SYMBOL = /* @__PURE__ */ Symbol.for("WORKFLOW_STREAM_SERVER_RUN_ID");
    STREAM_SERVER_DEPLOYMENT_ID_SYMBOL = /* @__PURE__ */ Symbol.for("WORKFLOW_STREAM_SERVER_DEPLOYMENT_ID");
    STREAM_SERVER_PUBLIC_KEY_SYMBOL = /* @__PURE__ */ Symbol.for("WORKFLOW_STREAM_SERVER_PUBLIC_KEY");
    STREAM_DRAIN_SYMBOL = /* @__PURE__ */ Symbol.for("WORKFLOW_STREAM_DRAIN");
    STREAM_RELEASE_SYMBOL = /* @__PURE__ */ Symbol.for("WORKFLOW_STREAM_RELEASE");
    BODY_INIT_SYMBOL = /* @__PURE__ */ Symbol.for("BODY_INIT");
    WEBHOOK_RESPONSE_WRITABLE = /* @__PURE__ */ Symbol.for("WEBHOOK_RESPONSE_WRITABLE");
    WORKFLOW_CLASS_REGISTRY = /* @__PURE__ */ Symbol.for("workflow-class-registry");
    ABORT_STREAM_NAME = /* @__PURE__ */ Symbol.for("WORKFLOW_ABORT_STREAM_NAME");
    ABORT_HOOK_TOKEN = /* @__PURE__ */ Symbol.for("WORKFLOW_ABORT_HOOK_TOKEN");
    ABORT_LISTENER_ATTACHED = /* @__PURE__ */ Symbol.for("WORKFLOW_ABORT_LISTENER_ATTACHED");
    ABORT_READER_CANCEL = /* @__PURE__ */ Symbol.for("WORKFLOW_ABORT_READER_CANCEL");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/flushable-stream.js
function createFlushableState() {
  const state = {
    ...withResolvers(),
    pendingOps: 0,
    producedFrames: 0,
    acceptedFrames: 0,
    frameWaiters: [],
    doneResolved: false,
    streamEnded: false
  };
  state.promise.catch(() => {
  });
  return state;
}
function isWritableUnlockedNotClosed(writable) {
  if (writable.locked) return false;
  let writer;
  try {
    writer = writable.getWriter();
  } catch {
    return false;
  }
  try {
    writer.releaseLock();
  } catch {
    return false;
  }
  return true;
}
function isReadableUnlockedNotClosed(readable) {
  if (readable.locked) return false;
  let reader;
  try {
    reader = readable.getReader();
  } catch {
    return false;
  }
  try {
    reader.releaseLock();
  } catch {
    return false;
  }
  return true;
}
function resolveAfterDrain(state) {
  const release = /* @__PURE__ */ __name(async () => {
    await state.drainBarrier?.();
    await state.releaseTransport?.();
  }, "release");
  release().then(() => state.resolve(), (err) => state.reject(err));
}
function markFlushableFrameProduced(state) {
  state.producedFrames++;
}
async function drainFlushableSnapshot(state) {
  const drainBeforeThrow = /* @__PURE__ */ __name(async (error) => {
    await state.drainBarrier?.().catch(() => {
    });
    throw error;
  }, "drainBeforeThrow");
  const target = state.producedFrames;
  if (state.acceptedFrames < target) {
    if (state.pipeError !== void 0) {
      return drainBeforeThrow(state.pipeError);
    }
    try {
      await new Promise((resolve, reject) => {
        state.frameWaiters.push({
          target,
          resolve,
          reject
        });
      });
    } catch (error) {
      return drainBeforeThrow(error);
    }
  }
  if (state.pipeError !== void 0) {
    return drainBeforeThrow(state.pipeError);
  }
  await state.drainBarrier?.();
}
function trackFlushableWritable(writable, state, WritableStreamConstructor = WritableStream) {
  const targetWriter = writable.getWriter();
  const checkpoint = /* @__PURE__ */ Symbol("workflow-stream-release-checkpoint");
  let trackedController;
  const tracked = new WritableStreamConstructor({
    start(controller) {
      trackedController = controller;
    },
    async write(chunk) {
      if (chunk === checkpoint) return;
      markFlushableFrameProduced(state);
      await targetWriter.write(chunk);
    },
    async close() {
      state.userWritableClosing = true;
      try {
        await targetWriter.close();
      } finally {
        targetWriter.releaseLock();
      }
    },
    async abort(reason) {
      try {
        await targetWriter.abort(reason);
      } finally {
        targetWriter.releaseLock();
      }
    }
  });
  targetWriter.closed.catch((error) => {
    trackedController.error(error);
  });
  let settlement;
  state.settleReleasedWrites = () => {
    state.releaseSettlementArmed = true;
    if (settlement) return settlement;
    if (tracked.locked) return Promise.resolve(false);
    if (state.userWritableClosing) {
      settlement = state.promise.then(() => true);
      return settlement;
    }
    let checkpointWriter;
    try {
      checkpointWriter = tracked.getWriter();
    } catch {
      return Promise.resolve(false);
    }
    settlement = (async () => {
      try {
        try {
          await checkpointWriter.write(checkpoint);
        } catch (checkpointError) {
          try {
            await state.promise;
            return true;
          } catch (pipeError) {
            throw pipeError ?? checkpointError;
          }
        }
        await drainFlushableSnapshot(state);
        await state.releaseTransport?.();
        if (!state.doneResolved) {
          state.doneResolved = true;
          state.resolve();
        }
        return true;
      } catch (error) {
        if (!state.doneResolved) {
          state.doneResolved = true;
          state.reject(error);
        }
        throw error;
      } finally {
        checkpointWriter.releaseLock();
      }
    })();
    return settlement;
  };
  return tracked;
}
function pollWritableLock(writable, state) {
  if (state.writablePollingInterval !== void 0) {
    return;
  }
  const intervalId = setInterval(() => {
    if (state.doneResolved || state.streamEnded) {
      clearInterval(intervalId);
      state.writablePollingInterval = void 0;
      return;
    }
    if (state.settleReleasedWrites) {
      if ((!state.deferReleaseSettlement || state.releaseSettlementArmed) && !writable.locked) {
        clearInterval(intervalId);
        state.writablePollingInterval = void 0;
        void state.settleReleasedWrites().catch(() => {
        });
      }
      return;
    }
    if (isWritableUnlockedNotClosed(writable) && state.pendingOps === 0) {
      state.doneResolved = true;
      clearInterval(intervalId);
      state.writablePollingInterval = void 0;
      resolveAfterDrain(state);
    }
  }, getLockPollIntervalMs());
  state.writablePollingInterval = intervalId;
}
function pollReadableLock(readable, state) {
  if (state.readablePollingInterval !== void 0) {
    return;
  }
  const intervalId = setInterval(() => {
    if (state.doneResolved || state.streamEnded) {
      clearInterval(intervalId);
      state.readablePollingInterval = void 0;
      return;
    }
    if (isReadableUnlockedNotClosed(readable) && state.pendingOps === 0) {
      state.doneResolved = true;
      clearInterval(intervalId);
      state.readablePollingInterval = void 0;
      resolveAfterDrain(state);
    }
  }, getLockPollIntervalMs());
  state.readablePollingInterval = intervalId;
}
function flushablePipe(source, sink, state) {
  const drain = sink[STREAM_DRAIN_SYMBOL];
  if (typeof drain === "function") {
    state.drainBarrier = drain;
  }
  const release = sink[STREAM_RELEASE_SYMBOL];
  if (typeof release === "function") {
    state.releaseTransport = release;
  }
  return flushablePipePerChunk(source, sink, state);
}
async function flushablePipePerChunk(source, sink, state) {
  const reader = source.getReader();
  const writer = sink.getWriter();
  let cancelReason;
  try {
    while (true) {
      if (state.streamEnded) {
        return;
      }
      const readResult = await Promise.race([
        reader.read(),
        writer.closed.then(() => {
          throw new WorkflowRuntimeError("Writable stream closed prematurely");
        })
      ]);
      if (state.streamEnded) {
        return;
      }
      if (readResult.done) {
        state.streamEnded = true;
        await writer.close();
        if (!state.doneResolved) {
          state.doneResolved = true;
          state.resolve();
        }
        return;
      }
      state.pendingOps++;
      try {
        await writer.write(readResult.value);
        state.acceptedFrames++;
        const ready = state.frameWaiters.filter((waiter) => waiter.target <= state.acceptedFrames);
        state.frameWaiters = state.frameWaiters.filter((waiter) => waiter.target > state.acceptedFrames);
        for (const waiter of ready) waiter.resolve();
      } finally {
        state.pendingOps--;
      }
    }
  } catch (err) {
    state.streamEnded = true;
    state.pipeError = err;
    cancelReason = err;
    const frameWaiters = state.frameWaiters;
    state.frameWaiters = [];
    for (const waiter of frameWaiters) waiter.reject(err);
    if (state.drainBarrier) {
      await state.drainBarrier().catch(() => {
      });
    }
    await writer.abort(err).catch(() => {
    });
    if (!state.doneResolved) {
      state.doneResolved = true;
      state.reject(err);
    }
    throw err;
  } finally {
    reader.cancel(cancelReason).catch(() => {
    });
    reader.releaseLock();
    writer.releaseLock();
  }
}
var MAX_INFLIGHT_CHUNKS, getMaxInflightChunks, MAX_CHUNKS_PER_BATCH, getMaxChunksPerBatch, MAX_BYTES_PER_BATCH, getMaxBytesPerBatch, MAX_BUFFERED_BYTES, getMaxBufferedBytes, LOCK_POLL_INTERVAL_MS, getLockPollIntervalMs;
var init_flushable_stream = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/flushable-stream.js"() {
    init_dist2();
    init_dist();
    init_env_config();
    init_symbols();
    MAX_INFLIGHT_CHUNKS = 1e3;
    getMaxInflightChunks = /* @__PURE__ */ __name(() => envNumber("WORKFLOW_STREAM_MAX_INFLIGHT_CHUNKS", MAX_INFLIGHT_CHUNKS, {
      integer: true,
      min: 1
    }), "getMaxInflightChunks");
    MAX_CHUNKS_PER_BATCH = 1e3;
    getMaxChunksPerBatch = /* @__PURE__ */ __name(() => envNumber("WORKFLOW_STREAM_MAX_CHUNKS_PER_BATCH", MAX_CHUNKS_PER_BATCH, {
      integer: true,
      min: 1
    }), "getMaxChunksPerBatch");
    MAX_BYTES_PER_BATCH = 1024 * 1024;
    getMaxBytesPerBatch = /* @__PURE__ */ __name(() => envNumber("WORKFLOW_STREAM_MAX_BYTES_PER_BATCH", MAX_BYTES_PER_BATCH, {
      integer: true,
      min: 1
    }), "getMaxBytesPerBatch");
    MAX_BUFFERED_BYTES = 8 * 1024 * 1024;
    getMaxBufferedBytes = /* @__PURE__ */ __name(() => envNumber("WORKFLOW_STREAM_MAX_BUFFERED_BYTES", MAX_BUFFERED_BYTES, {
      integer: true,
      min: 1
    }), "getMaxBufferedBytes");
    LOCK_POLL_INTERVAL_MS = 10;
    getLockPollIntervalMs = /* @__PURE__ */ __name(() => envNumber("WORKFLOW_LOCK_POLL_INTERVAL_MS", LOCK_POLL_INTERVAL_MS, {
      integer: true,
      min: 1
    }), "getLockPollIntervalMs");
    __name(createFlushableState, "createFlushableState");
    __name(isWritableUnlockedNotClosed, "isWritableUnlockedNotClosed");
    __name(isReadableUnlockedNotClosed, "isReadableUnlockedNotClosed");
    __name(resolveAfterDrain, "resolveAfterDrain");
    __name(markFlushableFrameProduced, "markFlushableFrameProduced");
    __name(drainFlushableSnapshot, "drainFlushableSnapshot");
    __name(trackFlushableWritable, "trackFlushableWritable");
    __name(pollWritableLock, "pollWritableLock");
    __name(pollReadableLock, "pollReadableLock");
    __name(flushablePipe, "flushablePipe");
    __name(flushablePipePerChunk, "flushablePipePerChunk");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/global.js
var WorkflowSuspension;
var init_global = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/global.js"() {
    init_dist2();
    init_dist();
    WorkflowSuspension = class _WorkflowSuspension extends Error {
      static {
        __name(this, "WorkflowSuspension");
      }
      items;
      /** @deprecated Use `items` instead. */
      steps;
      globalThis;
      stepCount;
      hookCount;
      waitCount;
      attributeCount;
      hookDisposedCount;
      abortCount;
      /**
       * Correlation ids of the open hooks that workflow code was waiting on a
       * payload for when the VM went idle, i.e. the hooks whose `hook_received`
       * could change what this suspension leads to. A hook absent from the set has
       * no waiting consumer, so a payload landing for it is buffered and inert
       * until the first `await`. `undefined` when the suspension was built without
       * the workflow context that tracks awaiters, which callers must read as
       * "every open hook is observed". See `runtime/out-of-band-observation.ts`.
       */
      observedHookIds;
      constructor(itemsInput, global2) {
        const items = [
          ...itemsInput.values()
        ];
        let stepCount = 0;
        let hookCount = 0;
        let waitCount = 0;
        let attributeCount = 0;
        let hookDisposedCount = 0;
        let abortCount = 0;
        for (const item of items) {
          if (item.type === "step") stepCount++;
          else if (item.type === "hook") {
            if (item.disposed) hookDisposedCount++;
            else if (item.abortRequested) abortCount++;
            else hookCount++;
          } else if (item.type === "wait") waitCount++;
          else if (item.type === "attribute") attributeCount++;
        }
        const parts = [];
        if (stepCount > 0) {
          parts.push(`${stepCount} ${pluralize("step", "steps", stepCount)}`);
        }
        if (hookCount > 0) {
          parts.push(`${hookCount} ${pluralize("hook", "hooks", hookCount)}`);
        }
        if (waitCount > 0) {
          parts.push(`${waitCount} ${pluralize("wait", "waits", waitCount)}`);
        }
        if (attributeCount > 0) {
          parts.push(`${attributeCount} ${pluralize("attribute write", "attribute writes", attributeCount)}`);
        }
        if (hookDisposedCount > 0) {
          parts.push(`${hookDisposedCount} hook ${pluralize("disposal", "disposals", hookDisposedCount)}`);
        }
        const totalCount = stepCount + hookCount + waitCount + attributeCount + hookDisposedCount;
        const hasOrHave = pluralize("has", "have", totalCount);
        const typeCount = (stepCount > 0 ? 1 : 0) + (hookCount > 0 ? 1 : 0) + (waitCount > 0 ? 1 : 0) + (attributeCount > 0 ? 1 : 0) + (hookDisposedCount > 0 ? 1 : 0);
        let action;
        if (typeCount > 1) {
          action = "processed";
        } else if (stepCount > 0) {
          action = "run";
        } else if (hookCount > 0) {
          action = "created";
        } else if (waitCount > 0) {
          action = "created";
        } else if (attributeCount > 0) {
          action = "written";
        } else if (hookDisposedCount > 0) {
          action = "processed";
        } else {
          action = "received";
        }
        const description = parts.length > 0 ? `${parts.join(" and ")} ${hasOrHave} not been ${action} yet` : "0 steps have not been run yet";
        super(description);
        this.name = "WorkflowSuspension";
        this.items = items;
        this.steps = items;
        this.globalThis = global2;
        this.stepCount = stepCount;
        this.hookCount = hookCount;
        this.waitCount = waitCount;
        this.attributeCount = attributeCount;
        this.hookDisposedCount = hookDisposedCount;
        this.abortCount = abortCount;
      }
      static is(value) {
        return value instanceof _WorkflowSuspension;
      }
    };
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/private.js
function getStepIdAliasCandidates(stepId) {
  const parts = stepId.split("//");
  if (parts.length !== 3 || parts[0] !== "step") {
    return [];
  }
  const modulePath = parts[1];
  const fnName = parts[2];
  const modulePathAliases = /* @__PURE__ */ new Set();
  const addAlias = /* @__PURE__ */ __name((aliasModulePath) => {
    if (aliasModulePath !== modulePath) {
      modulePathAliases.add(aliasModulePath);
    }
  }, "addAlias");
  if (modulePath.startsWith("./workflows/")) {
    const workflowRelativePath = modulePath.slice("./".length);
    addAlias(`./example/${workflowRelativePath}`);
    addAlias(`./src/${workflowRelativePath}`);
  } else if (modulePath.startsWith("./example/workflows/")) {
    const workflowRelativePath = modulePath.slice("./example/".length);
    addAlias(`./${workflowRelativePath}`);
    addAlias(`./src/${workflowRelativePath}`);
  } else if (modulePath.startsWith("./src/workflows/")) {
    const workflowRelativePath = modulePath.slice("./src/".length);
    addAlias(`./${workflowRelativePath}`);
    addAlias(`./example/${workflowRelativePath}`);
  }
  return Array.from(modulePathAliases, (aliasModulePath) => `step//${aliasModulePath}//${fnName}`);
}
function getBuiltinResponseStepAlias(stepId) {
  if (!BUILTIN_RESPONSE_STEP_NAMES.has(stepId)) {
    return void 0;
  }
  for (const [registeredStepId, stepFn] of registeredSteps.entries()) {
    if (registeredStepId.endsWith(`//${stepId}`)) {
      return stepFn;
    }
  }
  return void 0;
}
function getStepFunction(stepId) {
  const directMatch = registeredSteps.get(stepId);
  if (directMatch) {
    return directMatch;
  }
  for (const aliasStepId of getStepIdAliasCandidates(stepId)) {
    const aliasMatch = registeredSteps.get(aliasStepId);
    if (aliasMatch) {
      return aliasMatch;
    }
  }
  const builtinAliasMatch = getBuiltinResponseStepAlias(stepId);
  if (builtinAliasMatch) {
    return builtinAliasMatch;
  }
  return void 0;
}
var RegisteredStepsKey, globalSymbols, registeredSteps, BUILTIN_RESPONSE_STEP_NAMES;
var init_private = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/private.js"() {
    init_dist2();
    init_global();
    RegisteredStepsKey = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps");
    globalSymbols = globalThis;
    registeredSteps = globalSymbols[RegisteredStepsKey] ??= /* @__PURE__ */ new Map();
    BUILTIN_RESPONSE_STEP_NAMES = /* @__PURE__ */ new Set([
      "__builtin_response_array_buffer",
      "__builtin_response_json",
      "__builtin_response_text"
    ]);
    __name(getStepIdAliasCandidates, "getStepIdAliasCandidates");
    __name(getBuiltinResponseStepAlias, "getBuiltinResponseStepAlias");
    __name(getStepFunction, "getStepFunction");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/world-compatibility.js
function assertWorldSupportsRuntimeProtocol(world) {
  const declared = world.specVersion;
  if (declared !== void 0 && declared !== null && declared >= SPEC_VERSION_SUPPORTS_SLOT_IDENTITY && declared <= SPEC_VERSION_MAX_SUPPORTED) {
    return;
  }
  const supportedVersion = declared ?? "none";
  throw new WorkflowRuntimeError(`This Workflow runtime supports Worlds with spec version ${SPEC_VERSION_SUPPORTS_SLOT_IDENTITY} through ${SPEC_VERSION_MAX_SUPPORTED}, but the configured World declares spec version ${supportedVersion}. Install a World package version compatible with the current Workflow runtime.`);
}
var init_world_compatibility = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/world-compatibility.js"() {
    init_dist2();
    init_dist3();
    __name(assertWorldSupportsRuntimeProtocol, "assertWorldSupportsRuntimeProtocol");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/get-world-lazy.js
async function getWorldLazy() {
  const g = globalThis;
  if (g[WorldCacheKey]) {
    assertWorldSupportsRuntimeProtocol(g[WorldCacheKey]);
    return g[WorldCacheKey];
  }
  if (g[WorldCachePromiseKey]) {
    g[WorldCacheKey] = await g[WorldCachePromiseKey];
    assertWorldSupportsRuntimeProtocol(g[WorldCacheKey]);
    return g[WorldCacheKey];
  }
  const getWorldFn = g[GetWorldFnKey];
  if (getWorldFn) {
    const world = await getWorldFn();
    assertWorldSupportsRuntimeProtocol(world);
    return world;
  }
  throw new Error("Workflow world runtime was not initialized. Import from the host workflow entrypoints (`workflow`, `workflow/api`, or `workflow/runtime`) so @workflow/core/runtime/world-init can register getWorld before getWorldLazy() is used.");
}
var WorldCacheKey, WorldCachePromiseKey, GetWorldFnKey;
var init_get_world_lazy = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/get-world-lazy.js"() {
    init_world_compatibility();
    WorldCacheKey = /* @__PURE__ */ Symbol.for("@workflow/world//cache");
    WorldCachePromiseKey = /* @__PURE__ */ Symbol.for("@workflow/world//cachePromise");
    GetWorldFnKey = /* @__PURE__ */ Symbol.for("@workflow/world//getWorldFn");
    __name(getWorldLazy, "getWorldLazy");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/sealed-box.js
function assertKeyMaterialLength(runKeyMaterial) {
  if (runKeyMaterial.byteLength !== CONTENT_KEY_LENGTH) {
    throw new WorkflowRuntimeError(`Run key material must be exactly ${CONTENT_KEY_LENGTH} bytes, got ${runKeyMaterial.byteLength}`);
  }
}
function assertPublicKeyLength(publicKey, label) {
  if (publicKey.byteLength !== X25519_KEY_LENGTH) {
    throw new WorkflowRuntimeError(`${label} must be exactly ${X25519_KEY_LENGTH} bytes, got ${publicKey.byteLength}`);
  }
}
async function deriveRunKeyPair(runKeyMaterial) {
  assertKeyMaterialLength(runKeyMaterial);
  const hkdfKey = await globalThis.crypto.subtle.importKey("raw", runKeyMaterial, "HKDF", false, [
    "deriveBits"
  ]);
  const scalarBits = await globalThis.crypto.subtle.deriveBits({
    name: "HKDF",
    hash: "SHA-256",
    salt: new Uint8Array(32),
    info: infoEncoder.encode(SCALAR_INFO)
  }, hkdfKey, X25519_KEY_LENGTH * 8);
  const scalar = new Uint8Array(scalarBits);
  const publicKey = await derivePublicKeyFromScalar(scalar);
  return {
    scalar,
    publicKey
  };
}
async function derivePublicKeyFromScalar(scalar) {
  const privateKey = await importScalar(
    scalar,
    /* extractable */
    true
  );
  const jwk = await globalThis.crypto.subtle.exportKey("jwk", privateKey);
  if (!jwk.x) {
    throw new WorkflowRuntimeError('X25519 JWK export did not include a public key component ("x")');
  }
  const publicKey = base64UrlToBytes(jwk.x);
  if (publicKey.byteLength !== X25519_KEY_LENGTH) {
    throw new WorkflowRuntimeError(`X25519 JWK export produced a ${publicKey.byteLength}-byte public key, expected ${X25519_KEY_LENGTH}`);
  }
  return publicKey;
}
async function importScalar(scalar, extractable) {
  const pkcs8 = new Uint8Array(PKCS8_X25519_PREFIX.length + scalar.byteLength);
  pkcs8.set(PKCS8_X25519_PREFIX, 0);
  pkcs8.set(scalar, PKCS8_X25519_PREFIX.length);
  return globalThis.crypto.subtle.importKey("pkcs8", pkcs8, {
    name: "X25519"
  }, extractable, [
    "deriveBits"
  ]);
}
function importPublicKey(publicKey) {
  return globalThis.crypto.subtle.importKey(
    "raw",
    publicKey,
    {
      name: "X25519"
    },
    /* extractable */
    true,
    // Public keys carry no usages for X25519: the private key does the
    // deriving; the public key is only ever an argument to it.
    []
  );
}
function bytesToBase64(bytes) {
  let out = "";
  for (let i2 = 0; i2 < bytes.length; i2 += 3) {
    const b0 = bytes[i2];
    const b1 = i2 + 1 < bytes.length ? bytes[i2 + 1] : 0;
    const b2 = i2 + 2 < bytes.length ? bytes[i2 + 2] : 0;
    out += BASE64_CHARS[b0 >> 2 & 63];
    out += BASE64_CHARS[(b0 & 3) << 4 | b1 >> 4 & 15];
    out += i2 + 1 < bytes.length ? BASE64_CHARS[(b1 & 15) << 2 | b2 >> 6 & 3] : "=";
    out += i2 + 2 < bytes.length ? BASE64_CHARS[b2 & 63] : "=";
  }
  return out;
}
function base64ToBytes(value) {
  let end = value.length;
  while (end > 0 && value[end - 1] === "=") end--;
  const body = value.slice(0, end);
  if (body.includes("=")) return void 0;
  if (body.length % 4 === 1) return void 0;
  if (end !== value.length && value.length % 4 !== 0) return void 0;
  let accumulator = 0;
  let bitCount = 0;
  const bytes = [];
  for (let i2 = 0; i2 < body.length; i2++) {
    const index = BASE64_CHARS.indexOf(body[i2]);
    if (index === -1) return void 0;
    accumulator = accumulator << 6 | index;
    bitCount += 6;
    if (bitCount >= 8) {
      bitCount -= 8;
      bytes.push(accumulator >> bitCount & 255);
    }
  }
  if (bitCount > 0 && (accumulator & (1 << bitCount) - 1) !== 0) {
    return void 0;
  }
  return new Uint8Array(bytes);
}
function base64UrlToBytes(value) {
  let accumulator = 0;
  let bitCount = 0;
  const bytes = [];
  for (let i2 = 0; i2 < value.length; i2++) {
    const char = value[i2];
    if (char === "=") break;
    const index = BASE64URL_CHARS.indexOf(char);
    if (index === -1) {
      throw new WorkflowRuntimeError(`Invalid base64url character "${char}" in X25519 JWK key component`);
    }
    accumulator = accumulator << 6 | index;
    bitCount += 6;
    if (bitCount >= 8) {
      bitCount -= 8;
      bytes.push(accumulator >> bitCount & 255);
    }
  }
  return new Uint8Array(bytes);
}
async function deriveContentKey(sharedSecret, ephemeralPublicKey, recipientPublicKey, usages) {
  const label = infoEncoder.encode(CONTENT_KEY_INFO);
  const info = new Uint8Array(label.length + ephemeralPublicKey.length + recipientPublicKey.length);
  info.set(label, 0);
  info.set(ephemeralPublicKey, label.length);
  info.set(recipientPublicKey, label.length + ephemeralPublicKey.length);
  const hkdfKey = await globalThis.crypto.subtle.importKey("raw", sharedSecret, "HKDF", false, [
    "deriveBits"
  ]);
  const contentKeyBits = await globalThis.crypto.subtle.deriveBits({
    name: "HKDF",
    hash: "SHA-256",
    salt: new Uint8Array(32),
    info
  }, hkdfKey, CONTENT_KEY_LENGTH * 8);
  return globalThis.crypto.subtle.importKey(
    "raw",
    new Uint8Array(contentKeyBits),
    "AES-GCM",
    false,
    // `KeyUsage` is a DOM-lib type that is not in scope under `es2022`; the
    // parameter type is a strict subset of it, so this cast is sound.
    usages
  );
}
async function encapsulate(recipientPublicKey) {
  assertPublicKeyLength(recipientPublicKey, "Recipient public key");
  let recipientKey;
  try {
    recipientKey = await importPublicKey(recipientPublicKey);
  } catch (cause) {
    throw new WorkflowRuntimeError(`Invalid X25519 recipient public key: ${cause instanceof Error ? cause.message : String(cause)}`, {
      cause
    });
  }
  const ephemeral = await globalThis.crypto.subtle.generateKey(
    {
      name: "X25519"
    },
    /* extractable */
    true,
    [
      "deriveBits"
    ]
  );
  const ephemeralPublicKey = new Uint8Array(await globalThis.crypto.subtle.exportKey("raw", ephemeral.publicKey));
  let sharedSecretBits;
  try {
    sharedSecretBits = await globalThis.crypto.subtle.deriveBits({
      name: "X25519",
      public: recipientKey
    }, ephemeral.privateKey, X25519_KEY_LENGTH * 8);
  } catch (cause) {
    throw new WorkflowRuntimeError("X25519 key agreement failed: the recipient public key is not a valid curve point (low-order point or corrupted key material)", {
      cause
    });
  }
  const contentKey = await deriveContentKey(new Uint8Array(sharedSecretBits), ephemeralPublicKey, recipientPublicKey, [
    "encrypt"
  ]);
  return {
    ephemeralPublicKey,
    contentKey
  };
}
async function decapsulate(keyPair, ephemeralPublicKey) {
  if (ephemeralPublicKey.byteLength !== X25519_KEY_LENGTH) {
    throw new RuntimeDecryptionError(`Sealed payload has a malformed ephemeral public key: expected ${X25519_KEY_LENGTH} bytes, got ${ephemeralPublicKey.byteLength}`, {
      context: {
        operation: "decrypt",
        byteLength: ephemeralPublicKey.byteLength
      }
    });
  }
  let sharedSecretBits;
  try {
    const [privateKey, senderKey] = await Promise.all([
      importScalar(
        keyPair.scalar,
        /* extractable */
        false
      ),
      importPublicKey(ephemeralPublicKey)
    ]);
    sharedSecretBits = await globalThis.crypto.subtle.deriveBits({
      name: "X25519",
      public: senderKey
    }, privateKey, X25519_KEY_LENGTH * 8);
  } catch (cause) {
    throw new RuntimeDecryptionError(`X25519 key agreement failed while opening a sealed payload: ${cause instanceof Error ? cause.message : String(cause)}`, {
      cause,
      context: {
        operation: "decrypt",
        byteLength: ephemeralPublicKey.byteLength
      }
    });
  }
  return deriveContentKey(new Uint8Array(sharedSecretBits), ephemeralPublicKey, keyPair.publicKey, [
    "decrypt"
  ]);
}
async function seal(recipientPublicKey, data2, aad) {
  const { ephemeralPublicKey, contentKey } = await encapsulate(recipientPublicKey);
  const encrypted = await encrypt(contentKey, data2, aad);
  const result = new Uint8Array(ephemeralPublicKey.byteLength + encrypted.byteLength);
  result.set(ephemeralPublicKey, 0);
  result.set(encrypted, ephemeralPublicKey.byteLength);
  return result;
}
async function open(keyPair, sealed, aad) {
  const minLength = X25519_KEY_LENGTH + NONCE_LENGTH + TAG_BYTES;
  if (sealed.byteLength < minLength) {
    throw new RuntimeDecryptionError(`Sealed payload too short: expected at least ${minLength} bytes, got ${sealed.byteLength}`, {
      context: {
        operation: "decrypt",
        byteLength: sealed.byteLength
      }
    });
  }
  const ephemeralPublicKey = sealed.subarray(0, X25519_KEY_LENGTH);
  const encrypted = sealed.subarray(X25519_KEY_LENGTH);
  const contentKey = await decapsulate(keyPair, ephemeralPublicKey);
  return decrypt(contentKey, encrypted, aad);
}
function createSealSession(recipientPublicKey, aad) {
  let encapsulation;
  return {
    async seal(data2) {
      encapsulation ??= encapsulate(recipientPublicKey);
      const { ephemeralPublicKey, contentKey } = await encapsulation;
      const encrypted = await encrypt(contentKey, data2, aad);
      const result = new Uint8Array(ephemeralPublicKey.byteLength + encrypted.byteLength);
      result.set(ephemeralPublicKey, 0);
      result.set(encrypted, ephemeralPublicKey.byteLength);
      return result;
    }
  };
}
function createOpenSession(keyPair, aad) {
  let cachedSender;
  let cachedKey;
  return {
    async open(sealed) {
      const minLength = X25519_KEY_LENGTH + NONCE_LENGTH + TAG_BYTES;
      if (sealed.byteLength < minLength) {
        throw new RuntimeDecryptionError(`Sealed payload too short: expected at least ${minLength} bytes, got ${sealed.byteLength}`, {
          context: {
            operation: "decrypt",
            byteLength: sealed.byteLength
          }
        });
      }
      const ephemeralPublicKey = sealed.subarray(0, X25519_KEY_LENGTH);
      const encrypted = sealed.subarray(X25519_KEY_LENGTH);
      const sender = keyCacheId(ephemeralPublicKey);
      if (sender !== cachedSender || !cachedKey) {
        cachedSender = sender;
        cachedKey = decapsulate(keyPair, ephemeralPublicKey);
      }
      let contentKey;
      try {
        contentKey = await cachedKey;
      } catch (error) {
        cachedSender = void 0;
        cachedKey = void 0;
        throw error;
      }
      return decrypt(contentKey, encrypted, aad);
    }
  };
}
function keyCacheId(publicKey) {
  let id = "";
  for (let i2 = 0; i2 < publicKey.length; i2++) {
    id += publicKey[i2].toString(16).padStart(2, "0");
  }
  return id;
}
function decodeRunPublicKey(value) {
  if (!value) return void 0;
  const bytes = base64ToBytes(value);
  if (!bytes || bytes.byteLength !== X25519_KEY_LENGTH) return void 0;
  return bytes;
}
var X25519_KEY_LENGTH, CONTENT_KEY_LENGTH, SCALAR_INFO, CONTENT_KEY_INFO, PKCS8_X25519_PREFIX, infoEncoder, BASE64_CHARS, BASE64URL_CHARS;
var init_sealed_box = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/sealed-box.js"() {
    init_dist2();
    init_encryption();
    X25519_KEY_LENGTH = 32;
    CONTENT_KEY_LENGTH = 32;
    SCALAR_INFO = "workflow/encp/x25519/v1";
    CONTENT_KEY_INFO = "workflow/encp/aes256gcm/v1";
    PKCS8_X25519_PREFIX = new Uint8Array([
      48,
      46,
      2,
      1,
      0,
      48,
      5,
      6,
      3,
      43,
      101,
      110,
      4,
      34,
      4,
      32
    ]);
    infoEncoder = new TextEncoder();
    __name(assertKeyMaterialLength, "assertKeyMaterialLength");
    __name(assertPublicKeyLength, "assertPublicKeyLength");
    __name(deriveRunKeyPair, "deriveRunKeyPair");
    __name(derivePublicKeyFromScalar, "derivePublicKeyFromScalar");
    __name(importScalar, "importScalar");
    __name(importPublicKey, "importPublicKey");
    BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    BASE64URL_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    __name(bytesToBase64, "bytesToBase64");
    __name(base64ToBytes, "base64ToBytes");
    __name(base64UrlToBytes, "base64UrlToBytes");
    __name(deriveContentKey, "deriveContentKey");
    __name(encapsulate, "encapsulate");
    __name(decapsulate, "decapsulate");
    __name(seal, "seal");
    __name(open, "open");
    __name(createSealSession, "createSealSession");
    __name(createOpenSession, "createOpenSession");
    __name(keyCacheId, "keyCacheId");
    __name(decodeRunPublicKey, "decodeRunPublicKey");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/hardened.js
import { types } from "node:util";
function withGuestCodeStats(stats, fn) {
  const previousStats = activeStats;
  const previousProxies = reportedProxies;
  activeStats = stats ?? null;
  reportedProxies = stats ? /* @__PURE__ */ new WeakSet() : null;
  try {
    return fn();
  } finally {
    activeStats = previousStats;
    reportedProxies = previousProxies;
  }
}
function isUseStepClosureFn(fn) {
  return typeof fn === "function" && useStepClosures.fns.has(fn);
}
function recordGuestCode(kind, detail) {
  if (!activeStats) return;
  activeStats.totalExecutions = (activeStats.totalExecutions ?? activeStats.executions.length) + 1;
  if (activeStats.executions.length >= GUEST_CODE_EXECUTION_SAMPLE_LIMIT) {
    return;
  }
  const execution = {
    kind
  };
  if (detail !== void 0) execution.detail = detail;
  activeStats.executions.push(execution);
}
function recordProxy(value) {
  if (!activeStats || !reportedProxies) return;
  if (reportedProxies.has(value)) return;
  reportedProxies.add(value);
  recordGuestCode("proxy");
}
function protoGetter(prototype, key) {
  const getter = Object.getOwnPropertyDescriptor(prototype, key)?.get;
  if (!getter) {
    throw new Error(`Missing intrinsic getter: ${String(key)}`);
  }
  return uncurryThis(getter);
}
function isEngineAccessor(getter) {
  if (isProxy(getter)) return false;
  const name = Object.getOwnPropertyDescriptor(getter, "name")?.value;
  if (typeof name === "string" && name.startsWith("bound ")) return false;
  return functionToString(getter).endsWith("{ [native code] }") || Reflect.getPrototypeOf(getter) === Function.prototype;
}
function readProperty(value, key) {
  if (value === null || typeof value !== "object" && typeof value !== "function") {
    return void 0;
  }
  if (isProxy(value)) {
    recordProxy(value);
    return value[key];
  }
  let current2 = value;
  while (current2 !== null) {
    if (isProxy(current2)) {
      recordProxy(current2);
      return value[key];
    }
    const descriptor = Object.getOwnPropertyDescriptor(current2, key);
    if (descriptor) {
      if ("value" in descriptor) return descriptor.value;
      if (descriptor.get) {
        if (!isEngineAccessor(descriptor.get)) {
          recordGuestCode("getter", String(key));
        }
        return descriptor.get.call(value);
      }
      return void 0;
    }
    current2 = Reflect.getPrototypeOf(current2);
  }
  return void 0;
}
function hasProperty(value, key) {
  if (value === null || typeof value !== "object" && typeof value !== "function") {
    return false;
  }
  if (isProxy(value)) {
    recordProxy(value);
    return key in value;
  }
  let current2 = value;
  while (current2 !== null) {
    if (isProxy(current2)) {
      recordProxy(current2);
      return key in value;
    }
    if (Object.getOwnPropertyDescriptor(current2, key)) return true;
    current2 = Reflect.getPrototypeOf(current2);
  }
  return false;
}
function isInstanceOfPrototype(value, prototype) {
  if (!prototype) return false;
  if (value === null || typeof value !== "object") return false;
  if (isProxy(value)) recordProxy(value);
  let current2 = Reflect.getPrototypeOf(value);
  while (current2 !== null) {
    if (current2 === prototype) return true;
    if (isProxy(current2)) recordProxy(current2);
    current2 = Reflect.getPrototypeOf(current2);
  }
  return false;
}
function urlHref(value) {
  if (isProxy(value)) {
    recordProxy(value);
    return value.href;
  }
  return urlHrefGetter(value);
}
function urlSearchParamsToString(value) {
  if (isProxy(value)) {
    recordProxy(value);
    return String(value);
  }
  return urlSearchParamsToStringMethod(value);
}
function headersToEntries(value) {
  if (isProxy(value)) {
    recordProxy(value);
    return Array.from(value);
  }
  try {
    return [
      ...headersIterator(value)
    ];
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    recordGuestCode("method", "Headers[Symbol.iterator]");
    return Array.from(value);
  }
}
function mapToEntries(value) {
  return [
    ...mapEntries(value)
  ];
}
function setToValues(value) {
  return [
    ...setValues(value)
  ];
}
function viewInfo(value) {
  if (types.isDataView(value)) {
    return {
      buffer: dataViewBuffer(value),
      byteOffset: dataViewByteOffset(value),
      byteLength: dataViewByteLength(value)
    };
  }
  return {
    buffer: typedArrayBuffer(value),
    byteOffset: typedArrayByteOffset(value),
    byteLength: typedArrayByteLength(value)
  };
}
function brandOf(value) {
  if (types.isDate(value)) return "Date";
  if (types.isRegExp(value)) return "RegExp";
  if (types.isMap(value)) return "Map";
  if (types.isSet(value)) return "Set";
  if (Array.isArray(value)) return "Array";
  if (types.isTypedArray(value)) {
    const tag = typedArrayTag(value);
    return tag !== void 0 && KNOWN_VIEW_TAGS.has(tag) ? tag : void 0;
  }
  if (types.isDataView(value)) return "DataView";
  if (types.isArrayBuffer(value)) return "ArrayBuffer";
  if (types.isSharedArrayBuffer(value)) return "SharedArrayBuffer";
  if (types.isNumberObject(value)) return "Number";
  if (types.isStringObject(value)) return "String";
  if (types.isBooleanObject(value)) return "Boolean";
  if (types.isBigIntObject(value)) return "BigInt";
  if (isInstanceOfPrototype(value, URL.prototype)) return "URL";
  if (isInstanceOfPrototype(value, URLSearchParams.prototype)) {
    return "URLSearchParams";
  }
  return void 0;
}
function readToStringTag(value) {
  const tag = readProperty(value, Symbol.toStringTag);
  return typeof tag === "string" ? tag : void 0;
}
var GUEST_CODE_EXECUTION_SAMPLE_LIMIT, activeStats, reportedProxies, useStepClosures, uncurryThis, dateGetDate, dateGetTime, dateToISOString, regExpSource, regExpFlags, arrayBufferByteLength, mapEntries, setValues, numberValueOf, stringValueOf, booleanValueOf, bigIntValueOf, TypedArrayPrototype, typedArrayTag, typedArrayBuffer, typedArrayByteOffset, typedArrayByteLength, typedArrayLength, typedArraySet, HostArrayBuffer, HostUint8Array, dataViewBuffer, dataViewByteOffset, dataViewByteLength, sharedArrayBufferByteLength, headersIterator, urlHrefGetter, urlSearchParamsToStringMethod, isProxy, functionToString, KNOWN_VIEW_TAGS, BRAND_DECIDED_TAGS, hardenedStringifyOperations;
var init_hardened = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/hardened.js"() {
    init_dist();
    init_src();
    GUEST_CODE_EXECUTION_SAMPLE_LIMIT = 5;
    activeStats = null;
    reportedProxies = null;
    __name(withGuestCodeStats, "withGuestCodeStats");
    useStepClosures = globalSingleton("@workflow/core//useStepClosures.fns", 1, () => ({
      fns: /* @__PURE__ */ new WeakSet()
    }));
    __name(isUseStepClosureFn, "isUseStepClosureFn");
    __name(recordGuestCode, "recordGuestCode");
    __name(recordProxy, "recordProxy");
    uncurryThis = Function.prototype.bind.bind(Function.prototype.call);
    __name(protoGetter, "protoGetter");
    dateGetDate = uncurryThis(Date.prototype.getDate);
    dateGetTime = uncurryThis(Date.prototype.getTime);
    dateToISOString = uncurryThis(Date.prototype.toISOString);
    regExpSource = protoGetter(RegExp.prototype, "source");
    regExpFlags = protoGetter(RegExp.prototype, "flags");
    arrayBufferByteLength = protoGetter(ArrayBuffer.prototype, "byteLength");
    mapEntries = uncurryThis(Map.prototype.entries);
    setValues = uncurryThis(Set.prototype.values);
    numberValueOf = uncurryThis(Number.prototype.valueOf);
    stringValueOf = uncurryThis(String.prototype.valueOf);
    booleanValueOf = uncurryThis(Boolean.prototype.valueOf);
    bigIntValueOf = uncurryThis(BigInt.prototype.valueOf);
    TypedArrayPrototype = Object.getPrototypeOf(Uint8Array.prototype);
    typedArrayTag = protoGetter(TypedArrayPrototype, Symbol.toStringTag);
    typedArrayBuffer = protoGetter(TypedArrayPrototype, "buffer");
    typedArrayByteOffset = protoGetter(TypedArrayPrototype, "byteOffset");
    typedArrayByteLength = protoGetter(TypedArrayPrototype, "byteLength");
    typedArrayLength = protoGetter(TypedArrayPrototype, "length");
    typedArraySet = uncurryThis(TypedArrayPrototype.set);
    HostArrayBuffer = ArrayBuffer;
    HostUint8Array = Uint8Array;
    dataViewBuffer = protoGetter(DataView.prototype, "buffer");
    dataViewByteOffset = protoGetter(DataView.prototype, "byteOffset");
    dataViewByteLength = protoGetter(DataView.prototype, "byteLength");
    sharedArrayBufferByteLength = protoGetter(SharedArrayBuffer.prototype, "byteLength");
    headersIterator = uncurryThis(Headers.prototype[Symbol.iterator]);
    urlHrefGetter = protoGetter(URL.prototype, "href");
    urlSearchParamsToStringMethod = uncurryThis(URLSearchParams.prototype.toString);
    ({ isProxy } = types);
    functionToString = uncurryThis(Function.prototype.toString);
    __name(isEngineAccessor, "isEngineAccessor");
    __name(readProperty, "readProperty");
    __name(hasProperty, "hasProperty");
    __name(isInstanceOfPrototype, "isInstanceOfPrototype");
    __name(urlHref, "urlHref");
    __name(urlSearchParamsToString, "urlSearchParamsToString");
    __name(headersToEntries, "headersToEntries");
    __name(mapToEntries, "mapToEntries");
    __name(setToValues, "setToValues");
    __name(viewInfo, "viewInfo");
    KNOWN_VIEW_TAGS = /* @__PURE__ */ new Set([
      "Int8Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "Int16Array",
      "Uint16Array",
      "Float16Array",
      "Int32Array",
      "Uint32Array",
      "Float32Array",
      "Float64Array",
      "BigInt64Array",
      "BigUint64Array"
    ]);
    BRAND_DECIDED_TAGS = /* @__PURE__ */ new Set([
      "Date",
      "RegExp",
      "Map",
      "Set",
      "Array",
      "DataView",
      "ArrayBuffer",
      "SharedArrayBuffer",
      "Number",
      "String",
      "Boolean",
      "BigInt",
      "URL",
      "URLSearchParams",
      ...KNOWN_VIEW_TAGS
    ]);
    __name(brandOf, "brandOf");
    __name(readToStringTag, "readToStringTag");
    hardenedStringifyOperations = {
      tagOf: /* @__PURE__ */ __name((value) => {
        if (isProxy(value)) {
          recordProxy(value);
          return default_stringify_operations.tagOf(value);
        }
        const brand = brandOf(value);
        if (brand !== void 0) return brand;
        const tag = readToStringTag(value);
        if (tag === void 0 || BRAND_DECIDED_TAGS.has(tag)) return "Object";
        return tag;
      }, "tagOf"),
      isThenable: /* @__PURE__ */ __name((value) => {
        if (types.isPromise(value)) return true;
        return typeof readProperty(value, "then") === "function";
      }, "isThenable"),
      unbox: /* @__PURE__ */ __name((boxed) => {
        if (types.isNumberObject(boxed)) return numberValueOf(boxed);
        if (types.isStringObject(boxed)) return stringValueOf(boxed);
        if (types.isBooleanObject(boxed)) return booleanValueOf(boxed);
        return bigIntValueOf(boxed);
      }, "unbox"),
      toISOString: /* @__PURE__ */ __name((date) => Number.isNaN(dateGetDate(date)) ? "" : dateToISOString(date), "toISOString"),
      toStringValue: /* @__PURE__ */ __name((value) => {
        if (isInstanceOfPrototype(value, URL.prototype)) {
          return urlHref(value);
        }
        if (isInstanceOfPrototype(value, URLSearchParams.prototype)) {
          return urlSearchParamsToString(value);
        }
        recordGuestCode("method", `toString (${readToStringTag(value) ?? "unknown"})`);
        return value.toString();
      }, "toStringValue"),
      regExpInfo: /* @__PURE__ */ __name((regexp) => ({
        source: regExpSource(regexp),
        flags: regExpFlags(regexp)
      }), "regExpInfo"),
      valuesOf: /* @__PURE__ */ __name((set) => setToValues(set), "valuesOf"),
      entriesOf: /* @__PURE__ */ __name((map) => mapToEntries(map), "entriesOf"),
      viewInfo: /* @__PURE__ */ __name((view) => {
        const info = viewInfo(view);
        const length = types.isDataView(view) ? 0 : typedArrayLength(view);
        const bufferByteLength = types.isSharedArrayBuffer(info.buffer) ? sharedArrayBufferByteLength(info.buffer) : arrayBufferByteLength(info.buffer);
        if (info.byteLength === bufferByteLength) {
          return {
            ...info,
            length,
            bufferByteLength
          };
        }
        const copy = new HostArrayBuffer(info.byteLength);
        typedArraySet(new HostUint8Array(copy), new HostUint8Array(info.buffer, info.byteOffset, info.byteLength));
        return {
          buffer: copy,
          byteOffset: 0,
          byteLength: info.byteLength,
          length,
          bufferByteLength: info.byteLength
        };
      }, "viewInfo"),
      shapeOf: /* @__PURE__ */ __name((value) => {
        if (isProxy(value)) recordProxy(value);
        return default_stringify_operations.shapeOf(value);
      }, "shapeOf"),
      get: /* @__PURE__ */ __name((value, key) => readProperty(value, key), "get")
    };
  }
});

// ../../node_modules/.pnpm/@workflow+serde@5.0.0/node_modules/@workflow/serde/dist/index.js
var WORKFLOW_SERIALIZE, WORKFLOW_DESERIALIZE;
var init_dist4 = __esm({
  "../../node_modules/.pnpm/@workflow+serde@5.0.0/node_modules/@workflow/serde/dist/index.js"() {
    WORKFLOW_SERIALIZE = /* @__PURE__ */ Symbol.for("workflow-serialize");
    WORKFLOW_DESERIALIZE = /* @__PURE__ */ Symbol.for("workflow-deserialize");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/class-serialization.js
function getRegistry(global2 = globalThis) {
  const g = global2;
  let registry = g[WORKFLOW_CLASS_REGISTRY];
  if (!registry) {
    registry = /* @__PURE__ */ new Map();
    g[WORKFLOW_CLASS_REGISTRY] = registry;
  }
  return registry;
}
function getSerializationClass(classId, global2) {
  return getRegistry(global2).get(classId);
}
var init_class_serialization = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/class-serialization.js"() {
    init_symbols();
    __name(getRegistry, "getRegistry");
    __name(getSerializationClass, "getSerializationClass");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/reducers/class.js
function getClassReducers() {
  return {
    // Class and Instance are intentionally placed before Error so that
    // custom Error subclasses with WORKFLOW_SERIALIZE take precedence
    // over the generic Error serialization (devalue uses first-match-wins).
    Class: /* @__PURE__ */ __name((value) => {
      if (typeof value !== "function") return false;
      const classId = readProperty(value, "classId");
      if (typeof classId !== "string") return false;
      return {
        classId
      };
    }, "Class"),
    Instance: /* @__PURE__ */ __name((value) => {
      if (value === null || typeof value !== "object") return false;
      const cls = readProperty(value, "constructor");
      if (!cls || typeof cls !== "function") return false;
      const serialize3 = readProperty(cls, WORKFLOW_SERIALIZE);
      if (typeof serialize3 !== "function") return false;
      const classId = readProperty(cls, "classId");
      if (typeof classId !== "string") {
        throw new Error(`Class "${String(readProperty(cls, "name"))}" with ${String(WORKFLOW_SERIALIZE)} must have a static "classId" property.`);
      }
      recordGuestCode("method", `[WORKFLOW_SERIALIZE] (${classId})`);
      const data2 = serialize3.call(cls, value);
      return {
        classId,
        data: data2
      };
    }, "Instance")
  };
}
function getClassRevivers(global2 = globalThis) {
  return {
    Class: /* @__PURE__ */ __name((value) => {
      const classId = value.classId;
      const cls = getSerializationClass(classId, global2);
      if (!cls) {
        throw new Error(`Class "${classId}" not found. Make sure the class is registered with registerSerializationClass.`);
      }
      return cls;
    }, "Class"),
    Instance: /* @__PURE__ */ __name((value) => {
      const classId = value.classId;
      const data2 = value.data;
      const cls = getSerializationClass(classId, global2);
      if (!cls) {
        throw new Error(`Class "${classId}" not found. Make sure the class is registered with registerSerializationClass.`);
      }
      const deserialize4 = cls[WORKFLOW_DESERIALIZE];
      if (typeof deserialize4 !== "function") {
        throw new Error(`Class "${classId}" does not have a static ${String(WORKFLOW_DESERIALIZE)} method.`);
      }
      return deserialize4.call(cls, data2);
    }, "Instance")
  };
}
var init_class = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/reducers/class.js"() {
    init_dist4();
    init_class_serialization();
    init_hardened();
    __name(getClassReducers, "getClassReducers");
    __name(getClassRevivers, "getClassRevivers");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/reducers/common.js
import { types as types2 } from "node:util";
function arrayBufferToBase64(value, offset2, length) {
  if (length === 0) return ".";
  const uint8 = new Uint8Array(value, offset2, length);
  return Buffer.from(uint8).toString("base64");
}
function viewToBase64(value) {
  const info = viewInfo(value);
  return arrayBufferToBase64(info.buffer, info.byteOffset, info.byteLength);
}
function reviveArrayBuffer(value, global2) {
  const base64 = value === "." ? "" : value;
  const buffer2 = Buffer.from(base64, "base64");
  const arrayBuffer = new global2.ArrayBuffer(buffer2.length);
  const uint8Array = new global2.Uint8Array(arrayBuffer);
  uint8Array.set(buffer2);
  return arrayBuffer;
}
function revive(str) {
  return JSON.parse(str);
}
function readErrorStack(value) {
  const descriptor = Object.getOwnPropertyDescriptor(value, "stack");
  if (descriptor && "value" in descriptor) {
    return descriptor.value;
  }
  recordGuestCode("getter", "stack");
  if (descriptor?.get) {
    return descriptor.get.call(value);
  }
  return readProperty(value, "stack");
}
function reduceErrorBase(value) {
  if (!types2.isNativeError(value)) return false;
  const reduced = {
    message: readProperty(value, "message"),
    stack: readErrorStack(value)
  };
  if (hasProperty(value, "cause")) reduced.cause = readProperty(value, "cause");
  return reduced;
}
function reduceNamedErrorSubclassBase(subclassName, value) {
  if (!types2.isNativeError(value)) return false;
  if (readProperty(value, "name") !== subclassName) return false;
  return reduceErrorBase(value);
}
function makeErrorSubclassReducer(subclassName) {
  return (value) => {
    const base = reduceNamedErrorSubclassBase(subclassName, value);
    if (!base) return false;
    return base;
  };
}
function makeErrorSubclassReviver(global2, ctorName) {
  return (value) => {
    const v = value;
    const opts = "cause" in v ? {
      cause: v.cause
    } : void 0;
    const Ctor = global2[ctorName];
    const error = new Ctor(v.message, opts);
    if (v.stack !== void 0) error.stack = v.stack;
    return error;
  };
}
function getCommonReducers(_global = globalThis) {
  return {
    ArrayBuffer: /* @__PURE__ */ __name((value) => types2.isArrayBuffer(value) && arrayBufferToBase64(value, 0, arrayBufferByteLength(value)), "ArrayBuffer"),
    BigInt: /* @__PURE__ */ __name((value) => (
      // String(bigint) is a spec-internal numeric conversion: unlike
      // `value.toString()`, it never consults BigInt.prototype.
      typeof value === "bigint" && String(value)
    ), "BigInt"),
    BigInt64Array: /* @__PURE__ */ __name((value) => types2.isBigInt64Array(value) && viewToBase64(value), "BigInt64Array"),
    BigUint64Array: /* @__PURE__ */ __name((value) => types2.isBigUint64Array(value) && viewToBase64(value), "BigUint64Array"),
    // Claims `DataView` for the same reason every typed array is claimed:
    // devalue's built-in `DataView` encoding emits the *whole* backing
    // ArrayBuffer plus the view's offset and length. For a view onto Node's
    // shared `Buffer` pool (`Buffer.allocUnsafe`, and `Buffer.from` below
    // `Buffer.poolSize >>> 1`) that whole buffer is 8 KiB of unrelated
    // allocations, so a four-byte view would persist bytes the workflow
    // never handed us into the run's event log. Base64 of the viewed range
    // keeps the payload to the bytes the view actually spans.
    //
    // The tag deliberately is *not* `DataView`. devalue skips its built-in
    // branch for any tag that has a custom reviver, so registering one under
    // that name would strip the bounds off `["DataView", buf, offset, length]`
    // tuples already in event logs — the o11y UI and CLI read those with
    // current code, and would render the whole pooled slab this reducer
    // exists to keep out. Under a distinct tag the built-in branch stays
    // reachable and those payloads still revive with their bounds.
    DataViewBytes: /* @__PURE__ */ __name((value) => types2.isDataView(value) && viewToBase64(value), "DataViewBytes"),
    Date: /* @__PURE__ */ __name((value) => {
      if (!types2.isDate(value)) return false;
      const valid = !Number.isNaN(dateGetDate(value));
      return valid ? dateToISOString(value) : ".";
    }, "Date"),
    // DOMException is a special case: it `instanceof Error` is true in Node,
    // but `types.isNativeError()` returns FALSE for it, so the generic Error
    // reducer (which gates on isNativeError) won't match. Check it explicitly
    // by constructor name + Error inheritance so we catch DOMExceptions from
    // any realm (cross-VM safety: instanceof global.DOMException would fail
    // for instances minted in another context).
    DOMException: /* @__PURE__ */ __name((value) => {
      if (value === null || typeof value !== "object") return false;
      const ctor = readProperty(value, "constructor");
      if (!ctor || readProperty(ctor, "name") !== "DOMException") return false;
      const reduced = {
        message: readProperty(value, "message"),
        name: readProperty(value, "name"),
        stack: readErrorStack(value)
      };
      if (hasProperty(value, "cause")) {
        reduced.cause = readProperty(value, "cause");
      }
      return reduced;
    }, "DOMException"),
    // Error subclass reducers are intentionally placed before the base Error
    // reducer because devalue uses first-match-wins. Subclass-specific reducers
    // must be checked first so that e.g. a TypeError is serialized as "TypeError"
    // rather than falling through to the generic "Error" reducer.
    // See `makeErrorSubclassReducer` for implementation details.
    EvalError: makeErrorSubclassReducer("EvalError"),
    FatalError: makeErrorSubclassReducer("FatalError"),
    HookConflictError: /* @__PURE__ */ __name((value) => {
      const base = reduceNamedErrorSubclassBase("HookConflictError", value);
      if (!base) return false;
      const reduced = {
        ...base,
        token: readProperty(value, "token")
      };
      const conflictingRunId = readProperty(value, "conflictingRunId");
      if (conflictingRunId !== void 0) {
        reduced.conflictingRunId = conflictingRunId;
      }
      return reduced;
    }, "HookConflictError"),
    HookForceClaimedError: /* @__PURE__ */ __name((value) => {
      const base = reduceNamedErrorSubclassBase("HookForceClaimedError", value);
      if (!base) return false;
      const reduced = {
        ...base,
        token: readProperty(value, "token"),
        claimedByRunId: readProperty(value, "claimedByRunId")
      };
      const claimedByHookId = readProperty(value, "claimedByHookId");
      if (claimedByHookId !== void 0) {
        reduced.claimedByHookId = claimedByHookId;
      }
      return reduced;
    }, "HookForceClaimedError"),
    RangeError: makeErrorSubclassReducer("RangeError"),
    ReferenceError: makeErrorSubclassReducer("ReferenceError"),
    // RetryableError carries an extra `retryAfter` Date that we serialize as
    // a numeric epoch timestamp. The Date reducer uses `instanceof global.Date`,
    // which fails for Dates from a different VM realm; serializing as a
    // number sidesteps that issue.
    RetryableError: /* @__PURE__ */ __name((value) => {
      const base = reduceNamedErrorSubclassBase("RetryableError", value);
      if (!base) return false;
      const retryAfterRaw = readProperty(value, "retryAfter");
      let retryAfter;
      if (types2.isDate(retryAfterRaw)) {
        const t = dateGetTime(retryAfterRaw);
        retryAfter = Number.isNaN(t) ? Date.now() + 1e3 : t;
      } else if (retryAfterRaw && typeof retryAfterRaw === "object") {
        const getTime = readProperty(retryAfterRaw, "getTime");
        if (typeof getTime === "function") {
          recordGuestCode("method", "getTime");
          const t = getTime.call(retryAfterRaw);
          retryAfter = Number.isNaN(t) ? Date.now() + 1e3 : t;
        } else {
          retryAfter = Date.now() + 1e3;
        }
      } else if (typeof retryAfterRaw === "string" || typeof retryAfterRaw === "number") {
        const t = new Date(retryAfterRaw).getTime();
        retryAfter = Number.isNaN(t) ? Date.now() + 1e3 : t;
      } else {
        retryAfter = Date.now() + 1e3;
      }
      return {
        ...base,
        retryAfter
      };
    }, "RetryableError"),
    // RuntimeDecryptionError carries an extra `context` object (operation,
    // byteLength, formatPrefix) that the generic Error reducer would drop.
    // Preserve it so the diagnostic data survives the run-error round trip.
    RuntimeDecryptionError: /* @__PURE__ */ __name((value) => {
      const base = reduceNamedErrorSubclassBase("RuntimeDecryptionError", value);
      if (!base) return false;
      const reduced = {
        ...base
      };
      const context = readProperty(value, "context");
      if (context !== void 0) {
        reduced.context = context;
      }
      return reduced;
    }, "RuntimeDecryptionError"),
    StreamError: /* @__PURE__ */ __name((value) => {
      const base = reduceNamedErrorSubclassBase("StreamError", value);
      if (!base) return false;
      const reduced = {
        ...base
      };
      const status = readProperty(value, "status");
      const url = readProperty(value, "url");
      if (typeof status === "number") reduced.status = status;
      if (typeof url === "string") reduced.url = url;
      return reduced;
    }, "StreamError"),
    SyntaxError: makeErrorSubclassReducer("SyntaxError"),
    TypeError: makeErrorSubclassReducer("TypeError"),
    URIError: makeErrorSubclassReducer("URIError"),
    // AggregateError is similar to other subclasses but also preserves the
    // `errors` array. We extend the base helper's output here.
    AggregateError: /* @__PURE__ */ __name((value) => {
      const base = reduceNamedErrorSubclassBase("AggregateError", value);
      if (!base) return false;
      return {
        ...base,
        errors: readProperty(value, "errors")
      };
    }, "AggregateError"),
    // Base Error reducer: catch-all for any Error instance not matched by a
    // specific subclass reducer above (including user Error subclasses without
    // WORKFLOW_SERIALIZE). Preserves `name` so the error's identity is retained
    // even though the exact class cannot be reconstructed.
    Error: /* @__PURE__ */ __name((value) => {
      if (!types2.isNativeError(value)) return false;
      const reduced = {
        name: readProperty(value, "name"),
        message: readProperty(value, "message"),
        stack: readErrorStack(value)
      };
      if (hasProperty(value, "cause")) {
        reduced.cause = readProperty(value, "cause");
      }
      return reduced;
    }, "Error"),
    Float32Array: /* @__PURE__ */ __name((value) => types2.isFloat32Array(value) && viewToBase64(value), "Float32Array"),
    Float64Array: /* @__PURE__ */ __name((value) => types2.isFloat64Array(value) && viewToBase64(value), "Float64Array"),
    // Headers is a host class injected into the sandbox, so its (shared)
    // prototype is reachable from workflow code; iterate through the
    // boot-captured iterator instead of a live Symbol.iterator lookup.
    Headers: /* @__PURE__ */ __name((value) => isInstanceOfPrototype(value, Headers.prototype) && headersToEntries(value), "Headers"),
    Int8Array: /* @__PURE__ */ __name((value) => types2.isInt8Array(value) && viewToBase64(value), "Int8Array"),
    Int16Array: /* @__PURE__ */ __name((value) => types2.isInt16Array(value) && viewToBase64(value), "Int16Array"),
    Int32Array: /* @__PURE__ */ __name((value) => types2.isInt32Array(value) && viewToBase64(value), "Int32Array"),
    // Engine brand check + host-realm iteration: a patched
    // `Map.prototype[Symbol.iterator]` in the sandbox is never consulted.
    Map: /* @__PURE__ */ __name((value) => types2.isMap(value) && mapToEntries(value), "Map"),
    RegExp: /* @__PURE__ */ __name((value) => types2.isRegExp(value) && {
      source: regExpSource(value),
      flags: regExpFlags(value)
    }, "RegExp"),
    // Request and Response are intentionally NOT in common reducers.
    // They require mode-specific revivers (stream handling, etc.) and
    // including them here without matching revivers would cause them
    // to deserialize as plain objects.
    Set: /* @__PURE__ */ __name((value) => types2.isSet(value) && setToValues(value), "Set"),
    URL: /* @__PURE__ */ __name((value) => isInstanceOfPrototype(value, URL.prototype) && urlHref(value), "URL"),
    WorkflowFunction: /* @__PURE__ */ __name((value) => {
      if (typeof value !== "function") return false;
      const workflowId = readProperty(value, "workflowId");
      if (typeof workflowId !== "string") return false;
      return {
        workflowId
      };
    }, "WorkflowFunction"),
    URLSearchParams: /* @__PURE__ */ __name((value) => {
      if (!isInstanceOfPrototype(value, URLSearchParams.prototype)) {
        return false;
      }
      const text = urlSearchParamsToString(value);
      return text === "" ? "." : text;
    }, "URLSearchParams"),
    Uint8Array: /* @__PURE__ */ __name((value) => types2.isUint8Array(value) && viewToBase64(value), "Uint8Array"),
    Uint8ClampedArray: /* @__PURE__ */ __name((value) => types2.isUint8ClampedArray(value) && viewToBase64(value), "Uint8ClampedArray"),
    Uint16Array: /* @__PURE__ */ __name((value) => types2.isUint16Array(value) && viewToBase64(value), "Uint16Array"),
    Uint32Array: /* @__PURE__ */ __name((value) => types2.isUint32Array(value) && viewToBase64(value), "Uint32Array")
  };
}
function getCommonRevivers(global2 = globalThis) {
  return {
    ArrayBuffer: /* @__PURE__ */ __name((value) => reviveArrayBuffer(value, global2), "ArrayBuffer"),
    BigInt: /* @__PURE__ */ __name((value) => global2.BigInt(value), "BigInt"),
    BigInt64Array: /* @__PURE__ */ __name((value) => new global2.BigInt64Array(reviveArrayBuffer(value, global2)), "BigInt64Array"),
    BigUint64Array: /* @__PURE__ */ __name((value) => new global2.BigUint64Array(reviveArrayBuffer(value, global2)), "BigUint64Array"),
    // No `DataView` reviver: see the `DataViewBytes` reducer. Older payloads
    // tagged `DataView` must keep reaching devalue's built-in branch.
    DataViewBytes: /* @__PURE__ */ __name((value) => new global2.DataView(reviveArrayBuffer(value, global2)), "DataViewBytes"),
    Date: /* @__PURE__ */ __name((value) => new global2.Date(value), "Date"),
    DOMException: /* @__PURE__ */ __name((value) => {
      const error = new global2.DOMException(value.message, value.name);
      if (value.stack !== void 0) error.stack = value.stack;
      if ("cause" in value) error.cause = value.cause;
      return error;
    }, "DOMException"),
    // Error subclass revivers reconstruct the correct built-in Error type.
    // See `makeErrorSubclassReviver` for implementation details.
    EvalError: makeErrorSubclassReviver(global2, "EvalError"),
    // `FatalError` and `RetryableError` are not built-ins, so we resolve them
    // from the consumer's `globalThis` via a `Symbol.for(...)` key registered
    // by `@workflow/errors` on load. This makes `instanceof FatalError` work
    // in user code that lives in a different realm than this reducer module
    // (e.g. when the host hydrates a value destined for a workflow VM
    // context). See the registration block at the bottom of
    // `packages/errors/src/index.ts` for details. Falls back to the imported
    // class for environments where no bundled `@workflow/errors` has loaded
    // in the consumer realm.
    FatalError: /* @__PURE__ */ __name((value) => {
      const Ctor = global2[/* @__PURE__ */ Symbol.for("@workflow/errors//FatalError")] ?? FatalError;
      const error = new Ctor(value.message);
      if (value.stack !== void 0) error.stack = value.stack;
      if ("cause" in value) error.cause = value.cause;
      return error;
    }, "FatalError"),
    HookConflictError: /* @__PURE__ */ __name((value) => {
      const Ctor = global2[/* @__PURE__ */ Symbol.for("@workflow/errors//HookConflictError")] ?? HookConflictError;
      const error = new Ctor(value.token, value.conflictingRunId);
      if (value.stack !== void 0) error.stack = value.stack;
      if ("cause" in value) {
        error.cause = value.cause;
      }
      return error;
    }, "HookConflictError"),
    HookForceClaimedError: /* @__PURE__ */ __name((value) => {
      const Ctor = global2[/* @__PURE__ */ Symbol.for("@workflow/errors//HookForceClaimedError")] ?? HookForceClaimedError;
      const error = new Ctor(value.token, value.claimedByRunId, value.claimedByHookId);
      if (value.stack !== void 0) error.stack = value.stack;
      if ("cause" in value) {
        error.cause = value.cause;
      }
      return error;
    }, "HookForceClaimedError"),
    RangeError: makeErrorSubclassReviver(global2, "RangeError"),
    ReferenceError: makeErrorSubclassReviver(global2, "ReferenceError"),
    RetryableError: /* @__PURE__ */ __name((value) => {
      const Ctor = global2[/* @__PURE__ */ Symbol.for("@workflow/errors//RetryableError")] ?? RetryableError;
      const error = new Ctor(value.message, {
        retryAfter: new global2.Date(value.retryAfter)
      });
      if (value.stack !== void 0) error.stack = value.stack;
      if ("cause" in value) error.cause = value.cause;
      return error;
    }, "RetryableError"),
    RuntimeDecryptionError: /* @__PURE__ */ __name((value) => {
      const Ctor = global2[/* @__PURE__ */ Symbol.for("@workflow/errors//RuntimeDecryptionError")] ?? RuntimeDecryptionError;
      const opts = {};
      if ("cause" in value) opts.cause = value.cause;
      if (value.context !== void 0) opts.context = value.context;
      const error = new Ctor(value.message, opts);
      if (value.stack !== void 0) error.stack = value.stack;
      return error;
    }, "RuntimeDecryptionError"),
    StreamError: /* @__PURE__ */ __name((value) => {
      const Ctor = global2[/* @__PURE__ */ Symbol.for("@workflow/errors//StreamError")] ?? StreamError;
      const error = new Ctor(value.message, {
        ..."cause" in value ? {
          cause: value.cause
        } : {},
        status: value.status,
        url: value.url
      });
      if (value.stack !== void 0) error.stack = value.stack;
      return error;
    }, "StreamError"),
    SyntaxError: makeErrorSubclassReviver(global2, "SyntaxError"),
    TypeError: makeErrorSubclassReviver(global2, "TypeError"),
    URIError: makeErrorSubclassReviver(global2, "URIError"),
    AggregateError: /* @__PURE__ */ __name((value) => {
      const opts = "cause" in value ? {
        cause: value.cause
      } : void 0;
      const error = new global2.AggregateError(value.errors, value.message, opts);
      if (value.stack !== void 0) error.stack = value.stack;
      return error;
    }, "AggregateError"),
    // Base Error reviver: used for plain Error instances and unrecognized
    // Error subclasses. Preserves `name` so the error's identity is retained.
    Error: /* @__PURE__ */ __name((value) => {
      const opts = "cause" in value ? {
        cause: value.cause
      } : void 0;
      const error = new global2.Error(value.message, opts);
      error.name = value.name;
      if (value.stack !== void 0) error.stack = value.stack;
      return error;
    }, "Error"),
    Float32Array: /* @__PURE__ */ __name((value) => new global2.Float32Array(reviveArrayBuffer(value, global2)), "Float32Array"),
    Float64Array: /* @__PURE__ */ __name((value) => new global2.Float64Array(reviveArrayBuffer(value, global2)), "Float64Array"),
    Headers: /* @__PURE__ */ __name((value) => new global2.Headers(value), "Headers"),
    Int8Array: /* @__PURE__ */ __name((value) => new global2.Int8Array(reviveArrayBuffer(value, global2)), "Int8Array"),
    Int16Array: /* @__PURE__ */ __name((value) => new global2.Int16Array(reviveArrayBuffer(value, global2)), "Int16Array"),
    Int32Array: /* @__PURE__ */ __name((value) => new global2.Int32Array(reviveArrayBuffer(value, global2)), "Int32Array"),
    Map: /* @__PURE__ */ __name((value) => new global2.Map(value), "Map"),
    RegExp: /* @__PURE__ */ __name((value) => new global2.RegExp(value.source, value.flags), "RegExp"),
    Set: /* @__PURE__ */ __name((value) => new global2.Set(value), "Set"),
    URL: /* @__PURE__ */ __name((value) => new global2.URL(value), "URL"),
    WorkflowFunction: /* @__PURE__ */ __name((value) => Object.assign(() => {
      throw new Error("Workflow functions cannot be called directly. Use start() to invoke them.");
    }, {
      workflowId: value.workflowId
    }), "WorkflowFunction"),
    URLSearchParams: /* @__PURE__ */ __name((value) => new global2.URLSearchParams(value === "." ? "" : value), "URLSearchParams"),
    Uint8Array: /* @__PURE__ */ __name((value) => new global2.Uint8Array(reviveArrayBuffer(value, global2)), "Uint8Array"),
    Uint8ClampedArray: /* @__PURE__ */ __name((value) => new global2.Uint8ClampedArray(reviveArrayBuffer(value, global2)), "Uint8ClampedArray"),
    Uint16Array: /* @__PURE__ */ __name((value) => new global2.Uint16Array(reviveArrayBuffer(value, global2)), "Uint16Array"),
    Uint32Array: /* @__PURE__ */ __name((value) => new global2.Uint32Array(reviveArrayBuffer(value, global2)), "Uint32Array")
  };
}
var init_common = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/reducers/common.js"() {
    init_dist2();
    init_hardened();
    __name(arrayBufferToBase64, "arrayBufferToBase64");
    __name(viewToBase64, "viewToBase64");
    __name(reviveArrayBuffer, "reviveArrayBuffer");
    __name(revive, "revive");
    __name(readErrorStack, "readErrorStack");
    __name(reduceErrorBase, "reduceErrorBase");
    __name(reduceNamedErrorSubclassBase, "reduceNamedErrorSubclassBase");
    __name(makeErrorSubclassReducer, "makeErrorSubclassReducer");
    __name(makeErrorSubclassReviver, "makeErrorSubclassReviver");
    __name(getCommonReducers, "getCommonReducers");
    __name(getCommonRevivers, "getCommonRevivers");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/reducers/step-function.js
function getStepFunctionReducer() {
  return {
    StepFunction: /* @__PURE__ */ __name((value) => {
      if (typeof value !== "function") return false;
      const stepId = readProperty(value, "stepId");
      if (typeof stepId !== "string") return false;
      const closureVarsFn = readProperty(value, "__closureVarsFn");
      let closureVars;
      if (typeof closureVarsFn === "function") {
        if (!isUseStepClosureFn(closureVarsFn)) {
          recordGuestCode("method", "__closureVarsFn");
        }
        closureVars = closureVarsFn();
      }
      const hasBoundThis = hasProperty(value, "__boundThis");
      const boundThis = hasBoundThis ? readProperty(value, "__boundThis") : void 0;
      const boundArgs = readProperty(value, "__boundArgs");
      const payload = {
        stepId
      };
      if (closureVars !== void 0) payload.closureVars = closureVars;
      if (hasBoundThis) payload.boundThis = boundThis;
      if (Array.isArray(boundArgs) && boundArgs.length > 0) {
        payload.boundArgs = boundArgs;
      }
      return payload;
    }, "StepFunction")
  };
}
function getStepFunctionReviver(global2 = globalThis) {
  const useStep = global2[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")];
  return {
    StepFunction: /* @__PURE__ */ __name((value) => {
      const stepId = value.stepId;
      const closureVars = value.closureVars;
      if (!useStep) {
        throw new Error("WORKFLOW_USE_STEP not found on global object. Step functions cannot be deserialized outside workflow context.");
      }
      const proxy = closureVars ? useStep(stepId, () => closureVars) : useStep(stepId);
      if ("boundThis" in value) {
        const boundArgs = Array.isArray(value.boundArgs) ? value.boundArgs : [];
        return proxy.bind(value.boundThis, ...boundArgs);
      }
      return proxy;
    }, "StepFunction")
  };
}
var init_step_function = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/reducers/step-function.js"() {
    init_hardened();
    __name(getStepFunctionReducer, "getStepFunctionReducer");
    __name(getStepFunctionReviver, "getStepFunctionReviver");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/types.js
function isFormatPrefix(value) {
  return value.length === 4 && /^[a-z0-9]{4}$/.test(value);
}
var SerializationFormat;
var init_types = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/types.js"() {
    __name(isFormatPrefix, "isFormatPrefix");
    SerializationFormat = {
      /** devalue stringify/parse with TextEncoder/TextDecoder */
      DEVALUE_V1: "devl",
      /** Encrypted payload (inner payload has its own format prefix) */
      ENCRYPTED: "encr",
      /**
       * Sealed payload: asymmetrically encrypted to a run's X25519 public key
       * (inner payload has its own format prefix).
       *
       * Used for *cross-run* writes (hook payloads, forwarded stream frames),
       * where the writer holds only the recipient run's public key and therefore
       * cannot decrypt. A run's own payloads continue to use {@link ENCRYPTED}.
       * See `sealed-box.ts` for the construction.
       */
      SEALED: "encp",
      /** Gzip-compressed payload (inner payload has its own format prefix) */
      GZIP: "gzip",
      /** Zstandard-compressed payload (inner payload has its own format prefix) */
      ZSTD: "zstd"
    };
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/codec-devalue.js
function getReducersForMode(mode, global2 = globalThis, extraReducers) {
  let base;
  switch (mode) {
    case "workflow":
      base = {
        ...getClassReducers(),
        ...getStepFunctionReducer(),
        ...getCommonReducers(global2)
      };
      break;
    case "step":
      base = {
        ...getClassReducers(),
        ...getCommonReducers(global2)
      };
      break;
    case "client":
      base = {
        ...getClassReducers(),
        ...getCommonReducers(global2)
      };
      break;
  }
  if (extraReducers) {
    return {
      ...base,
      ...extraReducers
    };
  }
  return base;
}
function getReviversForMode(mode, global2 = globalThis, extraRevivers) {
  let base;
  switch (mode) {
    case "workflow":
      base = {
        ...getClassRevivers(global2),
        ...getStepFunctionReviver(global2),
        ...getCommonRevivers(global2)
      };
      break;
    case "step":
      base = {
        ...getClassRevivers(global2),
        ...getCommonRevivers(global2)
      };
      break;
    case "client":
      base = {
        ...getClassRevivers(global2),
        ...getCommonRevivers(global2),
        StepFunction: /* @__PURE__ */ __name(() => {
          throw new Error("Step functions cannot be deserialized in client context.");
        }, "StepFunction")
      };
      break;
  }
  if (extraRevivers) {
    return {
      ...base,
      ...extraRevivers
    };
  }
  return base;
}
var encoder, decoder, MAX_SPARSE_ARRAY_LENGTH, parseOptions, devalueCodec;
var init_codec_devalue = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/codec-devalue.js"() {
    init_src();
    init_hardened();
    init_class();
    init_common();
    init_step_function();
    init_types();
    encoder = new TextEncoder();
    decoder = new TextDecoder();
    MAX_SPARSE_ARRAY_LENGTH = 1e5;
    parseOptions = {
      operations: {
        createSparseArray(length) {
          if (length > MAX_SPARSE_ARRAY_LENGTH) {
            throw new RangeError(`Sparse array length ${length} exceeds the maximum of ${MAX_SPARSE_ARRAY_LENGTH}`);
          }
          return default_parse_operations.createSparseArray(length);
        }
      }
    };
    __name(getReducersForMode, "getReducersForMode");
    __name(getReviversForMode, "getReviversForMode");
    devalueCodec = {
      formatPrefix: SerializationFormat.DEVALUE_V1,
      serialize(value, mode, options) {
        const reducers = getReducersForMode(mode, options?.global, options?.extraReducers);
        const str = withGuestCodeStats(options?.guestCodeStats, () => stringify(value, reducers, {
          operations: hardenedStringifyOperations
        }));
        return encoder.encode(str);
      },
      deserialize(data2, mode, options) {
        const revivers = getReviversForMode(mode, options?.global, options?.extraRevivers);
        const str = decoder.decode(data2);
        return parse(str, revivers, parseOptions);
      },
      deserializeLegacy(data2, mode, options) {
        const revivers = getReviversForMode(mode, options?.global, options?.extraRevivers);
        return unflatten(data2, revivers, parseOptions);
      }
    };
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/format.js
function encodeWithFormatPrefix(format, payload) {
  if (!(payload instanceof Uint8Array)) {
    return payload;
  }
  const prefixBytes = formatEncoder.encode(format);
  const result = new Uint8Array(FORMAT_PREFIX_LENGTH + payload.length);
  result.set(prefixBytes, 0);
  result.set(payload, FORMAT_PREFIX_LENGTH);
  return result;
}
function peekFormatPrefix(data2) {
  if (!(data2 instanceof Uint8Array) || data2.length < FORMAT_PREFIX_LENGTH) {
    return null;
  }
  const prefixBytes = data2.subarray(0, FORMAT_PREFIX_LENGTH);
  const str = formatDecoder.decode(prefixBytes);
  return isFormatPrefix(str) ? str : null;
}
function decodeFormatPrefix(data2) {
  if (!(data2 instanceof Uint8Array)) {
    return {
      format: SerializationFormat.DEVALUE_V1,
      payload: new TextEncoder().encode(JSON.stringify(data2))
    };
  }
  if (data2.length < FORMAT_PREFIX_LENGTH) {
    throw new Error(`Data too short to contain format prefix: expected at least ${FORMAT_PREFIX_LENGTH} bytes, got ${data2.length}`);
  }
  const prefixBytes = data2.subarray(0, FORMAT_PREFIX_LENGTH);
  const str = formatDecoder.decode(prefixBytes);
  if (!isFormatPrefix(str)) {
    throw new Error(`Invalid format prefix: "${str}". Must be 4 characters of [a-z0-9].`);
  }
  const payload = data2.subarray(FORMAT_PREFIX_LENGTH);
  return {
    format: str,
    payload
  };
}
var FORMAT_PREFIX_LENGTH, formatEncoder, formatDecoder;
var init_format = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/format.js"() {
    init_types();
    FORMAT_PREFIX_LENGTH = 4;
    formatEncoder = new TextEncoder();
    formatDecoder = new TextDecoder();
    __name(encodeWithFormatPrefix, "encodeWithFormatPrefix");
    __name(peekFormatPrefix, "peekFormatPrefix");
    __name(decodeFormatPrefix, "decodeFormatPrefix");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/compression.js
function isCompressionDisabledByEnv() {
  try {
    return typeof process !== "undefined" && process.env?.WORKFLOW_DISABLE_COMPRESSION === "1";
  } catch {
    return false;
  }
}
function codecOverrideFromEnv() {
  try {
    const v = process.env?.WORKFLOW_COMPRESSION_CODEC;
    return v === "gzip" || v === "zstd" ? v : void 0;
  } catch {
    return void 0;
  }
}
function getNodeZlib() {
  try {
    return globalThis.process?.getBuiltinModule?.("node:zlib");
  } catch {
    return void 0;
  }
}
function isZstdAvailable() {
  const z14 = getNodeZlib();
  return typeof z14?.zstdCompressSync === "function" && typeof z14?.zstdDecompressSync === "function";
}
function isGzipAvailable() {
  return typeof CompressionStream === "function" && typeof DecompressionStream === "function";
}
async function pipeThroughTransform(data2, transform, maxOutputBytes) {
  const writer = transform.writable.getWriter();
  const writePromise = writer.write(data2).then(() => writer.close());
  writePromise.catch(() => {
  });
  const chunks = [];
  let total = 0;
  const reader = transform.readable.getReader();
  for (; ; ) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
    if (maxOutputBytes !== void 0 && total > maxOutputBytes) {
      await reader.cancel().catch(() => {
      });
      throw new DecompressedSizeLimitError(maxOutputBytes);
    }
  }
  await writePromise;
  const out = new Uint8Array(total);
  let offset2 = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset2);
    offset2 += chunk.length;
  }
  return out;
}
async function gzipBytes(data2) {
  return pipeThroughTransform(data2, new CompressionStream("gzip"));
}
async function gunzipBytes(data2, maxOutputBytes) {
  return pipeThroughTransform(data2, new DecompressionStream("gzip"), maxOutputBytes);
}
function zstdOpts(z14) {
  const level = z14?.constants?.ZSTD_c_compressionLevel;
  return level !== void 0 ? {
    params: {
      [level]: ZSTD_LEVEL
    }
  } : void 0;
}
function zstdBytes(data2) {
  const z14 = getNodeZlib();
  return new Uint8Array(z14.zstdCompressSync(data2, zstdOpts(z14)));
}
function zstdBytesAsync(data2) {
  const z14 = getNodeZlib();
  if (typeof z14?.zstdCompress !== "function") {
    return Promise.resolve(zstdBytes(data2));
  }
  return new Promise((resolve, reject) => {
    z14.zstdCompress(data2, zstdOpts(z14), (err, result) => {
      if (err) reject(err);
      else resolve(new Uint8Array(result));
    });
  });
}
function unzstdBytes(data2, maxOutputBytes) {
  const z14 = getNodeZlib();
  if (!z14?.zstdDecompressSync) {
    throw new Error("Compressed (zstd) workflow data encountered but node:zlib zstd support is not available in this runtime (requires Node.js 22.15+). In the browser, register a zstd decoder via registerZstdDecoder (serialization-format.ts).");
  }
  if (maxOutputBytes === void 0) {
    return new Uint8Array(z14.zstdDecompressSync(data2));
  }
  try {
    return new Uint8Array(z14.zstdDecompressSync(data2, {
      maxOutputLength: maxOutputBytes
    }));
  } catch (err) {
    if (err?.code === "ERR_BUFFER_TOO_LARGE") {
      throw new DecompressedSizeLimitError(maxOutputBytes);
    }
    throw err;
  }
}
function recordStats(stats, codec, uncompressedBytes, storedBytes) {
  if (!stats) return;
  stats.recorded = true;
  stats.compressed = codec !== "none";
  stats.codec = codec;
  stats.uncompressedBytes = uncompressedBytes;
  stats.storedBytes = storedBytes;
}
function selectWriteCodec(mode) {
  const override = codecOverrideFromEnv();
  if (mode === "gzip" || override === "gzip") {
    return isGzipAvailable() ? "gzip" : "none";
  }
  if (isZstdAvailable()) return "zstd";
  if (isGzipAvailable()) return "gzip";
  return "none";
}
async function compress(data2, mode, stats, opts) {
  if (!(data2 instanceof Uint8Array)) return data2;
  if (!mode || data2.length < COMPRESSION_MIN_BYTES || isCompressionDisabledByEnv()) {
    recordStats(stats, "none", data2.length, data2.length);
    return data2;
  }
  const codec = selectWriteCodec(mode);
  if (codec === "none") {
    recordStats(stats, "none", data2.length, data2.length);
    return data2;
  }
  const compressed = codec === "zstd" ? opts?.preferAsync && data2.length >= COMPRESSION_ASYNC_MIN_BYTES ? await zstdBytesAsync(data2) : zstdBytes(data2) : await gzipBytes(data2);
  const format = codec === "zstd" ? SerializationFormat.ZSTD : SerializationFormat.GZIP;
  const wrappedLength = 4 + compressed.length;
  if (wrappedLength >= data2.length * (1 - COMPRESSION_MIN_SAVINGS_RATIO)) {
    recordStats(stats, "none", data2.length, data2.length);
    return data2;
  }
  recordStats(stats, codec, data2.length, wrappedLength);
  return encodeWithFormatPrefix(format, compressed);
}
async function decompress(data2, stats, opts) {
  if (!(data2 instanceof Uint8Array)) return data2;
  const prefix = peekFormatPrefix(data2);
  if (prefix === SerializationFormat.ZSTD) {
    const { payload } = decodeFormatPrefix(data2);
    const inflated = unzstdBytes(payload, opts?.maxOutputBytes);
    recordStats(stats, "zstd", inflated.length, data2.length);
    return inflated;
  }
  if (prefix === SerializationFormat.GZIP) {
    if (!isGzipAvailable()) {
      throw new Error("Compressed (gzip) workflow data encountered but DecompressionStream is not available in this runtime. Node.js 18+, browsers, and edge runtimes all support it.");
    }
    const { payload } = decodeFormatPrefix(data2);
    const inflated = await gunzipBytes(payload, opts?.maxOutputBytes);
    recordStats(stats, "gzip", inflated.length, data2.length);
    return inflated;
  }
  recordStats(stats, "none", data2.length, data2.length);
  return data2;
}
var COMPRESSION_MIN_BYTES, COMPRESSION_MIN_SAVINGS_RATIO, COMPRESSION_ASYNC_MIN_BYTES, ZSTD_LEVEL, DecompressedSizeLimitError;
var init_compression = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/compression.js"() {
    init_format();
    init_types();
    COMPRESSION_MIN_BYTES = 1024;
    COMPRESSION_MIN_SAVINGS_RATIO = 0.05;
    COMPRESSION_ASYNC_MIN_BYTES = 256 * 1024;
    ZSTD_LEVEL = 3;
    __name(isCompressionDisabledByEnv, "isCompressionDisabledByEnv");
    __name(codecOverrideFromEnv, "codecOverrideFromEnv");
    __name(getNodeZlib, "getNodeZlib");
    __name(isZstdAvailable, "isZstdAvailable");
    __name(isGzipAvailable, "isGzipAvailable");
    __name(pipeThroughTransform, "pipeThroughTransform");
    __name(gzipBytes, "gzipBytes");
    __name(gunzipBytes, "gunzipBytes");
    DecompressedSizeLimitError = class extends Error {
      static {
        __name(this, "DecompressedSizeLimitError");
      }
      maxOutputBytes;
      constructor(maxOutputBytes) {
        super(`Decompressed payload exceeds ${maxOutputBytes} bytes`);
        this.maxOutputBytes = maxOutputBytes;
        this.name = "DecompressedSizeLimitError";
      }
    };
    __name(zstdOpts, "zstdOpts");
    __name(zstdBytes, "zstdBytes");
    __name(zstdBytesAsync, "zstdBytesAsync");
    __name(unzstdBytes, "unzstdBytes");
    __name(recordStats, "recordStats");
    __name(selectWriteCodec, "selectWriteCodec");
    __name(compress, "compress");
    __name(decompress, "decompress");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/encryption.js
function sealTo(recipientPublicKey, aad) {
  return {
    [SEAL_TARGET_BRAND]: true,
    recipientPublicKey,
    aad
  };
}
function runPayloadKeys(aes, keyPair, aad) {
  return {
    [RUN_KEYS_BRAND]: true,
    aes,
    keyPair,
    aad
  };
}
async function deriveRunPayloadKeys(runKeyMaterial) {
  const [aes, keyPair] = await Promise.all([
    importKey(runKeyMaterial),
    deriveRunKeyPair(runKeyMaterial)
  ]);
  return runPayloadKeys(aes, keyPair);
}
function isSealTarget(value) {
  return typeof value === "object" && value !== null && value[SEAL_TARGET_BRAND] === true;
}
function isRunPayloadKeys(value) {
  return typeof value === "object" && value !== null && value[RUN_KEYS_BRAND] === true;
}
function aesKeyOf(key) {
  if (!key) return void 0;
  if (isRunPayloadKeys(key)) return key.aes;
  if (isSealTarget(key)) return void 0;
  return key;
}
async function resolveEncryptionKey(key) {
  return typeof key === "function" ? key() : key;
}
async function encrypt2(data2, key) {
  if (!key || !(data2 instanceof Uint8Array)) return data2;
  if (isSealTarget(key)) {
    const sealed = await seal(key.recipientPublicKey, data2, key.aad);
    return encodeWithFormatPrefix(SerializationFormat.SEALED, sealed);
  }
  const aesKey = isRunPayloadKeys(key) ? key.aes : key;
  const encrypted = await encrypt(aesKey, data2);
  return encodeWithFormatPrefix(SerializationFormat.ENCRYPTED, encrypted);
}
async function openSealedEnvelope(data2, key) {
  if (!isRunPayloadKeys(key)) {
    throw new RuntimeDecryptionError("Sealed data encountered but no run keypair is available. Opening a sealed payload requires the run's own encryption key material; a symmetric key or a seal-only target cannot decrypt it.", {
      context: {
        operation: "decrypt",
        byteLength: data2.byteLength,
        formatPrefix: "encp"
      }
    });
  }
  const { payload } = decodeFormatPrefix(data2);
  try {
    return await open(key.keyPair, payload, key.aad);
  } catch (error) {
    if (RuntimeDecryptionError.is(error) && error.context) {
      error.context.formatPrefix = SerializationFormat.SEALED;
    }
    throw error;
  }
}
async function decrypt2(data2, key) {
  if (!(data2 instanceof Uint8Array)) return data2;
  const format = peekFormatPrefix(data2);
  if (format === SerializationFormat.SEALED) {
    return openSealedEnvelope(data2, key);
  }
  if (format !== SerializationFormat.ENCRYPTED) return data2;
  const aesKey = aesKeyOf(key);
  if (!aesKey) {
    throw new RuntimeDecryptionError("Encrypted data encountered but no encryption key is available. Encryption is not configured or no key was provided for this run.", {
      context: {
        operation: "decrypt",
        byteLength: data2.byteLength,
        formatPrefix: "encr"
      }
    });
  }
  const { payload } = decodeFormatPrefix(data2);
  try {
    return await decrypt(aesKey, payload);
  } catch (error) {
    if (RuntimeDecryptionError.is(error) && error.context) {
      error.context.formatPrefix = format;
    }
    throw error;
  }
}
var SEAL_TARGET_BRAND, RUN_KEYS_BRAND;
var init_encryption2 = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/encryption.js"() {
    init_dist2();
    init_encryption();
    init_sealed_box();
    init_format();
    init_types();
    SEAL_TARGET_BRAND = /* @__PURE__ */ Symbol.for("workflow.serialization.sealTarget");
    RUN_KEYS_BRAND = /* @__PURE__ */ Symbol.for("workflow.serialization.runKeys");
    __name(sealTo, "sealTo");
    __name(runPayloadKeys, "runPayloadKeys");
    __name(deriveRunPayloadKeys, "deriveRunPayloadKeys");
    __name(isSealTarget, "isSealTarget");
    __name(isRunPayloadKeys, "isRunPayloadKeys");
    __name(aesKeyOf, "aesKeyOf");
    __name(resolveEncryptionKey, "resolveEncryptionKey");
    __name(encrypt2, "encrypt");
    __name(openSealedEnvelope, "openSealedEnvelope");
    __name(decrypt2, "decrypt");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/log-format.js
function composeLogLine(prefix, message, metadata) {
  const [framing, ...rest] = message.split("\n");
  const embeddedBody = rest.join("\n");
  const body = embeddedBody.trim() ? embeddedBody : pickString(metadata ?? {}, "errorStack") ?? "";
  const fields = renderStructuredFields(framing ?? "", body, metadata);
  const trimmedBody = trimStackBody(body);
  const lines = [
    `${prefix} ${framing ?? ""}`
  ];
  if (fields) lines.push(fields);
  if (trimmedBody) lines.push(trimmedBody);
  return lines.join("\n");
}
function renderStructuredFields(framing, body, metadata) {
  if (!metadata || Object.keys(metadata).length === 0) return null;
  const redundant = /* @__PURE__ */ new Set();
  redundant.add("errorStack");
  const errorMessage = pickString(metadata, "errorMessage");
  if (errorMessage && (framing.includes(errorMessage) || body.includes(errorMessage))) {
    redundant.add("errorMessage");
  }
  const wellKnown = /* @__PURE__ */ new Set([
    "workflowRunId",
    "workflowName",
    "stepId",
    "stepName",
    "errorAttribution",
    "errorCode",
    "errorName",
    "errorMessage",
    "errorStack",
    "errorCause",
    "hint",
    "attempt",
    "retryCount"
  ]);
  const lines = [];
  const errorName = pickString(metadata, "errorName");
  const attribution = pickString(metadata, "errorAttribution");
  const nameEchoedByStack = errorName !== null && stackHeaderNames(body, errorName);
  if (attribution || errorName && !nameEchoedByStack) {
    const badge = attribution ? attribution === "sdk" ? magenta("sdk error") : red("user error") : "";
    const cls = errorName ? bold(errorName) : "";
    const sep = badge && cls ? dim(" \xB7 ") : "";
    lines.push(`  ${badge}${sep}${cls}`);
  }
  const runId = pickString(metadata, "workflowRunId");
  const wfName = pickString(metadata, "workflowName");
  if (runId) {
    lines.push(formatIdRow("run", runId, wfName, formatWorkflowName));
  } else if (wfName) {
    lines.push(formatIdRow("run", null, wfName, formatWorkflowName));
  }
  const stepId = pickString(metadata, "stepId");
  const stepName = pickString(metadata, "stepName");
  if (stepId || stepName) {
    lines.push(formatIdRow("step", stepId, stepName, formatStepName));
  }
  if (metadata.attempt !== void 0 || metadata.retryCount !== void 0) {
    const a = metadata.attempt;
    const r = metadata.retryCount;
    if (a !== void 0 && r !== void 0) {
      lines.push(`  ${kvKey("retry")} ${a} ${dim("attempts \xB7")} ${r} ${dim("max retries")}`);
    } else if (a !== void 0) {
      lines.push(`  ${kvKey("retry")} ${a} ${dim("attempts")}`);
    }
  }
  const errorCode = pickString(metadata, "errorCode");
  if (errorCode && errorCode !== errorName) {
    lines.push(`  ${kvKey("code")} ${dim(errorCode)}`);
  }
  if (errorMessage && !redundant.has("errorMessage")) {
    lines.push(`  ${kvKey("error")} ${formatPassthroughValue(errorMessage)}`);
  }
  const errorCause = pickString(metadata, "errorCause");
  if (errorCause && !body.includes(errorCause)) {
    lines.push(`  ${kvKey("cause")} ${formatPassthroughValue(errorCause)}`);
  }
  const hint2 = pickString(metadata, "hint");
  if (hint2) {
    lines.push(`  ${hint(hint2)}`);
  }
  const passThrough = Object.entries(metadata).filter(([k, v]) => !wellKnown.has(k) && !redundant.has(k) && v !== void 0 && v !== null).sort(([a], [b]) => a.localeCompare(b));
  for (const [k, v] of passThrough) {
    lines.push(`  ${kvKey(k)} ${formatPassthroughValue(v)}`);
  }
  return lines.length ? lines.join("\n") : null;
}
function trimStackBody(body) {
  if (!body) return null;
  const lines = body.split("\n");
  const out = [];
  let droppedRun = 0;
  let visibleFrameCount = 0;
  let cappedFrames = 0;
  const flushDropped = /* @__PURE__ */ __name(() => {
    if (droppedRun > 0) {
      out.push(dim(`        \u2026 ${droppedRun} more ${droppedRun === 1 ? "frame" : "frames"} in framework internals`));
      droppedRun = 0;
    }
  }, "flushDropped");
  for (const line of lines) {
    const isFrame = line.trimStart().startsWith("at ");
    if (isFrame && isFrameworkFrame(line)) {
      droppedRun++;
      continue;
    }
    if (isFrame && visibleFrameCount >= MAX_VISIBLE_FRAMES) {
      cappedFrames++;
      continue;
    }
    flushDropped();
    out.push(line);
    if (isFrame) visibleFrameCount++;
  }
  flushDropped();
  if (cappedFrames > 0) {
    out.push(dim(`        \u2026 ${cappedFrames} more ${cappedFrames === 1 ? "frame" : "frames"} (run \`pnpm wf inspect run <id>\` for the full stack)`));
  }
  return out.join("\n");
}
function isFrameworkFrame(line) {
  const trimmed = line.trimStart();
  if (!trimmed.startsWith("at ")) return false;
  if (trimmed.includes("node:internal/")) return true;
  if (trimmed.includes("node_modules/.pnpm/")) return true;
  if (trimmed.includes("node_modules__pnpm_")) return true;
  if (trimmed.includes("_next_dist_")) return true;
  if (trimmed.includes("node_modules/next/") || trimmed.includes("node_modules/@opentelemetry/") || trimmed.includes("node_modules/vitest/") || trimmed.includes("node_modules/@vitest/")) {
    return true;
  }
  return false;
}
function stackHeaderNames(body, errorName) {
  const header = body.split("\n", 1)[0]?.trim() ?? "";
  return header === errorName || header.startsWith(`${errorName}:`);
}
function pickString(metadata, key) {
  const v = metadata[key];
  return typeof v === "string" && v.length > 0 ? v : null;
}
function kvKey(key) {
  return dim(key.padEnd(6));
}
function formatIdRow(label, id, name, formatName) {
  const idCell = id ? id : dim("\u2014");
  const parsed = name ? label === "run" ? parseWorkflowName(name) : parseStepName(name) : null;
  const nameCell = parsed ? `${dim("\xB7")} ${formatName(name)}` : "";
  return `  ${kvKey(label)} ${idCell}${nameCell ? " " + nameCell : ""}`;
}
function formatPassthroughValue(v) {
  if (typeof v === "string") {
    if (v.includes("\n")) {
      return v.split("\n").map((line, i2) => i2 === 0 ? line : `         ${line}`).join("\n");
    }
    return v;
  }
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}
var MAX_VISIBLE_FRAMES;
var init_log_format = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/log-format.js"() {
    init_ansi();
    init_dist();
    __name(composeLogLine, "composeLogLine");
    __name(renderStructuredFields, "renderStructuredFields");
    MAX_VISIBLE_FRAMES = 6;
    __name(trimStackBody, "trimStackBody");
    __name(isFrameworkFrame, "isFrameworkFrame");
    __name(stackHeaderNames, "stackHeaderNames");
    __name(pickString, "pickString");
    __name(kvKey, "kvKey");
    __name(formatIdRow, "formatIdRow");
    __name(formatPassthroughValue, "formatPassthroughValue");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/telemetry/semantic-conventions.js
function SemanticConvention(...names) {
  return (value) => Object.fromEntries(names.map((name) => [
    name,
    value
  ]));
}
var WorkflowName, WorkflowOperation, WorkflowRunId, WorkflowRunStatus, WorkflowStartedAt, WorkflowEventsCount, WorkflowExecutionMode, WorkflowDynamic, WorkflowDynamicSourceHash, WorkflowDynamicCodeBytes, WorkflowDynamicCodeStorage, WorkflowBundleCompileCacheHit, WorkflowReplayLoadSource, WorkflowParkedEventsCount, WorkflowParkedEventId, WorkflowParkedEventType, WorkflowArgumentsCount, WorkflowResultType, WorkflowTracePropagated, WorkflowVm, QuickJSOutcome, QuickJSEventsPreloaded, QuickJSEventsFetchedCount, QuickJSEventsFetchedPages, QuickJSPendingOpsCount, QuickJSInlineSteps, QuickJSSnapshotRestored, QuickJSSnapshotDeltaEvents, QuickJSSnapshotRestoreMs, QuickJSSnapshotFallbackReason, QuickJSSnapshotSaveMs, QuickJSSnapshotPlaintextBytes, QuickJSSnapshotStoredBytes, WorkflowTraceMode, WorkflowTurbo, WorkflowErrorName, WorkflowErrorMessage, WorkflowErrorCode, WorkflowStepsCreated, WorkflowHooksCreated, WorkflowWaitsCreated, WorkflowStepsFailedSerialization, WorkflowOwnedRecoverySteps, WorkflowBackstopWakesArmed, WorkflowDispatchRepublishSkipped, WorkflowRouteType, WorkflowRouteHandlerCached, WorkflowRouteInvocationCount, WorkflowRouteEntrypointAgeMs, WorkflowRouteModuleBodyInitMs, FaasInstance, StepName, StepId, StepAttempt, StepStatus, StepMaxRetries, StepTracePropagated, StepTtfsMs, StepStsoMs, StepRsfsMs, StepFinalSchedulingReplayMs, StepLatencyOptimizations, StepStartStrategy, StepSkipped, StepSkipReason, StepArgumentsCount, StepResultType, StepErrorName, StepErrorMessage, StepFatalError, StepRetryExhausted, StepRetryTimeoutSeconds, StepRetryWillRetry, MessagingSystem, MessagingDestinationName, MessagingMessageId, MessagingOperationType, MessagingBatchMessageCount, QueueOverheadMs, DeploymentId, WorkflowRunPinnedDeploymentId, WorkflowDeploymentMismatchRetryCount, WorkflowDeploymentMismatchRecovered, WorkflowRunSpecVersion, WorkflowRunSpecVersionSource, WorkflowCapabilityProbeLatencyMs, WorkflowCapabilityProbeCached, WorkflowCapabilityProbeError, HookToken, HookId, HookFound, HookResilientResume, HookResumeCommitted, HookWakePublished, HookResilientResumeMaterialized, HookResumeSetupSource, StepDispatchPrologue, ResumeTotalMs, ResumeProducerPrepMs, ResumeQueueDeliveryMs, ResumeSetupMs, ResumeReplayMs, ResumeStepDispatchMs, ResumeStepClaimMs, ResumeStepPrepareMs, ResumeTrigger, ResumeStrategy, ResumeSetupSource, ResumeStepExecution, WebhookHandlersTriggered, WorkflowSuspensionState, WorkflowSuspensionHookCount, WorkflowSuspensionStepCount, WorkflowSuspensionWaitCount, HttpRequestMethod, HttpRoute, UrlFull, ServerAddress, ServerPort, HttpResponseStatusCode, ErrorType, WorldParseFormat, WorkflowEventsPagesLoaded, QueueDeserializeTimeMs, QueueExecutionTimeMs, QueueSerializeTimeMs, SerializationOperation, SerializationCompressed, SerializationCodec, SerializationUncompressedBytes, SerializationStoredBytes, SerializationCompressionRatio, SerializationGuestCodeExecutions, SerializationGuestCodeDetails, PeerService, RpcSystem, RpcService, RpcMethod, ErrorRetryable, ErrorCategory;
var init_semantic_conventions = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/telemetry/semantic-conventions.js"() {
    __name(SemanticConvention, "SemanticConvention");
    WorkflowName = SemanticConvention("workflow.name");
    WorkflowOperation = SemanticConvention("workflow.operation");
    WorkflowRunId = SemanticConvention("workflow.run.id");
    WorkflowRunStatus = SemanticConvention("workflow.run.status");
    WorkflowStartedAt = SemanticConvention("workflow.started_at");
    WorkflowEventsCount = SemanticConvention("workflow.events.count");
    WorkflowExecutionMode = SemanticConvention("workflow.execution.mode");
    WorkflowDynamic = SemanticConvention("workflow.dynamic");
    WorkflowDynamicSourceHash = SemanticConvention("workflow.dynamic.source_hash");
    WorkflowDynamicCodeBytes = SemanticConvention("workflow.dynamic.code_bytes");
    WorkflowDynamicCodeStorage = SemanticConvention("workflow.dynamic.code_storage");
    WorkflowBundleCompileCacheHit = SemanticConvention("workflow.bundle.compile.cache_hit");
    WorkflowReplayLoadSource = SemanticConvention("workflow.replay.load.source");
    WorkflowParkedEventsCount = SemanticConvention("workflow.events.parked.count");
    WorkflowParkedEventId = SemanticConvention("workflow.events.parked.event_id");
    WorkflowParkedEventType = SemanticConvention("workflow.events.parked.event_type");
    WorkflowArgumentsCount = SemanticConvention("workflow.arguments.count");
    WorkflowResultType = SemanticConvention("workflow.result.type");
    WorkflowTracePropagated = SemanticConvention("workflow.trace.propagated");
    WorkflowVm = SemanticConvention("workflow.vm");
    QuickJSOutcome = SemanticConvention("workflow.vm.outcome");
    QuickJSEventsPreloaded = SemanticConvention("workflow.vm.events.preloaded");
    QuickJSEventsFetchedCount = SemanticConvention("workflow.vm.events.fetched_count");
    QuickJSEventsFetchedPages = SemanticConvention("workflow.vm.events.fetched_pages");
    QuickJSPendingOpsCount = SemanticConvention("workflow.vm.pending_ops_count");
    QuickJSInlineSteps = SemanticConvention("quickjs.inline_steps");
    QuickJSSnapshotRestored = SemanticConvention("workflow.quickjs.snapshot.restored");
    QuickJSSnapshotDeltaEvents = SemanticConvention("workflow.quickjs.snapshot.delta_events");
    QuickJSSnapshotRestoreMs = SemanticConvention("workflow.quickjs.snapshot.restore_ms");
    QuickJSSnapshotFallbackReason = SemanticConvention("workflow.quickjs.snapshot.fallback_reason");
    QuickJSSnapshotSaveMs = SemanticConvention("workflow.quickjs.snapshot.save_ms");
    QuickJSSnapshotPlaintextBytes = SemanticConvention("workflow.quickjs.snapshot.plaintext_bytes");
    QuickJSSnapshotStoredBytes = SemanticConvention("workflow.quickjs.snapshot.stored_bytes");
    WorkflowTraceMode = SemanticConvention("workflow.trace.mode");
    WorkflowTurbo = SemanticConvention("workflow.turbo");
    WorkflowErrorName = SemanticConvention("workflow.error.name");
    WorkflowErrorMessage = SemanticConvention("workflow.error.message");
    WorkflowErrorCode = SemanticConvention("workflow.error.code");
    WorkflowStepsCreated = SemanticConvention("workflow.steps.created");
    WorkflowHooksCreated = SemanticConvention("workflow.hooks.created");
    WorkflowWaitsCreated = SemanticConvention("workflow.waits.created");
    WorkflowStepsFailedSerialization = SemanticConvention("workflow.steps.failed_serialization");
    WorkflowOwnedRecoverySteps = SemanticConvention("workflow.inline_ownership.owned_recovery_steps");
    WorkflowBackstopWakesArmed = SemanticConvention("workflow.inline_ownership.backstop_wakes_armed");
    WorkflowDispatchRepublishSkipped = SemanticConvention("workflow.dispatch.republish_skipped");
    WorkflowRouteType = SemanticConvention("workflow.route.type");
    WorkflowRouteHandlerCached = SemanticConvention("workflow.route.handler_cached");
    WorkflowRouteInvocationCount = SemanticConvention("workflow.route.invocation_count");
    WorkflowRouteEntrypointAgeMs = SemanticConvention("workflow.route.entrypoint_age_ms");
    WorkflowRouteModuleBodyInitMs = SemanticConvention("workflow.route.module_body_init_ms");
    FaasInstance = SemanticConvention("faas.instance");
    StepName = SemanticConvention("step.name");
    StepId = SemanticConvention("step.id");
    StepAttempt = SemanticConvention("step.attempt");
    StepStatus = SemanticConvention("step.status");
    StepMaxRetries = SemanticConvention("step.max_retries");
    StepTracePropagated = SemanticConvention("step.trace.propagated");
    StepTtfsMs = SemanticConvention("step.ttfs_ms");
    StepStsoMs = SemanticConvention("step.stso_ms");
    StepRsfsMs = SemanticConvention("step.rsfs_ms");
    StepFinalSchedulingReplayMs = SemanticConvention("step.final_scheduling_replay_ms");
    StepLatencyOptimizations = SemanticConvention("step.latency_optimizations");
    StepStartStrategy = SemanticConvention("workflow.step_start.strategy");
    StepSkipped = SemanticConvention("step.skipped");
    StepSkipReason = SemanticConvention("step.skip_reason");
    StepArgumentsCount = SemanticConvention("step.arguments.count");
    StepResultType = SemanticConvention("step.result.type");
    StepErrorName = SemanticConvention("step.error.name");
    StepErrorMessage = SemanticConvention("step.error.message");
    StepFatalError = SemanticConvention("step.fatal_error");
    StepRetryExhausted = SemanticConvention("step.retry.exhausted");
    StepRetryTimeoutSeconds = SemanticConvention("step.retry.timeout_seconds");
    StepRetryWillRetry = SemanticConvention("step.retry.will_retry");
    MessagingSystem = SemanticConvention("messaging.system");
    MessagingDestinationName = SemanticConvention("messaging.destination.name");
    MessagingMessageId = SemanticConvention("messaging.message.id");
    MessagingOperationType = SemanticConvention("messaging.operation.type");
    MessagingBatchMessageCount = SemanticConvention("messaging.batch.message_count");
    QueueOverheadMs = SemanticConvention("workflow.queue.overhead_ms");
    DeploymentId = SemanticConvention("deployment.id");
    WorkflowRunPinnedDeploymentId = SemanticConvention("workflow.deployment.pinned_id");
    WorkflowDeploymentMismatchRetryCount = SemanticConvention("workflow.deployment_mismatch.retry_count");
    WorkflowDeploymentMismatchRecovered = SemanticConvention("workflow.deployment_mismatch.recovered");
    WorkflowRunSpecVersion = SemanticConvention("workflow.run.spec_version");
    WorkflowRunSpecVersionSource = SemanticConvention("workflow.run.spec_version_source");
    WorkflowCapabilityProbeLatencyMs = SemanticConvention("workflow.capability_probe.latency_ms");
    WorkflowCapabilityProbeCached = SemanticConvention("workflow.capability_probe.cached");
    WorkflowCapabilityProbeError = SemanticConvention("workflow.capability_probe.error");
    HookToken = SemanticConvention("workflow.hook.token");
    HookId = SemanticConvention("workflow.hook.id");
    HookFound = SemanticConvention("workflow.hook.found");
    HookResilientResume = SemanticConvention("workflow.hook.resilient_resume");
    HookResumeCommitted = SemanticConvention("workflow.hook.resume_committed");
    HookWakePublished = SemanticConvention("workflow.hook.wake_published");
    HookResilientResumeMaterialized = SemanticConvention("workflow.hook.resilient_resume_materialized");
    HookResumeSetupSource = SemanticConvention("workflow.resume_setup_source");
    StepDispatchPrologue = SemanticConvention("workflow.step.dispatch_prologue");
    ResumeTotalMs = SemanticConvention("workflow.resume.total_ms");
    ResumeProducerPrepMs = SemanticConvention("workflow.resume.phase.producer_prep_ms");
    ResumeQueueDeliveryMs = SemanticConvention("workflow.resume.phase.queue_delivery_ms");
    ResumeSetupMs = SemanticConvention("workflow.resume.phase.resume_setup_ms");
    ResumeReplayMs = SemanticConvention("workflow.resume.phase.replay_ms");
    ResumeStepDispatchMs = SemanticConvention("workflow.resume.phase.step_dispatch_ms");
    ResumeStepClaimMs = SemanticConvention("workflow.resume.phase.step_claim_ms");
    ResumeStepPrepareMs = SemanticConvention("workflow.resume.phase.step_prepare_ms");
    ResumeTrigger = SemanticConvention("workflow.resume.trigger");
    ResumeStrategy = SemanticConvention("workflow.resume.strategy");
    ResumeSetupSource = SemanticConvention("workflow.resume.setup_source");
    ResumeStepExecution = SemanticConvention("workflow.resume.step_execution");
    WebhookHandlersTriggered = SemanticConvention("webhook.handlers.triggered");
    WorkflowSuspensionState = SemanticConvention("workflow.suspension.state");
    WorkflowSuspensionHookCount = SemanticConvention("workflow.suspension.hook_count");
    WorkflowSuspensionStepCount = SemanticConvention("workflow.suspension.step_count");
    WorkflowSuspensionWaitCount = SemanticConvention("workflow.suspension.wait_count");
    HttpRequestMethod = SemanticConvention("http.request.method");
    HttpRoute = SemanticConvention("http.route");
    UrlFull = SemanticConvention("url.full");
    ServerAddress = SemanticConvention("server.address");
    ServerPort = SemanticConvention("server.port");
    HttpResponseStatusCode = SemanticConvention("http.response.status_code");
    ErrorType = SemanticConvention("error.type");
    WorldParseFormat = SemanticConvention("workflow.world.parse.format");
    WorkflowEventsPagesLoaded = SemanticConvention("workflow.events.pages_loaded");
    QueueDeserializeTimeMs = SemanticConvention("workflow.queue.deserialize_time_ms");
    QueueExecutionTimeMs = SemanticConvention("workflow.queue.execution_time_ms");
    QueueSerializeTimeMs = SemanticConvention("workflow.queue.serialize_time_ms");
    SerializationOperation = SemanticConvention("workflow.serialization.operation");
    SerializationCompressed = SemanticConvention("workflow.serialization.compressed");
    SerializationCodec = SemanticConvention("workflow.serialization.codec");
    SerializationUncompressedBytes = SemanticConvention("workflow.serialization.uncompressed_bytes");
    SerializationStoredBytes = SemanticConvention("workflow.serialization.stored_bytes");
    SerializationCompressionRatio = SemanticConvention("workflow.serialization.compression_ratio");
    SerializationGuestCodeExecutions = SemanticConvention("workflow.serialization.guest_code_executions");
    SerializationGuestCodeDetails = SemanticConvention("workflow.serialization.guest_code_details");
    PeerService = SemanticConvention("peer.service");
    RpcSystem = SemanticConvention("rpc.system");
    RpcService = SemanticConvention("rpc.service");
    RpcMethod = SemanticConvention("rpc.method");
    ErrorRetryable = SemanticConvention("error.retryable");
    ErrorCategory = SemanticConvention("error.category");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/telemetry.js
async function serializeTraceCarrier() {
  const otel = await OtelApi.value;
  if (!otel) return {};
  const carrier = {};
  otel.propagation.inject(otel.context.active(), carrier);
  return carrier;
}
async function deserializeTraceCarrier(traceCarrier) {
  const otel = await OtelApi.value;
  if (!otel) return;
  return otel.propagation.extract(otel.context.active(), traceCarrier);
}
function describeThrownValue(value) {
  try {
    if (typeof value === "object" && value !== null && "message" in value && typeof value.message === "string") {
      return value.message;
    }
    return String(value);
  } catch {
    return "Unknown error";
  }
}
function logOtelDiagnosticOnce(otel, tracer) {
  const debugEnabled = typeof process !== "undefined" && typeof process.env.DEBUG === "string" && (process.env.DEBUG.includes("workflow:") || process.env.DEBUG === "*");
  if (otelDiagLogged || !debugEnabled) return;
  otelDiagLogged = true;
  try {
    const g = globalThis[/* @__PURE__ */ Symbol.for("opentelemetry.js.api.1")];
    const provider = otel.trace.getTracerProvider();
    const delegate = provider.getDelegate?.() ?? provider;
    const probe = tracer.startSpan("workflow.otel.probe.core");
    console.warn("[workflow:otel-diag] core", JSON.stringify({
      globalRegistrationVersion: g?.version ?? null,
      providerCtor: provider?.constructor?.name ?? null,
      delegateCtor: delegate?.constructor?.name ?? null,
      tracerCtor: tracer?.constructor?.name ?? null,
      probeCtor: probe?.constructor?.name ?? null,
      probeRecording: probe.isRecording()
    }));
    probe.end();
  } catch (error) {
    console.warn("[workflow:otel-diag] core failed:", error instanceof Error ? error.message : error);
  }
}
async function trace(spanName, ...args) {
  const [tracer, otel] = await Promise.all([
    Tracer.value,
    OtelApi.value
  ]);
  const { fn, opts } = typeof args[0] === "function" ? {
    fn: args[0],
    opts: {}
  } : {
    fn: args[1],
    opts: args[0]
  };
  if (!fn) throw new Error("Function to trace must be provided");
  if (!tracer || !otel) {
    return await fn();
  }
  return tracer.startActiveSpan(spanName, opts, async (span) => {
    try {
      const result = await fn(span);
      span.setStatus({
        code: otel.SpanStatusCode.OK
      });
      return result;
    } catch (e) {
      if (WorkflowSuspension.is(e)) {
        span.setStatus({
          code: otel.SpanStatusCode.OK
        });
        applyWorkflowSuspensionToSpan(e, span);
      } else {
        span.setStatus({
          code: otel.SpanStatusCode.ERROR,
          message: describeThrownValue(e)
        });
      }
      throw e;
    } finally {
      span.end();
    }
  });
}
async function recordElapsedSpan(spanName, startEpochMs, opts) {
  const tracer = await Tracer.value;
  if (!tracer) return;
  tracer.startSpan(spanName, {
    ...opts,
    startTime: startEpochMs
  }).end();
}
function applyWorkflowSuspensionToSpan(error, span) {
  span.setAttributes({
    ...WorkflowSuspensionState("suspended"),
    ...WorkflowSuspensionStepCount(error.stepCount),
    ...WorkflowSuspensionHookCount(error.hookCount),
    ...WorkflowSuspensionWaitCount(error.waitCount)
  });
}
async function getSpanContextForTraceCarrier(carrier) {
  const [deserialized, otel] = await Promise.all([
    deserializeTraceCarrier(carrier),
    OtelApi.value
  ]);
  if (!deserialized || !otel) return;
  return otel.trace.getSpanContext(deserialized);
}
async function getActiveSpan() {
  return await withOtel((otel) => otel.trace.getActiveSpan());
}
async function getSpanKind(field) {
  return withOtel((x) => x.SpanKind[field]);
}
async function withOtel(fn) {
  const otel = await OtelApi.value;
  if (!otel) return void 0;
  return await fn(otel);
}
async function linkToTraceCarrier(carrier) {
  if (!carrier) return;
  const [context, otel] = await Promise.all([
    getSpanContextForTraceCarrier(carrier),
    OtelApi.value
  ]);
  if (!context || !otel) return;
  if (!otel.trace.isSpanContextValid(context)) return;
  return {
    context
  };
}
var traceModeWarnings, OtelApi, Tracer, StepExecutionDurationHistogram, otelDiagLogged;
var init_telemetry = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/telemetry.js"() {
    init_dist();
    init_global();
    init_logger();
    init_semantic_conventions();
    traceModeWarnings = globalSingleton("@workflow/core//traceModeWarnings", 1, () => ({
      unrecognized: /* @__PURE__ */ new Set()
    }));
    __name(serializeTraceCarrier, "serializeTraceCarrier");
    __name(deserializeTraceCarrier, "deserializeTraceCarrier");
    OtelApi = once(async () => {
      try {
        return await import("@opentelemetry/api");
      } catch {
        runtimeLogger.info("OpenTelemetry not available, tracing will be disabled");
        return null;
      }
    });
    Tracer = once(async () => {
      const api = await OtelApi.value;
      if (!api) return null;
      const tracer = api.trace.getTracer("workflow");
      logOtelDiagnosticOnce(api, tracer);
      return tracer;
    });
    StepExecutionDurationHistogram = once(async () => {
      const otel = await OtelApi.value;
      if (!otel) return null;
      return otel.metrics.getMeter("workflow").createHistogram("workflow.step.execute.duration", {
        description: "Duration of user step execution",
        unit: "ms"
      });
    });
    otelDiagLogged = false;
    __name(describeThrownValue, "describeThrownValue");
    __name(logOtelDiagnosticOnce, "logOtelDiagnosticOnce");
    __name(trace, "trace");
    __name(recordElapsedSpan, "recordElapsedSpan");
    __name(applyWorkflowSuspensionToSpan, "applyWorkflowSuspensionToSpan");
    __name(getSpanContextForTraceCarrier, "getSpanContextForTraceCarrier");
    __name(getActiveSpan, "getActiveSpan");
    __name(getSpanKind, "getSpanKind");
    __name(withOtel, "withOtel");
    __name(linkToTraceCarrier, "linkToTraceCarrier");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/logger.js
function matchesDebugNamespace(namespace, patternList) {
  if (typeof patternList !== "string" || !patternList) {
    return false;
  }
  let enabled = false;
  for (const rawPattern of patternList.split(",")) {
    const pattern = rawPattern.trim();
    if (!pattern) {
      continue;
    }
    const isNegated = pattern.startsWith("-");
    const candidate = isNegated ? pattern.slice(1) : pattern;
    const regex = new RegExp(`^${candidate.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*")}$`);
    if (regex.test(namespace)) {
      enabled = !isNegated;
    }
  }
  return enabled;
}
function createLogger(namespace, options = {}) {
  const build = /* @__PURE__ */ __name((parentMetadata) => {
    const getDebugNamespace = /* @__PURE__ */ __name((level) => options.debugNamespace ?? `workflow:${namespace}:${level}`, "getDebugNamespace");
    const logger = /* @__PURE__ */ __name((level) => {
      const debugNamespace = getDebugNamespace(level);
      return (message, metadata) => {
        const hasParent = Object.keys(parentMetadata).length > 0;
        const hasCallSite = metadata && Object.keys(metadata).length > 0;
        const merged = hasParent || hasCallSite ? {
          ...parentMetadata,
          ...metadata ?? {}
        } : void 0;
        if (level === "error" || level === "warn") {
          const out = level === "error" ? console.error : console.warn;
          out(composeLogLine("[workflow-sdk]", message, merged));
        }
        const debugEnabled = matchesDebugNamespace(debugNamespace, process.env.DEBUG);
        if (debugEnabled) {
          console.debug(`[${debugNamespace}] ${message}`, merged ?? "");
          getActiveSpan().then((span) => {
            span?.addEvent(`${level}.${namespace}`, {
              message,
              ...merged
            });
          }).catch(() => {
          });
        }
      };
    }, "logger");
    return {
      debug: logger("debug"),
      info: logger("info"),
      warn: logger("warn"),
      error: logger("error"),
      child: /* @__PURE__ */ __name((metadata) => build({
        ...parentMetadata,
        ...metadata
      }), "child"),
      forRun: /* @__PURE__ */ __name((workflowRunId, workflowName, extra) => build({
        ...parentMetadata,
        workflowRunId,
        ...workflowName !== void 0 ? {
          workflowName
        } : {},
        ...extra ?? {}
      }), "forRun")
    };
  }, "build");
  return build({});
}
var stepLogger, runtimeLogger, webhookLogger, eventsLogger, adapterLogger, buildLogger;
var init_logger = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/logger.js"() {
    init_log_format();
    init_telemetry();
    __name(matchesDebugNamespace, "matchesDebugNamespace");
    __name(createLogger, "createLogger");
    stepLogger = createLogger("step");
    runtimeLogger = createLogger("runtime");
    webhookLogger = createLogger("webhook");
    eventsLogger = createLogger("events");
    adapterLogger = createLogger("adapter");
    buildLogger = createLogger("build", {
      debugNamespace: "workflow:build"
    });
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/errors.js
function rethrowIfRuntimeError(error) {
  if (RuntimeDecryptionError.is(error)) {
    throw error;
  }
}
function formatSerializationError(context, error) {
  const verb = context.includes("return value") ? "returning" : "passing";
  let message = `Failed to serialize ${context}`;
  if (error instanceof DevalueError && error.path) {
    message += ` at path "${error.path}"`;
  }
  const hint2 = `Ensure you're ${verb} workflow serializable types. Check the serialization docs to see what's serializable: https://workflow-sdk.dev/docs/foundations/serialization`;
  if (error instanceof DevalueError && error.value !== void 0) {
    runtimeLogger.error("Serialization failed", {
      context,
      problematicValue: error.value
    });
  }
  return {
    message,
    hint: hint2
  };
}
var init_errors = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/errors.js"() {
    init_dist2();
    init_src();
    init_logger();
    __name(rethrowIfRuntimeError, "rethrowIfRuntimeError");
    __name(formatSerializationError, "formatSerializationError");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/client.js
async function serialize(value, encryptionKey, options) {
  try {
    const payload = devalueCodec.serialize(value, "client", options);
    const prefixed = encodeWithFormatPrefix(SerializationFormat.DEVALUE_V1, payload);
    const compressed = await compress(prefixed, options?.compression ?? false, options?.compressionStats, {
      preferAsync: true
    });
    return encrypt2(compressed, encryptionKey);
  } catch (error) {
    rethrowIfRuntimeError(error);
    const { message, hint: hint2 } = formatSerializationError("client value", error);
    throw new SerializationError(message, {
      hint: hint2,
      cause: error
    });
  }
}
async function deserialize(data2, encryptionKey, options) {
  const decrypted = await decompress(await decrypt2(data2, encryptionKey), options?.compressionStats);
  if (!(decrypted instanceof Uint8Array)) {
    if (devalueCodec.deserializeLegacy) {
      return devalueCodec.deserializeLegacy(decrypted, "client", options);
    }
    throw new Error("Cannot deserialize non-binary data without legacy support");
  }
  const { format, payload } = decodeFormatPrefix(decrypted);
  if (format === SerializationFormat.DEVALUE_V1) {
    return devalueCodec.deserialize(payload, "client", options);
  }
  throw new Error(`Unsupported serialization format: ${format}`);
}
var init_client = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/client.js"() {
    init_dist2();
    init_codec_devalue();
    init_compression();
    init_encryption2();
    init_errors();
    init_format();
    init_types();
    __name(serialize, "serialize");
    __name(deserialize, "deserialize");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/step.js
async function serialize2(value, encryptionKey, options) {
  try {
    const payload = devalueCodec.serialize(value, "step", options);
    const prefixed = encodeWithFormatPrefix(SerializationFormat.DEVALUE_V1, payload);
    const compressed = await compress(prefixed, options?.compression ?? false, options?.compressionStats);
    return encrypt2(compressed, encryptionKey);
  } catch (error) {
    rethrowIfRuntimeError(error);
    const { message, hint: hint2 } = formatSerializationError("step value", error);
    throw new SerializationError(message, {
      hint: hint2,
      cause: error
    });
  }
}
async function deserialize2(data2, encryptionKey, options) {
  const decrypted = await decompress(await decrypt2(data2, encryptionKey), options?.compressionStats);
  if (!(decrypted instanceof Uint8Array)) {
    if (devalueCodec.deserializeLegacy) {
      return devalueCodec.deserializeLegacy(decrypted, "step", options);
    }
    throw new Error("Cannot deserialize non-binary data without legacy support");
  }
  const { format, payload } = decodeFormatPrefix(decrypted);
  if (format === SerializationFormat.DEVALUE_V1) {
    return devalueCodec.deserialize(payload, "step", options);
  }
  throw new Error(`Unsupported serialization format: ${format}`);
}
var init_step = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/step.js"() {
    init_dist2();
    init_codec_devalue();
    init_compression();
    init_encryption2();
    init_errors();
    init_format();
    init_types();
    __name(serialize2, "serialize");
    __name(deserialize2, "deserialize");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/workflow.js
var init_workflow = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization/workflow.js"() {
    init_dist2();
    init_codec_devalue();
    init_errors();
    init_format();
    init_types();
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/step/context-storage.js
import { AsyncLocalStorage } from "node:async_hooks";
var CONTEXT_STORAGE_SYMBOL, contextStorage;
var init_context_storage = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/step/context-storage.js"() {
    CONTEXT_STORAGE_SYMBOL = /* @__PURE__ */ Symbol.for("WORKFLOW_STEP_CONTEXT_STORAGE");
    contextStorage = (() => {
      const store = globalThis;
      store[CONTEXT_STORAGE_SYMBOL] ??= new AsyncLocalStorage();
      return store[CONTEXT_STORAGE_SYMBOL];
    })();
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/util.js
function getWorkflowRunStreamId(runId, namespace) {
  const streamId = `${runId.replace("wrun_", "strm_")}_user`;
  if (!namespace) {
    return streamId;
  }
  const encodedNamespace = Buffer.from(namespace, "utf-8").toString("base64url");
  return `${streamId}_${encodedNamespace}`;
}
function getAbortStreamId(id) {
  return `strm_${id}_system_abort`;
}
var init_util = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/util.js"() {
    __name(getWorkflowRunStreamId, "getWorkflowRunStreamId");
    __name(getAbortStreamId, "getAbortStreamId");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/events-consumer.js
var EventConsumerResult;
var init_events_consumer = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/events-consumer.js"() {
    init_env_config();
    init_event_metadata();
    init_logger();
    (function(EventConsumerResult2) {
      EventConsumerResult2[EventConsumerResult2["Consumed"] = 0] = "Consumed";
      EventConsumerResult2[EventConsumerResult2["NotConsumed"] = 1] = "NotConsumed";
      EventConsumerResult2[EventConsumerResult2["Finished"] = 2] = "Finished";
    })(EventConsumerResult || (EventConsumerResult = {}));
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/workflow/abort-controller.js
var WorkflowAbortSignal;
var init_abort_controller = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/workflow/abort-controller.js"() {
    init_dist2();
    init_events_consumer();
    init_private();
    init_serialization2();
    init_symbols();
    init_util();
    WorkflowAbortSignal = class {
      static {
        __name(this, "WorkflowAbortSignal");
      }
      aborted = false;
      reason = void 0;
      [ABORT_STREAM_NAME];
      [ABORT_HOOK_TOKEN];
      #listeners = [];
      #onabort = null;
      get onabort() {
        return this.#onabort;
      }
      set onabort(handler) {
        this.#onabort = handler;
        if (handler && this.aborted) {
          handler.call(this);
        }
      }
      constructor(streamName, hookToken) {
        this[ABORT_STREAM_NAME] = streamName;
        this[ABORT_HOOK_TOKEN] = hookToken;
      }
      /**
       * @internal Sets aborted state and fires listeners.
       * Called by abort() on first-run, or by the events consumer on replay.
       * Idempotent: second call is a no-op.
       */
      _setAborted(reason) {
        if (this.aborted) return;
        this.aborted = true;
        this.reason = reason;
        if (this.#onabort) {
          this.#onabort.call(this);
        }
        for (const listener of this.#listeners) {
          listener();
        }
        this.#listeners = [];
      }
      addEventListener(type, listener) {
        if (type !== "abort") return;
        if (this.aborted) {
          listener();
          return;
        }
        this.#listeners.push(listener);
      }
      removeEventListener(type, listener) {
        if (type !== "abort") return;
        this.#listeners = this.#listeners.filter((l) => l !== listener);
      }
      throwIfAborted() {
        if (this.aborted) {
          throw this.reason ?? new DOMException("The operation was aborted.", "AbortError");
        }
      }
    };
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization.js
function getStreamType(stream) {
  try {
    const reader = stream.getReader({
      mode: "byob"
    });
    reader.releaseLock();
    return "bytes";
  } catch {
  }
}
function unwrapSerializationCause(error) {
  rethrowIfRuntimeError(error);
  if (error instanceof SerializationError && error.cause !== void 0) {
    return error.cause;
  }
  if (error instanceof WorkflowRuntimeError && error.cause !== void 0) {
    return error.cause;
  }
  return error;
}
async function recordCompression(stats, operation) {
  if (!stats.recorded) return;
  try {
    const span = await getActiveSpan();
    if (!span) return;
    const uncompressedBytes = stats.uncompressedBytes ?? 0;
    const storedBytes = stats.storedBytes ?? 0;
    span.setAttributes({
      ...SerializationOperation(operation),
      ...SerializationCompressed(stats.compressed ?? false),
      ...SerializationCodec(stats.codec ?? "none"),
      ...SerializationUncompressedBytes(uncompressedBytes),
      ...SerializationStoredBytes(storedBytes),
      ...stats.compressed && uncompressedBytes > 0 ? SerializationCompressionRatio(1 - storedBytes / uncompressedBytes) : {}
    });
  } catch {
  }
}
async function recordGuestCodeExecutions(stats) {
  const totalExecutions = stats.totalExecutions ?? stats.executions.length;
  if (totalExecutions === 0) return;
  try {
    const span = await getActiveSpan();
    if (!span) return;
    const details = [
      ...new Set(stats.executions.map((e) => e.detail ? `${e.kind} (${e.detail})` : e.kind))
    ];
    span.setAttributes({
      ...SerializationGuestCodeExecutions(totalExecutions),
      ...SerializationGuestCodeDetails(details)
    });
  } catch {
  }
}
function getSerializeStream(reducers, cryptoKey) {
  const encoder2 = new TextEncoder();
  const keyState = {
    resolved: false,
    key: void 0
  };
  let sealSession;
  const stream = new TransformStream({
    async transform(chunk, controller) {
      try {
        if (!keyState.resolved) {
          keyState.key = await resolveEncryptionKey(cryptoKey);
          keyState.resolved = true;
          if (isSealTarget(keyState.key)) {
            sealSession = createSealSession(keyState.key.recipientPublicKey, keyState.key.aad);
          }
        }
        const serialized = stringify(chunk, reducers);
        const payload = encoder2.encode(serialized);
        let prefixed = encodeWithFormatPrefix(SerializationFormat.DEVALUE_V1, payload);
        if (sealSession) {
          prefixed = encodeWithFormatPrefix(SerializationFormat.SEALED, await sealSession.seal(prefixed));
        } else if (keyState.key) {
          prefixed = await encrypt2(prefixed, keyState.key);
        }
        const frame2 = new Uint8Array(FRAME_HEADER_SIZE + prefixed.length);
        new DataView(frame2.buffer).setUint32(0, prefixed.length, false);
        frame2.set(prefixed, FRAME_HEADER_SIZE);
        controller.enqueue(frame2);
      } catch (error) {
        if (RuntimeDecryptionError.is(error)) {
          controller.error(error);
          return;
        }
        const { message, hint: hint2 } = formatSerializationError("stream chunk", error);
        controller.error(new SerializationError(message, {
          hint: hint2,
          cause: error
        }));
      }
    }
  });
  return stream;
}
function getDeserializeStream(revivers, cryptoKey) {
  const decoder2 = new TextDecoder();
  let buffer2 = new Uint8Array(0);
  const keyState = {
    resolved: false,
    key: void 0
  };
  let openSession;
  function appendToBuffer(data2) {
    const newBuffer = new Uint8Array(buffer2.length + data2.length);
    newBuffer.set(buffer2, 0);
    newBuffer.set(data2, buffer2.length);
    buffer2 = newBuffer;
  }
  __name(appendToBuffer, "appendToBuffer");
  async function processFrames(controller) {
    if (!keyState.resolved) {
      keyState.key = await resolveEncryptionKey(cryptoKey);
      keyState.resolved = true;
      if (isRunPayloadKeys(keyState.key)) {
        openSession = createOpenSession(keyState.key.keyPair, keyState.key.aad);
      }
    }
    while (buffer2.length >= FRAME_HEADER_SIZE) {
      const frameLength = new DataView(buffer2.buffer, buffer2.byteOffset, buffer2.byteLength).getUint32(0, false);
      if (buffer2.length < FRAME_HEADER_SIZE + frameLength) {
        break;
      }
      const frameData = buffer2.slice(FRAME_HEADER_SIZE, FRAME_HEADER_SIZE + frameLength);
      buffer2 = buffer2.slice(FRAME_HEADER_SIZE + frameLength);
      let { format, payload } = decodeFormatPrefix(frameData);
      if (format === SerializationFormat.ENCRYPTED || format === SerializationFormat.SEALED) {
        const sealed = format === SerializationFormat.SEALED;
        const usable = sealed ? isRunPayloadKeys(keyState.key) : aesKeyOf(keyState.key) !== void 0;
        if (!usable) {
          controller.error(new RuntimeDecryptionError(sealed ? "Sealed stream data encountered but no run keypair is available. Opening a sealed frame requires the run's own encryption key material." : "Encrypted stream data encountered but no encryption key is available. Encryption is not configured or no key was provided for this run.", {
            context: {
              operation: "decrypt",
              byteLength: payload.byteLength,
              formatPrefix: sealed ? "encp" : "encr"
            }
          }));
          return;
        }
        let decrypted;
        try {
          decrypted = sealed ? await openSession.open(decodeFormatPrefix(frameData).payload) : await decrypt2(frameData, keyState.key);
        } catch (error) {
          if (RuntimeDecryptionError.is(error) && error.context) {
            error.context.formatPrefix = format;
          }
          throw error;
        }
        ({ format, payload } = decodeFormatPrefix(decrypted));
      }
      if (format === SerializationFormat.DEVALUE_V1) {
        const text = decoder2.decode(payload);
        controller.enqueue(parse(text, revivers));
      }
    }
  }
  __name(processFrames, "processFrames");
  const stream = new TransformStream({
    async transform(chunk, controller) {
      if (buffer2.length === 0 && chunk.length >= FRAME_HEADER_SIZE) {
        const possibleLength = new DataView(chunk.buffer, chunk.byteOffset, chunk.byteLength).getUint32(0, false);
        if (possibleLength > 0 && possibleLength < 1e8) {
          appendToBuffer(chunk);
          await processFrames(controller);
          return;
        }
      } else if (buffer2.length > 0) {
        appendToBuffer(chunk);
        await processFrames(controller);
        return;
      }
      const text = decoder2.decode(chunk);
      const lines = text.split("\n");
      for (const line of lines) {
        if (line.length > 0) {
          controller.enqueue(parse(line, revivers));
        }
      }
    },
    async flush(controller) {
      if (buffer2.length > 0) {
        await processFrames(controller);
      }
    }
  });
  return stream;
}
function getByteFramingStream() {
  return new TransformStream({
    transform(chunk, controller) {
      if (chunk.length === 0) return;
      if (chunk.length > MAX_FRAME_SIZE) {
        controller.error(new WorkflowRuntimeError(`Byte-stream chunk of ${chunk.length} bytes exceeds the maximum framed chunk size (${MAX_FRAME_SIZE}). Split the data into smaller chunks before writing.`, {
          slug: "serialization-failed"
        }));
        return;
      }
      const frame2 = new Uint8Array(FRAME_HEADER_SIZE + chunk.length);
      new DataView(frame2.buffer).setUint32(0, chunk.length, false);
      frame2.set(chunk, FRAME_HEADER_SIZE);
      controller.enqueue(frame2);
    }
  });
}
function getByteUnframingStream() {
  let buffer2 = new Uint8Array(0);
  function appendToBuffer(data2) {
    const next2 = new Uint8Array(buffer2.length + data2.length);
    next2.set(buffer2, 0);
    next2.set(data2, buffer2.length);
    buffer2 = next2;
  }
  __name(appendToBuffer, "appendToBuffer");
  return new TransformStream({
    transform(chunk, controller) {
      if (chunk.length > 0) appendToBuffer(chunk);
      while (buffer2.length >= FRAME_HEADER_SIZE) {
        const frameLength = new DataView(buffer2.buffer, buffer2.byteOffset, buffer2.byteLength).getUint32(0, false);
        if (frameLength > MAX_FRAME_SIZE) {
          controller.error(new WorkflowRuntimeError(`Byte-stream frame length ${frameLength} exceeds maximum (${MAX_FRAME_SIZE}). This usually means a non-framed byte stream is being read as framed.`, {
            slug: "serialization-failed"
          }));
          return;
        }
        const total = FRAME_HEADER_SIZE + frameLength;
        if (buffer2.length < total) break;
        controller.enqueue(buffer2.slice(FRAME_HEADER_SIZE, total));
        buffer2 = buffer2.slice(total);
      }
    },
    flush(controller) {
      if (buffer2.length > 0) {
        controller.error(new WorkflowRuntimeError(`Byte-stream ended with ${buffer2.length} bytes of incomplete frame data. The stream was truncated mid-frame.`, {
          slug: "serialization-failed"
        }));
      }
    }
  });
}
function recordReadTimeToFirstChunk(startEpochMs, runId, name, startIndex, connectMs) {
  void (async () => {
    await recordElapsedSpan("workflow.stream.read", startEpochMs, {
      kind: await getSpanKind("CLIENT"),
      attributes: {
        "workflow.run.id": runId,
        "workflow.stream.name": name,
        "workflow.stream.operation": "read",
        "workflow.stream.read.ttfc_ms": Date.now() - startEpochMs,
        ...typeof connectMs === "number" ? {
          "workflow.stream.read.connect_ms": connectMs
        } : {},
        ...typeof startIndex === "number" ? {
          "workflow.stream.start_index": startIndex
        } : {}
      }
    });
  })();
}
function recordStreamReadKeyResolution(startEpochMs, runId, name, succeeded) {
  void (async () => {
    await recordElapsedSpan("workflow.stream.read.resolve_key", startEpochMs, {
      kind: await getSpanKind("CLIENT"),
      attributes: {
        "workflow.run.id": runId,
        "workflow.stream.name": name,
        "workflow.stream.read.key_succeeded": succeeded
      }
    });
  })();
}
function recordStreamReadComplete(startEpochMs, runId, name, chunkCount, byteCount, reconnects) {
  void (async () => {
    await recordElapsedSpan("workflow.stream.read.complete", startEpochMs, {
      kind: await getSpanKind("CLIENT"),
      attributes: {
        "workflow.run.id": runId,
        "workflow.stream.name": name,
        "workflow.stream.operation": "read_complete",
        "workflow.stream.read.total_ms": Date.now() - startEpochMs,
        "workflow.stream.read.chunks": chunkCount,
        "workflow.stream.read.bytes": byteCount,
        ...typeof reconnects === "number" ? {
          "workflow.stream.read.reconnects": reconnects
        } : {}
      }
    });
  })();
}
function createReconnectingFramedStream(runId, name, startIndex, prefetchEncryptionKey = async () => void 0) {
  const reconnectSupported = startIndex === void 0 || startIndex >= 0;
  let currentStartIndex = startIndex ?? 0;
  let consumedFrames = 0;
  let reconnectCount = 0;
  let totalReconnectCount = 0;
  let reader;
  let canceled = false;
  let cancelReason;
  let buffer2 = new Uint8Array(0);
  let readStart;
  let connectMs;
  let firstChunkReported = false;
  let chunksDelivered = 0;
  let bytesDelivered = 0;
  let keyPrefetched = false;
  function prefetchKey() {
    if (keyPrefetched) return;
    keyPrefetched = true;
    const keyStart = Date.now();
    void prefetchEncryptionKey().then((key) => {
      if (key) recordStreamReadKeyResolution(keyStart, runId, name, true);
    }, () => recordStreamReadKeyResolution(keyStart, runId, name, false));
  }
  __name(prefetchKey, "prefetchKey");
  async function connect() {
    if (canceled) return false;
    const world = await getWorldLazy();
    if (canceled) return false;
    const effectiveStartIndex = reconnectSupported ? currentStartIndex + consumedFrames : startIndex;
    const connectStart = Date.now();
    const stream = await world.streams.get(runId, name, effectiveStartIndex);
    if (canceled) {
      await stream.cancel(cancelReason).catch(() => {
      });
      return false;
    }
    if (connectMs === void 0) connectMs = Date.now() - connectStart;
    reader = stream.getReader();
    return true;
  }
  __name(connect, "connect");
  async function isVerifiedComplete() {
    try {
      const world = await getWorldLazy();
      const info = await world.streams.getInfo(runId, name);
      return info.done && currentStartIndex + consumedFrames > info.tailIndex;
    } catch {
      return true;
    }
  }
  __name(isVerifiedComplete, "isVerifiedComplete");
  async function reconnect() {
    if (canceled) return false;
    if (reader) {
      await reader.cancel().catch(() => {
      });
      reader = void 0;
    }
    if (canceled) return false;
    currentStartIndex += consumedFrames;
    consumedFrames = 0;
    buffer2 = new Uint8Array(0);
    const maxReconnects = getFramedStreamMaxReconnects();
    const maxTotalReconnects = getFramedStreamMaxTotalReconnects();
    for (; ; ) {
      reconnectCount++;
      totalReconnectCount++;
      if (reconnectCount > maxReconnects) {
        throw new StreamError(`Stream "${name}" exceeded maximum reconnection attempts (${maxReconnects})`);
      }
      if (totalReconnectCount > maxTotalReconnects) {
        throw new StreamError(`Stream "${name}" exceeded maximum total reconnection attempts (${maxTotalReconnects})`);
      }
      try {
        if (!await connect()) return false;
        return true;
      } catch (error) {
        if (canceled) return false;
        if (StreamExpiredError.is(error)) throw error;
      }
    }
  }
  __name(reconnect, "reconnect");
  return new ReadableStream({
    pull: /* @__PURE__ */ __name(async (controller) => {
      if (canceled) return;
      if (readStart === void 0) readStart = Date.now();
      prefetchKey();
      for (; ; ) {
        if (!reader) {
          try {
            if (!await connect()) return;
          } catch (err) {
            if (canceled) return;
            controller.error(err);
            return;
          }
        }
        let result;
        try {
          result = await reader.read();
        } catch (err) {
          if (canceled) return;
          if (!reconnectSupported) {
            controller.error(err);
            return;
          }
          try {
            if (!await reconnect()) return;
          } catch (reconnectErr) {
            controller.error(reconnectErr);
            return;
          }
          continue;
        }
        if (canceled) return;
        if (result.done || !result.value) {
          reader = void 0;
          const verifiedComplete = !reconnectSupported || await isVerifiedComplete();
          if (canceled) return;
          if (!verifiedComplete) {
            try {
              if (!await reconnect()) return;
            } catch (reconnectErr) {
              controller.error(reconnectErr);
              return;
            }
            continue;
          }
          if (readStart !== void 0) {
            recordStreamReadComplete(readStart, runId, name, chunksDelivered, bytesDelivered, totalReconnectCount);
          }
          controller.close();
          return;
        }
        const incoming = result.value;
        if (incoming.length > 0) {
          const combined = new Uint8Array(buffer2.length + incoming.length);
          combined.set(buffer2, 0);
          combined.set(incoming, buffer2.length);
          buffer2 = combined;
        }
        let emitted = false;
        while (buffer2.length >= FRAME_HEADER_SIZE) {
          const frameLength = new DataView(buffer2.buffer, buffer2.byteOffset, buffer2.byteLength).getUint32(0, false);
          const total = FRAME_HEADER_SIZE + frameLength;
          if (buffer2.length < total) break;
          controller.enqueue(buffer2.slice(0, total));
          buffer2 = buffer2.slice(total);
          consumedFrames++;
          chunksDelivered++;
          bytesDelivered += total;
          if (!firstChunkReported && readStart !== void 0) {
            firstChunkReported = true;
            recordReadTimeToFirstChunk(readStart, runId, name, startIndex, connectMs);
          }
          emitted = true;
        }
        if (emitted) {
          reconnectCount = 0;
          return;
        }
      }
    }, "pull"),
    cancel: /* @__PURE__ */ __name(async (reason) => {
      canceled = true;
      cancelReason = reason;
      const currentReader = reader;
      reader = void 0;
      if (currentReader) {
        await currentReader.cancel(reason).catch((err) => {
          console.warn("Error closing ReadableStream reader:", err);
        });
      }
    }, "cancel")
  });
}
function recordStreamWriteFlush(startEpochMs, dispatchEpochMs, runId, name, chunkCount, byteCount, rpcMs) {
  void (async () => {
    await recordElapsedSpan("workflow.stream.flush", startEpochMs, {
      kind: await getSpanKind("CLIENT"),
      attributes: {
        "workflow.run.id": runId,
        "workflow.stream.name": name,
        "workflow.stream.operation": "flush",
        "workflow.stream.flush.buffer_dwell_ms": dispatchEpochMs - startEpochMs,
        "workflow.stream.flush.chunks": chunkCount,
        "workflow.stream.flush.bytes": byteCount,
        // Client-observed World write RPC duration (network hop included).
        // Same key as world-vercel's per-request span attribute so queries
        // work regardless of which layer emitted it.
        "workflow.stream.write.chunk_rtt": rpcMs
      }
    });
  })();
}
function recordStreamClose(startEpochMs, runId, name) {
  void (async () => {
    await recordElapsedSpan("workflow.stream.close", startEpochMs, {
      kind: await getSpanKind("CLIENT"),
      attributes: {
        "workflow.run.id": runId,
        "workflow.stream.name": name,
        "workflow.stream.operation": "close",
        "workflow.stream.close.rpc_ms": Date.now() - startEpochMs
      }
    });
  })();
}
function getAllBaseReducers(global2 = globalThis) {
  const requestPrototype = once(() => getHostClassPrototype(global2, "Request"));
  const responsePrototype = once(() => getHostClassPrototype(global2, "Response"));
  return {
    ...getClassReducers(),
    ...getStepFunctionReducer(),
    ...getCommonReducers(global2),
    // Request and Response reducers are mode-specific and added by
    // getExternalReducers / getWorkflowReducers / getStepReducers below.
    Request: /* @__PURE__ */ __name((value) => {
      if (!isInstanceOfPrototype(value, requestPrototype.value)) return false;
      const data2 = {
        method: readProperty(value, "method"),
        url: readProperty(value, "url"),
        headers: readProperty(value, "headers"),
        body: readProperty(value, "body"),
        duplex: readProperty(value, "duplex")
      };
      const responseWritable = readProperty(value, WEBHOOK_RESPONSE_WRITABLE);
      if (responseWritable) {
        data2.responseWritable = responseWritable;
      }
      const signal = readProperty(value, "signal");
      if (signal && (readProperty(signal, "aborted") || readProperty(signal, ABORT_STREAM_NAME))) {
        data2.signal = signal;
      }
      return data2;
    }, "Request"),
    Response: /* @__PURE__ */ __name((value) => {
      if (!isInstanceOfPrototype(value, responsePrototype.value)) return false;
      return {
        type: readProperty(value, "type"),
        url: readProperty(value, "url"),
        status: readProperty(value, "status"),
        statusText: readProperty(value, "statusText"),
        headers: readProperty(value, "headers"),
        body: readProperty(value, "body"),
        redirected: readProperty(value, "redirected")
      };
    }, "Response")
  };
}
function reduceAbortWithListener(signal, holder, global2, ops, runId, cryptoKey) {
  let streamName = holder[ABORT_STREAM_NAME];
  let hookToken = holder[ABORT_HOOK_TOKEN];
  if (!streamName) {
    const id = (global2[STABLE_ULID] || defaultUlid)();
    streamName = getAbortStreamId(id);
    hookToken = `abrt_${id}`;
    holder[ABORT_STREAM_NAME] = streamName;
    holder[ABORT_HOOK_TOKEN] = hookToken;
    if (holder.signal) {
      holder.signal[ABORT_STREAM_NAME] = streamName;
      holder.signal[ABORT_HOOK_TOKEN] = hookToken;
    }
  }
  attachAbortListenerOnce(signal, streamName, runId, cryptoKey, ops);
  return {
    streamName,
    hookToken,
    aborted: signal.aborted,
    reason: signal.aborted ? signal.reason : void 0
  };
}
function reduceAbortBySymbol(signal, holder) {
  const streamName = holder[ABORT_STREAM_NAME] ?? holder.signal?.[ABORT_STREAM_NAME];
  const hookToken = holder[ABORT_HOOK_TOKEN] ?? holder.signal?.[ABORT_HOOK_TOKEN];
  if (!streamName) {
    throw new Error("AbortController/AbortSignal stream name is not set");
  }
  return {
    streamName,
    hookToken,
    aborted: signal.aborted,
    reason: signal.aborted ? signal.reason : void 0
  };
}
function attachAbortListenerOnce(signal, streamName, runId, cryptoKey, ops) {
  if (signal.aborted) return;
  if (signal[ABORT_LISTENER_ATTACHED]) return;
  signal[ABORT_LISTENER_ATTACHED] = true;
  signal.addEventListener("abort", () => {
    ops.push((async () => {
      try {
        const key = await resolveEncryptionKey(cryptoKey);
        const payload = await dehydrateStepArguments({
          aborted: true,
          reason: signal.reason
        }, runId, key);
        const writable = new WorkflowServerWritableStream(runId, streamName);
        const writer = writable.getWriter();
        await writer.write(payload);
        await writer.close();
      } catch {
      }
    })());
  }, {
    once: true
  });
}
function getExternalReducers(global2 = globalThis, ops, runId, cryptoKey, framedByteStreams = false, runReadyBarrier, readbackOps = ops) {
  return {
    ...getAllBaseReducers(global2),
    ReadableStream: /* @__PURE__ */ __name((value) => {
      if (!(value instanceof global2.ReadableStream)) return false;
      if (value.locked) {
        throw new SerializationError("ReadableStream is locked and cannot be passed across a workflow boundary.", {
          hint: "Pass the stream before calling .getReader() / .pipeThrough() / .pipeTo(), or tee it with .tee() and pass one of the branches."
        });
      }
      const streamId = (global2[STABLE_ULID] || defaultUlid)();
      const name = `strm_${streamId}`;
      const type = getStreamType(value);
      const writable = new WorkflowServerWritableStream(runId, name, runReadyBarrier);
      if (type === "bytes") {
        if (framedByteStreams) {
          ops.push(value.pipeThrough(getByteFramingStream()).pipeTo(writable));
        } else {
          ops.push(value.pipeTo(writable));
        }
      } else {
        ops.push(value.pipeThrough(getSerializeStream(getExternalReducers(global2, ops, runId, cryptoKey, framedByteStreams, runReadyBarrier, readbackOps), cryptoKey)).pipeTo(writable));
      }
      const s = {
        name
      };
      if (type) s.type = type;
      if (type === "bytes" && framedByteStreams) s.framing = "framed-v1";
      return s;
    }, "ReadableStream"),
    WritableStream: /* @__PURE__ */ __name((value) => {
      if (!(value instanceof global2.WritableStream)) return false;
      const existingName = value[STREAM_NAME_SYMBOL];
      const existingRunId = value[STREAM_SERVER_RUN_ID_SYMBOL];
      if (typeof existingName === "string" && typeof existingRunId === "string") {
        const descriptor = {
          name: existingName,
          runId: existingRunId
        };
        const existingPublicKey = value[STREAM_SERVER_PUBLIC_KEY_SYMBOL];
        if (typeof existingPublicKey === "string") {
          descriptor.encryptionPublicKey = existingPublicKey;
        }
        const existingDeploymentId = value[STREAM_SERVER_DEPLOYMENT_ID_SYMBOL];
        if (typeof existingDeploymentId === "string") {
          descriptor.deploymentId = existingDeploymentId;
        }
        return descriptor;
      }
      const streamId = (global2[STABLE_ULID] || defaultUlid)();
      const name = `strm_${streamId}`;
      const readable = new WorkflowServerReadableStream(runId, name);
      readbackOps.push(readable.pipeTo(value));
      return {
        name
      };
    }, "WritableStream"),
    AbortController: /* @__PURE__ */ __name((value) => {
      if (!global2.AbortController || typeof global2.AbortController !== "function" || !(value instanceof global2.AbortController)) return false;
      return reduceAbortWithListener(value.signal, value, global2, ops, runId, cryptoKey);
    }, "AbortController"),
    AbortSignal: /* @__PURE__ */ __name((value) => {
      if (!global2.AbortSignal || typeof global2.AbortSignal !== "function" || !(value instanceof global2.AbortSignal)) return false;
      return reduceAbortWithListener(value, value, global2, ops, runId, cryptoKey);
    }, "AbortSignal")
  };
}
function getHostClassPrototype(global2, name) {
  const ctor = readProperty(global2, name) ?? readProperty(globalThis, name);
  if (typeof ctor !== "function") return void 0;
  return readProperty(ctor, "prototype");
}
function getWorkflowReducers(global2 = globalThis) {
  const readableStreamPrototype = once(() => getHostClassPrototype(global2, "ReadableStream"));
  const writableStreamPrototype = once(() => getHostClassPrototype(global2, "WritableStream"));
  const abortControllerPrototype = once(() => getHostClassPrototype(global2, "AbortController"));
  const abortSignalPrototype = once(() => getHostClassPrototype(global2, "AbortSignal"));
  return {
    ...getAllBaseReducers(global2),
    // Readable/Writable streams from within the workflow execution environment
    // are "handles" that can be passed around to other steps.
    ReadableStream: /* @__PURE__ */ __name((value) => {
      if (!isInstanceOfPrototype(value, readableStreamPrototype.value)) return false;
      const bodyInit = readProperty(value, BODY_INIT_SYMBOL);
      if (bodyInit !== void 0) {
        return {
          bodyInit
        };
      }
      const name = readProperty(value, STREAM_NAME_SYMBOL);
      if (!name) {
        throw new WorkflowRuntimeError("ReadableStream `name` is not set");
      }
      const s = {
        name
      };
      const type = readProperty(value, STREAM_TYPE_SYMBOL);
      if (type) s.type = type;
      const framing = readProperty(value, STREAM_FRAMING_SYMBOL);
      if (framing) s.framing = framing;
      return s;
    }, "ReadableStream"),
    WritableStream: /* @__PURE__ */ __name((value) => {
      if (!isInstanceOfPrototype(value, writableStreamPrototype.value)) return false;
      const name = readProperty(value, STREAM_NAME_SYMBOL);
      if (!name) {
        throw new WorkflowRuntimeError("WritableStream `name` is not set");
      }
      const s = {
        name
      };
      const foreignRunId = readProperty(value, STREAM_SERVER_RUN_ID_SYMBOL);
      if (typeof foreignRunId === "string") s.runId = foreignRunId;
      const foreignDeploymentId = readProperty(value, STREAM_SERVER_DEPLOYMENT_ID_SYMBOL);
      if (typeof foreignDeploymentId === "string") {
        s.deploymentId = foreignDeploymentId;
      }
      const foreignPublicKey = readProperty(value, STREAM_SERVER_PUBLIC_KEY_SYMBOL);
      if (typeof foreignPublicKey === "string") {
        s.encryptionPublicKey = foreignPublicKey;
      }
      return s;
    }, "WritableStream"),
    // AbortController/AbortSignal in workflow context: read only symbols (handles).
    // In the workflow VM, global.AbortController is a class but global.AbortSignal
    // is a plain object (not a class), so instanceof checks won't work for signals.
    // Detect instances by the presence of the ABORT_STREAM_NAME symbol instead.
    AbortController: /* @__PURE__ */ __name((value) => {
      if (value === null || typeof value !== "object") return false;
      const holder = value;
      const ownSymbol = readProperty(value, ABORT_STREAM_NAME);
      const isNativeAbortController = isInstanceOfPrototype(value, abortControllerPrototype.value);
      if (ownSymbol === void 0 && !isNativeAbortController) {
        const maybeSignal = readProperty(value, "signal");
        if (maybeSignal === null || typeof maybeSignal !== "object" || readProperty(maybeSignal, ABORT_STREAM_NAME) === void 0) {
          return false;
        }
      }
      const signal = readProperty(value, "signal");
      if (!signal) return false;
      return reduceAbortBySymbol(signal, holder);
    }, "AbortController"),
    AbortSignal: /* @__PURE__ */ __name((value) => {
      if (value === null || typeof value !== "object") return false;
      const hasAbortSymbol = readProperty(value, ABORT_STREAM_NAME) !== void 0;
      const isNativeAbortSignal = isInstanceOfPrototype(value, abortSignalPrototype.value);
      if (!hasAbortSymbol && !isNativeAbortSignal) return false;
      return reduceAbortBySymbol(value, value);
    }, "AbortSignal")
  };
}
function getStepReducers(global2 = globalThis, ops, runId, cryptoKey, framedByteStreams = false, runReadyBarrier, readbackOps = ops) {
  return {
    ...getAllBaseReducers(global2),
    ReadableStream: /* @__PURE__ */ __name((value) => {
      if (!(value instanceof global2.ReadableStream)) return false;
      if (value.locked) {
        throw new SerializationError("ReadableStream is locked and cannot be passed across a workflow boundary.", {
          hint: "Pass the stream before calling .getReader() / .pipeThrough() / .pipeTo(), or tee it with .tee() and pass one of the branches."
        });
      }
      let name = value[STREAM_NAME_SYMBOL];
      let type = value[STREAM_TYPE_SYMBOL];
      let framing = value[STREAM_FRAMING_SYMBOL];
      if (!name) {
        const streamId = (global2[STABLE_ULID] || defaultUlid)();
        name = `strm_${streamId}`;
        type = getStreamType(value);
        framing = type === "bytes" && framedByteStreams ? "framed-v1" : framing;
        const writable = new WorkflowServerWritableStream(runId, name, runReadyBarrier);
        if (type === "bytes") {
          if (framing === "framed-v1") {
            ops.push(value.pipeThrough(getByteFramingStream()).pipeTo(writable));
          } else {
            ops.push(value.pipeTo(writable));
          }
        } else {
          ops.push(value.pipeThrough(getSerializeStream(getStepReducers(global2, ops, runId, cryptoKey, framedByteStreams, runReadyBarrier, readbackOps), cryptoKey)).pipeTo(writable));
        }
      }
      const s = {
        name
      };
      if (type) s.type = type;
      if (framing) s.framing = framing;
      return s;
    }, "ReadableStream"),
    WritableStream: /* @__PURE__ */ __name((value) => {
      if (!(value instanceof global2.WritableStream)) return false;
      let name = value[STREAM_NAME_SYMBOL];
      const foreignRunId = value[STREAM_SERVER_RUN_ID_SYMBOL];
      if (!name) {
        const streamId = (global2[STABLE_ULID] || defaultUlid)();
        name = `strm_${streamId}`;
        readbackOps.push(new WorkflowServerReadableStream(runId, name).pipeThrough(getDeserializeStream(getStepRevivers(global2, readbackOps, runId, cryptoKey), cryptoKey)).pipeTo(value));
      }
      const s = {
        name
      };
      if (typeof foreignRunId === "string") s.runId = foreignRunId;
      const foreignPublicKey = value[STREAM_SERVER_PUBLIC_KEY_SYMBOL];
      if (typeof foreignPublicKey === "string") {
        s.encryptionPublicKey = foreignPublicKey;
      }
      const foreignDeploymentId = value[STREAM_SERVER_DEPLOYMENT_ID_SYMBOL];
      if (typeof foreignDeploymentId === "string") {
        s.deploymentId = foreignDeploymentId;
      }
      return s;
    }, "WritableStream"),
    AbortController: /* @__PURE__ */ __name((value) => {
      if (!global2.AbortController || typeof global2.AbortController !== "function" || !(value instanceof global2.AbortController)) return false;
      return reduceAbortWithListener(value.signal, value, global2, ops, runId, cryptoKey);
    }, "AbortController"),
    AbortSignal: /* @__PURE__ */ __name((value) => {
      if (!global2.AbortSignal || typeof global2.AbortSignal !== "function" || !(value instanceof global2.AbortSignal)) return false;
      return reduceAbortWithListener(value, value, global2, ops, runId, cryptoKey);
    }, "AbortSignal")
  };
}
function setupAbortStreamReader(controller, runId, streamName, ops) {
  const readerCancel = new AbortController();
  ops.push((async () => {
    try {
      const readable = new WorkflowServerReadableStream(runId, streamName);
      const reader = readable.getReader();
      const result = await Promise.race([
        reader.read(),
        new Promise((resolve) => {
          if (readerCancel.signal.aborted) {
            resolve({
              value: void 0,
              done: true
            });
            return;
          }
          readerCancel.signal.addEventListener("abort", () => resolve({
            value: void 0,
            done: true
          }), {
            once: true
          });
        })
      ]);
      if (result.value && !result.done) {
        try {
          reader.releaseLock();
        } catch {
        }
        try {
          const ctxForKey = contextStorage.getStore();
          const data2 = await hydrateStepArguments(result.value, runId, ctxForKey?.encryptionKey);
          controller.abort(data2?.reason);
        } catch {
          controller.abort();
        }
      } else {
        void reader.cancel().catch(() => {
        });
      }
    } catch {
    }
  })());
  return readerCancel;
}
function tagAbortPair(controller, value, readerCancel) {
  const taggedController = controller;
  const taggedSignal = controller.signal;
  taggedController[ABORT_STREAM_NAME] = value.streamName;
  taggedController[ABORT_HOOK_TOKEN] = value.hookToken;
  taggedSignal[ABORT_STREAM_NAME] = value.streamName;
  taggedSignal[ABORT_HOOK_TOKEN] = value.hookToken;
  if (readerCancel) {
    taggedController[ABORT_READER_CANCEL] = readerCancel;
    taggedSignal[ABORT_READER_CANCEL] = readerCancel;
  }
}
function copyAbortInternals(src, dest) {
  const s = src;
  const d = dest;
  if (s[ABORT_STREAM_NAME] !== void 0) {
    d[ABORT_STREAM_NAME] = s[ABORT_STREAM_NAME];
  }
  if (s[ABORT_HOOK_TOKEN] !== void 0) {
    d[ABORT_HOOK_TOKEN] = s[ABORT_HOOK_TOKEN];
  }
  if (s[ABORT_READER_CANCEL] !== void 0) {
    d[ABORT_READER_CANCEL] = s[ABORT_READER_CANCEL];
  }
}
function reviveAbortController(value, ops, runId) {
  const controller = new AbortController();
  if (value.aborted) {
    tagAbortPair(controller, value);
    controller.abort(value.reason);
  } else if (value.streamName) {
    const readerCancel = setupAbortStreamReader(controller, runId, value.streamName, ops);
    tagAbortPair(controller, value, readerCancel);
  } else {
    tagAbortPair(controller, value);
  }
  const originalAbort = controller.abort.bind(controller);
  controller.abort = (reason) => {
    if (controller.signal.aborted) return;
    originalAbort(reason);
    const ctx = contextStorage.getStore();
    if (ctx) {
      ctx.ops.push((async () => {
        try {
          const payload = await dehydrateStepArguments({
            aborted: true,
            reason
          }, ctx.workflowMetadata.workflowRunId, ctx.encryptionKey);
          const writable = new WorkflowServerWritableStream(ctx.workflowMetadata.workflowRunId, value.streamName);
          const writer = writable.getWriter();
          await writer.write(payload);
          await writer.close();
        } catch {
        }
      })());
      if (value.hookToken) {
        const hookResume = (async () => {
          try {
            const { resumeHook: resumeHook2 } = await Promise.resolve().then(() => (init_resume_hook(), resume_hook_exports));
            await resumeHook2(value.hookToken, {
              aborted: true,
              reason
            });
          } catch {
          }
        })();
        ctx.preCompletionOps.push(hookResume);
      }
    }
  };
  return controller;
}
function reviveAbortSignal(value, ops, runId) {
  const controller = new AbortController();
  if (value.aborted) {
    tagAbortPair(controller, value);
    controller.abort(value.reason);
  } else if (value.streamName) {
    const readerCancel = setupAbortStreamReader(controller, runId, value.streamName, ops);
    tagAbortPair(controller, value, readerCancel);
  } else {
    tagAbortPair(controller, value);
  }
  return controller.signal;
}
function getCommonRevivers2(global2 = globalThis) {
  return {
    ...getClassRevivers(global2),
    ...getCommonRevivers(global2)
  };
}
async function getForwardedWritableEncryptionKey(runId, deploymentId, encryptionPublicKey) {
  const ownerPublicKey = decodeRunPublicKey(encryptionPublicKey);
  if (ownerPublicKey) return sealTo(ownerPublicKey);
  const world = await getWorldLazy();
  if (!world.getEncryptionKeyForRun) return void 0;
  const ownerDeploymentId = deploymentId ?? (await world.runs.get(runId, {
    resolveData: "none"
  })).deploymentId;
  const rawKey = await world.getEncryptionKeyForRun(runId, {
    deploymentId: ownerDeploymentId
  });
  return rawKey ? await importKey(rawKey, [
    "encrypt"
  ]) : void 0;
}
function lazyForwardedWritableEncryptionKey(runId, deploymentId, encryptionPublicKey) {
  let keyPromise;
  return () => {
    keyPromise ??= getForwardedWritableEncryptionKey(runId, deploymentId, encryptionPublicKey);
    return keyPromise;
  };
}
function tagForwardedWritableTarget(writable, { deploymentId, encryptionPublicKey }) {
  if (typeof deploymentId === "string") {
    Object.defineProperty(writable, STREAM_SERVER_DEPLOYMENT_ID_SYMBOL, {
      value: deploymentId,
      writable: false
    });
  }
  if (typeof encryptionPublicKey === "string") {
    Object.defineProperty(writable, STREAM_SERVER_PUBLIC_KEY_SYMBOL, {
      value: encryptionPublicKey,
      writable: false
    });
  }
}
function createForwardedWritable({ global: global2, ops, runId, name, key, deploymentId, encryptionPublicKey, runReadyBarrier }) {
  const serialize3 = getSerializeStream(getExternalReducers(global2, ops, runId, key), key);
  const serverWritable = new WorkflowServerWritableStream(runId, name, runReadyBarrier);
  const state = createFlushableState();
  ops.push(state.promise);
  flushablePipe(serialize3.readable, serverWritable, state).catch(() => {
  });
  pollWritableLock(serialize3.writable, state);
  Object.defineProperty(serialize3.writable, STREAM_NAME_SYMBOL, {
    value: name,
    writable: false
  });
  Object.defineProperty(serialize3.writable, STREAM_SERVER_RUN_ID_SYMBOL, {
    value: runId,
    writable: false
  });
  tagForwardedWritableTarget(serialize3.writable, {
    deploymentId,
    encryptionPublicKey
  });
  return serialize3.writable;
}
function getRunReadableStream(global2, ops, runId, name, startIndex, cryptoKey) {
  return getLazyReadableStream((onReadableState) => getExternalRevivers(global2, ops, runId, cryptoKey, {
    onReadableState
  }).ReadableStream({
    name,
    startIndex
  }));
}
function getLazyReadableStream(reviveReadable, onReadableState) {
  let reader;
  let lockState;
  let lockPollingStarted = false;
  let userReadable;
  userReadable = new ReadableStream(
    {
      async pull(controller) {
        try {
          if (!reader) {
            const stream = reviveReadable((state) => {
              lockState = state;
            });
            reader = stream.getReader();
            if (lockState && !lockPollingStarted) {
              lockPollingStarted = true;
              if (onReadableState) onReadableState(lockState);
              else pollReadableLock(userReadable, lockState);
            }
          }
          const result = await reader.read();
          if (result.done) controller.close();
          else controller.enqueue(result.value);
        } catch (error) {
          controller.error(error);
        }
      },
      async cancel(reason) {
        await reader?.cancel(reason).catch(() => {
        });
      }
    },
    // A positive default high-water mark would run pull at construction to
    // fill the queue, turning an unread Run.getReadable() into I/O.
    {
      highWaterMark: 0
    }
  );
  return userReadable;
}
function getExternalRevivers(global2 = globalThis, ops, runId, cryptoKey, options) {
  function reviveReadableStream(value, onReadableState = options?.onReadableState) {
    if (value.type === "bytes") {
      const readable2 = new WorkflowServerReadableStream(runId, value.name, value.startIndex);
      const state2 = createFlushableState();
      ops.push(state2.promise);
      const { readable: userReadable, writable } = value.framing === "framed-v1" ? getByteUnframingStream() : new global2.TransformStream();
      flushablePipe(readable2, writable, state2).catch(() => {
      });
      if (onReadableState) onReadableState(state2);
      else pollReadableLock(userReadable, state2);
      return userReadable;
    }
    let keyPromise;
    const resolveKey = /* @__PURE__ */ __name(() => {
      keyPromise ??= resolveEncryptionKey(cryptoKey);
      return keyPromise;
    }, "resolveKey");
    const readable = createReconnectingFramedStream(runId, value.name, value.startIndex, resolveKey);
    const transform = getDeserializeStream(getExternalRevivers(global2, ops, runId, resolveKey, {
      lazyStreams: options?.lazyStreams,
      liveAbortSignals: options?.liveAbortSignals
    }), resolveKey);
    const state = createFlushableState();
    ops.push(state.promise);
    flushablePipe(readable, transform.writable, state).catch(() => {
    });
    if (onReadableState) onReadableState(state);
    else pollReadableLock(transform.readable, state);
    return transform.readable;
  }
  __name(reviveReadableStream, "reviveReadableStream");
  function reviveAbortSnapshot(value) {
    const controller = new AbortController();
    if (value.aborted) controller.abort(value.reason);
    return controller;
  }
  __name(reviveAbortSnapshot, "reviveAbortSnapshot");
  return {
    ...getCommonRevivers2(global2),
    // StepFunction should not be returned from workflows to clients
    StepFunction: /* @__PURE__ */ __name(() => {
      throw new SerializationError("Step functions cannot be deserialized in client context. Step functions should not be returned from workflows.", {
        hint: "A step function reference reached the client. Return a serializable value (e.g. the step result) instead of the step itself."
      });
    }, "StepFunction"),
    WorkflowFunction: /* @__PURE__ */ __name((value) => Object.assign(() => {
      throw new SerializationError("Workflow functions cannot be called directly. Use start() to invoke them.", {
        hint: "Wrap the workflow with `start(workflowFn, { ... })` from `workflow` to begin a run instead of invoking it like a normal function."
      });
    }, {
      workflowId: value.workflowId
    }), "WorkflowFunction"),
    Request: /* @__PURE__ */ __name((value) => {
      const init = {
        method: value.method,
        headers: new global2.Headers(value.headers),
        body: value.body,
        duplex: value.duplex
      };
      if (value.signal) init.signal = value.signal;
      const request = new global2.Request(value.url, init);
      if (value.signal) copyAbortInternals(value.signal, request.signal);
      return request;
    }, "Request"),
    Response: /* @__PURE__ */ __name((value) => {
      return new global2.Response(value.body, {
        status: value.status,
        statusText: value.statusText,
        headers: new global2.Headers(value.headers)
      });
    }, "Response"),
    ReadableStream: /* @__PURE__ */ __name((value) => {
      if ("bodyInit" in value) {
        const bodyInit = value.bodyInit;
        const response = new global2.Response(bodyInit);
        return response.body;
      }
      return options?.lazyStreams ? getLazyReadableStream((onReadableState) => reviveReadableStream(value, onReadableState), options.onReadableState) : reviveReadableStream(value);
    }, "ReadableStream"),
    WritableStream: /* @__PURE__ */ __name((value) => {
      const targetRunId = typeof value.runId === "string" ? value.runId : runId;
      const targetKey = targetRunId === runId ? cryptoKey : lazyForwardedWritableEncryptionKey(targetRunId, value.deploymentId, value.encryptionPublicKey);
      return createForwardedWritable({
        global: global2,
        ops,
        runId: targetRunId,
        name: value.name,
        key: targetKey,
        deploymentId: value.deploymentId,
        encryptionPublicKey: value.encryptionPublicKey
      });
    }, "WritableStream"),
    AbortController: /* @__PURE__ */ __name((value) => options?.liveAbortSignals === false ? reviveAbortSnapshot(value) : reviveAbortController(value, ops, runId), "AbortController"),
    AbortSignal: /* @__PURE__ */ __name((value) => options?.liveAbortSignals === false ? reviveAbortSnapshot(value).signal : reviveAbortSignal(value, ops, runId), "AbortSignal")
  };
}
function getStepRevivers(global2 = globalThis, ops, runId, cryptoKey, deploymentId, streamStates, runReadyBarrier) {
  return {
    ...getCommonRevivers2(global2),
    // StepFunction reviver for step context - returns raw step function
    // with closure variable support via AsyncLocalStorage.
    //
    // Handles four independent flags from the serialized payload:
    //   - `closureVars`: invoke the body inside an AsyncLocalStorage frame
    //     so the SWC-emitted `WORKFLOW_STEP_CONTEXT_STORAGE` IIFE in the
    //     hoisted body can pull the closure variables back out.
    //   - `boundThis`:   a `this` value captured by
    //     `useStep(...).bind(this)` in the workflow bundle (lexical-`this`
    //     arrow steps). The wrapper invokes the body via
    //     `stepFn.apply(boundThis, args)` so the body sees the same
    //     `this` it would have had in the workflow bundle. Property
    //     presence, not truthiness, is significant because
    //     `bind(null)` and `bind(undefined)` are both legal and should
    //     round-trip faithfully.
    //   - `boundArgs`:   prefilled args from
    //     `useStep(...).bind(thisArg, x, y)`. Prepended to the call args
    //     so partial application survives serialization.
    StepFunction: /* @__PURE__ */ __name((value) => {
      const stepId = value.stepId;
      const closureVars = value.closureVars;
      const hasBoundThis = "boundThis" in value;
      const boundThis = hasBoundThis ? value.boundThis : void 0;
      const boundArgs = Array.isArray(value.boundArgs) ? value.boundArgs : [];
      const stepFn = getStepFunction(stepId);
      if (!stepFn) {
        throw new SerializationError(`Step function "${stepId}" not found. Make sure the step function is registered.`, {
          hint: "Make sure the step file is included in your build (i.e. it is listed in the workflow manifest), and that the SWC plugin is configured for the file."
        });
      }
      if (!closureVars && !hasBoundThis && boundArgs.length === 0) {
        return stepFn;
      }
      const wrappedStepFn = /* @__PURE__ */ __name(function(...args) {
        const callThis = hasBoundThis ? boundThis : this;
        const callArgs = boundArgs.length > 0 ? [
          ...boundArgs,
          ...args
        ] : args;
        if (closureVars) {
          const currentContext = contextStorage.getStore();
          if (!currentContext) {
            throw new WorkflowRuntimeError("Cannot call step function with closure variables outside step context");
          }
          const newContext = {
            ...currentContext,
            closureVars
          };
          return contextStorage.run(newContext, () => stepFn.apply(callThis, callArgs));
        }
        return stepFn.apply(callThis, callArgs);
      }, "wrappedStepFn");
      Object.defineProperty(wrappedStepFn, "name", {
        value: stepFn.name
      });
      Object.defineProperty(wrappedStepFn, "stepId", {
        value: stepId,
        writable: false,
        enumerable: false,
        configurable: false
      });
      if (stepFn.maxRetries !== void 0) {
        wrappedStepFn.maxRetries = stepFn.maxRetries;
      }
      return wrappedStepFn;
    }, "StepFunction"),
    WorkflowFunction: /* @__PURE__ */ __name((value) => Object.assign(() => {
      throw new SerializationError("Workflow functions cannot be called directly. Use start() to invoke them.", {
        hint: "Wrap the workflow with `start(workflowFn, { ... })` from `workflow` to begin a run instead of invoking it like a normal function."
      });
    }, {
      workflowId: value.workflowId
    }), "WorkflowFunction"),
    Request: /* @__PURE__ */ __name((value) => {
      const responseWritable = value.responseWritable;
      const init = {
        method: value.method,
        headers: new global2.Headers(value.headers),
        body: value.body,
        duplex: value.duplex
      };
      if (value.signal) init.signal = value.signal;
      const request = new global2.Request(value.url, init);
      if (value.signal) copyAbortInternals(value.signal, request.signal);
      if (responseWritable) {
        request.respondWith = async (response) => {
          const writer = responseWritable.getWriter();
          await writer.write(response);
          await writer.close();
        };
      }
      return request;
    }, "Request"),
    Response: /* @__PURE__ */ __name((value) => {
      return new global2.Response(value.body, {
        status: value.status,
        statusText: value.statusText,
        headers: new global2.Headers(value.headers)
      });
    }, "Response"),
    ReadableStream: /* @__PURE__ */ __name((value) => {
      if ("bodyInit" in value) {
        const bodyInit = value.bodyInit;
        const response = new global2.Response(bodyInit);
        return response.body;
      }
      const readable = new WorkflowServerReadableStream(runId, value.name);
      if (value.type === "bytes") {
        const state = createFlushableState();
        ops.push(state.promise);
        const { readable: userReadable, writable } = value.framing === "framed-v1" ? getByteUnframingStream() : new global2.TransformStream();
        flushablePipe(readable, writable, state).catch(() => {
        });
        pollReadableLock(userReadable, state);
        return userReadable;
      } else {
        const transform = getDeserializeStream(getStepRevivers(global2, ops, runId, cryptoKey, deploymentId, streamStates, runReadyBarrier), cryptoKey);
        const state = createFlushableState();
        ops.push(state.promise);
        flushablePipe(readable, transform.writable, state).catch(() => {
        });
        pollReadableLock(transform.readable, state);
        return transform.readable;
      }
    }, "ReadableStream"),
    WritableStream: /* @__PURE__ */ __name((value) => {
      const targetRunId = typeof value.runId === "string" ? value.runId : runId;
      const targetDeploymentId = typeof value.deploymentId === "string" ? value.deploymentId : targetRunId === runId ? deploymentId : void 0;
      const targetKey = targetRunId === runId ? cryptoKey : lazyForwardedWritableEncryptionKey(targetRunId, targetDeploymentId, value.encryptionPublicKey);
      const targetRunReady = targetRunId === runId ? runReadyBarrier : void 0;
      const serialize3 = getSerializeStream(getStepReducers(global2, ops, targetRunId, targetKey, false, targetRunReady), targetKey);
      const serverWritable = new WorkflowServerWritableStream(targetRunId, value.name, targetRunReady);
      const state = createFlushableState();
      state.deferReleaseSettlement = streamStates !== void 0;
      streamStates?.push(state);
      ops.push(state.promise);
      flushablePipe(serialize3.readable, serverWritable, state).catch(() => {
      });
      const writable = trackFlushableWritable(serialize3.writable, state, global2.WritableStream);
      pollWritableLock(writable, state);
      Object.defineProperty(writable, STREAM_NAME_SYMBOL, {
        value: value.name,
        writable: false
      });
      Object.defineProperty(writable, STREAM_SERVER_RUN_ID_SYMBOL, {
        value: targetRunId,
        writable: false
      });
      if (targetDeploymentId) {
        Object.defineProperty(writable, STREAM_SERVER_DEPLOYMENT_ID_SYMBOL, {
          value: targetDeploymentId,
          writable: false
        });
      }
      if (typeof value.encryptionPublicKey !== "string" && targetRunId === runId && isRunPayloadKeys(cryptoKey)) {
        Object.defineProperty(writable, STREAM_SERVER_PUBLIC_KEY_SYMBOL, {
          value: bytesToBase64(cryptoKey.keyPair.publicKey),
          writable: false
        });
      }
      if (typeof value.encryptionPublicKey === "string") {
        Object.defineProperty(writable, STREAM_SERVER_PUBLIC_KEY_SYMBOL, {
          value: value.encryptionPublicKey,
          writable: false
        });
      }
      return writable;
    }, "WritableStream"),
    AbortController: /* @__PURE__ */ __name((value) => reviveAbortController(value, ops, runId), "AbortController"),
    AbortSignal: /* @__PURE__ */ __name((value) => reviveAbortSignal(value, ops, runId), "AbortSignal")
  };
}
async function maybeEncrypt(data2, key) {
  return await encrypt2(data2, key);
}
async function dehydrateWorkflowArguments(value, runId, key, ops = [], global2 = globalThis, v1Compat = false, framedByteStreams = false, compression = false, readbackOps = ops) {
  if (v1Compat) {
    const str = stringify(value, getExternalReducers(global2, ops, runId, key, framedByteStreams, void 0, readbackOps));
    return revive(str);
  }
  try {
    const compressionStats = {};
    const result = await serialize(value, key, {
      global: global2,
      extraReducers: getStreamAndRequestReducers(getExternalReducers(global2, ops, runId, key, framedByteStreams, void 0, readbackOps)),
      compression,
      compressionStats
    });
    await recordCompression(compressionStats, "serialize");
    return result;
  } catch (error) {
    const cause = unwrapSerializationCause(error);
    const { message, hint: hint2 } = formatSerializationError("workflow arguments", cause);
    throw new SerializationError(message, {
      hint: hint2,
      cause
    });
  }
}
async function hydrateWorkflowReturnValue(value, runId, key, ops = [], global2 = globalThis, extraRevivers = {}) {
  const compressionStats = {};
  const result = await deserialize(value, key, {
    global: global2,
    extraRevivers: {
      ...getStreamAndRequestRevivers(getExternalRevivers(global2, ops, runId, key)),
      ...extraRevivers
    },
    compressionStats
  });
  await recordCompression(compressionStats, "deserialize");
  return result;
}
async function dehydrateStepArguments(value, _runId, key, global2 = globalThis, v1Compat = false, compression = false, guestCodeStatsOut) {
  if (v1Compat) {
    const str = stringify(value, getWorkflowReducers(global2));
    return revive(str);
  }
  try {
    const compressionStats = {};
    const guestCodeStats = guestCodeStatsOut ?? {
      executions: []
    };
    const result = await serialize2(value, key, {
      global: global2,
      extraReducers: getStreamAndRequestReducers(getWorkflowReducers(global2)),
      compression,
      compressionStats,
      guestCodeStats
    });
    await recordCompression(compressionStats, "serialize");
    await recordGuestCodeExecutions(guestCodeStats);
    return result;
  } catch (error) {
    const cause = unwrapSerializationCause(error);
    const { message, hint: hint2 } = formatSerializationError("step arguments", cause);
    throw new SerializationError(message, {
      hint: hint2,
      cause
    });
  }
}
async function hydrateStepArguments(value, runId, key, ops = [], global2 = globalThis, extraRevivers = {}, deploymentId, streamStates, runReadyBarrier) {
  const compressionStats = {};
  const result = await deserialize2(value, key, {
    global: global2,
    extraRevivers: {
      ...getStreamAndRequestRevivers(getStepRevivers(global2, ops, runId, key, deploymentId, streamStates, runReadyBarrier)),
      ...extraRevivers
    },
    compressionStats
  });
  await recordCompression(compressionStats, "deserialize");
  return result;
}
async function dehydrateStepReturnValue(value, runId, key, ops = [], global2 = globalThis, v1Compat = false, framedByteStreams = false, compression = false, runReadyBarrier, readbackOps = ops) {
  if (v1Compat) {
    const str = stringify(value, getStepReducers(global2, ops, runId, key, framedByteStreams, runReadyBarrier, readbackOps));
    return revive(str);
  }
  try {
    const compressionStats = {};
    const result = await serialize2(value, key, {
      global: global2,
      extraReducers: getStreamAndRequestReducers(getStepReducers(global2, ops, runId, key, framedByteStreams, runReadyBarrier, readbackOps)),
      compression,
      compressionStats
    });
    await recordCompression(compressionStats, "serialize");
    return result;
  } catch (error) {
    const cause = unwrapSerializationCause(error);
    const { message, hint: hint2 } = formatSerializationError("step return value", cause);
    throw new SerializationError(message, {
      hint: hint2,
      cause
    });
  }
}
async function dehydrateDynamicWorkflowCode(code2, key, compression = false) {
  try {
    const payload = new TextEncoder().encode(stringify(code2));
    const serialized = encodeWithFormatPrefix(SerializationFormat.DEVALUE_V1, payload);
    const compressionStats = {};
    const compressed = await compress(serialized, compression, compressionStats);
    const encrypted = await maybeEncrypt(compressed, key);
    await recordCompression(compressionStats, "serialize");
    return encrypted;
  } catch (error) {
    const cause = unwrapSerializationCause(error);
    const { message, hint: hint2 } = formatSerializationError("dynamic workflow code", cause);
    throw new SerializationError(message, {
      hint: hint2,
      cause
    });
  }
}
async function hydrateRunError(value, runId, key, ops = [], global2 = globalThis, extraRevivers = {}, options) {
  const compressionStats = {};
  const decrypted = await decompress(await decrypt2(value, key), compressionStats);
  await recordCompression(compressionStats, "deserialize");
  if (!(decrypted instanceof Uint8Array)) {
    return unflatten(decrypted, {
      ...getExternalRevivers(global2, ops, runId, key, options),
      ...extraRevivers
    });
  }
  const { format, payload } = decodeFormatPrefix(decrypted);
  if (format === SerializationFormat.DEVALUE_V1) {
    const str = new TextDecoder().decode(payload);
    return parse(str, {
      ...getExternalRevivers(global2, ops, runId, key, options),
      ...extraRevivers
    });
  }
  throw new Error(`Unsupported serialization format: ${format}`);
}
function getStreamAndRequestReducers(allReducers) {
  const extra = {};
  for (const key of STREAM_AND_REQUEST_KEYS) {
    if (key in allReducers) {
      extra[key] = allReducers[key];
    }
  }
  return extra;
}
function getStreamAndRequestRevivers(allRevivers) {
  const extra = {};
  for (const key of STREAM_AND_REQUEST_KEYS) {
    if (key in allRevivers) {
      extra[key] = allRevivers[key];
    }
  }
  return extra;
}
var defaultUlid, FRAME_HEADER_SIZE, MAX_FRAME_SIZE, WorkflowServerReadableStream, FRAMED_STREAM_MAX_RECONNECTS, getFramedStreamMaxReconnects, FRAMED_STREAM_MAX_TOTAL_RECONNECTS, getFramedStreamMaxTotalReconnects, STREAM_FLUSH_INTERVAL_MS, getEnvStreamFlushIntervalMs, WorkflowServerWritableStream, STREAM_AND_REQUEST_KEYS;
var init_serialization2 = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/serialization.js"() {
    init_dist2();
    init_dist();
    init_env_config();
    init_src();
    init_node();
    init_encryption();
    init_flushable_stream();
    init_private();
    init_get_world_lazy();
    init_sealed_box();
    init_client();
    init_compression();
    init_encryption2();
    init_errors();
    init_format();
    init_hardened();
    init_class();
    init_common();
    init_step_function();
    init_step();
    init_types();
    init_workflow();
    init_context_storage();
    init_symbols();
    init_semantic_conventions();
    init_telemetry();
    init_util();
    init_abort_controller();
    defaultUlid = monotonicFactory();
    __name(getStreamType, "getStreamType");
    FRAME_HEADER_SIZE = 4;
    __name(unwrapSerializationCause, "unwrapSerializationCause");
    __name(recordCompression, "recordCompression");
    __name(recordGuestCodeExecutions, "recordGuestCodeExecutions");
    __name(getSerializeStream, "getSerializeStream");
    __name(getDeserializeStream, "getDeserializeStream");
    MAX_FRAME_SIZE = 1e8;
    __name(getByteFramingStream, "getByteFramingStream");
    __name(getByteUnframingStream, "getByteUnframingStream");
    __name(recordReadTimeToFirstChunk, "recordReadTimeToFirstChunk");
    __name(recordStreamReadKeyResolution, "recordStreamReadKeyResolution");
    __name(recordStreamReadComplete, "recordStreamReadComplete");
    WorkflowServerReadableStream = class extends ReadableStream {
      static {
        __name(this, "WorkflowServerReadableStream");
      }
      #reader;
      constructor(runId, name, startIndex) {
        if (typeof name !== "string" || name.length === 0) {
          throw new WorkflowRuntimeError(`"name" is required, got "${name}"`);
        }
        let readStart;
        let firstChunkReported = false;
        let connectMs;
        let chunksDelivered = 0;
        let bytesDelivered = 0;
        super({
          // @ts-expect-error Not sure why TypeScript is complaining about this
          type: "bytes",
          pull: /* @__PURE__ */ __name(async (controller) => {
            let reader = this.#reader;
            if (!reader) {
              if (readStart === void 0) readStart = Date.now();
              const world = await getWorldLazy();
              const connectStart = Date.now();
              const stream = await world.streams.get(runId, name, startIndex);
              connectMs = Date.now() - connectStart;
              reader = this.#reader = stream.getReader();
            }
            if (!reader) {
              controller.error(new Error("Failed to get reader"));
              return;
            }
            const result = await reader.read();
            if (result.done) {
              this.#reader = void 0;
              if (readStart !== void 0) {
                recordStreamReadComplete(readStart, runId, name, chunksDelivered, bytesDelivered);
              }
              controller.close();
            } else {
              if (!firstChunkReported && result.value.byteLength > 0 && readStart !== void 0) {
                firstChunkReported = true;
                recordReadTimeToFirstChunk(readStart, runId, name, startIndex, connectMs);
              }
              chunksDelivered += 1;
              bytesDelivered += result.value.byteLength;
              controller.enqueue(result.value);
            }
          }, "pull"),
          cancel: /* @__PURE__ */ __name(async (reason) => {
            if (this.#reader) {
              await this.#reader.cancel(reason).catch(() => {
              });
              this.#reader = void 0;
            }
          }, "cancel")
        });
      }
    };
    FRAMED_STREAM_MAX_RECONNECTS = 50;
    getFramedStreamMaxReconnects = /* @__PURE__ */ __name(() => envNumber("WORKFLOW_FRAMED_STREAM_MAX_RECONNECTS", FRAMED_STREAM_MAX_RECONNECTS, {
      integer: true,
      min: 1
    }), "getFramedStreamMaxReconnects");
    FRAMED_STREAM_MAX_TOTAL_RECONNECTS = 1e3;
    getFramedStreamMaxTotalReconnects = /* @__PURE__ */ __name(() => envNumber("WORKFLOW_FRAMED_STREAM_MAX_TOTAL_RECONNECTS", FRAMED_STREAM_MAX_TOTAL_RECONNECTS, {
      integer: true,
      min: 1
    }), "getFramedStreamMaxTotalReconnects");
    __name(createReconnectingFramedStream, "createReconnectingFramedStream");
    STREAM_FLUSH_INTERVAL_MS = 0;
    getEnvStreamFlushIntervalMs = /* @__PURE__ */ __name(() => {
      const value = envNumber("WORKFLOW_STREAM_FLUSH_INTERVAL_MS", Number.NaN, {
        integer: true
      });
      return Number.isNaN(value) ? void 0 : value;
    }, "getEnvStreamFlushIntervalMs");
    __name(recordStreamWriteFlush, "recordStreamWriteFlush");
    __name(recordStreamClose, "recordStreamClose");
    WorkflowServerWritableStream = class extends WritableStream {
      static {
        __name(this, "WorkflowServerWritableStream");
      }
      /**
       * @param runReadyBarrier Turbo mode only: a promise that resolves once the
       * backgrounded `run_started` has landed. When the step body runs
       * optimistically (before `run_started` is durable), the first chunk write to
       * a brand-new stream would otherwise reach the World before the run exists
       * and be rejected as run-not-found. Awaiting this once before the first
       * flush/close orders the write after the run's creation. `undefined` outside
       * turbo and on the await path, where the run was already durable.
       */
      constructor(runId, name, runReadyBarrier) {
        if (typeof runId !== "string") {
          throw new WorkflowRuntimeError(`"runId" must be a string, got "${typeof runId}"`);
        }
        if (typeof name !== "string" || name.length === 0) {
          throw new WorkflowRuntimeError(`"name" is required, got "${name}"`);
        }
        const worldPromise = getWorldLazy();
        let pendingRunReady = runReadyBarrier;
        const ensureRunReady = /* @__PURE__ */ __name(async () => {
          if (pendingRunReady) {
            try {
              await pendingRunReady;
            } catch {
            }
            pendingRunReady = void 0;
          }
        }, "ensureRunReady");
        const writerId = `wrtr_${defaultUlid()}`;
        const writeSessionPromise = ensureRunReady().then(async () => {
          const world = await worldPromise;
          return world.streams.createWriteSession?.(runId, name, {
            writerId
          });
        });
        let nextChunkSeq = 0;
        let buffer2 = [];
        let bufferBytes = 0;
        let inFlightChunks = 0;
        let inFlightBytes = 0;
        let flushTimer = null;
        let inFlight = null;
        let sinkError;
        let resolvedFlushIntervalMs = getEnvStreamFlushIntervalMs();
        let _flushIntervalResolution = null;
        const maxChunksPerRequest = getMaxChunksPerBatch();
        const maxBytesPerRequest = getMaxBytesPerBatch();
        const maxBufferedChunks = getMaxInflightChunks();
        const maxBufferedBytes = getMaxBufferedBytes();
        let bufferT0;
        let capacityWaiters = [];
        let drainWaiters = [];
        const rejectWaiters = /* @__PURE__ */ __name((err) => {
          const all = [
            ...capacityWaiters,
            ...drainWaiters
          ];
          capacityWaiters = [];
          drainWaiters = [];
          for (const w of all) w.reject(err);
        }, "rejectWaiters");
        const takeGroup = /* @__PURE__ */ __name(() => {
          let count = 0;
          let bytes = 0;
          for (const chunk of buffer2) {
            if (count >= maxChunksPerRequest) break;
            if (count > 0 && bytes + chunk.byteLength > maxBytesPerRequest) break;
            count++;
            bytes += chunk.byteLength;
          }
          const group = buffer2.slice(0, count);
          buffer2 = buffer2.slice(count);
          bufferBytes -= bytes;
          return {
            group,
            bytes
          };
        }, "takeGroup");
        const sendGroup = /* @__PURE__ */ __name(async (group, bytes, groupT0) => {
          await ensureRunReady();
          const world = await worldPromise;
          const session = await writeSessionPromise;
          const dispatchAt = Date.now();
          if (session) {
            await session.write(nextChunkSeq, group);
          } else if (typeof world.streams.writeMulti === "function" && group.length > 1) {
            await world.streams.writeMulti(runId, name, group);
          } else {
            for (const chunk of group) {
              await world.streams.write(runId, name, chunk);
            }
          }
          nextChunkSeq += group.length;
          if (groupT0 !== void 0) {
            recordStreamWriteFlush(groupT0, dispatchAt, runId, name, group.length, bytes, Date.now() - dispatchAt);
          }
        }, "sendGroup");
        const dispatchLoop = /* @__PURE__ */ __name(async () => {
          while (buffer2.length > 0) {
            if (flushTimer) {
              clearTimeout(flushTimer);
              flushTimer = null;
            }
            const groupT0 = bufferT0;
            const groupTakenAt = Date.now();
            const { group, bytes } = takeGroup();
            inFlightChunks = group.length;
            inFlightBytes = bytes;
            bufferT0 = buffer2.length > 0 ? groupTakenAt : void 0;
            try {
              await sendGroup(group, bytes, groupT0);
              inFlightChunks = 0;
              inFlightBytes = 0;
            } catch (error) {
              buffer2 = group.concat(buffer2);
              bufferBytes += bytes;
              inFlightChunks = 0;
              inFlightBytes = 0;
              bufferT0 = groupT0 !== void 0 && bufferT0 !== void 0 ? Math.min(groupT0, bufferT0) : groupT0 ?? bufferT0;
              throw error;
            }
            const relieved = capacityWaiters;
            capacityWaiters = [];
            for (const w of relieved) w.resolve();
          }
        }, "dispatchLoop");
        const startDispatch = /* @__PURE__ */ __name(() => {
          if (inFlight || sinkError !== void 0 || buffer2.length === 0) return;
          inFlight = dispatchLoop().then(() => {
            inFlight = null;
            if (buffer2.length > 0) {
              startDispatch();
              return;
            }
            const settled = drainWaiters;
            drainWaiters = [];
            for (const w of settled) w.resolve();
          }, (error) => {
            inFlight = null;
            sinkError ??= error;
            rejectWaiters(sinkError);
          });
        }, "startDispatch");
        const scheduleGroupCommit = /* @__PURE__ */ __name(() => {
          if (flushTimer || inFlight) return;
          if (resolvedFlushIntervalMs === void 0) {
            _flushIntervalResolution ??= Promise.resolve(worldPromise).then((world) => {
              resolvedFlushIntervalMs = world.streamFlushIntervalMs ?? STREAM_FLUSH_INTERVAL_MS;
            }, () => {
              resolvedFlushIntervalMs = STREAM_FLUSH_INTERVAL_MS;
            }).then(() => {
              if (buffer2.length > 0) scheduleGroupCommit();
            });
            return;
          }
          if (resolvedFlushIntervalMs <= 0) {
            startDispatch();
            return;
          }
          flushTimer = setTimeout(() => {
            flushTimer = null;
            startDispatch();
          }, resolvedFlushIntervalMs);
        }, "scheduleGroupCommit");
        const drain = /* @__PURE__ */ __name(async () => {
          while (true) {
            if (sinkError !== void 0) throw sinkError;
            if (buffer2.length === 0 && !inFlight) return;
            startDispatch();
            await new Promise((resolve, reject) => {
              drainWaiters.push({
                resolve,
                reject
              });
            });
          }
        }, "drain");
        super({
          async write(chunk) {
            if (sinkError !== void 0) throw sinkError;
            if (bufferT0 === void 0) bufferT0 = Date.now();
            buffer2.push(chunk);
            bufferBytes += chunk.byteLength;
            if (buffer2.length >= maxChunksPerRequest || bufferBytes >= maxBytesPerRequest) {
              startDispatch();
            } else {
              scheduleGroupCommit();
            }
            while (sinkError === void 0 && (buffer2.length + inFlightChunks >= maxBufferedChunks || bufferBytes + inFlightBytes >= maxBufferedBytes)) {
              startDispatch();
              await new Promise((resolve, reject) => {
                capacityWaiters.push({
                  resolve,
                  reject
                });
              });
            }
            if (sinkError !== void 0) throw sinkError;
          },
          async close() {
            await drain();
            await ensureRunReady();
            const world = await worldPromise;
            const session = await writeSessionPromise;
            const closeStart = Date.now();
            if (session) {
              await session.close();
            } else {
              await world.streams.close(runId, name);
            }
            recordStreamClose(closeStart, runId, name);
          },
          async abort(reason) {
            try {
              await drain();
            } catch {
            }
            if (flushTimer) {
              clearTimeout(flushTimer);
              flushTimer = null;
            }
            buffer2 = [];
            bufferBytes = 0;
            sinkError ??= reason ?? new Error("Stream aborted");
            rejectWaiters(sinkError);
            const session = await writeSessionPromise.catch(() => void 0);
            await session?.dispose?.();
          }
        });
        Object.defineProperty(this, STREAM_DRAIN_SYMBOL, {
          value: drain,
          enumerable: false,
          writable: false
        });
        Object.defineProperty(this, STREAM_RELEASE_SYMBOL, {
          value: /* @__PURE__ */ __name(async () => {
            const session = await writeSessionPromise.catch(() => void 0);
            await session?.release?.();
          }, "value"),
          enumerable: false,
          writable: false
        });
      }
    };
    __name(getAllBaseReducers, "getAllBaseReducers");
    __name(reduceAbortWithListener, "reduceAbortWithListener");
    __name(reduceAbortBySymbol, "reduceAbortBySymbol");
    __name(attachAbortListenerOnce, "attachAbortListenerOnce");
    __name(getExternalReducers, "getExternalReducers");
    __name(getHostClassPrototype, "getHostClassPrototype");
    __name(getWorkflowReducers, "getWorkflowReducers");
    __name(getStepReducers, "getStepReducers");
    __name(setupAbortStreamReader, "setupAbortStreamReader");
    __name(tagAbortPair, "tagAbortPair");
    __name(copyAbortInternals, "copyAbortInternals");
    __name(reviveAbortController, "reviveAbortController");
    __name(reviveAbortSignal, "reviveAbortSignal");
    __name(getCommonRevivers2, "getCommonRevivers");
    __name(getForwardedWritableEncryptionKey, "getForwardedWritableEncryptionKey");
    __name(lazyForwardedWritableEncryptionKey, "lazyForwardedWritableEncryptionKey");
    __name(tagForwardedWritableTarget, "tagForwardedWritableTarget");
    __name(createForwardedWritable, "createForwardedWritable");
    __name(getRunReadableStream, "getRunReadableStream");
    __name(getLazyReadableStream, "getLazyReadableStream");
    __name(getExternalRevivers, "getExternalRevivers");
    __name(getStepRevivers, "getStepRevivers");
    __name(maybeEncrypt, "maybeEncrypt");
    __name(dehydrateWorkflowArguments, "dehydrateWorkflowArguments");
    __name(hydrateWorkflowReturnValue, "hydrateWorkflowReturnValue");
    __name(dehydrateStepArguments, "dehydrateStepArguments");
    __name(hydrateStepArguments, "hydrateStepArguments");
    __name(dehydrateStepReturnValue, "dehydrateStepReturnValue");
    __name(dehydrateDynamicWorkflowCode, "dehydrateDynamicWorkflowCode");
    __name(hydrateRunError, "hydrateRunError");
    STREAM_AND_REQUEST_KEYS = [
      "ReadableStream",
      "WritableStream",
      "Request",
      "Response",
      "StepFunction",
      // Wire AbortController/AbortSignal through the client serialization path so
      // signals reachable via Request.signal (or as direct arguments) get their
      // dedicated reducer. Without this, devalue falls back to its arbitrary-POJO
      // path and fails for any signal the Request reducer forwards.
      "AbortController",
      "AbortSignal"
    ];
    __name(getStreamAndRequestReducers, "getStreamAndRequestReducers");
    __name(getStreamAndRequestRevivers, "getStreamAndRequestRevivers");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/capabilities.js
function nodeVersionSupportsZstd(nodeVersion) {
  if (typeof nodeVersion !== "string" || !import_semver.default.valid(nodeVersion)) {
    return false;
  }
  return import_semver.default.satisfies(nodeVersion, ZSTD_NODE_RANGE);
}
function getCurrentNodeVersion() {
  try {
    const versions = globalThis.process?.versions;
    if (!versions || versions.bun || versions.deno) return void 0;
    return typeof versions.node === "string" ? versions.node : void 0;
  } catch {
    return void 0;
  }
}
function getRunCapabilities(workflowCoreVersion, nodeVersion) {
  if (!workflowCoreVersion || !import_semver.default.valid(workflowCoreVersion)) {
    return {
      supportedFormats: BASELINE_FORMATS,
      framedByteStreams: false
    };
  }
  const formats = new Set(BASELINE_FORMATS);
  for (const { format, minVersion } of FORMAT_VERSION_TABLE) {
    if (import_semver.default.gte(workflowCoreVersion, minVersion)) {
      formats.add(format);
    }
  }
  if (!nodeVersionSupportsZstd(nodeVersion)) {
    formats.delete(SerializationFormat.ZSTD);
  }
  const result = {
    supportedFormats: formats,
    framedByteStreams: false
  };
  for (const { capability, minVersion } of CAPABILITY_VERSION_TABLE) {
    if (import_semver.default.gte(workflowCoreVersion, minVersion)) {
      result[capability] = true;
    }
  }
  return result;
}
function getCompressionMode(capabilities) {
  if (!capabilities.supportedFormats.has(SerializationFormat.GZIP)) {
    return false;
  }
  return capabilities.supportedFormats.has(SerializationFormat.ZSTD) ? true : "gzip";
}
var import_semver, FORMAT_VERSION_TABLE, CAPABILITY_VERSION_TABLE, BASELINE_FORMATS, ZSTD_NODE_RANGE;
var init_capabilities = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/capabilities.js"() {
    import_semver = __toESM(require_semver2(), 1);
    init_serialization2();
    FORMAT_VERSION_TABLE = [
      {
        format: SerializationFormat.ENCRYPTED,
        minVersion: "4.2.0-beta.64"
      },
      // TODO(release): verify this matches the actual version that ships payload
      // compression. If a "Version Packages (beta)" PR merges before this change,
      // bump to the next beta. A too-low cutoff makes new producers write
      // compressed payloads to consumers that cannot decompress them; too-high
      // merely delays the optimization (safe). gzip and zstd ship together, so
      // they share a min version. zstd additionally requires the run's runtime to
      // decode it; see `getRunCapabilities`.
      {
        format: SerializationFormat.GZIP,
        minVersion: "5.0.0-beta.18"
      },
      {
        format: SerializationFormat.ZSTD,
        minVersion: "5.0.0-beta.18"
      },
      // TODO(release): verify this matches the actual version that ships sealed-box
      // encryption. If a "Version Packages (beta)" PR merges before this change,
      // bump to the next beta. Unlike the entries above, a wrong cutoff here is
      // not a correctness hazard: producers gate `encp` on the target run carrying
      // an `encryptionPublicKey`, not on this table (see History above).
      {
        format: SerializationFormat.SEALED,
        minVersion: "5.0.0-beta.37"
      }
    ];
    CAPABILITY_VERSION_TABLE = [
      // TODO(release): verify this matches the actual version that ships byte-stream
      // framing. If a "Version Packages (beta)" PR merges before this change, bump
      // to the next beta. A too-low cutoff makes new producers write framed bytes to
      // consumers that cannot unframe them (silent corruption); too-high merely
      // delays the optimization (safe).
      {
        capability: "framedByteStreams",
        minVersion: "5.0.0-beta.15"
      }
    ];
    BASELINE_FORMATS = /* @__PURE__ */ new Set([
      SerializationFormat.DEVALUE_V1
    ]);
    ZSTD_NODE_RANGE = "^22.15.0 || >=23.8.0";
    __name(nodeVersionSupportsZstd, "nodeVersionSupportsZstd");
    __name(getCurrentNodeVersion, "getCurrentNodeVersion");
    __name(getRunCapabilities, "getRunCapabilities");
    __name(getCompressionMode, "getCompressionMode");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/version.js
var version;
var init_version = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/version.js"() {
    version = "5.2.3";
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/constants.js
function isDynamicWorkflowsEnabled() {
  const raw = process.env[DYNAMIC_WORKFLOWS_ENV];
  if (raw === void 0) return false;
  return raw === "1" || raw.toLowerCase() === "true";
}
var warned, DYNAMIC_WORKFLOWS_ENV;
var init_constants2 = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/constants.js"() {
    init_dist();
    init_dist3();
    init_logger();
    warned = globalSingleton("@workflow/core//envWarnings", 1, () => ({
      replayTimeoutValues: /* @__PURE__ */ new Set(),
      maxInlineStepsValues: /* @__PURE__ */ new Set(),
      maxEventsValues: /* @__PURE__ */ new Set()
    }));
    DYNAMIC_WORKFLOWS_ENV = "WORKFLOW_EXPERIMENTAL_DYNAMIC_WORKFLOWS";
    __name(isDynamicWorkflowsEnabled, "isDynamicWorkflowsEnabled");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/helpers.js
function getWorkflowQueueName(workflowName, namespace) {
  if (!SAFE_WORKFLOW_NAME_PATTERN.test(workflowName)) {
    throw new Error(`Invalid workflow name "${workflowName}": must only contain alphanumeric characters, underscores, hyphens, dots, forward slashes, at signs, parentheses, or square brackets`);
  }
  const prefix = getQueueTopicPrefix("workflow", resolveQueueNamespace(namespace));
  return `${prefix}${workflowName}`;
}
function getHealthCheckStreamName(correlationId) {
  return `__health_check__${correlationId}`;
}
function generateHealthCheckRunId(correlationId) {
  return `wrun_hc_${correlationId}`;
}
function withDeadline(promise, ms2) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Operation timed out after ${ms2}ms`)), ms2);
    })
  ]).finally(() => clearTimeout(timer));
}
async function readStreamWithTimeout(reader, readTimeout) {
  const chunks = [];
  let done = false;
  let timedOut = false;
  while (!done && !timedOut) {
    const readPromise = reader.read();
    const timeoutPromise = new Promise((resolve) => setTimeout(() => {
      timedOut = true;
      resolve({
        done: true,
        value: void 0
      });
    }, readTimeout));
    const result = await Promise.race([
      readPromise,
      timeoutPromise
    ]);
    done = result.done;
    if (result.value) chunks.push(result.value);
  }
  return {
    chunks,
    timedOut
  };
}
function parseHealthCheckResponse(chunks) {
  if (chunks.length === 0) return null;
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset2 = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset2);
    offset2 += chunk.length;
  }
  const responseText = new TextDecoder().decode(combined);
  let response;
  try {
    response = JSON.parse(responseText);
  } catch {
    if (responseText.length > 0) {
      return {
        healthy: true,
        format: "text"
      };
    }
    return null;
  }
  if (typeof response !== "object" || response === null || !("healthy" in response) || typeof response.healthy !== "boolean") {
    return null;
  }
  const r = response;
  const parsed = {
    healthy: r.healthy,
    format: "json"
  };
  if (typeof r.specVersion === "number") {
    parsed.specVersion = r.specVersion;
  }
  if (typeof r.workflowCoreVersion === "string") {
    parsed.workflowCoreVersion = r.workflowCoreVersion;
  }
  if (typeof r.nodeVersion === "string") {
    parsed.nodeVersion = r.nodeVersion;
  }
  if (typeof r.encryptionPublicKey === "string") {
    parsed.encryptionPublicKey = r.encryptionPublicKey;
  }
  if (typeof r.hookResumeInputVersion === "number") {
    parsed.hookResumeInputVersion = r.hookResumeInputVersion;
  }
  if (typeof r.dynamicWorkflowVersion === "number") {
    parsed.dynamicWorkflowVersion = r.dynamicWorkflowVersion;
  }
  return parsed;
}
async function healthCheck(world, options) {
  const timeout = options?.timeout ?? DEFAULT_HEALTH_CHECK_TIMEOUT;
  const correlationId = world.createRunId?.() ?? generateId();
  const streamName = getHealthCheckStreamName(correlationId);
  const queueName = `${getQueueTopicPrefix("workflow", resolveQueueNamespace(options?.namespace))}health_check`;
  const startTime = Date.now();
  try {
    await world.queue(queueName, {
      __healthCheck: true,
      correlationId,
      // Sent as `probeRunId`, never `runId`: a 4.x responder would parse a
      // `runId`-bearing probe as a run invocation (see
      // `HealthCheckPayloadSchema`).
      ...options?.runId ? {
        probeRunId: options.runId
      } : {}
    }, {
      // Use JSON transport so the health check works against both
      // old (JSON-only) and new (dual) deployments.
      specVersion: SPEC_VERSION_LEGACY,
      deploymentId: options?.deploymentId
    });
    while (Date.now() - startTime < timeout) {
      try {
        const remainingMs = timeout - (Date.now() - startTime);
        const stream = await withDeadline(world.streams.get(generateHealthCheckRunId(correlationId), streamName), remainingMs);
        const reader = stream.getReader();
        const { chunks, timedOut } = await readStreamWithTimeout(reader, HEALTH_CHECK_READ_TIMEOUT);
        if (timedOut) {
          try {
            reader.cancel();
          } catch {
          }
          await new Promise((resolve) => setTimeout(resolve, HEALTH_CHECK_POLL_INTERVAL));
          continue;
        }
        const response = parseHealthCheckResponse(chunks);
        if (response) {
          return {
            ...response,
            latencyMs: Date.now() - startTime
          };
        }
        await new Promise((resolve) => setTimeout(resolve, HEALTH_CHECK_POLL_INTERVAL));
      } catch {
        await new Promise((resolve) => setTimeout(resolve, HEALTH_CHECK_POLL_INTERVAL));
      }
    }
    return {
      healthy: false,
      error: `Health check timed out after ${timeout}ms`
    };
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
var DEFAULT_HEALTH_CHECK_TIMEOUT, SAFE_WORKFLOW_NAME_PATTERN, generateId, HEALTH_CHECK_POLL_INTERVAL, HEALTH_CHECK_READ_TIMEOUT;
var init_helpers = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/helpers.js"() {
    init_dist2();
    init_dist3();
    init_node();
    init_capabilities();
    init_logger();
    init_sealed_box();
    init_encryption2();
    init_semantic_conventions();
    init_telemetry();
    init_version();
    init_constants2();
    init_get_world_lazy();
    DEFAULT_HEALTH_CHECK_TIMEOUT = 3e4;
    SAFE_WORKFLOW_NAME_PATTERN = /^[a-zA-Z0-9_\-./@()[\]]+$/;
    __name(getWorkflowQueueName, "getWorkflowQueueName");
    generateId = monotonicFactory();
    __name(getHealthCheckStreamName, "getHealthCheckStreamName");
    __name(generateHealthCheckRunId, "generateHealthCheckRunId");
    HEALTH_CHECK_POLL_INTERVAL = 100;
    HEALTH_CHECK_READ_TIMEOUT = 500;
    __name(withDeadline, "withDeadline");
    __name(readStreamWithTimeout, "readStreamWithTimeout");
    __name(parseHealthCheckResponse, "parseHealthCheckResponse");
    __name(healthCheck, "healthCheck");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/hook-wake.js
function isRetryableWakeError(error, isDeploymentUnavailableError) {
  if (isDeploymentUnavailableError?.(error)) return false;
  const status = error ?? {};
  const code2 = status.status ?? status.statusCode;
  if (typeof code2 === "number") {
    return code2 >= 500 || code2 === 408 || code2 === 429;
  }
  const name = error?.name;
  return name !== "BadRequestError" && name !== "UnauthorizedError" && name !== "ForbiddenError";
}
async function publishHookWakeWithRetry(publish, isDeploymentUnavailableError) {
  let lastError;
  for (let attempt = 0; attempt <= HOOK_WAKE_RETRY_DELAYS_MS.length; attempt++) {
    try {
      await publish();
      return;
    } catch (error) {
      lastError = error;
      if (!isRetryableWakeError(error, isDeploymentUnavailableError)) break;
      const delayMs = HOOK_WAKE_RETRY_DELAYS_MS[attempt];
      if (delayMs !== void 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  if (HookNotFoundError.is(lastError)) {
    throw new WorkflowRuntimeError("The hook resume was committed, but its workflow wake could not be published", {
      cause: lastError
    });
  }
  throw lastError;
}
var HOOK_WAKE_RETRY_DELAYS_MS, FORCE_CLAIM_WAKE_REPUBLISH_WINDOW_MS;
var init_hook_wake = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/hook-wake.js"() {
    init_dist2();
    init_dist3();
    init_logger();
    init_helpers();
    HOOK_WAKE_RETRY_DELAYS_MS = [
      25,
      100
    ];
    __name(isRetryableWakeError, "isRetryableWakeError");
    __name(publishHookWakeWithRetry, "publishHookWakeWithRetry");
    FORCE_CLAIM_WAKE_REPUBLISH_WINDOW_MS = 24 * 60 * 60 * 1e3;
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/invocations.js
import { z as z13 } from "zod";
var HookInvocationSchema, HookInvocationResultSchema;
var init_invocations = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/invocations.js"() {
    init_dist2();
    init_dist3();
    init_semantic_conventions();
    init_telemetry();
    HookInvocationSchema = z13.object({
      type: z13.literal("hook_resume"),
      version: z13.literal(1),
      hookId: z13.string(),
      token: z13.string(),
      payload: z13.instanceof(Uint8Array)
    });
    HookInvocationResultSchema = z13.discriminatedUnion("status", [
      z13.object({
        status: z13.literal("accepted")
      }),
      z13.object({
        status: z13.literal("rejected"),
        code: z13.enum([
          "HOOK_NOT_FOUND",
          "INVALID_INPUT"
        ])
      })
    ]);
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/run-spec-version.js
function specVersionForRunWrite(runSpecVersion, whenUnknown = SPEC_VERSION_CURRENT) {
  return Math.min(SPEC_VERSION_CURRENT, runSpecVersion ?? whenUnknown);
}
var init_run_spec_version = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/run-spec-version.js"() {
    init_spec_version();
    __name(specVersionForRunWrite, "specVersionForRunWrite");
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/headers.js
var require_headers = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/headers.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var headers_exports = {};
    __export2(headers_exports, {
      CITY_HEADER_NAME: /* @__PURE__ */ __name(() => CITY_HEADER_NAME, "CITY_HEADER_NAME"),
      COUNTRY_HEADER_NAME: /* @__PURE__ */ __name(() => COUNTRY_HEADER_NAME, "COUNTRY_HEADER_NAME"),
      EMOJI_FLAG_UNICODE_STARTING_POSITION: /* @__PURE__ */ __name(() => EMOJI_FLAG_UNICODE_STARTING_POSITION, "EMOJI_FLAG_UNICODE_STARTING_POSITION"),
      IP_HEADER_NAME: /* @__PURE__ */ __name(() => IP_HEADER_NAME, "IP_HEADER_NAME"),
      LATITUDE_HEADER_NAME: /* @__PURE__ */ __name(() => LATITUDE_HEADER_NAME, "LATITUDE_HEADER_NAME"),
      LONGITUDE_HEADER_NAME: /* @__PURE__ */ __name(() => LONGITUDE_HEADER_NAME, "LONGITUDE_HEADER_NAME"),
      POSTAL_CODE_HEADER_NAME: /* @__PURE__ */ __name(() => POSTAL_CODE_HEADER_NAME, "POSTAL_CODE_HEADER_NAME"),
      REGION_HEADER_NAME: /* @__PURE__ */ __name(() => REGION_HEADER_NAME, "REGION_HEADER_NAME"),
      REQUEST_ID_HEADER_NAME: /* @__PURE__ */ __name(() => REQUEST_ID_HEADER_NAME, "REQUEST_ID_HEADER_NAME"),
      geolocation: /* @__PURE__ */ __name(() => geolocation2, "geolocation"),
      ipAddress: /* @__PURE__ */ __name(() => ipAddress2, "ipAddress")
    });
    module.exports = __toCommonJS(headers_exports);
    var CITY_HEADER_NAME = "x-vercel-ip-city";
    var COUNTRY_HEADER_NAME = "x-vercel-ip-country";
    var IP_HEADER_NAME = "x-real-ip";
    var LATITUDE_HEADER_NAME = "x-vercel-ip-latitude";
    var LONGITUDE_HEADER_NAME = "x-vercel-ip-longitude";
    var REGION_HEADER_NAME = "x-vercel-ip-country-region";
    var POSTAL_CODE_HEADER_NAME = "x-vercel-ip-postal-code";
    var REQUEST_ID_HEADER_NAME = "x-vercel-id";
    var EMOJI_FLAG_UNICODE_STARTING_POSITION = 127397;
    function getHeader(headers, key) {
      return headers.get(key) ?? void 0;
    }
    __name(getHeader, "getHeader");
    function hasRequestHeaders(input) {
      return "headers" in input && typeof input.headers?.get === "function";
    }
    __name(hasRequestHeaders, "hasRequestHeaders");
    function getHeaderWithDecode(request, key) {
      const header = getHeader(request.headers, key);
      return header ? decodeURIComponent(header) : void 0;
    }
    __name(getHeaderWithDecode, "getHeaderWithDecode");
    function getFlag(countryCode) {
      const regex = new RegExp("^[A-Z]{2}$").test(countryCode);
      if (!countryCode || !regex) return void 0;
      return String.fromCodePoint(...countryCode.split("").map((char) => EMOJI_FLAG_UNICODE_STARTING_POSITION + char.charCodeAt(0)));
    }
    __name(getFlag, "getFlag");
    function ipAddress2(input) {
      const headers = hasRequestHeaders(input) ? input.headers : input;
      return getHeader(headers, IP_HEADER_NAME);
    }
    __name(ipAddress2, "ipAddress");
    function getRegionFromRequestId(requestId) {
      if (!requestId) {
        return "dev1";
      }
      return requestId.split(":")[0];
    }
    __name(getRegionFromRequestId, "getRegionFromRequestId");
    function geolocation2(request) {
      return {
        // city name may be encoded to support multi-byte characters
        city: getHeaderWithDecode(request, CITY_HEADER_NAME),
        country: getHeader(request.headers, COUNTRY_HEADER_NAME),
        flag: getFlag(getHeader(request.headers, COUNTRY_HEADER_NAME)),
        countryRegion: getHeader(request.headers, REGION_HEADER_NAME),
        region: getRegionFromRequestId(getHeader(request.headers, REQUEST_ID_HEADER_NAME)),
        latitude: getHeader(request.headers, LATITUDE_HEADER_NAME),
        longitude: getHeader(request.headers, LONGITUDE_HEADER_NAME),
        postalCode: getHeader(request.headers, POSTAL_CODE_HEADER_NAME)
      };
    }
    __name(geolocation2, "geolocation");
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/get-env.js
var require_get_env = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/get-env.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var get_env_exports = {};
    __export2(get_env_exports, {
      getEnv: /* @__PURE__ */ __name(() => getEnv2, "getEnv")
    });
    module.exports = __toCommonJS(get_env_exports);
    var getEnv2 = /* @__PURE__ */ __name((env = process.env) => ({
      /**
      * An indicator to show that System Environment Variables have been exposed to your project's Deployments.
      * @example "1"
      */
      VERCEL: get(env, "VERCEL"),
      /**
      * An indicator that the code is running in a Continuous Integration environment.
      * @example "1"
      */
      CI: get(env, "CI"),
      /**
      * The Environment that the app is deployed and running on.
      * @example "production"
      */
      VERCEL_ENV: get(env, "VERCEL_ENV"),
      /**
      * The domain name of the generated deployment URL. The value does not include the protocol scheme https://.
      * NOTE: This Variable cannot be used in conjunction with Standard Deployment Protection.
      * @example "*.vercel.app"
      */
      VERCEL_URL: get(env, "VERCEL_URL"),
      /**
      * The domain name of the generated Git branch URL. The value does not include the protocol scheme https://.
      * @example "*-git-*.vercel.app"
      */
      VERCEL_BRANCH_URL: get(env, "VERCEL_BRANCH_URL"),
      /**
      * A production domain name of the project. This is useful to reliably generate links that point to production such as OG-image URLs.
      * The value does not include the protocol scheme https://.
      * @example "myproject.vercel.app"
      */
      VERCEL_PROJECT_PRODUCTION_URL: get(env, "VERCEL_PROJECT_PRODUCTION_URL"),
      /**
      * The ID of the Region where the app is running.
      *
      * Possible values:
      * - arn1 (Stockholm, Sweden)
      * - bom1 (Mumbai, India)
      * - cdg1 (Paris, France)
      * - cle1 (Cleveland, USA)
      * - cpt1 (Cape Town, South Africa)
      * - dub1 (Dublin, Ireland)
      * - fra1 (Frankfurt, Germany)
      * - gru1 (São Paulo, Brazil)
      * - hkg1 (Hong Kong)
      * - hnd1 (Tokyo, Japan)
      * - iad1 (Washington, D.C., USA)
      * - icn1 (Seoul, South Korea)
      * - kix1 (Osaka, Japan)
      * - lhr1 (London, United Kingdom)
      * - pdx1 (Portland, USA)
      * - sfo1 (San Francisco, USA)
      * - sin1 (Singapore)
      * - syd1 (Sydney, Australia)
      * - dev1 (Development Region)
      *
      * @example "iad1"
      */
      VERCEL_REGION: get(env, "VERCEL_REGION"),
      /**
      * The unique identifier for the deployment, which can be used to implement Skew Protection.
      * @example "dpl_7Gw5ZMBpQA8h9GF832KGp7nwbuh3"
      */
      VERCEL_DEPLOYMENT_ID: get(env, "VERCEL_DEPLOYMENT_ID"),
      /**
      * When Skew Protection is enabled in Project Settings, this value is set to 1.
      * @example "1"
      */
      VERCEL_SKEW_PROTECTION_ENABLED: get(env, "VERCEL_SKEW_PROTECTION_ENABLED"),
      /**
      * The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings.
      */
      VERCEL_AUTOMATION_BYPASS_SECRET: get(env, "VERCEL_AUTOMATION_BYPASS_SECRET"),
      /**
      * The Git Provider the deployment is triggered from.
      * @example "github"
      */
      VERCEL_GIT_PROVIDER: get(env, "VERCEL_GIT_PROVIDER"),
      /**
      * The origin repository the deployment is triggered from.
      * @example "my-site"
      */
      VERCEL_GIT_REPO_SLUG: get(env, "VERCEL_GIT_REPO_SLUG"),
      /**
      * The account that owns the repository the deployment is triggered from.
      * @example "acme"
      */
      VERCEL_GIT_REPO_OWNER: get(env, "VERCEL_GIT_REPO_OWNER"),
      /**
      * The ID of the repository the deployment is triggered from.
      * @example "117716146"
      */
      VERCEL_GIT_REPO_ID: get(env, "VERCEL_GIT_REPO_ID"),
      /**
      * The git branch of the commit the deployment was triggered by.
      * @example "improve-about-page"
      */
      VERCEL_GIT_COMMIT_REF: get(env, "VERCEL_GIT_COMMIT_REF"),
      /**
      * The git SHA of the commit the deployment was triggered by.
      * @example "fa1eade47b73733d6312d5abfad33ce9e4068081"
      */
      VERCEL_GIT_COMMIT_SHA: get(env, "VERCEL_GIT_COMMIT_SHA"),
      /**
      * The message attached to the commit the deployment was triggered by.
      * @example "Update about page"
      */
      VERCEL_GIT_COMMIT_MESSAGE: get(env, "VERCEL_GIT_COMMIT_MESSAGE"),
      /**
      * The username attached to the author of the commit that the project was deployed by.
      * @example "johndoe"
      */
      VERCEL_GIT_COMMIT_AUTHOR_LOGIN: get(env, "VERCEL_GIT_COMMIT_AUTHOR_LOGIN"),
      /**
      * The name attached to the author of the commit that the project was deployed by.
      * @example "John Doe"
      */
      VERCEL_GIT_COMMIT_AUTHOR_NAME: get(env, "VERCEL_GIT_COMMIT_AUTHOR_NAME"),
      /**
      * The git SHA of the last successful deployment for the project and branch.
      * NOTE: This Variable is only exposed when an Ignored Build Step is provided.
      * @example "fa1eade47b73733d6312d5abfad33ce9e4068080"
      */
      VERCEL_GIT_PREVIOUS_SHA: get(env, "VERCEL_GIT_PREVIOUS_SHA"),
      /**
      * The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string.
      * @example "23"
      */
      VERCEL_GIT_PULL_REQUEST_ID: get(env, "VERCEL_GIT_PULL_REQUEST_ID")
    }), "getEnv");
    var get = /* @__PURE__ */ __name((env, key) => {
      const value = env[key];
      return value === "" ? void 0 : value;
    }, "get");
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/get-context.js
var require_get_context = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/get-context.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var get_context_exports = {};
    __export2(get_context_exports, {
      SYMBOL_FOR_REQ_CONTEXT: /* @__PURE__ */ __name(() => SYMBOL_FOR_REQ_CONTEXT, "SYMBOL_FOR_REQ_CONTEXT"),
      getContext: /* @__PURE__ */ __name(() => getContext, "getContext")
    });
    module.exports = __toCommonJS(get_context_exports);
    var SYMBOL_FOR_REQ_CONTEXT = /* @__PURE__ */ Symbol.for("@vercel/request-context");
    function getContext() {
      const fromSymbol = globalThis;
      return fromSymbol[SYMBOL_FOR_REQ_CONTEXT]?.get?.() ?? {};
    }
    __name(getContext, "getContext");
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/deadline.js
var require_deadline = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/deadline.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var deadline_exports = {};
    __export2(deadline_exports, {
      getDeadline: /* @__PURE__ */ __name(() => getDeadline2, "getDeadline")
    });
    module.exports = __toCommonJS(deadline_exports);
    var import_get_context = require_get_context();
    function getDeadline2() {
      const deadline = (0, import_get_context.getContext)().deadline;
      if (deadline === void 0) {
        return void 0;
      }
      const date = new Date(deadline);
      if (isNaN(date.getTime())) {
        return void 0;
      }
      return date;
    }
    __name(getDeadline2, "getDeadline");
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/wait-until.js
var require_wait_until = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/wait-until.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var wait_until_exports = {};
    __export2(wait_until_exports, {
      waitUntil: /* @__PURE__ */ __name(() => waitUntil3, "waitUntil")
    });
    module.exports = __toCommonJS(wait_until_exports);
    var import_get_context = require_get_context();
    var waitUntil3 = /* @__PURE__ */ __name((promise) => {
      if (promise === null || typeof promise !== "object" || typeof promise.then !== "function") {
        throw new TypeError(`waitUntil can only be called with a Promise, got ${typeof promise}`);
      }
      return (0, import_get_context.getContext)().waitUntil?.(promise);
    }, "waitUntil");
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/metric.js
var require_metric = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/metric.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var metric_exports = {};
    __export2(metric_exports, {
      metric: /* @__PURE__ */ __name(() => metric2, "metric")
    });
    module.exports = __toCommonJS(metric_exports);
    var RUSTY_RUNTIME_IPC_SYMBOL = /* @__PURE__ */ Symbol.for("@vercel/rusty-runtime-ipc");
    function metric2(name, value, tags) {
      const ipc = globalThis[RUSTY_RUNTIME_IPC_SYMBOL];
      ipc?.sendMetric?.(name, value, tags);
    }
    __name(metric2, "metric");
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/middleware.js
var require_middleware = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/middleware.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var middleware_exports = {};
    __export2(middleware_exports, {
      next: /* @__PURE__ */ __name(() => next2, "next"),
      rewrite: /* @__PURE__ */ __name(() => rewrite2, "rewrite")
    });
    module.exports = __toCommonJS(middleware_exports);
    function handleMiddlewareField(init, headers) {
      if (init?.request?.headers) {
        if (!(init.request.headers instanceof Headers)) {
          throw new Error("request.headers must be an instance of Headers");
        }
        const keys = [];
        for (const [key, value] of init.request.headers) {
          headers.set("x-middleware-request-" + key, value);
          keys.push(key);
        }
        headers.set("x-middleware-override-headers", keys.join(","));
      }
    }
    __name(handleMiddlewareField, "handleMiddlewareField");
    function rewrite2(destination, init) {
      const headers = new Headers(init?.headers ?? {});
      headers.set("x-middleware-rewrite", String(destination));
      handleMiddlewareField(init, headers);
      return new Response(null, {
        ...init,
        headers
      });
    }
    __name(rewrite2, "rewrite");
    function next2(init) {
      const headers = new Headers(init?.headers ?? {});
      headers.set("x-middleware-next", "1");
      handleMiddlewareField(init, headers);
      return new Response(null, {
        ...init,
        headers
      });
    }
    __name(next2, "next");
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/cache/in-memory-cache.js
var require_in_memory_cache = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/cache/in-memory-cache.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var in_memory_cache_exports = {};
    __export2(in_memory_cache_exports, {
      InMemoryCache: /* @__PURE__ */ __name(() => InMemoryCache, "InMemoryCache")
    });
    module.exports = __toCommonJS(in_memory_cache_exports);
    var InMemoryCache = class {
      static {
        __name(this, "InMemoryCache");
      }
      constructor() {
        this.cache = {};
      }
      async get(key) {
        const entry = this.cache[key];
        if (entry) {
          if (entry.ttl && entry.lastModified + entry.ttl * 1e3 < Date.now()) {
            await this.delete(key);
            return null;
          }
          return JSON.parse(entry.value);
        }
        return null;
      }
      async set(key, value, options) {
        const serialized = JSON.stringify(value ?? null);
        this.cache[key] = {
          value: serialized,
          lastModified: Date.now(),
          ttl: options?.ttl,
          tags: new Set(options?.tags || [])
        };
      }
      async delete(key) {
        delete this.cache[key];
      }
      async expireTag(tag) {
        const tags = Array.isArray(tag) ? tag : [
          tag
        ];
        for (const key in this.cache) {
          if (Object.prototype.hasOwnProperty.call(this.cache, key)) {
            const entry = this.cache[key];
            if (tags.some((t) => entry.tags.has(t))) {
              delete this.cache[key];
            }
          }
        }
      }
    };
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/cache/build-client.js
var require_build_client = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/cache/build-client.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var build_client_exports = {};
    __export2(build_client_exports, {
      BuildCache: /* @__PURE__ */ __name(() => BuildCache, "BuildCache")
    });
    module.exports = __toCommonJS(build_client_exports);
    var import_index = require_cache();
    var BuildCache = class {
      static {
        __name(this, "BuildCache");
      }
      constructor({ endpoint, headers, onError, timeout = 500 }) {
        this.get = async (key) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);
          try {
            const res = await fetch(`${this.endpoint}${key}`, {
              headers: this.headers,
              method: "GET",
              signal: controller.signal
            });
            if (res.status === 404) {
              clearTimeout(timeoutId);
              return null;
            }
            if (res.status === 200) {
              const cacheState = res.headers.get(import_index.HEADERS_VERCEL_CACHE_STATE);
              if (cacheState !== import_index.PkgCacheState.Fresh) {
                res.body?.cancel?.();
                clearTimeout(timeoutId);
                return null;
              }
              const result = await res.json();
              clearTimeout(timeoutId);
              return result;
            } else {
              clearTimeout(timeoutId);
              throw new Error(`Failed to get cache: ${res.statusText}`);
            }
          } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
              const timeoutError = new Error(`Cache request timed out after ${this.timeout}ms`);
              timeoutError.stack = error.stack;
              this.onError?.(timeoutError);
            } else {
              this.onError?.(error);
            }
            return null;
          }
        };
        this.set = async (key, value, options) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);
          try {
            const optionalHeaders = {};
            if (options?.ttl) {
              optionalHeaders[import_index.HEADERS_VERCEL_REVALIDATE] = options.ttl.toString();
            }
            if (options?.tags && options.tags.length > 0) {
              optionalHeaders[import_index.HEADERS_VERCEL_CACHE_TAGS] = options.tags.join(",");
            }
            if (options?.name) {
              optionalHeaders[import_index.HEADERS_VERCEL_CACHE_ITEM_NAME] = options.name;
            }
            const res = await fetch(`${this.endpoint}${key}`, {
              method: "POST",
              headers: {
                ...this.headers,
                ...optionalHeaders
              },
              body: JSON.stringify(value),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.status !== 200) {
              throw new Error(`Failed to set cache: ${res.status} ${res.statusText}`);
            }
          } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
              const timeoutError = new Error(`Cache request timed out after ${this.timeout}ms`);
              timeoutError.stack = error.stack;
              this.onError?.(timeoutError);
            } else {
              this.onError?.(error);
            }
          }
        };
        this.delete = async (key) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);
          try {
            const res = await fetch(`${this.endpoint}${key}`, {
              method: "DELETE",
              headers: this.headers,
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.status !== 200) {
              throw new Error(`Failed to delete cache: ${res.statusText}`);
            }
          } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
              const timeoutError = new Error(`Cache request timed out after ${this.timeout}ms`);
              timeoutError.stack = error.stack;
              this.onError?.(timeoutError);
            } else {
              this.onError?.(error);
            }
          }
        };
        this.expireTag = async (tag) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);
          try {
            if (Array.isArray(tag)) {
              tag = tag.join(",");
            }
            const res = await fetch(`${this.endpoint}revalidate?tags=${tag}`, {
              method: "POST",
              headers: this.headers,
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.status !== 200) {
              throw new Error(`Failed to revalidate tag: ${res.statusText}`);
            }
          } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
              const timeoutError = new Error(`Cache request timed out after ${this.timeout}ms`);
              timeoutError.stack = error.stack;
              this.onError?.(timeoutError);
            } else {
              this.onError?.(error);
            }
          }
        };
        this.endpoint = endpoint;
        this.headers = headers;
        this.onError = onError;
        this.timeout = timeout;
      }
    };
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/cache/index.js
var require_cache = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/cache/index.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var cache_exports = {};
    __export2(cache_exports, {
      HEADERS_VERCEL_CACHE_ITEM_NAME: /* @__PURE__ */ __name(() => HEADERS_VERCEL_CACHE_ITEM_NAME, "HEADERS_VERCEL_CACHE_ITEM_NAME"),
      HEADERS_VERCEL_CACHE_STATE: /* @__PURE__ */ __name(() => HEADERS_VERCEL_CACHE_STATE, "HEADERS_VERCEL_CACHE_STATE"),
      HEADERS_VERCEL_CACHE_TAGS: /* @__PURE__ */ __name(() => HEADERS_VERCEL_CACHE_TAGS, "HEADERS_VERCEL_CACHE_TAGS"),
      HEADERS_VERCEL_REVALIDATE: /* @__PURE__ */ __name(() => HEADERS_VERCEL_REVALIDATE, "HEADERS_VERCEL_REVALIDATE"),
      PkgCacheState: /* @__PURE__ */ __name(() => PkgCacheState, "PkgCacheState"),
      getCache: /* @__PURE__ */ __name(() => getCache2, "getCache")
    });
    module.exports = __toCommonJS(cache_exports);
    var import_get_context = require_get_context();
    var import_in_memory_cache = require_in_memory_cache();
    var import_build_client = require_build_client();
    var defaultKeyHashFunction = /* @__PURE__ */ __name((key) => {
      let hash = 5381;
      for (let i2 = 0; i2 < key.length; i2++) {
        hash = hash * 33 ^ key.charCodeAt(i2);
      }
      return (hash >>> 0).toString(16);
    }, "defaultKeyHashFunction");
    var defaultNamespaceSeparator = "$";
    var inMemoryCacheInstance = null;
    var buildCacheInstance = null;
    var getCache2 = /* @__PURE__ */ __name((cacheOptions) => {
      const resolveCache = /* @__PURE__ */ __name(() => {
        let cache;
        if ((0, import_get_context.getContext)().cache) {
          cache = (0, import_get_context.getContext)().cache;
        } else {
          cache = getCacheImplementation(process.env.SUSPENSE_CACHE_DEBUG === "true");
        }
        return cache;
      }, "resolveCache");
      return wrapWithKeyTransformation(resolveCache, createKeyTransformer(cacheOptions));
    }, "getCache");
    function createKeyTransformer(cacheOptions) {
      const hashFunction = cacheOptions?.keyHashFunction || defaultKeyHashFunction;
      return (key) => {
        if (!cacheOptions?.namespace) return hashFunction(key);
        const separator = cacheOptions.namespaceSeparator || defaultNamespaceSeparator;
        return `${cacheOptions.namespace}${separator}${hashFunction(key)}`;
      };
    }
    __name(createKeyTransformer, "createKeyTransformer");
    function wrapWithKeyTransformation(resolveCache, makeKey) {
      return {
        get: /* @__PURE__ */ __name((key) => {
          return resolveCache().get(makeKey(key));
        }, "get"),
        set: /* @__PURE__ */ __name((key, value, options) => {
          return resolveCache().set(makeKey(key), value, {
            ...options,
            name: options?.name ?? key
          });
        }, "set"),
        delete: /* @__PURE__ */ __name((key) => {
          return resolveCache().delete(makeKey(key));
        }, "delete"),
        expireTag: /* @__PURE__ */ __name((tag) => {
          return resolveCache().expireTag(tag);
        }, "expireTag")
      };
    }
    __name(wrapWithKeyTransformation, "wrapWithKeyTransformation");
    var warnedCacheUnavailable = false;
    function getCacheImplementation(debug) {
      if (!inMemoryCacheInstance) {
        inMemoryCacheInstance = new import_in_memory_cache.InMemoryCache();
      }
      if (process.env.RUNTIME_CACHE_DISABLE_BUILD_CACHE === "true") {
        debug && console.log("Using InMemoryCache as build cache is disabled");
        return inMemoryCacheInstance;
      }
      const { RUNTIME_CACHE_ENDPOINT, RUNTIME_CACHE_HEADERS } = process.env;
      if (debug) {
        console.log("Runtime cache environment variables:", {
          RUNTIME_CACHE_ENDPOINT,
          RUNTIME_CACHE_HEADERS
        });
      }
      if (!RUNTIME_CACHE_ENDPOINT || !RUNTIME_CACHE_HEADERS) {
        if (!warnedCacheUnavailable) {
          console.warn("Runtime Cache unavailable in this environment. Falling back to in-memory cache.");
          warnedCacheUnavailable = true;
        }
        return inMemoryCacheInstance;
      }
      if (!buildCacheInstance) {
        let parsedHeaders = {};
        try {
          parsedHeaders = JSON.parse(RUNTIME_CACHE_HEADERS);
        } catch (e) {
          console.error("Failed to parse RUNTIME_CACHE_HEADERS:", e);
          return inMemoryCacheInstance;
        }
        let timeout = 500;
        if (process.env.RUNTIME_CACHE_TIMEOUT) {
          const parsed = parseInt(process.env.RUNTIME_CACHE_TIMEOUT, 10);
          if (!isNaN(parsed) && parsed > 0) {
            timeout = parsed;
          } else {
            console.warn(`Invalid RUNTIME_CACHE_TIMEOUT value: "${process.env.RUNTIME_CACHE_TIMEOUT}". Using default: ${timeout}ms`);
          }
        }
        buildCacheInstance = new import_build_client.BuildCache({
          endpoint: RUNTIME_CACHE_ENDPOINT,
          headers: parsedHeaders,
          onError: /* @__PURE__ */ __name((error) => console.error(error), "onError"),
          timeout
        });
      }
      return buildCacheInstance;
    }
    __name(getCacheImplementation, "getCacheImplementation");
    var PkgCacheState = /* @__PURE__ */ ((PkgCacheState2) => {
      PkgCacheState2["Fresh"] = "fresh";
      PkgCacheState2["Stale"] = "stale";
      PkgCacheState2["Expired"] = "expired";
      PkgCacheState2["NotFound"] = "notFound";
      PkgCacheState2["Error"] = "error";
      return PkgCacheState2;
    })(PkgCacheState || {});
    var HEADERS_VERCEL_CACHE_STATE = "x-vercel-cache-state";
    var HEADERS_VERCEL_REVALIDATE = "x-vercel-revalidate";
    var HEADERS_VERCEL_CACHE_TAGS = "x-vercel-cache-tags";
    var HEADERS_VERCEL_CACHE_ITEM_NAME = "x-vercel-cache-item-name";
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/db-connections/index.js
var require_db_connections = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/db-connections/index.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var db_connections_exports = {};
    __export2(db_connections_exports, {
      attachDatabasePool: /* @__PURE__ */ __name(() => attachDatabasePool2, "attachDatabasePool"),
      experimental_attachDatabasePool: /* @__PURE__ */ __name(() => experimental_attachDatabasePool2, "experimental_attachDatabasePool")
    });
    module.exports = __toCommonJS(db_connections_exports);
    var import_get_context = require_get_context();
    var import_deadline = require_deadline();
    var DEBUG = !!process.env.DEBUG;
    function getIdleTimeout(dbPool) {
      if ("options" in dbPool && dbPool.options) {
        if ("idleTimeoutMillis" in dbPool.options) {
          return typeof dbPool.options.idleTimeoutMillis === "number" ? dbPool.options.idleTimeoutMillis : 1e4;
        }
        if ("maxIdleTimeMS" in dbPool.options) {
          return typeof dbPool.options.maxIdleTimeMS === "number" ? dbPool.options.maxIdleTimeMS : 0;
        }
        if ("status" in dbPool) {
          return 5e3;
        }
        if ("connect" in dbPool && "execute" in dbPool) {
          return 3e4;
        }
      }
      if ("config" in dbPool && dbPool.config) {
        if ("connectionConfig" in dbPool.config && dbPool.config.connectionConfig) {
          return dbPool.config.connectionConfig.idleTimeout || 6e4;
        }
        if ("idleTimeout" in dbPool.config) {
          return typeof dbPool.config.idleTimeout === "number" ? dbPool.config.idleTimeout : 6e4;
        }
      }
      if ("poolTimeout" in dbPool) {
        return typeof dbPool.poolTimeout === "number" ? dbPool.poolTimeout : 6e4;
      }
      if ("idleTimeout" in dbPool) {
        return typeof dbPool.idleTimeout === "number" ? dbPool.idleTimeout : 0;
      }
      return 1e4;
    }
    __name(getIdleTimeout, "getIdleTimeout");
    var idleTimeout = null;
    var idleTimeoutResolve = /* @__PURE__ */ __name(() => {
    }, "idleTimeoutResolve");
    var maximumDuration = 15 * 60 * 1e3 - 1e3;
    function waitUntilIdleTimeout(dbPool) {
      if (!process.env.VERCEL_URL || // This is not set during builds where we don't need to wait for idle connections using the mechanism
      !process.env.VERCEL_REGION) {
        return;
      }
      if (idleTimeout) {
        clearTimeout(idleTimeout);
        idleTimeoutResolve();
      }
      const promise = new Promise((resolve) => {
        idleTimeoutResolve = resolve;
      });
      const deadline = (0, import_deadline.getDeadline)();
      const remainingDuration = deadline ? deadline.getTime() - Date.now() - 1e3 : maximumDuration;
      const waitTime = Math.min(getIdleTimeout(dbPool) + 100, Math.max(100, remainingDuration));
      idleTimeout = setTimeout(() => {
        idleTimeoutResolve?.();
        if (DEBUG) {
          console.log("Database pool idle timeout reached. Releasing connections.");
        }
      }, waitTime);
      const requestContext = (0, import_get_context.getContext)();
      if (requestContext?.waitUntil) {
        requestContext.waitUntil(promise);
      } else {
        console.warn("Pool release event triggered outside of request scope.");
      }
    }
    __name(waitUntilIdleTimeout, "waitUntilIdleTimeout");
    function attachDatabasePool2(dbPool) {
      if (idleTimeout) {
        idleTimeoutResolve?.();
        clearTimeout(idleTimeout);
      }
      if ("on" in dbPool && dbPool.on && "options" in dbPool && "idleTimeoutMillis" in dbPool.options) {
        const pgPool = dbPool;
        pgPool.on("release", () => {
          if (DEBUG) {
            console.log("Client released from pool");
          }
          waitUntilIdleTimeout(dbPool);
        });
        return;
      } else if ("on" in dbPool && dbPool.on && "config" in dbPool && dbPool.config && "connectionConfig" in dbPool.config) {
        const mysqlPool = dbPool;
        mysqlPool.on("release", () => {
          if (DEBUG) {
            console.log("MySQL client released from pool");
          }
          waitUntilIdleTimeout(dbPool);
        });
        return;
      } else if ("on" in dbPool && dbPool.on && "config" in dbPool && dbPool.config && "idleTimeout" in dbPool.config) {
        const mysql2Pool = dbPool;
        mysql2Pool.on("release", () => {
          if (DEBUG) {
            console.log("MySQL2/MariaDB client released from pool");
          }
          waitUntilIdleTimeout(dbPool);
        });
        return;
      }
      if ("on" in dbPool && dbPool.on && "options" in dbPool && dbPool.options && "maxIdleTimeMS" in dbPool.options) {
        const mongoPool = dbPool;
        mongoPool.on("connectionCheckedOut", () => {
          if (DEBUG) {
            console.log("MongoDB connection checked out");
          }
          waitUntilIdleTimeout(dbPool);
        });
        return;
      }
      if ("on" in dbPool && dbPool.on && "options" in dbPool && dbPool.options && "socket" in dbPool.options) {
        const redisPool = dbPool;
        redisPool.on("end", () => {
          if (DEBUG) {
            console.log("Redis connection ended");
          }
          waitUntilIdleTimeout(dbPool);
        });
        return;
      }
      throw new Error("Unsupported database pool type");
    }
    __name(attachDatabasePool2, "attachDatabasePool");
    var experimental_attachDatabasePool2 = attachDatabasePool2;
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/purge/index.js
var require_purge = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/purge/index.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var purge_exports = {};
    __export2(purge_exports, {
      dangerouslyDeleteBySrcImage: /* @__PURE__ */ __name(() => dangerouslyDeleteBySrcImage2, "dangerouslyDeleteBySrcImage"),
      dangerouslyDeleteByTag: /* @__PURE__ */ __name(() => dangerouslyDeleteByTag2, "dangerouslyDeleteByTag"),
      invalidateBySrcImage: /* @__PURE__ */ __name(() => invalidateBySrcImage2, "invalidateBySrcImage"),
      invalidateByTag: /* @__PURE__ */ __name(() => invalidateByTag2, "invalidateByTag")
    });
    module.exports = __toCommonJS(purge_exports);
    var import_get_context = require_get_context();
    var invalidateByTag2 = /* @__PURE__ */ __name((tag) => {
      const api = (0, import_get_context.getContext)().purge;
      if (api) {
        return api.invalidateByTag(tag);
      }
      return Promise.resolve();
    }, "invalidateByTag");
    var dangerouslyDeleteByTag2 = /* @__PURE__ */ __name((tag, options) => {
      const api = (0, import_get_context.getContext)().purge;
      if (api) {
        return api.dangerouslyDeleteByTag(tag, options);
      }
      return Promise.resolve();
    }, "dangerouslyDeleteByTag");
    var invalidateBySrcImage2 = /* @__PURE__ */ __name((src) => {
      const api = (0, import_get_context.getContext)().purge;
      return api ? api.invalidateBySrcImage(src) : Promise.resolve();
    }, "invalidateBySrcImage");
    var dangerouslyDeleteBySrcImage2 = /* @__PURE__ */ __name((src, options) => {
      const api = (0, import_get_context.getContext)().purge;
      return api ? api.dangerouslyDeleteBySrcImage(src, options) : Promise.resolve();
    }, "dangerouslyDeleteBySrcImage");
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/addcachetag/index.js
var require_addcachetag = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/addcachetag/index.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var addcachetag_exports = {};
    __export2(addcachetag_exports, {
      addCacheTag: /* @__PURE__ */ __name(() => addCacheTag2, "addCacheTag")
    });
    module.exports = __toCommonJS(addcachetag_exports);
    var import_get_context = require_get_context();
    var addCacheTag2 = /* @__PURE__ */ __name((tag) => {
      const addCacheTag22 = (0, import_get_context.getContext)().addCacheTag;
      if (addCacheTag22) {
        return addCacheTag22(tag);
      }
      return Promise.resolve();
    }, "addCacheTag");
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/stream.js"(exports, module) {
    "use strict";
    var { Duplex } = __require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    __name(emitClose, "emitClose");
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    __name(duplexOnEnd, "duplexOnEnd");
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    __name(duplexOnError, "duplexOnError");
    function createWebSocketStream2(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", /* @__PURE__ */ __name(function message(msg, isBinary) {
        const data2 = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data2)) ws.pause();
      }, "message"));
      ws.once("error", /* @__PURE__ */ __name(function error(err) {
        if (duplex.destroyed) return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      }, "error"));
      ws.once("close", /* @__PURE__ */ __name(function close() {
        if (duplex.destroyed) return;
        duplex.push(null);
      }, "close"));
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", /* @__PURE__ */ __name(function error(err2) {
          called = true;
          callback(err2);
        }, "error"));
        ws.once("close", /* @__PURE__ */ __name(function close() {
          if (!called) callback(err);
          process.nextTick(emitClose, duplex);
        }, "close"));
        if (terminateOnDestroy) ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", /* @__PURE__ */ __name(function open2() {
            duplex._final(callback);
          }, "open"));
          return;
        }
        if (ws._socket === null) return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted) duplex.destroy();
        } else {
          ws._socket.once("finish", /* @__PURE__ */ __name(function finish() {
            callback();
          }, "finish"));
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused) ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", /* @__PURE__ */ __name(function open2() {
            duplex._write(chunk, encoding, callback);
          }, "open"));
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    __name(createWebSocketStream2, "createWebSocketStream");
    module.exports = createWebSocketStream2;
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/constants.js
var require_constants2 = __commonJS({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/constants.js"(exports, module) {
    "use strict";
    var BINARY_TYPES = [
      "nodebuffer",
      "arraybuffer",
      "fragments"
    ];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob) BINARY_TYPES.push("blob");
    module.exports = {
      BINARY_TYPES,
      CLOSE_TIMEOUT: 3e4,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: /* @__PURE__ */ Symbol("kIsForOnEventAttribute"),
      kListener: /* @__PURE__ */ Symbol("kListener"),
      kStatusCode: /* @__PURE__ */ Symbol("status-code"),
      kWebSocket: /* @__PURE__ */ Symbol("websocket"),
      NOOP: /* @__PURE__ */ __name(() => {
      }, "NOOP")
    };
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/validation.js"(exports, module) {
    "use strict";
    var { isUtf8 } = __require("buffer");
    var { hasBlob } = require_constants2();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code2) {
      return code2 >= 1e3 && code2 <= 1014 && code2 !== 1004 && code2 !== 1005 && code2 !== 1006 || code2 >= 3e3 && code2 <= 4999;
    }
    __name(isValidStatusCode, "isValidStatusCode");
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i2 = 0;
      while (i2 < len) {
        if ((buf[i2] & 128) === 0) {
          i2++;
        } else if ((buf[i2] & 224) === 192) {
          if (i2 + 1 === len || (buf[i2 + 1] & 192) !== 128 || (buf[i2] & 254) === 192) {
            return false;
          }
          i2 += 2;
        } else if ((buf[i2] & 240) === 224) {
          if (i2 + 2 >= len || (buf[i2 + 1] & 192) !== 128 || (buf[i2 + 2] & 192) !== 128 || buf[i2] === 224 && (buf[i2 + 1] & 224) === 128 || // Overlong
          buf[i2] === 237 && (buf[i2 + 1] & 224) === 160) {
            return false;
          }
          i2 += 3;
        } else if ((buf[i2] & 248) === 240) {
          if (i2 + 3 >= len || (buf[i2 + 1] & 192) !== 128 || (buf[i2 + 2] & 192) !== 128 || (buf[i2 + 3] & 192) !== 128 || buf[i2] === 240 && (buf[i2 + 1] & 240) === 128 || // Overlong
          buf[i2] === 244 && buf[i2 + 1] > 143 || buf[i2] > 244) {
            return false;
          }
          i2 += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    __name(_isValidUTF8, "_isValidUTF8");
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    __name(isBlob, "isBlob");
    module.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = __require("utf-8-validate");
        module.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/extension.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0) dest[name] = [
        elem
      ];
      else dest[name].push(elem);
    }
    __name(push, "push");
    function parse5(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start2 = -1;
      let code2 = -1;
      let end = -1;
      let i2 = 0;
      for (; i2 < header.length; i2++) {
        code2 = header.charCodeAt(i2);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code2] === 1) {
            if (start2 === -1) start2 = i2;
          } else if (i2 !== 0 && (code2 === 32 || code2 === 9)) {
            if (end === -1 && start2 !== -1) end = i2;
          } else if (code2 === 59 || code2 === 44) {
            if (start2 === -1) {
              throw new SyntaxError(`Unexpected character at index ${i2}`);
            }
            if (end === -1) end = i2;
            const name = header.slice(start2, end);
            if (code2 === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start2 = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i2}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code2] === 1) {
            if (start2 === -1) start2 = i2;
          } else if (code2 === 32 || code2 === 9) {
            if (end === -1 && start2 !== -1) end = i2;
          } else if (code2 === 59 || code2 === 44) {
            if (start2 === -1) {
              throw new SyntaxError(`Unexpected character at index ${i2}`);
            }
            if (end === -1) end = i2;
            push(params, header.slice(start2, end), true);
            if (code2 === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start2 = end = -1;
          } else if (code2 === 61 && start2 !== -1 && end === -1) {
            paramName = header.slice(start2, i2);
            start2 = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i2}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code2] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i2}`);
            }
            if (start2 === -1) start2 = i2;
            else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code2] === 1) {
              if (start2 === -1) start2 = i2;
            } else if (code2 === 34 && start2 !== -1) {
              inQuotes = false;
              end = i2;
            } else if (code2 === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i2}`);
            }
          } else if (code2 === 34 && header.charCodeAt(i2 - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code2] === 1) {
            if (start2 === -1) start2 = i2;
          } else if (start2 !== -1 && (code2 === 32 || code2 === 9)) {
            if (end === -1) end = i2;
          } else if (code2 === 59 || code2 === 44) {
            if (start2 === -1) {
              throw new SyntaxError(`Unexpected character at index ${i2}`);
            }
            if (end === -1) end = i2;
            let value = header.slice(start2, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code2 === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start2 = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i2}`);
          }
        }
      }
      if (start2 === -1 || inQuotes || code2 === 32 || code2 === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i2;
      const token = header.slice(start2, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    __name(parse5, "parse");
    function format(extensions) {
      return Object.keys(extensions).map((extension2) => {
        let configurations = extensions[extension2];
        if (!Array.isArray(configurations)) configurations = [
          configurations
        ];
        return configurations.map((params) => {
          return [
            extension2
          ].concat(Object.keys(params).map((k) => {
            let values = params[k];
            if (!Array.isArray(values)) values = [
              values
            ];
            return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
          })).join("; ");
        }).join(", ");
      }).join(", ");
    }
    __name(format, "format");
    module.exports = {
      format,
      parse: parse5
    };
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/buffer-util.js"(exports, module) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants2();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list2, totalLength) {
      if (list2.length === 0) return EMPTY_BUFFER;
      if (list2.length === 1) return list2[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset2 = 0;
      for (let i2 = 0; i2 < list2.length; i2++) {
        const buf = list2[i2];
        target.set(buf, offset2);
        offset2 += buf.length;
      }
      if (offset2 < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset2);
      }
      return target;
    }
    __name(concat, "concat");
    function _mask(source, mask, output, offset2, length) {
      for (let i2 = 0; i2 < length; i2++) {
        output[offset2 + i2] = source[i2] ^ mask[i2 & 3];
      }
    }
    __name(_mask, "_mask");
    function _unmask(buffer2, mask) {
      for (let i2 = 0; i2 < buffer2.length; i2++) {
        buffer2[i2] ^= mask[i2 & 3];
      }
    }
    __name(_unmask, "_unmask");
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    __name(toArrayBuffer, "toArrayBuffer");
    function toBuffer(data2) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data2)) return data2;
      let buf;
      if (data2 instanceof ArrayBuffer) {
        buf = new FastBuffer(data2);
      } else if (ArrayBuffer.isView(data2)) {
        buf = new FastBuffer(data2.buffer, data2.byteOffset, data2.byteLength);
      } else {
        buf = Buffer.from(data2);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    __name(toBuffer, "toBuffer");
    module.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = __require("bufferutil");
        module.exports.mask = function(source, mask, output, offset2, length) {
          if (length < 48) _mask(source, mask, output, offset2, length);
          else bufferUtil.mask(source, mask, output, offset2, length);
        };
        module.exports.unmask = function(buffer2, mask) {
          if (buffer2.length < 32) _unmask(buffer2, mask);
          else bufferUtil.unmask(buffer2, mask);
        };
      } catch (e) {
      }
    }
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/limiter.js"(exports, module) {
    "use strict";
    var kDone = /* @__PURE__ */ Symbol("kDone");
    var kRun = /* @__PURE__ */ Symbol("kRun");
    var Limiter = class {
      static {
        __name(this, "Limiter");
      }
      /**
      * Creates a new `Limiter`.
      *
      * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
      *     to run concurrently
      */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
      * Adds a job to the queue.
      *
      * @param {Function} job The job to run
      * @public
      */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
      * Removes a job from the queue and runs it if possible.
      *
      * @private
      */
      [kRun]() {
        if (this.pending === this.concurrency) return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module.exports = Limiter;
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/permessage-deflate.js"(exports, module) {
    "use strict";
    var zlib = __require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants2();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([
      0,
      0,
      255,
      255
    ]);
    var kPerMessageDeflate = /* @__PURE__ */ Symbol("permessage-deflate");
    var kTotalLength = /* @__PURE__ */ Symbol("total-length");
    var kCallback = /* @__PURE__ */ Symbol("callback");
    var kBuffers = /* @__PURE__ */ Symbol("buffers");
    var kError = /* @__PURE__ */ Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate2 = class {
      static {
        __name(this, "PerMessageDeflate");
      }
      /**
      * Creates a PerMessageDeflate instance.
      *
      * @param {Object} [options] Configuration options
      * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
      *     for, or request, a custom client window size
      * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
      *     acknowledge disabling of client context takeover
      * @param {Number} [options.concurrencyLimit=10] The number of concurrent
      *     calls to zlib
      * @param {Boolean} [options.isServer=false] Create the instance in either
      *     server or client mode
      * @param {Number} [options.maxPayload=0] The maximum allowed message length
      * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
      *     use of a custom server window size
      * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
      *     disabling of server context takeover
      * @param {Number} [options.threshold=1024] Size (in bytes) below which
      *     messages should not be compressed if context takeover is disabled
      * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
      *     deflate
      * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
      *     inflate
      */
      constructor(options) {
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._maxPayload = this._options.maxPayload | 0;
        this._isServer = !!this._options.isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
      * @type {String}
      */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
      * Create an extension negotiation offer.
      *
      * @return {Object} Extension parameters
      * @public
      */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
      * Accept an extension negotiation offer/response.
      *
      * @param {Array} configurations The extension negotiation offers/reponse
      * @return {Object} Accepted configuration
      * @public
      */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
      * Releases all resources used by the extension.
      *
      * @public
      */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(new Error("The deflate stream was closed while data was being processed"));
          }
        }
      }
      /**
      *  Accept an extension negotiation offer.
      *
      * @param {Array} offers The extension negotiation offers
      * @return {Object} Accepted configuration
      * @private
      */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && (typeof params.client_max_window_bits === "number" ? opts.clientMaxWindowBits > params.client_max_window_bits : !params.client_max_window_bits)) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
      * Accept the extension negotiation response.
      *
      * @param {Array} response The extension negotiation response
      * @return {Object} Accepted configuration
      * @private
      */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error('Unexpected or invalid parameter "client_max_window_bits"');
        }
        return params;
      }
      /**
      * Normalize parameters.
      *
      * @param {Array} configurations The extension negotiation offers/reponse
      * @return {Array} The offers/response with normalized parameters
      * @private
      */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
      * Decompress data. Concurrency limited.
      *
      * @param {Buffer} data Compressed data
      * @param {Boolean} fin Specifies whether or not this is the last fragment
      * @param {Function} callback Callback
      * @public
      */
      decompress(data2, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data2, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
      * Compress data. Concurrency limited.
      *
      * @param {(Buffer|String)} data Data to compress
      * @param {Boolean} fin Specifies whether or not this is the last fragment
      * @param {Function} callback Callback
      * @public
      */
      compress(data2, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data2, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
      * Decompress data.
      *
      * @param {Buffer} data Compressed data
      * @param {Boolean} fin Specifies whether or not this is the last fragment
      * @param {Function} callback Callback
      * @private
      */
      _decompress(data2, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data2);
        if (fin) this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data3 = bufferUtil.concat(this._inflate[kBuffers], this._inflate[kTotalLength]);
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data3);
        });
      }
      /**
      * Compress data.
      *
      * @param {(Buffer|String)} data Data to compress
      * @param {Boolean} fin Specifies whether or not this is the last fragment
      * @param {Function} callback Callback
      * @private
      */
      _compress(data2, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data2);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data3 = bufferUtil.concat(this._deflate[kBuffers], this._deflate[kTotalLength]);
          if (fin) {
            data3 = new FastBuffer(data3.buffer, data3.byteOffset, data3.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data3);
        });
      }
    };
    module.exports = PerMessageDeflate2;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    __name(deflateOnData, "deflateOnData");
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    __name(inflateOnData, "inflateOnData");
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
    __name(inflateOnError, "inflateOnError");
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/receiver.js"(exports, module) {
    "use strict";
    var { Writable } = __require("stream");
    var PerMessageDeflate2 = require_permessage_deflate();
    var { BINARY_TYPES, EMPTY_BUFFER, kStatusCode, kWebSocket } = require_constants2();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver2 = class extends Writable {
      static {
        __name(this, "Receiver");
      }
      /**
      * Creates a Receiver instance.
      *
      * @param {Object} [options] Options object
      * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
      *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
      *     multiple times in the same tick
      * @param {String} [options.binaryType=nodebuffer] The type for binary data
      * @param {Object} [options.extensions] An object containing the negotiated
      *     extensions
      * @param {Boolean} [options.isServer=false] Specifies whether to operate in
      *     client or server mode
      * @param {Number} [options.maxBufferedChunks=0] The maximum number of
      *     buffered data chunks
      * @param {Number} [options.maxFragments=0] The maximum number of message
      *     fragments
      * @param {Number} [options.maxPayload=0] The maximum allowed message length
      * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
      *     not to skip UTF-8 validation for text and close messages
      */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxBufferedChunks = options.maxBufferedChunks | 0;
        this._maxFragments = options.maxFragments | 0;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._numFragments = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
      * Implements `Writable.prototype._write()`.
      *
      * @param {Buffer} chunk The chunk of data to write
      * @param {String} encoding The character encoding of `chunk`
      * @param {Function} cb Callback
      * @private
      */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO) return cb();
        if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
          cb(this.createError(RangeError, "Too many buffered chunks", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS"));
          return;
        }
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
      * Consumes `n` bytes from the buffered data.
      *
      * @param {Number} n The number of bytes to consume
      * @return {Buffer} The consumed bytes
      * @private
      */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length) return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(buf.buffer, buf.byteOffset + n, buf.length - n);
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset2 = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset2);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset2);
            this._buffers[0] = new FastBuffer(buf.buffer, buf.byteOffset + n, buf.length - n);
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
      * Starts the parsing loop.
      *
      * @param {Function} cb Callback
      * @private
      */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored) cb();
      }
      /**
      * Reads the first two bytes of a frame.
      *
      * @param {Function} cb Callback
      * @private
      */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(RangeError, "RSV2 and RSV3 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate2.extensionName]) {
          const error = this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(RangeError, "invalid opcode 0", true, 1002, "WS_ERR_INVALID_OPCODE");
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(RangeError, "FIN must be set", true, 1002, "WS_ERR_EXPECTED_FIN");
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(RangeError, `invalid payload length ${this._payloadLength}`, true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
            cb(error);
            return;
          }
        } else {
          const error = this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(RangeError, "MASK must be set", true, 1002, "WS_ERR_EXPECTED_MASK");
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(RangeError, "MASK must be clear", true, 1002, "WS_ERR_UNEXPECTED_MASK");
          cb(error);
          return;
        }
        if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
        else this.haveLength(cb);
      }
      /**
      * Gets extended payload length (7+16).
      *
      * @param {Function} cb Callback
      * @private
      */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
      * Gets extended payload length (7+64).
      *
      * @param {Function} cb Callback
      * @private
      */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", false, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
      * Payload length has been read.
      *
      * @param {Function} cb Callback
      * @private
      */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
            cb(error);
            return;
          }
        }
        if (this._masked) this._state = GET_MASK;
        else this._state = GET_DATA;
      }
      /**
      * Reads mask bytes.
      *
      * @private
      */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
      * Reads data bytes.
      *
      * @param {Function} cb Callback
      * @private
      */
      getData(cb) {
        let data2 = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data2 = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data2, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data2, cb);
          return;
        }
        if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
          const error = this.createError(RangeError, "Too many message fragments", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS");
          cb(error);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data2, cb);
          return;
        }
        if (data2.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data2);
        }
        this.dataMessage(cb);
      }
      /**
      * Decompresses data.
      *
      * @param {Buffer} data Compressed data
      * @param {Function} cb Callback
      * @private
      */
      decompress(data2, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        perMessageDeflate.decompress(data2, this._fin, (err, buf) => {
          if (err) return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO) this.startLoop(cb);
        });
      }
      /**
      * Handles a data message.
      *
      * @param {Function} cb Callback
      * @private
      */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._numFragments = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data2;
          if (this._binaryType === "nodebuffer") {
            data2 = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data2 = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data2 = new Blob(fragments);
          } else {
            data2 = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data2, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data2, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
      * Handles a control message.
      *
      * @param {Buffer} data Data to handle
      * @return {(Error|RangeError|undefined)} A possible error
      * @private
      */
      controlMessage(data2, cb) {
        if (this._opcode === 8) {
          if (data2.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code2 = data2.readUInt16BE(0);
            if (!isValidStatusCode(code2)) {
              const error = this.createError(RangeError, `invalid status code ${code2}`, true, 1002, "WS_ERR_INVALID_CLOSE_CODE");
              cb(error);
              return;
            }
            const buf = new FastBuffer(data2.buffer, data2.byteOffset + 2, data2.length - 2);
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code2, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data2);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data2);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
      * Builds an error object.
      *
      * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
      * @param {String} message The error message
      * @param {Boolean} prefix Specifies whether or not to add a default prefix to
      *     `message`
      * @param {Number} statusCode The status code
      * @param {String} errorCode The exposed error code
      * @return {(Error|RangeError)} The error
      * @private
      */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(prefix ? `Invalid WebSocket frame: ${message}` : message);
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module.exports = Receiver2;
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/sender.js"(exports, module) {
    "use strict";
    var { randomFillSync } = __require("crypto");
    var { types: { isUint8Array } } = __require("util");
    var PerMessageDeflate2 = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants2();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = /* @__PURE__ */ Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender2 = class _Sender {
      static {
        __name(this, "Sender");
      }
      /**
      * Creates a Sender instance.
      *
      * @param {Duplex} socket The connection socket
      * @param {Object} [extensions] An object containing the negotiated extensions
      * @param {Function} [generateMask] The function used to generate the masking
      *     key
      */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
      * Frames a piece of data according to the HyBi WebSocket protocol.
      *
      * @param {(Buffer|String)} data The data to frame
      * @param {Object} options Options object
      * @param {Boolean} [options.fin=false] Specifies whether or not to set the
      *     FIN bit
      * @param {Function} [options.generateMask] The function used to generate the
      *     masking key
      * @param {Boolean} [options.mask=false] Specifies whether or not to mask
      *     `data`
      * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
      *     key
      * @param {Number} options.opcode The opcode
      * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
      *     modified
      * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
      *     RSV1 bit
      * @return {(Buffer|String)[]} The framed data
      * @public
      */
      static frame(data2, options) {
        let mask;
        let merge = false;
        let offset2 = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset2 = 6;
        }
        let dataLength;
        if (typeof data2 === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data2 = Buffer.from(data2);
            dataLength = data2.length;
          }
        } else {
          dataLength = data2.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset2 += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset2 += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset2 : offset2);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1) target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask) return [
          target,
          data2
        ];
        target[1] |= 128;
        target[offset2 - 4] = mask[0];
        target[offset2 - 3] = mask[1];
        target[offset2 - 2] = mask[2];
        target[offset2 - 1] = mask[3];
        if (skipMasking) return [
          target,
          data2
        ];
        if (merge) {
          applyMask(data2, mask, target, offset2, dataLength);
          return [
            target
          ];
        }
        applyMask(data2, mask, data2, 0, dataLength);
        return [
          target,
          data2
        ];
      }
      /**
      * Sends a close message to the other peer.
      *
      * @param {Number} [code] The status code component of the body
      * @param {(String|Buffer)} [data] The message component of the body
      * @param {Boolean} [mask=false] Specifies whether or not to mask the message
      * @param {Function} [cb] Callback
      * @public
      */
      close(code2, data2, mask, cb) {
        let buf;
        if (code2 === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code2 !== "number" || !isValidStatusCode(code2)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data2 === void 0 || !data2.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code2, 0);
        } else {
          const length = Buffer.byteLength(data2);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code2, 0);
          if (typeof data2 === "string") {
            buf.write(data2, 2);
          } else if (isUint8Array(data2)) {
            buf.set(data2, 2);
          } else {
            throw new TypeError("Second argument must be a string or a Uint8Array");
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([
            this.dispatch,
            buf,
            false,
            options,
            cb
          ]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
      * Sends a ping message to the other peer.
      *
      * @param {*} data The message to send
      * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
      * @param {Function} [cb] Callback
      * @public
      */
      ping(data2, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data2 === "string") {
          byteLength = Buffer.byteLength(data2);
          readOnly = false;
        } else if (isBlob(data2)) {
          byteLength = data2.size;
          readOnly = false;
        } else {
          data2 = toBuffer(data2);
          byteLength = data2.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data2)) {
          if (this._state !== DEFAULT) {
            this.enqueue([
              this.getBlobData,
              data2,
              false,
              options,
              cb
            ]);
          } else {
            this.getBlobData(data2, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([
            this.dispatch,
            data2,
            false,
            options,
            cb
          ]);
        } else {
          this.sendFrame(_Sender.frame(data2, options), cb);
        }
      }
      /**
      * Sends a pong message to the other peer.
      *
      * @param {*} data The message to send
      * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
      * @param {Function} [cb] Callback
      * @public
      */
      pong(data2, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data2 === "string") {
          byteLength = Buffer.byteLength(data2);
          readOnly = false;
        } else if (isBlob(data2)) {
          byteLength = data2.size;
          readOnly = false;
        } else {
          data2 = toBuffer(data2);
          byteLength = data2.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data2)) {
          if (this._state !== DEFAULT) {
            this.enqueue([
              this.getBlobData,
              data2,
              false,
              options,
              cb
            ]);
          } else {
            this.getBlobData(data2, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([
            this.dispatch,
            data2,
            false,
            options,
            cb
          ]);
        } else {
          this.sendFrame(_Sender.frame(data2, options), cb);
        }
      }
      /**
      * Sends a data message to the other peer.
      *
      * @param {*} data The message to send
      * @param {Object} options Options object
      * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
      *     or text
      * @param {Boolean} [options.compress=false] Specifies whether or not to
      *     compress `data`
      * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
      *     last one
      * @param {Boolean} [options.mask=false] Specifies whether or not to mask
      *     `data`
      * @param {Function} [cb] Callback
      * @public
      */
      send(data2, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data2 === "string") {
          byteLength = Buffer.byteLength(data2);
          readOnly = false;
        } else if (isBlob(data2)) {
          byteLength = data2.size;
          readOnly = false;
        } else {
          data2 = toBuffer(data2);
          byteLength = data2.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data2)) {
          if (this._state !== DEFAULT) {
            this.enqueue([
              this.getBlobData,
              data2,
              this._compress,
              opts,
              cb
            ]);
          } else {
            this.getBlobData(data2, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([
            this.dispatch,
            data2,
            this._compress,
            opts,
            cb
          ]);
        } else {
          this.dispatch(data2, this._compress, opts, cb);
        }
      }
      /**
      * Gets the contents of a blob as binary data.
      *
      * @param {Blob} blob The blob
      * @param {Boolean} [compress=false] Specifies whether or not to compress
      *     the data
      * @param {Object} options Options object
      * @param {Boolean} [options.fin=false] Specifies whether or not to set the
      *     FIN bit
      * @param {Function} [options.generateMask] The function used to generate the
      *     masking key
      * @param {Boolean} [options.mask=false] Specifies whether or not to mask
      *     `data`
      * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
      *     key
      * @param {Number} options.opcode The opcode
      * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
      *     modified
      * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
      *     RSV1 bit
      * @param {Function} [cb] Callback
      * @private
      */
      getBlobData(blob, compress2, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error("The socket was closed while the blob was being read");
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data2 = toBuffer(arrayBuffer);
          if (!compress2) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data2, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data2, compress2, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
      * Dispatches a message.
      *
      * @param {(Buffer|String)} data The message to send
      * @param {Boolean} [compress=false] Specifies whether or not to compress
      *     `data`
      * @param {Object} options Options object
      * @param {Boolean} [options.fin=false] Specifies whether or not to set the
      *     FIN bit
      * @param {Function} [options.generateMask] The function used to generate the
      *     masking key
      * @param {Boolean} [options.mask=false] Specifies whether or not to mask
      *     `data`
      * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
      *     key
      * @param {Number} options.opcode The opcode
      * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
      *     modified
      * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
      *     RSV1 bit
      * @param {Function} [cb] Callback
      * @private
      */
      dispatch(data2, compress2, options, cb) {
        if (!compress2) {
          this.sendFrame(_Sender.frame(data2, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data2, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error("The socket was closed while data was being compressed");
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
      * Executes queued send operations.
      *
      * @private
      */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
      * Enqueues a send operation.
      *
      * @param {Array} params Send operation parameters.
      * @private
      */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
      * Sends a frame.
      *
      * @param {(Buffer | String)[]} list The frame to send
      * @param {Function} [cb] Callback
      * @private
      */
      sendFrame(list2, cb) {
        if (list2.length === 2) {
          this._socket.cork();
          this._socket.write(list2[0]);
          this._socket.write(list2[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list2[0], cb);
        }
      }
    };
    module.exports = Sender2;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function") cb(err);
      for (let i2 = 0; i2 < sender._queue.length; i2++) {
        const params = sender._queue[i2];
        const callback = params[params.length - 1];
        if (typeof callback === "function") callback(err);
      }
    }
    __name(callCallbacks, "callCallbacks");
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
    __name(onError, "onError");
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/subprotocol.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse5(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start2 = -1;
      let end = -1;
      let i2 = 0;
      for (i2; i2 < header.length; i2++) {
        const code2 = header.charCodeAt(i2);
        if (end === -1 && tokenChars[code2] === 1) {
          if (start2 === -1) start2 = i2;
        } else if (i2 !== 0 && (code2 === 32 || code2 === 9)) {
          if (end === -1 && start2 !== -1) end = i2;
        } else if (code2 === 44) {
          if (start2 === -1) {
            throw new SyntaxError(`Unexpected character at index ${i2}`);
          }
          if (end === -1) end = i2;
          const protocol2 = header.slice(start2, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start2 = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i2}`);
        }
      }
      if (start2 === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start2, i2);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    __name(parse5, "parse");
    module.exports = {
      parse: parse5
    };
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/event-target.js"(exports, module) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants2();
    var kCode = /* @__PURE__ */ Symbol("kCode");
    var kData = /* @__PURE__ */ Symbol("kData");
    var kError = /* @__PURE__ */ Symbol("kError");
    var kMessage = /* @__PURE__ */ Symbol("kMessage");
    var kReason = /* @__PURE__ */ Symbol("kReason");
    var kTarget = /* @__PURE__ */ Symbol("kTarget");
    var kType = /* @__PURE__ */ Symbol("kType");
    var kWasClean = /* @__PURE__ */ Symbol("kWasClean");
    var Event = class {
      static {
        __name(this, "Event");
      }
      /**
      * Create a new `Event`.
      *
      * @param {String} type The name of the event
      * @throws {TypeError} If the `type` argument is not specified
      */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
      * @type {*}
      */
      get target() {
        return this[kTarget];
      }
      /**
      * @type {String}
      */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", {
      enumerable: true
    });
    Object.defineProperty(Event.prototype, "type", {
      enumerable: true
    });
    var CloseEvent = class extends Event {
      static {
        __name(this, "CloseEvent");
      }
      /**
      * Create a new `CloseEvent`.
      *
      * @param {String} type The name of the event
      * @param {Object} [options] A dictionary object that allows for setting
      *     attributes via object members of the same name
      * @param {Number} [options.code=0] The status code explaining why the
      *     connection was closed
      * @param {String} [options.reason=''] A human-readable string explaining why
      *     the connection was closed
      * @param {Boolean} [options.wasClean=false] Indicates whether or not the
      *     connection was cleanly closed
      */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
      * @type {Number}
      */
      get code() {
        return this[kCode];
      }
      /**
      * @type {String}
      */
      get reason() {
        return this[kReason];
      }
      /**
      * @type {Boolean}
      */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", {
      enumerable: true
    });
    Object.defineProperty(CloseEvent.prototype, "reason", {
      enumerable: true
    });
    Object.defineProperty(CloseEvent.prototype, "wasClean", {
      enumerable: true
    });
    var ErrorEvent = class extends Event {
      static {
        __name(this, "ErrorEvent");
      }
      /**
      * Create a new `ErrorEvent`.
      *
      * @param {String} type The name of the event
      * @param {Object} [options] A dictionary object that allows for setting
      *     attributes via object members of the same name
      * @param {*} [options.error=null] The error that generated this event
      * @param {String} [options.message=''] The error message
      */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
      * @type {*}
      */
      get error() {
        return this[kError];
      }
      /**
      * @type {String}
      */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", {
      enumerable: true
    });
    Object.defineProperty(ErrorEvent.prototype, "message", {
      enumerable: true
    });
    var MessageEvent = class extends Event {
      static {
        __name(this, "MessageEvent");
      }
      /**
      * Create a new `MessageEvent`.
      *
      * @param {String} type The name of the event
      * @param {Object} [options] A dictionary object that allows for setting
      *     attributes via object members of the same name
      * @param {*} [options.data=null] The message content
      */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
      * @type {*}
      */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", {
      enumerable: true
    });
    var EventTarget = {
      /**
      * Register an event listener.
      *
      * @param {String} type A string representing the event type to listen for
      * @param {(Function|Object)} handler The listener to add
      * @param {Object} [options] An options object specifies characteristics about
      *     the event listener
      * @param {Boolean} [options.once=false] A `Boolean` indicating that the
      *     listener should be invoked at most once after being added. If `true`,
      *     the listener would be automatically removed when invoked.
      * @public
      */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = /* @__PURE__ */ __name(function onMessage(data2, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data2 : data2.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          }, "onMessage");
        } else if (type === "close") {
          wrapper = /* @__PURE__ */ __name(function onClose(code2, message) {
            const event = new CloseEvent("close", {
              code: code2,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          }, "onClose");
        } else if (type === "error") {
          wrapper = /* @__PURE__ */ __name(function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          }, "onError");
        } else if (type === "open") {
          wrapper = /* @__PURE__ */ __name(function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          }, "onOpen");
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
      * Remove an event listener.
      *
      * @param {String} type A string representing the event type to remove
      * @param {(Function|Object)} handler The listener to remove
      * @public
      */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
    __name(callListener, "callListener");
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/websocket.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var https = __require("https");
    var http = __require("http");
    var net = __require("net");
    var tls = __require("tls");
    var { randomBytes, createHash } = __require("crypto");
    var { URL: URL2 } = __require("url");
    var PerMessageDeflate2 = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var { isBlob } = require_validation();
    var { BINARY_TYPES, CLOSE_TIMEOUT, EMPTY_BUFFER, GUID, kForOnEventAttribute, kListener, kStatusCode, kWebSocket, NOOP } = require_constants2();
    var { EventTarget: { addEventListener, removeEventListener } } = require_event_target();
    var { format, parse: parse5 } = require_extension();
    var { toBuffer } = require_buffer_util();
    var kAborted = /* @__PURE__ */ Symbol("kAborted");
    var protocolVersions = [
      8,
      13
    ];
    var readyStates = [
      "CONNECTING",
      "OPEN",
      "CLOSING",
      "CLOSED"
    ];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket2 = class _WebSocket extends EventEmitter {
      static {
        __name(this, "WebSocket");
      }
      /**
      * Create a new `WebSocket`.
      *
      * @param {(String|URL)} address The URL to which to connect
      * @param {(String|String[])} [protocols] The subprotocols
      * @param {Object} [options] Connection options
      */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            if (!options || options.protocols === void 0) {
              protocols = [];
            } else if (Array.isArray(options.protocols)) {
              protocols = options.protocols;
            } else {
              protocols = [
                options.protocols
              ];
            }
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              if (options.protocols === void 0) {
                protocols = [];
              } else if (Array.isArray(options.protocols)) {
                protocols = options.protocols;
              } else {
                protocols = [
                  options.protocols
                ];
              }
            } else {
              protocols = [
                protocols
              ];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._closeTimeout = options.closeTimeout;
          this._isServer = true;
        }
      }
      /**
      * For historical reasons, the custom "nodebuffer" type is used by the default
      * instead of "blob".
      *
      * @type {String}
      */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type)) return;
        this._binaryType = type;
        if (this._receiver) this._receiver._binaryType = type;
      }
      /**
      * @type {Number}
      */
      get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
      * @type {String}
      */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
      * @type {Boolean}
      */
      get isPaused() {
        return this._paused;
      }
      /**
      * @type {Function}
      */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
      * @type {Function}
      */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
      * @type {Function}
      */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
      * @type {Function}
      */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
      * @type {String}
      */
      get protocol() {
        return this._protocol;
      }
      /**
      * @type {Number}
      */
      get readyState() {
        return this._readyState;
      }
      /**
      * @type {String}
      */
      get url() {
        return this._url;
      }
      /**
      * Set up the socket and the internal resources.
      *
      * @param {Duplex} socket The network socket between the server and client
      * @param {Buffer} head The first packet of the upgraded stream
      * @param {Object} options Options object
      * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
      *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
      *     multiple times in the same tick
      * @param {Function} [options.generateMask] The function used to generate the
      *     masking key
      * @param {Number} [options.maxBufferedChunks=0] The maximum number of
      *     buffered data chunks
      * @param {Number} [options.maxFragments=0] The maximum number of message
      *     fragments
      * @param {Number} [options.maxPayload=0] The maximum allowed message size
      * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
      *     not to skip UTF-8 validation for text and close messages
      * @private
      */
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxBufferedChunks: options.maxBufferedChunks,
          maxFragments: options.maxFragments,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout) socket.setTimeout(0);
        if (socket.setNoDelay) socket.setNoDelay();
        if (head.length > 0) socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
      * Emit the `'close'` event.
      *
      * @private
      */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate2.extensionName]) {
          this._extensions[PerMessageDeflate2.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
      * Start a closing handshake.
      *
      *          +----------+   +-----------+   +----------+
      *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
      *    |     +----------+   +-----------+   +----------+     |
      *          +----------+   +-----------+         |
      * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
      *          +----------+   +-----------+   |
      *    |           |                        |   +---+        |
      *                +------------------------+-->|fin| - - - -
      *    |         +---+                      |   +---+
      *     - - - - -|fin|<---------------------+
      *              +---+
      *
      * @param {Number} [code] Status code explaining why the connection is closing
      * @param {(String|Buffer)} [data] The reason why the connection is
      *     closing
      * @public
      */
      close(code2, data2) {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._sender.close(code2, data2, !this._isServer, (err) => {
          if (err) return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        this._readyState = _WebSocket.CLOSING;
        setCloseTimer(this);
      }
      /**
      * Pause the socket.
      *
      * @public
      */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
      * Send a ping.
      *
      * @param {*} [data] The data to send
      * @param {Boolean} [mask] Indicates whether or not to mask `data`
      * @param {Function} [cb] Callback which is executed when the ping is sent
      * @public
      */
      ping(data2, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data2 === "function") {
          cb = data2;
          data2 = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data2 === "number") data2 = data2.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data2, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.ping(data2 || EMPTY_BUFFER, mask, cb);
      }
      /**
      * Send a pong.
      *
      * @param {*} [data] The data to send
      * @param {Boolean} [mask] Indicates whether or not to mask `data`
      * @param {Function} [cb] Callback which is executed when the pong is sent
      * @public
      */
      pong(data2, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data2 === "function") {
          cb = data2;
          data2 = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data2 === "number") data2 = data2.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data2, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.pong(data2 || EMPTY_BUFFER, mask, cb);
      }
      /**
      * Resume the socket.
      *
      * @public
      */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain) this._socket.resume();
      }
      /**
      * Send a data message.
      *
      * @param {*} data The message to send
      * @param {Object} [options] Options object
      * @param {Boolean} [options.binary] Specifies whether `data` is binary or
      *     text
      * @param {Boolean} [options.compress] Specifies whether or not to compress
      *     `data`
      * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
      *     last one
      * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
      * @param {Function} [cb] Callback which is executed when data is written out
      * @public
      */
      send(data2, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data2 === "number") data2 = data2.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data2, cb);
          return;
        }
        const opts = {
          binary: typeof data2 !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate2.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data2 || EMPTY_BUFFER, opts, cb);
      }
      /**
      * Forcibly close the connection.
      *
      * @public
      */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket2, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket2.prototype, property, {
        enumerable: true
      });
    });
    [
      "open",
      "error",
      "close",
      "message"
    ].forEach((method) => {
      Object.defineProperty(WebSocket2.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function") return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket2.prototype.addEventListener = addEventListener;
    WebSocket2.prototype.removeEventListener = removeEventListener;
    module.exports = WebSocket2;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        allowSynchronousEvents: true,
        autoPong: true,
        closeTimeout: CLOSE_TIMEOUT,
        protocolVersion: protocolVersions[1],
        maxBufferedChunks: 256 * 1024,
        maxFragments: 16 * 1024,
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        protocols: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      websocket._autoPong = opts.autoPong;
      websocket._closeTimeout = opts.closeTimeout;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(`Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`);
      }
      let parsedUrl;
      if (address instanceof URL2) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL2(address);
        } catch {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate2({
          ...opts.perMessageDeflate,
          isServer: false,
          maxPayload: opts.maxPayload
        });
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate2.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError("An invalid or duplicated subprotocol was specified");
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = {
            ...options,
            headers: {}
          };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost) delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted]) return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL2(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(websocket, req, `Unexpected server response: ${res.statusCode}`);
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket2.CONNECTING) return;
        req = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt) websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse5(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate2.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate2.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxBufferedChunks: opts.maxBufferedChunks,
          maxFragments: opts.maxFragments,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    __name(initAsClient, "initAsClient");
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket2.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    __name(emitErrorAndClose, "emitErrorAndClose");
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    __name(netConnect, "netConnect");
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    __name(tlsConnect, "tlsConnect");
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket2.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    __name(abortHandshake, "abortHandshake");
    function sendAfterClose(websocket, data2, cb) {
      if (data2) {
        const length = isBlob(data2) ? data2.size : toBuffer(data2).length;
        if (websocket._socket) websocket._sender._bufferedBytes += length;
        else websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(`WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`);
        process.nextTick(cb, err);
      }
    }
    __name(sendAfterClose, "sendAfterClose");
    function receiverOnConclude(code2, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code2;
      if (websocket._socket[kWebSocket] === void 0) return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code2 === 1005) websocket.close();
      else websocket.close(code2, reason);
    }
    __name(receiverOnConclude, "receiverOnConclude");
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused) websocket._socket.resume();
    }
    __name(receiverOnDrain, "receiverOnDrain");
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    __name(receiverOnError, "receiverOnError");
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    __name(receiverOnFinish, "receiverOnFinish");
    function receiverOnMessage(data2, isBinary) {
      this[kWebSocket].emit("message", data2, isBinary);
    }
    __name(receiverOnMessage, "receiverOnMessage");
    function receiverOnPing(data2) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong) websocket.pong(data2, !this._isServer, NOOP);
      websocket.emit("ping", data2);
    }
    __name(receiverOnPing, "receiverOnPing");
    function receiverOnPong(data2) {
      this[kWebSocket].emit("pong", data2);
    }
    __name(receiverOnPong, "receiverOnPong");
    function resume(stream) {
      stream.resume();
    }
    __name(resume, "resume");
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket2.CLOSED) return;
      if (websocket.readyState === WebSocket2.OPEN) {
        websocket._readyState = WebSocket2.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    __name(senderOnError, "senderOnError");
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(websocket._socket.destroy.bind(websocket._socket), websocket._closeTimeout);
    }
    __name(setCloseTimer, "setCloseTimer");
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket2.CLOSING;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
        const chunk = this.read(this._readableState.length);
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    __name(socketOnClose, "socketOnClose");
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    __name(socketOnData, "socketOnData");
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket2.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    __name(socketOnEnd, "socketOnEnd");
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket2.CLOSING;
        this.destroy();
      }
    }
    __name(socketOnError, "socketOnError");
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/websocket-server.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var http = __require("http");
    var { createHash } = __require("crypto");
    var extension2 = require_extension();
    var PerMessageDeflate2 = require_permessage_deflate();
    var subprotocol2 = require_subprotocol();
    var WebSocket2 = require_websocket();
    var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants2();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      static {
        __name(this, "WebSocketServer");
      }
      /**
      * Create a `WebSocketServer` instance.
      *
      * @param {Object} options Configuration options
      * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
      *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
      *     multiple times in the same tick
      * @param {Boolean} [options.autoPong=true] Specifies whether or not to
      *     automatically send a pong in response to a ping
      * @param {Number} [options.backlog=511] The maximum length of the queue of
      *     pending connections
      * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
      *     track clients
      * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
      *     wait for the closing handshake to finish after `websocket.close()` is
      *     called
      * @param {Function} [options.handleProtocols] A hook to handle protocols
      * @param {String} [options.host] The hostname where to bind the server
      * @param {Number} [options.maxBufferedChunks=262144] The maximum number of
      *     buffered data chunks
      * @param {Number} [options.maxFragments=16384] The maximum number of message
      *     fragments
      * @param {Number} [options.maxPayload=104857600] The maximum allowed message
      *     size
      * @param {Boolean} [options.noServer=false] Enable no server mode
      * @param {String} [options.path] Accept only connections matching this path
      * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
      *     permessage-deflate
      * @param {Number} [options.port] The port where to bind the server
      * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
      *     server to use
      * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
      *     not to skip UTF-8 validation for text and close messages
      * @param {Function} [options.verifyClient] A hook to reject connections
      * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
      *     class to use. It must be the `WebSocket` class or class that extends it
      * @param {Function} [callback] A listener for the `listening` event
      */
      constructor(options, callback) {
        super();
        options = {
          allowSynchronousEvents: true,
          autoPong: true,
          maxBufferedChunks: 256 * 1024,
          maxFragments: 16 * 1024,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          closeTimeout: CLOSE_TIMEOUT,
          verifyClient: null,
          noServer: false,
          backlog: null,
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket2,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError('One and only one of the "port", "server", or "noServer" options must be specified');
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(options.port, options.host, options.backlog, callback);
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: /* @__PURE__ */ __name((req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }, "upgrade")
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
      * Returns the bound address, the address family name, and port of the server
      * as reported by the operating system if listening on an IP socket.
      * If the server is listening on a pipe or UNIX domain socket, the name is
      * returned as a string.
      *
      * @return {(Object|String|null)} The address of the server
      * @public
      */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server) return null;
        return this._server.address();
      }
      /**
      * Stop the server from accepting new connections and emit the `'close'` event
      * when all existing connections are closed.
      *
      * @param {Function} [cb] A one-time listener for the `'close'` event
      * @public
      */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb) this.once("close", cb);
        if (this._state === CLOSING) return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
      * See if a given request should be handled by this server instance.
      *
      * @param {http.IncomingMessage} req Request object to inspect
      * @return {Boolean} `true` if the request is valid, else `false`
      * @public
      */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path) return false;
        }
        return true;
      }
      /**
      * Handle a HTTP Upgrade request.
      *
      * @param {http.IncomingMessage} req The request object
      * @param {Duplex} socket The network socket between the server and client
      * @param {Buffer} head The first packet of the upgraded stream
      * @param {Function} cb Callback
      * @public
      */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const upgrade = req.headers.upgrade;
        const version3 = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version3 !== 13 && version3 !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol2.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate2({
            ...this.options.perMessageDeflate,
            isServer: true,
            maxPayload: this.options.maxPayload
          });
          try {
            const offers = extension2.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate2.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate2.extensionName]);
              extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version3 === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code2, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code2 || 401, message, headers);
              }
              this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
            });
            return;
          }
          if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
      * Upgrade the connection to WebSocket.
      *
      * @param {Object} extensions The accepted extensions
      * @param {String} key The value of the `Sec-WebSocket-Key` header
      * @param {Set} protocols The subprotocols
      * @param {http.IncomingMessage} req The request object
      * @param {Duplex} socket The network socket between the server and client
      * @param {Buffer} head The first packet of the upgraded stream
      * @param {Function} cb Callback
      * @throws {Error} If called more than once with the same socket
      * @private
      */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable) return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
        }
        if (this._state > RUNNING) return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate2.extensionName]) {
          const params = extensions[PerMessageDeflate2.extensionName].params;
          const value = extension2.format({
            [PerMessageDeflate2.extensionName]: [
              params
            ]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxBufferedChunks: this.options.maxBufferedChunks,
          maxFragments: this.options.maxFragments,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module.exports = WebSocketServer2;
    function addListeners(server, map) {
      for (const event of Object.keys(map)) server.on(event, map[event]);
      return /* @__PURE__ */ __name(function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      }, "removeListeners");
    }
    __name(addListeners, "addListeners");
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    __name(emitClose, "emitClose");
    function socketOnError() {
      this.destroy();
    }
    __name(socketOnError, "socketOnError");
    function abortHandshake(socket, code2, message, headers) {
      message = message || http.STATUS_CODES[code2];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(`HTTP/1.1 ${code2} ${http.STATUS_CODES[code2]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message);
    }
    __name(abortHandshake, "abortHandshake");
    function abortHandshakeOrEmitwsClientError(server, req, socket, code2, message, headers) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code2, message, headers);
      }
    }
    __name(abortHandshakeOrEmitwsClientError, "abortHandshakeOrEmitwsClientError");
  }
});

// ../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/wrapper.mjs
var wrapper_exports = {};
__export(wrapper_exports, {
  PerMessageDeflate: () => import_permessage_deflate.default,
  Receiver: () => import_receiver.default,
  Sender: () => import_sender.default,
  WebSocket: () => import_websocket.default,
  WebSocketServer: () => import_websocket_server.default,
  createWebSocketStream: () => import_stream.default,
  default: () => wrapper_default,
  extension: () => import_extension.default,
  subprotocol: () => import_subprotocol.default
});
var import_stream, import_extension, import_permessage_deflate, import_receiver, import_sender, import_subprotocol, import_websocket, import_websocket_server, wrapper_default;
var init_wrapper = __esm({
  "../../node_modules/.pnpm/ws@8.22.0/node_modules/ws/wrapper.mjs"() {
    import_stream = __toESM(require_stream(), 1);
    import_extension = __toESM(require_extension(), 1);
    import_permessage_deflate = __toESM(require_permessage_deflate(), 1);
    import_receiver = __toESM(require_receiver(), 1);
    import_sender = __toESM(require_sender(), 1);
    import_subprotocol = __toESM(require_subprotocol(), 1);
    import_websocket = __toESM(require_websocket(), 1);
    import_websocket_server = __toESM(require_websocket_server(), 1);
    wrapper_default = import_websocket.default;
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/websocket/index.js
var require_websocket2 = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/websocket/index.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var websocket_exports = {};
    __export2(websocket_exports, {
      experimental_upgradeWebSocket: /* @__PURE__ */ __name(() => experimental_upgradeWebSocket2, "experimental_upgradeWebSocket"),
      upgradeWebSocket: /* @__PURE__ */ __name(() => upgradeWebSocket2, "upgradeWebSocket")
    });
    module.exports = __toCommonJS(websocket_exports);
    var import_get_context = require_get_context();
    var DEFAULT_MAX_PAYLOAD = 256 * 1024;
    async function loadWebSocketServer() {
      try {
        const ws = await Promise.resolve().then(() => (init_wrapper(), wrapper_exports));
        return ws.WebSocketServer;
      } catch {
        throw new Error('The "ws" package is required for upgradeWebSocket(). Install it with: npm install ws');
      }
    }
    __name(loadWebSocketServer, "loadWebSocketServer");
    async function upgradeWebSocket2(handler, options = {}) {
      const ctx = (0, import_get_context.getContext)();
      if (typeof ctx.upgradeWebSocket !== "function") {
        throw new Error("upgradeWebSocket is not available in the current runtime environment. This feature requires a Vercel runtime that supports WebSocket upgrades.");
      }
      const WebSocketServer2 = await loadWebSocketServer();
      const { req, socket, head } = ctx.upgradeWebSocket();
      const wss = new WebSocketServer2({
        noServer: true,
        maxPayload: options.maxPayload ?? DEFAULT_MAX_PAYLOAD
      });
      const ws = await new Promise((resolve, reject) => {
        const cleanup = /* @__PURE__ */ __name(() => {
          socket.removeListener("error", onError);
          socket.removeListener("close", onClose);
        }, "cleanup");
        const rejectUpgrade = /* @__PURE__ */ __name((err) => {
          cleanup();
          if (err instanceof Error) {
            reject(err);
            return;
          }
          const error = new Error("WebSocket upgrade failed");
          error.cause = err;
          reject(error);
        }, "rejectUpgrade");
        const resolveUpgrade = /* @__PURE__ */ __name((ws2) => {
          cleanup();
          resolve(ws2);
        }, "resolveUpgrade");
        const onError = /* @__PURE__ */ __name((err) => rejectUpgrade(err), "onError");
        const onClose = /* @__PURE__ */ __name(() => rejectUpgrade(new Error("socket closed before the WebSocket upgrade completed")), "onClose");
        socket.once("error", onError);
        socket.once("close", onClose);
        try {
          wss.handleUpgrade(req, socket, head, resolveUpgrade);
        } catch (err) {
          rejectUpgrade(err);
        }
      });
      try {
        await handler(ws);
      } catch (err) {
        ws.close(1011, "WebSocket handler failed");
        throw err;
      }
      return new Response(null, {
        status: 204
      });
    }
    __name(upgradeWebSocket2, "upgradeWebSocket");
    var experimental_upgradeWebSocket2 = upgradeWebSocket2;
  }
});

// ../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/index.js
var require_functions = __commonJS({
  "../../node_modules/.pnpm/@vercel+functions@3.10.5_@aws-sdk+credential-provider-web-identity@3.972.49_ws@8.22.0/node_modules/@vercel/functions/index.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp2(target, name, {
        get: all[name],
        enumerable: true
      });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: /* @__PURE__ */ __name(() => from[key], "get"),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", {
      value: true
    }), mod), "__toCommonJS");
    var src_exports = {};
    __export2(src_exports, {
      addCacheTag: /* @__PURE__ */ __name(() => import_addcachetag.addCacheTag, "addCacheTag"),
      attachDatabasePool: /* @__PURE__ */ __name(() => import_db_connections.attachDatabasePool, "attachDatabasePool"),
      dangerouslyDeleteBySrcImage: /* @__PURE__ */ __name(() => import_purge.dangerouslyDeleteBySrcImage, "dangerouslyDeleteBySrcImage"),
      dangerouslyDeleteByTag: /* @__PURE__ */ __name(() => import_purge.dangerouslyDeleteByTag, "dangerouslyDeleteByTag"),
      experimental_attachDatabasePool: /* @__PURE__ */ __name(() => import_db_connections.experimental_attachDatabasePool, "experimental_attachDatabasePool"),
      experimental_upgradeWebSocket: /* @__PURE__ */ __name(() => import_websocket2.experimental_upgradeWebSocket, "experimental_upgradeWebSocket"),
      geolocation: /* @__PURE__ */ __name(() => import_headers.geolocation, "geolocation"),
      getCache: /* @__PURE__ */ __name(() => import_cache.getCache, "getCache"),
      getDeadline: /* @__PURE__ */ __name(() => import_deadline.getDeadline, "getDeadline"),
      getEnv: /* @__PURE__ */ __name(() => import_get_env.getEnv, "getEnv"),
      invalidateBySrcImage: /* @__PURE__ */ __name(() => import_purge.invalidateBySrcImage, "invalidateBySrcImage"),
      invalidateByTag: /* @__PURE__ */ __name(() => import_purge.invalidateByTag, "invalidateByTag"),
      ipAddress: /* @__PURE__ */ __name(() => import_headers.ipAddress, "ipAddress"),
      metric: /* @__PURE__ */ __name(() => import_metric.metric, "metric"),
      next: /* @__PURE__ */ __name(() => import_middleware.next, "next"),
      rewrite: /* @__PURE__ */ __name(() => import_middleware.rewrite, "rewrite"),
      upgradeWebSocket: /* @__PURE__ */ __name(() => import_websocket2.upgradeWebSocket, "upgradeWebSocket"),
      waitUntil: /* @__PURE__ */ __name(() => import_wait_until3.waitUntil, "waitUntil")
    });
    module.exports = __toCommonJS(src_exports);
    var import_headers = require_headers();
    var import_get_env = require_get_env();
    var import_deadline = require_deadline();
    var import_wait_until3 = require_wait_until();
    var import_metric = require_metric();
    var import_middleware = require_middleware();
    var import_cache = require_cache();
    var import_db_connections = require_db_connections();
    var import_purge = require_purge();
    var import_addcachetag = require_addcachetag();
    var import_websocket2 = require_websocket2();
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/wait-until.js
function waitUntil2(promise) {
  void Promise.resolve().then(() => __toESM(require_functions(), 1)).then(({ waitUntil: waitUntil3 }) => {
    waitUntil3(promise);
  });
}
function safeWaitUntil(promise, onError) {
  waitUntil2(promise.catch((err) => {
    const isAbortError = err?.name === "AbortError" || err?.name === "ResponseAborted";
    if (!isAbortError) {
      try {
        onError(err);
      } catch {
      }
    }
  }));
}
async function waitedUntil(fn) {
  const result = fn();
  waitUntil2(result.catch(() => {
  }));
  return result;
}
var init_wait_until = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/wait-until.js"() {
    __name(waitUntil2, "waitUntil");
    __name(safeWaitUntil, "safeWaitUntil");
    __name(waitedUntil, "waitedUntil");
  }
});

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/resume-hook.js
var resume_hook_exports = {};
__export(resume_hook_exports, {
  getHookByToken: () => getHookByToken,
  resumeHook: () => resumeHook,
  resumeWebhook: () => resumeWebhook
});
async function computeResumePayloadDigest(bytes) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const view = new Uint8Array(digest);
  let hex = "";
  for (const b of view) {
    hex += b.toString(16).padStart(2, "0");
  }
  return hex;
}
function resumeContextFromRun(run2) {
  const coreVersion = run2.executionContext?.workflowCoreVersion;
  const traceCarrier = run2.executionContext?.traceCarrier;
  const hookResumeInputVersion = run2.executionContext?.hookResumeInputVersion;
  const nodeVersion = run2.executionContext?.nodeVersion;
  return {
    deploymentId: run2.deploymentId,
    workflowName: run2.workflowName,
    runSpecVersion: run2.specVersion,
    workflowCoreVersion: typeof coreVersion === "string" ? coreVersion : void 0,
    nodeVersion: typeof nodeVersion === "string" ? nodeVersion : void 0,
    traceCarrier: traceCarrier && typeof traceCarrier === "object" ? traceCarrier : void 0,
    encryptionPublicKey: run2.encryptionPublicKey,
    hookResumeInputVersion: typeof hookResumeInputVersion === "number" ? hookResumeInputVersion : void 0
  };
}
async function resolveHookResumeInfo(hook) {
  if (hook.resumeContext) {
    return {
      resumeContext: hook.resumeContext,
      source: "hook"
    };
  }
  const run2 = await (await getWorldLazy()).runs.get(hook.runId, {
    resolveData: "none"
  });
  return {
    resumeContext: resumeContextFromRun(run2),
    source: "run_fallback",
    run: run2
  };
}
async function resolveHookEncryptionKey(hook, info) {
  const world = await getWorldLazy();
  const rawKey = await world.getEncryptionKeyForRun?.(hook.runId, {
    deploymentId: info.resumeContext.deploymentId
  });
  return rawKey ? await importKey(rawKey) : void 0;
}
function hasLazyMetadata(hook) {
  const descriptor = Object.getOwnPropertyDescriptor(hook, "metadata");
  return descriptor !== void 0 && typeof descriptor.get === "function";
}
function withLazyMetadata(raw) {
  const serialized = raw.metadata;
  let hydrated;
  let encryptionKey;
  const hydrate = /* @__PURE__ */ __name(async () => {
    const world = await getWorldLazy();
    const info = await resolveHookResumeInfo(raw);
    const rawKey = await world.getEncryptionKeyForRun?.(raw.runId, {
      deploymentId: info.resumeContext.deploymentId
    });
    encryptionKey = rawKey ? await deriveRunPayloadKeys(rawKey) : void 0;
    return await hydrateStepArguments(serialized, raw.runId, encryptionKey);
  }, "hydrate");
  const hook = raw;
  Object.defineProperty(hook, "metadata", {
    // A hook with no metadata resolves `undefined` without any I/O, so callers
    // can await unconditionally. Memoized either way: metadata is fixed at
    // hook-creation time, so hydration runs at most once per hook object.
    get: /* @__PURE__ */ __name(() => hydrated ??= typeof serialized === "undefined" ? Promise.resolve(void 0) : hydrate(), "get"),
    // Non-enumerable, matching `Run.returnValue` (a prototype getter, so it is
    // absent from an instance's own keys). Spreading or `JSON.stringify`-ing a
    // hook therefore cannot trigger hydration nobody asked for — which would
    // otherwise leave a floating rejection when the run key is unreachable, and
    // an unconsumed rejected Promise crashes Node as an unhandledRejection.
    enumerable: false,
    configurable: true
  });
  return {
    hook,
    metadataEncryptionKey: /* @__PURE__ */ __name(() => encryptionKey, "metadataEncryptionKey")
  };
}
function asLazyMetadataHook(hook) {
  return hasLazyMetadata(hook) ? hook : withLazyMetadata(hook).hook;
}
async function getHookByToken(token) {
  const world = await getWorldLazy();
  return withLazyMetadata(await world.hooks.getByToken(token)).hook;
}
async function resumeHook(tokenOrHook, payload, encryptionKeyOverride) {
  return resumeHookImpl(tokenOrHook, payload, encryptionKeyOverride, false, Date.now());
}
async function resumeHookImpl(tokenOrHook, payload, encryptionKeyOverride, hookFreshlyLookedUp, resumeRequestedAtMs, webhookOnly = false) {
  return await waitedUntil(() => {
    return trace("hook.resume", async (span) => {
      const world = await getWorldLazy();
      const token = typeof tokenOrHook === "string" ? tokenOrHook : tokenOrHook.token;
      let target = tokenOrHook;
      let fresh = hookFreshlyLookedUp;
      let keyOverride = encryptionKeyOverride;
      let redirects = 0;
      let lookupsAfterRedirect = 0;
      const MAX_LOOKUPS_AFTER_REDIRECT = 5;
      const resumeId = generateResumeId();
      const assertResendable = /* @__PURE__ */ __name((cause) => {
        if (payload instanceof Request && payload.body !== null && payload.bodyUsed) {
          span?.setAttributes({
            "workflow.hook.resume_redirect_unresendable": true
          });
          throw new WorkflowRuntimeError(`Hook token "${token}" changed owner while this webhook request was being delivered; a request body can be sent only once and it was not delivered anywhere \u2014 retry the request, which will reach the token's new owner`, {
            cause
          });
        }
      }, "assertResendable");
      for (; ; ) {
        try {
          return await resumeHookAttempt(world, span, target, payload, keyOverride, fresh, resumeRequestedAtMs, resumeId, webhookOnly);
        } catch (err) {
          if (err !== null && typeof err === "object" && notFoundReasons.get(err) === "not-webhook") {
            throw err;
          }
          if (redirects >= MAX_FORCE_CLAIM_REDIRECTS) {
            if (HookForceClaimedError.is(err)) {
              span?.setAttributes({
                "workflow.hook.resume_redirects_exhausted": true
              });
              throw new WorkflowRuntimeError(`Hook token "${token}" changed owner ${redirects} times while this resume was in flight; nothing was delivered \u2014 retry the resume`, {
                cause: err
              });
            }
            throw err;
          }
          if (HookForceClaimedError.is(err)) {
            assertResendable(err);
            redirects++;
            span?.setAttributes({
              "workflow.hook.resume_redirects": redirects,
              "workflow.hook.resume_redirect_to_run": err.claimedByRunId
            });
            target = token;
            fresh = true;
            keyOverride = void 0;
            lookupsAfterRedirect = 0;
            continue;
          }
          if (HookNotFoundError.is(err) && redirects > 0 && typeof target === "string" && lookupsAfterRedirect < MAX_LOOKUPS_AFTER_REDIRECT) {
            assertResendable(err);
            lookupsAfterRedirect++;
            await new Promise((resolve) => setTimeout(resolve, 50));
            continue;
          }
          if (HookNotFoundError.is(err) && notFoundReasons.get(err) !== "lookup") {
            const attemptedHookId = typeof target === "string" ? void 0 : target.hookId;
            let relocated;
            try {
              relocated = await world.hooks.getByToken(token);
            } catch (lookupError) {
              if (!HookNotFoundError.is(lookupError)) {
                runtimeLogger.warn("Hook resume: re-resolving the token after a not-found failed; surfacing the original error", {
                  token,
                  error: lookupError instanceof Error ? lookupError.message : String(lookupError)
                });
              }
            }
            if (relocated?.claimedFrom !== void 0 && relocated.hookId !== attemptedHookId && (attemptedHookId === void 0 || relocated.claimedFrom.hookId === attemptedHookId) && !(webhookOnly && relocated.isWebhook === false)) {
              assertResendable(err);
              redirects++;
              span?.setAttributes({
                "workflow.hook.resume_redirects": redirects,
                "workflow.hook.resume_redirect_to_run": relocated.runId
              });
              target = relocated;
              fresh = true;
              keyOverride = void 0;
              continue;
            }
          }
          throw err;
        }
      }
    });
  });
}
async function resumeHookAttempt(world, span, tokenOrHook, payload, encryptionKeyOverride, hookFreshlyLookedUp, resumeRequestedAtMs, logicalResumeId, webhookOnly) {
  try {
    const suppliedToken = typeof tokenOrHook === "string";
    let hook;
    if (suppliedToken) {
      try {
        hook = await world.hooks.getByToken(tokenOrHook);
      } catch (lookupError) {
        if (HookNotFoundError.is(lookupError)) {
          notFoundReasons.set(lookupError, "lookup");
        }
        throw lookupError;
      }
    } else {
      hook = tokenOrHook;
    }
    if (webhookOnly && hook.isWebhook === false) {
      const notWebhook = new HookNotFoundError(hook.token);
      notFoundReasons.set(notWebhook, "not-webhook");
      throw notWebhook;
    }
    const hookResumeCapabilitiesAreFresh = suppliedToken || hookFreshlyLookedUp;
    const info = await resolveHookResumeInfo(hook);
    const { resumeContext } = info;
    span?.setAttributes({
      ...HookToken(hook.token),
      ...HookId(hook.hookId),
      ...WorkflowRunId(hook.runId),
      "workflow.hook.resume_context_source": info.source
    });
    if (info.run && isTerminalWorkflowRunStatus(info.run.status)) {
      throw new HookNotFoundError(hook.token);
    }
    const capabilities = getRunCapabilities(resumeContext.workflowCoreVersion, resumeContext.nodeVersion);
    let payloadKey;
    const runPublicKey = encryptionKeyOverride ? (
      // hydrate hook metadata), so sealing would add an ECDH for no
      // saved round trip. Reuse what it resolved.
      void 0
    ) : decodeRunPublicKey(resumeContext.encryptionPublicKey);
    if (runPublicKey) {
      payloadKey = sealTo(runPublicKey);
    } else {
      let encryptionKey = encryptionKeyOverride ?? await resolveHookEncryptionKey(hook, info);
      if (!capabilities.supportedFormats.has(SerializationFormat.ENCRYPTED)) {
        encryptionKey = void 0;
      }
      payloadKey = encryptionKey;
    }
    const compression = (resumeContext.runSpecVersion ?? 0) >= SPEC_VERSION_SUPPORTS_COMPRESSION ? getCompressionMode(capabilities) : false;
    const ops = [];
    const readbackOps = [];
    const v1Compat = isLegacySpecVersion(hook.specVersion);
    const dehydratedPayload = await dehydrateStepReturnValue(payload, hook.runId, payloadKey, ops, globalThis, v1Compat, capabilities.framedByteStreams, compression, void 0, readbackOps);
    await Promise.all(ops.map((op) => op.catch((error) => {
      if (error !== void 0) throw error;
    })));
    safeWaitUntil(Promise.all(readbackOps), (err) => {
      if (err === void 0) return;
      runtimeLogger.warn("Background readback of hook payload failed", {
        workflowRunId: hook.runId,
        hookId: hook.hookId,
        error: err instanceof Error ? err.message : String(err)
      });
    });
    if (world.capabilities?.invoke === true && !v1Compat && dehydratedPayload instanceof Uint8Array) {
      if (!world.invoke) {
        throw new WorkflowRuntimeError("World advertises invoke without implementing it");
      }
      span?.setAttributes({
        "workflow.hook.resume_strategy": "invoke"
      });
      const result = HookInvocationResultSchema.parse(await world.invoke(hook.runId, {
        type: "hook_resume",
        version: 1,
        hookId: hook.hookId,
        token: hook.token,
        payload: dehydratedPayload
      }, {
        idempotencyKey: logicalResumeId
      }));
      if (result.status === "rejected") {
        if (result.code === "HOOK_NOT_FOUND") throw new HookNotFoundError(hook.token);
        throw new WorkflowRuntimeError("Executor rejected the hook invocation input");
      }
      span?.setAttributes(HookResumeCommitted(true));
      return asLazyMetadataHook(hook);
    }
    span?.setAttributes({
      ...WorkflowName(resumeContext.workflowName)
    });
    const originLink = await linkToTraceCarrier(resumeContext.traceCarrier);
    if (originLink) {
      span?.addLink?.(originLink);
    }
    const queueName = getWorkflowQueueName(resumeContext.workflowName);
    const queueOptions = {
      deploymentId: resumeContext.deploymentId,
      specVersion: resumeContext.runSpecVersion ?? SPEC_VERSION_LEGACY
    };
    const backendDedupSupported = (hookResumeCapabilitiesAreFresh ? hook.resumeCapabilities?.hookResumeDedupVersion ?? 0 : 0) >= HOOK_RESUME_DEDUP_VERSION || world.capabilities?.hookResumeDedup === true;
    const canClaimResume = backendDedupSupported && !v1Compat && dehydratedPayload instanceof Uint8Array;
    span?.setAttributes({
      "workflow.hook.resume_strategy": "sequential"
    });
    const resumeId = canClaimResume ? logicalResumeId : void 0;
    const payloadDigest = canClaimResume ? await computeResumePayloadDigest(dehydratedPayload) : void 0;
    if (resumeId) {
      span?.setAttributes({
        "workflow.hook.resume_id": resumeId
      });
    }
    const isHookGoneError = /* @__PURE__ */ __name((err) => HookNotFoundError.is(err) || RunExpiredError.is(err), "isHookGoneError");
    try {
      await world.events.create(hook.runId, {
        eventType: "hook_received",
        // The payload is already encoded for the run (see `compression`).
        specVersion: specVersionForRunWrite(resumeContext.runSpecVersion),
        correlationId: hook.hookId,
        eventData: {
          ...v1Compat ? {} : {
            token: hook.token
          },
          payload: dehydratedPayload
        }
      }, {
        v1Compat,
        ...resumeId && payloadDigest ? {
          resumeId,
          resumePayloadDigest: payloadDigest
        } : {}
      });
    } catch (err) {
      if (HookForceClaimedError.is(err)) throw err;
      if (isHookGoneError(err)) {
        throw new HookNotFoundError(hook.token);
      }
      throw err;
    }
    span?.setAttributes(HookResumeCommitted(true));
    const queuePublishRequestedAtMs = Date.now();
    await publishHookWakeWithRetry(() => world.queue(queueName, {
      runId: hook.runId,
      traceCarrier: resumeContext.traceCarrier ?? void 0,
      hookResumeTiming: {
        resumeRequestedAtMs,
        queuePublishRequestedAtMs,
        strategy: "sequential"
      }
    }, {
      ...queueOptions,
      // Dedup retried publishes whose response was lost: a
      // duplicate wake is harmless for correctness (deterministic
      // replay) but costs a full replay of the run, and the queue
      // accepts a repeated idempotency key by delivering only one
      // of the messages. Claim-less writes have no resumeId and
      // keep the previous behavior.
      ...resumeId ? {
        idempotencyKey: `hook-${resumeId}`
      } : {}
    }), world.isDeploymentUnavailableError?.bind(world));
    span?.setAttributes(HookWakePublished(true));
    return asLazyMetadataHook(hook);
  } catch (err) {
    span?.setAttributes({
      ...HookToken(typeof tokenOrHook === "string" ? tokenOrHook : tokenOrHook.token),
      ...HookFound(false)
    });
    throw err;
  }
}
async function resumeWebhook(token, request) {
  const resumeRequestedAtMs = Date.now();
  const world = await getWorldLazy();
  const { hook, metadataEncryptionKey } = withLazyMetadata(await world.hooks.getByToken(token));
  if (hook.isWebhook === false) {
    throw new HookNotFoundError(token);
  }
  const metadata = await hook.metadata;
  let response;
  let responseReadable;
  if (metadata && typeof metadata === "object" && "respondWith" in metadata) {
    if (metadata.respondWith === "manual") {
      const { readable, writable } = new TransformStream();
      responseReadable = readable;
      request[WEBHOOK_RESPONSE_WRITABLE] = writable;
    } else if (metadata.respondWith instanceof Response) {
      response = metadata.respondWith;
    } else {
      throw new WorkflowRuntimeError(`Invalid \`respondWith\` value: ${metadata.respondWith}`, {
        slug: ERROR_SLUGS.WEBHOOK_INVALID_RESPOND_WITH_VALUE
      });
    }
  } else {
    response = new Response(null, {
      status: 202
    });
  }
  await resumeHookImpl(hook, request, metadataEncryptionKey(), true, resumeRequestedAtMs, true);
  if (responseReadable) {
    const reader = responseReadable.getReader();
    const chunk = await reader.read();
    if (chunk.value) {
      response = chunk.value;
    }
    reader.cancel();
  }
  if (!response) {
    throw new WorkflowRuntimeError("Workflow run did not send a response", {
      slug: ERROR_SLUGS.WEBHOOK_RESPONSE_NOT_SENT
    });
  }
  return response;
}
var generateResumeId, MAX_FORCE_CLAIM_REDIRECTS, notFoundReasons;
var init_resume_hook = __esm({
  "../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/resume-hook.js"() {
    init_dist2();
    init_dist3();
    init_node();
    init_capabilities();
    init_encryption();
    init_logger();
    init_sealed_box();
    init_encryption2();
    init_serialization2();
    init_symbols();
    init_semantic_conventions();
    init_telemetry();
    init_get_world_lazy();
    init_helpers();
    init_hook_wake();
    init_invocations();
    init_run_spec_version();
    init_wait_until();
    generateResumeId = monotonicFactory();
    __name(computeResumePayloadDigest, "computeResumePayloadDigest");
    __name(resumeContextFromRun, "resumeContextFromRun");
    __name(resolveHookResumeInfo, "resolveHookResumeInfo");
    __name(resolveHookEncryptionKey, "resolveHookEncryptionKey");
    __name(hasLazyMetadata, "hasLazyMetadata");
    __name(withLazyMetadata, "withLazyMetadata");
    __name(asLazyMetadataHook, "asLazyMetadataHook");
    __name(getHookByToken, "getHookByToken");
    __name(resumeHook, "resumeHook");
    MAX_FORCE_CLAIM_REDIRECTS = 3;
    notFoundReasons = /* @__PURE__ */ new WeakMap();
    __name(resumeHookImpl, "resumeHookImpl");
    __name(resumeHookAttempt, "resumeHookAttempt");
    __name(resumeWebhook, "resumeWebhook");
  }
});

// ../../node_modules/.pnpm/workflow@5.2.3_@aws-sdk+credential-provider-web-identity@3.972.49_@nestjs+common@12.3.2_1e057cc79bedd54d62c32937a6d55130/node_modules/workflow/dist/internal/builtins.js
async function __builtin_response_array_buffer() {
  return this.arrayBuffer();
}
__name(__builtin_response_array_buffer, "__builtin_response_array_buffer");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "__builtin_response_array_buffer",
    configurable: true
  });
})(__builtin_response_array_buffer, "__builtin_response_array_buffer");
async function __builtin_response_json() {
  return this.json();
}
__name(__builtin_response_json, "__builtin_response_json");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "__builtin_response_json",
    configurable: true
  });
})(__builtin_response_json, "__builtin_response_json");
async function __builtin_response_text() {
  return this.text();
}
__name(__builtin_response_text, "__builtin_response_text");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "__builtin_response_text",
    configurable: true
  });
})(__builtin_response_text, "__builtin_response_text");
var UNSUPPORTED_WORLD_WARNED = /* @__PURE__ */ Symbol.for("@workflow/setAttributes//unsupportedWorldWarned");
var INTERNAL_ATTRIBUTES_MAX_ATTEMPTS = 3;
function formatUnknownError(error) {
  if (error instanceof Error) {
    return error.stack ?? `${error.name}: ${error.message}`;
  }
  return String(error);
}
__name(formatUnknownError, "formatUnknownError");
async function __builtin_set_attributes(changes, options) {
  if (changes.length === 0) return;
  const g = globalThis;
  const contextStorage2 = g[/* @__PURE__ */ Symbol.for("WORKFLOW_STEP_CONTEXT_STORAGE")];
  const store = contextStorage2?.getStore?.();
  const attempt = typeof store?.stepMetadata?.attempt === "number" ? store.stepMetadata.attempt : INTERNAL_ATTRIBUTES_MAX_ATTEMPTS;
  const world = g[/* @__PURE__ */ Symbol.for("@workflow/world//cache")];
  if (typeof world?.runs?.experimentalSetAttributes !== "function") {
    if (!g[UNSUPPORTED_WORLD_WARNED]) {
      g[UNSUPPORTED_WORLD_WARNED] = true;
      const worldName = world?.name ? ` (${world.name})` : "";
      console.warn(`[workflow] setAttributes: the current world implementation${worldName} does not implement experimentalSetAttributes; this call (and any subsequent setAttributes calls in this process) is a no-op. Attributes will become available once the world adapter adds support.`);
    }
    return;
  }
  try {
    const runId = store?.workflowMetadata?.workflowRunId;
    if (!runId) {
      throw new Error("__builtin_set_attributes: no workflow run id available in step context");
    }
    await world.runs.experimentalSetAttributes(runId, changes, options);
  } catch (error) {
    if (attempt < INTERNAL_ATTRIBUTES_MAX_ATTEMPTS) {
      throw error;
    }
    console.error(`[workflow] setAttributes: failed to post tags after ${INTERNAL_ATTRIBUTES_MAX_ATTEMPTS} attempts; dropping the internal attribute write. ${formatUnknownError(error)}`);
  }
}
__name(__builtin_set_attributes, "__builtin_set_attributes");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "__builtin_set_attributes",
    configurable: true
  });
})(__builtin_set_attributes, "__builtin_set_attributes");
__builtin_set_attributes.maxRetries = INTERNAL_ATTRIBUTES_MAX_ATTEMPTS - 1;

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/index.js
init_dist2();

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/capture-stack.js
function redirectStackToCaller(err, stackStartFn) {
  const capture = Error.captureStackTrace;
  capture?.(err, stackStartFn);
}
__name(redirectStackToCaller, "redirectStackToCaller");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/context-violation-error.js
init_ansi();
var INSPECT_CUSTOM = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
function renderSegmentPlain(s) {
  if ("code" in s) return `\`${s.code}\``;
  if ("dim" in s) return s.dim;
  return s.text;
}
__name(renderSegmentPlain, "renderSegmentPlain");
function renderSegmentPretty(s) {
  if ("code" in s) return code(s.code);
  if ("dim" in s) return dim(s.dim);
  return s.text;
}
__name(renderSegmentPretty, "renderSegmentPretty");
function renderDetailPlain(d) {
  if (d.type === "docs") return `docs: ${d.url}`;
  return d.segments.map(renderSegmentPlain).join("");
}
__name(renderDetailPlain, "renderDetailPlain");
function renderDetailPretty(d) {
  if (d.type === "docs") return docs(d.url);
  return d.segments.map(renderSegmentPretty).join("");
}
__name(renderDetailPretty, "renderDetailPretty");
function renderPlain(c) {
  const title = c.title.map(renderSegmentPlain).join("");
  const lines = [
    title
  ];
  c.details.forEach((detail, index) => {
    const isLast = index === c.details.length - 1;
    const first = isLast ? "\u2570\u25B6 " : "\u251C\u25B6 ";
    const cont = isLast ? "   " : "\u2502  ";
    const raw = renderDetailPlain(detail).split("\n");
    raw.forEach((line, i2) => {
      lines.push(`${i2 === 0 ? first : cont}${line}`);
    });
  });
  return lines.join("\n");
}
__name(renderPlain, "renderPlain");
function renderPretty(c) {
  const title = c.title.map(renderSegmentPretty).join("");
  return frame(title, c.details.map(renderDetailPretty));
}
__name(renderPretty, "renderPretty");
var ContextViolationError = class extends Error {
  static {
    __name(this, "ContextViolationError");
  }
  /** Non-retryable, see class doc. */
  fatal = true;
  #content;
  constructor(content) {
    super(renderPlain(content));
    this.#content = content;
  }
  /**
   * `console.log(err)` and most Node internals route through `util.inspect`,
   * which respects this symbol. Returning a custom string here means the
   * thrown error prints as a pretty frame in the terminal while `.message`
   * and `.stack` stay plain.
   */
  [INSPECT_CUSTOM]() {
    const pretty = renderPretty(this.#content);
    const messageLineCount = this.message.split("\n").length;
    const tail = (this.stack ?? "").split("\n").slice(messageLineCount).join("\n");
    return tail ? `${this.name}: ${pretty}
${tail}` : `${this.name}: ${pretty}`;
  }
  toString() {
    return `${this.name}: ${renderPretty(this.#content)}`;
  }
};
var NotInStepContextError = class extends ContextViolationError {
  static {
    __name(this, "NotInStepContextError");
  }
  name = "NotInStepContextError";
  constructor(functionName, docsUrl) {
    super({
      title: [
        {
          code: functionName
        },
        {
          text: " can only be called inside a step function"
        }
      ],
      details: [
        {
          type: "docs",
          url: docsUrl
        }
      ]
    });
  }
};

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/context-errors.js
function throwNotInStepContext(functionName, docsUrl, stackStartFn) {
  const err = new NotInStepContextError(functionName, docsUrl);
  redirectStackToCaller(err, stackStartFn);
  throw err;
}
__name(throwNotInStepContext, "throwNotInStepContext");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/define-hook.js
init_resume_hook();

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/set-attributes.js
init_dist2();
init_dist3();

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/attribute-changes.js
init_dist2();
init_attributes_validation();
function normalizeAttributeChanges(attrs, options = {}, writer) {
  if (attrs === null || typeof attrs !== "object" || Array.isArray(attrs)) {
    throw new FatalError(`setAttributes requires a plain object, got ${attrs === null ? "null" : Array.isArray(attrs) ? "array" : typeof attrs}`);
  }
  const changes = Object.entries(attrs).map(([key, value]) => ({
    key,
    value: value === void 0 ? null : value
  }));
  if (changes.length === 0) return changes;
  const allowReservedAttributes = options.allowReservedAttributes === true;
  try {
    validateAttributeChanges(changes, {
      allowReservedAttributes
    });
    if (writer) {
      validateAttributeEventDataSize({
        changes,
        writer,
        ...allowReservedAttributes ? {
          allowReservedAttributes: true
        } : {}
      });
    }
  } catch (err) {
    if (err instanceof AttributeValidationError) {
      throw new FatalError(err.message);
    }
    throw err;
  }
  return changes;
}
__name(normalizeAttributeChanges, "normalizeAttributeChanges");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/set-attributes.js
init_get_world_lazy();
init_context_storage();

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/sleep.js
init_symbols();

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/step/get-step-metadata.js
init_context_storage();
function getStepMetadata() {
  const ctx = contextStorage.getStore();
  if (!ctx) {
    throwNotInStepContext("getStepMetadata()", "https://workflow-sdk.dev/docs/api-reference/workflow/get-step-metadata", getStepMetadata);
  }
  return ctx.stepMetadata;
}
__name(getStepMetadata, "getStepMetadata");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/step/get-workflow-metadata.js
init_context_storage();

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/step/writable-stream.js
init_flushable_stream();
init_sealed_box();
init_serialization2();
init_symbols();
init_util();
init_context_storage();

// ../../node_modules/.pnpm/workflow@5.2.3_@aws-sdk+credential-provider-web-identity@3.972.49_@nestjs+common@12.3.2_1e057cc79bedd54d62c32937a6d55130/node_modules/workflow/dist/stdlib.js
async function fetch2(...args) {
  return globalThis.fetch(...args);
}
__name(fetch2, "fetch");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "fetch",
    configurable: true
  });
})(fetch2, "step//./node_modules/.pnpm/workflow@5.2.3_@aws-sdk+credential-provider-web-identity@3.972.49_@nestjs+common@12.3.2_1e057cc79bedd54d62c32937a6d55130/node_modules/workflow/dist/stdlib//fetch");

// src/features/execution/steps.ts
import { operationKey, transition, payloadHash } from "@intake/contracts";

// src/lib/db.ts
import { neon } from "@neondatabase/serverless";
function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}
__name(sql, "sql");

// src/features/erp/erp.server.ts
function config() {
  const base = process.env.ERP_BASE_URL;
  const token = process.env.ERP_SERVICE_TOKEN;
  if (!base || !token) throw new Error("ERP_BASE_URL / ERP_SERVICE_TOKEN not set");
  return {
    base: base.replace(/\/$/, ""),
    token
  };
}
__name(config, "config");
async function createCustomer(command, opts = {}) {
  const { base, token } = config();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 8e3);
  try {
    const res = await fetch(`${base}/api/customers`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(command),
      signal: ctrl.signal,
      cache: "no-store"
    });
    const body = await res.json().catch(() => ({}));
    if (res.status === 201 && body.customerNumber) return {
      outcome: "created",
      erpCustomerNumber: body.customerNumber
    };
    if (res.status === 200 && body.customerNumber) return {
      outcome: "replayed",
      erpCustomerNumber: body.customerNumber
    };
    if (res.status === 409) return {
      outcome: "rejected",
      category: "conflict",
      reason: body.reason ?? "same operation key with a different payload"
    };
    if (res.status === 422) return {
      outcome: "rejected",
      category: "business",
      reason: body.reason ?? "rejected by the ERP"
    };
    if (res.status === 401 || res.status === 403) return {
      outcome: "rejected",
      category: "auth",
      reason: "ERP rejected the service credential"
    };
    return {
      outcome: "transient",
      reason: `ERP responded ${res.status}`
    };
  } catch (e) {
    return {
      outcome: "transient",
      reason: e instanceof Error && e.name === "AbortError" ? "ERP timed out" : `ERP unreachable: ${e instanceof Error ? e.message : "error"}`
    };
  } finally {
    clearTimeout(timer);
  }
}
__name(createCustomer, "createCustomer");

// src/features/execution/steps.ts
async function markWakeDeliveredStep(requestId, revision, workflowRunId) {
  const db = sql();
  await db.transaction([
    db`update deliveries set status = 'delivered', updated_at = now() where request_id = ${requestId} and revision = ${revision} and kind = 'wake'`,
    db`update requests set workflow_run_id = ${workflowRunId} where request_id = ${requestId}`
  ]);
}
__name(markWakeDeliveredStep, "markWakeDeliveredStep");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "markWakeDeliveredStep",
    configurable: true
  });
})(markWakeDeliveredStep, "step//./src/features/execution/steps//markWakeDeliveredStep");
async function startCreatingStep(requestId, revision, workflowRunId) {
  const db = sql();
  const rows = await db`select r.state, v.payload, v.payload_hash from requests r join request_revisions v on v.request_id = r.request_id and v.revision = ${revision} where r.request_id = ${requestId} and r.current_revision = ${revision}`;
  const r = rows[0];
  if (!r) return null;
  const state = r.state;
  const payload = r.payload;
  const key = operationKey(requestId, revision);
  if (state.kind === "creating" && state.operationKey === key) return {
    operationKey: key,
    payloadHash: r.payload_hash,
    payload
  };
  const t = transition(state, {
    type: "start_creating",
    operationKey: key
  });
  if (!t.ok) return null;
  if (state.kind !== "approved" || state.approval.payloadHash !== r.payload_hash) return null;
  const hash = await payloadHash(payload);
  if (hash !== r.payload_hash) return null;
  await db.transaction([
    db`update requests set state_kind = ${t.next.kind}, state = ${JSON.stringify(t.next)}::jsonb, workflow_run_id = ${workflowRunId}, updated_at = now() where request_id = ${requestId} and current_revision = ${revision} and state_kind = 'approved'`,
    db`insert into request_events (request_id, kind, actor, detail) values (${requestId}, 'creating', 'workflow', ${JSON.stringify({
      operationKey: key,
      workflowRunId
    })}::jsonb)`
  ]);
  return {
    operationKey: key,
    payloadHash: hash,
    payload
  };
}
__name(startCreatingStep, "startCreatingStep");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "startCreatingStep",
    configurable: true
  });
})(startCreatingStep, "step//./src/features/execution/steps//startCreatingStep");
async function erpWriteStep(command) {
  const result = await createCustomer(command, {
    timeoutMs: 8e3
  });
  if (result.outcome === "transient") {
    const { attempt } = getStepMetadata();
    throw new RetryableError(result.reason, {
      retryAfter: 1e3 * 2 ** Math.max(0, attempt - 1)
    });
  }
  return result;
}
__name(erpWriteStep, "erpWriteStep");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "erpWriteStep",
    configurable: true
  });
})(erpWriteStep, "step//./src/features/execution/steps//erpWriteStep");
erpWriteStep.maxRetries = 3;
async function finishStep(requestId, revision, result) {
  const db = sql();
  const rows = await db`select state from requests where request_id = ${requestId} and current_revision = ${revision}`;
  const state = rows[0]?.state;
  if (!state || state.kind !== "creating") return;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  let t;
  switch (result.outcome) {
    case "created":
    case "replayed":
      t = transition(state, {
        type: "created",
        erpCustomerNumber: result.erpCustomerNumber,
        createdAt: now
      });
      break;
    case "rejected":
      t = transition(state, {
        type: "stop",
        category: result.category,
        effect: "no_effect",
        reason: result.reason
      });
      break;
    case "transient":
      t = transition(state, {
        type: "stop",
        category: "transport",
        effect: "unknown",
        reason: result.reason
      });
      break;
  }
  if (!t.ok) return;
  await db.transaction([
    db`update requests set state_kind = ${t.next.kind}, state = ${JSON.stringify(t.next)}::jsonb, updated_at = now() where request_id = ${requestId} and current_revision = ${revision} and state_kind = 'creating'`,
    db`insert into request_events (request_id, kind, actor, detail) values (${requestId}, ${t.next.kind}, 'workflow', ${JSON.stringify(result)}::jsonb)`
  ]);
}
__name(finishStep, "finishStep");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "finishStep",
    configurable: true
  });
})(finishStep, "step//./src/features/execution/steps//finishStep");

// tests/workflow/smoke.workflow.ts
async function smokeWorkflow(token) {
  throw new Error("You attempted to execute workflow smokeWorkflow function directly. To start a workflow, use start(smokeWorkflow) from workflow/api");
}
__name(smokeWorkflow, "smokeWorkflow");
smokeWorkflow.workflowId = "workflow//./tests/workflow/smoke.workflow//smokeWorkflow";
async function stampStep(decision) {
  return `${decision}@step`;
}
__name(stampStep, "stampStep");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "stampStep",
    configurable: true
  });
})(stampStep, "step//./tests/workflow/smoke.workflow//stampStep");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/run.js
init_dist2();
init_dist4();
init_env_config();
init_encryption2();
init_serialization2();
init_util();
init_get_world_lazy();
init_run_spec_version();

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/runs.js
init_dist2();
init_dist3();
init_encryption2();
init_serialization2();

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/dynamic-workflow.js
init_dist2();

// ../../node_modules/.pnpm/acorn@8.15.0/node_modules/acorn/dist/acorn.mjs
var astralIdentifierCodes = [
  509,
  0,
  227,
  0,
  150,
  4,
  294,
  9,
  1368,
  2,
  2,
  1,
  6,
  3,
  41,
  2,
  5,
  0,
  166,
  1,
  574,
  3,
  9,
  9,
  7,
  9,
  32,
  4,
  318,
  1,
  80,
  3,
  71,
  10,
  50,
  3,
  123,
  2,
  54,
  14,
  32,
  10,
  3,
  1,
  11,
  3,
  46,
  10,
  8,
  0,
  46,
  9,
  7,
  2,
  37,
  13,
  2,
  9,
  6,
  1,
  45,
  0,
  13,
  2,
  49,
  13,
  9,
  3,
  2,
  11,
  83,
  11,
  7,
  0,
  3,
  0,
  158,
  11,
  6,
  9,
  7,
  3,
  56,
  1,
  2,
  6,
  3,
  1,
  3,
  2,
  10,
  0,
  11,
  1,
  3,
  6,
  4,
  4,
  68,
  8,
  2,
  0,
  3,
  0,
  2,
  3,
  2,
  4,
  2,
  0,
  15,
  1,
  83,
  17,
  10,
  9,
  5,
  0,
  82,
  19,
  13,
  9,
  214,
  6,
  3,
  8,
  28,
  1,
  83,
  16,
  16,
  9,
  82,
  12,
  9,
  9,
  7,
  19,
  58,
  14,
  5,
  9,
  243,
  14,
  166,
  9,
  71,
  5,
  2,
  1,
  3,
  3,
  2,
  0,
  2,
  1,
  13,
  9,
  120,
  6,
  3,
  6,
  4,
  0,
  29,
  9,
  41,
  6,
  2,
  3,
  9,
  0,
  10,
  10,
  47,
  15,
  343,
  9,
  54,
  7,
  2,
  7,
  17,
  9,
  57,
  21,
  2,
  13,
  123,
  5,
  4,
  0,
  2,
  1,
  2,
  6,
  2,
  0,
  9,
  9,
  49,
  4,
  2,
  1,
  2,
  4,
  9,
  9,
  330,
  3,
  10,
  1,
  2,
  0,
  49,
  6,
  4,
  4,
  14,
  10,
  5350,
  0,
  7,
  14,
  11465,
  27,
  2343,
  9,
  87,
  9,
  39,
  4,
  60,
  6,
  26,
  9,
  535,
  9,
  470,
  0,
  2,
  54,
  8,
  3,
  82,
  0,
  12,
  1,
  19628,
  1,
  4178,
  9,
  519,
  45,
  3,
  22,
  543,
  4,
  4,
  5,
  9,
  7,
  3,
  6,
  31,
  3,
  149,
  2,
  1418,
  49,
  513,
  54,
  5,
  49,
  9,
  0,
  15,
  0,
  23,
  4,
  2,
  14,
  1361,
  6,
  2,
  16,
  3,
  6,
  2,
  1,
  2,
  4,
  101,
  0,
  161,
  6,
  10,
  9,
  357,
  0,
  62,
  13,
  499,
  13,
  245,
  1,
  2,
  9,
  726,
  6,
  110,
  6,
  6,
  9,
  4759,
  9,
  787719,
  239
];
var astralIdentifierStartCodes = [
  0,
  11,
  2,
  25,
  2,
  18,
  2,
  1,
  2,
  14,
  3,
  13,
  35,
  122,
  70,
  52,
  268,
  28,
  4,
  48,
  48,
  31,
  14,
  29,
  6,
  37,
  11,
  29,
  3,
  35,
  5,
  7,
  2,
  4,
  43,
  157,
  19,
  35,
  5,
  35,
  5,
  39,
  9,
  51,
  13,
  10,
  2,
  14,
  2,
  6,
  2,
  1,
  2,
  10,
  2,
  14,
  2,
  6,
  2,
  1,
  4,
  51,
  13,
  310,
  10,
  21,
  11,
  7,
  25,
  5,
  2,
  41,
  2,
  8,
  70,
  5,
  3,
  0,
  2,
  43,
  2,
  1,
  4,
  0,
  3,
  22,
  11,
  22,
  10,
  30,
  66,
  18,
  2,
  1,
  11,
  21,
  11,
  25,
  71,
  55,
  7,
  1,
  65,
  0,
  16,
  3,
  2,
  2,
  2,
  28,
  43,
  28,
  4,
  28,
  36,
  7,
  2,
  27,
  28,
  53,
  11,
  21,
  11,
  18,
  14,
  17,
  111,
  72,
  56,
  50,
  14,
  50,
  14,
  35,
  39,
  27,
  10,
  22,
  251,
  41,
  7,
  1,
  17,
  2,
  60,
  28,
  11,
  0,
  9,
  21,
  43,
  17,
  47,
  20,
  28,
  22,
  13,
  52,
  58,
  1,
  3,
  0,
  14,
  44,
  33,
  24,
  27,
  35,
  30,
  0,
  3,
  0,
  9,
  34,
  4,
  0,
  13,
  47,
  15,
  3,
  22,
  0,
  2,
  0,
  36,
  17,
  2,
  24,
  20,
  1,
  64,
  6,
  2,
  0,
  2,
  3,
  2,
  14,
  2,
  9,
  8,
  46,
  39,
  7,
  3,
  1,
  3,
  21,
  2,
  6,
  2,
  1,
  2,
  4,
  4,
  0,
  19,
  0,
  13,
  4,
  31,
  9,
  2,
  0,
  3,
  0,
  2,
  37,
  2,
  0,
  26,
  0,
  2,
  0,
  45,
  52,
  19,
  3,
  21,
  2,
  31,
  47,
  21,
  1,
  2,
  0,
  185,
  46,
  42,
  3,
  37,
  47,
  21,
  0,
  60,
  42,
  14,
  0,
  72,
  26,
  38,
  6,
  186,
  43,
  117,
  63,
  32,
  7,
  3,
  0,
  3,
  7,
  2,
  1,
  2,
  23,
  16,
  0,
  2,
  0,
  95,
  7,
  3,
  38,
  17,
  0,
  2,
  0,
  29,
  0,
  11,
  39,
  8,
  0,
  22,
  0,
  12,
  45,
  20,
  0,
  19,
  72,
  200,
  32,
  32,
  8,
  2,
  36,
  18,
  0,
  50,
  29,
  113,
  6,
  2,
  1,
  2,
  37,
  22,
  0,
  26,
  5,
  2,
  1,
  2,
  31,
  15,
  0,
  328,
  18,
  16,
  0,
  2,
  12,
  2,
  33,
  125,
  0,
  80,
  921,
  103,
  110,
  18,
  195,
  2637,
  96,
  16,
  1071,
  18,
  5,
  26,
  3994,
  6,
  582,
  6842,
  29,
  1763,
  568,
  8,
  30,
  18,
  78,
  18,
  29,
  19,
  47,
  17,
  3,
  32,
  20,
  6,
  18,
  433,
  44,
  212,
  63,
  129,
  74,
  6,
  0,
  67,
  12,
  65,
  1,
  2,
  0,
  29,
  6135,
  9,
  1237,
  42,
  9,
  8936,
  3,
  2,
  6,
  2,
  1,
  2,
  290,
  16,
  0,
  30,
  2,
  3,
  0,
  15,
  3,
  9,
  395,
  2309,
  106,
  6,
  12,
  4,
  8,
  8,
  9,
  5991,
  84,
  2,
  70,
  2,
  1,
  3,
  0,
  3,
  1,
  3,
  3,
  2,
  11,
  2,
  0,
  2,
  6,
  2,
  64,
  2,
  3,
  3,
  7,
  2,
  6,
  2,
  27,
  2,
  3,
  2,
  4,
  2,
  0,
  4,
  6,
  2,
  339,
  3,
  24,
  2,
  24,
  2,
  30,
  2,
  24,
  2,
  30,
  2,
  24,
  2,
  30,
  2,
  24,
  2,
  30,
  2,
  24,
  2,
  7,
  1845,
  30,
  7,
  5,
  262,
  61,
  147,
  44,
  11,
  6,
  17,
  0,
  322,
  29,
  19,
  43,
  485,
  27,
  229,
  29,
  3,
  0,
  496,
  6,
  2,
  3,
  2,
  1,
  2,
  14,
  2,
  196,
  60,
  67,
  8,
  0,
  1205,
  3,
  2,
  26,
  2,
  1,
  2,
  0,
  3,
  0,
  2,
  9,
  2,
  3,
  2,
  0,
  2,
  0,
  7,
  0,
  5,
  0,
  2,
  0,
  2,
  0,
  2,
  2,
  2,
  1,
  2,
  0,
  3,
  0,
  2,
  0,
  2,
  0,
  2,
  0,
  2,
  0,
  2,
  1,
  2,
  0,
  3,
  3,
  2,
  6,
  2,
  3,
  2,
  3,
  2,
  0,
  2,
  9,
  2,
  16,
  6,
  2,
  2,
  4,
  2,
  16,
  4421,
  42719,
  33,
  4153,
  7,
  221,
  3,
  5761,
  15,
  7472,
  16,
  621,
  2467,
  541,
  1507,
  4938,
  6,
  4191
];
var nonASCIIidentifierChars = "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0CF3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF-\u1ACE\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\u30FB\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F\uFF65";
var nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CD\uA7D0\uA7D1\uA7D3\uA7D5-\uA7DC\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
var reservedWords = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
};
var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
var keywords$1 = {
  5: ecma5AndLessKeywords,
  "5module": ecma5AndLessKeywords + " export import",
  6: ecma5AndLessKeywords + " const class extends export import super"
};
var keywordRelationalOperator = /^in(stanceof)?$/;
var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
function isInAstralSet(code2, set) {
  var pos = 65536;
  for (var i2 = 0; i2 < set.length; i2 += 2) {
    pos += set[i2];
    if (pos > code2) {
      return false;
    }
    pos += set[i2 + 1];
    if (pos >= code2) {
      return true;
    }
  }
  return false;
}
__name(isInAstralSet, "isInAstralSet");
function isIdentifierStart(code2, astral) {
  if (code2 < 65) {
    return code2 === 36;
  }
  if (code2 < 91) {
    return true;
  }
  if (code2 < 97) {
    return code2 === 95;
  }
  if (code2 < 123) {
    return true;
  }
  if (code2 <= 65535) {
    return code2 >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code2));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code2, astralIdentifierStartCodes);
}
__name(isIdentifierStart, "isIdentifierStart");
function isIdentifierChar(code2, astral) {
  if (code2 < 48) {
    return code2 === 36;
  }
  if (code2 < 58) {
    return true;
  }
  if (code2 < 65) {
    return false;
  }
  if (code2 < 91) {
    return true;
  }
  if (code2 < 97) {
    return code2 === 95;
  }
  if (code2 < 123) {
    return true;
  }
  if (code2 <= 65535) {
    return code2 >= 170 && nonASCIIidentifier.test(String.fromCharCode(code2));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code2, astralIdentifierStartCodes) || isInAstralSet(code2, astralIdentifierCodes);
}
__name(isIdentifierChar, "isIdentifierChar");
var TokenType = /* @__PURE__ */ __name(function TokenType2(label, conf) {
  if (conf === void 0) conf = {};
  this.label = label;
  this.keyword = conf.keyword;
  this.beforeExpr = !!conf.beforeExpr;
  this.startsExpr = !!conf.startsExpr;
  this.isLoop = !!conf.isLoop;
  this.isAssign = !!conf.isAssign;
  this.prefix = !!conf.prefix;
  this.postfix = !!conf.postfix;
  this.binop = conf.binop || null;
  this.updateContext = null;
}, "TokenType");
function binop(name, prec) {
  return new TokenType(name, {
    beforeExpr: true,
    binop: prec
  });
}
__name(binop, "binop");
var beforeExpr = {
  beforeExpr: true
};
var startsExpr = {
  startsExpr: true
};
var keywords = {};
function kw(name, options) {
  if (options === void 0) options = {};
  options.keyword = name;
  return keywords[name] = new TokenType(name, options);
}
__name(kw, "kw");
var types$1 = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  privateId: new TokenType("privateId", startsExpr),
  eof: new TokenType("eof"),
  // Punctuation token types.
  bracketL: new TokenType("[", {
    beforeExpr: true,
    startsExpr: true
  }),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", {
    beforeExpr: true,
    startsExpr: true
  }),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", {
    beforeExpr: true,
    startsExpr: true
  }),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  questionDot: new TokenType("?."),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  invalidTemplate: new TokenType("invalidTemplate"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", {
    beforeExpr: true,
    startsExpr: true
  }),
  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.
  eq: new TokenType("=", {
    beforeExpr: true,
    isAssign: true
  }),
  assign: new TokenType("_=", {
    beforeExpr: true,
    isAssign: true
  }),
  incDec: new TokenType("++/--", {
    prefix: true,
    postfix: true,
    startsExpr: true
  }),
  prefix: new TokenType("!/~", {
    beforeExpr: true,
    prefix: true,
    startsExpr: true
  }),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=/===/!==", 6),
  relational: binop("</>/<=/>=", 7),
  bitShift: binop("<</>>/>>>", 8),
  plusMin: new TokenType("+/-", {
    beforeExpr: true,
    binop: 9,
    prefix: true,
    startsExpr: true
  }),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  starstar: new TokenType("**", {
    beforeExpr: true
  }),
  coalesce: binop("??", 1),
  // Keyword token types.
  _break: kw("break"),
  _case: kw("case", beforeExpr),
  _catch: kw("catch"),
  _continue: kw("continue"),
  _debugger: kw("debugger"),
  _default: kw("default", beforeExpr),
  _do: kw("do", {
    isLoop: true,
    beforeExpr: true
  }),
  _else: kw("else", beforeExpr),
  _finally: kw("finally"),
  _for: kw("for", {
    isLoop: true
  }),
  _function: kw("function", startsExpr),
  _if: kw("if"),
  _return: kw("return", beforeExpr),
  _switch: kw("switch"),
  _throw: kw("throw", beforeExpr),
  _try: kw("try"),
  _var: kw("var"),
  _const: kw("const"),
  _while: kw("while", {
    isLoop: true
  }),
  _with: kw("with"),
  _new: kw("new", {
    beforeExpr: true,
    startsExpr: true
  }),
  _this: kw("this", startsExpr),
  _super: kw("super", startsExpr),
  _class: kw("class", startsExpr),
  _extends: kw("extends", beforeExpr),
  _export: kw("export"),
  _import: kw("import", startsExpr),
  _null: kw("null", startsExpr),
  _true: kw("true", startsExpr),
  _false: kw("false", startsExpr),
  _in: kw("in", {
    beforeExpr: true,
    binop: 7
  }),
  _instanceof: kw("instanceof", {
    beforeExpr: true,
    binop: 7
  }),
  _typeof: kw("typeof", {
    beforeExpr: true,
    prefix: true,
    startsExpr: true
  }),
  _void: kw("void", {
    beforeExpr: true,
    prefix: true,
    startsExpr: true
  }),
  _delete: kw("delete", {
    beforeExpr: true,
    prefix: true,
    startsExpr: true
  })
};
var lineBreak = /\r\n?|\n|\u2028|\u2029/;
var lineBreakG = new RegExp(lineBreak.source, "g");
function isNewLine(code2) {
  return code2 === 10 || code2 === 13 || code2 === 8232 || code2 === 8233;
}
__name(isNewLine, "isNewLine");
function nextLineBreak(code2, from, end) {
  if (end === void 0) end = code2.length;
  for (var i2 = from; i2 < end; i2++) {
    var next2 = code2.charCodeAt(i2);
    if (isNewLine(next2)) {
      return i2 < end - 1 && next2 === 13 && code2.charCodeAt(i2 + 1) === 10 ? i2 + 2 : i2 + 1;
    }
  }
  return -1;
}
__name(nextLineBreak, "nextLineBreak");
var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
var ref = Object.prototype;
var hasOwnProperty = ref.hasOwnProperty;
var toString = ref.toString;
var hasOwn = Object.hasOwn || function(obj, propName) {
  return hasOwnProperty.call(obj, propName);
};
var isArray = Array.isArray || function(obj) {
  return toString.call(obj) === "[object Array]";
};
var regexpCache = /* @__PURE__ */ Object.create(null);
function wordsRegexp(words) {
  return regexpCache[words] || (regexpCache[words] = new RegExp("^(?:" + words.replace(/ /g, "|") + ")$"));
}
__name(wordsRegexp, "wordsRegexp");
function codePointToString(code2) {
  if (code2 <= 65535) {
    return String.fromCharCode(code2);
  }
  code2 -= 65536;
  return String.fromCharCode((code2 >> 10) + 55296, (code2 & 1023) + 56320);
}
__name(codePointToString, "codePointToString");
var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
var Position = /* @__PURE__ */ __name(function Position2(line, col) {
  this.line = line;
  this.column = col;
}, "Position");
Position.prototype.offset = /* @__PURE__ */ __name(function offset(n) {
  return new Position(this.line, this.column + n);
}, "offset");
var SourceLocation = /* @__PURE__ */ __name(function SourceLocation2(p, start2, end) {
  this.start = start2;
  this.end = end;
  if (p.sourceFile !== null) {
    this.source = p.sourceFile;
  }
}, "SourceLocation");
function getLineInfo(input, offset2) {
  for (var line = 1, cur = 0; ; ) {
    var nextBreak = nextLineBreak(input, cur, offset2);
    if (nextBreak < 0) {
      return new Position(line, offset2 - cur);
    }
    ++line;
    cur = nextBreak;
  }
}
__name(getLineInfo, "getLineInfo");
var defaultOptions = {
  // `ecmaVersion` indicates the ECMAScript version to parse. Must be
  // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
  // (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
  // (the latest version the library supports). This influences
  // support for strict mode, the set of reserved words, and support
  // for new syntax features.
  ecmaVersion: null,
  // `sourceType` indicates the mode the code should be parsed in.
  // Can be either `"script"` or `"module"`. This influences global
  // strict mode and parsing of `import` and `export` declarations.
  sourceType: "script",
  // `onInsertedSemicolon` can be a callback that will be called when
  // a semicolon is automatically inserted. It will be passed the
  // position of the inserted semicolon as an offset, and if
  // `locations` is enabled, it is given the location as a `{line,
  // column}` object as second argument.
  onInsertedSemicolon: null,
  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
  // trailing commas.
  onTrailingComma: null,
  // By default, reserved words are only enforced if ecmaVersion >= 5.
  // Set `allowReserved` to a boolean value to explicitly turn this on
  // an off. When this option has the value "never", reserved words
  // and keywords can also not be used as property names.
  allowReserved: null,
  // When enabled, a return at the top level is not considered an
  // error.
  allowReturnOutsideFunction: false,
  // When enabled, import/export statements are not constrained to
  // appearing at the top of the program, and an import.meta expression
  // in a script isn't considered an error.
  allowImportExportEverywhere: false,
  // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
  // When enabled, await identifiers are allowed to appear at the top-level scope,
  // but they are still not allowed in non-async functions.
  allowAwaitOutsideFunction: null,
  // When enabled, super identifiers are not constrained to
  // appearing in methods and do not raise an error when they appear elsewhere.
  allowSuperOutsideMethod: null,
  // When enabled, hashbang directive in the beginning of file is
  // allowed and treated as a line comment. Enabled by default when
  // `ecmaVersion` >= 2023.
  allowHashBang: false,
  // By default, the parser will verify that private properties are
  // only used in places where they are valid and have been declared.
  // Set this to false to turn such checks off.
  checkPrivateFields: true,
  // When `locations` is on, `loc` properties holding objects with
  // `start` and `end` properties in `{line, column}` form (with
  // line being 1-based and column 0-based) will be attached to the
  // nodes.
  locations: false,
  // A function can be passed as `onToken` option, which will
  // cause Acorn to call that function with object in the same
  // format as tokens returned from `tokenizer().getToken()`. Note
  // that you are not allowed to call the parser from the
  // callback—that will corrupt its internal state.
  onToken: null,
  // A function can be passed as `onComment` option, which will
  // cause Acorn to call that function with `(block, text, start,
  // end)` parameters whenever a comment is skipped. `block` is a
  // boolean indicating whether this is a block (`/* */`) comment,
  // `text` is the content of the comment, and `start` and `end` are
  // character offsets that denote the start and end of the comment.
  // When the `locations` option is on, two more parameters are
  // passed, the full `{line, column}` locations of the start and
  // end of the comments. Note that you are not allowed to call the
  // parser from the callback—that will corrupt its internal state.
  // When this option has an array as value, objects representing the
  // comments are pushed to it.
  onComment: null,
  // Nodes have their start and end characters offsets recorded in
  // `start` and `end` properties (directly on the node, rather than
  // the `loc` object, which holds line/column data. To also add a
  // [semi-standardized][range] `range` property holding a `[start,
  // end]` array with the same numbers, set the `ranges` option to
  // `true`.
  //
  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
  ranges: false,
  // It is possible to parse multiple files into a single AST by
  // passing the tree produced by parsing the first file as
  // `program` option in subsequent parses. This will add the
  // toplevel forms of the parsed file to the `Program` (top) node
  // of an existing parse tree.
  program: null,
  // When `locations` is on, you can pass this to record the source
  // file in every node's `loc` object.
  sourceFile: null,
  // This value, if given, is stored in every node, whether
  // `locations` is on or off.
  directSourceFile: null,
  // When enabled, parenthesized expressions are represented by
  // (non-standard) ParenthesizedExpression nodes
  preserveParens: false
};
var warnedAboutEcmaVersion = false;
function getOptions(opts) {
  var options = {};
  for (var opt in defaultOptions) {
    options[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt];
  }
  if (options.ecmaVersion === "latest") {
    options.ecmaVersion = 1e8;
  } else if (options.ecmaVersion == null) {
    if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
      warnedAboutEcmaVersion = true;
      console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
    }
    options.ecmaVersion = 11;
  } else if (options.ecmaVersion >= 2015) {
    options.ecmaVersion -= 2009;
  }
  if (options.allowReserved == null) {
    options.allowReserved = options.ecmaVersion < 5;
  }
  if (!opts || opts.allowHashBang == null) {
    options.allowHashBang = options.ecmaVersion >= 14;
  }
  if (isArray(options.onToken)) {
    var tokens = options.onToken;
    options.onToken = function(token) {
      return tokens.push(token);
    };
  }
  if (isArray(options.onComment)) {
    options.onComment = pushComment(options, options.onComment);
  }
  return options;
}
__name(getOptions, "getOptions");
function pushComment(options, array2) {
  return function(block, text, start2, end, startLoc, endLoc) {
    var comment = {
      type: block ? "Block" : "Line",
      value: text,
      start: start2,
      end
    };
    if (options.locations) {
      comment.loc = new SourceLocation(this, startLoc, endLoc);
    }
    if (options.ranges) {
      comment.range = [
        start2,
        end
      ];
    }
    array2.push(comment);
  };
}
__name(pushComment, "pushComment");
var SCOPE_TOP = 1;
var SCOPE_FUNCTION = 2;
var SCOPE_ASYNC = 4;
var SCOPE_GENERATOR = 8;
var SCOPE_ARROW = 16;
var SCOPE_SIMPLE_CATCH = 32;
var SCOPE_SUPER = 64;
var SCOPE_DIRECT_SUPER = 128;
var SCOPE_CLASS_STATIC_BLOCK = 256;
var SCOPE_CLASS_FIELD_INIT = 512;
var SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;
function functionFlags(async, generator) {
  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
}
__name(functionFlags, "functionFlags");
var BIND_NONE = 0;
var BIND_VAR = 1;
var BIND_LEXICAL = 2;
var BIND_FUNCTION = 3;
var BIND_SIMPLE_CATCH = 4;
var BIND_OUTSIDE = 5;
var Parser = /* @__PURE__ */ __name(function Parser2(options, input, startPos) {
  this.options = options = getOptions(options);
  this.sourceFile = options.sourceFile;
  this.keywords = wordsRegexp(keywords$1[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
  var reserved = "";
  if (options.allowReserved !== true) {
    reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3];
    if (options.sourceType === "module") {
      reserved += " await";
    }
  }
  this.reservedWords = wordsRegexp(reserved);
  var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
  this.reservedWordsStrict = wordsRegexp(reservedStrict);
  this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
  this.input = String(input);
  this.containsEsc = false;
  if (startPos) {
    this.pos = startPos;
    this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
    this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
  } else {
    this.pos = this.lineStart = 0;
    this.curLine = 1;
  }
  this.type = types$1.eof;
  this.value = null;
  this.start = this.end = this.pos;
  this.startLoc = this.endLoc = this.curPosition();
  this.lastTokEndLoc = this.lastTokStartLoc = null;
  this.lastTokStart = this.lastTokEnd = this.pos;
  this.context = this.initialContext();
  this.exprAllowed = true;
  this.inModule = options.sourceType === "module";
  this.strict = this.inModule || this.strictDirective(this.pos);
  this.potentialArrowAt = -1;
  this.potentialArrowInForAwait = false;
  this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
  this.labels = [];
  this.undefinedExports = /* @__PURE__ */ Object.create(null);
  if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!") {
    this.skipLineComment(2);
  }
  this.scopeStack = [];
  this.enterScope(SCOPE_TOP);
  this.regexpState = null;
  this.privateNameStack = [];
}, "Parser");
var prototypeAccessors = {
  inFunction: {
    configurable: true
  },
  inGenerator: {
    configurable: true
  },
  inAsync: {
    configurable: true
  },
  canAwait: {
    configurable: true
  },
  allowSuper: {
    configurable: true
  },
  allowDirectSuper: {
    configurable: true
  },
  treatFunctionsAsVar: {
    configurable: true
  },
  allowNewDotTarget: {
    configurable: true
  },
  inClassStaticBlock: {
    configurable: true
  }
};
Parser.prototype.parse = /* @__PURE__ */ __name(function parse2() {
  var node = this.options.program || this.startNode();
  this.nextToken();
  return this.parseTopLevel(node);
}, "parse");
prototypeAccessors.inFunction.get = function() {
  return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
};
prototypeAccessors.inGenerator.get = function() {
  return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0;
};
prototypeAccessors.inAsync.get = function() {
  return (this.currentVarScope().flags & SCOPE_ASYNC) > 0;
};
prototypeAccessors.canAwait.get = function() {
  for (var i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
    var ref2 = this.scopeStack[i2];
    var flags = ref2.flags;
    if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT)) {
      return false;
    }
    if (flags & SCOPE_FUNCTION) {
      return (flags & SCOPE_ASYNC) > 0;
    }
  }
  return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
};
prototypeAccessors.allowSuper.get = function() {
  var ref2 = this.currentThisScope();
  var flags = ref2.flags;
  return (flags & SCOPE_SUPER) > 0 || this.options.allowSuperOutsideMethod;
};
prototypeAccessors.allowDirectSuper.get = function() {
  return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
};
prototypeAccessors.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
};
prototypeAccessors.allowNewDotTarget.get = function() {
  for (var i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
    var ref2 = this.scopeStack[i2];
    var flags = ref2.flags;
    if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT) || flags & SCOPE_FUNCTION && !(flags & SCOPE_ARROW)) {
      return true;
    }
  }
  return false;
};
prototypeAccessors.inClassStaticBlock.get = function() {
  return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0;
};
Parser.extend = /* @__PURE__ */ __name(function extend() {
  var plugins = [], len = arguments.length;
  while (len--) plugins[len] = arguments[len];
  var cls = this;
  for (var i2 = 0; i2 < plugins.length; i2++) {
    cls = plugins[i2](cls);
  }
  return cls;
}, "extend");
Parser.parse = /* @__PURE__ */ __name(function parse3(input, options) {
  return new this(options, input).parse();
}, "parse");
Parser.parseExpressionAt = /* @__PURE__ */ __name(function parseExpressionAt(input, pos, options) {
  var parser = new this(options, input, pos);
  parser.nextToken();
  return parser.parseExpression();
}, "parseExpressionAt");
Parser.tokenizer = /* @__PURE__ */ __name(function tokenizer(input, options) {
  return new this(options, input);
}, "tokenizer");
Object.defineProperties(Parser.prototype, prototypeAccessors);
var pp$9 = Parser.prototype;
var literal = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
pp$9.strictDirective = function(start2) {
  if (this.options.ecmaVersion < 5) {
    return false;
  }
  for (; ; ) {
    skipWhiteSpace.lastIndex = start2;
    start2 += skipWhiteSpace.exec(this.input)[0].length;
    var match = literal.exec(this.input.slice(start2));
    if (!match) {
      return false;
    }
    if ((match[1] || match[2]) === "use strict") {
      skipWhiteSpace.lastIndex = start2 + match[0].length;
      var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
      var next2 = this.input.charAt(end);
      return next2 === ";" || next2 === "}" || lineBreak.test(spaceAfter[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(next2) || next2 === "!" && this.input.charAt(end + 1) === "=");
    }
    start2 += match[0].length;
    skipWhiteSpace.lastIndex = start2;
    start2 += skipWhiteSpace.exec(this.input)[0].length;
    if (this.input[start2] === ";") {
      start2++;
    }
  }
};
pp$9.eat = function(type) {
  if (this.type === type) {
    this.next();
    return true;
  } else {
    return false;
  }
};
pp$9.isContextual = function(name) {
  return this.type === types$1.name && this.value === name && !this.containsEsc;
};
pp$9.eatContextual = function(name) {
  if (!this.isContextual(name)) {
    return false;
  }
  this.next();
  return true;
};
pp$9.expectContextual = function(name) {
  if (!this.eatContextual(name)) {
    this.unexpected();
  }
};
pp$9.canInsertSemicolon = function() {
  return this.type === types$1.eof || this.type === types$1.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$9.insertSemicolon = function() {
  if (this.canInsertSemicolon()) {
    if (this.options.onInsertedSemicolon) {
      this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
    }
    return true;
  }
};
pp$9.semicolon = function() {
  if (!this.eat(types$1.semi) && !this.insertSemicolon()) {
    this.unexpected();
  }
};
pp$9.afterTrailingComma = function(tokType, notNext) {
  if (this.type === tokType) {
    if (this.options.onTrailingComma) {
      this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
    }
    if (!notNext) {
      this.next();
    }
    return true;
  }
};
pp$9.expect = function(type) {
  this.eat(type) || this.unexpected();
};
pp$9.unexpected = function(pos) {
  this.raise(pos != null ? pos : this.start, "Unexpected token");
};
var DestructuringErrors = /* @__PURE__ */ __name(function DestructuringErrors2() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
}, "DestructuringErrors");
pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
  if (!refDestructuringErrors) {
    return;
  }
  if (refDestructuringErrors.trailingComma > -1) {
    this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
  }
  var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
  if (parens > -1) {
    this.raiseRecoverable(parens, isAssign ? "Assigning to rvalue" : "Parenthesized pattern");
  }
};
pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
  if (!refDestructuringErrors) {
    return false;
  }
  var shorthandAssign = refDestructuringErrors.shorthandAssign;
  var doubleProto = refDestructuringErrors.doubleProto;
  if (!andThrow) {
    return shorthandAssign >= 0 || doubleProto >= 0;
  }
  if (shorthandAssign >= 0) {
    this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
  }
  if (doubleProto >= 0) {
    this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
  }
};
pp$9.checkYieldAwaitInDefaultParams = function() {
  if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) {
    this.raise(this.yieldPos, "Yield expression cannot be a default value");
  }
  if (this.awaitPos) {
    this.raise(this.awaitPos, "Await expression cannot be a default value");
  }
};
pp$9.isSimpleAssignTarget = function(expr) {
  if (expr.type === "ParenthesizedExpression") {
    return this.isSimpleAssignTarget(expr.expression);
  }
  return expr.type === "Identifier" || expr.type === "MemberExpression";
};
var pp$8 = Parser.prototype;
pp$8.parseTopLevel = function(node) {
  var exports = /* @__PURE__ */ Object.create(null);
  if (!node.body) {
    node.body = [];
  }
  while (this.type !== types$1.eof) {
    var stmt = this.parseStatement(null, true, exports);
    node.body.push(stmt);
  }
  if (this.inModule) {
    for (var i2 = 0, list2 = Object.keys(this.undefinedExports); i2 < list2.length; i2 += 1) {
      var name = list2[i2];
      this.raiseRecoverable(this.undefinedExports[name].start, "Export '" + name + "' is not defined");
    }
  }
  this.adaptDirectivePrologue(node.body);
  this.next();
  node.sourceType = this.options.sourceType;
  return this.finishNode(node, "Program");
};
var loopLabel = {
  kind: "loop"
};
var switchLabel = {
  kind: "switch"
};
pp$8.isLet = function(context) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next2 = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next2);
  if (nextCh === 91 || nextCh === 92) {
    return true;
  }
  if (context) {
    return false;
  }
  if (nextCh === 123 || nextCh > 55295 && nextCh < 56320) {
    return true;
  }
  if (isIdentifierStart(nextCh, true)) {
    var pos = next2 + 1;
    while (isIdentifierChar(nextCh = this.input.charCodeAt(pos), true)) {
      ++pos;
    }
    if (nextCh === 92 || nextCh > 55295 && nextCh < 56320) {
      return true;
    }
    var ident = this.input.slice(next2, pos);
    if (!keywordRelationalOperator.test(ident)) {
      return true;
    }
  }
  return false;
};
pp$8.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next2 = this.pos + skip[0].length, after;
  return !lineBreak.test(this.input.slice(this.pos, next2)) && this.input.slice(next2, next2 + 8) === "function" && (next2 + 8 === this.input.length || !(isIdentifierChar(after = this.input.charCodeAt(next2 + 8)) || after > 55295 && after < 56320));
};
pp$8.isUsingKeyword = function(isAwaitUsing, isFor) {
  if (this.options.ecmaVersion < 17 || !this.isContextual(isAwaitUsing ? "await" : "using")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next2 = this.pos + skip[0].length;
  if (lineBreak.test(this.input.slice(this.pos, next2))) {
    return false;
  }
  if (isAwaitUsing) {
    var awaitEndPos = next2 + 5, after;
    if (this.input.slice(next2, awaitEndPos) !== "using" || awaitEndPos === this.input.length || isIdentifierChar(after = this.input.charCodeAt(awaitEndPos)) || after > 55295 && after < 56320) {
      return false;
    }
    skipWhiteSpace.lastIndex = awaitEndPos;
    var skipAfterUsing = skipWhiteSpace.exec(this.input);
    if (skipAfterUsing && lineBreak.test(this.input.slice(awaitEndPos, awaitEndPos + skipAfterUsing[0].length))) {
      return false;
    }
  }
  if (isFor) {
    var ofEndPos = next2 + 2, after$1;
    if (this.input.slice(next2, ofEndPos) === "of") {
      if (ofEndPos === this.input.length || !isIdentifierChar(after$1 = this.input.charCodeAt(ofEndPos)) && !(after$1 > 55295 && after$1 < 56320)) {
        return false;
      }
    }
  }
  var ch = this.input.charCodeAt(next2);
  return isIdentifierStart(ch, true) || ch === 92;
};
pp$8.isAwaitUsing = function(isFor) {
  return this.isUsingKeyword(true, isFor);
};
pp$8.isUsing = function(isFor) {
  return this.isUsingKeyword(false, isFor);
};
pp$8.parseStatement = function(context, topLevel, exports) {
  var starttype = this.type, node = this.startNode(), kind;
  if (this.isLet(context)) {
    starttype = types$1._var;
    kind = "let";
  }
  switch (starttype) {
    case types$1._break:
    case types$1._continue:
      return this.parseBreakContinueStatement(node, starttype.keyword);
    case types$1._debugger:
      return this.parseDebuggerStatement(node);
    case types$1._do:
      return this.parseDoStatement(node);
    case types$1._for:
      return this.parseForStatement(node);
    case types$1._function:
      if (context && (this.strict || context !== "if" && context !== "label") && this.options.ecmaVersion >= 6) {
        this.unexpected();
      }
      return this.parseFunctionStatement(node, false, !context);
    case types$1._class:
      if (context) {
        this.unexpected();
      }
      return this.parseClass(node, true);
    case types$1._if:
      return this.parseIfStatement(node);
    case types$1._return:
      return this.parseReturnStatement(node);
    case types$1._switch:
      return this.parseSwitchStatement(node);
    case types$1._throw:
      return this.parseThrowStatement(node);
    case types$1._try:
      return this.parseTryStatement(node);
    case types$1._const:
    case types$1._var:
      kind = kind || this.value;
      if (context && kind !== "var") {
        this.unexpected();
      }
      return this.parseVarStatement(node, kind);
    case types$1._while:
      return this.parseWhileStatement(node);
    case types$1._with:
      return this.parseWithStatement(node);
    case types$1.braceL:
      return this.parseBlock(true, node);
    case types$1.semi:
      return this.parseEmptyStatement(node);
    case types$1._export:
    case types$1._import:
      if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
        skipWhiteSpace.lastIndex = this.pos;
        var skip = skipWhiteSpace.exec(this.input);
        var next2 = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next2);
        if (nextCh === 40 || nextCh === 46) {
          return this.parseExpressionStatement(node, this.parseExpression());
        }
      }
      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel) {
          this.raise(this.start, "'import' and 'export' may only appear at the top level");
        }
        if (!this.inModule) {
          this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
        }
      }
      return starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports);
    // If the statement does not start with a statement keyword or a
    // brace, it's an ExpressionStatement or LabeledStatement. We
    // simply start parsing an expression, and afterwards, if the
    // next token is a colon and the expression was a simple
    // Identifier node, we switch to interpreting it as a label.
    default:
      if (this.isAsyncFunction()) {
        if (context) {
          this.unexpected();
        }
        this.next();
        return this.parseFunctionStatement(node, true, !context);
      }
      var usingKind = this.isAwaitUsing(false) ? "await using" : this.isUsing(false) ? "using" : null;
      if (usingKind) {
        if (topLevel && this.options.sourceType === "script") {
          this.raise(this.start, "Using declaration cannot appear in the top level when source type is `script`");
        }
        if (usingKind === "await using") {
          if (!this.canAwait) {
            this.raise(this.start, "Await using cannot appear outside of async function");
          }
          this.next();
        }
        this.next();
        this.parseVar(node, false, usingKind);
        this.semicolon();
        return this.finishNode(node, "VariableDeclaration");
      }
      var maybeName = this.value, expr = this.parseExpression();
      if (starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon)) {
        return this.parseLabeledStatement(node, maybeName, expr, context);
      } else {
        return this.parseExpressionStatement(node, expr);
      }
  }
};
pp$8.parseBreakContinueStatement = function(node, keyword) {
  var isBreak = keyword === "break";
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) {
    node.label = null;
  } else if (this.type !== types$1.name) {
    this.unexpected();
  } else {
    node.label = this.parseIdent();
    this.semicolon();
  }
  var i2 = 0;
  for (; i2 < this.labels.length; ++i2) {
    var lab = this.labels[i2];
    if (node.label == null || lab.name === node.label.name) {
      if (lab.kind != null && (isBreak || lab.kind === "loop")) {
        break;
      }
      if (node.label && isBreak) {
        break;
      }
    }
  }
  if (i2 === this.labels.length) {
    this.raise(node.start, "Unsyntactic " + keyword);
  }
  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
};
pp$8.parseDebuggerStatement = function(node) {
  this.next();
  this.semicolon();
  return this.finishNode(node, "DebuggerStatement");
};
pp$8.parseDoStatement = function(node) {
  this.next();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("do");
  this.labels.pop();
  this.expect(types$1._while);
  node.test = this.parseParenExpression();
  if (this.options.ecmaVersion >= 6) {
    this.eat(types$1.semi);
  } else {
    this.semicolon();
  }
  return this.finishNode(node, "DoWhileStatement");
};
pp$8.parseForStatement = function(node) {
  this.next();
  var awaitAt = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
  this.labels.push(loopLabel);
  this.enterScope(0);
  this.expect(types$1.parenL);
  if (this.type === types$1.semi) {
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, null);
  }
  var isLet = this.isLet();
  if (this.type === types$1._var || this.type === types$1._const || isLet) {
    var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
    this.next();
    this.parseVar(init$1, true, kind);
    this.finishNode(init$1, "VariableDeclaration");
    return this.parseForAfterInit(node, init$1, awaitAt);
  }
  var startsWithLet = this.isContextual("let"), isForOf = false;
  var usingKind = this.isUsing(true) ? "using" : this.isAwaitUsing(true) ? "await using" : null;
  if (usingKind) {
    var init$2 = this.startNode();
    this.next();
    if (usingKind === "await using") {
      this.next();
    }
    this.parseVar(init$2, true, usingKind);
    this.finishNode(init$2, "VariableDeclaration");
    return this.parseForAfterInit(node, init$2, awaitAt);
  }
  var containsEsc = this.containsEsc;
  var refDestructuringErrors = new DestructuringErrors();
  var initPos = this.start;
  var init = awaitAt > -1 ? this.parseExprSubscripts(refDestructuringErrors, "await") : this.parseExpression(true, refDestructuringErrors);
  if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
    if (awaitAt > -1) {
      if (this.type === types$1._in) {
        this.unexpected(awaitAt);
      }
      node.await = true;
    } else if (isForOf && this.options.ecmaVersion >= 8) {
      if (init.start === initPos && !containsEsc && init.type === "Identifier" && init.name === "async") {
        this.unexpected();
      } else if (this.options.ecmaVersion >= 9) {
        node.await = false;
      }
    }
    if (startsWithLet && isForOf) {
      this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'.");
    }
    this.toAssignable(init, false, refDestructuringErrors);
    this.checkLValPattern(init);
    return this.parseForIn(node, init);
  } else {
    this.checkExpressionErrors(refDestructuringErrors, true);
  }
  if (awaitAt > -1) {
    this.unexpected(awaitAt);
  }
  return this.parseFor(node, init);
};
pp$8.parseForAfterInit = function(node, init, awaitAt) {
  if ((this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init.declarations.length === 1) {
    if (this.options.ecmaVersion >= 9) {
      if (this.type === types$1._in) {
        if (awaitAt > -1) {
          this.unexpected(awaitAt);
        }
      } else {
        node.await = awaitAt > -1;
      }
    }
    return this.parseForIn(node, init);
  }
  if (awaitAt > -1) {
    this.unexpected(awaitAt);
  }
  return this.parseFor(node, init);
};
pp$8.parseFunctionStatement = function(node, isAsync, declarationPosition) {
  this.next();
  return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync);
};
pp$8.parseIfStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  node.consequent = this.parseStatement("if");
  node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
  return this.finishNode(node, "IfStatement");
};
pp$8.parseReturnStatement = function(node) {
  if (!this.inFunction && !this.options.allowReturnOutsideFunction) {
    this.raise(this.start, "'return' outside of function");
  }
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) {
    node.argument = null;
  } else {
    node.argument = this.parseExpression();
    this.semicolon();
  }
  return this.finishNode(node, "ReturnStatement");
};
pp$8.parseSwitchStatement = function(node) {
  this.next();
  node.discriminant = this.parseParenExpression();
  node.cases = [];
  this.expect(types$1.braceL);
  this.labels.push(switchLabel);
  this.enterScope(0);
  var cur;
  for (var sawDefault = false; this.type !== types$1.braceR; ) {
    if (this.type === types$1._case || this.type === types$1._default) {
      var isCase = this.type === types$1._case;
      if (cur) {
        this.finishNode(cur, "SwitchCase");
      }
      node.cases.push(cur = this.startNode());
      cur.consequent = [];
      this.next();
      if (isCase) {
        cur.test = this.parseExpression();
      } else {
        if (sawDefault) {
          this.raiseRecoverable(this.lastTokStart, "Multiple default clauses");
        }
        sawDefault = true;
        cur.test = null;
      }
      this.expect(types$1.colon);
    } else {
      if (!cur) {
        this.unexpected();
      }
      cur.consequent.push(this.parseStatement(null));
    }
  }
  this.exitScope();
  if (cur) {
    this.finishNode(cur, "SwitchCase");
  }
  this.next();
  this.labels.pop();
  return this.finishNode(node, "SwitchStatement");
};
pp$8.parseThrowStatement = function(node) {
  this.next();
  if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) {
    this.raise(this.lastTokEnd, "Illegal newline after throw");
  }
  node.argument = this.parseExpression();
  this.semicolon();
  return this.finishNode(node, "ThrowStatement");
};
var empty$1 = [];
pp$8.parseCatchClauseParam = function() {
  var param = this.parseBindingAtom();
  var simple = param.type === "Identifier";
  this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
  this.checkLValPattern(param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
  this.expect(types$1.parenR);
  return param;
};
pp$8.parseTryStatement = function(node) {
  this.next();
  node.block = this.parseBlock();
  node.handler = null;
  if (this.type === types$1._catch) {
    var clause = this.startNode();
    this.next();
    if (this.eat(types$1.parenL)) {
      clause.param = this.parseCatchClauseParam();
    } else {
      if (this.options.ecmaVersion < 10) {
        this.unexpected();
      }
      clause.param = null;
      this.enterScope(0);
    }
    clause.body = this.parseBlock(false);
    this.exitScope();
    node.handler = this.finishNode(clause, "CatchClause");
  }
  node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
  if (!node.handler && !node.finalizer) {
    this.raise(node.start, "Missing catch or finally clause");
  }
  return this.finishNode(node, "TryStatement");
};
pp$8.parseVarStatement = function(node, kind, allowMissingInitializer) {
  this.next();
  this.parseVar(node, false, kind, allowMissingInitializer);
  this.semicolon();
  return this.finishNode(node, "VariableDeclaration");
};
pp$8.parseWhileStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("while");
  this.labels.pop();
  return this.finishNode(node, "WhileStatement");
};
pp$8.parseWithStatement = function(node) {
  if (this.strict) {
    this.raise(this.start, "'with' in strict mode");
  }
  this.next();
  node.object = this.parseParenExpression();
  node.body = this.parseStatement("with");
  return this.finishNode(node, "WithStatement");
};
pp$8.parseEmptyStatement = function(node) {
  this.next();
  return this.finishNode(node, "EmptyStatement");
};
pp$8.parseLabeledStatement = function(node, maybeName, expr, context) {
  for (var i$1 = 0, list2 = this.labels; i$1 < list2.length; i$1 += 1) {
    var label = list2[i$1];
    if (label.name === maybeName) {
      this.raise(expr.start, "Label '" + maybeName + "' is already declared");
    }
  }
  var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
  for (var i2 = this.labels.length - 1; i2 >= 0; i2--) {
    var label$1 = this.labels[i2];
    if (label$1.statementStart === node.start) {
      label$1.statementStart = this.start;
      label$1.kind = kind;
    } else {
      break;
    }
  }
  this.labels.push({
    name: maybeName,
    kind,
    statementStart: this.start
  });
  node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
  this.labels.pop();
  node.label = expr;
  return this.finishNode(node, "LabeledStatement");
};
pp$8.parseExpressionStatement = function(node, expr) {
  node.expression = expr;
  this.semicolon();
  return this.finishNode(node, "ExpressionStatement");
};
pp$8.parseBlock = function(createNewLexicalScope, node, exitStrict) {
  if (createNewLexicalScope === void 0) createNewLexicalScope = true;
  if (node === void 0) node = this.startNode();
  node.body = [];
  this.expect(types$1.braceL);
  if (createNewLexicalScope) {
    this.enterScope(0);
  }
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  if (exitStrict) {
    this.strict = false;
  }
  this.next();
  if (createNewLexicalScope) {
    this.exitScope();
  }
  return this.finishNode(node, "BlockStatement");
};
pp$8.parseFor = function(node, init) {
  node.init = init;
  this.expect(types$1.semi);
  node.test = this.type === types$1.semi ? null : this.parseExpression();
  this.expect(types$1.semi);
  node.update = this.type === types$1.parenR ? null : this.parseExpression();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, "ForStatement");
};
pp$8.parseForIn = function(node, init) {
  var isForIn = this.type === types$1._in;
  this.next();
  if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) {
    this.raise(init.start, (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer");
  }
  node.left = init;
  node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
};
pp$8.parseVar = function(node, isFor, kind, allowMissingInitializer) {
  node.declarations = [];
  node.kind = kind;
  for (; ; ) {
    var decl = this.startNode();
    this.parseVarId(decl, kind);
    if (this.eat(types$1.eq)) {
      decl.init = this.parseMaybeAssign(isFor);
    } else if (!allowMissingInitializer && kind === "const" && !(this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
      this.unexpected();
    } else if (!allowMissingInitializer && (kind === "using" || kind === "await using") && this.options.ecmaVersion >= 17 && this.type !== types$1._in && !this.isContextual("of")) {
      this.raise(this.lastTokEnd, "Missing initializer in " + kind + " declaration");
    } else if (!allowMissingInitializer && decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of")))) {
      this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
    } else {
      decl.init = null;
    }
    node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
    if (!this.eat(types$1.comma)) {
      break;
    }
  }
  return node;
};
pp$8.parseVarId = function(decl, kind) {
  decl.id = kind === "using" || kind === "await using" ? this.parseIdent() : this.parseBindingAtom();
  this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
};
var FUNC_STATEMENT = 1;
var FUNC_HANGING_STATEMENT = 2;
var FUNC_NULLABLE_ID = 4;
pp$8.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
  this.initFunction(node);
  if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
    if (this.type === types$1.star && statement & FUNC_HANGING_STATEMENT) {
      this.unexpected();
    }
    node.generator = this.eat(types$1.star);
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  if (statement & FUNC_STATEMENT) {
    node.id = statement & FUNC_NULLABLE_ID && this.type !== types$1.name ? null : this.parseIdent();
    if (node.id && !(statement & FUNC_HANGING_STATEMENT)) {
      this.checkLValSimple(node.id, this.strict || node.generator || node.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION);
    }
  }
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(node.async, node.generator));
  if (!(statement & FUNC_STATEMENT)) {
    node.id = this.type === types$1.name ? this.parseIdent() : null;
  }
  this.parseFunctionParams(node);
  this.parseFunctionBody(node, allowExpressionBody, false, forInit);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
};
pp$8.parseFunctionParams = function(node) {
  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
};
pp$8.parseClass = function(node, isStatement) {
  this.next();
  var oldStrict = this.strict;
  this.strict = true;
  this.parseClassId(node, isStatement);
  this.parseClassSuper(node);
  var privateNameMap = this.enterClassBody();
  var classBody = this.startNode();
  var hadConstructor = false;
  classBody.body = [];
  this.expect(types$1.braceL);
  while (this.type !== types$1.braceR) {
    var element = this.parseClassElement(node.superClass !== null);
    if (element) {
      classBody.body.push(element);
      if (element.type === "MethodDefinition" && element.kind === "constructor") {
        if (hadConstructor) {
          this.raiseRecoverable(element.start, "Duplicate constructor in the same class");
        }
        hadConstructor = true;
      } else if (element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element)) {
        this.raiseRecoverable(element.key.start, "Identifier '#" + element.key.name + "' has already been declared");
      }
    }
  }
  this.strict = oldStrict;
  this.next();
  node.body = this.finishNode(classBody, "ClassBody");
  this.exitClassBody();
  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
};
pp$8.parseClassElement = function(constructorAllowsSuper) {
  if (this.eat(types$1.semi)) {
    return null;
  }
  var ecmaVersion2 = this.options.ecmaVersion;
  var node = this.startNode();
  var keyName = "";
  var isGenerator = false;
  var isAsync = false;
  var kind = "method";
  var isStatic = false;
  if (this.eatContextual("static")) {
    if (ecmaVersion2 >= 13 && this.eat(types$1.braceL)) {
      this.parseClassStaticBlock(node);
      return node;
    }
    if (this.isClassElementNameStart() || this.type === types$1.star) {
      isStatic = true;
    } else {
      keyName = "static";
    }
  }
  node.static = isStatic;
  if (!keyName && ecmaVersion2 >= 8 && this.eatContextual("async")) {
    if ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()) {
      isAsync = true;
    } else {
      keyName = "async";
    }
  }
  if (!keyName && (ecmaVersion2 >= 9 || !isAsync) && this.eat(types$1.star)) {
    isGenerator = true;
  }
  if (!keyName && !isAsync && !isGenerator) {
    var lastValue = this.value;
    if (this.eatContextual("get") || this.eatContextual("set")) {
      if (this.isClassElementNameStart()) {
        kind = lastValue;
      } else {
        keyName = lastValue;
      }
    }
  }
  if (keyName) {
    node.computed = false;
    node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
    node.key.name = keyName;
    this.finishNode(node.key, "Identifier");
  } else {
    this.parseClassElementName(node);
  }
  if (ecmaVersion2 < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
    var isConstructor = !node.static && checkKeyName(node, "constructor");
    var allowsDirectSuper = isConstructor && constructorAllowsSuper;
    if (isConstructor && kind !== "method") {
      this.raise(node.key.start, "Constructor can't have get/set modifier");
    }
    node.kind = isConstructor ? "constructor" : kind;
    this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
  } else {
    this.parseClassField(node);
  }
  return node;
};
pp$8.isClassElementNameStart = function() {
  return this.type === types$1.name || this.type === types$1.privateId || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword;
};
pp$8.parseClassElementName = function(element) {
  if (this.type === types$1.privateId) {
    if (this.value === "constructor") {
      this.raise(this.start, "Classes can't have an element named '#constructor'");
    }
    element.computed = false;
    element.key = this.parsePrivateIdent();
  } else {
    this.parsePropertyName(element);
  }
};
pp$8.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
  var key = method.key;
  if (method.kind === "constructor") {
    if (isGenerator) {
      this.raise(key.start, "Constructor can't be a generator");
    }
    if (isAsync) {
      this.raise(key.start, "Constructor can't be an async method");
    }
  } else if (method.static && checkKeyName(method, "prototype")) {
    this.raise(key.start, "Classes may not have a static property named prototype");
  }
  var value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
  if (method.kind === "get" && value.params.length !== 0) {
    this.raiseRecoverable(value.start, "getter should have no params");
  }
  if (method.kind === "set" && value.params.length !== 1) {
    this.raiseRecoverable(value.start, "setter should have exactly one param");
  }
  if (method.kind === "set" && value.params[0].type === "RestElement") {
    this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params");
  }
  return this.finishNode(method, "MethodDefinition");
};
pp$8.parseClassField = function(field) {
  if (checkKeyName(field, "constructor")) {
    this.raise(field.key.start, "Classes can't have a field named 'constructor'");
  } else if (field.static && checkKeyName(field, "prototype")) {
    this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
  }
  if (this.eat(types$1.eq)) {
    this.enterScope(SCOPE_CLASS_FIELD_INIT | SCOPE_SUPER);
    field.value = this.parseMaybeAssign();
    this.exitScope();
  } else {
    field.value = null;
  }
  this.semicolon();
  return this.finishNode(field, "PropertyDefinition");
};
pp$8.parseClassStaticBlock = function(node) {
  node.body = [];
  var oldLabels = this.labels;
  this.labels = [];
  this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  this.next();
  this.exitScope();
  this.labels = oldLabels;
  return this.finishNode(node, "StaticBlock");
};
pp$8.parseClassId = function(node, isStatement) {
  if (this.type === types$1.name) {
    node.id = this.parseIdent();
    if (isStatement) {
      this.checkLValSimple(node.id, BIND_LEXICAL, false);
    }
  } else {
    if (isStatement === true) {
      this.unexpected();
    }
    node.id = null;
  }
};
pp$8.parseClassSuper = function(node) {
  node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(null, false) : null;
};
pp$8.enterClassBody = function() {
  var element = {
    declared: /* @__PURE__ */ Object.create(null),
    used: []
  };
  this.privateNameStack.push(element);
  return element.declared;
};
pp$8.exitClassBody = function() {
  var ref2 = this.privateNameStack.pop();
  var declared = ref2.declared;
  var used = ref2.used;
  if (!this.options.checkPrivateFields) {
    return;
  }
  var len = this.privateNameStack.length;
  var parent = len === 0 ? null : this.privateNameStack[len - 1];
  for (var i2 = 0; i2 < used.length; ++i2) {
    var id = used[i2];
    if (!hasOwn(declared, id.name)) {
      if (parent) {
        parent.used.push(id);
      } else {
        this.raiseRecoverable(id.start, "Private field '#" + id.name + "' must be declared in an enclosing class");
      }
    }
  }
};
function isPrivateNameConflicted(privateNameMap, element) {
  var name = element.key.name;
  var curr = privateNameMap[name];
  var next2 = "true";
  if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) {
    next2 = (element.static ? "s" : "i") + element.kind;
  }
  if (curr === "iget" && next2 === "iset" || curr === "iset" && next2 === "iget" || curr === "sget" && next2 === "sset" || curr === "sset" && next2 === "sget") {
    privateNameMap[name] = "true";
    return false;
  } else if (!curr) {
    privateNameMap[name] = next2;
    return false;
  } else {
    return true;
  }
}
__name(isPrivateNameConflicted, "isPrivateNameConflicted");
function checkKeyName(node, name) {
  var computed = node.computed;
  var key = node.key;
  return !computed && (key.type === "Identifier" && key.name === name || key.type === "Literal" && key.value === name);
}
__name(checkKeyName, "checkKeyName");
pp$8.parseExportAllDeclaration = function(node, exports) {
  if (this.options.ecmaVersion >= 11) {
    if (this.eatContextual("as")) {
      node.exported = this.parseModuleExportName();
      this.checkExport(exports, node.exported, this.lastTokStart);
    } else {
      node.exported = null;
    }
  }
  this.expectContextual("from");
  if (this.type !== types$1.string) {
    this.unexpected();
  }
  node.source = this.parseExprAtom();
  if (this.options.ecmaVersion >= 16) {
    node.attributes = this.parseWithClause();
  }
  this.semicolon();
  return this.finishNode(node, "ExportAllDeclaration");
};
pp$8.parseExport = function(node, exports) {
  this.next();
  if (this.eat(types$1.star)) {
    return this.parseExportAllDeclaration(node, exports);
  }
  if (this.eat(types$1._default)) {
    this.checkExport(exports, "default", this.lastTokStart);
    node.declaration = this.parseExportDefaultDeclaration();
    return this.finishNode(node, "ExportDefaultDeclaration");
  }
  if (this.shouldParseExportStatement()) {
    node.declaration = this.parseExportDeclaration(node);
    if (node.declaration.type === "VariableDeclaration") {
      this.checkVariableExport(exports, node.declaration.declarations);
    } else {
      this.checkExport(exports, node.declaration.id, node.declaration.id.start);
    }
    node.specifiers = [];
    node.source = null;
    if (this.options.ecmaVersion >= 16) {
      node.attributes = [];
    }
  } else {
    node.declaration = null;
    node.specifiers = this.parseExportSpecifiers(exports);
    if (this.eatContextual("from")) {
      if (this.type !== types$1.string) {
        this.unexpected();
      }
      node.source = this.parseExprAtom();
      if (this.options.ecmaVersion >= 16) {
        node.attributes = this.parseWithClause();
      }
    } else {
      for (var i2 = 0, list2 = node.specifiers; i2 < list2.length; i2 += 1) {
        var spec = list2[i2];
        this.checkUnreserved(spec.local);
        this.checkLocalExport(spec.local);
        if (spec.local.type === "Literal") {
          this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
        }
      }
      node.source = null;
      if (this.options.ecmaVersion >= 16) {
        node.attributes = [];
      }
    }
    this.semicolon();
  }
  return this.finishNode(node, "ExportNamedDeclaration");
};
pp$8.parseExportDeclaration = function(node) {
  return this.parseStatement(null);
};
pp$8.parseExportDefaultDeclaration = function() {
  var isAsync;
  if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
    var fNode = this.startNode();
    this.next();
    if (isAsync) {
      this.next();
    }
    return this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
  } else if (this.type === types$1._class) {
    var cNode = this.startNode();
    return this.parseClass(cNode, "nullableID");
  } else {
    var declaration = this.parseMaybeAssign();
    this.semicolon();
    return declaration;
  }
};
pp$8.checkExport = function(exports, name, pos) {
  if (!exports) {
    return;
  }
  if (typeof name !== "string") {
    name = name.type === "Identifier" ? name.name : name.value;
  }
  if (hasOwn(exports, name)) {
    this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
  }
  exports[name] = true;
};
pp$8.checkPatternExport = function(exports, pat) {
  var type = pat.type;
  if (type === "Identifier") {
    this.checkExport(exports, pat, pat.start);
  } else if (type === "ObjectPattern") {
    for (var i2 = 0, list2 = pat.properties; i2 < list2.length; i2 += 1) {
      var prop = list2[i2];
      this.checkPatternExport(exports, prop);
    }
  } else if (type === "ArrayPattern") {
    for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
      var elt = list$1[i$1];
      if (elt) {
        this.checkPatternExport(exports, elt);
      }
    }
  } else if (type === "Property") {
    this.checkPatternExport(exports, pat.value);
  } else if (type === "AssignmentPattern") {
    this.checkPatternExport(exports, pat.left);
  } else if (type === "RestElement") {
    this.checkPatternExport(exports, pat.argument);
  }
};
pp$8.checkVariableExport = function(exports, decls) {
  if (!exports) {
    return;
  }
  for (var i2 = 0, list2 = decls; i2 < list2.length; i2 += 1) {
    var decl = list2[i2];
    this.checkPatternExport(exports, decl.id);
  }
};
pp$8.shouldParseExportStatement = function() {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
};
pp$8.parseExportSpecifier = function(exports) {
  var node = this.startNode();
  node.local = this.parseModuleExportName();
  node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local;
  this.checkExport(exports, node.exported, node.exported.start);
  return this.finishNode(node, "ExportSpecifier");
};
pp$8.parseExportSpecifiers = function(exports) {
  var nodes = [], first = true;
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    nodes.push(this.parseExportSpecifier(exports));
  }
  return nodes;
};
pp$8.parseImport = function(node) {
  this.next();
  if (this.type === types$1.string) {
    node.specifiers = empty$1;
    node.source = this.parseExprAtom();
  } else {
    node.specifiers = this.parseImportSpecifiers();
    this.expectContextual("from");
    node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
  }
  if (this.options.ecmaVersion >= 16) {
    node.attributes = this.parseWithClause();
  }
  this.semicolon();
  return this.finishNode(node, "ImportDeclaration");
};
pp$8.parseImportSpecifier = function() {
  var node = this.startNode();
  node.imported = this.parseModuleExportName();
  if (this.eatContextual("as")) {
    node.local = this.parseIdent();
  } else {
    this.checkUnreserved(node.imported);
    node.local = node.imported;
  }
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportSpecifier");
};
pp$8.parseImportDefaultSpecifier = function() {
  var node = this.startNode();
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportDefaultSpecifier");
};
pp$8.parseImportNamespaceSpecifier = function() {
  var node = this.startNode();
  this.next();
  this.expectContextual("as");
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportNamespaceSpecifier");
};
pp$8.parseImportSpecifiers = function() {
  var nodes = [], first = true;
  if (this.type === types$1.name) {
    nodes.push(this.parseImportDefaultSpecifier());
    if (!this.eat(types$1.comma)) {
      return nodes;
    }
  }
  if (this.type === types$1.star) {
    nodes.push(this.parseImportNamespaceSpecifier());
    return nodes;
  }
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    nodes.push(this.parseImportSpecifier());
  }
  return nodes;
};
pp$8.parseWithClause = function() {
  var nodes = [];
  if (!this.eat(types$1._with)) {
    return nodes;
  }
  this.expect(types$1.braceL);
  var attributeKeys = {};
  var first = true;
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var attr = this.parseImportAttribute();
    var keyName = attr.key.type === "Identifier" ? attr.key.name : attr.key.value;
    if (hasOwn(attributeKeys, keyName)) {
      this.raiseRecoverable(attr.key.start, "Duplicate attribute key '" + keyName + "'");
    }
    attributeKeys[keyName] = true;
    nodes.push(attr);
  }
  return nodes;
};
pp$8.parseImportAttribute = function() {
  var node = this.startNode();
  node.key = this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
  this.expect(types$1.colon);
  if (this.type !== types$1.string) {
    this.unexpected();
  }
  node.value = this.parseExprAtom();
  return this.finishNode(node, "ImportAttribute");
};
pp$8.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
    var stringLiteral = this.parseLiteral(this.value);
    if (loneSurrogate.test(stringLiteral.value)) {
      this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");
    }
    return stringLiteral;
  }
  return this.parseIdent(true);
};
pp$8.adaptDirectivePrologue = function(statements) {
  for (var i2 = 0; i2 < statements.length && this.isDirectiveCandidate(statements[i2]); ++i2) {
    statements[i2].directive = statements[i2].expression.raw.slice(1, -1);
  }
};
pp$8.isDirectiveCandidate = function(statement) {
  return this.options.ecmaVersion >= 5 && statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value === "string" && // Reject parenthesized strings.
  (this.input[statement.start] === '"' || this.input[statement.start] === "'");
};
var pp$7 = Parser.prototype;
pp$7.toAssignable = function(node, isBinding, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 6 && node) {
    switch (node.type) {
      case "Identifier":
        if (this.inAsync && node.name === "await") {
          this.raise(node.start, "Cannot use 'await' as identifier inside an async function");
        }
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        node.type = "ObjectPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        for (var i2 = 0, list2 = node.properties; i2 < list2.length; i2 += 1) {
          var prop = list2[i2];
          this.toAssignable(prop, isBinding);
          if (prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")) {
            this.raise(prop.argument.start, "Unexpected token");
          }
        }
        break;
      case "Property":
        if (node.kind !== "init") {
          this.raise(node.key.start, "Object pattern can't contain getter or setter");
        }
        this.toAssignable(node.value, isBinding);
        break;
      case "ArrayExpression":
        node.type = "ArrayPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        this.toAssignableList(node.elements, isBinding);
        break;
      case "SpreadElement":
        node.type = "RestElement";
        this.toAssignable(node.argument, isBinding);
        if (node.argument.type === "AssignmentPattern") {
          this.raise(node.argument.start, "Rest elements cannot have a default value");
        }
        break;
      case "AssignmentExpression":
        if (node.operator !== "=") {
          this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
        }
        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isBinding);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isBinding, refDestructuringErrors);
        break;
      case "ChainExpression":
        this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!isBinding) {
          break;
        }
      default:
        this.raise(node.start, "Assigning to rvalue");
    }
  } else if (refDestructuringErrors) {
    this.checkPatternErrors(refDestructuringErrors, true);
  }
  return node;
};
pp$7.toAssignableList = function(exprList, isBinding) {
  var end = exprList.length;
  for (var i2 = 0; i2 < end; i2++) {
    var elt = exprList[i2];
    if (elt) {
      this.toAssignable(elt, isBinding);
    }
  }
  if (end) {
    var last = exprList[end - 1];
    if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") {
      this.unexpected(last.argument.start);
    }
  }
  return exprList;
};
pp$7.parseSpread = function(refDestructuringErrors) {
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
  return this.finishNode(node, "SpreadElement");
};
pp$7.parseRestBinding = function() {
  var node = this.startNode();
  this.next();
  if (this.options.ecmaVersion === 6 && this.type !== types$1.name) {
    this.unexpected();
  }
  node.argument = this.parseBindingAtom();
  return this.finishNode(node, "RestElement");
};
pp$7.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6) {
    switch (this.type) {
      case types$1.bracketL:
        var node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(types$1.bracketR, true, true);
        return this.finishNode(node, "ArrayPattern");
      case types$1.braceL:
        return this.parseObj(true);
    }
  }
  return this.parseIdent();
};
pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma, allowModifiers) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (first) {
      first = false;
    } else {
      this.expect(types$1.comma);
    }
    if (allowEmpty && this.type === types$1.comma) {
      elts.push(null);
    } else if (allowTrailingComma && this.afterTrailingComma(close)) {
      break;
    } else if (this.type === types$1.ellipsis) {
      var rest = this.parseRestBinding();
      this.parseBindingListItem(rest);
      elts.push(rest);
      if (this.type === types$1.comma) {
        this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
      }
      this.expect(close);
      break;
    } else {
      elts.push(this.parseAssignableListItem(allowModifiers));
    }
  }
  return elts;
};
pp$7.parseAssignableListItem = function(allowModifiers) {
  var elem = this.parseMaybeDefault(this.start, this.startLoc);
  this.parseBindingListItem(elem);
  return elem;
};
pp$7.parseBindingListItem = function(param) {
  return param;
};
pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
  left = left || this.parseBindingAtom();
  if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) {
    return left;
  }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.right = this.parseMaybeAssign();
  return this.finishNode(node, "AssignmentPattern");
};
pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  var isBind = bindingType !== BIND_NONE;
  switch (expr.type) {
    case "Identifier":
      if (this.strict && this.reservedWordsStrictBind.test(expr.name)) {
        this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
      }
      if (isBind) {
        if (bindingType === BIND_LEXICAL && expr.name === "let") {
          this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name");
        }
        if (checkClashes) {
          if (hasOwn(checkClashes, expr.name)) {
            this.raiseRecoverable(expr.start, "Argument name clash");
          }
          checkClashes[expr.name] = true;
        }
        if (bindingType !== BIND_OUTSIDE) {
          this.declareName(expr.name, bindingType, expr.start);
        }
      }
      break;
    case "ChainExpression":
      this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      if (isBind) {
        this.raiseRecoverable(expr.start, "Binding member expression");
      }
      break;
    case "ParenthesizedExpression":
      if (isBind) {
        this.raiseRecoverable(expr.start, "Binding parenthesized expression");
      }
      return this.checkLValSimple(expr.expression, bindingType, checkClashes);
    default:
      this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
  }
};
pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  switch (expr.type) {
    case "ObjectPattern":
      for (var i2 = 0, list2 = expr.properties; i2 < list2.length; i2 += 1) {
        var prop = list2[i2];
        this.checkLValInnerPattern(prop, bindingType, checkClashes);
      }
      break;
    case "ArrayPattern":
      for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
        var elem = list$1[i$1];
        if (elem) {
          this.checkLValInnerPattern(elem, bindingType, checkClashes);
        }
      }
      break;
    default:
      this.checkLValSimple(expr, bindingType, checkClashes);
  }
};
pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  switch (expr.type) {
    case "Property":
      this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
      break;
    case "AssignmentPattern":
      this.checkLValPattern(expr.left, bindingType, checkClashes);
      break;
    case "RestElement":
      this.checkLValPattern(expr.argument, bindingType, checkClashes);
      break;
    default:
      this.checkLValPattern(expr, bindingType, checkClashes);
  }
};
var TokContext = /* @__PURE__ */ __name(function TokContext2(token, isExpr, preserveSpace, override, generator) {
  this.token = token;
  this.isExpr = !!isExpr;
  this.preserveSpace = !!preserveSpace;
  this.override = override;
  this.generator = !!generator;
}, "TokContext");
var types3 = {
  b_stat: new TokContext("{", false),
  b_expr: new TokContext("{", true),
  b_tmpl: new TokContext("${", false),
  p_stat: new TokContext("(", false),
  p_expr: new TokContext("(", true),
  q_tmpl: new TokContext("`", true, true, function(p) {
    return p.tryReadTemplateToken();
  }),
  f_stat: new TokContext("function", false),
  f_expr: new TokContext("function", true),
  f_expr_gen: new TokContext("function", true, false, null, true),
  f_gen: new TokContext("function", false, false, null, true)
};
var pp$6 = Parser.prototype;
pp$6.initialContext = function() {
  return [
    types3.b_stat
  ];
};
pp$6.curContext = function() {
  return this.context[this.context.length - 1];
};
pp$6.braceIsBlock = function(prevType) {
  var parent = this.curContext();
  if (parent === types3.f_expr || parent === types3.f_stat) {
    return true;
  }
  if (prevType === types$1.colon && (parent === types3.b_stat || parent === types3.b_expr)) {
    return !parent.isExpr;
  }
  if (prevType === types$1._return || prevType === types$1.name && this.exprAllowed) {
    return lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
  }
  if (prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow) {
    return true;
  }
  if (prevType === types$1.braceL) {
    return parent === types3.b_stat;
  }
  if (prevType === types$1._var || prevType === types$1._const || prevType === types$1.name) {
    return false;
  }
  return !this.exprAllowed;
};
pp$6.inGeneratorContext = function() {
  for (var i2 = this.context.length - 1; i2 >= 1; i2--) {
    var context = this.context[i2];
    if (context.token === "function") {
      return context.generator;
    }
  }
  return false;
};
pp$6.updateContext = function(prevType) {
  var update, type = this.type;
  if (type.keyword && prevType === types$1.dot) {
    this.exprAllowed = false;
  } else if (update = type.updateContext) {
    update.call(this, prevType);
  } else {
    this.exprAllowed = type.beforeExpr;
  }
};
pp$6.overrideContext = function(tokenCtx) {
  if (this.curContext() !== tokenCtx) {
    this.context[this.context.length - 1] = tokenCtx;
  }
};
types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = true;
    return;
  }
  var out = this.context.pop();
  if (out === types3.b_stat && this.curContext().token === "function") {
    out = this.context.pop();
  }
  this.exprAllowed = !out.isExpr;
};
types$1.braceL.updateContext = function(prevType) {
  this.context.push(this.braceIsBlock(prevType) ? types3.b_stat : types3.b_expr);
  this.exprAllowed = true;
};
types$1.dollarBraceL.updateContext = function() {
  this.context.push(types3.b_tmpl);
  this.exprAllowed = true;
};
types$1.parenL.updateContext = function(prevType) {
  var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
  this.context.push(statementParens ? types3.p_stat : types3.p_expr);
  this.exprAllowed = true;
};
types$1.incDec.updateContext = function() {
};
types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
  if (prevType.beforeExpr && prevType !== types$1._else && !(prevType === types$1.semi && this.curContext() !== types3.p_stat) && !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types3.b_stat)) {
    this.context.push(types3.f_expr);
  } else {
    this.context.push(types3.f_stat);
  }
  this.exprAllowed = false;
};
types$1.colon.updateContext = function() {
  if (this.curContext().token === "function") {
    this.context.pop();
  }
  this.exprAllowed = true;
};
types$1.backQuote.updateContext = function() {
  if (this.curContext() === types3.q_tmpl) {
    this.context.pop();
  } else {
    this.context.push(types3.q_tmpl);
  }
  this.exprAllowed = false;
};
types$1.star.updateContext = function(prevType) {
  if (prevType === types$1._function) {
    var index = this.context.length - 1;
    if (this.context[index] === types3.f_expr) {
      this.context[index] = types3.f_expr_gen;
    } else {
      this.context[index] = types3.f_gen;
    }
  }
  this.exprAllowed = true;
};
types$1.name.updateContext = function(prevType) {
  var allowed = false;
  if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
    if (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) {
      allowed = true;
    }
  }
  this.exprAllowed = allowed;
};
var pp$5 = Parser.prototype;
pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") {
    return;
  }
  if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) {
    return;
  }
  var key = prop.key;
  var name;
  switch (key.type) {
    case "Identifier":
      name = key.name;
      break;
    case "Literal":
      name = String(key.value);
      break;
    default:
      return;
  }
  var kind = prop.kind;
  if (this.options.ecmaVersion >= 6) {
    if (name === "__proto__" && kind === "init") {
      if (propHash.proto) {
        if (refDestructuringErrors) {
          if (refDestructuringErrors.doubleProto < 0) {
            refDestructuringErrors.doubleProto = key.start;
          }
        } else {
          this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
        }
      }
      propHash.proto = true;
    }
    return;
  }
  name = "$" + name;
  var other = propHash[name];
  if (other) {
    var redefinition;
    if (kind === "init") {
      redefinition = this.strict && other.init || other.get || other.set;
    } else {
      redefinition = other.init || other[kind];
    }
    if (redefinition) {
      this.raiseRecoverable(key.start, "Redefinition of property");
    }
  } else {
    other = propHash[name] = {
      init: false,
      get: false,
      set: false
    };
  }
  other[kind] = true;
};
pp$5.parseExpression = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
  if (this.type === types$1.comma) {
    var node = this.startNodeAt(startPos, startLoc);
    node.expressions = [
      expr
    ];
    while (this.eat(types$1.comma)) {
      node.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors));
    }
    return this.finishNode(node, "SequenceExpression");
  }
  return expr;
};
pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
  if (this.isContextual("yield")) {
    if (this.inGenerator) {
      return this.parseYield(forInit);
    } else {
      this.exprAllowed = false;
    }
  }
  var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
  if (refDestructuringErrors) {
    oldParenAssign = refDestructuringErrors.parenthesizedAssign;
    oldTrailingComma = refDestructuringErrors.trailingComma;
    oldDoubleProto = refDestructuringErrors.doubleProto;
    refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
  } else {
    refDestructuringErrors = new DestructuringErrors();
    ownDestructuringErrors = true;
  }
  var startPos = this.start, startLoc = this.startLoc;
  if (this.type === types$1.parenL || this.type === types$1.name) {
    this.potentialArrowAt = this.start;
    this.potentialArrowInForAwait = forInit === "await";
  }
  var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
  if (afterLeftParse) {
    left = afterLeftParse.call(this, left, startPos, startLoc);
  }
  if (this.type.isAssign) {
    var node = this.startNodeAt(startPos, startLoc);
    node.operator = this.value;
    if (this.type === types$1.eq) {
      left = this.toAssignable(left, false, refDestructuringErrors);
    }
    if (!ownDestructuringErrors) {
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
    }
    if (refDestructuringErrors.shorthandAssign >= left.start) {
      refDestructuringErrors.shorthandAssign = -1;
    }
    if (this.type === types$1.eq) {
      this.checkLValPattern(left);
    } else {
      this.checkLValSimple(left);
    }
    node.left = left;
    this.next();
    node.right = this.parseMaybeAssign(forInit);
    if (oldDoubleProto > -1) {
      refDestructuringErrors.doubleProto = oldDoubleProto;
    }
    return this.finishNode(node, "AssignmentExpression");
  } else {
    if (ownDestructuringErrors) {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
  }
  if (oldParenAssign > -1) {
    refDestructuringErrors.parenthesizedAssign = oldParenAssign;
  }
  if (oldTrailingComma > -1) {
    refDestructuringErrors.trailingComma = oldTrailingComma;
  }
  return left;
};
pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprOps(forInit, refDestructuringErrors);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  if (this.eat(types$1.question)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.test = expr;
    node.consequent = this.parseMaybeAssign();
    this.expect(types$1.colon);
    node.alternate = this.parseMaybeAssign(forInit);
    return this.finishNode(node, "ConditionalExpression");
  }
  return expr;
};
pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit);
};
pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
  var prec = this.type.binop;
  if (prec != null && (!forInit || this.type !== types$1._in)) {
    if (prec > minPrec) {
      var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND;
      var coalesce = this.type === types$1.coalesce;
      if (coalesce) {
        prec = types$1.logicalAND.binop;
      }
      var op = this.value;
      this.next();
      var startPos = this.start, startLoc = this.startLoc;
      var right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit);
      var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
      if (logical && this.type === types$1.coalesce || coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND)) {
        this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
      }
      return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit);
    }
  }
  return left;
};
pp$5.buildBinary = function(startPos, startLoc, left, right, op, logical) {
  if (right.type === "PrivateIdentifier") {
    this.raise(right.start, "Private identifier can only be left side of binary expression");
  }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.operator = op;
  node.right = right;
  return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
};
pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
  var startPos = this.start, startLoc = this.startLoc, expr;
  if (this.isContextual("await") && this.canAwait) {
    expr = this.parseAwait(forInit);
    sawUnary = true;
  } else if (this.type.prefix) {
    var node = this.startNode(), update = this.type === types$1.incDec;
    node.operator = this.value;
    node.prefix = true;
    this.next();
    node.argument = this.parseMaybeUnary(null, true, update, forInit);
    this.checkExpressionErrors(refDestructuringErrors, true);
    if (update) {
      this.checkLValSimple(node.argument);
    } else if (this.strict && node.operator === "delete" && isLocalVariableAccess(node.argument)) {
      this.raiseRecoverable(node.start, "Deleting local variable in strict mode");
    } else if (node.operator === "delete" && isPrivateFieldAccess(node.argument)) {
      this.raiseRecoverable(node.start, "Private fields can not be deleted");
    } else {
      sawUnary = true;
    }
    expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
  } else if (!sawUnary && this.type === types$1.privateId) {
    if ((forInit || this.privateNameStack.length === 0) && this.options.checkPrivateFields) {
      this.unexpected();
    }
    expr = this.parsePrivateIdent();
    if (this.type !== types$1._in) {
      this.unexpected();
    }
  } else {
    expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
    if (this.checkExpressionErrors(refDestructuringErrors)) {
      return expr;
    }
    while (this.type.postfix && !this.canInsertSemicolon()) {
      var node$1 = this.startNodeAt(startPos, startLoc);
      node$1.operator = this.value;
      node$1.prefix = false;
      node$1.argument = expr;
      this.checkLValSimple(expr);
      this.next();
      expr = this.finishNode(node$1, "UpdateExpression");
    }
  }
  if (!incDec && this.eat(types$1.starstar)) {
    if (sawUnary) {
      this.unexpected(this.lastTokStart);
    } else {
      return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false);
    }
  } else {
    return expr;
  }
};
function isLocalVariableAccess(node) {
  return node.type === "Identifier" || node.type === "ParenthesizedExpression" && isLocalVariableAccess(node.expression);
}
__name(isLocalVariableAccess, "isLocalVariableAccess");
function isPrivateFieldAccess(node) {
  return node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" || node.type === "ChainExpression" && isPrivateFieldAccess(node.expression) || node.type === "ParenthesizedExpression" && isPrivateFieldAccess(node.expression);
}
__name(isPrivateFieldAccess, "isPrivateFieldAccess");
pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprAtom(refDestructuringErrors, forInit);
  if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") {
    return expr;
  }
  var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
  if (refDestructuringErrors && result.type === "MemberExpression") {
    if (refDestructuringErrors.parenthesizedAssign >= result.start) {
      refDestructuringErrors.parenthesizedAssign = -1;
    }
    if (refDestructuringErrors.parenthesizedBind >= result.start) {
      refDestructuringErrors.parenthesizedBind = -1;
    }
    if (refDestructuringErrors.trailingComma >= result.start) {
      refDestructuringErrors.trailingComma = -1;
    }
  }
  return result;
};
pp$5.parseSubscripts = function(base, startPos, startLoc, noCalls, forInit) {
  var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" && this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 && this.potentialArrowAt === base.start;
  var optionalChained = false;
  while (true) {
    var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);
    if (element.optional) {
      optionalChained = true;
    }
    if (element === base || element.type === "ArrowFunctionExpression") {
      if (optionalChained) {
        var chainNode = this.startNodeAt(startPos, startLoc);
        chainNode.expression = element;
        element = this.finishNode(chainNode, "ChainExpression");
      }
      return element;
    }
    base = element;
  }
};
pp$5.shouldParseAsyncArrow = function() {
  return !this.canInsertSemicolon() && this.eat(types$1.arrow);
};
pp$5.parseSubscriptAsyncArrow = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit);
};
pp$5.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
  var optionalSupported = this.options.ecmaVersion >= 11;
  var optional = optionalSupported && this.eat(types$1.questionDot);
  if (noCalls && optional) {
    this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  }
  var computed = this.eat(types$1.bracketL);
  if (computed || optional && this.type !== types$1.parenL && this.type !== types$1.backQuote || this.eat(types$1.dot)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.object = base;
    if (computed) {
      node.property = this.parseExpression();
      this.expect(types$1.bracketR);
    } else if (this.type === types$1.privateId && base.type !== "Super") {
      node.property = this.parsePrivateIdent();
    } else {
      node.property = this.parseIdent(this.options.allowReserved !== "never");
    }
    node.computed = !!computed;
    if (optionalSupported) {
      node.optional = optional;
    }
    base = this.finishNode(node, "MemberExpression");
  } else if (!noCalls && this.eat(types$1.parenL)) {
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
    if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      if (this.awaitIdentPos > 0) {
        this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function");
      }
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
    var node$1 = this.startNodeAt(startPos, startLoc);
    node$1.callee = base;
    node$1.arguments = exprList;
    if (optionalSupported) {
      node$1.optional = optional;
    }
    base = this.finishNode(node$1, "CallExpression");
  } else if (this.type === types$1.backQuote) {
    if (optional || optionalChained) {
      this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    }
    var node$2 = this.startNodeAt(startPos, startLoc);
    node$2.tag = base;
    node$2.quasi = this.parseTemplate({
      isTagged: true
    });
    base = this.finishNode(node$2, "TaggedTemplateExpression");
  }
  return base;
};
pp$5.parseExprAtom = function(refDestructuringErrors, forInit, forNew) {
  if (this.type === types$1.slash) {
    this.readRegexp();
  }
  var node, canBeArrow = this.potentialArrowAt === this.start;
  switch (this.type) {
    case types$1._super:
      if (!this.allowSuper) {
        this.raise(this.start, "'super' keyword outside a method");
      }
      node = this.startNode();
      this.next();
      if (this.type === types$1.parenL && !this.allowDirectSuper) {
        this.raise(node.start, "super() call outside constructor of a subclass");
      }
      if (this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL) {
        this.unexpected();
      }
      return this.finishNode(node, "Super");
    case types$1._this:
      node = this.startNode();
      this.next();
      return this.finishNode(node, "ThisExpression");
    case types$1.name:
      var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
      var id = this.parseIdent(false);
      if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)) {
        this.overrideContext(types3.f_expr);
        return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit);
      }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(types$1.arrow)) {
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [
            id
          ], false, forInit);
        }
        if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types$1.name && !containsEsc && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
          id = this.parseIdent(false);
          if (this.canInsertSemicolon() || !this.eat(types$1.arrow)) {
            this.unexpected();
          }
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [
            id
          ], true, forInit);
        }
      }
      return id;
    case types$1.regexp:
      var value = this.value;
      node = this.parseLiteral(value.value);
      node.regex = {
        pattern: value.pattern,
        flags: value.flags
      };
      return node;
    case types$1.num:
    case types$1.string:
      return this.parseLiteral(this.value);
    case types$1._null:
    case types$1._true:
    case types$1._false:
      node = this.startNode();
      node.value = this.type === types$1._null ? null : this.type === types$1._true;
      node.raw = this.type.keyword;
      this.next();
      return this.finishNode(node, "Literal");
    case types$1.parenL:
      var start2 = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
      if (refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr)) {
          refDestructuringErrors.parenthesizedAssign = start2;
        }
        if (refDestructuringErrors.parenthesizedBind < 0) {
          refDestructuringErrors.parenthesizedBind = start2;
        }
      }
      return expr;
    case types$1.bracketL:
      node = this.startNode();
      this.next();
      node.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node, "ArrayExpression");
    case types$1.braceL:
      this.overrideContext(types3.b_expr);
      return this.parseObj(false, refDestructuringErrors);
    case types$1._function:
      node = this.startNode();
      this.next();
      return this.parseFunction(node, 0);
    case types$1._class:
      return this.parseClass(this.startNode(), false);
    case types$1._new:
      return this.parseNew();
    case types$1.backQuote:
      return this.parseTemplate();
    case types$1._import:
      if (this.options.ecmaVersion >= 11) {
        return this.parseExprImport(forNew);
      } else {
        return this.unexpected();
      }
    default:
      return this.parseExprAtomDefault();
  }
};
pp$5.parseExprAtomDefault = function() {
  this.unexpected();
};
pp$5.parseExprImport = function(forNew) {
  var node = this.startNode();
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword import");
  }
  this.next();
  if (this.type === types$1.parenL && !forNew) {
    return this.parseDynamicImport(node);
  } else if (this.type === types$1.dot) {
    var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta.name = "import";
    node.meta = this.finishNode(meta, "Identifier");
    return this.parseImportMeta(node);
  } else {
    this.unexpected();
  }
};
pp$5.parseDynamicImport = function(node) {
  this.next();
  node.source = this.parseMaybeAssign();
  if (this.options.ecmaVersion >= 16) {
    if (!this.eat(types$1.parenR)) {
      this.expect(types$1.comma);
      if (!this.afterTrailingComma(types$1.parenR)) {
        node.options = this.parseMaybeAssign();
        if (!this.eat(types$1.parenR)) {
          this.expect(types$1.comma);
          if (!this.afterTrailingComma(types$1.parenR)) {
            this.unexpected();
          }
        }
      } else {
        node.options = null;
      }
    } else {
      node.options = null;
    }
  } else {
    if (!this.eat(types$1.parenR)) {
      var errorPos = this.start;
      if (this.eat(types$1.comma) && this.eat(types$1.parenR)) {
        this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
      } else {
        this.unexpected(errorPos);
      }
    }
  }
  return this.finishNode(node, "ImportExpression");
};
pp$5.parseImportMeta = function(node) {
  this.next();
  var containsEsc = this.containsEsc;
  node.property = this.parseIdent(true);
  if (node.property.name !== "meta") {
    this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'");
  }
  if (containsEsc) {
    this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters");
  }
  if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere) {
    this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module");
  }
  return this.finishNode(node, "MetaProperty");
};
pp$5.parseLiteral = function(value) {
  var node = this.startNode();
  node.value = value;
  node.raw = this.input.slice(this.start, this.end);
  if (node.raw.charCodeAt(node.raw.length - 1) === 110) {
    node.bigint = node.value != null ? node.value.toString() : node.raw.slice(0, -1).replace(/_/g, "");
  }
  this.next();
  return this.finishNode(node, "Literal");
};
pp$5.parseParenExpression = function() {
  this.expect(types$1.parenL);
  var val = this.parseExpression();
  this.expect(types$1.parenR);
  return val;
};
pp$5.shouldParseArrow = function(exprList) {
  return !this.canInsertSemicolon();
};
pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
  var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var innerStartPos = this.start, innerStartLoc = this.startLoc;
    var exprList = [], first = true, lastIsComma = false;
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
    this.yieldPos = 0;
    this.awaitPos = 0;
    while (this.type !== types$1.parenR) {
      first ? first = false : this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
        lastIsComma = true;
        break;
      } else if (this.type === types$1.ellipsis) {
        spreadStart = this.start;
        exprList.push(this.parseParenItem(this.parseRestBinding()));
        if (this.type === types$1.comma) {
          this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
        }
        break;
      } else {
        exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
      }
    }
    var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
    this.expect(types$1.parenR);
    if (canBeArrow && this.shouldParseArrow(exprList) && this.eat(types$1.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      return this.parseParenArrowList(startPos, startLoc, exprList, forInit);
    }
    if (!exprList.length || lastIsComma) {
      this.unexpected(this.lastTokStart);
    }
    if (spreadStart) {
      this.unexpected(spreadStart);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartPos, innerStartLoc);
      val.expressions = exprList;
      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
    } else {
      val = exprList[0];
    }
  } else {
    val = this.parseParenExpression();
  }
  if (this.options.preserveParens) {
    var par = this.startNodeAt(startPos, startLoc);
    par.expression = val;
    return this.finishNode(par, "ParenthesizedExpression");
  } else {
    return val;
  }
};
pp$5.parseParenItem = function(item) {
  return item;
};
pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit);
};
var empty = [];
pp$5.parseNew = function() {
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  }
  var node = this.startNode();
  this.next();
  if (this.options.ecmaVersion >= 6 && this.type === types$1.dot) {
    var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta.name = "new";
    node.meta = this.finishNode(meta, "Identifier");
    this.next();
    var containsEsc = this.containsEsc;
    node.property = this.parseIdent(true);
    if (node.property.name !== "target") {
      this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'");
    }
    if (containsEsc) {
      this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters");
    }
    if (!this.allowNewDotTarget) {
      this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block");
    }
    return this.finishNode(node, "MetaProperty");
  }
  var startPos = this.start, startLoc = this.startLoc;
  node.callee = this.parseSubscripts(this.parseExprAtom(null, false, true), startPos, startLoc, true, false);
  if (this.eat(types$1.parenL)) {
    node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false);
  } else {
    node.arguments = empty;
  }
  return this.finishNode(node, "NewExpression");
};
pp$5.parseTemplateElement = function(ref2) {
  var isTagged = ref2.isTagged;
  var elem = this.startNode();
  if (this.type === types$1.invalidTemplate) {
    if (!isTagged) {
      this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
    }
    elem.value = {
      raw: this.value.replace(/\r\n?/g, "\n"),
      cooked: null
    };
  } else {
    elem.value = {
      raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
      cooked: this.value
    };
  }
  this.next();
  elem.tail = this.type === types$1.backQuote;
  return this.finishNode(elem, "TemplateElement");
};
pp$5.parseTemplate = function(ref2) {
  if (ref2 === void 0) ref2 = {};
  var isTagged = ref2.isTagged;
  if (isTagged === void 0) isTagged = false;
  var node = this.startNode();
  this.next();
  node.expressions = [];
  var curElt = this.parseTemplateElement({
    isTagged
  });
  node.quasis = [
    curElt
  ];
  while (!curElt.tail) {
    if (this.type === types$1.eof) {
      this.raise(this.pos, "Unterminated template literal");
    }
    this.expect(types$1.dollarBraceL);
    node.expressions.push(this.parseExpression());
    this.expect(types$1.braceR);
    node.quasis.push(curElt = this.parseTemplateElement({
      isTagged
    }));
  }
  this.next();
  return this.finishNode(node, "TemplateLiteral");
};
pp$5.isAsyncProp = function(prop) {
  return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types$1.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$5.parseObj = function(isPattern, refDestructuringErrors) {
  var node = this.startNode(), first = true, propHash = {};
  node.properties = [];
  this.next();
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var prop = this.parseProperty(isPattern, refDestructuringErrors);
    if (!isPattern) {
      this.checkPropClash(prop, propHash, refDestructuringErrors);
    }
    node.properties.push(prop);
  }
  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
};
pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
  var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
  if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
    if (isPattern) {
      prop.argument = this.parseIdent(false);
      if (this.type === types$1.comma) {
        this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
      }
      return this.finishNode(prop, "RestElement");
    }
    prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
      refDestructuringErrors.trailingComma = this.start;
    }
    return this.finishNode(prop, "SpreadElement");
  }
  if (this.options.ecmaVersion >= 6) {
    prop.method = false;
    prop.shorthand = false;
    if (isPattern || refDestructuringErrors) {
      startPos = this.start;
      startLoc = this.startLoc;
    }
    if (!isPattern) {
      isGenerator = this.eat(types$1.star);
    }
  }
  var containsEsc = this.containsEsc;
  this.parsePropertyName(prop);
  if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
    isAsync = true;
    isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
    this.parsePropertyName(prop);
  } else {
    isAsync = false;
  }
  this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
  return this.finishNode(prop, "Property");
};
pp$5.parseGetterSetter = function(prop) {
  var kind = prop.key.name;
  this.parsePropertyName(prop);
  prop.value = this.parseMethod(false);
  prop.kind = kind;
  var paramCount = prop.kind === "get" ? 0 : 1;
  if (prop.value.params.length !== paramCount) {
    var start2 = prop.value.start;
    if (prop.kind === "get") {
      this.raiseRecoverable(start2, "getter should have no params");
    } else {
      this.raiseRecoverable(start2, "setter should have exactly one param");
    }
  } else {
    if (prop.kind === "set" && prop.value.params[0].type === "RestElement") {
      this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
    }
  }
};
pp$5.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
  if ((isGenerator || isAsync) && this.type === types$1.colon) {
    this.unexpected();
  }
  if (this.eat(types$1.colon)) {
    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
    prop.kind = "init";
  } else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
    if (isPattern) {
      this.unexpected();
    }
    prop.method = true;
    prop.value = this.parseMethod(isGenerator, isAsync);
    prop.kind = "init";
  } else if (!isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq) {
    if (isGenerator || isAsync) {
      this.unexpected();
    }
    this.parseGetterSetter(prop);
  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
    if (isGenerator || isAsync) {
      this.unexpected();
    }
    this.checkUnreserved(prop.key);
    if (prop.key.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = startPos;
    }
    if (isPattern) {
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else if (this.type === types$1.eq && refDestructuringErrors) {
      if (refDestructuringErrors.shorthandAssign < 0) {
        refDestructuringErrors.shorthandAssign = this.start;
      }
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else {
      prop.value = this.copyNode(prop.key);
    }
    prop.kind = "init";
    prop.shorthand = true;
  } else {
    this.unexpected();
  }
};
pp$5.parsePropertyName = function(prop) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(types$1.bracketL)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssign();
      this.expect(types$1.bracketR);
      return prop.key;
    } else {
      prop.computed = false;
    }
  }
  return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
};
pp$5.initFunction = function(node) {
  node.id = null;
  if (this.options.ecmaVersion >= 6) {
    node.generator = node.expression = false;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = false;
  }
};
pp$5.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
  var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.initFunction(node);
  if (this.options.ecmaVersion >= 6) {
    node.generator = isGenerator;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));
  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
  this.parseFunctionBody(node, false, true, false);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "FunctionExpression");
};
pp$5.parseArrowExpression = function(node, params, isAsync, forInit) {
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
  this.initFunction(node);
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  node.params = this.toAssignableList(params, true);
  this.parseFunctionBody(node, true, false, forInit);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "ArrowFunctionExpression");
};
pp$5.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
  var isExpression = isArrowFunction && this.type !== types$1.braceL;
  var oldStrict = this.strict, useStrict = false;
  if (isExpression) {
    node.body = this.parseMaybeAssign(forInit);
    node.expression = true;
    this.checkParams(node, false);
  } else {
    var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
    if (!oldStrict || nonSimple) {
      useStrict = this.strictDirective(this.end);
      if (useStrict && nonSimple) {
        this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list");
      }
    }
    var oldLabels = this.labels;
    this.labels = [];
    if (useStrict) {
      this.strict = true;
    }
    this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
    if (this.strict && node.id) {
      this.checkLValSimple(node.id, BIND_OUTSIDE);
    }
    node.body = this.parseBlock(false, void 0, useStrict && !oldStrict);
    node.expression = false;
    this.adaptDirectivePrologue(node.body.body);
    this.labels = oldLabels;
  }
  this.exitScope();
};
pp$5.isSimpleParamList = function(params) {
  for (var i2 = 0, list2 = params; i2 < list2.length; i2 += 1) {
    var param = list2[i2];
    if (param.type !== "Identifier") {
      return false;
    }
  }
  return true;
};
pp$5.checkParams = function(node, allowDuplicates) {
  var nameHash = /* @__PURE__ */ Object.create(null);
  for (var i2 = 0, list2 = node.params; i2 < list2.length; i2 += 1) {
    var param = list2[i2];
    this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
  }
};
pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (!first) {
      this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(close)) {
        break;
      }
    } else {
      first = false;
    }
    var elt = void 0;
    if (allowEmpty && this.type === types$1.comma) {
      elt = null;
    } else if (this.type === types$1.ellipsis) {
      elt = this.parseSpread(refDestructuringErrors);
      if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0) {
        refDestructuringErrors.trailingComma = this.start;
      }
    } else {
      elt = this.parseMaybeAssign(false, refDestructuringErrors);
    }
    elts.push(elt);
  }
  return elts;
};
pp$5.checkUnreserved = function(ref2) {
  var start2 = ref2.start;
  var end = ref2.end;
  var name = ref2.name;
  if (this.inGenerator && name === "yield") {
    this.raiseRecoverable(start2, "Cannot use 'yield' as identifier inside a generator");
  }
  if (this.inAsync && name === "await") {
    this.raiseRecoverable(start2, "Cannot use 'await' as identifier inside an async function");
  }
  if (!(this.currentThisScope().flags & SCOPE_VAR) && name === "arguments") {
    this.raiseRecoverable(start2, "Cannot use 'arguments' in class field initializer");
  }
  if (this.inClassStaticBlock && (name === "arguments" || name === "await")) {
    this.raise(start2, "Cannot use " + name + " in class static initialization block");
  }
  if (this.keywords.test(name)) {
    this.raise(start2, "Unexpected keyword '" + name + "'");
  }
  if (this.options.ecmaVersion < 6 && this.input.slice(start2, end).indexOf("\\") !== -1) {
    return;
  }
  var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
  if (re.test(name)) {
    if (!this.inAsync && name === "await") {
      this.raiseRecoverable(start2, "Cannot use keyword 'await' outside an async function");
    }
    this.raiseRecoverable(start2, "The keyword '" + name + "' is reserved");
  }
};
pp$5.parseIdent = function(liberal) {
  var node = this.parseIdentNode();
  this.next(!!liberal);
  this.finishNode(node, "Identifier");
  if (!liberal) {
    this.checkUnreserved(node);
    if (node.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = node.start;
    }
  }
  return node;
};
pp$5.parseIdentNode = function() {
  var node = this.startNode();
  if (this.type === types$1.name) {
    node.name = this.value;
  } else if (this.type.keyword) {
    node.name = this.type.keyword;
    if ((node.name === "class" || node.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
      this.context.pop();
    }
    this.type = types$1.name;
  } else {
    this.unexpected();
  }
  return node;
};
pp$5.parsePrivateIdent = function() {
  var node = this.startNode();
  if (this.type === types$1.privateId) {
    node.name = this.value;
  } else {
    this.unexpected();
  }
  this.next();
  this.finishNode(node, "PrivateIdentifier");
  if (this.options.checkPrivateFields) {
    if (this.privateNameStack.length === 0) {
      this.raise(node.start, "Private field '#" + node.name + "' must be declared in an enclosing class");
    } else {
      this.privateNameStack[this.privateNameStack.length - 1].used.push(node);
    }
  }
  return node;
};
pp$5.parseYield = function(forInit) {
  if (!this.yieldPos) {
    this.yieldPos = this.start;
  }
  var node = this.startNode();
  this.next();
  if (this.type === types$1.semi || this.canInsertSemicolon() || this.type !== types$1.star && !this.type.startsExpr) {
    node.delegate = false;
    node.argument = null;
  } else {
    node.delegate = this.eat(types$1.star);
    node.argument = this.parseMaybeAssign(forInit);
  }
  return this.finishNode(node, "YieldExpression");
};
pp$5.parseAwait = function(forInit) {
  if (!this.awaitPos) {
    this.awaitPos = this.start;
  }
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeUnary(null, true, false, forInit);
  return this.finishNode(node, "AwaitExpression");
};
var pp$4 = Parser.prototype;
pp$4.raise = function(pos, message) {
  var loc = getLineInfo(this.input, pos);
  message += " (" + loc.line + ":" + loc.column + ")";
  if (this.sourceFile) {
    message += " in " + this.sourceFile;
  }
  var err = new SyntaxError(message);
  err.pos = pos;
  err.loc = loc;
  err.raisedAt = this.pos;
  throw err;
};
pp$4.raiseRecoverable = pp$4.raise;
pp$4.curPosition = function() {
  if (this.options.locations) {
    return new Position(this.curLine, this.pos - this.lineStart);
  }
};
var pp$3 = Parser.prototype;
var Scope = /* @__PURE__ */ __name(function Scope2(flags) {
  this.flags = flags;
  this.var = [];
  this.lexical = [];
  this.functions = [];
}, "Scope");
pp$3.enterScope = function(flags) {
  this.scopeStack.push(new Scope(flags));
};
pp$3.exitScope = function() {
  this.scopeStack.pop();
};
pp$3.treatFunctionsAsVarInScope = function(scope) {
  return scope.flags & SCOPE_FUNCTION || !this.inModule && scope.flags & SCOPE_TOP;
};
pp$3.declareName = function(name, bindingType, pos) {
  var redeclared = false;
  if (bindingType === BIND_LEXICAL) {
    var scope = this.currentScope();
    redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
    scope.lexical.push(name);
    if (this.inModule && scope.flags & SCOPE_TOP) {
      delete this.undefinedExports[name];
    }
  } else if (bindingType === BIND_SIMPLE_CATCH) {
    var scope$1 = this.currentScope();
    scope$1.lexical.push(name);
  } else if (bindingType === BIND_FUNCTION) {
    var scope$2 = this.currentScope();
    if (this.treatFunctionsAsVar) {
      redeclared = scope$2.lexical.indexOf(name) > -1;
    } else {
      redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1;
    }
    scope$2.functions.push(name);
  } else {
    for (var i2 = this.scopeStack.length - 1; i2 >= 0; --i2) {
      var scope$3 = this.scopeStack[i2];
      if (scope$3.lexical.indexOf(name) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH && scope$3.lexical[0] === name) || !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
        redeclared = true;
        break;
      }
      scope$3.var.push(name);
      if (this.inModule && scope$3.flags & SCOPE_TOP) {
        delete this.undefinedExports[name];
      }
      if (scope$3.flags & SCOPE_VAR) {
        break;
      }
    }
  }
  if (redeclared) {
    this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
  }
};
pp$3.checkLocalExport = function(id) {
  if (this.scopeStack[0].lexical.indexOf(id.name) === -1 && this.scopeStack[0].var.indexOf(id.name) === -1) {
    this.undefinedExports[id.name] = id;
  }
};
pp$3.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
};
pp$3.currentVarScope = function() {
  for (var i2 = this.scopeStack.length - 1; ; i2--) {
    var scope = this.scopeStack[i2];
    if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK)) {
      return scope;
    }
  }
};
pp$3.currentThisScope = function() {
  for (var i2 = this.scopeStack.length - 1; ; i2--) {
    var scope = this.scopeStack[i2];
    if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK) && !(scope.flags & SCOPE_ARROW)) {
      return scope;
    }
  }
};
var Node = /* @__PURE__ */ __name(function Node2(parser, pos, loc) {
  this.type = "";
  this.start = pos;
  this.end = 0;
  if (parser.options.locations) {
    this.loc = new SourceLocation(parser, loc);
  }
  if (parser.options.directSourceFile) {
    this.sourceFile = parser.options.directSourceFile;
  }
  if (parser.options.ranges) {
    this.range = [
      pos,
      0
    ];
  }
}, "Node");
var pp$2 = Parser.prototype;
pp$2.startNode = function() {
  return new Node(this, this.start, this.startLoc);
};
pp$2.startNodeAt = function(pos, loc) {
  return new Node(this, pos, loc);
};
function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  if (this.options.locations) {
    node.loc.end = loc;
  }
  if (this.options.ranges) {
    node.range[1] = pos;
  }
  return node;
}
__name(finishNodeAt, "finishNodeAt");
pp$2.finishNode = function(node, type) {
  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
};
pp$2.finishNodeAt = function(node, type, pos, loc) {
  return finishNodeAt.call(this, node, type, pos, loc);
};
pp$2.copyNode = function(node) {
  var newNode = new Node(this, node.start, this.startLoc);
  for (var prop in node) {
    newNode[prop] = node[prop];
  }
  return newNode;
};
var scriptValuesAddedInUnicode = "Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz";
var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
var ecma11BinaryProperties = ecma10BinaryProperties;
var ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
var ecma13BinaryProperties = ecma12BinaryProperties;
var ecma14BinaryProperties = ecma13BinaryProperties;
var unicodeBinaryProperties = {
  9: ecma9BinaryProperties,
  10: ecma10BinaryProperties,
  11: ecma11BinaryProperties,
  12: ecma12BinaryProperties,
  13: ecma13BinaryProperties,
  14: ecma14BinaryProperties
};
var ecma14BinaryPropertiesOfStrings = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji";
var unicodeBinaryPropertiesOfStrings = {
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: ecma14BinaryPropertiesOfStrings
};
var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
var ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
var ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
var ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
var ecma14ScriptValues = ecma13ScriptValues + " " + scriptValuesAddedInUnicode;
var unicodeScriptValues = {
  9: ecma9ScriptValues,
  10: ecma10ScriptValues,
  11: ecma11ScriptValues,
  12: ecma12ScriptValues,
  13: ecma13ScriptValues,
  14: ecma14ScriptValues
};
var data = {};
function buildUnicodeData(ecmaVersion2) {
  var d = data[ecmaVersion2] = {
    binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion2] + " " + unicodeGeneralCategoryValues),
    binaryOfStrings: wordsRegexp(unicodeBinaryPropertiesOfStrings[ecmaVersion2]),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[ecmaVersion2])
    }
  };
  d.nonBinary.Script_Extensions = d.nonBinary.Script;
  d.nonBinary.gc = d.nonBinary.General_Category;
  d.nonBinary.sc = d.nonBinary.Script;
  d.nonBinary.scx = d.nonBinary.Script_Extensions;
}
__name(buildUnicodeData, "buildUnicodeData");
for (i = 0, list = [
  9,
  10,
  11,
  12,
  13,
  14
]; i < list.length; i += 1) {
  ecmaVersion = list[i];
  buildUnicodeData(ecmaVersion);
}
var ecmaVersion;
var i;
var list;
var pp$1 = Parser.prototype;
var BranchID = /* @__PURE__ */ __name(function BranchID2(parent, base) {
  this.parent = parent;
  this.base = base || this;
}, "BranchID");
BranchID.prototype.separatedFrom = /* @__PURE__ */ __name(function separatedFrom(alt) {
  for (var self2 = this; self2; self2 = self2.parent) {
    for (var other = alt; other; other = other.parent) {
      if (self2.base === other.base && self2 !== other) {
        return true;
      }
    }
  }
  return false;
}, "separatedFrom");
BranchID.prototype.sibling = /* @__PURE__ */ __name(function sibling() {
  return new BranchID(this.parent, this.base);
}, "sibling");
var RegExpValidationState = /* @__PURE__ */ __name(function RegExpValidationState2(parser) {
  this.parser = parser;
  this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "") + (parser.options.ecmaVersion >= 13 ? "d" : "") + (parser.options.ecmaVersion >= 15 ? "v" : "");
  this.unicodeProperties = data[parser.options.ecmaVersion >= 14 ? 14 : parser.options.ecmaVersion];
  this.source = "";
  this.flags = "";
  this.start = 0;
  this.switchU = false;
  this.switchV = false;
  this.switchN = false;
  this.pos = 0;
  this.lastIntValue = 0;
  this.lastStringValue = "";
  this.lastAssertionIsQuantifiable = false;
  this.numCapturingParens = 0;
  this.maxBackReference = 0;
  this.groupNames = /* @__PURE__ */ Object.create(null);
  this.backReferenceNames = [];
  this.branchID = null;
}, "RegExpValidationState");
RegExpValidationState.prototype.reset = /* @__PURE__ */ __name(function reset(start2, pattern, flags) {
  var unicodeSets = flags.indexOf("v") !== -1;
  var unicode = flags.indexOf("u") !== -1;
  this.start = start2 | 0;
  this.source = pattern + "";
  this.flags = flags;
  if (unicodeSets && this.parser.options.ecmaVersion >= 15) {
    this.switchU = true;
    this.switchV = true;
    this.switchN = true;
  } else {
    this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
    this.switchV = false;
    this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
  }
}, "reset");
RegExpValidationState.prototype.raise = /* @__PURE__ */ __name(function raise(message) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
}, "raise");
RegExpValidationState.prototype.at = /* @__PURE__ */ __name(function at(i2, forceU) {
  if (forceU === void 0) forceU = false;
  var s = this.source;
  var l = s.length;
  if (i2 >= l) {
    return -1;
  }
  var c = s.charCodeAt(i2);
  if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i2 + 1 >= l) {
    return c;
  }
  var next2 = s.charCodeAt(i2 + 1);
  return next2 >= 56320 && next2 <= 57343 ? (c << 10) + next2 - 56613888 : c;
}, "at");
RegExpValidationState.prototype.nextIndex = /* @__PURE__ */ __name(function nextIndex(i2, forceU) {
  if (forceU === void 0) forceU = false;
  var s = this.source;
  var l = s.length;
  if (i2 >= l) {
    return l;
  }
  var c = s.charCodeAt(i2), next2;
  if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i2 + 1 >= l || (next2 = s.charCodeAt(i2 + 1)) < 56320 || next2 > 57343) {
    return i2 + 1;
  }
  return i2 + 2;
}, "nextIndex");
RegExpValidationState.prototype.current = /* @__PURE__ */ __name(function current(forceU) {
  if (forceU === void 0) forceU = false;
  return this.at(this.pos, forceU);
}, "current");
RegExpValidationState.prototype.lookahead = /* @__PURE__ */ __name(function lookahead(forceU) {
  if (forceU === void 0) forceU = false;
  return this.at(this.nextIndex(this.pos, forceU), forceU);
}, "lookahead");
RegExpValidationState.prototype.advance = /* @__PURE__ */ __name(function advance(forceU) {
  if (forceU === void 0) forceU = false;
  this.pos = this.nextIndex(this.pos, forceU);
}, "advance");
RegExpValidationState.prototype.eat = /* @__PURE__ */ __name(function eat(ch, forceU) {
  if (forceU === void 0) forceU = false;
  if (this.current(forceU) === ch) {
    this.advance(forceU);
    return true;
  }
  return false;
}, "eat");
RegExpValidationState.prototype.eatChars = /* @__PURE__ */ __name(function eatChars(chs, forceU) {
  if (forceU === void 0) forceU = false;
  var pos = this.pos;
  for (var i2 = 0, list2 = chs; i2 < list2.length; i2 += 1) {
    var ch = list2[i2];
    var current2 = this.at(pos, forceU);
    if (current2 === -1 || current2 !== ch) {
      return false;
    }
    pos = this.nextIndex(pos, forceU);
  }
  this.pos = pos;
  return true;
}, "eatChars");
pp$1.validateRegExpFlags = function(state) {
  var validFlags = state.validFlags;
  var flags = state.flags;
  var u = false;
  var v = false;
  for (var i2 = 0; i2 < flags.length; i2++) {
    var flag = flags.charAt(i2);
    if (validFlags.indexOf(flag) === -1) {
      this.raise(state.start, "Invalid regular expression flag");
    }
    if (flags.indexOf(flag, i2 + 1) > -1) {
      this.raise(state.start, "Duplicate regular expression flag");
    }
    if (flag === "u") {
      u = true;
    }
    if (flag === "v") {
      v = true;
    }
  }
  if (this.options.ecmaVersion >= 15 && u && v) {
    this.raise(state.start, "Invalid regular expression flag");
  }
};
function hasProp(obj) {
  for (var _ in obj) {
    return true;
  }
  return false;
}
__name(hasProp, "hasProp");
pp$1.validateRegExpPattern = function(state) {
  this.regexp_pattern(state);
  if (!state.switchN && this.options.ecmaVersion >= 9 && hasProp(state.groupNames)) {
    state.switchN = true;
    this.regexp_pattern(state);
  }
};
pp$1.regexp_pattern = function(state) {
  state.pos = 0;
  state.lastIntValue = 0;
  state.lastStringValue = "";
  state.lastAssertionIsQuantifiable = false;
  state.numCapturingParens = 0;
  state.maxBackReference = 0;
  state.groupNames = /* @__PURE__ */ Object.create(null);
  state.backReferenceNames.length = 0;
  state.branchID = null;
  this.regexp_disjunction(state);
  if (state.pos !== state.source.length) {
    if (state.eat(
      41
      /* ) */
    )) {
      state.raise("Unmatched ')'");
    }
    if (state.eat(
      93
      /* ] */
    ) || state.eat(
      125
      /* } */
    )) {
      state.raise("Lone quantifier brackets");
    }
  }
  if (state.maxBackReference > state.numCapturingParens) {
    state.raise("Invalid escape");
  }
  for (var i2 = 0, list2 = state.backReferenceNames; i2 < list2.length; i2 += 1) {
    var name = list2[i2];
    if (!state.groupNames[name]) {
      state.raise("Invalid named capture referenced");
    }
  }
};
pp$1.regexp_disjunction = function(state) {
  var trackDisjunction = this.options.ecmaVersion >= 16;
  if (trackDisjunction) {
    state.branchID = new BranchID(state.branchID, null);
  }
  this.regexp_alternative(state);
  while (state.eat(
    124
    /* | */
  )) {
    if (trackDisjunction) {
      state.branchID = state.branchID.sibling();
    }
    this.regexp_alternative(state);
  }
  if (trackDisjunction) {
    state.branchID = state.branchID.parent;
  }
  if (this.regexp_eatQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  if (state.eat(
    123
    /* { */
  )) {
    state.raise("Lone quantifier brackets");
  }
};
pp$1.regexp_alternative = function(state) {
  while (state.pos < state.source.length && this.regexp_eatTerm(state)) {
  }
};
pp$1.regexp_eatTerm = function(state) {
  if (this.regexp_eatAssertion(state)) {
    if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
      if (state.switchU) {
        state.raise("Invalid quantifier");
      }
    }
    return true;
  }
  if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
    this.regexp_eatQuantifier(state);
    return true;
  }
  return false;
};
pp$1.regexp_eatAssertion = function(state) {
  var start2 = state.pos;
  state.lastAssertionIsQuantifiable = false;
  if (state.eat(
    94
    /* ^ */
  ) || state.eat(
    36
    /* $ */
  )) {
    return true;
  }
  if (state.eat(
    92
    /* \ */
  )) {
    if (state.eat(
      66
      /* B */
    ) || state.eat(
      98
      /* b */
    )) {
      return true;
    }
    state.pos = start2;
  }
  if (state.eat(
    40
    /* ( */
  ) && state.eat(
    63
    /* ? */
  )) {
    var lookbehind = false;
    if (this.options.ecmaVersion >= 9) {
      lookbehind = state.eat(
        60
        /* < */
      );
    }
    if (state.eat(
      61
      /* = */
    ) || state.eat(
      33
      /* ! */
    )) {
      this.regexp_disjunction(state);
      if (!state.eat(
        41
        /* ) */
      )) {
        state.raise("Unterminated group");
      }
      state.lastAssertionIsQuantifiable = !lookbehind;
      return true;
    }
  }
  state.pos = start2;
  return false;
};
pp$1.regexp_eatQuantifier = function(state, noError) {
  if (noError === void 0) noError = false;
  if (this.regexp_eatQuantifierPrefix(state, noError)) {
    state.eat(
      63
      /* ? */
    );
    return true;
  }
  return false;
};
pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
  return state.eat(
    42
    /* * */
  ) || state.eat(
    43
    /* + */
  ) || state.eat(
    63
    /* ? */
  ) || this.regexp_eatBracedQuantifier(state, noError);
};
pp$1.regexp_eatBracedQuantifier = function(state, noError) {
  var start2 = state.pos;
  if (state.eat(
    123
    /* { */
  )) {
    var min = 0, max = -1;
    if (this.regexp_eatDecimalDigits(state)) {
      min = state.lastIntValue;
      if (state.eat(
        44
        /* , */
      ) && this.regexp_eatDecimalDigits(state)) {
        max = state.lastIntValue;
      }
      if (state.eat(
        125
        /* } */
      )) {
        if (max !== -1 && max < min && !noError) {
          state.raise("numbers out of order in {} quantifier");
        }
        return true;
      }
    }
    if (state.switchU && !noError) {
      state.raise("Incomplete quantifier");
    }
    state.pos = start2;
  }
  return false;
};
pp$1.regexp_eatAtom = function(state) {
  return this.regexp_eatPatternCharacters(state) || state.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state);
};
pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
  var start2 = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatAtomEscape(state)) {
      return true;
    }
    state.pos = start2;
  }
  return false;
};
pp$1.regexp_eatUncapturingGroup = function(state) {
  var start2 = state.pos;
  if (state.eat(
    40
    /* ( */
  )) {
    if (state.eat(
      63
      /* ? */
    )) {
      if (this.options.ecmaVersion >= 16) {
        var addModifiers = this.regexp_eatModifiers(state);
        var hasHyphen = state.eat(
          45
          /* - */
        );
        if (addModifiers || hasHyphen) {
          for (var i2 = 0; i2 < addModifiers.length; i2++) {
            var modifier = addModifiers.charAt(i2);
            if (addModifiers.indexOf(modifier, i2 + 1) > -1) {
              state.raise("Duplicate regular expression modifiers");
            }
          }
          if (hasHyphen) {
            var removeModifiers = this.regexp_eatModifiers(state);
            if (!addModifiers && !removeModifiers && state.current() === 58) {
              state.raise("Invalid regular expression modifiers");
            }
            for (var i$1 = 0; i$1 < removeModifiers.length; i$1++) {
              var modifier$1 = removeModifiers.charAt(i$1);
              if (removeModifiers.indexOf(modifier$1, i$1 + 1) > -1 || addModifiers.indexOf(modifier$1) > -1) {
                state.raise("Duplicate regular expression modifiers");
              }
            }
          }
        }
      }
      if (state.eat(
        58
        /* : */
      )) {
        this.regexp_disjunction(state);
        if (state.eat(
          41
          /* ) */
        )) {
          return true;
        }
        state.raise("Unterminated group");
      }
    }
    state.pos = start2;
  }
  return false;
};
pp$1.regexp_eatCapturingGroup = function(state) {
  if (state.eat(
    40
    /* ( */
  )) {
    if (this.options.ecmaVersion >= 9) {
      this.regexp_groupSpecifier(state);
    } else if (state.current() === 63) {
      state.raise("Invalid group");
    }
    this.regexp_disjunction(state);
    if (state.eat(
      41
      /* ) */
    )) {
      state.numCapturingParens += 1;
      return true;
    }
    state.raise("Unterminated group");
  }
  return false;
};
pp$1.regexp_eatModifiers = function(state) {
  var modifiers = "";
  var ch = 0;
  while ((ch = state.current()) !== -1 && isRegularExpressionModifier(ch)) {
    modifiers += codePointToString(ch);
    state.advance();
  }
  return modifiers;
};
function isRegularExpressionModifier(ch) {
  return ch === 105 || ch === 109 || ch === 115;
}
__name(isRegularExpressionModifier, "isRegularExpressionModifier");
pp$1.regexp_eatExtendedAtom = function(state) {
  return state.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state) || this.regexp_eatInvalidBracedQuantifier(state) || this.regexp_eatExtendedPatternCharacter(state);
};
pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
  if (this.regexp_eatBracedQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  return false;
};
pp$1.regexp_eatSyntaxCharacter = function(state) {
  var ch = state.current();
  if (isSyntaxCharacter(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
function isSyntaxCharacter(ch) {
  return ch === 36 || ch >= 40 && ch <= 43 || ch === 46 || ch === 63 || ch >= 91 && ch <= 94 || ch >= 123 && ch <= 125;
}
__name(isSyntaxCharacter, "isSyntaxCharacter");
pp$1.regexp_eatPatternCharacters = function(state) {
  var start2 = state.pos;
  var ch = 0;
  while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
    state.advance();
  }
  return state.pos !== start2;
};
pp$1.regexp_eatExtendedPatternCharacter = function(state) {
  var ch = state.current();
  if (ch !== -1 && ch !== 36 && !(ch >= 40 && ch <= 43) && ch !== 46 && ch !== 63 && ch !== 91 && ch !== 94 && ch !== 124) {
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_groupSpecifier = function(state) {
  if (state.eat(
    63
    /* ? */
  )) {
    if (!this.regexp_eatGroupName(state)) {
      state.raise("Invalid group");
    }
    var trackDisjunction = this.options.ecmaVersion >= 16;
    var known = state.groupNames[state.lastStringValue];
    if (known) {
      if (trackDisjunction) {
        for (var i2 = 0, list2 = known; i2 < list2.length; i2 += 1) {
          var altID = list2[i2];
          if (!altID.separatedFrom(state.branchID)) {
            state.raise("Duplicate capture group name");
          }
        }
      } else {
        state.raise("Duplicate capture group name");
      }
    }
    if (trackDisjunction) {
      (known || (state.groupNames[state.lastStringValue] = [])).push(state.branchID);
    } else {
      state.groupNames[state.lastStringValue] = true;
    }
  }
};
pp$1.regexp_eatGroupName = function(state) {
  state.lastStringValue = "";
  if (state.eat(
    60
    /* < */
  )) {
    if (this.regexp_eatRegExpIdentifierName(state) && state.eat(
      62
      /* > */
    )) {
      return true;
    }
    state.raise("Invalid capture group name");
  }
  return false;
};
pp$1.regexp_eatRegExpIdentifierName = function(state) {
  state.lastStringValue = "";
  if (this.regexp_eatRegExpIdentifierStart(state)) {
    state.lastStringValue += codePointToString(state.lastIntValue);
    while (this.regexp_eatRegExpIdentifierPart(state)) {
      state.lastStringValue += codePointToString(state.lastIntValue);
    }
    return true;
  }
  return false;
};
pp$1.regexp_eatRegExpIdentifierStart = function(state) {
  var start2 = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);
  if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierStart(ch)) {
    state.lastIntValue = ch;
    return true;
  }
  state.pos = start2;
  return false;
};
function isRegExpIdentifierStart(ch) {
  return isIdentifierStart(ch, true) || ch === 36 || ch === 95;
}
__name(isRegExpIdentifierStart, "isRegExpIdentifierStart");
pp$1.regexp_eatRegExpIdentifierPart = function(state) {
  var start2 = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);
  if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierPart(ch)) {
    state.lastIntValue = ch;
    return true;
  }
  state.pos = start2;
  return false;
};
function isRegExpIdentifierPart(ch) {
  return isIdentifierChar(ch, true) || ch === 36 || ch === 95 || ch === 8204 || ch === 8205;
}
__name(isRegExpIdentifierPart, "isRegExpIdentifierPart");
pp$1.regexp_eatAtomEscape = function(state) {
  if (this.regexp_eatBackReference(state) || this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state) || state.switchN && this.regexp_eatKGroupName(state)) {
    return true;
  }
  if (state.switchU) {
    if (state.current() === 99) {
      state.raise("Invalid unicode escape");
    }
    state.raise("Invalid escape");
  }
  return false;
};
pp$1.regexp_eatBackReference = function(state) {
  var start2 = state.pos;
  if (this.regexp_eatDecimalEscape(state)) {
    var n = state.lastIntValue;
    if (state.switchU) {
      if (n > state.maxBackReference) {
        state.maxBackReference = n;
      }
      return true;
    }
    if (n <= state.numCapturingParens) {
      return true;
    }
    state.pos = start2;
  }
  return false;
};
pp$1.regexp_eatKGroupName = function(state) {
  if (state.eat(
    107
    /* k */
  )) {
    if (this.regexp_eatGroupName(state)) {
      state.backReferenceNames.push(state.lastStringValue);
      return true;
    }
    state.raise("Invalid named reference");
  }
  return false;
};
pp$1.regexp_eatCharacterEscape = function(state) {
  return this.regexp_eatControlEscape(state) || this.regexp_eatCControlLetter(state) || this.regexp_eatZero(state) || this.regexp_eatHexEscapeSequence(state) || this.regexp_eatRegExpUnicodeEscapeSequence(state, false) || !state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state) || this.regexp_eatIdentityEscape(state);
};
pp$1.regexp_eatCControlLetter = function(state) {
  var start2 = state.pos;
  if (state.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatControlLetter(state)) {
      return true;
    }
    state.pos = start2;
  }
  return false;
};
pp$1.regexp_eatZero = function(state) {
  if (state.current() === 48 && !isDecimalDigit(state.lookahead())) {
    state.lastIntValue = 0;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatControlEscape = function(state) {
  var ch = state.current();
  if (ch === 116) {
    state.lastIntValue = 9;
    state.advance();
    return true;
  }
  if (ch === 110) {
    state.lastIntValue = 10;
    state.advance();
    return true;
  }
  if (ch === 118) {
    state.lastIntValue = 11;
    state.advance();
    return true;
  }
  if (ch === 102) {
    state.lastIntValue = 12;
    state.advance();
    return true;
  }
  if (ch === 114) {
    state.lastIntValue = 13;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatControlLetter = function(state) {
  var ch = state.current();
  if (isControlLetter(ch)) {
    state.lastIntValue = ch % 32;
    state.advance();
    return true;
  }
  return false;
};
function isControlLetter(ch) {
  return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122;
}
__name(isControlLetter, "isControlLetter");
pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
  if (forceU === void 0) forceU = false;
  var start2 = state.pos;
  var switchU = forceU || state.switchU;
  if (state.eat(
    117
    /* u */
  )) {
    if (this.regexp_eatFixedHexDigits(state, 4)) {
      var lead = state.lastIntValue;
      if (switchU && lead >= 55296 && lead <= 56319) {
        var leadSurrogateEnd = state.pos;
        if (state.eat(
          92
          /* \ */
        ) && state.eat(
          117
          /* u */
        ) && this.regexp_eatFixedHexDigits(state, 4)) {
          var trail = state.lastIntValue;
          if (trail >= 56320 && trail <= 57343) {
            state.lastIntValue = (lead - 55296) * 1024 + (trail - 56320) + 65536;
            return true;
          }
        }
        state.pos = leadSurrogateEnd;
        state.lastIntValue = lead;
      }
      return true;
    }
    if (switchU && state.eat(
      123
      /* { */
    ) && this.regexp_eatHexDigits(state) && state.eat(
      125
      /* } */
    ) && isValidUnicode(state.lastIntValue)) {
      return true;
    }
    if (switchU) {
      state.raise("Invalid unicode escape");
    }
    state.pos = start2;
  }
  return false;
};
function isValidUnicode(ch) {
  return ch >= 0 && ch <= 1114111;
}
__name(isValidUnicode, "isValidUnicode");
pp$1.regexp_eatIdentityEscape = function(state) {
  if (state.switchU) {
    if (this.regexp_eatSyntaxCharacter(state)) {
      return true;
    }
    if (state.eat(
      47
      /* / */
    )) {
      state.lastIntValue = 47;
      return true;
    }
    return false;
  }
  var ch = state.current();
  if (ch !== 99 && (!state.switchN || ch !== 107)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatDecimalEscape = function(state) {
  state.lastIntValue = 0;
  var ch = state.current();
  if (ch >= 49 && ch <= 57) {
    do {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
      state.advance();
    } while ((ch = state.current()) >= 48 && ch <= 57);
    return true;
  }
  return false;
};
var CharSetNone = 0;
var CharSetOk = 1;
var CharSetString = 2;
pp$1.regexp_eatCharacterClassEscape = function(state) {
  var ch = state.current();
  if (isCharacterClassEscape(ch)) {
    state.lastIntValue = -1;
    state.advance();
    return CharSetOk;
  }
  var negate = false;
  if (state.switchU && this.options.ecmaVersion >= 9 && ((negate = ch === 80) || ch === 112)) {
    state.lastIntValue = -1;
    state.advance();
    var result;
    if (state.eat(
      123
      /* { */
    ) && (result = this.regexp_eatUnicodePropertyValueExpression(state)) && state.eat(
      125
      /* } */
    )) {
      if (negate && result === CharSetString) {
        state.raise("Invalid property name");
      }
      return result;
    }
    state.raise("Invalid property name");
  }
  return CharSetNone;
};
function isCharacterClassEscape(ch) {
  return ch === 100 || ch === 68 || ch === 115 || ch === 83 || ch === 119 || ch === 87;
}
__name(isCharacterClassEscape, "isCharacterClassEscape");
pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
  var start2 = state.pos;
  if (this.regexp_eatUnicodePropertyName(state) && state.eat(
    61
    /* = */
  )) {
    var name = state.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(state)) {
      var value = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
      return CharSetOk;
    }
  }
  state.pos = start2;
  if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
    var nameOrValue = state.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
  }
  return CharSetNone;
};
pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
  if (!hasOwn(state.unicodeProperties.nonBinary, name)) {
    state.raise("Invalid property name");
  }
  if (!state.unicodeProperties.nonBinary[name].test(value)) {
    state.raise("Invalid property value");
  }
};
pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
  if (state.unicodeProperties.binary.test(nameOrValue)) {
    return CharSetOk;
  }
  if (state.switchV && state.unicodeProperties.binaryOfStrings.test(nameOrValue)) {
    return CharSetString;
  }
  state.raise("Invalid property name");
};
pp$1.regexp_eatUnicodePropertyName = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyNameCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyNameCharacter(ch) {
  return isControlLetter(ch) || ch === 95;
}
__name(isUnicodePropertyNameCharacter, "isUnicodePropertyNameCharacter");
pp$1.regexp_eatUnicodePropertyValue = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyValueCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyValueCharacter(ch) {
  return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch);
}
__name(isUnicodePropertyValueCharacter, "isUnicodePropertyValueCharacter");
pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
  return this.regexp_eatUnicodePropertyValue(state);
};
pp$1.regexp_eatCharacterClass = function(state) {
  if (state.eat(
    91
    /* [ */
  )) {
    var negate = state.eat(
      94
      /* ^ */
    );
    var result = this.regexp_classContents(state);
    if (!state.eat(
      93
      /* ] */
    )) {
      state.raise("Unterminated character class");
    }
    if (negate && result === CharSetString) {
      state.raise("Negated character class may contain strings");
    }
    return true;
  }
  return false;
};
pp$1.regexp_classContents = function(state) {
  if (state.current() === 93) {
    return CharSetOk;
  }
  if (state.switchV) {
    return this.regexp_classSetExpression(state);
  }
  this.regexp_nonEmptyClassRanges(state);
  return CharSetOk;
};
pp$1.regexp_nonEmptyClassRanges = function(state) {
  while (this.regexp_eatClassAtom(state)) {
    var left = state.lastIntValue;
    if (state.eat(
      45
      /* - */
    ) && this.regexp_eatClassAtom(state)) {
      var right = state.lastIntValue;
      if (state.switchU && (left === -1 || right === -1)) {
        state.raise("Invalid character class");
      }
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
    }
  }
};
pp$1.regexp_eatClassAtom = function(state) {
  var start2 = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatClassEscape(state)) {
      return true;
    }
    if (state.switchU) {
      var ch$1 = state.current();
      if (ch$1 === 99 || isOctalDigit(ch$1)) {
        state.raise("Invalid class escape");
      }
      state.raise("Invalid escape");
    }
    state.pos = start2;
  }
  var ch = state.current();
  if (ch !== 93) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatClassEscape = function(state) {
  var start2 = state.pos;
  if (state.eat(
    98
    /* b */
  )) {
    state.lastIntValue = 8;
    return true;
  }
  if (state.switchU && state.eat(
    45
    /* - */
  )) {
    state.lastIntValue = 45;
    return true;
  }
  if (!state.switchU && state.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatClassControlLetter(state)) {
      return true;
    }
    state.pos = start2;
  }
  return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
};
pp$1.regexp_classSetExpression = function(state) {
  var result = CharSetOk, subResult;
  if (this.regexp_eatClassSetRange(state)) ;
  else if (subResult = this.regexp_eatClassSetOperand(state)) {
    if (subResult === CharSetString) {
      result = CharSetString;
    }
    var start2 = state.pos;
    while (state.eatChars([
      38,
      38
    ])) {
      if (state.current() !== 38 && (subResult = this.regexp_eatClassSetOperand(state))) {
        if (subResult !== CharSetString) {
          result = CharSetOk;
        }
        continue;
      }
      state.raise("Invalid character in character class");
    }
    if (start2 !== state.pos) {
      return result;
    }
    while (state.eatChars([
      45,
      45
    ])) {
      if (this.regexp_eatClassSetOperand(state)) {
        continue;
      }
      state.raise("Invalid character in character class");
    }
    if (start2 !== state.pos) {
      return result;
    }
  } else {
    state.raise("Invalid character in character class");
  }
  for (; ; ) {
    if (this.regexp_eatClassSetRange(state)) {
      continue;
    }
    subResult = this.regexp_eatClassSetOperand(state);
    if (!subResult) {
      return result;
    }
    if (subResult === CharSetString) {
      result = CharSetString;
    }
  }
};
pp$1.regexp_eatClassSetRange = function(state) {
  var start2 = state.pos;
  if (this.regexp_eatClassSetCharacter(state)) {
    var left = state.lastIntValue;
    if (state.eat(
      45
      /* - */
    ) && this.regexp_eatClassSetCharacter(state)) {
      var right = state.lastIntValue;
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
      return true;
    }
    state.pos = start2;
  }
  return false;
};
pp$1.regexp_eatClassSetOperand = function(state) {
  if (this.regexp_eatClassSetCharacter(state)) {
    return CharSetOk;
  }
  return this.regexp_eatClassStringDisjunction(state) || this.regexp_eatNestedClass(state);
};
pp$1.regexp_eatNestedClass = function(state) {
  var start2 = state.pos;
  if (state.eat(
    91
    /* [ */
  )) {
    var negate = state.eat(
      94
      /* ^ */
    );
    var result = this.regexp_classContents(state);
    if (state.eat(
      93
      /* ] */
    )) {
      if (negate && result === CharSetString) {
        state.raise("Negated character class may contain strings");
      }
      return result;
    }
    state.pos = start2;
  }
  if (state.eat(
    92
    /* \ */
  )) {
    var result$1 = this.regexp_eatCharacterClassEscape(state);
    if (result$1) {
      return result$1;
    }
    state.pos = start2;
  }
  return null;
};
pp$1.regexp_eatClassStringDisjunction = function(state) {
  var start2 = state.pos;
  if (state.eatChars([
    92,
    113
  ])) {
    if (state.eat(
      123
      /* { */
    )) {
      var result = this.regexp_classStringDisjunctionContents(state);
      if (state.eat(
        125
        /* } */
      )) {
        return result;
      }
    } else {
      state.raise("Invalid escape");
    }
    state.pos = start2;
  }
  return null;
};
pp$1.regexp_classStringDisjunctionContents = function(state) {
  var result = this.regexp_classString(state);
  while (state.eat(
    124
    /* | */
  )) {
    if (this.regexp_classString(state) === CharSetString) {
      result = CharSetString;
    }
  }
  return result;
};
pp$1.regexp_classString = function(state) {
  var count = 0;
  while (this.regexp_eatClassSetCharacter(state)) {
    count++;
  }
  return count === 1 ? CharSetOk : CharSetString;
};
pp$1.regexp_eatClassSetCharacter = function(state) {
  var start2 = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatCharacterEscape(state) || this.regexp_eatClassSetReservedPunctuator(state)) {
      return true;
    }
    if (state.eat(
      98
      /* b */
    )) {
      state.lastIntValue = 8;
      return true;
    }
    state.pos = start2;
    return false;
  }
  var ch = state.current();
  if (ch < 0 || ch === state.lookahead() && isClassSetReservedDoublePunctuatorCharacter(ch)) {
    return false;
  }
  if (isClassSetSyntaxCharacter(ch)) {
    return false;
  }
  state.advance();
  state.lastIntValue = ch;
  return true;
};
function isClassSetReservedDoublePunctuatorCharacter(ch) {
  return ch === 33 || ch >= 35 && ch <= 38 || ch >= 42 && ch <= 44 || ch === 46 || ch >= 58 && ch <= 64 || ch === 94 || ch === 96 || ch === 126;
}
__name(isClassSetReservedDoublePunctuatorCharacter, "isClassSetReservedDoublePunctuatorCharacter");
function isClassSetSyntaxCharacter(ch) {
  return ch === 40 || ch === 41 || ch === 45 || ch === 47 || ch >= 91 && ch <= 93 || ch >= 123 && ch <= 125;
}
__name(isClassSetSyntaxCharacter, "isClassSetSyntaxCharacter");
pp$1.regexp_eatClassSetReservedPunctuator = function(state) {
  var ch = state.current();
  if (isClassSetReservedPunctuator(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
function isClassSetReservedPunctuator(ch) {
  return ch === 33 || ch === 35 || ch === 37 || ch === 38 || ch === 44 || ch === 45 || ch >= 58 && ch <= 62 || ch === 64 || ch === 96 || ch === 126;
}
__name(isClassSetReservedPunctuator, "isClassSetReservedPunctuator");
pp$1.regexp_eatClassControlLetter = function(state) {
  var ch = state.current();
  if (isDecimalDigit(ch) || ch === 95) {
    state.lastIntValue = ch % 32;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatHexEscapeSequence = function(state) {
  var start2 = state.pos;
  if (state.eat(
    120
    /* x */
  )) {
    if (this.regexp_eatFixedHexDigits(state, 2)) {
      return true;
    }
    if (state.switchU) {
      state.raise("Invalid escape");
    }
    state.pos = start2;
  }
  return false;
};
pp$1.regexp_eatDecimalDigits = function(state) {
  var start2 = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isDecimalDigit(ch = state.current())) {
    state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
    state.advance();
  }
  return state.pos !== start2;
};
function isDecimalDigit(ch) {
  return ch >= 48 && ch <= 57;
}
__name(isDecimalDigit, "isDecimalDigit");
pp$1.regexp_eatHexDigits = function(state) {
  var start2 = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isHexDigit(ch = state.current())) {
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return state.pos !== start2;
};
function isHexDigit(ch) {
  return ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102;
}
__name(isHexDigit, "isHexDigit");
function hexToInt(ch) {
  if (ch >= 65 && ch <= 70) {
    return 10 + (ch - 65);
  }
  if (ch >= 97 && ch <= 102) {
    return 10 + (ch - 97);
  }
  return ch - 48;
}
__name(hexToInt, "hexToInt");
pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
  if (this.regexp_eatOctalDigit(state)) {
    var n1 = state.lastIntValue;
    if (this.regexp_eatOctalDigit(state)) {
      var n2 = state.lastIntValue;
      if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
        state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
      } else {
        state.lastIntValue = n1 * 8 + n2;
      }
    } else {
      state.lastIntValue = n1;
    }
    return true;
  }
  return false;
};
pp$1.regexp_eatOctalDigit = function(state) {
  var ch = state.current();
  if (isOctalDigit(ch)) {
    state.lastIntValue = ch - 48;
    state.advance();
    return true;
  }
  state.lastIntValue = 0;
  return false;
};
function isOctalDigit(ch) {
  return ch >= 48 && ch <= 55;
}
__name(isOctalDigit, "isOctalDigit");
pp$1.regexp_eatFixedHexDigits = function(state, length) {
  var start2 = state.pos;
  state.lastIntValue = 0;
  for (var i2 = 0; i2 < length; ++i2) {
    var ch = state.current();
    if (!isHexDigit(ch)) {
      state.pos = start2;
      return false;
    }
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return true;
};
var Token = /* @__PURE__ */ __name(function Token2(p) {
  this.type = p.type;
  this.value = p.value;
  this.start = p.start;
  this.end = p.end;
  if (p.options.locations) {
    this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
  }
  if (p.options.ranges) {
    this.range = [
      p.start,
      p.end
    ];
  }
}, "Token");
var pp = Parser.prototype;
pp.next = function(ignoreEscapeSequenceInKeyword) {
  if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword);
  }
  if (this.options.onToken) {
    this.options.onToken(new Token(this));
  }
  this.lastTokEnd = this.end;
  this.lastTokStart = this.start;
  this.lastTokEndLoc = this.endLoc;
  this.lastTokStartLoc = this.startLoc;
  this.nextToken();
};
pp.getToken = function() {
  this.next();
  return new Token(this);
};
if (typeof Symbol !== "undefined") {
  pp[Symbol.iterator] = function() {
    var this$1$1 = this;
    return {
      next: /* @__PURE__ */ __name(function() {
        var token = this$1$1.getToken();
        return {
          done: token.type === types$1.eof,
          value: token
        };
      }, "next")
    };
  };
}
pp.nextToken = function() {
  var curContext = this.curContext();
  if (!curContext || !curContext.preserveSpace) {
    this.skipSpace();
  }
  this.start = this.pos;
  if (this.options.locations) {
    this.startLoc = this.curPosition();
  }
  if (this.pos >= this.input.length) {
    return this.finishToken(types$1.eof);
  }
  if (curContext.override) {
    return curContext.override(this);
  } else {
    this.readToken(this.fullCharCodeAtPos());
  }
};
pp.readToken = function(code2) {
  if (isIdentifierStart(code2, this.options.ecmaVersion >= 6) || code2 === 92) {
    return this.readWord();
  }
  return this.getTokenFromCode(code2);
};
pp.fullCharCodeAtPos = function() {
  var code2 = this.input.charCodeAt(this.pos);
  if (code2 <= 55295 || code2 >= 56320) {
    return code2;
  }
  var next2 = this.input.charCodeAt(this.pos + 1);
  return next2 <= 56319 || next2 >= 57344 ? code2 : (code2 << 10) + next2 - 56613888;
};
pp.skipBlockComment = function() {
  var startLoc = this.options.onComment && this.curPosition();
  var start2 = this.pos, end = this.input.indexOf("*/", this.pos += 2);
  if (end === -1) {
    this.raise(this.pos - 2, "Unterminated comment");
  }
  this.pos = end + 2;
  if (this.options.locations) {
    for (var nextBreak = void 0, pos = start2; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1; ) {
      ++this.curLine;
      pos = this.lineStart = nextBreak;
    }
  }
  if (this.options.onComment) {
    this.options.onComment(true, this.input.slice(start2 + 2, end), start2, this.pos, startLoc, this.curPosition());
  }
};
pp.skipLineComment = function(startSkip) {
  var start2 = this.pos;
  var startLoc = this.options.onComment && this.curPosition();
  var ch = this.input.charCodeAt(this.pos += startSkip);
  while (this.pos < this.input.length && !isNewLine(ch)) {
    ch = this.input.charCodeAt(++this.pos);
  }
  if (this.options.onComment) {
    this.options.onComment(false, this.input.slice(start2 + startSkip, this.pos), start2, this.pos, startLoc, this.curPosition());
  }
};
pp.skipSpace = function() {
  loop: while (this.pos < this.input.length) {
    var ch = this.input.charCodeAt(this.pos);
    switch (ch) {
      case 32:
      case 160:
        ++this.pos;
        break;
      case 13:
        if (this.input.charCodeAt(this.pos + 1) === 10) {
          ++this.pos;
        }
      case 10:
      case 8232:
      case 8233:
        ++this.pos;
        if (this.options.locations) {
          ++this.curLine;
          this.lineStart = this.pos;
        }
        break;
      case 47:
        switch (this.input.charCodeAt(this.pos + 1)) {
          case 42:
            this.skipBlockComment();
            break;
          case 47:
            this.skipLineComment(2);
            break;
          default:
            break loop;
        }
        break;
      default:
        if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
          ++this.pos;
        } else {
          break loop;
        }
    }
  }
};
pp.finishToken = function(type, val) {
  this.end = this.pos;
  if (this.options.locations) {
    this.endLoc = this.curPosition();
  }
  var prevType = this.type;
  this.type = type;
  this.value = val;
  this.updateContext(prevType);
};
pp.readToken_dot = function() {
  var next2 = this.input.charCodeAt(this.pos + 1);
  if (next2 >= 48 && next2 <= 57) {
    return this.readNumber(true);
  }
  var next22 = this.input.charCodeAt(this.pos + 2);
  if (this.options.ecmaVersion >= 6 && next2 === 46 && next22 === 46) {
    this.pos += 3;
    return this.finishToken(types$1.ellipsis);
  } else {
    ++this.pos;
    return this.finishToken(types$1.dot);
  }
};
pp.readToken_slash = function() {
  var next2 = this.input.charCodeAt(this.pos + 1);
  if (this.exprAllowed) {
    ++this.pos;
    return this.readRegexp();
  }
  if (next2 === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.slash, 1);
};
pp.readToken_mult_modulo_exp = function(code2) {
  var next2 = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  var tokentype = code2 === 42 ? types$1.star : types$1.modulo;
  if (this.options.ecmaVersion >= 7 && code2 === 42 && next2 === 42) {
    ++size;
    tokentype = types$1.starstar;
    next2 = this.input.charCodeAt(this.pos + 2);
  }
  if (next2 === 61) {
    return this.finishOp(types$1.assign, size + 1);
  }
  return this.finishOp(tokentype, size);
};
pp.readToken_pipe_amp = function(code2) {
  var next2 = this.input.charCodeAt(this.pos + 1);
  if (next2 === code2) {
    if (this.options.ecmaVersion >= 12) {
      var next22 = this.input.charCodeAt(this.pos + 2);
      if (next22 === 61) {
        return this.finishOp(types$1.assign, 3);
      }
    }
    return this.finishOp(code2 === 124 ? types$1.logicalOR : types$1.logicalAND, 2);
  }
  if (next2 === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(code2 === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1);
};
pp.readToken_caret = function() {
  var next2 = this.input.charCodeAt(this.pos + 1);
  if (next2 === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.bitwiseXOR, 1);
};
pp.readToken_plus_min = function(code2) {
  var next2 = this.input.charCodeAt(this.pos + 1);
  if (next2 === code2) {
    if (next2 === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
      this.skipLineComment(3);
      this.skipSpace();
      return this.nextToken();
    }
    return this.finishOp(types$1.incDec, 2);
  }
  if (next2 === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.plusMin, 1);
};
pp.readToken_lt_gt = function(code2) {
  var next2 = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  if (next2 === code2) {
    size = code2 === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
    if (this.input.charCodeAt(this.pos + size) === 61) {
      return this.finishOp(types$1.assign, size + 1);
    }
    return this.finishOp(types$1.bitShift, size);
  }
  if (next2 === 33 && code2 === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45) {
    this.skipLineComment(4);
    this.skipSpace();
    return this.nextToken();
  }
  if (next2 === 61) {
    size = 2;
  }
  return this.finishOp(types$1.relational, size);
};
pp.readToken_eq_excl = function(code2) {
  var next2 = this.input.charCodeAt(this.pos + 1);
  if (next2 === 61) {
    return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
  }
  if (code2 === 61 && next2 === 62 && this.options.ecmaVersion >= 6) {
    this.pos += 2;
    return this.finishToken(types$1.arrow);
  }
  return this.finishOp(code2 === 61 ? types$1.eq : types$1.prefix, 1);
};
pp.readToken_question = function() {
  var ecmaVersion2 = this.options.ecmaVersion;
  if (ecmaVersion2 >= 11) {
    var next2 = this.input.charCodeAt(this.pos + 1);
    if (next2 === 46) {
      var next22 = this.input.charCodeAt(this.pos + 2);
      if (next22 < 48 || next22 > 57) {
        return this.finishOp(types$1.questionDot, 2);
      }
    }
    if (next2 === 63) {
      if (ecmaVersion2 >= 12) {
        var next2$1 = this.input.charCodeAt(this.pos + 2);
        if (next2$1 === 61) {
          return this.finishOp(types$1.assign, 3);
        }
      }
      return this.finishOp(types$1.coalesce, 2);
    }
  }
  return this.finishOp(types$1.question, 1);
};
pp.readToken_numberSign = function() {
  var ecmaVersion2 = this.options.ecmaVersion;
  var code2 = 35;
  if (ecmaVersion2 >= 13) {
    ++this.pos;
    code2 = this.fullCharCodeAtPos();
    if (isIdentifierStart(code2, true) || code2 === 92) {
      return this.finishToken(types$1.privateId, this.readWord1());
    }
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(code2) + "'");
};
pp.getTokenFromCode = function(code2) {
  switch (code2) {
    // The interpretation of a dot depends on whether it is followed
    // by a digit or another two dots.
    case 46:
      return this.readToken_dot();
    // Punctuation tokens.
    case 40:
      ++this.pos;
      return this.finishToken(types$1.parenL);
    case 41:
      ++this.pos;
      return this.finishToken(types$1.parenR);
    case 59:
      ++this.pos;
      return this.finishToken(types$1.semi);
    case 44:
      ++this.pos;
      return this.finishToken(types$1.comma);
    case 91:
      ++this.pos;
      return this.finishToken(types$1.bracketL);
    case 93:
      ++this.pos;
      return this.finishToken(types$1.bracketR);
    case 123:
      ++this.pos;
      return this.finishToken(types$1.braceL);
    case 125:
      ++this.pos;
      return this.finishToken(types$1.braceR);
    case 58:
      ++this.pos;
      return this.finishToken(types$1.colon);
    case 96:
      if (this.options.ecmaVersion < 6) {
        break;
      }
      ++this.pos;
      return this.finishToken(types$1.backQuote);
    case 48:
      var next2 = this.input.charCodeAt(this.pos + 1);
      if (next2 === 120 || next2 === 88) {
        return this.readRadixNumber(16);
      }
      if (this.options.ecmaVersion >= 6) {
        if (next2 === 111 || next2 === 79) {
          return this.readRadixNumber(8);
        }
        if (next2 === 98 || next2 === 66) {
          return this.readRadixNumber(2);
        }
      }
    // Anything else beginning with a digit is an integer, octal
    // number, or float.
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return this.readNumber(false);
    // Quotes produce strings.
    case 34:
    case 39:
      return this.readString(code2);
    // Operators are parsed inline in tiny state machines. '=' (61) is
    // often referred to. `finishOp` simply skips the amount of
    // characters it is given as second argument, and returns a token
    // of the type given by its first argument.
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(code2);
    case 124:
    case 38:
      return this.readToken_pipe_amp(code2);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(code2);
    case 60:
    case 62:
      return this.readToken_lt_gt(code2);
    case 61:
    case 33:
      return this.readToken_eq_excl(code2);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(types$1.prefix, 1);
    case 35:
      return this.readToken_numberSign();
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(code2) + "'");
};
pp.finishOp = function(type, size) {
  var str = this.input.slice(this.pos, this.pos + size);
  this.pos += size;
  return this.finishToken(type, str);
};
pp.readRegexp = function() {
  var escaped, inClass, start2 = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(start2, "Unterminated regular expression");
    }
    var ch = this.input.charAt(this.pos);
    if (lineBreak.test(ch)) {
      this.raise(start2, "Unterminated regular expression");
    }
    if (!escaped) {
      if (ch === "[") {
        inClass = true;
      } else if (ch === "]" && inClass) {
        inClass = false;
      } else if (ch === "/" && !inClass) {
        break;
      }
      escaped = ch === "\\";
    } else {
      escaped = false;
    }
    ++this.pos;
  }
  var pattern = this.input.slice(start2, this.pos);
  ++this.pos;
  var flagsStart = this.pos;
  var flags = this.readWord1();
  if (this.containsEsc) {
    this.unexpected(flagsStart);
  }
  var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
  state.reset(start2, pattern, flags);
  this.validateRegExpFlags(state);
  this.validateRegExpPattern(state);
  var value = null;
  try {
    value = new RegExp(pattern, flags);
  } catch (e) {
  }
  return this.finishToken(types$1.regexp, {
    pattern,
    flags,
    value
  });
};
pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
  var allowSeparators = this.options.ecmaVersion >= 12 && len === void 0;
  var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;
  var start2 = this.pos, total = 0, lastCode = 0;
  for (var i2 = 0, e = len == null ? Infinity : len; i2 < e; ++i2, ++this.pos) {
    var code2 = this.input.charCodeAt(this.pos), val = void 0;
    if (allowSeparators && code2 === 95) {
      if (isLegacyOctalNumericLiteral) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals");
      }
      if (lastCode === 95) {
        this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore");
      }
      if (i2 === 0) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits");
      }
      lastCode = code2;
      continue;
    }
    if (code2 >= 97) {
      val = code2 - 97 + 10;
    } else if (code2 >= 65) {
      val = code2 - 65 + 10;
    } else if (code2 >= 48 && code2 <= 57) {
      val = code2 - 48;
    } else {
      val = Infinity;
    }
    if (val >= radix) {
      break;
    }
    lastCode = code2;
    total = total * radix + val;
  }
  if (allowSeparators && lastCode === 95) {
    this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits");
  }
  if (this.pos === start2 || len != null && this.pos - start2 !== len) {
    return null;
  }
  return total;
};
function stringToNumber(str, isLegacyOctalNumericLiteral) {
  if (isLegacyOctalNumericLiteral) {
    return parseInt(str, 8);
  }
  return parseFloat(str.replace(/_/g, ""));
}
__name(stringToNumber, "stringToNumber");
function stringToBigInt(str) {
  if (typeof BigInt !== "function") {
    return null;
  }
  return BigInt(str.replace(/_/g, ""));
}
__name(stringToBigInt, "stringToBigInt");
pp.readRadixNumber = function(radix) {
  var start2 = this.pos;
  this.pos += 2;
  var val = this.readInt(radix);
  if (val == null) {
    this.raise(this.start + 2, "Expected number in radix " + radix);
  }
  if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
    val = stringToBigInt(this.input.slice(start2, this.pos));
    ++this.pos;
  } else if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  return this.finishToken(types$1.num, val);
};
pp.readNumber = function(startsWithDot) {
  var start2 = this.pos;
  if (!startsWithDot && this.readInt(10, void 0, true) === null) {
    this.raise(start2, "Invalid number");
  }
  var octal = this.pos - start2 >= 2 && this.input.charCodeAt(start2) === 48;
  if (octal && this.strict) {
    this.raise(start2, "Invalid number");
  }
  var next2 = this.input.charCodeAt(this.pos);
  if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next2 === 110) {
    var val$1 = stringToBigInt(this.input.slice(start2, this.pos));
    ++this.pos;
    if (isIdentifierStart(this.fullCharCodeAtPos())) {
      this.raise(this.pos, "Identifier directly after number");
    }
    return this.finishToken(types$1.num, val$1);
  }
  if (octal && /[89]/.test(this.input.slice(start2, this.pos))) {
    octal = false;
  }
  if (next2 === 46 && !octal) {
    ++this.pos;
    this.readInt(10);
    next2 = this.input.charCodeAt(this.pos);
  }
  if ((next2 === 69 || next2 === 101) && !octal) {
    next2 = this.input.charCodeAt(++this.pos);
    if (next2 === 43 || next2 === 45) {
      ++this.pos;
    }
    if (this.readInt(10) === null) {
      this.raise(start2, "Invalid number");
    }
  }
  if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  var val = stringToNumber(this.input.slice(start2, this.pos), octal);
  return this.finishToken(types$1.num, val);
};
pp.readCodePoint = function() {
  var ch = this.input.charCodeAt(this.pos), code2;
  if (ch === 123) {
    if (this.options.ecmaVersion < 6) {
      this.unexpected();
    }
    var codePos = ++this.pos;
    code2 = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
    ++this.pos;
    if (code2 > 1114111) {
      this.invalidStringToken(codePos, "Code point out of bounds");
    }
  } else {
    code2 = this.readHexChar(4);
  }
  return code2;
};
pp.readString = function(quote) {
  var out = "", chunkStart = ++this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated string constant");
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === quote) {
      break;
    }
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(false);
      chunkStart = this.pos;
    } else if (ch === 8232 || ch === 8233) {
      if (this.options.ecmaVersion < 10) {
        this.raise(this.start, "Unterminated string constant");
      }
      ++this.pos;
      if (this.options.locations) {
        this.curLine++;
        this.lineStart = this.pos;
      }
    } else {
      if (isNewLine(ch)) {
        this.raise(this.start, "Unterminated string constant");
      }
      ++this.pos;
    }
  }
  out += this.input.slice(chunkStart, this.pos++);
  return this.finishToken(types$1.string, out);
};
var INVALID_TEMPLATE_ESCAPE_ERROR = {};
pp.tryReadTemplateToken = function() {
  this.inTemplateElement = true;
  try {
    this.readTmplToken();
  } catch (err) {
    if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
      this.readInvalidTemplateToken();
    } else {
      throw err;
    }
  }
  this.inTemplateElement = false;
};
pp.invalidStringToken = function(position, message) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
    throw INVALID_TEMPLATE_ESCAPE_ERROR;
  } else {
    this.raise(position, message);
  }
};
pp.readTmplToken = function() {
  var out = "", chunkStart = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated template");
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
      if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) {
        if (ch === 36) {
          this.pos += 2;
          return this.finishToken(types$1.dollarBraceL);
        } else {
          ++this.pos;
          return this.finishToken(types$1.backQuote);
        }
      }
      out += this.input.slice(chunkStart, this.pos);
      return this.finishToken(types$1.template, out);
    }
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(true);
      chunkStart = this.pos;
    } else if (isNewLine(ch)) {
      out += this.input.slice(chunkStart, this.pos);
      ++this.pos;
      switch (ch) {
        case 13:
          if (this.input.charCodeAt(this.pos) === 10) {
            ++this.pos;
          }
        case 10:
          out += "\n";
          break;
        default:
          out += String.fromCharCode(ch);
          break;
      }
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      chunkStart = this.pos;
    } else {
      ++this.pos;
    }
  }
};
pp.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++) {
    switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break;
      case "$":
        if (this.input[this.pos + 1] !== "{") {
          break;
        }
      // fall through
      case "`":
        return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
      case "\r":
        if (this.input[this.pos + 1] === "\n") {
          ++this.pos;
        }
      // fall through
      case "\n":
      case "\u2028":
      case "\u2029":
        ++this.curLine;
        this.lineStart = this.pos + 1;
        break;
    }
  }
  this.raise(this.start, "Unterminated template");
};
pp.readEscapedChar = function(inTemplate) {
  var ch = this.input.charCodeAt(++this.pos);
  ++this.pos;
  switch (ch) {
    case 110:
      return "\n";
    case 114:
      return "\r";
    case 120:
      return String.fromCharCode(this.readHexChar(2));
    case 117:
      return codePointToString(this.readCodePoint());
    case 116:
      return "	";
    case 98:
      return "\b";
    case 118:
      return "\v";
    case 102:
      return "\f";
    case 13:
      if (this.input.charCodeAt(this.pos) === 10) {
        ++this.pos;
      }
    // '\r\n'
    case 10:
      if (this.options.locations) {
        this.lineStart = this.pos;
        ++this.curLine;
      }
      return "";
    case 56:
    case 57:
      if (this.strict) {
        this.invalidStringToken(this.pos - 1, "Invalid escape sequence");
      }
      if (inTemplate) {
        var codePos = this.pos - 1;
        this.invalidStringToken(codePos, "Invalid escape sequence in template string");
      }
    default:
      if (ch >= 48 && ch <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        this.pos += octalStr.length - 1;
        ch = this.input.charCodeAt(this.pos);
        if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
          this.invalidStringToken(this.pos - 1 - octalStr.length, inTemplate ? "Octal literal in template string" : "Octal literal in strict mode");
        }
        return String.fromCharCode(octal);
      }
      if (isNewLine(ch)) {
        if (this.options.locations) {
          this.lineStart = this.pos;
          ++this.curLine;
        }
        return "";
      }
      return String.fromCharCode(ch);
  }
};
pp.readHexChar = function(len) {
  var codePos = this.pos;
  var n = this.readInt(16, len);
  if (n === null) {
    this.invalidStringToken(codePos, "Bad character escape sequence");
  }
  return n;
};
pp.readWord1 = function() {
  this.containsEsc = false;
  var word = "", first = true, chunkStart = this.pos;
  var astral = this.options.ecmaVersion >= 6;
  while (this.pos < this.input.length) {
    var ch = this.fullCharCodeAtPos();
    if (isIdentifierChar(ch, astral)) {
      this.pos += ch <= 65535 ? 1 : 2;
    } else if (ch === 92) {
      this.containsEsc = true;
      word += this.input.slice(chunkStart, this.pos);
      var escStart = this.pos;
      if (this.input.charCodeAt(++this.pos) !== 117) {
        this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX");
      }
      ++this.pos;
      var esc = this.readCodePoint();
      if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral)) {
        this.invalidStringToken(escStart, "Invalid Unicode escape");
      }
      word += codePointToString(esc);
      chunkStart = this.pos;
    } else {
      break;
    }
    first = false;
  }
  return word + this.input.slice(chunkStart, this.pos);
};
pp.readWord = function() {
  var word = this.readWord1();
  var type = types$1.name;
  if (this.keywords.test(word)) {
    type = keywords[word];
  }
  return this.finishToken(type, word);
};
var version2 = "8.15.0";
Parser.acorn = {
  Parser,
  version: version2,
  defaultOptions,
  Position,
  SourceLocation,
  getLineInfo,
  Node,
  TokenType,
  tokTypes: types$1,
  keywordTypes: keywords,
  TokContext,
  tokContexts: types3,
  isIdentifierChar,
  isIdentifierStart,
  Token,
  isNewLine,
  lineBreak,
  lineBreakG,
  nonASCIIwhitespace
};
function parse4(input, options) {
  return Parser.parse(input, options);
}
__name(parse4, "parse");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/dynamic-workflow.js
function dynamicStartRefusal(message, options) {
  return Object.assign(new WorkflowRuntimeError(message, options), {
    fatal: true
  });
}
__name(dynamicStartRefusal, "dynamicStartRefusal");
function dynamicStartRefusalFrom(error) {
  return dynamicStartRefusal(error instanceof Error ? error.message : String(error), {
    cause: error
  });
}
__name(dynamicStartRefusalFrom, "dynamicStartRefusalFrom");
var DYNAMIC_WORKFLOW_SOURCE_MAX_BYTES = 128 * 1024;
var DYNAMIC_WORKFLOW_CODE_INLINE_MAX_BYTES = 24 * 1024;
var SAFE_DYNAMIC_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
var DYNAMIC_WORKFLOW_EXPORT_NAME_MAX_LENGTH = 64;
var SAFE_DYNAMIC_EXPORT_NAME = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
var UNSUPPORTED_DYNAMIC_MODULE_SYNTAX = /^[ \t]*(?:import(?:\s+[\w$]|\s*(?:[*{(]|['"]))|export(?:\s+(?:async\s+)?(?:function|const|let|var|class|default)\b|\s*[{*]))/m;
function assertDynamicWorkflowIdentifier(kind, value) {
  if (!SAFE_DYNAMIC_IDENTIFIER.test(value)) {
    throw dynamicStartRefusal(`Invalid dynamic workflow ${kind} ${JSON.stringify(value)}. Use a valid JavaScript identifier: letters, digits, "_" and "$", not starting with a digit.`);
  }
}
__name(assertDynamicWorkflowIdentifier, "assertDynamicWorkflowIdentifier");
function stableJsonStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableJsonStringify).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, val]) => `${JSON.stringify(key)}:${stableJsonStringify(val)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
__name(stableJsonStringify, "stableJsonStringify");
async function sha256Hex(input) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
__name(sha256Hex, "sha256Hex");
var DYNAMIC_WORKFLOW_ECMA_VERSION = 2024;
function parseDynamicWorkflowSource(source, exportName) {
  try {
    return parse4(source, {
      ecmaVersion: DYNAMIC_WORKFLOW_ECMA_VERSION,
      sourceType: "script"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw dynamicStartRefusal(`Dynamic workflow source is not valid JavaScript: ${message}. The source is evaluated as-is, so it cannot contain TypeScript syntax or module declarations. If the error is at an \`await\`, declare the function as \`async function ${exportName}(...)\`.`);
  }
}
__name(parseDynamicWorkflowSource, "parseDynamicWorkflowSource");
function assertGeneratedWorkflowCodeParses(workflowCode) {
  try {
    parse4(workflowCode, {
      ecmaVersion: DYNAMIC_WORKFLOW_ECMA_VERSION,
      sourceType: "script"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw dynamicStartRefusal(`Generated dynamic workflow code is not valid JavaScript: ${message}.`);
  }
}
__name(assertGeneratedWorkflowCodeParses, "assertGeneratedWorkflowCodeParses");
function validateDynamicWorkflowSource(source, exportName) {
  const byteLength = new TextEncoder().encode(source).byteLength;
  if (byteLength > DYNAMIC_WORKFLOW_SOURCE_MAX_BYTES) {
    throw dynamicStartRefusal(`Dynamic workflow source is ${byteLength} bytes, over the ${DYNAMIC_WORKFLOW_SOURCE_MAX_BYTES}-byte limit.`);
  }
  if (UNSUPPORTED_DYNAMIC_MODULE_SYNTAX.test(source)) {
    throw dynamicStartRefusal("Dynamic workflow source cannot use `import` or `export`. Reach registered steps through the injected `steps` object instead.");
  }
  const program = parseDynamicWorkflowSource(source, exportName);
  const declaration = findWorkflowDeclaration(program, exportName);
  const firstStatement = declaration.body.body[0];
  if (firstStatement?.type !== "ExpressionStatement" || firstStatement.directive !== "use workflow") {
    throw dynamicStartRefusal(`Dynamic workflow function ${JSON.stringify(exportName)} must open with a "use workflow" directive.`);
  }
  if (hasDirective(program, "use step")) {
    throw dynamicStartRefusal('Dynamic workflow source cannot declare "use step" functions. Register the step with the deployment and expose it through `experimental_dynamic.steps` instead.');
  }
}
__name(validateDynamicWorkflowSource, "validateDynamicWorkflowSource");
function findWorkflowDeclaration(program, exportName) {
  const expected = `Dynamic workflow source must declare \`async function ${exportName}(...)\` at top level`;
  const declarations = program.body.filter((node) => node.type === "FunctionDeclaration" && node.id.name === exportName);
  const [declaration] = declarations;
  let problem = "";
  if (declarations.length > 1) {
    problem = ` exactly once, but declares \`function ${exportName}\` ${declarations.length} times`;
  } else if (declaration?.generator) {
    problem = `, but \`${exportName}\` is a generator function`;
  } else if (declaration && !declaration.async) {
    problem = `, but \`${exportName}\` is not async`;
  }
  if (!declaration || problem) {
    throw dynamicStartRefusal(`${expected}${problem}.`);
  }
  return declaration;
}
__name(findWorkflowDeclaration, "findWorkflowDeclaration");
function hasDirective(program, directive) {
  const pending = [
    program
  ];
  while (pending.length > 0) {
    const node = pending.pop();
    if (node.directive === directive) return true;
    for (const child of childNodes(node)) pending.push(child);
  }
  return false;
}
__name(hasDirective, "hasDirective");
function childNodes(node) {
  const children = [];
  for (const value of Object.values(node)) {
    for (const child of Array.isArray(value) ? value : [
      value
    ]) {
      if (child && typeof child === "object" && "type" in child) {
        children.push(child);
      }
    }
  }
  return children;
}
__name(childNodes, "childNodes");
function resolveStepId(alias, value) {
  const stepId = value && typeof value === "object" || typeof value === "function" ? value.stepId : void 0;
  if (typeof stepId !== "string" || stepId.length === 0) {
    throw dynamicStartRefusal(`Dynamic workflow step ${JSON.stringify(alias)} must be an imported step function or an object with a non-empty \`stepId\`.`);
  }
  return stepId;
}
__name(resolveStepId, "resolveStepId");
function dynamicWorkflowName(metadata) {
  return `workflow//dynamic/${metadata.sourceHash.slice(0, 32)}//${metadata.exportName}`;
}
__name(dynamicWorkflowName, "dynamicWorkflowName");
async function compileDynamicWorkflow(source, options) {
  const exportName = options.exportName ?? "workflow";
  if (exportName.length > DYNAMIC_WORKFLOW_EXPORT_NAME_MAX_LENGTH) {
    throw dynamicStartRefusal(`Dynamic workflow exportName is ${exportName.length} characters, over the ${DYNAMIC_WORKFLOW_EXPORT_NAME_MAX_LENGTH}-character limit. It becomes part of the workflow id and queue name.`);
  }
  assertDynamicWorkflowIdentifier("exportName", exportName);
  if (!SAFE_DYNAMIC_EXPORT_NAME.test(exportName)) {
    throw dynamicStartRefusal(`Invalid dynamic workflow exportName ${JSON.stringify(exportName)}. Use letters, digits, and "_", not starting with a digit; "$" cannot appear in workflow queue names.`);
  }
  validateDynamicWorkflowSource(source, exportName);
  if (!options.steps || Object.keys(options.steps).length === 0) {
    throw dynamicStartRefusal("Dynamic workflow options must expose at least one registered step through `experimental_dynamic.steps`.");
  }
  const stepEntries = Object.entries(options.steps).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([alias, value]) => {
    assertDynamicWorkflowIdentifier("step alias", alias);
    return [
      alias,
      resolveStepId(alias, value)
    ];
  });
  const steps = Object.fromEntries(stepEntries);
  const sourceHash = await sha256Hex(`${source}
${stableJsonStringify(steps)}`);
  const workflowName = dynamicWorkflowName({
    sourceHash,
    exportName
  });
  const stepBindings = stepEntries.map(([alias, stepId]) => `  [${JSON.stringify(alias)}]: __dynamicUseStep(${JSON.stringify(stepId)})`).join(",\n");
  const workflowCode = `const __dynamicGlobalThis = globalThis;
__dynamicGlobalThis.__private_workflows ??= new Map();
const __dynamicUseStep = __dynamicGlobalThis[Symbol.for("WORKFLOW_USE_STEP")];
if (typeof __dynamicUseStep !== "function") {
  throw new Error("Dynamic workflows require a workflow VM that provides WORKFLOW_USE_STEP.");
}
const __dynamicSteps = Object.freeze({
${stepBindings}
});
const __dynamicSleep = __dynamicGlobalThis[Symbol.for("WORKFLOW_SLEEP")];
const __dynamicCreateHook = __dynamicGlobalThis[Symbol.for("WORKFLOW_CREATE_HOOK")];
const __dynamicWorkflow = ((steps, sleep, createHook) => (() => {
${source}
return ${exportName};
})())(__dynamicSteps, __dynamicSleep, __dynamicCreateHook);
Object.defineProperty(__dynamicWorkflow, "workflowId", {
  value: ${JSON.stringify(workflowName)},
  writable: false,
  enumerable: false,
  configurable: false
});
__dynamicGlobalThis.__private_workflows.set(${JSON.stringify(workflowName)}, __dynamicWorkflow);
`;
  assertGeneratedWorkflowCodeParses(workflowCode);
  return {
    workflowName,
    workflowCode,
    metadata: {
      version: 1,
      sourceHash,
      exportName,
      steps
    }
  };
}
__name(compileDynamicWorkflow, "compileDynamicWorkflow");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/runs.js
init_helpers();
init_run_spec_version();

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/start.js
init_dist2();
init_dist();
init_parse_name();
init_dist3();
init_node();
init_capabilities();

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/classify-error.js
init_dist2();
var WORLD_CONTRACT_ERROR_CODES = /* @__PURE__ */ new Set([
  "PARSE_ERROR",
  "SCHEMA_VALIDATION",
  RUN_ERROR_CODES.WORLD_CONTRACT_ERROR
]);
var RETRYABLE_WORLD_ERROR_CODES = /* @__PURE__ */ new Set([
  "TRANSPORT",
  "TIMEOUT",
  RUN_ERROR_CODES.STREAM_ERROR
]);
var RUNTIME_ERROR_CHECKS = [
  WorkflowRuntimeError.is,
  StepNotRegisteredError.is,
  WorkflowNotRegisteredError.is,
  // SDK-level encryption failures (most notably AES-GCM auth-tag
  // mismatches surfacing as a native `OperationError` from
  // `AESCipherJob.onDone`) are wrapped in `RuntimeDecryptionError` at
  // the encryption module boundary.
  RuntimeDecryptionError.is
];
function isRetryableWorldError(err) {
  if (ThrottleError.is(err)) {
    return true;
  }
  if (StreamError.is(err)) {
    return err.status === void 0 || err.status >= 500;
  }
  if (!WorkflowWorldError.is(err)) {
    return false;
  }
  if (err.status !== void 0 && err.status >= 500) {
    return true;
  }
  return err.code !== void 0 && RETRYABLE_WORLD_ERROR_CODES.has(err.code);
}
__name(isRetryableWorldError, "isRetryableWorldError");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/start.js
init_encryption();
init_logger();
init_sealed_box();
init_serialization2();
init_context_storage();
init_semantic_conventions();
init_telemetry();
init_version();
init_constants2();
init_get_world_lazy();
init_helpers();

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/vm-mode.js
init_dist2();
var WORKFLOW_VMS = [
  "node",
  "quickjs"
];
function getWorkflowVmFromEnv(env = process.env) {
  const raw = env.WORKFLOW_VM;
  if (raw === void 0 || raw === "") return void 0;
  if (WORKFLOW_VMS.includes(raw)) {
    return raw;
  }
  throw new WorkflowRuntimeError(`Invalid WORKFLOW_VM value: "${raw}". Expected one of: ${WORKFLOW_VMS.join(", ")}.`);
}
__name(getWorkflowVmFromEnv, "getWorkflowVmFromEnv");
var DEFAULT_QUICKJS_SNAPSHOT_THRESHOLD = 1e3;
function getSnapshotThresholdFromEnv(env = process.env) {
  const raw = env.WORKFLOW_SNAPSHOT_THRESHOLD;
  if (raw === void 0 || raw === "") return void 0;
  const parsed = /^\d+$/.test(raw) ? Number(raw) : Number.NaN;
  if (!Number.isSafeInteger(parsed)) {
    throw new WorkflowRuntimeError(`Invalid WORKFLOW_SNAPSHOT_THRESHOLD value: "${raw}". Expected a non-negative integer (0 disables snapshotting).`);
  }
  return parsed;
}
__name(getSnapshotThresholdFromEnv, "getSnapshotThresholdFromEnv");
function getSnapshotThresholdForStart(workflowVm, env = process.env) {
  const fromEnv = getSnapshotThresholdFromEnv(env);
  if (fromEnv !== void 0) return fromEnv;
  return workflowVm === "quickjs" ? DEFAULT_QUICKJS_SNAPSHOT_THRESHOLD : void 0;
}
__name(getSnapshotThresholdForStart, "getSnapshotThresholdForStart");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/start.js
init_wait_until();
init_world_compatibility();
var CROSS_DEPLOYMENT_CAPABILITY_PROBE_TIMEOUT_MS = 1e4;
var CROSS_DEPLOYMENT_PROBE_RETRY_TIMEOUT_MS = 2e3;
var CROSS_DEPLOYMENT_PROBE_CACHE_TTL_MS = 10 * 6e4;
var CROSS_DEPLOYMENT_PROBE_MISS_TTL_MS = 6e4;
var CROSS_DEPLOYMENT_PROBE_CACHE_MAX_ENTRIES = 256;
var RETENTION_ZERO_ATTRIBUTE_VALUE = "0";
function resolveCrossDeploymentSpecVersion(probe, callerSpecVersion) {
  let target;
  let source;
  if (typeof probe?.specVersion === "number" && Number.isInteger(probe.specVersion) && probe.specVersion >= 1) {
    target = probe.specVersion;
    source = "probe";
  } else if (probe?.format === "json") {
    target = SPEC_VERSION_SUPPORTS_CBOR_QUEUE_TRANSPORT;
    source = "probe-malformed";
  } else if (probe?.healthy) {
    target = SPEC_VERSION_SUPPORTS_EVENT_SOURCING;
    source = "probe-unversioned";
  } else {
    target = SPEC_VERSION_SUPPORTS_SLOT_IDENTITY;
    source = probe ? "probe-miss" : "no-probe-channel";
  }
  return {
    specVersion: Math.min(target, callerSpecVersion),
    source
  };
}
__name(resolveCrossDeploymentSpecVersion, "resolveCrossDeploymentSpecVersion");
var ulid = monotonicFactory();
function resolveLineageAttributes() {
  const store = contextStorage.getStore();
  const parentRunId = store?.workflowMetadata?.workflowRunId;
  if (!parentRunId) return void 0;
  return {
    [ROOT_RUN_ID_ATTRIBUTE]: store.rootRunId ?? parentRunId,
    [PARENT_RUN_ID_ATTRIBUTE]: parentRunId
  };
}
__name(resolveLineageAttributes, "resolveLineageAttributes");
var latestNoOpWarning = globalSingleton("@workflow/core//latestNoOpWarning", 1, () => ({
  warned: false
}));
var probeMissWarning = globalSingleton("@workflow/core//crossDeploymentProbeMissWarning", 1, () => ({
  warned: false
}));
var crossDeploymentProbeCache = globalSingleton("@workflow/core//crossDeploymentProbeCache", 1, () => /* @__PURE__ */ new WeakMap());
async function probeCrossDeployment(world, options) {
  let byDeployment = crossDeploymentProbeCache.get(world);
  if (!byDeployment) {
    byDeployment = /* @__PURE__ */ new Map();
    crossDeploymentProbeCache.set(world, byDeployment);
  }
  const key = `${options.namespace ?? ""}\0${options.deploymentId}`;
  const now = Date.now();
  const entry = byDeployment.get(key);
  if (entry?.probe !== void 0 && now - entry.at < CROSS_DEPLOYMENT_PROBE_CACHE_TTL_MS) {
    return {
      probe: entry.probe,
      cached: true
    };
  }
  const recentMiss = entry !== void 0 && entry.probe === void 0 && now - entry.at < CROSS_DEPLOYMENT_PROBE_MISS_TTL_MS;
  const probe = await healthCheck(world, {
    deploymentId: options.deploymentId,
    runId: options.runId,
    timeout: recentMiss ? CROSS_DEPLOYMENT_PROBE_RETRY_TIMEOUT_MS : CROSS_DEPLOYMENT_CAPABILITY_PROBE_TIMEOUT_MS,
    namespace: options.namespace
  }).catch(() => void 0);
  const answered = probe?.format !== void 0;
  byDeployment.delete(key);
  byDeployment.set(key, {
    // A repeated miss keeps the first miss's time, so the short budget ends
    // `CROSS_DEPLOYMENT_PROBE_MISS_TTL_MS` after it.
    at: !answered && recentMiss ? entry.at : Date.now(),
    // The run public key is per run, so it is never reused.
    probe: answered ? {
      ...probe,
      encryptionPublicKey: void 0
    } : void 0
  });
  if (byDeployment.size > CROSS_DEPLOYMENT_PROBE_CACHE_MAX_ENTRIES) {
    const oldest = byDeployment.keys().next().value;
    if (oldest !== void 0) byDeployment.delete(oldest);
  }
  return {
    probe,
    cached: false
  };
}
__name(probeCrossDeployment, "probeCrossDeployment");
function assertDynamicWorkflowsEnabled() {
  if (!isDynamicWorkflowsEnabled()) {
    throw dynamicStartRefusal(`Dynamic workflows are disabled on this deployment, so no run was created. Set ${DYNAMIC_WORKFLOWS_ENV}=1 on the deployment to enable them.`);
  }
}
__name(assertDynamicWorkflowsEnabled, "assertDynamicWorkflowsEnabled");
async function start(workflow, argsOrOptions, options) {
  return await waitedUntil(async () => {
    let args = [];
    let opts = options ?? {};
    if (Array.isArray(argsOrOptions)) {
      args = argsOrOptions;
    } else if (typeof argsOrOptions === "object" && argsOrOptions !== null) {
      opts = argsOrOptions;
    }
    let dynamicWorkflow;
    let workflowName;
    if (typeof workflow === "string") {
      const dynamicOptions = opts.experimental_dynamic;
      if (!dynamicOptions) {
        throw dynamicStartRefusal("'start' was given workflow source but no `experimental_dynamic` options. Pass `{ experimental_dynamic: { steps } }` to declare which registered steps the source may call.");
      }
      const compiled = await compileDynamicWorkflow(workflow, dynamicOptions);
      assertDynamicWorkflowsEnabled();
      workflowName = compiled.workflowName;
      dynamicWorkflow = {
        code: compiled.workflowCode,
        metadata: compiled.metadata
      };
    } else {
      workflowName = workflow?.workflowId;
    }
    if (!workflowName) {
      throw new WorkflowRuntimeError(`'start' received an invalid workflow function. Ensure the Workflow SDK is configured correctly and the function includes a 'use workflow' directive.`, {
        slug: "start-invalid-workflow-function"
      });
    }
    const queueName = getWorkflowQueueName(workflowName, opts.namespace);
    const spanName = `workflow.start ${workflowDisplayName(workflowName)}`;
    return trace(spanName, async (span) => {
      span?.setAttributes({
        ...WorkflowName(workflowName),
        ...WorkflowOperation("start")
      });
      span?.setAttributes({
        ...WorkflowArgumentsCount(args.length)
      });
      const world = opts.world ?? await getWorldLazy();
      assertWorldSupportsRuntimeProtocol(world);
      let currentDeploymentId;
      let deploymentId;
      if (opts.deploymentId === void 0 || opts.deploymentId === "latest") {
        const current2 = await world.getDeploymentId();
        currentDeploymentId = current2;
        deploymentId = opts.deploymentId ?? current2;
        if (deploymentId === "latest") {
          if (world.resolveLatestDeploymentId) {
            deploymentId = await world.resolveLatestDeploymentId();
          } else {
            if (!latestNoOpWarning.warned) {
              latestNoOpWarning.warned = true;
              runtimeLogger.warn("deploymentId: 'latest' has no effect in this world and was ignored. It is only supported by worlds with atomic deployments, such as Vercel. The run will target the current deployment.", {
                currentDeploymentId
              });
            }
            deploymentId = current2;
          }
        }
      } else {
        deploymentId = opts.deploymentId;
        try {
          currentDeploymentId = await world.getDeploymentId();
        } catch (err) {
          runtimeLogger.debug("Current deployment is unavailable; starting as a cross-deployment run", {
            deploymentId,
            error: String(err)
          });
        }
      }
      const crossDeployment = deploymentId !== currentDeploymentId;
      if (dynamicWorkflow && crossDeployment) {
        const message = `Dynamic workflows can only start on the current deployment. This start targets ${JSON.stringify(deploymentId)} from ${currentDeploymentId === void 0 ? "an unknown current deployment" : JSON.stringify(currentDeploymentId)}, so no run was created.`;
        throw currentDeploymentId === void 0 ? new WorkflowRuntimeError(message) : dynamicStartRefusal(message);
      }
      const runId = `wrun_${world.createRunId ? world.createRunId(opts) : ulid()}`;
      if (dynamicWorkflow && !world.capabilities?.dynamicWorkflowCode) {
        throw dynamicStartRefusal("Dynamic workflows require a World that declares `capabilities.dynamicWorkflowCode`. This World does not, so no run was created.");
      }
      let framedByteStreams;
      let targetCompression;
      let targetNodeVersion;
      let targetHookResumeInputVersion;
      let probedRunPublicKey;
      let targetSpecVersion;
      let specVersionSource;
      if (!crossDeployment) {
        framedByteStreams = true;
        targetCompression = true;
        targetNodeVersion = getCurrentNodeVersion();
        targetHookResumeInputVersion = HOOK_RESUME_INPUT_VERSION;
        targetSpecVersion = world.specVersion;
        specVersionSource = "same-deployment";
      } else if (typeof world.streams?.get !== "function") {
        framedByteStreams = false;
        targetCompression = false;
        targetNodeVersion = void 0;
        targetHookResumeInputVersion = void 0;
        ({ specVersion: targetSpecVersion, source: specVersionSource } = resolveCrossDeploymentSpecVersion(void 0, world.specVersion));
      } else {
        const { probe, cached } = await probeCrossDeployment(world, {
          deploymentId,
          runId,
          namespace: opts.namespace
        });
        probedRunPublicKey = probe?.encryptionPublicKey;
        const capabilities = getRunCapabilities(probe?.workflowCoreVersion, probe?.nodeVersion);
        framedByteStreams = capabilities.framedByteStreams;
        targetCompression = getCompressionMode(capabilities);
        targetNodeVersion = probe?.nodeVersion;
        targetHookResumeInputVersion = probe?.hookResumeInputVersion;
        ({ specVersion: targetSpecVersion, source: specVersionSource } = resolveCrossDeploymentSpecVersion(probe, world.specVersion));
        span?.setAttributes({
          ...WorkflowCapabilityProbeCached(cached),
          ...!cached && probe?.latencyMs !== void 0 ? WorkflowCapabilityProbeLatencyMs(probe.latencyMs) : {},
          ...!cached && probe?.error ? WorkflowCapabilityProbeError(probe.error) : {}
        });
        if (specVersionSource === "probe-miss" && opts.specVersion === void 0 && !probeMissWarning.warned) {
          probeMissWarning.warned = true;
          runtimeLogger.warn("The target deployment did not answer the capability probe, so the run was stamped with a fallback spec version instead of the target's own. A target on an older major version may not be able to execute it.", {
            deploymentId,
            specVersion: targetSpecVersion,
            error: probe?.error
          });
        }
      }
      const ops = [];
      const traceCarrier = await serializeTraceCarrier();
      const specVersion = opts.specVersion ?? targetSpecVersion;
      if (opts.specVersion !== void 0) specVersionSource = "explicit";
      span?.setAttributes({
        ...WorkflowRunSpecVersion(specVersion),
        ...WorkflowRunSpecVersionSource(specVersionSource)
      });
      const specGateError = /* @__PURE__ */ __name((featureRequires) => new WorkflowRuntimeError(crossDeployment && opts.specVersion === void 0 ? `${featureRequires} spec version ${SPEC_VERSION_SUPPORTS_ATTRIBUTES} or later, but the target deployment (${deploymentId}) runs spec version ${specVersion}.` : `${featureRequires} a World that supports spec version ${SPEC_VERSION_SUPPORTS_ATTRIBUTES} or later.`), "specGateError");
      const v1Compat = isLegacySpecVersion(specVersion);
      const allowReservedAttributes = opts.allowReservedAttributes === true;
      let attributes;
      if (opts.attributes && Object.keys(opts.attributes).length > 0) {
        if (specVersion < SPEC_VERSION_SUPPORTS_ATTRIBUTES) {
          throw specGateError("Initial workflow attributes require");
        }
        for (const [key, value] of Object.entries(opts.attributes)) {
          if (typeof value !== "string") {
            throw new WorkflowRuntimeError(`Initial workflow attribute ${JSON.stringify(key)} must be a string value.`);
          }
        }
        const changes = normalizeAttributeChanges(opts.attributes, {
          allowReservedAttributes
        });
        attributes = Object.fromEntries(changes.map(({ key, value }) => [
          key,
          value
        ]));
      }
      let retentionAttribute;
      if (opts.experimental_retention !== void 0 && opts.experimental_retention !== "default") {
        if (opts.experimental_retention !== 0) {
          throw new WorkflowRuntimeError(`start({ experimental_retention }) must be 0 or 'default'; received ${JSON.stringify(opts.experimental_retention)}.`);
        }
        if (specVersion < SPEC_VERSION_SUPPORTS_ATTRIBUTES) {
          throw specGateError("start({ experimental_retention }) requires");
        }
        retentionAttribute = {
          [RETENTION_ATTRIBUTE]: RETENTION_ZERO_ATTRIBUTE_VALUE
        };
      }
      const lineage = specVersion >= SPEC_VERSION_SUPPORTS_ATTRIBUTES ? resolveLineageAttributes() : void 0;
      const runAttributes = lineage || retentionAttribute ? {
        ...lineage,
        ...attributes,
        ...retentionAttribute
      } : attributes;
      const attributeSeed = runAttributes ? {
        attributes: runAttributes,
        ...allowReservedAttributes || lineage != null || retentionAttribute != null ? {
          allowReservedAttributes: true
        } : {}
      } : {};
      if (opts.replayedFromRunId !== void 0 && !workflowRunIdSchema.safeParse(opts.replayedFromRunId).success) {
        throw new WorkflowRuntimeError(`replayedFromRunId must be a run ID (wrun_<ulid>); received ${JSON.stringify(String(opts.replayedFromRunId).slice(0, 64))}.`);
      }
      const probedPublicKey = decodeRunPublicKey(probedRunPublicKey);
      let encryptionKey;
      let encryptionPublicKey;
      if (probedPublicKey) {
        encryptionKey = sealTo(probedPublicKey);
        encryptionPublicKey = probedRunPublicKey;
      } else {
        const rawKey = await world.getEncryptionKeyForRun?.(runId, {
          ...opts,
          deploymentId
        });
        encryptionKey = rawKey ? await importKey(rawKey) : void 0;
        encryptionPublicKey = rawKey ? bytesToBase64((await deriveRunKeyPair(rawKey)).publicKey) : void 0;
      }
      const workflowVm = getWorkflowVmFromEnv();
      const snapshotThreshold = getSnapshotThresholdForStart(workflowVm);
      const queueNamespace = resolveQueueNamespace(opts.namespace);
      const executionContext = {
        traceCarrier,
        workflowCoreVersion: version,
        ...queueNamespace ? {
          queueNamespace
        } : {},
        ...targetNodeVersion ? {
          nodeVersion: targetNodeVersion
        } : {},
        features: {
          encryption: !!encryptionKey
        },
        ...targetHookResumeInputVersion !== void 0 ? {
          hookResumeInputVersion: targetHookResumeInputVersion
        } : {},
        ...workflowVm ? {
          workflowVm
        } : {},
        ...snapshotThreshold !== void 0 ? {
          snapshotThreshold
        } : {},
        ...opts.replayedFromRunId ? {
          replayedFromRunId: opts.replayedFromRunId
        } : {},
        ...dynamicWorkflow ? {
          dynamicWorkflow: dynamicWorkflow.metadata
        } : {}
      };
      if (dynamicWorkflow) {
        try {
          world.validateRunExecutionContext?.(executionContext);
        } catch (err) {
          throw dynamicStartRefusalFrom(err);
        }
      }
      const compression = specVersion >= SPEC_VERSION_SUPPORTS_COMPRESSION ? targetCompression : false;
      const argumentCompression = opts.compressArguments === false ? false : compression;
      const workflowArguments = await dehydrateWorkflowArguments(args, runId, encryptionKey, ops, globalThis, v1Compat, framedByteStreams, argumentCompression);
      let dynamicWorkflowCode;
      let dynamicWorkflowCodeRef;
      if (dynamicWorkflow) {
        const serializedCode = await dehydrateDynamicWorkflowCode(dynamicWorkflow.code, encryptionKey, compression);
        if (serializedCode.byteLength > DYNAMIC_WORKFLOW_CODE_INLINE_MAX_BYTES && world.uploadDynamicWorkflowCode) {
          dynamicWorkflowCodeRef = await world.uploadDynamicWorkflowCode(runId, {
            workflowName,
            code: serializedCode
          });
        } else {
          dynamicWorkflowCode = serializedCode;
        }
        span?.setAttributes({
          ...WorkflowDynamic(true),
          ...WorkflowDynamicSourceHash(dynamicWorkflow.metadata.sourceHash),
          ...WorkflowDynamicCodeBytes(serializedCode.byteLength),
          ...WorkflowDynamicCodeStorage(dynamicWorkflowCodeRef ? "ref" : "inline")
        });
      }
      const dynamicWorkflowSeed = dynamicWorkflow ? {
        ...dynamicWorkflowCode ? {
          dynamicWorkflowCode
        } : {},
        ...dynamicWorkflowCodeRef ? {
          dynamicWorkflowCodeRef
        } : {}
      } : {};
      const creatorEnvironment = world.getEnvironment?.();
      const runCreated = world.events.create(runId, {
        eventType: "run_created",
        specVersion,
        eventData: {
          deploymentId,
          workflowName,
          input: workflowArguments,
          executionContext,
          ...encryptionPublicKey ? {
            encryptionPublicKey
          } : {},
          ...attributeSeed,
          ...dynamicWorkflowSeed
        }
      }, {
        v1Compat
      });
      if (dynamicWorkflow) {
        const { run: run2 } = await runCreated;
        if (run2.dynamicWorkflowCode === void 0) {
          throw new WorkflowRuntimeError(`Workflow run ${runId} was created, but this deployment's Workflow backend did not store its dynamic workflow code, so the run can never be replayed. It was not queued, so it will not execute. Dynamic workflows require a backend with encrypted dynamic-source storage; upgrade it, or start a workflow function from the build-time manifest instead.`);
        }
      }
      const [runCreatedResult, queueResult] = await Promise.allSettled([
        runCreated,
        world.queue(queueName, {
          runId,
          traceCarrier,
          ...specVersion >= SPEC_VERSION_SUPPORTS_CBOR_QUEUE_TRANSPORT ? {
            runInput: {
              input: workflowArguments,
              deploymentId,
              workflowName,
              specVersion,
              executionContext,
              ...encryptionPublicKey ? {
                encryptionPublicKey
              } : {},
              ...creatorEnvironment !== void 0 ? {
                environment: creatorEnvironment
              } : {},
              ...attributeSeed,
              ...dynamicWorkflowSeed
            }
          } : {}
        }, {
          deploymentId,
          specVersion,
          // Forward any caller-supplied region hint so worlds with
          // per-region queue routing (e.g. world-vercel) can target the
          // matching queue. Worlds without a regional dimension ignore
          // this field.
          ...opts.region !== void 0 ? {
            region: opts.region
          } : {}
        })
      ]);
      if (queueResult.status === "rejected") {
        throw queueResult.reason;
      }
      let resilientStart = false;
      if (runCreatedResult.status === "rejected") {
        const err = runCreatedResult.reason;
        if (EntityConflictError.is(err)) {
        } else if (isRetryableWorldError(err)) {
          resilientStart = true;
          runtimeLogger.warn("Run creation event failed, but the run was accepted via the queue. The run_created event will be re-tried async by the runtime.", {
            workflowRunId: runId,
            error: err.message
          });
        } else {
          throw err;
        }
      } else {
        const result = runCreatedResult.value;
        if (!v1Compat && result.run.runId !== runId) {
          throw new WorkflowRuntimeError(`Server returned different runId than requested: expected ${runId}, got ${result.run.runId}`);
        }
      }
      safeWaitUntil(Promise.all(ops), (err) => {
        runtimeLogger.warn("Background flush of workflow argument streams failed", {
          workflowRunId: runId,
          error: err instanceof Error ? err.message : String(err)
        });
      });
      span?.setAttributes({
        ...WorkflowRunId(runId),
        ...DeploymentId(deploymentId),
        ...runCreatedResult.status === "fulfilled" ? WorkflowRunStatus(runCreatedResult.value.run.status) : {}
      });
      return new Run(runId, {
        resilientStart
      });
    });
  });
}
__name(start, "start");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "start",
    configurable: true
  });
})(start, "step//@workflow/core/runtime/start@5.2.3//start");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/runs.js
async function wakeUpRun(world, runId, options) {
  try {
    const run2 = await world.runs.get(runId, {
      resolveData: "none"
    });
    const compatMode = isLegacySpecVersion(run2.specVersion);
    const allEvents = [];
    let cursor = null;
    do {
      const eventsResult = await world.events.list({
        runId,
        pagination: {
          sortOrder: "asc",
          ...cursor ? {
            cursor
          } : {}
        },
        resolveData: "none"
      });
      allEvents.push(...eventsResult.data);
      cursor = eventsResult.hasMore ? eventsResult.cursor : null;
    } while (cursor);
    const waitCreatedEvents = allEvents.filter((event) => event.eventType === "wait_created");
    const waitCompletedCorrelationIds = new Set(allEvents.filter((event) => event.eventType === "wait_completed").map((event) => event.correlationId));
    let pendingWaits = waitCreatedEvents.filter((event) => !waitCompletedCorrelationIds.has(event.correlationId));
    if (options?.correlationIds && options.correlationIds.length > 0) {
      const targetCorrelationIds = new Set(options.correlationIds);
      pendingWaits = pendingWaits.filter((event) => event.correlationId && targetCorrelationIds.has(event.correlationId));
    }
    const errors = [];
    let stoppedCount = 0;
    for (const waitEvent of pendingWaits) {
      if (!waitEvent.correlationId) continue;
      const eventData = compatMode ? {
        eventType: "wait_completed",
        correlationId: waitEvent.correlationId
      } : {
        eventType: "wait_completed",
        correlationId: waitEvent.correlationId,
        specVersion: specVersionForRunWrite(run2.specVersion),
        eventData: {
          resumeAt: waitEvent.eventData.resumeAt
        }
      };
      try {
        await world.events.create(runId, eventData, {
          v1Compat: compatMode
        });
        stoppedCount++;
      } catch (err) {
        if (EntityConflictError.is(err)) {
          stoppedCount++;
        } else {
          errors.push(err instanceof Error ? err : new Error(String(err)));
        }
      }
    }
    if (stoppedCount > 0) {
      await world.queue(getWorkflowQueueName(run2.workflowName, options?.namespace), {
        runId
      }, {
        deploymentId: run2.deploymentId,
        specVersion: specVersionForRunWrite(run2.specVersion, SPEC_VERSION_LEGACY)
      });
    }
    if (errors.length > 0) {
      throw new AggregateError(errors, `Failed to complete ${errors.length}/${pendingWaits.length} pending wait(s) for run ${runId}`);
    }
    return {
      stoppedCount
    };
  } catch (err) {
    if (err instanceof AggregateError) {
      throw err;
    }
    throw new Error(`Failed to wake up run ${runId}: ${err instanceof Error ? err.message : String(err)}`, {
      cause: err
    });
  }
}
__name(wakeUpRun, "wakeUpRun");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/run.js
var RETURN_VALUE_POLL_INTERVAL_MS = 1e3;
var PAYLOAD_TERMINAL_RUN_STATUSES = /* @__PURE__ */ new Set([
  "completed",
  "failed"
]);
var NOT_FOUND_RETRY_DELAYS = [
  1e3,
  3e3,
  6e3
];
function getReturnValuePollIntervalMs() {
  return envNumber("WORKFLOW_RETURN_VALUE_POLL_INTERVAL_MS", RETURN_VALUE_POLL_INTERVAL_MS, {
    integer: true,
    min: 1
  });
}
__name(getReturnValuePollIntervalMs, "getReturnValuePollIntervalMs");
var RETURN_VALUE_WAIT_TIMEOUT_MS = 5e4;
function getReturnValueWaitTimeoutMs() {
  return envNumber("WORKFLOW_RETURN_VALUE_WAIT_MS", RETURN_VALUE_WAIT_TIMEOUT_MS, {
    integer: true,
    min: 1
  });
}
__name(getReturnValueWaitTimeoutMs, "getReturnValueWaitTimeoutMs");
var RETURN_VALUE_MAX_LONG_POLLS = 10;
function getReturnValueMaxLongPolls() {
  return envNumber("WORKFLOW_RETURN_VALUE_MAX_LONG_POLLS", RETURN_VALUE_MAX_LONG_POLLS, {
    integer: true,
    min: 1
  });
}
__name(getReturnValueMaxLongPolls, "getReturnValueMaxLongPolls");
function isReturnValueLongPollEnabled() {
  const raw = process.env.WORKFLOW_RETURN_VALUE_LONG_POLL;
  if (raw === void 0 || raw === "") return true;
  return !(raw === "0" || raw.toLowerCase() === "false");
}
__name(isReturnValueLongPollEnabled, "isReturnValueLongPollEnabled");
var Run = class _Run {
  static {
    __name(this, "Run");
  }
  static [WORKFLOW_SERIALIZE](instance) {
    return {
      runId: instance.runId,
      resilientStart: instance.#resilientStart
    };
  }
  static [WORKFLOW_DESERIALIZE](data2) {
    return new _Run(data2.runId, {
      resilientStart: data2.resilientStart
    });
  }
  /**
   * The ID of the workflow run.
   */
  runId;
  /**
   * The world object.
   * @internal
   */
  #worldPromise;
  get #lazyWorldPromise() {
    if (!this.#worldPromise) this.#worldPromise = getWorldLazy();
    return this.#worldPromise;
  }
  /**
   * Cached encryption key resolution. Resolved once on first use and
   * reused for returnValue, getReadable(), etc.
   * @internal
   */
  #encryptionKeyPromise = null;
  /**
   * When true, run_created failed and the run may not exist yet (the
   * resilient start path will create it via run_started). pollReturnValue
   * retries on WorkflowRunNotFoundError only when this flag is set so
   * that normal runs fail fast on 404.
   * @internal
   */
  #resilientStart = false;
  constructor(runId, opts) {
    this.runId = runId;
    this.#resilientStart = opts?.resilientStart ?? false;
  }
  /**
   * Resolves and caches the encryption key for this run.
   * The key is the same for the lifetime of a run, so it only needs
   * to be resolved once.
   * @internal
   */
  #getEncryptionKey(run2) {
    if (!this.#encryptionKeyPromise) {
      this.#encryptionKeyPromise = (async () => {
        const world = await this.#lazyWorldPromise;
        if (!world.getEncryptionKeyForRun) return void 0;
        let rawKey;
        if (run2) {
          rawKey = await world.getEncryptionKeyForRun(run2);
        } else {
          const { deploymentId } = await world.runs.get(this.runId, {
            resolveData: "none"
          });
          rawKey = await world.getEncryptionKeyForRun(this.runId, {
            deploymentId
          });
        }
        return rawKey ? await deriveRunPayloadKeys(rawKey) : void 0;
      })();
    }
    return this.#encryptionKeyPromise;
  }
  /**
   * Defers fetching the run and its encryption key until a readable is first
   * consumed. The first pull prefetches it so an encrypted first frame can join
   * the lookup; this also applies to an empty consumed stream.
   * @internal
   */
  #getEncryptionKeyLazily() {
    return () => this.#getEncryptionKey();
  }
  /**
   * Interrupts pending `sleep()` calls, resuming the workflow early.
   *
   * @param options - Optional settings to target specific sleep calls by correlation ID.
   *   If not provided, all pending sleep calls will be interrupted.
   * @returns A {@link StopSleepResult} object containing the number of sleep calls that were interrupted.
   */
  async wakeUp(options) {
    return wakeUpRun(await this.#lazyWorldPromise, this.runId, options);
  }
  /**
   * Cancels the workflow run.
   *
   * @param options - Optional cancellation settings. `cancelReason` records a
   *   free-text reason (max 512 chars) on the run_cancelled event, surfaced in
   *   the run detail view.
   */
  async cancel(options) {
    const world = await this.#lazyWorldPromise;
    const run2 = await world.runs.get(this.runId, {
      resolveData: "none"
    });
    await world.events.create(this.runId, {
      eventType: "run_cancelled",
      specVersion: specVersionForRunWrite(run2.specVersion),
      ...options?.cancelReason !== void 0 ? {
        eventData: {
          cancelReason: options.cancelReason
        }
      } : {}
    });
  }
  /**
   * Whether the workflow run exists.
   */
  get exists() {
    return this.#lazyWorldPromise.then((world) => world.runs.get(this.runId, {
      resolveData: "none"
    }).then(() => true).catch((error) => {
      if (WorkflowRunNotFoundError.is(error)) {
        return false;
      }
      throw error;
    }));
  }
  /**
   * The status of the workflow run.
   */
  get status() {
    return this.#lazyWorldPromise.then((world) => world.runs.get(this.runId, {
      resolveData: "none"
    }).then((run2) => run2.status));
  }
  /**
   * The return value of the workflow run.
   * Polls the workflow return value until the workflow run completes.
   */
  get returnValue() {
    return this.#pollReturnValue();
  }
  /**
   * The name of the workflow.
   */
  get workflowName() {
    return this.#lazyWorldPromise.then((world) => world.runs.get(this.runId, {
      resolveData: "none"
    }).then((run2) => run2.workflowName));
  }
  /**
   * The timestamp when the workflow run was created.
   */
  get createdAt() {
    return this.#lazyWorldPromise.then((world) => world.runs.get(this.runId, {
      resolveData: "none"
    }).then((run2) => run2.createdAt));
  }
  /**
   * The timestamp when the workflow run started execution.
   * Returns undefined if the workflow has not started yet.
   */
  get startedAt() {
    return this.#lazyWorldPromise.then((world) => world.runs.get(this.runId, {
      resolveData: "none"
    }).then((run2) => run2.startedAt));
  }
  /**
   * The timestamp when the workflow run completed.
   * Returns undefined if the workflow has not completed yet.
   */
  get completedAt() {
    return this.#lazyWorldPromise.then((world) => world.runs.get(this.runId, {
      resolveData: "none"
    }).then((run2) => run2.completedAt));
  }
  /**
   * The readable stream of the workflow run.
   */
  get readable() {
    return this.getReadable();
  }
  /**
   * Retrieves the workflow run's default readable stream, which reads chunks
   * written to the corresponding writable stream {@link getWritable}.
   *
   * The returned stream has an additional {@link WorkflowReadableStream.getTailIndex | getTailIndex()}
   * helper that returns the index of the last known chunk. This is useful when
   * building reconnection endpoints that need to inform clients where the
   * stream starts.
   *
   * @param options - The options for the readable stream.
   * @returns A `WorkflowReadableStream` for the workflow run.
   */
  getReadable(options = {}) {
    const { ops = [], global: global2 = globalThis, startIndex, namespace } = options;
    const name = getWorkflowRunStreamId(this.runId, namespace);
    const encryptionKey = this.#getEncryptionKeyLazily();
    const stream = getRunReadableStream(global2, ops, this.runId, name, startIndex, encryptionKey);
    const worldPromise = this.#lazyWorldPromise;
    const runId = this.runId;
    return Object.assign(stream, {
      getTailIndex: /* @__PURE__ */ __name(async () => {
        const world = await worldPromise;
        const info = await world.streams.getInfo(runId, name);
        return info.tailIndex;
      }, "getTailIndex")
    });
  }
  /** The writable stream of the workflow run. */
  get writable() {
    return this.getWritable();
  }
  /**
   * Returns a writable that appends to this run's stream.
   *
   * Initialization is deferred until the first write. The run must already
   * exist. The writable may be forwarded through `start()` and into steps, but
   * grants no read access or additional authorization.
   *
   * @remarks
   * `writer.close()` closes the shared stream. Contributors should call
   * `releaseLock()`, which also drains pending writes.
   *
   * @param options - The writable stream options.
   */
  getWritable(options = {}) {
    const { ops = [], global: global2 = globalThis, namespace } = options;
    const name = getWorkflowRunStreamId(this.runId, namespace);
    let targetPromise;
    let writable;
    const resolveTarget = /* @__PURE__ */ __name(() => {
      targetPromise ??= this.#getMetadata().then(async (run2) => {
        const target = {
          key: await getForwardedWritableEncryptionKey(this.runId, run2.deploymentId, run2.encryptionPublicKey),
          deploymentId: run2.deploymentId,
          encryptionPublicKey: run2.encryptionPublicKey
        };
        tagForwardedWritableTarget(writable, target);
        return target;
      });
      return targetPromise;
    }, "resolveTarget");
    writable = createForwardedWritable({
      global: global2,
      ops,
      runId: this.runId,
      name,
      key: /* @__PURE__ */ __name(() => resolveTarget().then(({ key }) => key), "key")
    });
    return writable;
  }
  /** Reads metadata, briefly retrying resilient starts. @internal */
  async #getMetadata() {
    const world = await this.#lazyWorldPromise;
    const maxRetries = this.#resilientStart ? NOT_FOUND_RETRY_DELAYS.length : 0;
    let attempt = 0;
    while (true) {
      try {
        return await world.runs.get(this.runId, {
          resolveData: "none"
        });
      } catch (error) {
        if (!WorkflowRunNotFoundError.is(error) || attempt >= maxRetries) {
          throw error;
        }
        const delay = NOT_FOUND_RETRY_DELAYS[attempt];
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  /** @internal */
  async #resolveTerminalReturnValue(run2) {
    const expiredAt = run2.expiredAt;
    if (expiredAt != null && expiredAt <= /* @__PURE__ */ new Date()) {
      throw new RunExpiredError(`Run "${this.runId}" ${run2.status === "completed" ? "completed" : `is ${run2.status}`}, but its data expired at ${expiredAt.toISOString()} and is no longer readable.`, this.runId, run2.status, expiredAt);
    }
    if (run2.status === "completed") {
      const encryptionKey = await this.#getEncryptionKey(run2);
      return await hydrateWorkflowReturnValue(run2.output, this.runId, encryptionKey);
    }
    if (run2.status === "cancelled") {
      throw new WorkflowRunCancelledError(this.runId);
    }
    if (run2.status === "failed") {
      const encryptionKey = await this.#getEncryptionKey(run2);
      let hydratedError;
      try {
        hydratedError = await hydrateRunError(run2.error, this.runId, encryptionKey);
      } catch {
        hydratedError = new Error("Failed to hydrate workflow run error");
      }
      throw new WorkflowRunFailedError(this.runId, hydratedError, {
        errorCode: run2.errorCode
      });
    }
    throw new WorkflowRunNotCompletedError(this.runId, run2.status);
  }
  /**
   * Polls the workflow return value until the workflow run completes.
   * @internal
   * @returns The workflow return value.
   */
  async #pollReturnValue() {
    const world = await this.#lazyWorldPromise;
    let notFoundRetries = 0;
    const NOT_FOUND_MAX_RETRIES = this.#resilientStart ? NOT_FOUND_RETRY_DELAYS.length : 0;
    const waitForTerminalStatus = isReturnValueLongPollEnabled() ? world.runs.waitForTerminalStatus?.bind(world.runs) : void 0;
    let longPolls = 0;
    const maxLongPolls = getReturnValueMaxLongPolls();
    while (true) {
      const iterationStartedAt = Date.now();
      try {
        const useLongPoll = waitForTerminalStatus && longPolls < maxLongPolls;
        if (useLongPoll) longPolls++;
        const runMetadata = useLongPoll ? await waitForTerminalStatus(this.runId, {
          timeoutMs: getReturnValueWaitTimeoutMs(),
          resolveData: "none"
        }) : await world.runs.get(this.runId, {
          resolveData: "none"
        });
        if (runMetadata.status === "cancelled") {
          throw new WorkflowRunCancelledError(this.runId);
        }
        if (PAYLOAD_TERMINAL_RUN_STATUSES.has(runMetadata.status)) {
          const run2 = await world.runs.get(this.runId, {
            resolveData: "all"
          });
          return await this.#resolveTerminalReturnValue(run2);
        }
        throw new WorkflowRunNotCompletedError(this.runId, runMetadata.status);
      } catch (error) {
        if (WorkflowRunNotCompletedError.is(error)) {
          const remainingIntervalMs = getReturnValuePollIntervalMs() - (Date.now() - iterationStartedAt);
          if (remainingIntervalMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, remainingIntervalMs));
          }
          continue;
        }
        if (WorkflowRunNotFoundError.is(error) && notFoundRetries < NOT_FOUND_MAX_RETRIES) {
          const delay = NOT_FOUND_RETRY_DELAYS[notFoundRetries];
          notFoundRetries++;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
  }
};
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "wakeUp",
    configurable: true
  });
})(Run.prototype["wakeUp"], "step//@workflow/core/runtime/run@5.2.3//Run#wakeUp");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "cancel",
    configurable: true
  });
})(Run.prototype["cancel"], "step//@workflow/core/runtime/run@5.2.3//Run#cancel");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "getReadable",
    configurable: true
  });
})(Run.prototype["getReadable"], "step//@workflow/core/runtime/run@5.2.3//Run#getReadable");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "getWritable",
    configurable: true
  });
})(Run.prototype["getWritable"], "step//@workflow/core/runtime/run@5.2.3//Run#getWritable");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "exists",
    configurable: true
  });
})(Object.getOwnPropertyDescriptor(Run.prototype, "exists").get, "step//@workflow/core/runtime/run@5.2.3//Run#exists");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "status",
    configurable: true
  });
})(Object.getOwnPropertyDescriptor(Run.prototype, "status").get, "step//@workflow/core/runtime/run@5.2.3//Run#status");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "returnValue",
    configurable: true
  });
})(Object.getOwnPropertyDescriptor(Run.prototype, "returnValue").get, "step//@workflow/core/runtime/run@5.2.3//Run#returnValue");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "workflowName",
    configurable: true
  });
})(Object.getOwnPropertyDescriptor(Run.prototype, "workflowName").get, "step//@workflow/core/runtime/run@5.2.3//Run#workflowName");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "createdAt",
    configurable: true
  });
})(Object.getOwnPropertyDescriptor(Run.prototype, "createdAt").get, "step//@workflow/core/runtime/run@5.2.3//Run#createdAt");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "startedAt",
    configurable: true
  });
})(Object.getOwnPropertyDescriptor(Run.prototype, "startedAt").get, "step//@workflow/core/runtime/run@5.2.3//Run#startedAt");
(function(__wf_fn, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("@workflow/core//registeredSteps"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_fn);
  __wf_fn.stepId = __wf_id;
  Object.defineProperty(__wf_fn, "name", {
    value: "completedAt",
    configurable: true
  });
})(Object.getOwnPropertyDescriptor(Run.prototype, "completedAt").get, "step//@workflow/core/runtime/run@5.2.3//Run#completedAt");
(function(__wf_cls, __wf_id) {
  var __wf_sym = /* @__PURE__ */ Symbol.for("workflow-class-registry"), __wf_reg = globalThis[__wf_sym] || (globalThis[__wf_sym] = /* @__PURE__ */ new Map());
  __wf_reg.set(__wf_id, __wf_cls);
  if (!Object.prototype.hasOwnProperty.call(__wf_cls, "classId")) Object.defineProperty(__wf_cls, "classId", {
    value: __wf_id,
    writable: false,
    enumerable: false,
    configurable: false
  });
})(Run, "class//@workflow/core/runtime/run@5.2.3//Run");

// virtual-entry.js
var __steps_registered = true;
export {
  __steps_registered
};
