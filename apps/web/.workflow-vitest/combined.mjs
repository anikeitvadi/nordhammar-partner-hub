// biome-ignore-all lint: generated file
/* eslint-disable */
import { __steps_registered } from './__step_registrations.mjs';
import { workflowEntrypoint } from 'workflow/runtime';

const workflowRouteModuleBodyStartedAt = Date.now();

// Prevent rollup from tree-shaking the steps side-effect import
void __steps_registered;

const workflowCode = `globalThis.__private_workflows = new Map();
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
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

// ../../node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js
var require_ms = __commonJS({
  "../../node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js"(exports, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\\d+)?\\.?\\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?\$/i.exec(str);
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
    __name(parse, "parse");
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

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/capture-stack.js
function redirectStackToCaller(err, stackStartFn) {
  const capture = Error.captureStackTrace;
  capture?.(err, stackStartFn);
}
__name(redirectStackToCaller, "redirectStackToCaller");

// ../../node_modules/.pnpm/@workflow+errors@5.0.5/node_modules/@workflow/errors/dist/internal-chalk.js
var colorEnabled = (() => {
  const p = globalThis.process;
  if (!p?.env) return false;
  if (p.env.FORCE_COLOR && p.env.FORCE_COLOR !== "0") return true;
  if (p.env.NO_COLOR) return false;
  return Boolean(p.stdout?.isTTY);
})();
var sgr = /* @__PURE__ */ __name((open, close) => (s) => colorEnabled ? \`\\x1B[\${open}m\${s}\\x1B[\${close}m\` : s, "sgr");
var chalk = {
  bold: sgr(1, 22),
  dim: sgr(2, 22),
  italic: sgr(3, 23),
  red: sgr(31, 39),
  blue: sgr(34, 39),
  cyan: sgr(36, 39),
  yellow: sgr(33, 39),
  magenta: sgr(35, 39)
};
var internal_chalk_default = chalk;

// ../../node_modules/.pnpm/@workflow+errors@5.0.5/node_modules/@workflow/errors/dist/ansi.js
var styles = {
  info: internal_chalk_default.blue,
  help: internal_chalk_default.cyan,
  warn: internal_chalk_default.yellow,
  error: internal_chalk_default.red
};
function docs(url) {
  return styles.info(\`\${internal_chalk_default.bold("docs:")} \${url}\`);
}
__name(docs, "docs");
function code(str) {
  return internal_chalk_default.italic(\`\${internal_chalk_default.dim("\`")}\${str}\${internal_chalk_default.dim("\`")}\`);
}
__name(code, "code");
function dim(str) {
  return internal_chalk_default.dim(str);
}
__name(dim, "dim");
function frame(title, contents) {
  const result = [
    title
  ];
  contents.forEach((content, index) => {
    const lines = content.split("\\n");
    const isLastContent = index === contents.length - 1;
    const firstLinePrefix = isLastContent ? "\\u2570\\u25B6 " : "\\u251C\\u25B6 ";
    const continuationPrefix = isLastContent ? "   " : "\\u2502  ";
    const framedLines = lines.map((line, lineIndex) => {
      const prefix = lineIndex === 0 ? firstLinePrefix : continuationPrefix;
      return \`\${prefix}\${line}\`;
    });
    result.push(...framedLines);
  });
  return result.join("\\n");
}
__name(frame, "frame");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/context-violation-error.js
var INSPECT_CUSTOM = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
function renderSegmentPlain(s) {
  if ("code" in s) return \`\\\`\${s.code}\\\`\`;
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
  if (d.type === "docs") return \`docs: \${d.url}\`;
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
    const first = isLast ? "\\u2570\\u25B6 " : "\\u251C\\u25B6 ";
    const cont = isLast ? "   " : "\\u2502  ";
    const raw = renderDetailPlain(detail).split("\\n");
    raw.forEach((line, i) => {
      lines.push(\`\${i === 0 ? first : cont}\${line}\`);
    });
  });
  return lines.join("\\n");
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
   * \`console.log(err)\` and most Node internals route through \`util.inspect\`,
   * which respects this symbol. Returning a custom string here means the
   * thrown error prints as a pretty frame in the terminal while \`.message\`
   * and \`.stack\` stay plain.
   */
  [INSPECT_CUSTOM]() {
    const pretty = renderPretty(this.#content);
    const messageLineCount = this.message.split("\\n").length;
    const tail = (this.stack ?? "").split("\\n").slice(messageLineCount).join("\\n");
    return tail ? \`\${this.name}: \${pretty}
\${tail}\` : \`\${this.name}: \${pretty}\`;
  }
  toString() {
    return \`\${this.name}: \${renderPretty(this.#content)}\`;
  }
};
var NotInWorkflowContextError = class extends ContextViolationError {
  static {
    __name(this, "NotInWorkflowContextError");
  }
  name = "NotInWorkflowContextError";
  constructor(functionName, docsUrl) {
    super({
      title: [
        {
          code: functionName
        },
        {
          text: " can only be called inside a workflow function"
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
var NotInWorkflowOrStepContextError = class extends ContextViolationError {
  static {
    __name(this, "NotInWorkflowOrStepContextError");
  }
  name = "NotInWorkflowOrStepContextError";
  constructor(functionName, docsUrl) {
    super({
      title: [
        {
          code: functionName
        },
        {
          text: " can only be called inside a workflow or step function"
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

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/workflow/get-workflow-metadata.js
var WORKFLOW_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("WORKFLOW_CONTEXT");
function getWorkflowMetadata() {
  const ctx = globalThis[WORKFLOW_CONTEXT_SYMBOL];
  if (!ctx) {
    const err = new NotInWorkflowOrStepContextError("getWorkflowMetadata()", "https://workflow-sdk.dev/docs/api-reference/workflow/get-workflow-metadata");
    redirectStackToCaller(err, getWorkflowMetadata);
    throw err;
  }
  return ctx;
}
__name(getWorkflowMetadata, "getWorkflowMetadata");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/context-errors.js
function throwNotInWorkflowContext(functionName, docsUrl, stackStartFn) {
  const err = new NotInWorkflowContextError(functionName, docsUrl);
  redirectStackToCaller(err, stackStartFn);
  throw err;
}
__name(throwNotInWorkflowContext, "throwNotInWorkflowContext");

// ../../node_modules/.pnpm/@workflow+utils@5.0.2/node_modules/@workflow/utils/dist/time.js
var import_ms = __toESM(require_ms(), 1);
function parseDurationToDate(param) {
  const date = durationToDate(param);
  if (Number.isNaN(date.getTime())) {
    throw new Error(typeof param === "object" ? "Invalid date: the Date object does not hold a valid time." : \`Invalid duration: \${JSON.stringify(param)} ends past the latest time a Date can represent.\`);
  }
  return date;
}
__name(parseDurationToDate, "parseDurationToDate");
function durationToDate(param) {
  if (typeof param === "string") {
    const durationMs = (0, import_ms.default)(param);
    if (typeof durationMs !== "number" || durationMs < 0) {
      throw new Error(\`Invalid duration: "\${param}". Expected a valid duration string like "1s", "1m", "1h", etc.\`);
    }
    return new Date(Date.now() + durationMs);
  } else if (typeof param === "number") {
    if (param < 0 || !Number.isFinite(param)) {
      throw new Error(\`Invalid duration: \${param}. Expected a non-negative finite number of milliseconds.\`);
    }
    return new Date(Date.now() + param);
  } else if (param instanceof Date || param && typeof param === "object" && typeof param.getTime === "function") {
    return param instanceof Date ? param : new Date(param.getTime());
  } else {
    throw new Error(\`Invalid duration parameter. Expected a duration string, number (milliseconds), or Date object.\`);
  }
}
__name(durationToDate, "durationToDate");

// ../../node_modules/.pnpm/@workflow+errors@5.0.5/node_modules/@workflow/errors/dist/error-codes.js
var RUN_ERROR_CODES = {
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

// ../../node_modules/.pnpm/@workflow+errors@5.0.5/node_modules/@workflow/errors/dist/index.js
var BASE_URL = "https://workflow-sdk.dev/err";
function isError(value) {
  return typeof value === "object" && value !== null && "name" in value && "message" in value;
}
__name(isError, "isError");
function appendFramedDetails(title, details) {
  if (details.length === 0) return title;
  const lines = [
    title
  ];
  details.forEach((detail, index) => {
    const isLast = index === details.length - 1;
    const head = isLast ? "\\u2570\\u25B6 " : "\\u251C\\u25B6 ";
    const cont = isLast ? "   " : "\\u2502  ";
    const text = \`\${detail.label}: \${detail.value}\`;
    text.split("\\n").forEach((line, i) => {
      lines.push(\`\${i === 0 ? head : cont}\${line}\`);
    });
  });
  return lines.join("\\n");
}
__name(appendFramedDetails, "appendFramedDetails");
function buildFramedDetails(hint, slug) {
  const out = [];
  if (hint) out.push({
    label: "hint",
    value: hint
  });
  if (slug) out.push({
    label: "docs",
    value: \`\${BASE_URL}/\${slug}\`
  });
  return out;
}
__name(buildFramedDetails, "buildFramedDetails");
var ERROR_SLUGS = {
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
var WorkflowError = class extends Error {
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
      this.stack = \`\${this.stack}
Caused by: \${options.cause.stack}\`;
    }
  }
  static is(value) {
    return isError(value) && value.name === "WorkflowError";
  }
};
var WorkflowWorldError = class extends WorkflowError {
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
   * (\`code: 'INVALID_ARGUMENT'\`). Lets a caller correct the specific
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
var WorkflowRuntimeError = class extends WorkflowError {
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
var RuntimeDecryptionError = class extends WorkflowRuntimeError {
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
var HookConflictError = class extends WorkflowError {
  static {
    __name(this, "HookConflictError");
  }
  token;
  // TODO: Make this required once all persisted hook_conflict events and World
  // implementations always include the active hook owner's run ID.
  conflictingRunId;
  constructor(token, conflictingRunId) {
    super(\`Hook token "\${token}" is already in use by another workflow\${conflictingRunId ? \` (run "\${conflictingRunId}")\` : ""}\`, {
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
var HookForceClaimedError = class extends WorkflowError {
  static {
    __name(this, "HookForceClaimedError");
  }
  token;
  /** The run that took the token. */
  claimedByRunId;
  /** The hook (in \`claimedByRunId\`) the token now belongs to. */
  claimedByHookId;
  constructor(token, claimedByRunId, claimedByHookId) {
    super(\`Hook token "\${token}" was force-claimed by another workflow (run "\${claimedByRunId}")\`, {
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
var StreamError = class extends WorkflowWorldError {
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
var FatalError = class extends Error {
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
var RetryableError = class extends Error {
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
var FATAL_ERROR_KEY = /* @__PURE__ */ Symbol.for("@workflow/errors//FatalError");
var RETRYABLE_ERROR_KEY = /* @__PURE__ */ Symbol.for("@workflow/errors//RetryableError");
var HOOK_CONFLICT_ERROR_KEY = /* @__PURE__ */ Symbol.for("@workflow/errors//HookConflictError");
var HOOK_FORCE_CLAIMED_ERROR_KEY = /* @__PURE__ */ Symbol.for("@workflow/errors//HookForceClaimedError");
var RUNTIME_DECRYPTION_ERROR_KEY = /* @__PURE__ */ Symbol.for("@workflow/errors//RuntimeDecryptionError");
var STREAM_ERROR_KEY = /* @__PURE__ */ Symbol.for("@workflow/errors//StreamError");
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

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/symbols.js
var WORKFLOW_CREATE_HOOK = /* @__PURE__ */ Symbol.for("WORKFLOW_CREATE_HOOK");
var WORKFLOW_CLASS_REGISTRY = /* @__PURE__ */ Symbol.for("workflow-class-registry");

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/class-serialization.js
function getRegistry(global = globalThis) {
  const g = global;
  let registry = g[WORKFLOW_CLASS_REGISTRY];
  if (!registry) {
    registry = /* @__PURE__ */ new Map();
    g[WORKFLOW_CLASS_REGISTRY] = registry;
  }
  return registry;
}
__name(getRegistry, "getRegistry");
var RUN_CLASS_ID = "class//workflow//Run";
function aliasSerializationClass(classId, cls, global = globalThis) {
  getRegistry(global).set(classId, cls);
}
__name(aliasSerializationClass, "aliasSerializationClass");

// ../../node_modules/.pnpm/@workflow+serde@5.0.0/node_modules/@workflow/serde/dist/index.js
var WORKFLOW_SERIALIZE = /* @__PURE__ */ Symbol.for("workflow-serialize");
var WORKFLOW_DESERIALIZE = /* @__PURE__ */ Symbol.for("workflow-deserialize");

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/env-config.js
var WarnedEnvValuesKey = /* @__PURE__ */ Symbol.for("@workflow/world//warnedEnvValues/v1");
var globalStore = globalThis;
var warnedEnvValues = globalStore[WarnedEnvValuesKey] ??= /* @__PURE__ */ new Set();

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/runtime/run.js
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
  static [WORKFLOW_DESERIALIZE](data) {
    return new _Run(data.runId, {
      resilientStart: data.resilientStart
    });
  }
  /**
   * The ID of the workflow run.
   */
  runId;
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
   * The readable stream of the workflow run.
   */
  get readable() {
    return this.getReadable();
  }
  /** The writable stream of the workflow run. */
  get writable() {
    return this.getWritable();
  }
};
Run.prototype["wakeUp"] = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//@workflow/core/runtime/run@5.2.3//Run#wakeUp");
Run.prototype["cancel"] = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//@workflow/core/runtime/run@5.2.3//Run#cancel");
Run.prototype["getReadable"] = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//@workflow/core/runtime/run@5.2.3//Run#getReadable");
Run.prototype["getWritable"] = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//@workflow/core/runtime/run@5.2.3//Run#getWritable");
var __step_Run\$exists = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//@workflow/core/runtime/run@5.2.3//Run#exists");
Object.defineProperty(Run.prototype, "exists", {
  get() {
    return __step_Run\$exists.call(this);
  },
  configurable: true,
  enumerable: false
});
var __step_Run\$status = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//@workflow/core/runtime/run@5.2.3//Run#status");
Object.defineProperty(Run.prototype, "status", {
  get() {
    return __step_Run\$status.call(this);
  },
  configurable: true,
  enumerable: false
});
var __step_Run\$returnValue = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//@workflow/core/runtime/run@5.2.3//Run#returnValue");
Object.defineProperty(Run.prototype, "returnValue", {
  get() {
    return __step_Run\$returnValue.call(this);
  },
  configurable: true,
  enumerable: false
});
var __step_Run\$workflowName = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//@workflow/core/runtime/run@5.2.3//Run#workflowName");
Object.defineProperty(Run.prototype, "workflowName", {
  get() {
    return __step_Run\$workflowName.call(this);
  },
  configurable: true,
  enumerable: false
});
var __step_Run\$createdAt = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//@workflow/core/runtime/run@5.2.3//Run#createdAt");
Object.defineProperty(Run.prototype, "createdAt", {
  get() {
    return __step_Run\$createdAt.call(this);
  },
  configurable: true,
  enumerable: false
});
var __step_Run\$startedAt = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//@workflow/core/runtime/run@5.2.3//Run#startedAt");
Object.defineProperty(Run.prototype, "startedAt", {
  get() {
    return __step_Run\$startedAt.call(this);
  },
  configurable: true,
  enumerable: false
});
var __step_Run\$completedAt = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//@workflow/core/runtime/run@5.2.3//Run#completedAt");
Object.defineProperty(Run.prototype, "completedAt", {
  get() {
    return __step_Run\$completedAt.call(this);
  },
  configurable: true,
  enumerable: false
});
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

// ../../node_modules/.pnpm/@workflow+core@5.2.3_supports-color@8.1.1_ws@8.22.0/node_modules/@workflow/core/dist/workflow/create-hook.js
aliasSerializationClass(RUN_CLASS_ID, Run);
function createHook(options) {
  const createHookFn = globalThis[WORKFLOW_CREATE_HOOK];
  if (!createHookFn) {
    throwNotInWorkflowContext("createHook()", "https://workflow-sdk.dev/docs/api-reference/workflow/create-hook", createHook);
  }
  return createHookFn(options);
}
__name(createHook, "createHook");

// ../../node_modules/.pnpm/@workflow+world@5.0.5/node_modules/@workflow/world/dist/attributes-validation.js
var RESERVED_ATTRIBUTE_KEY_PREFIX = "\$";
var ROOT_RUN_ID_ATTRIBUTE = \`\${RESERVED_ATTRIBUTE_KEY_PREFIX}rootRunId\`;
var PARENT_RUN_ID_ATTRIBUTE = \`\${RESERVED_ATTRIBUTE_KEY_PREFIX}parentRunId\`;
var RETENTION_ATTRIBUTE = \`\${RESERVED_ATTRIBUTE_KEY_PREFIX}retention\`;
var textEncoder = new TextEncoder();

// ../../node_modules/.pnpm/workflow@5.2.3_@aws-sdk+credential-provider-web-identity@3.972.49_@nestjs+common@12.3.2_1e057cc79bedd54d62c32937a6d55130/node_modules/workflow/dist/stdlib.js
var fetch = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//./node_modules/.pnpm/workflow@5.2.3_@aws-sdk+credential-provider-web-identity@3.972.49_@nestjs+common@12.3.2_1e057cc79bedd54d62c32937a6d55130/node_modules/workflow/dist/stdlib//fetch");

// src/features/execution/steps.ts
function hookToken(requestId, revision) {
  return \`review:\${requestId}:\${revision}\`;
}
__name(hookToken, "hookToken");
var markWakeDeliveredStep = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//./src/features/execution/steps//markWakeDeliveredStep");
var startCreatingStep = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//./src/features/execution/steps//startCreatingStep");
var erpWriteStep = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//./src/features/execution/steps//erpWriteStep");
erpWriteStep.maxRetries = 3;
var finishStep = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//./src/features/execution/steps//finishStep");

// src/features/execution/review.workflow.ts
async function reviewWorkflow(requestId, revision) {
  const { workflowRunId } = getWorkflowMetadata();
  const hook = createHook({
    token: hookToken(requestId, revision)
  });
  const conflict = await hook.getConflict();
  if (conflict) return {
    outcome: "duplicate_run"
  };
  const wake = await hook;
  await markWakeDeliveredStep(requestId, revision, workflowRunId);
  if (wake.decision !== "approve") return {
    outcome: wake.decision
  };
  const command = await startCreatingStep(requestId, revision, workflowRunId);
  if (!command) return {
    outcome: "not_approved"
  };
  const result = await erpWriteStep(command);
  await finishStep(requestId, revision, result);
  return {
    outcome: result.outcome
  };
}
__name(reviewWorkflow, "reviewWorkflow");
reviewWorkflow.workflowId = "workflow//./src/features/execution/review.workflow//reviewWorkflow";
globalThis.__private_workflows.set("workflow//./src/features/execution/review.workflow//reviewWorkflow", reviewWorkflow);

// tests/workflow/smoke.workflow.ts
async function smokeWorkflow(token) {
  const hook = createHook({
    token
  });
  const conflict = await hook.getConflict();
  if (conflict) return {
    outcome: "duplicate_run"
  };
  const wake = await hook;
  const stamped = await stampStep(wake.decision);
  return {
    outcome: "resumed",
    stamped
  };
}
__name(smokeWorkflow, "smokeWorkflow");
smokeWorkflow.workflowId = "workflow//./tests/workflow/smoke.workflow//smokeWorkflow";
globalThis.__private_workflows.set("workflow//./tests/workflow/smoke.workflow//smokeWorkflow", smokeWorkflow);
var stampStep = globalThis[/* @__PURE__ */ Symbol.for("WORKFLOW_USE_STEP")]("step//./tests/workflow/smoke.workflow//stampStep");
`;

export const POST = workflowEntrypoint(workflowCode, { routeModuleBodyStartedAt: workflowRouteModuleBodyStartedAt });
export const GET = POST;
export const HEAD = POST;
export const OPTIONS = POST;