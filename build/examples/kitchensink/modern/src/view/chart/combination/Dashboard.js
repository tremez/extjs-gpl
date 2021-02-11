/**
 * An example of an interactive dashboard showing companies data in a grid. Selecting a
 * row highlights the bar corresponding to that company and updates the form with the
 * company data. Additionally, a radar chart also shows the company information. The form
 * can be updated to see live changes on the dashboard.
 */
Ext.define('KitchenSink.view.chart.combination.Dashboard', {
    extend: 'Ext.Panel',
    xtype: 'combination-dashboard',
    controller: 'combination-dashboard',

    //<example>
    otherContent: [{
        type: 'Controller',
        path: 'modern/src/view/chart/combination/DashboardController.js'
    }, {
        type: 'ViewModel',
        path: 'modern/src/view/chart/combination/DashboardViewModel.js'
    }, {
        type: 'Store',
        path: 'app/store/Dashboard.js'
    }],
    //</example>

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    viewModel: {
        type: 'combination-dashboard'
    },

    items: [{
        xtype: 'container',
        flex: 2,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'cartesian',
            reference: 'barChart',
            bind: '{dashboard}',
            flex: 1,
            interactions: ['itemhighlight'],
            animation: {
                easing: 'easeOut',
                duration: 300
            },
            axes: [{
                type: 'numeric',
                position: 'left',
                fields: 'price',
                minimum: 0,
                hidden: true
            }, {
                type: 'category',
                position: 'bottom',
                fields: ['name'],
                label: {
                    fontSize: 11,
                    rotate: {
                        degrees: -45
                    },
                    renderer: 'onBarChartAxisLabelRender'
                }
            }],
            series: [{
                type: 'bar',
                style: {
                    fillStyle: '#a2b6cf'
                },
                highlight: {
                    fillStyle: '#619fff',
                    strokeStyle: 'black'
                },
                label: {
                    display: 'insideEnd',
                    field: 'price',
                    orientation: 'vertical',
                    textAlign: 'middle'
                },
                xField: 'name',
                yField: 'price'
            }],
            listeners: {
                itemhighlight: 'onChartHighlight'
            }
        }, {
            // Radar chart will render information for a selected company in the list.
            xtype: 'polar',
            reference: 'radarChart',
            flex: 1,
            store: {
                fields: ['Name', 'Data'],
                data: [
                    { 'Name': 'Price', 'Data': 100 },
                    { 'Name': 'Revenue %', 'Data': 100 },
                    { 'Name': 'Growth %', 'Data': 100 },
                    { 'Name': 'Product %', 'Data': 100 },
                    { 'Name': 'Market %', 'Data': 100 }
                ]
            },
            theme: 'Blue',
            interactions: 'rotate',
            insetPadding: '15 30 15 30',
            axes: [{
                type: 'category',
                position: 'angular',
                grid: true,
                label: {
                    fontSize: 10
                }
            }, {
                type: 'numeric',
                miniumum: 0,
                maximum: 100,
                majorTickSteps: 5,
                position: 'radial',
                grid: true
            }],
            series: [{
                type: 'radar',
                xField: 'Name',
                yField: 'Data',
                showMarkers: true,
                marker: {
                    radius: 4,
                    size: 4,
                    fillStyle: 'rgb(69,109,159)'
                },
                style: {
                    fillStyle: 'rgb(194,214,240)',
                    opacity: 0.5,
                    lineWidth: 0.5
                }
            }]
        }]
    }, {
        xtype: 'container',
        flex: 1,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'grid',
            reference: 'grid',
            flex: 2,
            bind: {
                selection: '{selected}',
                store: '{dashboard}'
            },
            columns: [{
                text: 'Company',
                flex: 1,
                dataIndex: 'name'
            }, {
                text: 'Price',
                width: null,
                dataIndex: 'price',
                formatter: 'usMoney'
            }, {
                text: 'Revenue',
                width: null,
                dataIndex: 'revenue',
                renderer: 'onColumnRender'
            }, {
                text: 'Growth',
                width: null,
                dataIndex: 'growth',
                renderer: 'onColumnRender',
                hidden: true
            }, {
                text: 'Product',
                width: null,
                dataIndex: 'product',
                renderer: 'onColumnRender',
                hidden: true
            }, {
                text: 'Market',
                width: null,
                dataIndex: 'market',
                renderer: 'onColumnRender',
                hidden: true
            }],
            listeners: {
                select: 'onGridSelect'
            }
        }, {
            xtype: 'panel',
            bodyPadding: 10,
            flex: 1,
            hidden: true,
            scrollable: 'y',
            bind: {
                hidden: '{!selected}',
                title: '{selected.name}'
            },
            defaults: {
                xtype: 'numberfield',
                decimals: 0,
                labelAlign: 'top',
                validators: {
                    type: 'range',
                    max: 100,
                    min: 0
                }
            },
            items: [{
                label: 'Price',
                name: 'price',
                bind: '{selected.price}'
            }, {
                label: 'Revenue %',
                name: 'revenue',
                bind: '{selected.revenue}'
            }, {
                label: 'Growth %',
                name: 'growth',
                bind: '{selected.growth}'
            }, {
                label: 'Product %',
                name: 'product',
                bind: '{selected.product}'
            }, {
                label: 'Market %',
                name: 'market',
                bind: '{selected.market}'
            }]
        }]
    }]
});
