const button = document.getElementById('calc');
const input = document.getElementById('valor');

function click(){
		folhaPagamento();
}

function enter(event){
	if(event.keyCode === 13){
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
		
		if(checkInss.checked == true){
			aliInss = alicotaINSS(valor);
			taxInss = taxaINSS(valor, aliInss);
			inputInss(taxInss, aliInss);			
		}else{
			inputInss(taxInss, aliInss);
		}
		
		// Tabela de Descontos - Linha Auxílio Alimentação
		let taxVr = 0;
		let aliVr = 0;
		
		if(checkVr.checked == true){
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
		
		if(checkVt.checked == true){
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
		
		if(checkIr.checked == true){
			aliIr = alicotaIR(baseIr);
			taxIr = taxIR(baseIr);
			inputIr(taxIr, aliIr);
		}else{
			inputIr(taxIr, aliIr);
		}
		
		// Tabela de Descontos - Linha Plano de Saúde
		let aliSaude = 0;
		let taxSaude = 0;
		
		if (checkSaude.checked == true){
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
		
		// Tabela de Descontos - Linha Total
		const total = parseFloat(((((valor - taxInss) - taxVr) - taxVt) - taxIr) - taxSaude);
		inputTotal(total);

	}else{
		alert("Tente um valor positivo!");
	}
}

// Tabela de Desconto ------------------
const objFaixaINSS = {
	inssF1: 1659.38,
	inssF2: 2765.66,
	inssF3: 5531.31,
	fixo: 608.44
}

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
	linhaAliInss.innerHTML = aliInss;
	linhaValorInss.innerHTML = taxInssArredondado;
}

function inputTotal(total){
	const totalArredondado = parseFloat(total.toFixed(2));
	const linhaTotal = document.getElementById('idLinhaTotal');
	linhaTotal.innerHTML = totalArredondado;
}

const objFaixaVr = {
	vrF1: 1703.35,
	vrF2: 2882.62,
	vrF3: 4192.90,
	vrF4: 5241.12,
	vrF5: 6420.38
}

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
	 const taxVr = (valorVr * aliVr)/100;
	 return taxVr;
}

function inputVR(taxVr, aliVr){
	const taxVrArredondado = parseFloat(taxVr.toFixed(2));
	const linhaAliVr = document.getElementById('idLinhaAliVr');
	const linhaValorVr = document.getElementById('idLinhaValorVr');
	linhaAliVr.innerHTML = aliVr;
	linhaValorVr.innerHTML = taxVrArredondado;
}

const objFaixaVT = {
	aliVt: 6
}

function taxVT(valor){
	const taxVt = (valor * objFaixaVT.aliVt)/100;
	return taxVt;
}

function inputVt(taxVt, aliVt){
	const taxVtArredondado = parseFloat(taxVt.toFixed(2));
	const linhaAliVt = document.getElementById('idLinhaAliVt');
	const linhaValorVt = document.getElementById('idLinhaValorVt');
	linhaAliVt.innerHTML = aliVt;
	linhaValorVt.innerHTML = taxVtArredondado;
}

const objFaixaIR = {
	irF1: 1903.98,
	irF2: 922.67,
	irF3: 924.40,
	irF4: 913.63
}

const objFaixaAliIR = {
	irAliF1: 0,
	irAliF2: 7.5,
	irAliF3: 15,
	irAliF4: 22.5,
	irAliF5: 27.5
}

function alicotaIR(baseIr){
	let aliIr = 0;
	let taxIr = 0;
	
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
	let aliIr = 0;
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
	linhaAliIr.innerHTML = aliIr;
	linhaValorIr.innerHTML = taxIrArredondado;
}

const objFaixaSaude = {
	saudeF1: 1932.18,
	saudeF2: 3221.22
}

const objFaixaAliSaude = {
	aliSaudeF1: 70,
	aliSaudeF2: 60,
	aliSaudeF3: 50
}

function alicotaSaude(valor){
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
	linhaAliSaude.innerHTML = aliSaude;
	linhaValorSaude.innerHTML = taxSaudeArredondado;
}
// Fim da Tabela de Desconto ------------------

// Tabela de Apoio ------------------
const objFaixaFGTS = {
	aliFGTS: 8
}

function valorFgts(valor){
	const taxFgts = (valor * objFaixaFGTS.aliFGTS)/100;
	return taxFgts;
}

function inputFgts(taxFgts){
	const taxFgtsArredondado = parseFloat(taxFgts.toFixed(2));
	const linhaAliFgts = document.getElementById('idLinhaAliFgts');
	const linhaValorFgts = document.getElementById('idLinhaValorFgts');
	linhaAliFgts.innerHTML = objFaixaFGTS.aliFGTS;
	linhaValorFgts.innerHTML = taxFgtsArredondado;	
}

function baseIR(valor, taxInss){
	let baseIr = valor - taxInss;
	return baseIr;
}

function inputBaseIR(baseIr){
	const baseIrArredondado = parseFloat(baseIr.toFixed(2));
	const linhaValorBaseIr = document.getElementById('idLinhaValorBaseIr');
	linhaValorBaseIr.innerHTML = baseIrArredondado;
}
// Fim da Tabela de Apoio ------------------

button.addEventListener("click", click);
input.addEventListener("keypress", enter);
