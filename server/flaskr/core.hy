(import os
        config
        [flaskr [interpreter]]
        [flask [Flask]]
        [flask-cors [CORS]])

(require [hy.contrib.walk [let]])

(defn create-app []
  (let [app (Flask --name--)]
    (setv app.secret-key (os.urandom 24))
    (CORS app)

    (try
      (os.makedirs app.instance-path)
      (except [e OSError]))

    #@((app.route "/hello")
        (defn hello []
          "Hello, World!"))

    (app.register-blueprint interpreter.bp)

    app))
