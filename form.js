
function make_proba_form() // Crée le formulaire s'il n'existe pas
{
	var form;
	var number_of_fields;
	var section_textes = document.getElementById("textes");
	
	number_of_fields = document.getElementById("quantity").value;
	form = document.getElementById("proba_form");
	if (form == null)
	{
		form = document.createElement("FORM");
		form.setAttribute("id","proba_form");
		form.appendChild(document.createElement("TABLE"));
		document.getElementById("tables").appendChild(form);
		var paragraphe = document.createElement("P");
		paragraphe.innerHTML = "Entrez les chances de survie pour chaque veilleur (en %)";
		section_textes.appendChild(paragraphe);
		section_textes.appendChild(make_button("make_proba_table", document.createTextNode("Ok")));
	}
	modify_table(form.firstChild, number_of_fields);
	return form;
}

function modify_table(table, number_of_rows) // Ajoute ou supprime des champs si nécessaire
{
	var line;
	var input;
	var text;
	var lines;
	
	lines = table.childNodes;
	text = document.createTextNode("Veilleur ");	
	input = make_input();
	while(lines.length > number_of_rows)
		table.removeChild(table.lastChild);
	while(lines.length < number_of_rows)
	{
		line = make_line(text, input, lines.length + 1);
		table.appendChild(line);
	}
	return table;
}

function make_line(index, element, number) // Index est un élément invariable, que précise number.
{ 
	var line;
	var cell;
	
	line = document.createElement("TR");
	cell = document.createElement("TD");
	cell.appendChild(index.cloneNode(true));
	cell.appendChild(document.createTextNode(number));
	line.appendChild(cell);
	cell = document.createElement("TD");
	cell.appendChild(element.cloneNode(true));
	line.appendChild(cell);
	return line;
}

function make_input()
{
	var input;
	
	input = document.createElement("INPUT");
	input.setAttribute("type", "number");
	input.setAttribute("min", "1");
	input.setAttribute("max", "100");
	input.setAttribute("class", "chances");
	return input;
}

function make_button(to_call,to_click)
{
	var button;
	
	button = document.createElement("BUTTON");
	button.setAttribute("onclick", to_call + "()");
	button.setAttribute("type", "button");
	button.appendChild(to_click);
	return button;
}
