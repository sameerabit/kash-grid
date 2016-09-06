/**
 * Created by Emerge-OS on 9/1/2016.
 */

import 'angular';
import 'angular-touch';
import 'angular-animate';
import 'angular-ui-grid';
import 'csv';
import 'pdfmake';
import GridController from './GridController';


let module = 'angular.grid.main';

angular.module(module,[
    'ngTouch',
    'ngAnimate',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.resizeColumns',
    'ui.grid.selection',
    'ui.grid.pinning',
    'ui.grid.exporter',
    'ui.grid.selection',
    'ui.grid.pagination',
    'ui.grid.cellNav',
    'ui.grid.pinning',
    'ui.grid.moveColumns',
    'ui.grid.rowEdit',
    'ui.grid.validate'
]).controller('GridController',GridController);

export default module;