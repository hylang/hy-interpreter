// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE


(function (mod) {
  if (typeof exports === "object" && typeof module === "object")
    // CommonJS
    mod(require("codemirror"));
  else if (typeof define === "function" && define.amd)
    // AMD
    define(["codemirror"], mod);
  // Plain browser env
  else mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  CodeMirror.defineMode("hy", function (options) {
    var atoms = ["False", "True", "None", "await"];
    var specialForms = [
      "lfor",
      "sfor",
      "gfor",
      "dfor",
      "setv",
      "afor",
      ",",
      "cmp",
      "unpack-iterable",
      "quote",
      "quasiquote",
      "if*",
      ".",
      "as",
      "assert",
      "break",
      "class",
      "continue",
      "def",
      "del",
      "elif",
      "else",
      "except",
      "finally",
      "for",
      "from",
      "global",
      "if",
      "import",
      "require",
      "pass",
      "raise",
      "return",
      "try",
      "while",
      "with",
      "with-decorator",
      "yield",
      "yield-from",
      "in",
    ];
    var coreSymbols = [
      "assoc",
      "nonlocal",
      "await",
      "abs",
      "all",
      "any",
      "bin",
      "bool",
      "bytearray",
      "callable",
      "chr",
      "classmethod",
      "print",
      "compile",
      "complex",
      "delattr",
      "dict",
      "dir",
      "divmod",
      "enumerate",
      "eval",
      "filter",
      "float",
      "format",
      "frozenset",
      "getattr",
      "cut",
      "globals",
      "hasattr",
      "hash",
      "help",
      "hex",
      "id",
      "input",
      "int",
      "isinstance",
      "issubclass",
      "iter",
      "len",
      "list",
      "locals",
      "map",
      "max",
      "memoryview",
      "min",
      "next",
      "object",
      "oct",
      "open",
      "ord",
      "pow",
      "property",
      "range",
      "repr",
      "reversed",
      "round",
      "set",
      "setattr",
      "slice",
      "let",
      "sorted",
      "staticmethod",
      "str",
      "sum",
      "super",
      "tuple",
      "type",
      "vars",
      "zip",
      "NotImplemented",
      "Ellipsis",
      "*map",
      "accumulate",
      "butlast",
      "calling-module",
      "calling-module-name",
      "chain",
      "coll?",
      "combinations",
      "comp",
      "complement",
      "compress",
      "constantly",
      "count",
      "cycle",
      "dec",
      "distinct",
      "disassemble",
      "drop",
      "drop-last",
      "drop-while",
      "empty?",
      "eval",
      "even?",
      "every?",
      "first",
      "flatten",
      "float?",
      "fraction",
      "gensym",
      "group-by",
      "identity",
      "inc",
      "instance?",
      "integer?",
      "integer-char?",
      "interleave",
      "interpose",
      "islice",
      "iterable?",
      "iterate",
      "iterator?",
      "juxt",
      "keyword",
      "keyword?",
      "last",
      "list?",
      "macroexpand",
      "macroexpand-1",
      "mangle",
      "merge-with",
      "multicombinations",
      "name",
      "neg?",
      "none?",
      "nth",
      "numeric?",
      "odd?",
      "parse-args",
      "partition",
      "permutations",
      "pos?",
      "product",
      "read",
      "read-str",
      "remove",
      "repeat",
      "repeatedly",
      "rest",
      "reduce",
      "second",
      "some",
      "string?",
      "symbol?",
      "take",
      "take-nth",
      "take-while",
      "tuple?",
      "unmangle",
      "xor",
      "tee",
      "zero?",
      "zip-longest",
      "+",
      "-",
      "*",
      "**",
      "/",
      "//",
      "%",
      "@",
      "<<",
      ">>",
      "&",
      "|",
      "^",
      "~",
      "<",
      ">",
      "<=",
      ">=",
      "=",
      "!=",
      "and",
      "or",
      "not",
      "is",
      "is-not",
      "in",
      "not-in",
      "get",
      "->",
      "->>",
      "as->",
      "comment",
      "cond",
      "defmacro!",
      "defmacro/g!",
      "defmain",
      "defn",
      "defn/a",
      "deftag",
      "do",
      "doc",
      "doto",
      "fn",
      "for",
      "if",
      "if-not",
      "lif",
      "lif-not",
      "try",
      "unless",
      "when",
      "while",
      "with",
      "with-decorator",
      "with-gensyms",
      "with/a",
    ];
    var haveBodyParameter = [
      "->",
      "->>",
      "as->",
      "with",
      "with-decorator",
      "with/a",
      "cond",
      "doto",
      "if-not",
      "lif",
      "lif-not",
      "when",
      "unless",
      "with-gensyms",
      "defmacro/g!",
      "defmacro!",
      "defmain",
      "comment",
      "doc",
      "defn",
      "defn/a",
      "deftag",
      "do",
      "if",
      "fn",
      "for",
      "let",
      "try",
      "while",
    ];

    CodeMirror.registerHelper(
      "hintWords",
      "hy",
      [].concat(atoms, specialForms, coreSymbols)
    );

    var atom = createLookupMap(atoms);
    var specialForm = createLookupMap(specialForms);
    var coreSymbol = createLookupMap(coreSymbols);
    var hasBodyParameter = createLookupMap(haveBodyParameter);
    var delimiter = /^(?:[\\\[\]\s"(),;@^`{}~]|$)/;
    var numberLiteral = /^(?:[+\-]?\d+(?:(?:N|(?:[eE][+\-]?\d+))|(?:\.?\d*(?:M|(?:[eE][+\-]?\d+))?)|\/\d+|[xX][0-9a-fA-F]+|r[0-9a-zA-Z]+)?(?=[\\\[\]\s"#'(),;@^`{}~]|$))/;
    var characterLiteral = /^(?:\\(?:backspace|formfeed|newline|return|space|tab|o[0-7]{3}|u[0-9A-Fa-f]{4}|x[0-9A-Fa-f]{4}|.)?(?=[\\\[\]\s"(),;@^`{}~]|$))/;

    // simple-namespace := /^[^\\\/\[\]\d\s"#'(),;@^`{}~][^\\\[\]\s"(),;@^`{}~]*/
    // simple-symbol    := /^(?:\/|[^\\\/\[\]\d\s"#'(),;@^`{}~][^\\\[\]\s"(),;@^`{}~]*)/
    // qualified-symbol := (<simple-namespace>(<.><simple-namespace>)*</>)?<simple-symbol>
    var qualifiedSymbol = /^(?:(?:[^\\\/\[\]\d\s"#'(),;@^`{}~][^\\\[\]\s"(),;@^`{}~]*(?:\.[^\\\/\[\]\d\s"#'(),;@^`{}~][^\\\[\]\s"(),;@^`{}~]*)*\/)?(?:\/|[^\\\/\[\]\d\s"#'(),;@^`{}~][^\\\[\]\s"(),;@^`{}~]*)*(?=[\\\[\]\s"(),;@^`{}~]|$))/;

    function base(stream, state) {
      if (stream.eatSpace() || stream.eat(",")) return ["space", null];
      if (stream.match(numberLiteral)) return [null, "number"];
      if (stream.match(characterLiteral)) return [null, "string-2"];
      if (stream.eat(/^"/)) return (state.tokenize = inString)(stream, state);
      if (stream.eat(/^[(\[{]/)) return ["open", "bracket"];
      if (stream.eat(/^[)\]}]/)) return ["close", "bracket"];
      if (stream.eat(/^;/)) {
        stream.skipToEnd();
        return ["space", "comment"];
      }
      if (stream.eat(/^[#'@^`~]/)) return [null, "meta"];

      var matches = stream.match(qualifiedSymbol);
      var symbol = matches && matches[0];

      if (!symbol) {
        // advance stream by at least one character so we don't get stuck.
        stream.next();
        stream.eatWhile(function (c) {
          return !is(c, delimiter);
        });
        return [null, "error"];
      }

      if (symbol === "comment" && state.lastToken === "(")
        return (state.tokenize = inComment)(stream, state);
      if (is(symbol, atom) || symbol.charAt(0) === ":")
        return ["symbol", "atom"];
      if (is(symbol, specialForm) || is(symbol, coreSymbol))
        return ["symbol", "keyword"];
      if (state.lastToken === "(") return ["symbol", "builtin"]; // other operator

      return ["symbol", "variable"];
    }

    function inString(stream, state) {
      var escaped = false,
        next;

      while ((next = stream.next())) {
        if (next === '"' && !escaped) {
          state.tokenize = base;
          break;
        }
        escaped = !escaped && next === "\\";
      }

      return [null, "string"];
    }

    function inComment(stream, state) {
      var parenthesisCount = 1;
      var next;

      while ((next = stream.next())) {
        if (next === ")") parenthesisCount--;
        if (next === "(") parenthesisCount++;
        if (parenthesisCount === 0) {
          stream.backUp(1);
          state.tokenize = base;
          break;
        }
      }

      return ["space", "comment"];
    }

    function createLookupMap(words) {
      var obj = {};

      for (var i = 0; i < words.length; ++i) obj[words[i]] = true;

      return obj;
    }

    function is(value, test) {
      if (test instanceof RegExp) return test.test(value);
      if (test instanceof Object) return test.propertyIsEnumerable(value);
    }

    return {
      startState: function () {
        return {
          ctx: { prev: null, start: 0, indentTo: 0 },
          lastToken: null,
          tokenize: base,
        };
      },

      token: function (stream, state) {
        if (stream.sol() && typeof state.ctx.indentTo !== "number")
          state.ctx.indentTo = state.ctx.start + 1;

        var typeStylePair = state.tokenize(stream, state);
        var type = typeStylePair[0];
        var style = typeStylePair[1];
        var current = stream.current();

        if (type !== "space") {
          if (state.lastToken === "(" && state.ctx.indentTo === null) {
            if (type === "symbol" && is(current, hasBodyParameter))
              state.ctx.indentTo = state.ctx.start + options.indentUnit;
            else state.ctx.indentTo = "next";
          } else if (state.ctx.indentTo === "next") {
            state.ctx.indentTo = stream.column();
          }

          state.lastToken = current;
        }

        if (type === "open")
          state.ctx = {
            prev: state.ctx,
            start: stream.column(),
            indentTo: null,
          };
        else if (type === "close") state.ctx = state.ctx.prev || state.ctx;

        return style;
      },

      indent: function (state) {
        var i = state.ctx.indentTo;

        return typeof i === "number" ? i : state.ctx.start + 1;
      },

      closeBrackets: { pairs: '()[]{}""' },
      lineComment: ";;",
    };
  });

  CodeMirror.defineMIME("text/x-hy", "hy");
});
