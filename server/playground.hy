;; ** Imports
(import types
        importlib
        io
        sys
        builtins
        traceback
        ast
        astor
        [pprint [pprint]]
        [contextlib [redirect-stdout redirect-stderr]]
        [hy.errors [HyMacroExpansionError HyRequireError HyLanguageError
                    filtered-hy-exceptions hy-exc-handler hy-exc-filter]]
        [hy.compiler [HyASTCompiler hy-eval hy-compile]]
        [hy.lex [hy-parse]]
        [hy.cmdline [HyCommandCompiler HyCompile]])

(require [hy.contrib.walk [let]])

;; ** Functions
(setv mylocals {"__name__" "__console__"
                "__doc__" None}
      module-name (mylocals.get "__name__" "__console__")
      module (sys.modules.setdefault module-name (types.ModuleType module-name)))

(module.--dict--.update mylocals)
(setv mylocals module.--dict--
      hy-compiler (HyASTCompiler module)
      cmdline-cache (dict)
      -compile (HyCommandCompiler module mylocals
                                  :ast-callback (fn [a b])
                                  :hy-compiler hy-compiler
                                  :cmdline-cache cmdline-cache))

(setv src #[[
(setv hello "world")
(print helloo)
(+ 1 1)
]]
      (, exec-code eval-code) (-compile src))

;; (setv stdout (io.StringIO)
;;       stderr (io.StringIO)
;;       last-value None)
;; (with [_ (redirect-stderr stdout) (redirect-stdout stderr)]
;;   (try
;;     (builtins.eval exec-code mylocals)
;;     (setv last-value (builtins.eval eval-code mylocals))
;;     (except [SystemExit]
;;       (raise))
;;     (except [e Exception]
;;       False)))

;; **
(defn ast->python [exec-ast eval-ast]
  (try
    (-> exec-ast.body
       (+ [(ast.Expr eval-ast.body)])
       (ast.Module :type_ignores [])
       astor.to-source)
    (except [Exception]
      None)))

(defn format-repl-traceback [exception filename]
  (let [tb (->> (sys.exc-info)
              last
              traceback.extract-tb
              (filter (fn [frame] (= frame.filename filename)))
              traceback.format-list
              (str.join ""))

        exc (.join "" (traceback.format-exception-only (type exception) exception))
        s ["Traceback (most recent call last):" tb exc]]
    (str.join "\n" s)))

;; ** Run Command
(defn run-command [source &optional filename]
  (setv --main-- (importlib.import-module "__main__"))
  (try
    (setv hy-ast (hy-parse source :filename filename)
          (, exec-ast eval-ast) (hy-compile hy-ast
                                            --main--
                                            :root ast.Interactive
                                            :get-expr True
                                            :filename filename
                                            :source source)
          python-code (ast->python exec-ast eval-ast))
    (except [e HyLanguageError]
      (return (dict :result "COMPILATION_ERROR"
                    :traceback (format-repl-traceback e filename)
                    :lineno e.lineno
                    :offset e.offset
                    :arrow e.arrow-offset))))

  (with [(filtered-hy-exceptions)]
    (try
      (setv stdout (io.StringIO)
            stderr (io.StringIO))
      (with [_ (redirect_stdout stdout) (redirect-stderr stderr)]
        (setv last-value (hy-eval hy-ast --main--.--dict-- --main-- :filename filename :source source)))

      (dict :result "SUCCESS"
            :stdout (stdout.getvalue)
            :stderr (stderr.getvalue)
            :python python-code
            :last_value last-value)
      (except [e Exception]

        (setv stack-frame (-> (sys.exc-info) (get 2) traceback.extract-tb last))
        (dict :result "RUNTIME_ERROR"
              :traceback (format-repl-traceback e filename)
              :lineno stack-frame.lineno)))))


(let [src "
(defn test [a b]
  (print a b c))

(test 1 2)
"
      result (run-command src "<string>")]
  (print (get result "traceback")))
