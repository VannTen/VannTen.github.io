/* Création et insertion des éléments affichés */
function make_proba_table()
{
	var result_table;
	var mort = document.createElement("IMG");
	var result_array = calculate_proba();
	
	mort.setAttribute("src", "../images/smileys/hordes/h_death.gif");
	mort.setAttribute("alt", "Mort");
	result_table = document.getElementById("result_table");
	if (result_table != null)
		result_table.parentNode.removeChild(result_table);
	result_table = make_table(result_array.length, 2);
	result_table.setAttribute("id","result_table");
	fill_table_column(result_table, 0, mort, false);
	fill_table_column(result_table, 1, result_array, true);
	document.getElementsByTagName("section")[0].appendChild(result_table);
}

/*Récupération des valeurs du formulaire, traitement, et renvoie d'un tableau de résultat */
function calculate_proba()
{
	var chances_table;
	var proba_array=[];
	var result_array;
	var proba_tree_depth;
	
	chances_table = document.getElementsByClassName("chances");
	for (i = 0; i < chances_table.length; i++)
	{
		if(chances_table[i].value > 0 && chances_table[i].value < 100)
			proba_array.push(1 - chances_table[i].value/100);
	}
	proba_tree_depth = proba_array.length - 1;
	result_array = new Array(proba_array.length + 1);
	for (i = 0; i < result_array.length; i++)
		result_array[i] = 0;
	make_proba_tree(0,0,1); // Evenement racine : aucun succès enregistré, profondeur nulle, probabilité certaine.
	for (i = 0; i < result_array.length; i++)
		result_array[i] = Math.round(result_array[i]*10000)/100; // Conversion en pourcentage pour l'affichage et arrondi.
	return result_array;
	
	/*Simulation de construction d'un arbre de probabilités : tant qu'on a pas atteint une feuille, chaque noeud est un sous arbre ;
	Lorsqu'on atteint une feuille, on ajoute le résultat à la probabilité totale de x nombre de succès */
	function make_proba_tree(number_of_success,current_depth, current_proba) 
	{
		if (current_depth < proba_tree_depth)
		{
			make_proba_tree(number_of_success + 1, current_depth + 1, current_proba * proba_array[current_depth]);
			make_proba_tree(number_of_success, current_depth + 1, current_proba * (1-proba_array[current_depth]));
		}
		else
		{
			result_array[number_of_success + 1] += current_proba * proba_array[current_depth];
			result_array[number_of_success] += current_proba * (1 - proba_array[current_depth]);
		}
	}
}

function fill_table_column(table, nth_column, content, content_is_array)
{
	if (content_is_array == true)
	{
		for (i = 0; i < table.childNodes.length; i++)
			table.children[i].children[nth_column].innerHTML = content[i] + "%";
	}
	else
	{
		for (i = 0; i < table.childNodes.length; i++)
		{
			table.children[i].children[nth_column].appendChild(document.createTextNode(i));
			table.children[i].children[nth_column].appendChild(content.cloneNode(true));
		}
	}
	return table;
}

function make_table(number_of_rows, number_of_columns)
{
	var table = document.createElement("TABLE");
	var line;
	var cell;
	for (i = 0; i < number_of_rows; i++)
	{
		line = document.createElement("TR");
		for(j = 0; j < number_of_columns; j++)
		{
			cell = document.createElement("TD");
			line.appendChild(cell);
		}
		table.appendChild(line);
	}
	return table;
}
