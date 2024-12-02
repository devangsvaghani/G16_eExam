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

    var data = {"OkPercent": 78.25614263970428, "KoPercent": 21.743857360295717};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.28580549052989995, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.41, 500, 1500, "https://g16eexam-production.up.railway.app/past-exams-limit-5-student"], "isController": false}, {"data": [0.41333333333333333, 500, 1500, "https://g16eexam-production.up.railway.app/fetch-exam-student/5"], "isController": false}, {"data": [0.41625, 500, 1500, "https://g16eexam-production.up.railway.app/upcoming-exams-limit-5-student"], "isController": false}, {"data": [0.42333333333333334, 500, 1500, "https://g16eexam-production.up.railway.app/upcoming-exams-student"], "isController": false}, {"data": [0.145, 500, 1500, "https://g16eexam-production.up.railway.app/all-questions-student"], "isController": false}, {"data": [0.42, 500, 1500, "https://g16eexam-production.up.railway.app/student-performance"], "isController": false}, {"data": [0.08585858585858586, 500, 1500, "create-session"], "isController": false}, {"data": [0.0, 500, 1500, "https://eexam-five.vercel.app/"], "isController": false}, {"data": [0.405, 500, 1500, "https://g16eexam-production.up.railway.app/get-student/202200001"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://g16eexam-production.up.railway.app/submit-exam-student"], "isController": false}, {"data": [0.7375, 500, 1500, "https://eexam-five.vercel.app/-0"], "isController": false}, {"data": [0.41, 500, 1500, "https://eexam-five.vercel.app/-1"], "isController": false}, {"data": [0.02, 500, 1500, "https://eexam-five.vercel.app/-2"], "isController": false}, {"data": [0.24, 500, 1500, "https://eexam-five.vercel.app/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://g16eexam-production.up.railway.app/student-submit-answer"], "isController": false}, {"data": [0.43, 500, 1500, "https://g16eexam-production.up.railway.app/exams-result"], "isController": false}, {"data": [0.38, 500, 1500, "https://g16eexam-production.up.railway.app/add-bookmark-question"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4599, 1000, 21.743857360295717, 3524.6955859969603, 18, 47637, 1175.0, 7408.0, 14566.0, 45498.0, 45.594241979616925, 3784.3381363824506, 35.804964858156204], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://g16eexam-production.up.railway.app/past-exams-limit-5-student", 400, 0, 0.0, 1168.6500000000008, 685, 2228, 1031.0, 1815.8000000000002, 1942.9, 2143.87, 5.059896525116061, 3.296888242697937, 3.439148419414823], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/fetch-exam-student/5", 300, 0, 0.0, 1188.6766666666679, 777, 2137, 1043.0, 1839.6000000000001, 1969.6499999999999, 2062.0, 4.924410301866351, 3.9084300774773886, 3.2973671845504833], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/upcoming-exams-limit-5-student", 400, 0, 0.0, 1176.8925000000004, 699, 2699, 1047.5, 1840.3000000000009, 1977.0499999999997, 2141.94, 5.067460568822448, 1.7603239611705834, 3.4603728542471655], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/upcoming-exams-student", 600, 0, 0.0, 1170.5233333333344, 689, 2582, 1039.0, 1791.3999999999999, 1962.6999999999996, 2269.6500000000005, 7.620886309077745, 2.568030302549187, 5.176100027308176], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/all-questions-student", 100, 0, 0.0, 1849.6999999999998, 1064, 3032, 1867.5, 2767.8, 2842.45, 3031.64, 2.2622898898264823, 3.2470045867927513, 1.4404423907879556], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/student-performance", 400, 0, 0.0, 1161.1725, 706, 2249, 1034.0, 1787.3000000000002, 1973.0, 2091.76, 5.045408678102927, 1.751382560229566, 3.391115744828456], "isController": false}, {"data": ["create-session", 99, 0, 0.0, 2341.3232323232323, 925, 3558, 2459.0, 3347.0, 3491.0, 3558.0, 21.985343104596936, 14.893282950255385, 10.756500874417055], "isController": false}, {"data": ["https://eexam-five.vercel.app/", 100, 0, 0.0, 30077.22, 13099, 47637, 37703.5, 46541.3, 46777.65, 47632.59, 2.012760904132198, 3076.639271890033, 8.479895349012741], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/get-student/202200001", 200, 0, 0.0, 1153.7350000000006, 671, 2129, 1016.5, 1855.7, 1924.85, 2082.3200000000006, 3.849781524898462, 1.8149238585397778, 2.5489764393370677], "isController": false}, {"data": ["Test", 100, 100, 100.0, 79236.38000000002, 58813, 97650, 87588.0, 96473.6, 96643.0, 97649.66, 1.015125367982946, 1570.0828377988275, 29.89581879377728], "isController": true}, {"data": ["https://g16eexam-production.up.railway.app/submit-exam-student", 200, 200, 100.0, 1122.4550000000002, 707, 2125, 1089.0, 1395.1000000000001, 1857.3999999999999, 2104.970000000001, 3.3836939787165647, 1.4233323675706768, 2.3692466628318134], "isController": false}, {"data": ["https://eexam-five.vercel.app/-0", 200, 0, 0.0, 6407.29, 18, 39115, 221.0, 36390.1, 37582.95, 38834.22, 4.517017864805655, 4.252679685559094, 2.589345201797773], "isController": false}, {"data": ["https://eexam-five.vercel.app/-1", 200, 0, 0.0, 12183.815000000006, 18, 46401, 8732.5, 38821.4, 43959.799999999996, 46119.69, 4.048910842983237, 1502.4289906444853, 6.342595111446271], "isController": false}, {"data": ["https://eexam-five.vercel.app/-2", 200, 0, 0.0, 15614.470000000001, 112, 46856, 13655.5, 43266.100000000006, 44971.899999999994, 46017.91, 4.0373861961765956, 2815.048462039738, 2.4032107629145893], "isController": false}, {"data": ["https://eexam-five.vercel.app/-3", 200, 0, 0.0, 7231.509999999999, 91, 40768, 1856.5, 36928.4, 38672.0, 39897.130000000005, 4.311181048048113, 284.5186035882499, 2.5874033015563365], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/student-submit-answer", 800, 800, 100.0, 1682.1224999999995, 921, 3113, 1753.5, 2071.0, 2166.85, 2872.67, 12.34053712187823, 5.190979453005692, 8.994793353849477], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/exams-result", 100, 0, 0.0, 1123.54, 836, 2125, 1013.5, 1752.3, 1900.499999999999, 2123.7599999999993, 2.1931267407943507, 1.4365408497269556, 1.37712938899489], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/add-bookmark-question", 100, 0, 0.0, 1232.82, 720, 2072, 1152.0, 1964.3000000000002, 2007.8, 2071.69, 2.370229912301493, 0.9900339239156198, 1.6711972623844513], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 1000, 100.0, 21.743857360295717], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4599, 1000, "401/Unauthorized", 1000, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/submit-exam-student", 200, 200, "401/Unauthorized", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/student-submit-answer", 800, 800, "401/Unauthorized", 800, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
