(ns hyinterpreter.core
  (:require
   [reagent.core :as r]
   [reagent.dom :as d]
   [re-frame.core :as rf]
   [re-com.core :as recom]
   [hyinterpreter.events :as events]
   [hyinterpreter.subs :as subs]
   ["react-codemirror2" :as cm]
   ["react-split-pane" :default SplitPane]
   ["codemirror/mode/javascript/javascript"]
   ["codemirror/mode/clojure/clojure"]
   ["codemirror/addon/edit/closebrackets"]))

;; -------------------------
;; Views
(defn carrot-right [size]
  [:svg {:width size :height size :viewBox "0 0 16 16"
         :class "bi bi-caret-right-fill" :fill "currentColor"
         :xmlns "http://www.w3.org/2000/svg"}
   [:path {:d "M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"}]])

(defn editor []
  (let [code (r/atom  "(setv words [\"Hello\" \"World\" \"!\"])\n(for [word words]\n  (print word))")]
    (fn []
      [:div.container-fluid.h-100
       [:div.row
        {:style {:height "3em"
                 :background-color "#424242"}}
        [:div.col {:style {:font "1.5em Roboto, sans-serif"
                           :padding ".5em"}}
         "Hy"]
        [:div.col.text-right
         [:a.btn.m-auto
          {:style {:padding-top ".7em"
                   :font "1.2em Roboto, sans-serif"
                   :color "#fff"}
           :on-click #(rf/dispatch [:submit-code @code])}
          "Run"
          [carrot-right "1.2em"]]]]
       [:div.row.h-100
        [:div#playground-editor.col.p-0
         [:> cm/Controlled
          {:value @code
           :onBeforeChange (fn [editor data value] (reset! code value))
           :onKeyDown (fn [editor event]
                        (when (and (.getModifierState event "Control")
                                   (= event.key "Enter"))
                          (rf/dispatch [:submit-code @code])))
           :className "h-100"
           :options {:mode "clojure"
                     :theme "material-darker"
                     :autoCloseBrackets true
                     :lineNumbers true}}]]]])))

(defn ^:private sidebar-python []
  (let [compiled-python @(rf/subscribe [::subs/compiled-python])]
    [:> cm/Controlled
     {:value compiled-python
      :className "h-100"
      :options {:mode "clojure"
                :theme "material-darker"
                :readOnly "nocursor"
                :autoCloseBrackets true
                :lineNumbers true}}]))

(defn ^:private sidebar-output []
  (let [stdout @(rf/subscribe [::subs/stdout])]
    [:> cm/Controlled
     {:value stdout
      :className "h-100 gutterless"
      :options {:mode "python"
                :theme "base16-dark"
                :readOnly "nocursor"
                :autoCloseBrackets true}}]))

(defn playground-sidebar []
  (let [current-tab @(rf/subscribe [::subs/sidebar-tab])]
    [:div#playground-sidebar.container-fluid.h-100
     [:div.row
      {:style {:height "3em"
               :background-color "#424242"}}
      [recom/horizontal-bar-tabs
       :model (rf/subscribe [::subs/sidebar-tab])
       :tabs [{:id :output :label "Output"}
              {:id :python :label "Python"}]
       :on-change #(rf/dispatch [::events/change-tab %])]]
     [:div.row.h-100
      [:div#playground-sidebar.col.py-0.px-2
       {:style {:background-color "#424242"}}
       (case current-tab
         :output [sidebar-output]
         :python [sidebar-python])]]]))

(defn home-page []
  ;; [playground]
  [:> SplitPane
   {:split "vertical"
    :defaultSize "50%"}
   [editor]
   [playground-sidebar]])

;; -------------------------
;; Initialize app


(defn mount-root []
  (d/render [home-page] (.getElementById js/document "app")))

(defn ^:export init! []
  (rf/dispatch-sync [:init])
  (mount-root))