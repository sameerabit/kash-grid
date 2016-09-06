/**
 * Created by Emerge-OS on 9/1/2016.
 */
import angular from  'angular';
import material from  'angular-material';
import main from './main.js';

import 'angular-ui-grid/ui-grid.css!';
import './material-icons.css!'
import 'angular-material/angular-material.css!';



angular.element(document).ready(function () {
    let module = 'angular.grid.kash';
    let body = document.getElementsByTagName('body')[0];
    let app = angular.module(module, [
        'ngTouch',
        'ui.grid',
        material,
        main,
    ]);
    angular.bootstrap(body, [app.name]);
});


