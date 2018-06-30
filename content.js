var elements = document.getElementsByClassName('rwd-table results');
var table = elements[0];
var header = table.tHead.children[0];

var th = document.createElement('th');
th.innerHTML = "Rating";
header.insertBefore(th,header.children[5]);

var tableBody = table.getElementsByTagName('tbody')[0];
tr = tableBody.getElementsByTagName("tr");
for (i = 0; i < tr.length; i++) {
		if(!(tr[i].children.length == 1)){
		var td = document.createElement('td');
		var newContent = document.createTextNode(Math.random()); 
		td.appendChild(newContent);
		tr[i].insertBefore(td,tr[i].children[5]);
	}
}