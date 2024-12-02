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

    var data = {"OkPercent": 83.18022381827292, "KoPercent": 16.819776181727075};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.10142233715855827, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06625, 500, 1500, "past-exams-examiner"], "isController": false}, {"data": [0.035, 500, 1500, "upcoming-exams-examiner"], "isController": false}, {"data": [0.00125, 500, 1500, "all-questions-examiner"], "isController": false}, {"data": [0.195, 500, 1500, "upcoming-exams-limit-5-examiner"], "isController": false}, {"data": [0.21625, 500, 1500, "past-exams-limit-5-examiner"], "isController": false}, {"data": [0.085, 500, 1500, "fetch-exam-examiner/1"], "isController": false}, {"data": [0.02763819095477387, 500, 1500, "create-session"], "isController": false}, {"data": [0.0, 500, 1500, "https://eexam-five.vercel.app/"], "isController": false}, {"data": [0.325, 500, 1500, "get-examiner/MMM"], "isController": false}, {"data": [0.0, 500, 1500, "update-exam/3"], "isController": false}, {"data": [0.2975, 500, 1500, "/upcoming-exams-limit-5-examiner"], "isController": false}, {"data": [0.34875, 500, 1500, "upcoming-exams"], "isController": false}, {"data": [0.0375, 500, 1500, "create-question"], "isController": false}, {"data": [0.1625, 500, 1500, "fetch-exam-examiner/3"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.3741496598639456, 500, 1500, "https://eexam-five.vercel.app/-0"], "isController": false}, {"data": [0.24829931972789115, 500, 1500, "https://eexam-five.vercel.app/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://eexam-five.vercel.app/-2"], "isController": false}, {"data": [0.0025, 500, 1500, "hall-questions-examiner"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://eexam-five.vercel.app/-3"], "isController": false}, {"data": [0.0, 500, 1500, "create-exam"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5987, 1007, 16.819776181727075, 7436.378820778317, 25, 97580, 2938.0, 21039.0, 42070.0, 49804.159999999996, 33.37421260939852, 3261.553280387703, 26.120697877181005], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["past-exams-examiner", 400, 0, 0.0, 3028.4525, 902, 10787, 2950.0, 5020.8, 5778.45, 6824.870000000003, 3.34235769912096, 3.5293697932333967, 2.1836301764764863], "isController": false}, {"data": ["upcoming-exams-examiner", 1000, 1, 0.1, 3140.181000000003, 935, 21048, 2962.5, 4882.8, 5524.049999999998, 6501.76, 7.461851285303884, 5.03039538484498, 5.012709922863113], "isController": false}, {"data": ["all-questions-examiner", 800, 0, 0.0, 8703.842499999995, 1350, 19914, 9310.5, 12030.0, 13144.549999999997, 15267.02, 5.7331642049892855, 2558.0860164429837, 3.8435715104737747], "isController": false}, {"data": ["upcoming-exams-limit-5-examiner", 200, 0, 0.0, 3215.675000000001, 668, 18358, 2561.0, 6926.500000000002, 7407.75, 18277.610000000004, 2.754176019389399, 2.255949880881887, 1.7617043874023988], "isController": false}, {"data": ["past-exams-limit-5-examiner", 400, 0, 0.0, 1887.8275000000012, 669, 4864, 1643.5, 3122.4, 3738.5499999999993, 4370.74, 3.4025468062845037, 1.9763181413162754, 2.249535339701767], "isController": false}, {"data": ["fetch-exam-examiner/1", 200, 0, 0.0, 2428.7449999999994, 671, 5987, 2018.5, 4344.8, 4428.2, 5436.150000000001, 2.158684929141167, 2.9656409877602563, 1.3597185344688016], "isController": false}, {"data": ["create-session", 199, 61, 30.65326633165829, 8672.271356783922, 1110, 21057, 4065.0, 21046.0, 21049.0, 21055.0, 9.031086907193103, 12.028138827433628, 3.02741022804629], "isController": false}, {"data": ["https://eexam-five.vercel.app/", 200, 157, 78.5, 47350.71500000001, 14102, 97580, 42086.5, 66950.6, 79917.8, 96761.86000000015, 1.9758550512734385, 757.5833857140741, 2.4598816524569758], "isController": false}, {"data": ["get-examiner/MMM", 200, 0, 0.0, 1474.32, 453, 4388, 1150.0, 2969.7000000000003, 3169.2499999999995, 4334.960000000005, 1.9949726688744365, 1.1412451559569885, 1.246857918046523], "isController": false}, {"data": ["update-exam/3", 400, 400, 100.0, 2295.015, 698, 4765, 2319.5, 3752.8, 4025.85, 4484.010000000001, 4.139586869230451, 1.8261682366912282, 8.50151483006996], "isController": false}, {"data": ["/upcoming-exams-limit-5-examiner", 200, 0, 0.0, 1680.805000000001, 699, 4351, 1316.0, 3106.500000000001, 3776.65, 4346.82, 2.0092425155716294, 0.6372869888989351, 1.387240682137834], "isController": false}, {"data": ["upcoming-exams", 400, 57, 14.25, 3971.8525, 453, 21052, 925.5, 21037.0, 21041.95, 21050.0, 3.430678845576568, 3.181870872464514, 1.8951652890346928], "isController": false}, {"data": ["create-question", 200, 0, 0.0, 3323.4449999999997, 902, 7212, 2990.5, 5995.8, 6369.65, 6765.59, 2.1836921867493557, 1.7290406494300565, 1.8702129372843606], "isController": false}, {"data": ["fetch-exam-examiner/3", 200, 0, 0.0, 2071.590000000002, 734, 4787, 1971.5, 3612.5, 3965.8999999999996, 4761.780000000001, 2.1104170184028366, 3.7546049958846868, 1.3293154070994428], "isController": false}, {"data": ["Test", 200, 200, 100.0, 149841.385, 89809, 176376, 146806.0, 173684.2, 175058.0, 175974.32, 1.1285089575398504, 2688.171330582593, 24.248318257158978], "isController": true}, {"data": ["https://eexam-five.vercel.app/-0", 147, 0, 0.0, 9298.863945578232, 32, 37119, 7231.0, 36353.8, 36486.0, 37099.32, 2.3839641918847914, 2.248808271301612, 1.3662721013346957], "isController": false}, {"data": ["https://eexam-five.vercel.app/-1", 147, 45, 30.612244897959183, 32093.659863945588, 25, 73367, 42058.0, 67182.0, 72684.0, 73343.96, 1.9955744403567597, 439.9540999848975, 2.440087162143817], "isController": false}, {"data": ["https://eexam-five.vercel.app/-2", 147, 41, 27.891156462585034, 28976.544217687082, 5150, 43462, 42059.0, 42635.8, 42720.4, 43430.32, 1.9956286230162503, 939.8155989728282, 0.8650667203472665], "isController": false}, {"data": ["hall-questions-examiner", 200, 0, 0.0, 5225.839999999999, 1467, 11301, 4899.5, 7682.9, 10430.55, 11224.98, 2.0029042111061037, 394.70766791535226, 1.369172800560813], "isController": false}, {"data": ["https://eexam-five.vercel.app/-3", 147, 45, 30.612244897959183, 28640.27210884354, 56, 43903, 37368.0, 42074.2, 42095.2, 43058.20000000002, 1.997526871492438, 93.82646251749536, 0.8310023898982213], "isController": false}, {"data": ["create-exam", 200, 200, 100.0, 1553.5200000000002, 485, 3670, 1271.0, 2467.3, 2979.6, 3573.3800000000006, 2.124698558392028, 0.9362886728336043, 2.6973712167086297], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 599, 59.48361469712016, 10.005010856856522], "isController": false}, {"data": ["502/Bad Gateway", 1, 0.09930486593843098, 0.016702856188408218], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eexam-five.vercel.app:443 [eexam-five.vercel.app/76.76.21.22, eexam-five.vercel.app/76.76.21.93] failed: Connection timed out: connect", 221, 21.94637537239325, 3.6913312176382163], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 6, 0.5958291956305859, 0.1002171371304493], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to g16eexam-production.up.railway.app:443 [g16eexam-production.up.railway.app/35.213.168.149] failed: Connection timed out: connect", 119, 11.817279046673287, 1.987639886420578], "isController": false}, {"data": ["Assertion failed", 61, 6.05759682224429, 1.0188742274929012], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5987, 1007, "400/Bad Request", 599, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eexam-five.vercel.app:443 [eexam-five.vercel.app/76.76.21.22, eexam-five.vercel.app/76.76.21.93] failed: Connection timed out: connect", 221, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to g16eexam-production.up.railway.app:443 [g16eexam-production.up.railway.app/35.213.168.149] failed: Connection timed out: connect", 119, "Assertion failed", 61, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 6], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["upcoming-exams-examiner", 1000, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to g16eexam-production.up.railway.app:443 [g16eexam-production.up.railway.app/35.213.168.149] failed: Connection timed out: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["create-session", 199, 61, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to g16eexam-production.up.railway.app:443 [g16eexam-production.up.railway.app/35.213.168.149] failed: Connection timed out: connect", 61, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://eexam-five.vercel.app/", 200, 157, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eexam-five.vercel.app:443 [eexam-five.vercel.app/76.76.21.22, eexam-five.vercel.app/76.76.21.93] failed: Connection timed out: connect", 124, "Assertion failed", 33, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["update-exam/3", 400, 400, "400/Bad Request", 400, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["upcoming-exams", 400, 57, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to g16eexam-production.up.railway.app:443 [g16eexam-production.up.railway.app/35.213.168.149] failed: Connection timed out: connect", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://eexam-five.vercel.app/-1", 147, 45, "Assertion failed", 28, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eexam-five.vercel.app:443 [eexam-five.vercel.app/76.76.21.22, eexam-five.vercel.app/76.76.21.93] failed: Connection timed out: connect", 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, "", "", "", ""], "isController": false}, {"data": ["https://eexam-five.vercel.app/-2", 147, 41, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eexam-five.vercel.app:443 [eexam-five.vercel.app/76.76.21.22, eexam-five.vercel.app/76.76.21.93] failed: Connection timed out: connect", 39, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://eexam-five.vercel.app/-3", 147, 45, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eexam-five.vercel.app:443 [eexam-five.vercel.app/76.76.21.22, eexam-five.vercel.app/76.76.21.93] failed: Connection timed out: connect", 43, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["create-exam", 200, 200, "400/Bad Request", 199, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
