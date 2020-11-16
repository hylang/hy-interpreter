(ns hyinterpreter.events
  (:require [re-frame.core :as rf]
            [day8.re-frame.http-fx]
            [ajax.core :as ajax]))

(def APP_API_BASE  "https://ftzx6qqxhk.execute-api.us-east-2.amazonaws.com/dev")

(rf/reg-event-db
 :init
 (fn [db _]
   {:sidebar {:tab :output
              :python ""
              :stdout ""
              :stderr ""
              :last-value nil}
    :editor {}}))

(rf/reg-event-fx
 :submit-code
 (fn [{:keys [db]} [_ code]]
   {:db (-> db
            (assoc-in [:sidebar :show-twirly] true)
            (assoc-in [:sidebar :tab] :output))
    :http-xhrio {:method :post
                 :uri (str APP_API_BASE "/interpreter/compile")
                 :timeout 10000
                 :params {:code code}
                 :format (ajax/json-request-format)
                 :response-format (ajax/json-response-format)
                 :on-success [:compiler-response]
                 :on-failure [:server-error]}}))

(defmulti compiler-response
  (fn [db response]
    (get response "result")))

(defmethod compiler-response "SUCCESS"
  [db {:strs [stdout stderr python last_value]}]
  (-> db
      (assoc-in [:sidebar :python] python)
      (assoc-in [:sidebar :stdout] stdout)
      (assoc-in [:sidebar :last-value] last_value)))

(defmethod compiler-response "COMPILATION_ERROR"
  [db {:strs [traceback lineno offset arrow]}]
  (-> db
      (assoc-in [:sidebar :stdout] traceback)))

(defmethod compiler-response
  "RUNTIME_ERROR"
  [db {:strs [traceback lineno]}]
  db)

(rf/reg-event-db
 :compiler-response
 (fn [db [_ result]]
   (compiler-response db result)))

(rf/reg-event-db
 :server-error
 (fn [db [_ error]]
   db))

(rf/reg-event-db
 ::change-tab
 (fn [db [_ tab]]
   (assoc-in db [:sidebar :tab] tab)))
