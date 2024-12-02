/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.41630901287553, "KoPercent": 8.583690987124463};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.39221140472878996, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "past-exams-examiner"], "isController": false}, {"data": [0.5, 500, 1500, "upcoming-exams-examiner"], "isController": false}, {"data": [0.0125, 500, 1500, "all-questions-examiner"], "isController": false}, {"data": [0.5, 500, 1500, "upcoming-exams-limit-5-examiner"], "isController": false}, {"data": [0.5, 500, 1500, "past-exams-limit-5-examiner"], "isController": false}, {"data": [0.5, 500, 1500, "fetch-exam-examiner/1"], "isController": false}, {"data": [0.5, 500, 1500, "create-session"], "isController": false}, {"data": [0.0, 500, 1500, "https://eexam-five.vercel.app/"], "isController": false}, {"data": [0.925, 500, 1500, "get-examiner/MMM"], "isController": false}, {"data": [0.0, 500, 1500, "update-exam/3"], "isController": false}, {"data": [0.5, 500, 1500, "/upcoming-exams-limit-5-examiner"], "isController": false}, {"data": [0.775, 500, 1500, "upcoming-exams"], "isController": false}, {"data": [0.5, 500, 1500, "create-question"], "isController": false}, {"data": [0.5, 500, 1500, "fetch-exam-examiner/3"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://eexam-five.vercel.app/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://eexam-five.vercel.app/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://eexam-five.vercel.app/-2"], "isController": false}, {"data": [0.025, 500, 1500, "hall-questions-examiner"], "isController": false}, {"data": [0.5375, 500, 1500, "https://eexam-five.vercel.app/-3"], "isController": false}, {"data": [0.0, 500, 1500, "create-exam"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 699, 60, 8.583690987124463, 1497.6981402002873, 22, 5519, 905.0, 4583.0, 5012.0, 5290.0, 17.390655321689806, 2381.970247036249, 15.619679126548737], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["past-exams-examiner", 40, 0, 0.0, 978.7750000000001, 887, 1369, 970.5, 1022.0, 1282.1999999999994, 1369.0, 2.5534631343759977, 2.696097989147782, 1.6682293329077562], "isController": false}, {"data": ["upcoming-exams-examiner", 100, 0, 0.0, 964.2799999999997, 889, 1371, 923.5, 1153.4, 1270.85, 1370.99, 4.249893752656183, 2.854152279005525, 2.85788753718657], "isController": false}, {"data": ["all-questions-examiner", 80, 0, 0.0, 2959.9375000000005, 1243, 4141, 2904.0, 3940.9, 4032.4500000000003, 4141.0, 2.692333580130578, 572.7051011307801, 1.804967776132463], "isController": false}, {"data": ["upcoming-exams-limit-5-examiner", 20, 0, 0.0, 687.2499999999999, 663, 845, 676.5, 697.5, 837.6499999999999, 845.0, 16.129032258064516, 13.210370463709678, 10.316910282258064], "isController": false}, {"data": ["past-exams-limit-5-examiner", 40, 0, 0.0, 685.775, 660, 732, 683.5, 703.3, 712.6999999999999, 732.0, 2.4777006937561943, 1.438953713453915, 1.638089228196234], "isController": false}, {"data": ["fetch-exam-examiner/1", 20, 0, 0.0, 677.4, 663, 694, 677.5, 689.5, 693.8, 694.0, 15.09433962264151, 20.73555424528302, 9.507665094339623], "isController": false}, {"data": ["create-session", 19, 0, 0.0, 1062.5789473684208, 883, 1302, 1094.0, 1252.0, 1302.0, 1302.0, 9.051929490233444, 6.025934969032872, 4.375688571939018], "isController": false}, {"data": ["https://eexam-five.vercel.app/", 20, 0, 0.0, 5118.650000000001, 4647, 5519, 5168.0, 5420.5, 5514.25, 5519.0, 3.4891835310537336, 5471.572694958129, 14.638215282623866], "isController": false}, {"data": ["get-examiner/MMM", 20, 0, 0.0, 473.3, 448, 570, 457.5, 562.3000000000001, 569.8, 570.0, 9.229349330872173, 5.278935452238118, 5.7683433317951085], "isController": false}, {"data": ["update-exam/3", 40, 40, 100.0, 852.25, 716, 927, 853.5, 923.0, 925.9, 927.0, 9.168003667201466, 4.044128180151271, 18.82842940637176], "isController": false}, {"data": ["/upcoming-exams-limit-5-examiner", 20, 0, 0.0, 680.1, 667, 696, 679.0, 695.8, 696.0, 696.0, 8.594757198109154, 2.7253102170176193, 5.934075526428878], "isController": false}, {"data": ["upcoming-exams", 40, 0, 0.0, 536.7249999999997, 446, 644, 472.0, 638.8, 641.9, 644.0, 2.488645554656878, 1.4137159366639707, 1.6137311018478193], "isController": false}, {"data": ["create-question", 20, 0, 0.0, 921.0500000000001, 902, 983, 918.5, 942.0, 981.0, 983.0, 12.894906511927788, 10.208887411347519, 11.04378223726628], "isController": false}, {"data": ["fetch-exam-examiner/3", 20, 0, 0.0, 816.0499999999998, 689, 922, 878.5, 883.9, 920.1, 922.0, 6.029544769369913, 10.726583697618329, 3.7979066174253844], "isController": false}, {"data": ["Test", 20, 20, 100.0, 36093.8, 34082, 37774, 36349.5, 37049.8, 37738.3, 37774.0, 0.5253066477556274, 1278.9896424303313, 13.017242369920941], "isController": true}, {"data": ["https://eexam-five.vercel.app/-0", 40, 0, 0.0, 115.80000000000001, 22, 382, 113.0, 161.9, 370.49999999999994, 382.0, 34.57216940363008, 32.603851555747625, 19.818226015557475], "isController": false}, {"data": ["https://eexam-five.vercel.app/-1", 40, 0, 0.0, 2509.675000000001, 27, 5315, 2323.5, 5117.1, 5283.849999999999, 5315.0, 7.156915369475756, 2806.86952048667, 11.14773438897835], "isController": false}, {"data": ["https://eexam-five.vercel.app/-2", 40, 0, 0.0, 4859.400000000001, 4417, 5384, 4933.0, 5109.099999999999, 5287.849999999999, 5384.0, 7.146685724495265, 5091.734411291763, 4.236365463641236], "isController": false}, {"data": ["hall-questions-examiner", 20, 0, 0.0, 2368.0499999999997, 1327, 2987, 2456.5, 2656.2000000000003, 2970.6499999999996, 2987.0, 4.467277194549922, 1.4252533783783783, 3.0538027697118606], "isController": false}, {"data": ["https://eexam-five.vercel.app/-3", 40, 0, 0.0, 671.1999999999999, 196, 1397, 636.5, 911.9, 1206.449999999999, 1397.0, 18.41620626151013, 1299.6554155156537, 10.934622467771637], "isController": false}, {"data": ["create-exam", 20, 20, 100.0, 512.9000000000001, 450, 644, 481.5, 610.9, 642.35, 644.0, 17.969451931716083, 7.926563903863432, 22.812780772686434], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 60, 100.0, 8.583690987124463], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 699, 60, "400/Bad Request", 60, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["update-exam/3", 40, 40, "400/Bad Request", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["create-exam", 20, 20, "400/Bad Request", 20, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
