(ns hyinterpreter.subs
  (:require [re-frame.core :as rf]))

(rf/reg-sub
 ::compiled-python
 (fn [db _]
   (get-in db [:sidebar :python])))

(rf/reg-sub
 ::sidebar-tab
 (fn [db _]
   (get-in db [:sidebar :tab])))

(rf/reg-sub
 ::stdout
 (fn [db _]
   (let [stdout (get-in db [:sidebar :stdout])
         last-value (get-in db [:sidebar :last-value])]
     (if-not (nil? last-value)
       (str stdout "=> " last-value)
       stdout))))

(rf/reg-sub
 ::compiling?
 (fn [db _] (:compiling? db)))
