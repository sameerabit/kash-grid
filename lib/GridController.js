/**
 * Created by Emerge-OS on 9/1/2016.
 */

class GridController{

    constructor($scope,uiGridConstants,$http,$q,$compile,$templateCache){

        $templateCache.put('ui-grid/ui-grid-row',
            "<div ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.uid\" ui-grid-one-bind-id-grid=\"rowRenderIndex + '-' + col.uid + '-cell'\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" role=\"{{col.isRowHeader ? 'rowheader' : 'gridcell'}}\" ui-grid-cell cell_id=\"{{row.entity.id}}_{{col.name}}\"></div>"
        );

        $scope.msg={};
        $scope.gridOptions = {
            paginationPageSizes: [10, 25, 50, 75],
            paginationPageSize: 10,
            enableFiltering: true,
            showColumnFooter: true,
            showGridFooter: true,
            enableSorting: true,
            enableGridMenu: true,
            exporterMenuCsv: true
        };
        $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
            if( col.filters[0].term ){
                return 'header-filtered';
            } else {
                return '';
            }
        };

        $scope.gridOptions.columnDefs= [
                {
                    name:'id',
                    enableCellEdit:false,
                    enableColumnResizing: false,
                    // cellTemplate:function (row,col) {
                    //     console.log(row);
                    // }
                },
                {
                    field: 'name',
                    enableCellEdit: true,
                    cellTooltip: true,
                    headerCellClass: $scope.highlightFilteredHeader,
                    enablePinning:true
                },
                // pre-populated search field
                {
                  field: 'regNo',
                    cellTooltip: true,
                    enablePinning:true
                },
                // no filter input
                {
                    field: 'address', enableFiltering: false, filter: {
                    noTerm: true,
                    cellTooltip: true,
                }},
                { name: 'registered', displayName: 'Registered' , type: 'date'},
                {
                  field:'depositAmount',
                    cellTooltip: true,
                  aggregationType: uiGridConstants.aggregationTypes.sum,
                    onClick:function (row) {
                        alert(row);
                    }
                },
            {
                field:'creditLimit',
                calculationSymbol:'*',
                cellTooltip: true,
                aggregationType: uiGridConstants.aggregationTypes.sum,
            },
            {
                field:'total',
                cellTooltip: true,
                aggregationType: uiGridConstants.aggregationTypes.sum
            }
        ];


        $scope.gridOptions.onRegisterApi= function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                console.log(colDef);
                rowEntity.total = rowEntity.depositAmount*rowEntity.creditLimit;
                $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
                $scope.$apply();
            });
            console.log(gridApi);

        };

        $scope.saveRow = function( rowEntity ) {
            // create a fake promise - normally you'd use the promise returned by $http or $resource
            var promise = $http.put('http://220.247.244.22:8089/INV_RELEASE/Saliya/filling-station-inventory/public/company/'+rowEntity.id, rowEntity).
            then(
                response=>response
            ).catch(rejection=>{
                $scope.errors = rejection.data.errors;
                for(let rowError in $scope.errors){
                    let error_message = $scope.errors[rowError].message;
                    let columnErrors = angular.fromJson(error_message);
                    for(let field in  columnErrors){
                        console.log(columnErrors[field]);
                        let element =angular.element(document.querySelector(`div[cell_id='${rowEntity.id}_${field}']`));
                        let notice = `<md-tooltip md-direction="right">${columnErrors[field]}</md-tooltip><md-icon style="font-size: 20px; margin: 0;" md-font-icon="material-icons md-warn">info_outline</md-icon>`;
                        element.children()[0].style['color']='red';
                        element.children()[0].style['display']='flex';
                        element.children().children().remove();
                        angular.element(element.children()[0]).append(notice);
                        $compile(element.contents())($scope)
                    }
                }
            });

            $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );
        };

        $scope.removeFirstRow = function() {
           let rows = $scope.gridApi.selection.getSelectedRows();
            for(let row in rows){
                var index = $scope.gridOptions.data.indexOf(rows[row]);
                $scope.gridOptions.data.splice(index, 1);
            }
            //if($scope.gridOpts.data.length > 0){
            //$scope.gridOpts.data.splice(0,1);
            //}
        };



        $http.get('http://220.247.244.22:8089/INV_RELEASE/Saliya/filling-station-inventory/public/company')
            .success(function(data) {
                $scope.gridOptions.data = data.data;
            });

       console.log('grid controller');
    }
}

GridController.$inject = ['$scope','uiGridConstants','$http','$q','$compile','$templateCache'];

export default GridController;
