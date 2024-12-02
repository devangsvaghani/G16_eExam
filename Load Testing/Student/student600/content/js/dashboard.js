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

    var data = {"OkPercent": 63.899175223026425, "KoPercent": 36.100824776973575};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03301983654359522, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03438030560271647, 500, 1500, "https://g16eexam-production.up.railway.app/past-exams-limit-5-student"], "isController": false}, {"data": [0.07443820224719101, 500, 1500, "https://g16eexam-production.up.railway.app/fetch-exam-student/5"], "isController": false}, {"data": [0.03539635438745231, 500, 1500, "https://g16eexam-production.up.railway.app/upcoming-exams-limit-5-student"], "isController": false}, {"data": [0.04413423575860124, 500, 1500, "https://g16eexam-production.up.railway.app/upcoming-exams-student"], "isController": false}, {"data": [0.010256410256410256, 500, 1500, "https://g16eexam-production.up.railway.app/all-questions-student"], "isController": false}, {"data": [0.04267515923566879, 500, 1500, "https://g16eexam-production.up.railway.app/student-performance"], "isController": false}, {"data": [0.01001669449081803, 500, 1500, "create-session"], "isController": false}, {"data": [0.0, 500, 1500, "https://eexam-five.vercel.app/"], "isController": false}, {"data": [0.05128205128205128, 500, 1500, "https://g16eexam-production.up.railway.app/get-student/202200001"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://g16eexam-production.up.railway.app/submit-exam-student"], "isController": false}, {"data": [0.19161676646706588, 500, 1500, "https://eexam-five.vercel.app/-0"], "isController": false}, {"data": [0.1377245508982036, 500, 1500, "https://eexam-five.vercel.app/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://eexam-five.vercel.app/-2"], "isController": false}, {"data": [0.0688622754491018, 500, 1500, "https://eexam-five.vercel.app/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://g16eexam-production.up.railway.app/student-submit-answer"], "isController": false}, {"data": [0.019658119658119658, 500, 1500, "https://g16eexam-production.up.railway.app/exams-result"], "isController": false}, {"data": [0.05726495726495726, 500, 1500, "https://g16eexam-production.up.railway.app/add-bookmark-question"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23764, 8579, 36.100824776973575, 17066.35090893784, 19, 353270, 6868.0, 33679.9, 82567.10000000003, 190015.03000000014, 38.87624678335212, 333.48205973691375, 24.32521103756014], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://g16eexam-production.up.railway.app/past-exams-limit-5-student", 2356, 208, 8.828522920203735, 12894.814516129032, 677, 214577, 6043.5, 31843.9, 57092.90000000003, 142672.4399999997, 4.172333673353734, 3.662687005686487, 2.580210558076193], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/fetch-exam-student/5", 1780, 26, 1.4606741573033708, 9714.272471910119, 722, 161774, 6804.5, 20784.0, 37214.799999999814, 102803.27000000208, 3.266612467815609, 2.716624336239945, 2.154399311488015], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/upcoming-exams-limit-5-student", 2359, 200, 8.47816871555744, 13200.407376006768, 733, 255198, 6049.0, 33840.0, 47625.0, 189881.80000000002, 4.17249619275199, 2.343545142088618, 2.6027180368042817], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/upcoming-exams-student", 3546, 328, 9.24985899605189, 12679.272983643583, 676, 189243, 6746.0, 24679.3, 61568.549999999996, 97716.90999999993, 6.238696101958522, 3.557583711522762, 3.8401433637761526], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/all-questions-student", 585, 0, 0.0, 6914.801709401718, 980, 25203, 6822.0, 10075.0, 10901.8, 11881.8, 1.8384663733500943, 2.6387811321495915, 1.1705860111565054], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/student-performance", 2355, 151, 6.411889596602973, 12807.487473460747, 732, 135961, 6019.0, 40071.20000000001, 82745.39999999998, 95596.0, 4.169551122591885, 2.1193281711162535, 2.618777985124175], "isController": false}, {"data": ["create-session", 599, 493, 82.30383973288815, 17846.021702838054, 974, 21244, 21051.0, 21060.0, 21170.0, 21215.0, 26.74107142857143, 65.68616594587054, 2.3152378627232144], "isController": false}, {"data": ["https://eexam-five.vercel.app/", 600, 582, 97.0, 99533.66999999997, 7370, 353270, 69929.0, 279935.3, 291317.65, 343535.0, 1.6056475978173899, 214.19292175762885, 1.0496999571492798], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/get-student/202200001", 1170, 1, 0.08547008547008547, 5078.350427350432, 671, 87199, 4997.5, 7005.9, 7174.05, 8108.089999999996, 3.130996058156245, 1.4827516947854198, 2.0712220485010024], "isController": false}, {"data": ["Test", 585, 585, 100.0, 529148.7282051281, 187443, 594638, 554988.0, 589464.2, 592505.1, 594548.12, 0.9829636437874179, 157.09808345455852, 23.86663097297438], "isController": true}, {"data": ["https://g16eexam-production.up.railway.app/submit-exam-student", 1178, 1178, 100.0, 7088.044142614605, 716, 114342, 6728.5, 7839.800000000001, 10792.849999999999, 61547.06000000004, 2.2004214049821424, 0.9435344350539459, 1.5354930902938628], "isController": false}, {"data": ["https://eexam-five.vercel.app/-0", 334, 0, 0.0, 48996.3353293413, 19, 223561, 24457.0, 93870.0, 183147.75, 211930.64999999997, 1.0382053346347164, 0.9775217325673201, 0.5937346037101853], "isController": false}, {"data": ["https://eexam-five.vercel.app/-1", 334, 232, 69.46107784431138, 80669.14970059888, 36, 277566, 60583.0, 197157.5, 242998.5, 265358.34999999986, 0.9640501652451257, 89.1230293706975, 0.6408886074670592], "isController": false}, {"data": ["https://eexam-five.vercel.app/-2", 334, 232, 69.46107784431138, 78079.85628742525, 2088, 238243, 61005.0, 186655.0, 195198.0, 213019.29999999996, 0.9640501652451257, 202.13607737657128, 0.17594219938375835], "isController": false}, {"data": ["https://eexam-five.vercel.app/-3", 334, 216, 64.67065868263474, 73279.28143712577, 352, 241216, 60540.0, 186756.5, 193903.5, 230506.34999999986, 1.0052096343625194, 24.808665239986276, 0.2138292411419663], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/student-submit-answer", 4730, 4730, 100.0, 13265.164693446095, 217, 196898, 10055.0, 12052.900000000001, 35309.35, 149225.13999999998, 8.669847443678067, 4.120894739024761, 6.175050297258459], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/exams-result", 585, 2, 0.3418803418803419, 6225.516239316234, 766, 94508, 5806.0, 7087.6, 7606.099999999987, 41596.09999999969, 1.3764058161968848, 0.9117838388487601, 0.8613312498529482], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/add-bookmark-question", 585, 0, 0.0, 4506.299145299149, 681, 14613, 4238.0, 6991.6, 7177.799999999999, 8046.98, 1.8403807857954064, 0.7687608240344292, 1.2976122337346516], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 5, 0.05828185103158876, 0.021040228917690626], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eexam-five.vercel.app:443 [eexam-five.vercel.app/76.76.21.22, eexam-five.vercel.app/76.76.21.93] failed: Connection timed out: connect", 778, 9.068656020515212, 3.273859619592661], "isController": false}, {"data": ["401/Unauthorized", 5791, 67.5020398647861, 24.368793132469282], "isController": false}, {"data": ["Non HTTP response code: java.lang.RuntimeException/Non HTTP response message: Task execution failed", 36, 0.4196293274274391, 0.15148964820737248], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalArgumentException/Non HTTP response message: Self-suppression not permitted", 1, 0.011656370206317752, 0.004208045783538125], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to g16eexam-production.up.railway.app:443 [g16eexam-production.up.railway.app/35.213.168.149] failed: Connection timed out: connect", 1104, 12.868632707774799, 4.64568254502609], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 578, 6.737381979251661, 2.4322504628850363], "isController": false}, {"data": ["Assertion failed", 286, 3.333721879006877, 1.2035010940919038], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23764, 8579, "401/Unauthorized", 5791, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to g16eexam-production.up.railway.app:443 [g16eexam-production.up.railway.app/35.213.168.149] failed: Connection timed out: connect", 1104, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eexam-five.vercel.app:443 [eexam-five.vercel.app/76.76.21.22, eexam-five.vercel.app/76.76.21.93] failed: Connection timed out: connect", 778, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 578, "Assertion failed", 286], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://g16eexam-production.up.railway.app/past-exams-limit-5-student", 2356, 208, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to g16eexam-production.up.railway.app:443 [g16eexam-production.up.railway.app/35.213.168.149] failed: Connection timed out: connect", 141, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 67, "", "", "", "", "", ""], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/fetch-exam-student/5", 1780, 26, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 23, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to g16eexam-production.up.railway.app:443 [g16eexam-production.up.railway.app/35.213.168.149] failed: Connection timed out: connect", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/upcoming-exams-limit-5-student", 2359, 200, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to g16eexam-production.up.railway.app:443 [g16eexam-production.up.railway.app/35.213.168.149] failed: Connection timed out: connect", 180, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 20, "", "", "", "", "", ""], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/upcoming-exams-student", 3546, 328, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to g16eexam-production.up.railway.app:443 [g16eexam-production.up.railway.app/35.213.168.149] failed: Connection timed out: connect", 278, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 50, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/student-performance", 2355, 151, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 142, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to g16eexam-production.up.railway.app:443 [g16eexam-production.up.railway.app/35.213.168.149] failed: Connection timed out: connect", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["create-session", 599, 493, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to g16eexam-production.up.railway.app:443 [g16eexam-production.up.railway.app/35.213.168.149] failed: Connection timed out: connect", 493, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://eexam-five.vercel.app/", 600, 582, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eexam-five.vercel.app:443 [eexam-five.vercel.app/76.76.21.22, eexam-five.vercel.app/76.76.21.93] failed: Connection timed out: connect", 350, "Assertion failed", 207, "Non HTTP response code: java.lang.RuntimeException/Non HTTP response message: Task execution failed", 25, "", "", "", ""], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/get-student/202200001", 1170, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/submit-exam-student", 1178, 1178, "401/Unauthorized", 1174, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://eexam-five.vercel.app/-1", 334, 232, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eexam-five.vercel.app:443 [eexam-five.vercel.app/76.76.21.22, eexam-five.vercel.app/76.76.21.93] failed: Connection timed out: connect", 96, "Assertion failed", 79, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 46, "Non HTTP response code: java.lang.RuntimeException/Non HTTP response message: Task execution failed", 11, "", ""], "isController": false}, {"data": ["https://eexam-five.vercel.app/-2", 334, 232, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eexam-five.vercel.app:443 [eexam-five.vercel.app/76.76.21.22, eexam-five.vercel.app/76.76.21.93] failed: Connection timed out: connect", 168, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 63, "Non HTTP response code: java.lang.IllegalArgumentException/Non HTTP response message: Self-suppression not permitted", 1, "", "", "", ""], "isController": false}, {"data": ["https://eexam-five.vercel.app/-3", 334, 216, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eexam-five.vercel.app:443 [eexam-five.vercel.app/76.76.21.22, eexam-five.vercel.app/76.76.21.93] failed: Connection timed out: connect", 164, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 52, "", "", "", "", "", ""], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/student-submit-answer", 4730, 4730, "401/Unauthorized", 4617, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 108, "502/Bad Gateway", 5, "", "", "", ""], "isController": false}, {"data": ["https://g16eexam-production.up.railway.app/exams-result", 585, 2, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
