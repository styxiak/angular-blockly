/**
 * blockly directive for AngularJS
 *
 * Author: Chris Jackson
 *
 * License: MIT
 */
angular.module("angular-blockly", [])
    .provider("ngBlockly", function () {
        this.options = {
            media: '/dupa',
            trashcan: true,
            sound: false,
            toolbox: []
        };

        this.$get = function () {
            var localOptions = this.options;
            return {
                getOptions: function () {
                    return localOptions;
                }
            };
        };

        this.setOptions = function (options) {
            this.options = options;
        };
    })

    .service('Blockly', function ($timeout) {
        'use strict';
        var me = this;
        this.holdoffChanges = false;
        this.setWorkspace = function (workspace) {
            console.error('Deprecated Blockly.setWorkspace [pch]');
            // if (Blockly.getMainWorkspace() != null && Blockly.getMainWorkspace().topBlocks_.length != 0) {
            //     Blockly.getMainWorkspace().clear();
            // }
            // Blockly.Json.setWorkspace(Blockly.getMainWorkspace(), workspace);
            //
            // // Blockly sends an immediate change - we want to filter this out
            // me.holdoffChanges = true;
            // $timeout(function () {
            //     me.holdoffChanges = false;
            // }, 500);
        };

        this.clearWorkspace = function () {
            if (Blockly.getMainWorkspace() != null && Blockly.getMainWorkspace().topBlocks_.length != 0) {
                Blockly.getMainWorkspace().clear();
            }
        };

        this.getWorkspace = function () {
            return Blockly.getMainWorkspace();
        };

        this.getJsonWorkspace = function () {
            return Blockly.Json.getWorkspace(Blockly.getMainWorkspace());
        }


        this.setToolbox = function (toolbox) {
            // return Blockly.Json.getWorkspace(Blockly.getMainWorkspace());
            return this.updateToolbox(toolbox);
        };

        this.updateToolbox = function(toolbox) {
            return Blockly.getMainWorkspace().updateToolbox(toolbox);
        };

        this.onChange = function (callback) {
            Blockly.getMainWorkspace().addChangeListener(function (event) {
                    if (me.holdoffChanges === false) {
                        // Send a notification
                        callback(Blockly.Json.getWorkspace(Blockly.getMainWorkspace()));
                    }
            });
            // $(Blockly.mainWorkspace.getCanvas()).bind("blocklyWorkspaceChange", function () {
            //     if (me.holdoffChanges === false) {
            //         // Send a notification
            //         callback(Blockly.Json.getWorkspace(Blockly.getMainWorkspace()));
            //     }
            // })
        };
        this.resizeContents = function() {
            Blockly.svgResize(Blockly.getMainWorkspace())
        }
    })

    .directive('ngBlockly', function ($window, $timeout, $rootScope, ngBlockly) {
        return {
            restrict: 'E',
            scope: { // Isolate scope
            },
            template: '<div style="height:100%" class="ng-blockly"></div>',
            link: function ($scope, element, attrs) {
                var options = ngBlockly.getOptions();
                Blockly.inject(element.children()[0], options);
                Blockly.getMainWorkspace().variableList = [];
            }
        };
    });
