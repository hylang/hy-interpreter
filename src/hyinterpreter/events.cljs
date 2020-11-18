(ns hyinterpreter.events
  (:require [re-frame.core :as rf]
            [day8.re-frame.http-fx]
            [ajax.core :as ajax]))

(goog-define REACT_APP_API_BASE "http://localhost:5000")

(rf/reg-event-db
 :init
 (fn [db _]
   {:compiling? false
    :sidebar {:tab :output
              :python ""
              :stdout ""
              :stderr ""
              :last-value nil}
    :editor {}}))

(rf/reg-event-fx
 :submit-code
 (fn [{:keys [db]} [_ code]]
   {:db (-> db
            (assoc :compiling? true)
            (assoc-in [:sidebar :tab] :output))
    :http-xhrio {:method :post
                 :uri (str REACT_APP_API_BASE "/interpreter/compile")
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
      (assoc-in [:sidebar :stdout] traceback)
      (assoc-in [:sidebar :last-value] nil)))

(defmethod compiler-response "RUNTIME_ERROR"
  [db {:strs [traceback lineno]}]
  (-> db
      (assoc-in [:sidebar :stdout] traceback)
      (assoc-in [:sidebar :last-value] nil)))

(rf/reg-event-db
 :compiler-response
 (fn [db [_ result]]
   (-> db
       (assoc :compiling? false)
       (compiler-response result))))

(rf/reg-event-db
 :server-error
 (fn [db [_ error]]
   (assoc db :compiling? false)))

(rf/reg-event-db
 ::change-tab
 (fn [db [_ tab]]
   (assoc-in db [:sidebar :tab] tab)))
