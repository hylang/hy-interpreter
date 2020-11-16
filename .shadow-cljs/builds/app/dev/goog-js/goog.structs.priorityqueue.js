["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/structs/priorityqueue.js"],"~:js","goog.provide(\"goog.structs.PriorityQueue\");\ngoog.require(\"goog.structs.Heap\");\ngoog.structs.PriorityQueue = function() {\n  goog.structs.Heap.call(this);\n};\ngoog.inherits(goog.structs.PriorityQueue, goog.structs.Heap);\ngoog.structs.PriorityQueue.prototype.enqueue = function(priority, value) {\n  this.insert(priority, value);\n};\ngoog.structs.PriorityQueue.prototype.dequeue = function() {\n  return this.remove();\n};\n","~:source","// Copyright 2006 The Closure Library Authors. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS-IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\n/**\n * @fileoverview Datastructure: Priority Queue.\n *\n *\n * This file provides the implementation of a Priority Queue. Smaller priorities\n * move to the front of the queue. If two values have the same priority,\n * it is arbitrary which value will come to the front of the queue first.\n */\n\n// TODO(user): Should this rely on natural ordering via some Comparable\n//     interface?\n\n\ngoog.provide('goog.structs.PriorityQueue');\n\ngoog.require('goog.structs.Heap');\n\n\n\n/**\n * Class for Priority Queue datastructure.\n *\n * @constructor\n * @extends {goog.structs.Heap<number, VALUE>}\n * @template VALUE\n * @final\n */\ngoog.structs.PriorityQueue = function() {\n  goog.structs.Heap.call(this);\n};\ngoog.inherits(goog.structs.PriorityQueue, goog.structs.Heap);\n\n\n/**\n * Puts the specified value in the queue.\n * @param {number} priority The priority of the value. A smaller value here\n *     means a higher priority.\n * @param {VALUE} value The value.\n */\ngoog.structs.PriorityQueue.prototype.enqueue = function(priority, value) {\n  this.insert(priority, value);\n};\n\n\n/**\n * Retrieves and removes the head of this queue.\n * @return {VALUE} The element at the head of this queue. Returns undefined if\n *     the queue is empty.\n */\ngoog.structs.PriorityQueue.prototype.dequeue = function() {\n  return this.remove();\n};\n","~:compiled-at",1605403370269,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.structs.priorityqueue.js\",\n\"lineCount\":13,\n\"mappings\":\"AA2BAA,IAAA,CAAKC,OAAL,CAAa,4BAAb,CAAA;AAEAD,IAAA,CAAKE,OAAL,CAAa,mBAAb,CAAA;AAYAF,IAAA,CAAKG,OAAL,CAAaC,aAAb,GAA6BC,QAAQ,EAAG;AACtCL,MAAA,CAAKG,OAAL,CAAaG,IAAb,CAAkBC,IAAlB,CAAuB,IAAvB,CAAA;AADsC,CAAxC;AAGAP,IAAA,CAAKQ,QAAL,CAAcR,IAAd,CAAmBG,OAAnB,CAA2BC,aAA3B,EAA0CJ,IAA1C,CAA+CG,OAA/C,CAAuDG,IAAvD,CAAA;AASAN,IAAA,CAAKG,OAAL,CAAaC,aAAb,CAA2BK,SAA3B,CAAqCC,OAArC,GAA+CC,QAAQ,CAACC,QAAD,EAAWC,KAAX,CAAkB;AACvE,MAAA,CAAKC,MAAL,CAAYF,QAAZ,EAAsBC,KAAtB,CAAA;AADuE,CAAzE;AAUAb,IAAA,CAAKG,OAAL,CAAaC,aAAb,CAA2BK,SAA3B,CAAqCM,OAArC,GAA+CC,QAAQ,EAAG;AACxD,SAAO,IAAA,CAAKC,MAAL,EAAP;AADwD,CAA1D;;\",\n\"sources\":[\"goog/structs/priorityqueue.js\"],\n\"sourcesContent\":[\"// Copyright 2006 The Closure Library Authors. All Rights Reserved.\\n//\\n// Licensed under the Apache License, Version 2.0 (the \\\"License\\\");\\n// you may not use this file except in compliance with the License.\\n// You may obtain a copy of the License at\\n//\\n//      http://www.apache.org/licenses/LICENSE-2.0\\n//\\n// Unless required by applicable law or agreed to in writing, software\\n// distributed under the License is distributed on an \\\"AS-IS\\\" BASIS,\\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\\n// See the License for the specific language governing permissions and\\n// limitations under the License.\\n\\n/**\\n * @fileoverview Datastructure: Priority Queue.\\n *\\n *\\n * This file provides the implementation of a Priority Queue. Smaller priorities\\n * move to the front of the queue. If two values have the same priority,\\n * it is arbitrary which value will come to the front of the queue first.\\n */\\n\\n// TODO(user): Should this rely on natural ordering via some Comparable\\n//     interface?\\n\\n\\ngoog.provide('goog.structs.PriorityQueue');\\n\\ngoog.require('goog.structs.Heap');\\n\\n\\n\\n/**\\n * Class for Priority Queue datastructure.\\n *\\n * @constructor\\n * @extends {goog.structs.Heap<number, VALUE>}\\n * @template VALUE\\n * @final\\n */\\ngoog.structs.PriorityQueue = function() {\\n  goog.structs.Heap.call(this);\\n};\\ngoog.inherits(goog.structs.PriorityQueue, goog.structs.Heap);\\n\\n\\n/**\\n * Puts the specified value in the queue.\\n * @param {number} priority The priority of the value. A smaller value here\\n *     means a higher priority.\\n * @param {VALUE} value The value.\\n */\\ngoog.structs.PriorityQueue.prototype.enqueue = function(priority, value) {\\n  this.insert(priority, value);\\n};\\n\\n\\n/**\\n * Retrieves and removes the head of this queue.\\n * @return {VALUE} The element at the head of this queue. Returns undefined if\\n *     the queue is empty.\\n */\\ngoog.structs.PriorityQueue.prototype.dequeue = function() {\\n  return this.remove();\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"structs\",\"PriorityQueue\",\"goog.structs.PriorityQueue\",\"Heap\",\"call\",\"inherits\",\"prototype\",\"enqueue\",\"goog.structs.PriorityQueue.prototype.enqueue\",\"priority\",\"value\",\"insert\",\"dequeue\",\"goog.structs.PriorityQueue.prototype.dequeue\",\"remove\"]\n}\n"]