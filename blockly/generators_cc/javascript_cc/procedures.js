/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating JavaScript for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.JavaScriptCC.procedures');

goog.require('Blockly.JavaScriptCC');


Blockly.JavaScriptCC['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.JavaScriptCC.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.JavaScriptCC.statementToCode(block, 'STACK');
  if (Blockly.JavaScriptCC.STATEMENT_PREFIX) {
    branch = Blockly.JavaScriptCC.prefixLines(
        Blockly.JavaScriptCC.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.JavaScriptCC.INDENT) + branch;
  }
  if (Blockly.JavaScriptCC.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScriptCC.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var returnValue = Blockly.JavaScriptCC.valueToCode(block, 'RETURN',
      Blockly.JavaScriptCC.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.JavaScriptCC.variableDB_.getName(block.arguments_[i],
        Blockly.Variables.NAME_TYPE);
  }
  var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
      branch + returnValue + '}';
  code = Blockly.JavaScriptCC.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.JavaScriptCC.definitions_['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.JavaScriptCC['procedures_defnoreturn'] =
    Blockly.JavaScriptCC['procedures_defreturn'];

Blockly.JavaScriptCC['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.JavaScriptCC.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.JavaScriptCC.valueToCode(block, 'ARG' + i,
        Blockly.JavaScriptCC.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.JavaScriptCC.ORDER_FUNCTION_CALL];
};

Blockly.JavaScriptCC['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  var funcName = Blockly.JavaScriptCC.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.JavaScriptCC.valueToCode(block, 'ARG' + i,
        Blockly.JavaScriptCC.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

Blockly.JavaScriptCC['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.JavaScriptCC.valueToCode(block, 'CONDITION',
      Blockly.JavaScriptCC.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (block.hasReturnValue_) {
    var value = Blockly.JavaScriptCC.valueToCode(block, 'VALUE',
        Blockly.JavaScriptCC.ORDER_NONE) || 'null';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};
