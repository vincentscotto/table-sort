var csvData;
var table;
var assignedToFilter;

function loadTable() {
    // Get the file and create the table
    var file = document.getElementById("dataFile").files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        var data;
        var extension = file.name.split('.').pop().toLowerCase();
        if (extension === 'csv') {
            // Parse the CSV file
            var csv = event.target.result;
            data = parseCsv(csv);
        } else if (extension === 'json') {
            // Parse the JSON file
            var json = event.target.result;
            data = JSON.parse(json);
        } else {
            // Unsupported file type
            alert("Unsupported file type: " + extension);
            return;
        }
        csvData = data;
        createTable();
    };
    if (file) {
        reader.readAsText(file);
    } else {
        alert("No file selected.");
    }
}


function getFileType(file) {
    // Determine the file type based on the file extension
    var fileName = file.name;
    var extension = fileName.substring(fileName.lastIndexOf(".") + 1);
    if (extension == "csv") {
        return "csv";
    } else if (extension == "json") {
        return "json";
    } else {
        console.error("Unsupported file type");
        return null;
    }
}

function parseCsv(csv) {
    // Parse the CSV and return an array of objects
    var lines = csv.split("\n");
    var headers = lines[0].split(",");
    var data = [];
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var values = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = values[j];
        }
        data.push(obj);
    }
    return data;
}


function createTable() {
    // Create the table headers and body
    table = document.createElement("table");
    var headers = Object.keys(csvData[0]);
    var headerRow = document.createElement("tr");
    for (var i = 0; i < headers.length; i++) {
        var header = document.createElement("th");
        header.innerHTML = headers[i];
        if (headers[i] == "Assigned To: Full Name") {
            header.setAttribute("data-filter", "true");
        } else {
            header.setAttribute("data-filter", "false");
            header.onclick = function() {
                sortTable(this.cellIndex);
            };
        }
        headerRow.appendChild(header);
    }
    table.appendChild(headerRow);

    var tbody = document.createElement("tbody");
    for (var i = 0; i < csvData.length; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < headers.length; j++) {
            var cell = document.createElement("td");
            cell.innerHTML = csvData[i][headers[j]];
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);

    // Populate the Assigned To dropdown
    var assignedToSelect = document.getElementById("assignedTo");
    var assignedToList = csvData.map(function(row) {
        return row["Assigned To: Full Name"];
    });
    assignedToList = [...new Set(assignedToList)];
    assignedToList.sort();
    for (var i = 0; i < assignedToList.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = assignedToList[i];
        assignedToSelect.appendChild(option);
    } // Add the table to the page
    var oldTable = document.getElementById("data");
    if (oldTable) {
        oldTable.parentNode.removeChild(oldTable);
    }
    document.body.appendChild(table);

}

function sortTable(columnIndex) {
    // Sort the table by the clicked column
    var rows = table.rows;
    var sorted = true;
    while (sorted) {
        sorted = false;
        for (var i = 1; i < rows.length - 1; i++) {
            var row1 = rows[i].cells[columnIndex].innerHTML;
            var row2 = rows[i + 1].cells[columnIndex].innerHTML;
            if (isNaN(row1)) {
                if (row1.toLowerCase() > row2.toLowerCase()) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    sorted = true;
                }
            } else {
                if (parseFloat(row1) > parseFloat(row2)) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    sorted = true;
                }
            }
        }
    }
}

function filterTable() {
    // Filter the table by the selected Assigned To value
    assignedToFilter = document.getElementById("assignedTo").value;
    var rows = table.rows;
    for (var i = 1; i < rows.length; i++) {
        if (assignedToFilter == "" || rows[i].cells[7].innerHTML == assignedToFilter) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}