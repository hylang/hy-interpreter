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
        [hy.cmdline [HyCommandCompiler HyCompile]]
        json
        functools
        hy
        [flask [Blueprint jsonify flash g redirect render-template
                request session url-for]])

(require [hy.contrib.walk [let]])

(setv bp (Blueprint "interpreter" __name__ :url-prefix "/interpreter"))

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

(defn eval-ast [ast module filename source python]
  "Evalutates a given python ast inside a certain module context
  EXECUTES ARBITRARY PYTHON CODE"
  (let [stdout (io.StringIO)
        stderr (io.StringIO)

        last-value
        (with [_ (redirect_stdout stdout) _ (redirect-stderr stderr)]
              (hy-eval ast module.__dict__ module :filename filename :source source))]
    (dict :result "SUCCESS"
          :stdout (stdout.getvalue)
          :stderr (stderr.getvalue)
          :python python
          :last_value (repr last-value))))

(defn run-command [source [filename None]]
  ;; TODO: Filter out the context from the stack trace
  ;; because we only want to show values from the repl
  ;; and not anything todo with this api
  (let [__main__ (importlib.import-module "__main__")]
    (try
      (let [hy-ast      (hy-parse source :filename filename)
            asts        (hy-compile hy-ast
                                    __main__
                                    :root ast.Interactive
                                    :get-expr True
                                    :filename filename
                                    :source source)
            python-code (ast->python #* asts)]
        ;; Filtering hy exceptions just removes the internal compiler
        ;; exceptions out of the stack frame
        (with [(filtered-hy-exceptions)]
              (try
                (eval-ast hy-ast __main__ filename source python-code)
                ;; Evaling a hy-ast is just executing python code so we need
                ;; to catch all python exceptions
                (except [e Exception]
                        (let [stack-frame (-> (sys.exc-info) (get 2) traceback.extract-tb last)]
                          (dict :result "RUNTIME_ERROR"
                                :traceback (format-repl-traceback e filename)
                                :lineno stack-frame.lineno))))))
      ;; We catch HyLangaugeErrors we when parse and then compile
      ;; the hy ast from source code
      (except [e HyLanguageError]
              (dict :result "COMPILATION_ERROR"
                    :traceback (format-repl-traceback e filename)
                    :lineno e.lineno
                    :offset e.offset
                    :arrow e.arrow-offset)))))

(with-decorator
  (bp.route "/compile" :methods ["POST"])
  (defn compile []
    (let [code (get request.json "code")
          args (json.loads (request.form.get "args" "{}"))
          out  (jsonify (run-command code "<string>"))]
      out)))
