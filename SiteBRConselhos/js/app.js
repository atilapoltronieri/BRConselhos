var app = angular.module('myApp', ['ui.mask','ngAnimate', 'toaster', 'angularSpinner', 'bsTable']);

app.service('spinnerService', function () {
	this.show = function () {
		document.getElementById('mySpinner').className = "spinner-design"
	},

	this.hide = function () {
		document.getElementById('mySpinner').className = "spinner-design ng-hide"
	}
})

app.controller('contribuinteCtrl', ['$scope', '$http', '$window', '$location', 'toaster', 'spinnerService', function($scope, $http, $window, $location, toaster, spinnerService) {
	
	this.listaContribuintes = [];
	
	$scope.carregarContribuintes = function () {
			
		var source = this;	
		source.listaContribuintes = [];
		source.listaContribuintesFiltro = [];
		source.listaContribuintesShow = [];
		source.filtro = {};
		source.objetoTela = {};
		source.paginacao = {};
		source.paginacao.paginaAtual = 1;
		source.salarioMinimo = {};
		
		//spinnerService.show();
		
		$http.get("http://localhost:3318/api/Contribuinte/CarregarContribuinte")
		.success (function(response){
			 Materialize.toast('Contribuintes Carregadas', 4000, 'green');
			 //toaster.pop('success', "Contribuinte", "Contribuintes Carregados");
			 source.listaContribuintes = JSON.parse(response);
			 source.aplicarFiltro();
		 })
		.error(function(response){			
			 Materialize.toast(response, 4000, 'red');
			 //toaster.pop('error', "Login", response);
		 })
		.finally (function () {
			//spinnerService.hide();
		});
		
		
		$http.get("http://localhost:3318/api/SalarioMinimo/CarregarSalarioMinimo")
		.success (function(response){
			 source.salarioMinimo.valor = response;
		 })
		.error(function(response){			
			 source.salarioMinimo.valor = 0;
		 });
	}
	
	$scope.inserirSalarioMinimo = function () 
	{
		var source = this;
		
		var salarioMinimo = {};
		salarioMinimo.valor = source.salarioMinimo.valor;
		var salarioMinimoJson = JSON.stringify(salarioMinimo);
		
		$http.post("http://localhost:3318/api/Contribuinte/InserirSalarioMinimo?salarioMinimoJson=" + salarioMinimoJson)
		.success (function(response){
			 source.listaContribuintes = JSON.parse(response);
			 source.aplicarFiltro();
		 })
		.error(function(response){			
			 source.salarioMinimo.valor = 0;
		 });
		
	}
	
	$scope.aplicarFiltro = function() {
		var source = this;		
		source.paginacao.paginaAtual = 1;
		source.listaContribuintesFiltro = source.listaContribuintes;
		
		if (source.filtro.id != undefined && source.filtro.id != "")
			source.listaContribuintesFiltro = Enumerable.from(source.listaContribuintesFiltro).where(function (x) {return x.id == source.filtro.id}).toArray();
		if (source.filtro.nome != undefined && source.filtro.nome != "")
			source.listaContribuintesFiltro = Enumerable.from(source.listaContribuintesFiltro).where(function (x) {return x.nome.indexOf(source.filtro.nome) >= 0}).toArray();
		if (source.filtro.cpf != undefined && source.filtro.cpf != "")
			source.listaContribuintesFiltro = Enumerable.from(source.listaContribuintesFiltro).where(function (x) {return x.cpf.indexOf(source.filtro.cpf) >= 0}).toArray();
		
		source.aplicarFiltroPaginacao();
	}
	
	$scope.aplicarFiltroPaginacao = function () {
		var source = this;
		
		source.listaContribuintesShow = source.listaContribuintesFiltro;
		//spinnerService.show();
		
		source.paginacao.registroInicial = ((source.paginacao.paginaAtual - 1) * 10) + 1;
		if (source.paginacao.paginaAtual * 10 < source.listaContribuintesShow.length)
			source.paginacao.registroFinal = (source.paginacao.paginaAtual * 10);
		else
			source.paginacao.registroFinal = source.listaContribuintesShow.length;
		
		source.paginacao.registrosTotais = source.listaContribuintesShow.length;
		
		source.listaContribuintesShow = source.listaContribuintesShow.slice(source.paginacao.registroInicial - 1, source.paginacao.registroFinal)
		
		source.listaContribuintesShow = Enumerable.from(source.listaContribuintesShow).orderBy(function (x) { return x.ir}).thenBy(function (x) { return x.nome}).toArray();
		
		//spinnerService.hide();
	}
	
	$scope.validaProximaPagina = function () {
		
		var source = this;
		
		if (source.paginacao.paginaAtual * 10 < source.listaContribuintesFiltro.length)
			return false;
		
		return true;
	}
	
	$scope.validaAnteriorPagina = function () {
		
		var source = this;
		
		if (source.paginacao.paginaAtual > 1)
			return false;
		
		return true;
	}
	
	$scope.proximaPagina = function () {
		
		var source = this;
		//spinnerService.show();
		source.listaContribuintesShow = [];
		source.paginacao.paginaAtual = source.paginacao.paginaAtual + 1;
		source.aplicarFiltroPaginacao();
		
		//spinnerService.hide();
	}
	
	$scope.anteriorPagina = function () {
		
		var source = this;
		//spinnerService.show();
		source.listaContribuintesShow = [];
		source.paginacao.paginaAtual = source.paginacao.paginaAtual - 1;
		source.aplicarFiltroPaginacao();
		
		//spinnerService.hide();
	}
	
	$scope.validaSalvar = function () {
		
		var source = this;
		
		if (source.objetoTela.nome != undefined &&
			source.objetoTela.cpf != undefined &&
			source.objetoTela.numeroDependentes != undefined &&
			source.objetoTela.rendaBruta != undefined
		)		
		return false;
		
		return true;
	}
	
	$scope.validaValor = function () {
		var source = this;
		
		if (source.objetoTela.valor <= 100000)
			source.objetoTela.status = "OK";
		else
			source.objetoTela.status = "Error";
	}
	
	$scope.validaCPF = function () {
		
		var source = this;
		
		var numeros, digitos, soma, i, resultado, digitos_iguais;
		digitos_iguais = 1;
		if (cpf.length < 11)
			  return false;
		for (i = 0; i < cpf.length - 1; i++)
			  if (cpf.charAt(i) != cpf.charAt(i + 1))
					{
					digitos_iguais = 0;
					break;
					}
		if (!digitos_iguais)
			  {
			  numeros = cpf.substring(0,9);
			  digitos = cpf.substring(9);
			  soma = 0;
			  for (i = 10; i > 1; i--)
					soma += numeros.charAt(10 - i) * i;
			  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
			  if (resultado != digitos.charAt(0))
					return false;
			  numeros = cpf.substring(0,10);
			  soma = 0;
			  for (i = 11; i > 1; i--)
					soma += numeros.charAt(11 - i) * i;
			  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
			  if (resultado != digitos.charAt(1))
					return false;
			  return true;
			  }
		else {
			source.objetoTela.cpf = "";
			Materialize.toast("CPF Inválido.", 4000, 'green');
			return false;			
		}
	}
	
	$scope.validaHora = function () {
		var startTime = '10:00:00';
		var endTime = '16:00:00';

		currentDate = new Date()   

		startDate = new Date(currentDate.getTime());
		startDate.setHours(startTime.split(":")[0]);
		startDate.setMinutes(startTime.split(":")[1]);
		startDate.setSeconds(startTime.split(":")[2]);

		endDate = new Date(currentDate.getTime());
		endDate.setHours(endTime.split(":")[0]);
		endDate.setMinutes(endTime.split(":")[1]);
		endDate.setSeconds(endTime.split(":")[2]);


		return startDate < currentDate && endDate > currentDate
	}
	
	$scope.novoContribuinte = function () {
		
		var source = this;	
		source.objetoTela = {};
	}
	
	$scope.salvarContribuinte = function () {
		
		var source = this;	
		
		var contribuinte = {};
		
		contribuinte.id = source.objetoTela.id;
		contribuinte.nome = source.objetoTela.nome;
		contribuinte.cpf = source.objetoTela.cpf;
		contribuinte.numeroDependentes = source.objetoTela.numeroDependentes;
		contribuinte.rendaBruta = source.objetoTela.rendaBruta;
		contribuinte.rendaLiquida = source.objetoTela.rendaLiquida;
		contribuinte.ir = source.objetoTela.ir;
		var contribuinteJson = JSON.stringify(contribuinte);
		
		//spinnerService.show();

		$http.post("http://localhost:3318/api/Contribuinte/SalvarContribuinte?contribuinteJson=" + contribuinteJson)
		.success (function(response){
			
			if (contribuinte.id != undefined && contribuinte.id != 0)
			source.listaContribuintes = Enumerable.from(source.listaContribuintes).where(function (x) { return x.id != contribuinte.id}).toArray();
					
			source.listaContribuintes.push(JSON.parse(response));
			source.listaContribuintes = Enumerable.from(source.listaContribuintes).orderBy(function (x) { return x.id }).toArray();
			Materialize.toast("Registro Incluído com Sucesso.", 4000, 'green');
						
			source.aplicarFiltro();
		 })
		.error(function(response){
			 Materialize.toast(response, 4000, 'red');
			 //toaster.pop('error', "Login", response);
		 })
		.finally (function () {
			//spinnerService.hide();
		});
	}
	
	$scope.confirmarDeletarContribuinte = function () {
		
		var source = this;	
		
		var contribuinte = {};
		
		contribuinte.id = source.objetoTela.idDeletar;
		var contribuinteJson = JSON.stringify(contribuinte);
		
		//spinnerService.show();

		$http.post("http://localhost:3318/api/Contribuinte/DeletarContribuinte?contribuinteJson=" + contribuinteJson)
		.success (function(response){
			
			source.listaContribuintes = Enumerable.from(source.listaContribuintes).where(function (x) { return x.id != contribuinte.id}).toArray();
						
			Materialize.toast("Registro Deletado com Sucesso.", 4000, 'green');
			
			source.aplicarFiltro();
		 })
		.error(function(response){
			 Materialize.toast(response, 4000, 'red');
		 })
		.finally (function () {
			//spinnerService.hide();
		});
	}
	
	$scope.deletarContribuinte = function (idDeletar) {
		
		var source = this;
		
		source.objetoTela.idDeletar = idDeletar;
	}
	
	$scope.editarContribuinte = function(contribuinte) {
		var source = this;
		
		source.objetoTela.idContribuinte = "ID: " + contribuinte.id;
		source.objetoTela.id = contribuinte.id;
		source.objetoTela.nome = contribuinte.nome;
		source.objetoTela.cpf = contribuinte.cpf;
		source.objetoTela.numeroDependentes = contribuinte.numeroDependentes;
		source.objetoTela.rendaBruta = contribuinte.rendaBruta;
		source.objetoTela.rendaLiquida = contribuinte.rendaLiquida;
		source.objetoTela.ir = contribuinte.ir;
	}
	
	$scope.carregarContribuintes();
}])
