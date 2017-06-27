/**
 * INSPINIA - Responsive Admin Theme
 *
 * Main directives.js file
 * Define directives for used plugin
 *
 *
 * Functions (directives)
 *  - sideNavigation
 *  - iboxTools
 *  - minimalizaSidebar
 *  - vectorMap
 *  - sparkline
 *  - icheck
 *  - ionRangeSlider
 *  - dropZone
 *  - responsiveVideo
 *  - chatSlimScroll
 *  - customValid
 *  - fullScroll
 *  - closeOffCanvas
 *  - clockPicker
 *  - landingScrollspy
 *  - fitHeight

 *
 */


/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'PI SOLUTION | Electric Loadsheet System';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'PI SOLUTION | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function(){
                element.metisMenu();

            });
        }
    };
};

/**
 * responsibleVideo - Directive for responsive video
 */
function responsiveVideo() {
    return {
        restrict: 'A',
        link:  function(scope, element) {
            var figure = element;
            var video = element.children();
            video
                .attr('data-aspectRatio', video.height() / video.width())
                .removeAttr('height')
                .removeAttr('width')

            //We can use $watch on $window.innerWidth also.
            $(window).resize(function() {
                var newWidth = figure.width();
                video
                    .width(newWidth)
                    .height(newWidth * video.attr('data-aspectRatio'));
            }).resize();
        }
    }
}

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        //templateUrl: 'views/common/ibox_tools.html',
        templateUrl: 'views/common/ibox_loadsheet_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            },
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                }
        }
    };
};

/**
 * minimalizaSidebar - Directive for minimalize sidebar
*/
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 100);
                } else if ($('body').hasClass('fixed-sidebar')){
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 300);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};


function closeOffCanvas() {
    return {
        restrict: 'A',
        template: '<a class="close-canvas-menu" ng-click="closeOffCanvas()"><i class="fa fa-times"></i></a>',
        controller: function ($scope, $element) {
            $scope.closeOffCanvas = function () {
                $("body").toggleClass("mini-navbar");
            }
        }
    };
}

/**
 * vectorMap - Directive for Vector map plugin
 */
function vectorMap() {
    return {
        restrict: 'A',
        scope: {
            myMapData: '=',
        },
        link: function (scope, element, attrs) {
            element.vectorMap({
                map: 'world_mill_en',
                backgroundColor: "transparent",
                regionStyle: {
                    initial: {
                        fill: '#e4e4e4',
                        "fill-opacity": 0.9,
                        stroke: 'none',
                        "stroke-width": 0,
                        "stroke-opacity": 0
                    }
                },
                series: {
                    regions: [
                        {
                            values: scope.myMapData,
                            scale: ["#1ab394", "#22d6b1"],
                            normalizeFunction: 'polynomial'
                        }
                    ]
                },
            });
        }
    }
}


/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
    return {
        restrict: 'A',
        scope: {
            sparkData: '=',
            sparkOptions: '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.sparkData, function () {
                render();
            });
            scope.$watch(scope.sparkOptions, function(){
                render();
            });
            var render = function () {
                $(element).sparkline(scope.sparkData, scope.sparkOptions);
            };
        }
    }
};

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, $attrs, ngModel) {
            return $timeout(function() {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function(newValue){
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
            });
        }
    };
}

/**
 * ionRangeSlider - Directive for Ion Range Slider
 */
function ionRangeSlider($timeout) {
    return {
        restrict: 'A',
        scope: {
            rangeOptions: '='
        },
        link: function (scope, elem, attrs) {

            scope.$watch('rangeOptions', function(newValue){
                if(newValue) elem.ionRangeSlider(scope.rangeOptions);
            });
        }
    }
}

/**
 * dropZone - Directive for Drag and drop zone file upload plugin
 */
function dropZone() {
    return function(scope, element, attrs) {
        element.dropzone({
            url: "/upload",
            maxFilesize: 100,
            paramName: "uploadfile",
            maxThumbnailFilesize: 5,
            init: function() {
                scope.files.push({file: 'added'});
                this.on('success', function(file, json) {
                });
                this.on('addedfile', function(file) {
                    scope.$apply(function(){
                        alert(file);
                        scope.files.push({file: 'added'});
                    });
                });
                this.on('drop', function(file) {
                    alert('file');
                });
            }
        });
    }
}

/**
 * chatSlimScroll - Directive for slim scroll for small chat
 */
function chatSlimScroll($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '234px',
                    railOpacity: 0.4
                });

            });
        }
    };
}

/**
 * customValid - Directive for custom validation example
 */
function customValid(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
            scope.$watch(attrs.ngModel, function() {

                // You can call a $http method here
                // Or create custom validation

                var validText = "PI SOLUTION";

                if(scope.extras == validText) {
                    c.$setValidity('cvalid', true);
                } else {
                    c.$setValidity('cvalid', false);
                }

            });
        }
    }
}


/**
 * fullScroll - Directive for slimScroll with 100%
 */
function fullScroll($timeout){
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '100%',
                    railOpacity: 0.9
                });

            });
        }
    };
}

/**
 * clockPicker - Directive for clock picker plugin
 */
function clockPicker() {
    return {
        restrict: 'A',
        link: function(scope, element) {
                element.clockpicker();
        }
    };
};


/**
 * landingScrollspy - Directive for scrollspy in landing page
 */
function landingScrollspy(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.scrollspy({
                target: '.navbar-fixed-top',
                offset: 80
            });
        }
    }
}

/**
 * fitHeight - Directive for set height fit to window height
 */
function fitHeight(){
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.css("height", $(window).height() + "px");
            element.css("min-height", $(window).height() + "px");
        }
    };
}

/**
 * WizardSteps
 * */
function wizardSteps($timeout){
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                    $(element).steps({
                        headerTag: "h3",
                        bodyTag: "fieldset",
                        transitionEffect: "slideLeft",
                        autoFocus: true
                    });
                });

        }
    };
}

function simpletable(){
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl){

            var defaultScrollY = "450px";
            var tableType = "default";
            var pageSize = 10;
            var tableOption;
            var table;

            if(attrs.tabletype && attrs.tabletype == "scroll"){
                if(attrs.scrolly) defaultScrollY = attrs.scrolly;

                tableOption = {
                    "info": false,
                    "ordering":  false,
                    "searching": false,
                    "scrollY": defaultScrollY,
                    "scrollCollapse": true,
                    "paging": false
                }

            }else if(attrs.tabletype && attrs.tabletype == "paging"){
                if(attrs.pagesize) pageSize = attrs.pagesize;
                tableOption = {
                    "ordering":  false,
                    "searching": false,
                    "lengthChange": true,
                    "paging": true,
                    "pageLength" : pageSize
                }
            }else if(attrs.tabletype && attrs.tabletype == "native"){
                tableOption = undefined;
            }

            scope.$watch(attrs.ngModel, function(newValue) {
                if(!isEmpty(newValue)){
                    if(!table){
                        render();
                    }
                }
            });

            function render(){
                if(tableOption){
                    table = element.DataTable(tableOption);
                }else{
                    table = element.DataTable();
                }
                table.oLanguage = {
                    "sProcessing": "正在加载中......",
                        "sLengthMenu": "每页显示 _MENU_ 条记录",
                        "sZeroRecords": "对不起，查询不到相关数据！",
                        "sEmptyTable": "表中无数据存在！",
                        "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
                        "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
                        "sSearch": "搜索",
                        "oPaginate": {
                        "sFirst": "首页",
                            "sPrevious": "上一页",
                            "sNext": "下一页",
                            "sLast": "末页"
                    }
                }
            }
        }
    }
}

function scrolldatatable($timeout){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            var defaultScrollY = "450px";
            if(attrs.scrolly) defaultScrollY = attrs.scrolly;
            var table;

            $timeout(function(){
                render();
                //hide the empty message
                element.find(".dataTables_empty").closest("tr").hide();
            }, 500);

            function render(){
                table = element.DataTable({
                    "info": false,
                    "ordering":  false,
                    "searching": false,
                    "scrollY": defaultScrollY,
                    "scrollCollapse": true,
                    "paging": false
                });
            }
        }
    }
}


function tabaction(){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            element.bind("keydown keypress", function (event) {
                if(event.which === 9 || event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.tabaction);
                    });

                    event.preventDefault();
                }
            });
        }
    }
}

function saveConfirm(){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            element.click(function(){
                scope.saveConfirmation(scope, attrs.modalConfirmAction);
            })
        }
    }
}

function deleteConfirm(){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            element.click(function(){
                scope.deleteConfirmation(scope, attrs.modalConfirmAction);
            })
        }
    }
}

function rangeLimitation(){
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl){

            scope.$watch(attrs['ngModel'], function(newValue){
                if(isEmpty(newValue)){
                    element.val("");
                    ctrl.$setViewValue(0);
                    return;
                }

                if(attrs['ngMaxNumber']){
                    if(!isEmpty(newValue) && newValue > attrs['ngMaxNumber']) {
                        element.val(attrs['ngMaxNumber']);
                        ctrl.$setViewValue(element.val());
                    }
                }

                if(attrs['ngMinNumber']){
                    if(!isEmpty(newValue) && newValue < attrs['ngMinNumber']) {
                        element.val(attrs['ngMinNumber']);
                        ctrl.$setViewValue(element.val());

                    }
                }
            });

        }
    }
}

function isEmpty(value) {
    return angular.isUndefined(value) || value === '' || value === null || value !== value || value.length == 0;
}

function uppercase($parse){
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if (inputValue === undefined) { inputValue = ''; }

                var capitalized = inputValue.toUpperCase();

                if(capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
        }
    }
}

function autocomplete($parse){
    return {
        restrict: "A",
        require: 'ngModel',
        scope:{
            datalist: "=",
            ngModel: "="
        },
        link: function(scope, element, attrs, modelCtrl) {
            scope.$watch('ngModel', function(newValue){
                if(newValue){
                    if(angular.isArray(scope.datalist)){
                        if(scope.datalist.length > 0){
                            var container = element.parent();
                            if(container.find("#autocompletelist").length > 0){
                                var ul = $(container.find("#autocompletelist")[0]);
                                ul.html("");

                                filterResult(ul, scope.datalist, newValue, scope.ngModel);
                            }else{
                                var ul = $("<ul/>");
                                ul.attr("id", "autocompletelist");
                                ul.addClass("autocompletelist");

                                filterResult(ul, scope.datalist, newValue, scope.ngModel);

                                ul.css({
                                    "position" : "absolute",
                                    "width": element[0].clientWidth + 2,
                                    "top" : element[0].offsetTop + element[0].clientHeight + 2 ,
                                    "left" : element[0].offsetLeft
                                });
                                container.append(ul);
                            }
                        }
                    }
                }
            });



            function filterResult(container, list, code, target){
                for(var i = 0; i < list.length; i++){
                    if(list[i].code4.indexOf(code) > -1){
                        var li = $("<li/>");
                        li.text(list[i].nameCn);
                        li.attr("code", list[i].code4);
                        li.on("click", function(){
                            target = $(this).attr("code");
                            modelCtrl.$setViewValue(target);
                            modelCtrl.$render();
                            container.remove();
                        })
                        container.append(li);
                    }
                }
            }
        }
    }
}

function paging($cookies){
    return {
        restrict: "E",
        link: function(scope, element, attrs){

            scope.$watch(attrs.totalSize, function(newValue){
                if(newValue){
                    element.paging(newValue, {
                        format: '[< nncnn >]',
                        page: $cookies.get(attrs.prefix || "" +"currentPage") || 1,
                        onSelect: onSelect,
                        onFormat: onFormat
                    });
                }

                //when user navigate to a new page
                if(newValue == undefined){
                    $cookies.remove(attrs.prefix || "" + "currentPage");
                }
            });

            var onSelect = function(page){
                // add code which gets executed when user selects a page
                $cookies.put(attrs.prefix || "" +"currentPage", page);
                scope.$eval(attrs.onselect + "(" + page +")");
                //scope.gotoPage(page);
            }

            var onFormat = function(type){
                switch (type) {
                    // n and c
                    case 'block':{
                        var isCurrent = false;
                        if(this.page == this.value){
                            return '<a href="#" class="current">' + this.value + '</a>';
                        }else{
                            return '<a href="#">' + this.value + '</a>';
                        }
                    }
                    case 'next': // >
                        return '<a href="#">下一页</a>';
                    case 'prev': // <
                        return '<a href="#">上一页</a>';
                    case 'first': // [
                        return '<a href="#">首页</a>';
                    case 'last': // ]
                        return '<a href="#">末页</a>';
                }
            }

        }
    }
}


function pajinate(){
    return {
        restrict: "A",
        link: function(scope, element, attrs){

            scope.$watch(attrs.source, function(newValue){
                if(newValue){
                    var pageSize = 10;
                    if(attrs.pageSize) pageSize = attrs.pageSize;

                    element.pajinate({
                        abort_on_small_lists: true,
                        items_per_page : pageSize,
                        num_page_links_to_display: 5,
                        nav_label_first : '首页',
                        nav_label_last : '末页',
                        nav_label_prev : '上一页',
                        nav_label_next : '下一页'
                    });
                }
            })

        }
    }
}

/**
 *
 * Pass all functions into module
 */
angular
    .module('piApp')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('vectorMap', vectorMap)
    .directive('sparkline', sparkline)
    .directive('icheck', icheck)
    .directive('ionRangeSlider', ionRangeSlider)
    .directive('dropZone', dropZone)
    .directive('responsiveVideo', responsiveVideo)
    .directive('chatSlimScroll', chatSlimScroll)
    .directive('customValid', customValid)
    .directive('fullScroll', fullScroll)
    .directive('closeOffCanvas', closeOffCanvas)
    .directive('clockPicker', clockPicker)
    .directive('landingScrollspy', landingScrollspy)
    .directive('fitHeight', fitHeight)
    .directive('wizardSteps', wizardSteps)
    .directive('scrolldatatable', scrolldatatable)
    .directive('simpletable', simpletable)
    .directive('tabaction', tabaction)
    .directive('saveConfirm', saveConfirm)
    .directive('deleteConfirm', deleteConfirm)
    .directive('rangeLimitation', rangeLimitation)
    .directive('uppercase', uppercase)
    .directive('autocomplete', autocomplete)
    .directive('paging', paging)
    .directive('pajinate', pajinate)
;

