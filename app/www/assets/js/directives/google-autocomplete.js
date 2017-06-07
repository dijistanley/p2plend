//
// <google-address ng-model="fullAddress" zip="vm.model.zipcode"
//  country="vm.model.country" state="vm.model.state" city="vm.model.city"
//  address1="vm.model.address_1">
// </google-address>


angular.module('app')
.directive('googleAddress', function() {
    return {
        require: 'ngModel',
        replace: true,
        scope: {
            ngModel: '=',
            placedata: '='
        },
        //template: '<input class="form-control" type="text">',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };    

            var autocomplete = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                scope.$apply(function() {
                    var place = autocomplete.getPlace();
                    var components = place.address_components;  // from Google API place object   

                    var componentForm = {
                        street_number: { key: 'short_name', value: ""},
                        route: { key: 'long_name', value: "" },
                        sublocality_level_1: {key: 'long_name', value: ""},
                        locality: { key: 'long_name', value: "" },
                        administrative_area_level_1: { key: 'long_name', value: "" },
                        country: { key: 'long_name', value: "" },
                        postal_code: { key: 'short_name', value: "" },
                    };

                    // Get each component of the address from the place details
                    // and fill the corresponding field on the form.
                    for (var i = 0; i < place.address_components.length; i++) {
                        var addressType = place.address_components[i].types[0];
                        if (componentForm[addressType]) {
                            var val = place.address_components[i][componentForm[addressType].key];
                            componentForm[addressType].value = val;
                        }
                    }

                    scope.placedata.line = componentForm.street_number.value + " " + componentForm.route.value;
                    scope.placedata.district = componentForm.sublocality_level_1.value;
                    scope.placedata.city = componentForm.locality.value;
                    scope.placedata.state = componentForm.administrative_area_level_1.value;
                    scope.placedata.country = componentForm.country.value;
                    scope.placedata.postalcode = componentForm.postal_code.value;

                    //scope.placedata.address = components[0].short_name + " " + components[1].short_name;
                    //scope.placedata.city = components[3].short_name;
                    //scope.placedata.state = components[5].short_name;
                    //scope.placedata.country = components[6].long_name;
                    //scope.placedata.zip = components[7].short_name;

                    model.$setViewValue(element.val());   
                });
            });
        }
    }
})