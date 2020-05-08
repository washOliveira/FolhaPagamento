const button = document.getElementById('calc');
const input = document.getElementById('valor');
const inputVr = document.getElementById('idValorVr');
const inputS = document.getElementById('idValorSaude');
const buttonPrint = document.getElementById('print');

function click(){
		folhaPagamento();
}

function enter(event){
	if(event.key === "Enter"){
		folhaPagamento();
	}
}

function folhaPagamento(){
	const valor = document.getElementById('valor').value;
	const checkInss = document.getElementById('idCheckInss');
	const checkVr = document.getElementById('idCheckVr');
	const valorVr = document.getElementById('idValorVr').value;
	const checkVt = document.getElementById('idCheckVt');
	const checkIr = document.getElementById('idCheckIr');
	const checkSaude = document.getElementById('idCheckSaude');
	const valorSaude = document.getElementById('idValorSaude').value;
    const CheckAdd = document.getElementById('idCheckAdd');
    const valorPeriodicidade = document.getElementById('idValorPeriodicidade').value;
    const valorPeriodicidadeTempo = document.getElementById('idValorPeriodicidadeTempo').value;
    const valorPeriodicidadePorcentagemAplicada = document.getElementById('idValorPeriodicidadePercentagemAplicada').value;

	if(valor > "0"){
		// Tabela de Descontos - Linha Salário Base
		inputSalarioBase(valor);

        // Tabela de Descontos - Linha Adicional por tempo de trabalho
		let valorAdd = 0;
		let addTempoTrabalho = 0;

        if(CheckAdd.checked === true){
        	if(valorPeriodicidadeTempo > "0" && valorPeriodicidadePorcentagemAplicada > "0") {
				addTempoTrabalho = Math.floor(valorPeriodicidadeTempo / valorPeriodicidade) * ((valor * valorPeriodicidadePorcentagemAplicada) / 100);
				valorAdd = parseFloat(valor) + addTempoTrabalho;
				inputAdd(addTempoTrabalho, valorPeriodicidadePorcentagemAplicada);
			}else{
				alert("Tente um valor positivo para os campos Tempo de Empresa e % Aplicada ou desmarque a opção 'Adicional por tempo de trabalho'.");
			}
        }else{
        	valorAdd = valor;
        	inputAdd(addTempoTrabalho, valorPeriodicidadePorcentagemAplicada);
		}

        // Tabela de Descontos - Linha INSS
		let taxInss = 0;
		let aliInss = 0;
		
		if(checkInss.checked === true){
			aliInss = alicotaINSS(valor);
			taxInss = taxaINSS(valor);
			inputInss(taxInss, aliInss);			
		}else{
			inputInss(taxInss, aliInss);
		}
		
		// Tabela de Descontos - Linha Auxílio Alimentação
		let taxVr = 0;
		let aliVr = 0;
		
		if(checkVr.checked === true){
			if(valorVr > "0"){
				aliVr = alicotaVR(valorAdd);
				taxVr = taxaVR(valorVr, aliVr);
				inputVR(taxVr, aliVr);
			}else if(valorVr <= 0){
				alert("Tente um valor positivo para o campo Auxílio Alimentação ou desmarque esta opção.");
			}
		}else{
			inputVR(taxVr, aliVr);
		}
		
		// Tabela de Descontos - Linha Auxílio Transporte
		let taxVt = 0;
		let aliVt = 0;
		
		if(checkVt.checked === true){
			aliVt = objFaixaVT.aliVt;
			taxVt = taxVT(valor);
			inputVt(taxVt, aliVt);
		}else{
			inputVt(taxVt, aliVt);
		}
		
		// Tabela de Descontos - Linha FGTS
		const taxFgts = valorFgts(valorAdd);
		inputFgts(taxFgts);
		
		// Tabela de Descontos - Linha Base IR
		const baseIr = baseIR(valorAdd, taxInss);
		inputBaseIR(baseIr);
				
		// Tabela de Descontos - Linha Imposto de Renda
		let aliIr = 0;
		let taxIr = 0;
		
		if(checkIr.checked === true){
			aliIr = alicotaIR(baseIr);
			taxIr = taxIR(baseIr);
			inputIr(taxIr, aliIr);
		}else{
			inputIr(taxIr, aliIr);
		}
		
		// Tabela de Descontos - Linha Plano de Saúde
		let aliSaude = 0;
		let taxSaude = 0;
		
		if (checkSaude.checked === true){
			if(valorSaude > 0){
				aliSaude = alicotaSaude(valorAdd);
				taxSaude = taxSAUDE(valorAdd, valorSaude);
				inputSaude(taxSaude, aliSaude);
			}else if(valorSaude <= 0){
				alert("Tente um valor positivo para o campo Plano de Saúde ou desmarque esta opção.");
			}
		}else{
			inputSaude(taxSaude, aliSaude);
		}

		// Tabela de Descontos - Linha total de Proventos
		//TODO: verificar porque os valores totais só são apresentados quando a opção "Adicional por tempo de trabalho" é marcada
		inputTotalProvento(valorAdd);

		// Tabela de Descontos - Linha Total de Descontos
		const totalDesconto = taxInss + taxVr + taxVt + taxIr + taxSaude;
		inputTotalDesconto(totalDesconto);

		// Tabela de Descontos - Linha Total
		const total = ((((valorAdd - taxInss) - taxVr) - taxVt) - taxIr) - taxSaude;
		inputTotal(total);

	}else{
		alert("Tente um valor positivo para o campo Salário base!");
	}
}

// Tabela de Desconto ------------------
function inputSalarioBase(valor) {
	const linhaAliValor = document.getElementById('idLinhaAliValor');
	const linhaSalarioBase = document.getElementById('idLinhaValor');
	linhaAliValor.innerHTML = "100 %";
	linhaSalarioBase.innerHTML = "R$ " + valor;
}

function inputAdd(addTempoTrabalho, valorPeriodicidadePorcentagemAplicada){
	const linhaAliAdd = document.getElementById('idLinhaAliAdd');
	const linhaAdd = document.getElementById('idLinhaAdd');
	linhaAliAdd.innerHTML = valorPeriodicidadePorcentagemAplicada + " %";
	linhaAdd.innerHTML = "R$ " + addTempoTrabalho.toFixed(2);
}

const objFaixaINSS = {
	inssF1: 1045.00,
	inssF2: 1044.59,
	inssF3: 1044.79,
	inssF4: 2966.65
}

const objFaixaAliINSS = {
	inssAliF1: 7.5,
	inssAliF2: 9,
	inssAliF3: 12,
	inssAliF4: 14,
	inssAliF5: "Taxa fixa"
}

const taxaFixaInss = 713.09;

function alicotaINSS(valorInss){	
	let aliInss = 0;

	if(valorInss > 0 && valorInss <= objFaixaINSS.inssF1){
		aliInss = objFaixaAliINSS.inssAliF1;
	}else if ((valorInss - objFaixaINSS.inssF1) <= objFaixaINSS.inssF2){
		aliInss = objFaixaAliINSS.inssAliF2;
	}else if (((valorInss - objFaixaINSS.inssF1) - objFaixaINSS.inssF2) <= objFaixaINSS.inssF3){
		aliInss = objFaixaAliINSS.inssAliF3;
	}else if ((((valorInss - objFaixaINSS.inssF1) - objFaixaINSS.inssF2) - objFaixaINSS.inssF3) <= objFaixaINSS.inssF4){
		aliInss = objFaixaAliINSS.inssAliF4;
	}else if (valorInss > (objFaixaINSS.inssF1 + objFaixaINSS.inssF2 + objFaixaINSS.inssF3 + objFaixaINSS.inssF4)){
		aliInss = objFaixaAliINSS.inssAliF5;
	}
	return aliInss;
}

function taxaINSS(valor){
	let taxInss = 0;
		
	if(valor > 0 && valor <= objFaixaINSS.inssF1){
		taxInss = (valor * objFaixaAliINSS.inssAliF1)/100;
	}else if((valor - objFaixaINSS.inssF1) <= objFaixaINSS.inssF2){
		taxInss =  ((valor - objFaixaINSS.inssF1) * objFaixaAliINSS.inssAliF2)/100 +
		(objFaixaINSS.inssF1 * objFaixaAliINSS.inssAliF1)/100;
	}else if(((valor - objFaixaINSS.inssF1) - objFaixaINSS.inssF2) <=  objFaixaINSS.inssF3){
		taxInss = (((valor - objFaixaINSS.inssF1) - objFaixaINSS.inssF2) * objFaixaAliINSS.inssAliF3)/100 +
		  (objFaixaINSS.inssF2 * objFaixaAliINSS.inssAliF2)/100 +
		  (objFaixaINSS.inssF1 * objFaixaAliINSS.inssAliF1)/100;
	}else if((((valor - objFaixaINSS.inssF1) - objFaixaINSS.inssF2) - objFaixaINSS.inssF3) <= objFaixaINSS.inssF4){
		taxInss = ((((valor - objFaixaINSS.inssF1) - objFaixaINSS.inssF2) - objFaixaINSS.inssF3) * objFaixaAliINSS.inssAliF4)/100 +
		  (objFaixaINSS.inssF3 * objFaixaAliINSS.inssAliF3)/100 +
		  (objFaixaINSS.inssF2 * objFaixaAliINSS.inssAliF2)/100 +
		  (objFaixaINSS.inssF1 * objFaixaAliINSS.inssAliF1)/100;
	}else if(valor > (objFaixaINSS.inssF1 + objFaixaINSS.inssF2 + objFaixaINSS.inssF3 + objFaixaINSS.inssF4)){
		taxInss = taxaFixaInss;
	}
	return taxInss;
}

function inputInss(taxInss, aliInss){
	const taxInssArredondado = parseFloat(taxInss.toFixed(2));
	const linhaAliInss = document.getElementById('idLinhaAliInss');
	const linhaValorInss = document.getElementById('idLinhaValorInss');
	linhaAliInss.innerHTML = aliInss + " %";
	linhaValorInss.innerHTML = "R$ " + taxInssArredondado;
}

function inputTotalProvento(valorAdd) {
	const linhaTotalProvento = document.getElementById('idLinhaTotalProvento');
	linhaTotalProvento.innerHTML = "R$ " + valorAdd.toFixed(2);
}

function inputTotalDesconto(totalDesconto){
	const totalDescontoArredondado = parseFloat(totalDesconto.toFixed(2));
	const linhaTotalDesconto = document.getElementById('idLinhaTotalDesconto');
	linhaTotalDesconto.innerHTML = "R$ " + totalDescontoArredondado;
}

function inputTotal(total){
	const totalArredondado = parseFloat(total.toFixed(2));
	const linhaTotal = document.getElementById('idLinhaTotal');
	linhaTotal.innerHTML = "R$ " + totalArredondado;
}

const objFaixaVr = {
	vrF1: 1817.71,
	vrF2: 3076.13,
	vrF3: 4474.37,
	vrF4: 5592.97,
	vrF5: 6851.40
};

function alicotaVR(valorAdd){
	let aliVr = 0;
	
	if(valorAdd > 0 && valorAdd <= objFaixaVr.vrF1){
		aliVr = 0;
	}else if(valorAdd > objFaixaVr.vrF1 && valorAdd <= objFaixaVr.vrF2){
		aliVr = 5;
	}else if(valorAdd > objFaixaVr.vrF2 && valorAdd <= objFaixaVr.vrF3){
		aliVr = 7.5;
	}else if(valorAdd > objFaixaVr.vrF3 && valorAdd <= objFaixaVr.vrF4){
		aliVr = 10;
	}else if(valorAdd > objFaixaVr.vrF4 && valorAdd <= objFaixaVr.vrF5){
		aliVr = 15;
	}else if(valorAdd > objFaixaVr.vrF5){
		aliVr = 20;
	}
	return aliVr;
}

function taxaVR(valorVr, aliVr){
	return (valorVr * aliVr)/100;
}

function inputVR(taxVr, aliVr){
	const taxVrArredondado = parseFloat(taxVr.toFixed(2));
	const linhaAliVr = document.getElementById('idLinhaAliVr');
	const linhaValorVr = document.getElementById('idLinhaValorVr');
	linhaAliVr.innerHTML = aliVr + " %";
	linhaValorVr.innerHTML = "R$ " + taxVrArredondado;
}

const objFaixaVT = {
	aliVt: 6
};

function taxVT(valor){
	return (valor * objFaixaVT.aliVt)/100;
}

function inputVt(taxVt, aliVt){
	const taxVtArredondado = parseFloat(taxVt.toFixed(2));
	const linhaAliVt = document.getElementById('idLinhaAliVt');
	const linhaValorVt = document.getElementById('idLinhaValorVt');
	linhaAliVt.innerHTML = aliVt + " %";
	linhaValorVt.innerHTML = "R$ " + taxVtArredondado;
}

const objFaixaIR = {
	irF1: 1903.99,
	irF2: 922.66,
	irF3: 924.39,
	irF4: 913.62
};

const objFaixaAliIR = {
	irAliF1: 0,
	irAliF2: 7.5,
	irAliF3: 15,
	irAliF4: 22.5,
	irAliF5: 27.5
};

function alicotaIR(baseIr){
	let aliIr = 0;
	
	if(baseIr > 0 && baseIr <= objFaixaIR.irF1){
		aliIr = objFaixaAliIR.irAliF1;
	}else if((baseIr - objFaixaIR.irF1) <= objFaixaIR.irF2){
		aliIr = objFaixaAliIR.irAliF2;
	}else if(((baseIr - objFaixaIR.irF1) - objFaixaIR.irF2) <= objFaixaIR.irF3){
		aliIr = objFaixaAliIR.irAliF3;
	}else if((((baseIr - objFaixaIR.irF1) - objFaixaIR.irF2) - objFaixaIR.irF3) <= objFaixaIR.irF4){
		aliIr = objFaixaAliIR.irAliF4;
	}else if(baseIr > (objFaixaIR.irF1 + objFaixaIR.irF2 + objFaixaIR.irF3 + objFaixaIR.irF4)){
		aliIr = objFaixaAliIR.irAliF5;
	}
	return aliIr;
}

function taxIR(baseIr){
	let taxIr = 0;
		
	if(baseIr > 0 && baseIr <= objFaixaIR.irF1){
		taxIr = 0;
	}else if((baseIr - objFaixaIR.irF1) <= objFaixaIR.irF2){
		taxIr = ((baseIr - objFaixaIR.irF1) * objFaixaAliIR.irAliF2)/100;
	}else if(((baseIr - objFaixaIR.irF1) - objFaixaIR.irF2) <= objFaixaIR.irF3){
		taxIr = ((objFaixaIR.irF2 * objFaixaAliIR.irAliF2)/100) + (((baseIr - objFaixaIR.irF1) - objFaixaIR.irF2) * objFaixaAliIR.irAliF3)/100;
	}else if((((baseIr - objFaixaIR.irF1) - objFaixaIR.irF2) - objFaixaIR.irF3) <= objFaixaIR.irF4){
		taxIr = ((objFaixaIR.irF2 * objFaixaAliIR.irAliF2)/100) + ((objFaixaIR.irF3 * objFaixaAliIR.irAliF3)/100) + ((((baseIr - objFaixaIR.irF1) - objFaixaIR.irF2) - objFaixaIR.irF3) * objFaixaAliIR.irAliF4)/100;
	}else if(baseIr > (objFaixaIR.irF1 + objFaixaIR.irF2 + objFaixaIR.irF3 + objFaixaIR.irF4)){
		taxIr = ((objFaixaIR.irF2 * objFaixaAliIR.irAliF2)/100) + ((objFaixaIR.irF3 * objFaixaAliIR.irAliF3)/100) + ((objFaixaIR.irF4 * objFaixaAliIR.irAliF4)/100) + (((((baseIr - objFaixaIR.irF1) - objFaixaIR.irF2) - objFaixaIR.irF3) - objFaixaIR.irF4) * objFaixaAliIR.irAliF5)/100;
	}
	return taxIr;
}

function inputIr(taxIr, aliIr){
	const taxIrArredondado = parseFloat(taxIr.toFixed(2));
	const linhaAliIr = document.getElementById('idLinhaAliIr');
	const linhaValorIr = document.getElementById('idLinhaValorIr');
	linhaAliIr.innerHTML = aliIr + " %";
	linhaValorIr.innerHTML = "R$ " + taxIrArredondado;
}

const objFaixaSaude = {
	saudeF1: 2027.63,
	saudeF2: 3380.35
};

const objFaixaAliSaude = {
	aliSaudeF1: 70,
	aliSaudeF2: 60,
	aliSaudeF3: 50
};

function alicotaSaude(valorAdd){
	let aliSaude = 0;

	if(valorAdd <= objFaixaSaude.saudeF1){
		aliSaude = objFaixaAliSaude.aliSaudeF1;
	}else if(valorAdd > objFaixaSaude.saudeF1 && valorAdd <= objFaixaSaude.saudeF2){
		aliSaude = objFaixaAliSaude.aliSaudeF2;
	}else if(valorAdd > objFaixaSaude.saudeF2){
		aliSaude = objFaixaAliSaude.aliSaudeF3;
	}
	return aliSaude;
}

function taxSAUDE(valorAdd, valorSaude){
	let taxSaude = 0;

	if(valorAdd <= objFaixaSaude.saudeF1){
		taxSaude = valorSaude - ((valorSaude * objFaixaAliSaude.aliSaudeF1) / 100);
	}else if(valorAdd > objFaixaSaude.saudeF1 && valorAdd <= objFaixaSaude.saudeF2){
		taxSaude = valorSaude - ((valorSaude * objFaixaAliSaude.aliSaudeF2) / 100);
	}else if(valorAdd > objFaixaSaude.saudeF2){
		taxSaude = valorSaude - ((valorSaude * objFaixaAliSaude.aliSaudeF3) / 100);
	}
	return taxSaude;
}

function inputSaude(taxSaude, aliSaude){
	const taxSaudeArredondado = parseFloat(taxSaude.toFixed(2));
	const	linhaAliSaude = document.getElementById('idLinhaAliSaude');
	const linhaValorSaude = document.getElementById('idLinhaValorSaude');
	linhaAliSaude.innerHTML = aliSaude + " %";
	linhaValorSaude.innerHTML = "R$ " + taxSaudeArredondado;
}
// Fim da Tabela de Desconto ------------------

// Tabela de Apoio ------------------
const objFaixaFGTS = {
	aliFGTS: 8
};

function valorFgts(valorAdd){
	return (valorAdd * objFaixaFGTS.aliFGTS)/100;
}

function inputFgts(taxFgts){
	const taxFgtsArredondado = parseFloat(taxFgts.toFixed(2));
	const linhaAliFgts = document.getElementById('idLinhaAliFgts');
	const linhaValorFgts = document.getElementById('idLinhaValorFgts');
	linhaAliFgts.innerHTML = objFaixaFGTS.aliFGTS + " %";
	linhaValorFgts.innerHTML = "R$ " + taxFgtsArredondado;	
}

function baseIR(valorAdd, taxInss){
	return valorAdd - taxInss;
}

function inputBaseIR(baseIr){
	const baseIrArredondado = parseFloat(baseIr.toFixed(2));
	const linhaValorBaseIr = document.getElementById('idLinhaValorBaseIr');
	linhaValorBaseIr.innerHTML = "R$ " + baseIrArredondado;
}
// Fim da Tabela de Apoio ------------------

button.addEventListener("click", click);
input.addEventListener("keypress", enter);
inputVr.addEventListener("keypress", enter);
inputS.addEventListener("keypress", enter);

// Funcionalidade de Impressão -------------

function myprint() {
  window.print();
}

buttonPrint.addEventListener("click", myprint);

