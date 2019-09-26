const button = document.getElementById("calc");
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

	if(valor > "0"){
		// Tabela de Descontos - Linha INSS
		let taxInss = 0;
		let aliInss = 0; 
		
		if(checkInss.checked === true){
			aliInss = alicotaINSS(valor);
			taxInss = taxaINSS(valor, aliInss);
			inputInss(taxInss, aliInss);			
		}else{
			inputInss(taxInss, aliInss);
		}
		
		// Tabela de Descontos - Linha Auxílio Alimentação
		let taxVr = 0;
		let aliVr = 0;
		
		if(checkVr.checked === true){
			if(valorVr > "0"){
				aliVr = alicotaVR(valor);
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
		const taxFgts = valorFgts(valor);
		inputFgts(taxFgts);
		
		// Tabela de Descontos - Linha Base IR
		const baseIr = baseIR(valor, taxInss);
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
				aliSaude = alicotaSaude(valor);
				taxSaude = taxSAUDE(valor, valorSaude);
				inputSaude(taxSaude, aliSaude);
			}else if(valorSaude <= 0){
				alert("Tente um valor positivo para o campo Plano de Saúde ou desmarque esta opção.");
			}
		}else{
			inputSaude(taxSaude, aliSaude);
		}
		
		// Tabela de Descontos - Linha Total de Descontos
		const totalDesconto = taxInss + taxVr + taxVt + taxIr + taxSaude;
		inputTotalDesconto(totalDesconto);

		// Tabela de Descontos - Linha Total
		const total = ((((valor - taxInss) - taxVr) - taxVt) - taxIr) - taxSaude;
		inputTotal(total);

	}else{
		alert("Tente um valor positivo!");
	}
}

// Tabela de Desconto ------------------
const objFaixaINSS = {
	inssF1: 1751.81,
	inssF2: 2919.72,
	inssF3: 5839.45,
	fixo: 642.34
};

function alicotaINSS(valorInss){	
	let aliInss = 0;

	if(valorInss > 0 && valorInss <= objFaixaINSS.inssF1){
		aliInss = 8;
	}else if (valorInss > objFaixaINSS.inssF1 && valorInss <= objFaixaINSS.inssF2){
		aliInss = 9;
	}else if (valorInss > objFaixaINSS.inssF2 && valorInss <= objFaixaINSS.inssF3){
		aliInss = 11;
	}else if (valorInss > objFaixaINSS.inssF3){
		aliInss = "Taxa Fixa";
	}
	return aliInss;
}

function taxaINSS(valor, aliINSS){
	if(valor < objFaixaINSS.inssF3){
		return (valor * aliINSS)/100;
	}else{
		return objFaixaINSS.fixo;
	}
}

function inputInss(taxInss, aliInss){
	const taxInssArredondado = parseFloat(taxInss.toFixed(2));
	const linhaAliInss = document.getElementById('idLinhaAliInss');
	const linhaValorInss = document.getElementById('idLinhaValorInss');
	linhaAliInss.innerHTML = aliInss + " %";
	linhaValorInss.innerHTML = "R$ " + taxInssArredondado;
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

function alicotaVR(valor){
	let aliVr = 0;
	
	if(valor > 0 && valor <= objFaixaVr.vrF1){
		aliVr = 0;
	}else if(valor > objFaixaVr.vrF1 && valor <= objFaixaVr.vrF2){
		aliVr = 5;
	}else if(valor > objFaixaVr.vrF2 && valor <= objFaixaVr.vrF3){
		aliVr = 7.5;
	}else if(valor > objFaixaVr.vrF3 && valor <= objFaixaVr.vrF4){
		aliVr = 10;
	}else if(valor > objFaixaVr.vrF4 && valor <= objFaixaVr.vrF5){
		aliVr = 15;
	}else if(valor > objFaixaVr.vrF5){
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

function alicotaSaude(valor){
	let aliSaude = 0;

	if(valor <= objFaixaSaude.saudeF1){
		aliSaude = objFaixaAliSaude.aliSaudeF1;
	}else if(valor > objFaixaSaude.saudeF1 && valor <= objFaixaSaude.saudeF2){
		aliSaude = objFaixaAliSaude.aliSaudeF2;
	}else if(valor > objFaixaSaude.saudeF2){
		aliSaude = objFaixaAliSaude.aliSaudeF3;
	}
	return aliSaude;
}

function taxSAUDE(valor, valorSaude){
	let taxSaude = 0;

	if(valor <= objFaixaSaude.saudeF1){
		taxSaude = valorSaude - ((valorSaude * objFaixaAliSaude.aliSaudeF1) / 100);
	}else if(valor > objFaixaSaude.saudeF1 && valor <= objFaixaSaude.saudeF2){
		taxSaude = valorSaude - ((valorSaude * objFaixaAliSaude.aliSaudeF2) / 100);
	}else if(valor > objFaixaSaude.saudeF2){
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

function valorFgts(valor){
	return (valor * objFaixaFGTS.aliFGTS)/100;
}

function inputFgts(taxFgts){
	const taxFgtsArredondado = parseFloat(taxFgts.toFixed(2));
	const linhaAliFgts = document.getElementById('idLinhaAliFgts');
	const linhaValorFgts = document.getElementById('idLinhaValorFgts');
	linhaAliFgts.innerHTML = objFaixaFGTS.aliFGTS + " %";
	linhaValorFgts.innerHTML = "R$ " + taxFgtsArredondado;	
}

function baseIR(valor, taxInss){
	return valor - taxInss;
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