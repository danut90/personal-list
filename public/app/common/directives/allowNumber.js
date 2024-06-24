(function(){
  'use strict';
  angular.module('ml-app').directive('allowNumber', function(){
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          if(inputValue.toString().length>0){
            var transformedInput = inputValue.toString().match(/(\d+)/g);
            if(transformedInput === null) { transformedInput = [''];}
            if (transformedInput && transformedInput[0] !== inputValue) {
              modelCtrl.$setViewValue(transformedInput[0]);
              modelCtrl.$render();
            }
            if(transformedInput) {return transformedInput[0];}
            return '';
          }else{ return null;}
        });
      }
    };
  });
})();
