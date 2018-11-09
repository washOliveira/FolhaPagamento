
function calculo(){
  var valor = document.getElementById('valor').value;
  var checkInss = document.getElementById('idCheckInss');
  var checkVr = document.getElementById('idCheckVr');
  var valorVr = document.getElementById('idValorVr').value;
  var checkVt = document.getElementById('idCheckVt');
  var checkIr = document.getElementById('idCheckIr');
  var checkSaude = document.getElementById('idCheckSaude');
  var valorSaude = document.getElementById('idValorSaude').value;

  var aliInss = 0;
  var taxInss = 0;

  var aliVr = 0;
  var taxVr = 0;

  var aliVt = 6;
  var taxVt = 0;

  var aliFgts = 8;
  var taxFgts = 0;

  var baseIr = 0;
  var aliIr = 0;
  var taxIr = 0;

  var aliSaude = 0;
  var taxSaude = 0;

  var aliEssencial = 55;
  var valorEssencial = 0;

  var aliAposentadoria = 10;
  var valorAposentadoria = 0;

  var aliEducacao = 5;
  var valorEducacao = 0;

  var aliObjetivos = 20;
  var valorObjetivos = 0;

  var aliGosto = 10;
  var valorGosto = 0;

  var aliCurto = 60;
  var valorCurto = 0;

  var aliMedio = 20;
  var valorMedio = 0;

  var aliLongo = 20;
  var valorLongo = 0;

  if(valor > "0"){

// Cálculo INSS ----------------------------------------------------------------
    if(checkInss.checked == true){
        var inssT1 = 1659.38;
        var inssT2 = 2765.66;
        var inssT3 = 5531.31;

        if(valor > 0 && valor <= inssT1){
          aliInss = 8;
          taxInss = ((valor * aliInss)/100);
        }else if (valor > inssT1 && valor <= inssT2){
          aliInss = 9;
          taxInss = ((valor * aliInss)/100);
        }else if (valor > inssT2 && valor <= inssT3){
          aliInss = 11;
          taxInss = ((valor * aliInss)/100);
        }else if (valor > inssT3){
          aliInss = "Taxa Fixa";
          taxInss = 608.44;
        }

        var taxInssArredondado = parseFloat(taxInss.toFixed(2));
        var linhaAliInss = document.getElementById('idLinhaAliInss');
        var linhaValorInss = document.getElementById('idLinhaValorInss');
        linhaAliInss.innerHTML = aliInss;
        linhaValorInss.innerHTML = taxInssArredondado;
      }else if(checkInss.checked == false){
        var linhaAliInss = document.getElementById('idLinhaAliInss');
        var linhaValorInss = document.getElementById('idLinhaValorInss');
        linhaAliInss.innerHTML = 0;
        linhaValorInss.innerHTML = 0;
      }
//------------------------------------------------------------------------------

// Cálculo VR ------------------------------------------------------------------
      if(checkVr.checked == true){
        if(valorVr > 0){
          var vrT1 = 1703.35;
          var vrT2 = 2882.62;
          var vrT3 = 4192.90;
          var vrT4 = 5241.12;
          var vrT5 = 6420.38;

          if(valor > 0 && valor <= vrT1){
            aliVr = 0;
            taxVr = 0;
          }else if(valor > vrT1 && valor <= vrT2){
            aliVr = 5;
            taxVr = ((valorVr * aliVr)/100);
          }else if(valor > vrT2 && valor <= vrT3){
            aliVr = 7.5;
            taxVr = ((valorVr * aliVr)/100);
          }else if(valor > vrT3 && valor <= vrT4){
            aliVr = 10;
            taxVr = ((valorVr * aliVr)/100);
          }else if(valor > vrT4 && valor <= vrT5){
            aliVr = 15;
            taxVr = ((valorVr * aliVr)/100);
          }else if(valor > vrT5){
            aliVr = 20;
            taxVr = ((valorVr * aliVr)/100);
          }

          var taxVrArredondado = parseFloat(taxVr.toFixed(2));
          var linhaAliVr = document.getElementById('idLinhaAliVr');
          var linhaValorVr = document.getElementById('idLinhaValorVr');
          linhaAliVr.innerHTML = aliVr;
          linhaValorVr.innerHTML = taxVrArredondado;
        }else if(valorVr <= 0){
          alert("Tente um valor positivo para o campo Auxílio Alimentação ou desmarque esta opção.");
        }
      }else if(checkVr.checked == false){
        var linhaAliVr = document.getElementById('idLinhaAliVr');
        var linhaValorVr = document.getElementById('idLinhaValorVr');
        linhaAliVr.innerHTML = 0;
        linhaValorVr.innerHTML = 0;
      }
//------------------------------------------------------------------------------

// Cálculo VT ------------------------------------------------------------------
      if(checkVt.checked == true){
        taxVt = ((valor * aliVt)/100);

        var taxVtArredondado = parseFloat(taxVt.toFixed(2));
        var linhaAliVt = document.getElementById('idLinhaAliVt');
        var linhaValorVt = document.getElementById('idLinhaValorVt');
        linhaAliVt.innerHTML = aliVt;
        linhaValorVt.innerHTML = taxVtArredondado;
      }else if(checkVt.checked == false){
        var linhaAliVt = document.getElementById('idLinhaAliVt');
        var linhaValorVt = document.getElementById('idLinhaValorVt');
        linhaAliVt.innerHTML = 0;
        linhaValorVt.innerHTML = 0;
      }
//------------------------------------------------------------------------------

// Cálculo base do IR ----------------------------------------------------------
      baseIr = (valor - taxInss);

      var baseIrArredondado = parseFloat(baseIr.toFixed(2));
      var linhaValorBaseIr = document.getElementById('idLinhaValorBaseIr');
      linhaValorBaseIr.innerHTML = baseIrArredondado;
//------------------------------------------------------------------------------

// Cálculo IR ------------------------------------------------------------------
      if(checkIr.checked == true){
        if(baseIr > 0 && baseIr <= 1903.98){
          aliIr = 0;
          taxIr = 0;
        }else if((baseIr - 1903.98) <= 922.67){
          aliIr = 7.5;
          taxIr = ((baseIr - 1903.98) * aliIr)/100;
        }else if(((baseIr - 1903.98) - 922.67) <= 924.40){
          aliIr = 15;
          taxIr = ((922.67 * 7.5)/100) + (((baseIr - 1903.98) - 922.67) * aliIr)/100;
        }else if((((baseIr - 1903.98) - 922.67) - 924.40) <= 913.63){
          aliIr = 22.5;
          taxIr = ((922.67 * 7.5)/100) + ((924.40 * 15)/100) + ((((baseIr - 1903.98) - 922.67) - 924.40) * aliIr)/100;
        }else if(baseIr > 4664.68){
          aliIr = 27.5;
          taxIr = ((922.67 * 7.5)/100) + ((924.40 * 15)/100) + ((913.63 * 22.5)/100) + (((((baseIr - 1903.98) - 922.67) - 924.40) - 913.63) * aliIr)/100 ;
        }

        var taxIrArredondado = parseFloat(taxIr.toFixed(2));
        var linhaAliIr = document.getElementById('idLinhaAliIr');
        var linhaValorIr = document.getElementById('idLinhaValorIr');
        linhaAliIr.innerHTML = aliIr;
        linhaValorIr.innerHTML = taxIrArredondado;
      }else if(checkIr.checked == false){
        var linhaAliIr = document.getElementById('idLinhaAliIr');
        var linhaValorIr = document.getElementById('idLinhaValorIr');
        linhaAliIr.innerHTML = 0;
        linhaValorIr.innerHTML = 0;
      }
//------------------------------------------------------------------------------

// Cálculo Plano de Saúde ------------------------------------------------------
      if (checkSaude.checked == true){
        if(valorSaude > 0){
          var saudeT1 = 1932.18;
          var saudeT2 = 3221.22;

          if(valor <= saudeT1){
            aliSaude = 70;
            taxSaude = valorSaude - ((valorSaude * aliSaude) / 100);
          }else if(valor > saudeT1 && valor <= saudeT2){
            aliSaude = 60;
            taxSaude = valorSaude - ((valorSaude * aliSaude) / 100);
          }else if(valor > saudeT2){
            aliSaude = 50;
            taxSaude = valorSaude - ((valorSaude * aliSaude) / 100);
          }

          var taxSaudeArredondado = parseFloat(taxSaude.toFixed(2));
          var linhaAliSaude = document.getElementById('idLinhaAliSaude');
          var linhaValorSaude = document.getElementById('idLinhaValorSaude');
          linhaAliSaude.innerHTML = aliSaude;
          linhaValorSaude.innerHTML = taxSaudeArredondado;
        }else if(valorSaude <= 0){
          alert("Tente um valor positivo para o campo Plano de Saúde ou desmarque esta opção.");
        }
      }else if(checkSaude.checked == false){
        var linhaAliSaude = document.getElementById('idLinhaAliSaude');
        var linhaValorSaude = document.getElementById('idLinhaValorSaude');
        linhaAliSaude.innerHTML = 0;
        linhaValorSaude.innerHTML = 0;
      }

//------------------------------------------------------------------------------

// Cálculo Total----------------------------------------------------------------
      var total = (((((valor - taxInss) - taxVr) - taxVt) - taxIr) - taxSaude);

      var totalArredondado = parseFloat(total.toFixed(2));
      var linhaTotal = document.getElementById('idLinhaTotal');
      linhaTotal.innerHTML = totalArredondado;
//------------------------------------------------------------------------------

// Cálculo base do FGTS---------------------------------------------------------
      taxFgts = ((valor * aliFgts)/100);

      var taxFgtsArredondado = parseFloat(taxFgts.toFixed(2));
      var linhaAliFgts = document.getElementById('idLinhaAliFgts');
      var linhaValorFgts = document.getElementById('idLinhaValorFgts');
      linhaAliFgts.innerHTML = aliFgts;
      linhaValorFgts.innerHTML = taxFgtsArredondado;
//------------------------------------------------------------------------------

// Cálculo Essencial------------------------------------------------------------
      valorEssencial = (aliEssencial * total)/100;

      var valorEssencialArredondado = parseFloat(valorEssencial.toFixed(2));
      var linhaAliEssencial = document.getElementById('idLinhaAliEssencial');
      var linhaValorEssencial = document.getElementById('idLinhaValorEssencial');
      linhaAliEssencial.innerHTML = aliEssencial;
      linhaValorEssencial.innerHTML = valorEssencialArredondado;
//------------------------------------------------------------------------------

// Cálculo Aposentadoria--------------------------------------------------------
      valorAposentadoria = (aliAposentadoria * total)/100;

      var valorAposentadoriaArredondado = parseFloat(valorAposentadoria.toFixed(2));
      var linhaAliAposentadoria = document.getElementById('idLinhaAliAposentadoria');
      var linhaValorAposentadoria = document.getElementById('idLinhaValorAposentadoria');
      linhaAliAposentadoria.innerHTML = aliAposentadoria;
      linhaValorAposentadoria.innerHTML = valorAposentadoriaArredondado;
//------------------------------------------------------------------------------

// Cálculo Educação-------------------------------------------------------------
      valorEducacao = (aliEducacao * total)/100;

      var valorEducacaoArredondado = parseFloat(valorEducacao.toFixed(2));
      var linhaAliEducacao = document.getElementById('idLinhaAliEducacao');
      var linhaValorEducacao = document.getElementById('idLinhaValorEducacao');
      linhaAliEducacao.innerHTML = aliEducacao;
      linhaValorEducacao.innerHTML = valorEducacaoArredondado;
//------------------------------------------------------------------------------

// Cálculo Objetivos------------------------------------------------------------
      valorObjetivos = (aliObjetivos * total)/100;

      var valorObjetivosArredondado = parseFloat(valorObjetivos.toFixed(2));
      var linhaAliObjetivos = document.getElementById('idLinhaAliObjetivos');
      var linhaValorObjetivos = document.getElementById('idLinhaValorObjetivos');
      linhaAliObjetivos.innerHTML = aliObjetivos;
      linhaValorObjetivos.innerHTML = valorObjetivosArredondado;
//------------------------------------------------------------------------------

// Cálculo Gosto------------------------------------------------------------
      valorGosto = (aliGosto * total)/100;

      var valorGostoArredondado = parseFloat(valorGosto.toFixed(2));
      var linhaAliGosto = document.getElementById('idLinhaAliGosto');
      var linhaValorGosto = document.getElementById('idLinhaValorGosto');
      linhaAliGosto.innerHTML = aliGosto;
      linhaValorGosto.innerHTML = valorGostoArredondado;
//------------------------------------------------------------------------------

// Cálculo Objetivo Curto-------------------------------------------------------
      valorCurto = (aliCurto * valorObjetivos)/100;

      var valorCurtoArredondado = parseFloat(valorCurto.toFixed(2));
      var linhaAliCurto = document.getElementById('idLinhaAliCurto');
      var linhaValorCurto = document.getElementById('idLinhaValorCurto');
      linhaAliCurto.innerHTML = aliCurto;
      linhaValorCurto.innerHTML = valorCurtoArredondado;
//------------------------------------------------------------------------------

// Cálculo Objetivo Medio-------------------------------------------------------
      valorMedio = (aliMedio * valorObjetivos)/100;

      var valorMedioArredondado = parseFloat(valorMedio.toFixed(2));
      var linhaAliMedio = document.getElementById('idLinhaAliMedio');
      var linhaValorMedio = document.getElementById('idLinhaValorMedio');
      linhaAliMedio.innerHTML = aliMedio;
      linhaValorMedio.innerHTML = valorMedioArredondado;
//------------------------------------------------------------------------------

// Cálculo Objetivo Longo-------------------------------------------------------
      valorLongo = (aliLongo * valorObjetivos)/100;

      var valorLongoArredondado = parseFloat(valorLongo.toFixed(2));
      var linhaAliLongo = document.getElementById('idLinhaAliLongo');
      var linhaValorLongo = document.getElementById('idLinhaValorLongo');
      linhaAliLongo.innerHTML = aliLongo;
      linhaValorLongo.innerHTML = valorLongoArredondado;
//------------------------------------------------------------------------------

  }else{
    alert("Tente um valor positivo!");
  }
}
