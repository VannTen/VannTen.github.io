/* Création et insertion des éléments affichés */
function make_proba_table()
{
	var result_table;
	var result = calculate_proba();
	
	add_proba_table(result[0]);
	add_moyenne(result[1]);
}

function add_proba_table(chances_for_deaths)
{
	console.log(chances_for_deaths)
	var mort = document.createElement("IMG");
	var section = document.getElementById("tables");
	var result_table;
	
	mort.setAttribute("src", "./images/smileys/hordes/h_death.gif");
	mort.setAttribute("alt", "Mort");
	result_table = document.getElementById("result_table");
	if (result_table != null)
		result_table.parentNode.removeChild(result_table);
	result_table = make_table(chances_for_deaths.length, 2);
	result_table.setAttribute("id","result_table");
	fill_table_column(result_table, 0, mort, false);
	fill_table_column(result_table, 1, chances_for_deaths, true);
	section.appendChild(result_table);
}

function add_moyenne(moyenne)
{
	var section = document.getElementById("textes");
	var moyenne_pond_par;
	
	moyenne_pond_par = document.getElementById("moyenne");
	if (moyenne_pond_par != null)
		moyenne_pond_par.parentNode.removeChild(moyenne_pond_par);
	moyenne_pond_par = document.createElement("P");
	moyenne_pond_par.appendChild(document.createTextNode("Morts en moyenne : " + moyenne));
	moyenne_pond_par.setAttribute("id", "moyenne");
	moyenne_pond_par.firstChild = "Morts en moyenne : " + moyenne;
	section.appendChild(moyenne_pond_par);
}

/*Récupération des valeurs du formulaire, traitement, arrondi, et renvoie d'un tableau de résultat */
function calculate_proba()
{
	var chances_table;
	var proba_array=[];
	var result;
	var answer;
	
	answer = new Array(2);
	chances_table = document.getElementsByClassName("chances");
	for (i = 0; i < chances_table.length; i++)
	{
		if(chances_table[i].value > 0 && chances_table[i].value < 100)
			proba_array.push(1 - chances_table[i].value/100);
	}
	result = proba_map(proba_array.length, proba_array);
	answer[1] = moyenne_pond(result);
	answer[0] = result;
	for (i = 0; i < result.length; i++)
		result[i] = (Math.round(result[i]*10000))/100;
	return answer;
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

/* La fonction crée un tableau de probabilités en s'appuyant sur la précédente colone à chaque fois. 
La formule générale est P(n, k) = P(n, k - 1) *  (1 - P(k)) + P(n - 1, k - 1) * P(k).
Où n est le nombre de morts, k le nombre de veilleurs, et P(n, k) la probabilité qu'il y ait n mort parmi les k premiers veilleurs.
Donc la probabilité qu'il y ait n morts parmi les k premiers veilleurs est égale à la probabilité qu'il y ait n morts parmi les k-1 premiers veilleurs,
et que le k ème veilleur survive, plus la probabilité qu'il y ait n - 1 morts parmi les k-1 premiers veilleurs, et que le k ème veilleur meure.
Le cas initial P(0,0) est géré à part. (La probabilité de 0 morts sur 0 veilleurs est de 1)
Le cas P(0, k) est géré par la première boucle : on admet que P(-1, k) vaut toujours 0. Donc P(n, k) = P(n, k - 1) * 1( - P(k)) + 0 * P(k), soit P(n, k - 1) * 1( - P(k))
Le cas P(n, k) avec k < n est géré par le seconde de la seconde boucle : comme le nombre de veilleurs est forcément au moins égale au nombre de morts, P(n, k) vaut toujours 0 dans
ce cas là. On saute donc à k = n, le calcul donne : P(n, k - 1) = 0, donc P(n, k) = 0 * (1 - P(k)) + P(n - 1, k - 1) * P(k), soit P(n - 1, k - 1) * P(k)

Merci à ayalti pour m'avoir mis sur la voie :)
*/
function proba_map(nbr_de_veilleurs, death_proba)
{
	var x_premiers_veilleurs;
	var nbr_de_morts;
	var proba_map;
	var results;
	
	proba_map = new Array(nbr_de_veilleurs + 1);
		for(i = 0; i <= nbr_de_veilleurs; i++)
			proba_map[i] = new Array(nbr_de_veilleurs + 1);
	// Cas initial : P(0,0) = 1
	nbr_de_morts = 0;
	x_premiers_veilleurs = nbr_de_morts;
	proba_map[nbr_de_morts][x_premiers_veilleurs] = 1;
	x_premiers_veilleurs++;
	while (x_premiers_veilleurs <= nbr_de_veilleurs) // Cas P(0, k) = P (n, k - 1) * (1 - P(k))
	{
		proba_map[nbr_de_morts][x_premiers_veilleurs] =  proba_map[nbr_de_morts][x_premiers_veilleurs - 1] * (1 - death_proba[x_premiers_veilleurs - 1]);
		x_premiers_veilleurs++;
	}
	nbr_de_morts++;
	while (nbr_de_morts <= nbr_de_veilleurs)
	{
		//Cas P(n, k) avec k < n. P(n,k) = P(n - 1, k - 1) * P(k)
		x_premiers_veilleurs = nbr_de_morts;
		proba_map[nbr_de_morts][x_premiers_veilleurs] = proba_map[nbr_de_morts - 1][x_premiers_veilleurs - 1] * death_proba[x_premiers_veilleurs - 1];
		x_premiers_veilleurs++;
		while (x_premiers_veilleurs <= nbr_de_veilleurs) // Cas général
		{
			proba_map[nbr_de_morts][x_premiers_veilleurs] = proba_map[nbr_de_morts][x_premiers_veilleurs - 1] * (1 - death_proba[x_premiers_veilleurs - 1])
														+ proba_map[nbr_de_morts - 1][x_premiers_veilleurs - 1] * death_proba[x_premiers_veilleurs - 1];
			x_premiers_veilleurs++;		
		}
		nbr_de_morts++;
	}
	results = new Array(nbr_de_veilleurs + 1);
	for (i = 0; i <= nbr_de_veilleurs; i++)
		results[i]= proba_map[i][nbr_de_veilleurs];
	return results;
}

function moyenne_pond(numeric_array)
{
	var moyenne;
	var length = numeric_array.length
	
	moyenne = 0;
	for (i = 0; i < length; i++)
		moyenne = moyenne + i * numeric_array[i];
	moyenne = Math.round(moyenne*100)/100;
	return moyenne;
}