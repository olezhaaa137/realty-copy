function number_format(number, decimals, decPoint, thousandsSep) {

    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number
    var prec = !isFinite(+decimals) ? 2 : Math.abs(decimals)
    var sep = (typeof thousandsSep === 'undefined') ? ' ' : thousandsSep
    var dec = (typeof decPoint === 'undefined') ? ',' : decPoint
    var s = ''

    var toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec)
        return '' + (Math.round(n * k) / k)
            .toFixed(prec)
    }

    // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }

    return s.join(dec)
}


//calculator
var debug=true;
function SaveHistory(msg) {
    if(debug&&(nObj=document.getElementById("history"))) {
        nObj.innerHTML+="<br/>"+msg;nObj.scrollTop+=50;
    }
}
function AddHistoryControl() {
    var historyDiv=document.createElement("div");
    historyDiv.style.padding="5px";
    historyDiv.style.overflow="auto";
    historyDiv.style.width="300px";
    historyDiv.style.height="150px";
    historyDiv.style.position="fixed";
    historyDiv.style.top=0;
    historyDiv.style.border="1px solid black";
    historyDiv.style.backgroundColor="lightgreen";
    historyDiv.id="history";
    historyDiv.innerHTML="History starting.";
    document.body.appendChild(historyDiv);
}
var cObj=null;
var nObj=null,i,tblObj;
function leasingObj() {
    this.cost=null;
    this.cost_rate=null;
    this.rate=null;
    this.leasing_rate=null;
    this.terms=null;
    this.payment=null;
    this.payment_rate=null;
    this.price=null;
}
function tableObj(id,cost,cost_nds,leasing_rate,leasing_rate_nds,payment,payment_nds,total) {
    this.id=id;
    this.cost=cost;
    this.cost_nds=cost_nds;
    this.leasing_rate=leasing_rate;
    this.leasing_rate_nds=leasing_rate_nds;
    this.payment=payment;
    this.payment_nds=payment_nds;
    this.total=total;
}
/*
function FormatMoney(i) {
	var z,tmp="",counter=1;
	var nSting=new String(i);
	if(nSting.length<4) {
		return nSting.toString();
	}
	for(z=(nSting.length-1);z>=0;z--) {
		if(counter%3==0) {
			tmp=" "+nSting.charAt(z)+tmp;
		} else {
			tmp=nSting.charAt(z)+tmp;
		}
		counter++;
	}
	return tmp;

}
*/
function getPercent(price,percent) {
    return price*percent/100;
}
function Round(num,decplaces) {
    num=parseFloat(num);
    if(!isNaN(num)) {
        var str=""+Math.round(eval(num)*Math.pow(10,decplaces));
        if(str.indexOf("e")!=-1) {
            return 0;
        }
        while(str.length<=decplaces) {
            str="0"+str;
        }
        var decpoint=str.length-decplaces;
        return str.substring(0,decpoint)+","+str.substring(decpoint,str.length);
    } else {
        return"NaN";
    }
}

Math.sign = Math.sign || function(x) {
    x = +x; // преобразуем в число
    if (x === 0 || isNaN(x)) {
        return x;
    }
    return x > 0 ? 1 : -1;
}

function precise_round(num, decimals) {
    var decimals = 2;
    var t=Math.pow(10, decimals);
    return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
}

function GetMoney(i) {
    if(i.length<1) {
        return 0;
    }
    i=i.replace(/\,/g,".");i=parseFloat(i.replace(/[^\d\.]/g,""));
    return i;
}
function Calculate() {

    if(!Validate(document.getElementById("frmCalc"))) {
        return;
    }

    ClearTable();

    metod1 = document.getElementById("metod1").checked||false;

    if (metod1) {
        //console.log('obychny');



        cObj=cObj||new leasingObj();
        cObj.cost=GetMoney(document.getElementById("leasing_cost_id").value); //стоимость
        cObj.original_cost = cObj.cost;

        // if(withNds) {
        // 	var tmp=Math.round(cObj.cost*cObj.rate/(100+cObj.rate));
        // 	cObj.cost-=tmp;
        // } else {
        // 	var tmp=getPercent(cObj.cost,cObj.rate);
        // }

        var tmp = parseFloat( precise_round( cObj.cost*cObj.rate/(100+cObj.rate) ) );
        cObj.cost-=tmp;

        cObj.leasing_rate=GetMoney(document.getElementById("leasing_rate_id").value); //ставка по лизингу
        cObj.terms=GetMoney(document.getElementById("leasing_terms_id").value); //срок лизинга в месяцах
        cObj.cost_rate=tmp;
        cObj.payment_rate=GetMoney(document.getElementById("advance_payment_id").value); //авансовый платеж

        nObj=document.getElementById("advance_type_percent"); //предоплата в процентах или

        if(nObj.checked) {
            // if(!withNds) {
            // 	cObj.payment_rate=getPercent(cObj.cost,cObj.payment_rate);
            // } else {
            // 	cObj.payment_rate=getPercent((cObj.cost+cObj.cost_rate),cObj.payment_rate);
            // }
            cObj.payment_rate=getPercent((cObj.cost+cObj.cost_rate),cObj.payment_rate);
        }

        cObj.payment= parseFloat( precise_round( (cObj.payment_rate*cObj.rate)/(100+cObj.rate) ) );
        cObj.payment = parseFloat( precise_round( cObj.payment_rate-cObj.payment ) );

        cObj.payment_rate-=cObj.payment;

        cObj.payment_rate = parseFloat( precise_round( cObj.payment_rate ) );

        cObj.price=GetMoney(document.getElementById("purchase_price_id").value); //выкупная стоимость

        nObj=document.getElementById("purchase_price_type_percent"); // выкупная стоимость в процентах

        if(nObj.checked) {
            cObj.price=getPercent(cObj.cost,cObj.price);
        } else if(!nObj.checked&&withNds) {
            var tmp = parseFloat( precise_round( cObj.price*cObj.rate/(100+cObj.rate) ) );
            cObj.price-=tmp;
        }

        cObj.price = parseFloat( precise_round( cObj.price ) );


        var rem_value = parseFloat( precise_round( cObj.cost-cObj.payment-cObj.price ) );
        var rem_avg = parseFloat( precise_round( rem_value/cObj.terms ) );

        var rem_total=0,rem_tmp,rem_avt,rem_avt_total=0;
        rem_value = parseFloat( precise_round( cObj.cost-cObj.payment) );
        rem_value_nds = parseFloat( precise_round( rem_value*(100+cObj.rate)/100 ) );
        var leasing_rate =  parseFloat( precise_round( (rem_value_nds*cObj.leasing_rate/100)*(30/360) ) );

        if (withNds) {
            var leasing_rate_nds = parseFloat( precise_round( getPercent(leasing_rate,cObj.rate) ) );
        } else {
            var leasing_rate_nds = 0;
        }

        var leasing_rate_nds_total=leasing_rate_nds;
        var leasing_rate_total=leasing_rate;
        var leasing_payment=cObj.payment;
        var leasing_payment_nds=cObj.payment_rate;
        var ls_pay_total=leasing_payment;
        var leasing_payment_total=leasing_payment+leasing_payment_nds;
        var ls_total=leasing_payment_total;
        var leasing_payment_total_nds=leasing_payment_nds;

        tblObj=new tableObj("Аванс",cObj.payment,cObj.payment_rate,0,0,leasing_payment,leasing_payment_nds,leasing_payment_total);
        GetFirstLine(tblObj);

        for(i=1;i<=cObj.terms;i++) {
            rem_tmp = parseFloat( precise_round( rem_avg ) );
            rem_avt = parseFloat( precise_round( getPercent(rem_tmp,cObj.rate) ) );
            //alert( rem_avt );
            if(i==cObj.terms) {
                rem_tmp = parseFloat( precise_round( cObj.cost-rem_total-cObj.payment-cObj.price ) );
                rem_total += parseFloat( precise_round( cObj.payment ) );
                rem_avt_total += parseFloat( precise_round( cObj.payment_rate ) );
                var rem_avt_tmp = getPercent((rem_total+rem_tmp),cObj.rate);
                rem_avt_tmp = parseFloat( precise_round( rem_avt_tmp ) );

                rem_avt = parseFloat( precise_round( (rem_avt_tmp-rem_avt_total) ) );
            }

            rem_total += rem_tmp;
            rem_avt_total +=rem_avt;
            rem_value -= rem_tmp;
            rem_value_nds=rem_value*(100+cObj.rate)/100;

            rem_total = parseFloat( precise_round( rem_total ) );
            rem_avt_total = parseFloat( precise_round( rem_avt_total ) );
            rem_value = parseFloat( precise_round( rem_value ) );
            rem_value_nds = parseFloat( precise_round( rem_value_nds ) );


            leasing_payment = parseFloat( precise_round( (rem_tmp+leasing_rate) ) );
            leasing_payment_nds = parseFloat( precise_round( (rem_avt+leasing_rate_nds) ) );
            leasing_payment_total = parseFloat( precise_round( leasing_payment+leasing_payment_nds ) );

            ls_pay_total+=leasing_payment;
            leasing_payment_total_nds+=leasing_payment_nds;
            ls_total+=leasing_payment_total;

            ls_pay_total = parseFloat( precise_round( ls_pay_total ) );
            leasing_payment_total_nds = parseFloat( precise_round( leasing_payment_total_nds ) );
            ls_total = parseFloat( precise_round( ls_total ) );

            tblObj=new tableObj(i+" месяц",rem_tmp,rem_avt,leasing_rate,leasing_rate_nds,leasing_payment,leasing_payment_nds,leasing_payment_total);
            GetBodyLine(tblObj);

            leasing_rate =  parseFloat( precise_round( (rem_value_nds*cObj.leasing_rate/100)*(30/360) ) );


            if(i==(cObj.terms-1)) {

                if (withNds) {
                    //console.log('withNds2');
                    leasing_rate_nds=parseFloat( precise_round( (getPercent((leasing_rate_total+leasing_rate),cObj.rate)-leasing_rate_nds_total) ) );
                } else {
                    //console.log('noNds2');
                    leasing_rate_nds=0;
                }

            } else {

                if (withNds) {
                    //console.log('withNds3');
                    leasing_rate_nds=parseFloat( precise_round( getPercent(leasing_rate,cObj.rate) ) );
                } else {
                    //console.log('noNds3');
                    leasing_rate_nds=0;
                }

                leasing_rate_nds_total+=leasing_rate_nds;
                leasing_rate_nds_total = parseFloat( precise_round( leasing_rate_nds_total ) );
            }
            if(i<cObj.terms) {
                leasing_rate_total+=leasing_rate;

                leasing_rate_total = parseFloat( precise_round( leasing_rate_total ) );
            }
        }

        rem_avt_total = parseFloat( precise_round(  getPercent(rem_total,cObj.rate) ) );

        //leasing_rate_total_nds=0/*getPercent(leasing_rate_total,cObj.rate)*/;
        leasing_rate_total_nds = parseFloat( precise_round(  getPercent(leasing_rate_total,cObj.rate) ) );

        tblObj=new tableObj("Итого",rem_total,rem_avt_total,leasing_rate_total,leasing_rate_total_nds,ls_pay_total,leasing_payment_total_nds,ls_total);

        var s = parseFloat( precise_round( getPercent(cObj.price,cObj.rate) ) );

        var sum_calc = parseFloat( precise_round( rem_total + rem_avt_total + cObj.price + s ) );

        if ( sum_calc != cObj.original_cost ) {
            delta = cObj.original_cost - sum_calc;
            s = parseFloat( precise_round( s + delta ) );
        }

        tblObj.vikup_nds = s;

        GetTotalLine(tblObj, cObj.price+s);
        tblObj=new tableObj("Выкупная стоимость",cObj.price,s,0,0,0,0,(cObj.price+s));
        var price = tblObj.total + ls_total;
        price = parseFloat( precise_round( price ) );

        GetFootLine(tblObj);

//		var tot_deduction=Round((leasing_rate_total/cObj.cost*100),2);
//		var tot_year=Round(((leasing_rate_total*12/cObj.terms/cObj.cost)*100),2);
//		var tot_month=Round(((leasing_rate_total/cObj.terms/cObj.cost)*100),2);

        var tot_deduction = (price - cObj.cost - cObj.cost_rate)/(cObj.cost + cObj.cost_rate)*100;
        var tot_year = tot_deduction*12/cObj.terms;
        var tot_month = tot_year / 12;
        GetFootTotalLine( parseFloat( precise_round( tot_deduction ) ), parseFloat( precise_round( tot_year ) ), parseFloat( precise_round( tot_month ) ) );


//		GetFootTotalLine(tot_deduction,tot_year,tot_month);

    } else {

        //console.log('annuotetete');

        var withNds=document.getElementById("rate_vot_0").checked||false;

        cObj=cObj||new leasingObj();
        cObj.cost = GetMoney(document.getElementById("leasing_cost_id").value);
        cObj.costOriginal = GetMoney(document.getElementById("leasing_cost_id").value);
        cObj.rate=GetMoney(document.getElementById("rate_percent_id").value);
        var tmp=cObj.cost*cObj.rate/(100+cObj.rate);
        tmp = parseFloat( precise_round( cObj.cost*cObj.rate/(100+cObj.rate) ) );
        cObj.cost-=tmp;
        cObj.cost = parseFloat( precise_round( cObj.cost ) );
        cObj.leasing_rate=GetMoney(document.getElementById("leasing_rate_id").value);
        cObj.terms=GetMoney(document.getElementById("leasing_terms_id").value);
        cObj.cost_rate=tmp;
        cObj.cost_rate  = parseFloat( precise_round( cObj.cost_rate ) );
        cObj.payment_rate = GetMoney(document.getElementById("advance_payment_id").value);
        nObj=document.getElementById("advance_type_percent");

        if(nObj.checked) {
            cObj.payment_rate = getPercent((cObj.cost+cObj.cost_rate),cObj.payment_rate);
            cObj.payment_rate = parseFloat( precise_round( cObj.payment_rate ) );
        }

        cObj.payment = (cObj.payment_rate*cObj.rate)/(100+cObj.rate);
        cObj.payment = parseFloat( precise_round( cObj.payment ) );
        cObj.payment = cObj.payment_rate-cObj.payment;
        cObj.payment = parseFloat( precise_round( cObj.payment ) );
        cObj.payment_rate -= cObj.payment;
        cObj.payment_rate = parseFloat( precise_round( cObj.payment_rate ) );
        cObj.price = GetMoney(document.getElementById("purchase_price_id").value);
        nObj = document.getElementById("purchase_price_type_percent");

        if(nObj.checked) {
            cObj.price = getPercent(cObj.cost,cObj.price);
        } else if(!nObj.checked) {
            var tmp = parseFloat( precise_round( cObj.price*cObj.rate/(100+cObj.rate) ) );
            cObj.price -= tmp;
        }
        cObj.price = parseFloat( precise_round( cObj.price ) );

        var leasing_payment_total=cObj.payment+cObj.payment_rate;
        leasing_payment_total = parseFloat( precise_round( leasing_payment_total ) );

        tblObj=new tableObj("Аванс",cObj.payment,cObj.payment_rate,0,0,cObj.payment,cObj.payment_rate,leasing_payment_total);
        GetFirstLine(tblObj);

        var k_nds = 1 + cObj.rate / 100;

        //var P = cObj.leasing_rate / 100 / cObj.terms;
        var P = cObj.leasing_rate / 100 / 12;
        //P = parseFloat( precise_round( P ) );
        var price_total = cObj.price * k_nds;
        price_total = parseFloat( precise_round( price_total ) );
        var K = cObj.cost + cObj.cost_rate - leasing_payment_total - price_total;
        //K = parseFloat( precise_round( K ) );
        var A = P * Math.pow(P + 1, cObj.terms) / (Math.pow(P + 1, cObj.terms) - 1);
        var debt = K + price_total;
        var Sa = A * K + P * cObj.price * k_nds;
        var leasing_rate_total = 0;
        var payment_total = 0;
        var k1_nds = cObj.rate / (100 + cObj.rate);
        var Sa_nds = Sa * k1_nds;


        for (i = 1; i <= cObj.terms; i++) {
            //var leasing_rate = Math.round(debt * cObj.leasing_rate / cObj.terms / 100);
            var leasing_rate = debt * cObj.leasing_rate / 12 / 100;
            leasing_rate = parseFloat( precise_round( leasing_rate ) );
            var payment = Sa - leasing_rate;
            payment = parseFloat( precise_round( payment ) );

            debt = debt - payment;
            debt = parseFloat( precise_round( debt ) );

            payment_total += payment;
            payment_total = parseFloat( precise_round( payment_total ) );
            if ( i == cObj.terms ) {
                var leasing_rate_temp = parseFloat( precise_round( K )) - parseFloat( precise_round( payment_total ) );
                leasing_rate_temp = 0;
                payment += leasing_rate_temp;
                leasing_rate -= leasing_rate_temp;
                payment_total += leasing_rate_temp;


                payment = parseFloat( precise_round( payment ) );
                leasing_rate = parseFloat( precise_round( leasing_rate ) );
                payment_total = parseFloat( precise_round( payment_total ) );

                preSum = payment_total + leasing_payment_total + price_total;
                preSum = parseFloat( precise_round( preSum ) );
                delta = cObj.costOriginal - preSum;
                delta = parseFloat( precise_round( delta ) );

                if ( delta != 0  ){
                    payment = payment + delta;
                    leasing_rate = leasing_rate - delta;
                }

            }

            leasing_rate_total += leasing_rate;
            leasing_rate_total = parseFloat( precise_round( leasing_rate_total ) );

            payment_nds = payment * k1_nds;
            payment_nds = parseFloat( precise_round( payment_nds ) );


            tblObj=new tableObj(i+" месяц",payment - payment_nds,payment_nds,leasing_rate,0,Sa-Sa_nds,Sa_nds,Sa);
            GetBodyLine(tblObj);
        }

        var payment_total_nds = payment_total * k1_nds;
        payment_total_nds = parseFloat( precise_round( payment_total_nds ) );


        Sa = parseFloat( precise_round( Sa ) );

        tblObj=new tableObj("Итого",payment_total - payment_total_nds + cObj.payment + delta,payment_total_nds + cObj.payment_rate,leasing_rate_total,0,(Sa - Sa_nds) * cObj.terms + cObj.payment,Sa_nds * cObj.terms + cObj.payment_rate,Sa * cObj.terms  + cObj.payment + cObj.payment_rate);
        GetTotalLine(tblObj, price_total);
        var price = tblObj.total + price_total;
        tblObj=new tableObj("Выкупная стоимость",cObj.price,price_total - cObj.price,0,0,0,0,price_total);
        GetFootLine(tblObj);
        var tot_deduction=(price - cObj.cost - cObj.cost_rate)/(cObj.cost + cObj.cost_rate)*100;
        var tot_year=tot_deduction*12/cObj.terms;
        var tot_month=tot_year / 12;
        GetFootTotalLine(Round(tot_deduction, 2), Round(tot_year, 2), Round(tot_month, 2));

    }




    function GetFirstLine(tableObj) {
        var nBody=document.getElementById("body_id");
        var tr=nBody.insertRow(nBody.rows.length);
        var td=tr.insertCell(-1);
        if (withNds) {
            document.getElementById("body_head1").style.display = "";
            document.getElementById("body_head2").style.display = "none";
            td.innerHTML='<div align="center" >'+tableObj.id+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.cost)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.cost_nds)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.leasing_rate)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.leasing_rate_nds)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.payment)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.payment_nds)+'</div>';
            td=tr.insertCell(-1);td.style.backgroundColor="ebf5f0";
            td.innerHTML='<div align="center" class="cal_or">'+number_format(tableObj.total)+'</div>';
        } else {
            document.getElementById("body_head1").style.display = "none";
            document.getElementById("body_head2").style.display = "";
            td.innerHTML='<div align="center">'+tableObj.id+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.cost + tableObj.cost_nds)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.leasing_rate)+'</div>';
            td=tr.insertCell(-1);
            td.style.backgroundColor="ebf5f0";
            td.innerHTML='<div align="center" class="cal_or">'+number_format(tableObj.total)+'</div>';
        }
    }

    function GetBodyLine(tableObj) {
        var nBody=document.getElementById("body_id");
        var tr=nBody.insertRow(nBody.rows.length);
        var td=tr.insertCell(-1);
        if (withNds) {
            td.innerHTML='<div align="center">'+tableObj.id+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.cost)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.cost_nds)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.leasing_rate)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.leasing_rate_nds)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.payment)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.payment_nds)+'</div>';
            td=tr.insertCell(-1);
            td.className="cal_or";
            td.style.backgroundColor="ebf5f0";
            td.innerHTML='<div align="center" class="cal_or">'+number_format(tableObj.total)+'</div>';
        } else {
            td.innerHTML='<div align="center">'+tableObj.id+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.cost + tableObj.cost_nds)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.leasing_rate)+'</div>';
            td=tr.insertCell(-1);
            td.className="cal_or";
            td.style.backgroundColor="ebf5f0";
            td.innerHTML='<div align="center" class="cal_or">'+number_format(tableObj.total)+'</div>';
        }
        if (metod1) {
            document.getElementById("aside_monthly").innerHTML = '';
        } else {
            document.getElementById("aside_monthly").innerHTML = '<header>Ежемесячный платеж</header><p>'+number_format(tableObj.total)+'</p>';
        }
    }
    function GetTotalLine(tableObj, price_total) {
        var nBody=document.getElementById("body_id");
        var tr=nBody.insertRow(nBody.rows.length);
        var td=tr.insertCell(-1);
        if (withNds) {
            //td.style.backgroundColor="#ebf5f0";
            td.className="cal_or bg-orange-100";
            td.innerHTML='<div align="center" class="cal_or">'+tableObj.id+'</div>';
            td=tr.insertCell(-1);//td.style.backgroundColor="#ebf5f0";
            td.className="cal_or bg-orange-100";
            td.innerHTML='<div align="center">'+number_format(tableObj.cost)+'</div>';
            td=tr.insertCell(-1);
            //td.style.backgroundColor="#ebf5f0";
            td.className="cal_or bg-orange-100";
            td.innerHTML='<div align="center">'+number_format(tableObj.cost_nds)+'</div>';
            td=tr.insertCell(-1);//td.style.backgroundColor="#ebf5f0";
            td.className="cal_or bg-orange-100";
            td.innerHTML='<div align="center">'+number_format(tableObj.leasing_rate)+'</div>';
            td=tr.insertCell(-1);//td.style.backgroundColor="#ebf5f0";
            td.className="cal_or bg-orange-100";
            td.innerHTML='<div align="center">'+number_format(tableObj.leasing_rate_nds)+'</div>';
            td=tr.insertCell(-1);
            //td.style.backgroundColor="#ebf5f0";
            td.className="cal_or bg-orange-100";
            td.innerHTML='<div align="center">'+number_format(tableObj.payment)+'</div>';
            td=tr.insertCell(-1);//td.style.backgroundColor="#ebf5f0";
            td.className="cal_or bg-orange-100";
            td.innerHTML='<div align="center">'+number_format(tableObj.payment_nds)+'</div>';
            td=tr.insertCell(-1);
            td.className="cal_or bg-orange-100";
            //td.style.backgroundColor="#ebf5f0";
            td.innerHTML='<div align="center" class="cal_or">'+number_format(tableObj.total)+'</div>';
            document.getElementById("aside_overall").innerHTML = '<header>Общая сумма выплат</header><p>'+number_format(tableObj.total + price_total)+'</p>';
            document.getElementById("aside_overall_nds").innerHTML = '<header>Cумма НДС за весь период</header><p>'+number_format(tableObj.payment_nds + tblObj.vikup_nds)+'</p>';
        } else {
            //td.style.backgroundColor="#ebf5f0";
            td.className="cal_or bg-orange-100";
            td.innerHTML='<div align="center" class="cal_or">'+tableObj.id+'</div>';
            td=tr.insertCell(-1);

            //td.style.backgroundColor="#ebf5f0";
            td.className="cal_or bg-orange-100";
            td.innerHTML='<div align="center">'+number_format(tableObj.cost + tableObj.cost_nds)+'</div>';
            td=tr.insertCell(-1);

            //td.style.backgroundColor="#ebf5f0";
            td.className="cal_or bg-orange-100";
            td.innerHTML='<div align="center">'+number_format(tableObj.leasing_rate)+'</div>';
            td=tr.insertCell(-1);

            td.className="cal_or bg-orange-100";
            //td.style.backgroundColor="#ebf5f0";
            td.innerHTML='<div align="center" class="cal_or">'+number_format(tableObj.total)+'</div>';
            document.getElementById("aside_overall").innerHTML = '<header>Общая сумма выплат</header><p>'+number_format(tableObj.total + price_total)+'</p>';
            document.getElementById("aside_overall_nds").innerHTML = '';
        }
    }
    function GetFootLine(tableObj) {
        var nBody=document.getElementById("foot_id");
        var tr=nBody.insertRow(nBody.rows.length);
        var td=tr.insertCell(-1);
        if (withNds) {
            td.innerHTML='<div align="center">'+tableObj.id+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.cost)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.cost_nds)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='';
            td=tr.insertCell(-1);
            td.innerHTML='';
            td=tr.insertCell(-1);
            td.innerHTML='';
            td=tr.insertCell(-1);
            td.innerHTML='';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.total)+'</div>';
        } else {
            td.innerHTML='<div align="center">'+tableObj.id+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.cost + tableObj.cost_nds)+'</div>';
            td=tr.insertCell(-1);
            td.innerHTML='';
            td=tr.insertCell(-1);
            td.innerHTML='<div align="center">'+number_format(tableObj.total)+'</div>';
        }
        // document.getElementById("aside_overall_pay").innerHTML = '<header>Выкупная стоимость</header><p>'+number_format(tableObj.total)+'</p>';
    }
    function GetFootTotalLine(t_deduct,t_year_deduct,t_month_deduct) {
        var nBody=document.getElementById("foot_id");
        var tr=nBody.insertRow(nBody.rows.length);
        var td=tr.insertCell(-1);
        if (withNds) {
            td.height=10;
            td.colSpan=8;
            td.innerHTML=' ';
            tr=nBody.insertRow(nBody.rows.length);
            td=tr.insertCell(-1);
            td.className="table_cal";
            td.colSpan=2;
            td.innerHTML='<div align="center">Общее удорожание за <br>срок лизинга:</div>';
            td=tr.insertCell(-1);
            td.className="table_cal";
            td.innerHTML='<div align="center">'+t_deduct+' %</div>';
            td=tr.insertCell(-1);
            td.className="table_cal";
            td.innerHTML='<div align="center">Удорожание в среднем <br>за год:</div>';
            td=tr.insertCell(-1);
            td.className="table_cal";
            td.innerHTML='<div align="center">'+t_year_deduct+' %</div>';
            td=tr.insertCell(-1);td.className="table_cal";
            td.innerHTML='<div align="center">Удорожание в среднем <br>в месяц:</div>';
            td=tr.insertCell(-1);
            td.className="table_cal";
            td.innerHTML='<div align="center">'+t_month_deduct+' %</div>';td=tr.insertCell(-1);
            td.innerHTML=' ';
        } else {

            td.className="table_cal";

            td.innerHTML='<div align="center">Общее удорожание за <br>срок лизинга: '+t_deduct+' %</div>';
            td=tr.insertCell(-1);

            td.className="table_cal";
            td.innerHTML='<div align="center">Удорожание в среднем <br>за год: '+t_year_deduct+' %</div>';
            td=tr.insertCell(-1);

            td.className="table_cal";
            td.colSpan=2;
            td.innerHTML='<div align="center">Удорожание в среднем <br>в месяц: '+t_month_deduct+' %</div>';
        }
    }
}
function Clear()
{ClearTable();var nBody=document.getElementById("body_id");var tr=nBody.insertRow(nBody.rows.length);var td=tr.insertCell(-1);td.colSpan=8;td.align="center";td.innerHTML='Введите исходные данные и нажмите «Рассчитать».';document.getElementById("frmCalc").reset();}
function ClearTable()
{var a=document.getElementById("body_id");var nodeList=a.childNodes,j,nLen=nodeList.length;for(j=0;j<nLen;j++)
{a.removeChild(a.firstChild);}
    a=document.getElementById("foot_id");nodeList=a.childNodes,nLen=nodeList.length;for(j=0;j<nLen;j++)
{a.removeChild(a.firstChild);}}
function SetBid(nBool)
{var tmpObj=document.getElementById("leasing_rate_id");tmpObj.readOnly=!nBool;if(nBool)
{tmpObj.value="";}
else
{tmpObj.value=(document.getElementById("currency_rub").checked)?16:14;}}
var retErr=false;
function Validate(fName) {
    var frmValidator=new init(fName.name);
    frmValidator.showColorer(1);
    frmValidator.addReqField("leasing_cost","");
    frmValidator.addReqField("leasing_rate","");
    frmValidator.addReqField("leasing_terms","");
    frmValidator.addReqField("purchase_price","");
    retErr=frmValidator.addReqValidation("Поля:\n'Стоимость объекта лизинга'\n'Ставка по лизингу'\n'Срок лизинга'\n'Выкупная стоимость'\nобязательны для заполнения");
    // retErr=frmValidator.addNumValidation("leasing_cost","Стоимость объекта лизинга должна составлять целое положительное числовое значение");
    retErr=frmValidator.addFloatValidation("leasing_rate","Ставка по лизингу должна составлять  положительное (в том числе дробное) числовое значение");
    retErr=frmValidator.addNumValidation("leasing_terms","Срок лизинга должен составлять целое положительное числовое значение в диапазоне от 12 до 300");
    var k=document.getElementById("purchase_price_type_percent").checked;
    if(k) {
        retErr=frmValidator.addFloatValidation("purchase_price","Выкупная стоимость должна составлять положительное (в том числе дробное) числовое значение в диапазоне от 0,1 до 25 %");
    } else {
        retErr=frmValidator.addNumValidation("purchase_price","Выкупная стоимость должна составлять положительное числовое значение в диапазоне от 0,1 до 25 % от 'Стоимость объекта лизинга'");
    }
    // if(retErr&&document.getElementById("leasing_cost_id").value<1) {
    // 	alert("Стоимость объекта лизинга должна составлять целое положительное числовое значение");
    // 	return false;
    // }
    if(retErr&&document.getElementById("leasing_rate_id").value>100) {
        alert("Ставка по лизингу должна составлять  положительное (в том числе дробное) числовые значение");
        return false;
    }
    if(retErr&&document.getElementById("leasing_rate_id").value==0) {
        alert("Ставка по лизингу должна составлять  положительное (в том числе дробное) числовые значение");
        return false;
    }
    if(document.getElementById("advance_type_percent").checked) {
        retErr=frmValidator.addFloatValidation("advance_payment","Аванс должен составлять нулевое либо положительное (в том числе дробное) числовое значение в диапазоне от 0 до 40 - при выборе регистра '%' и от 0 до 40 % от указанной Вами стоимости объекта лизинга - при выборе регистра 'сумма'");
    } else {
        retErr=frmValidator.addNumValidation("advance_payment","Аванс должен составлять нулевое либо положительное (в том числе дробное) числовое значение в диапазоне от 0 до 40 - при выборе регистра '%' и от 0 до 40 % от указанной Вами стоимости объекта лизинга - при выборе регистра 'сумма'");
    }
    var tmpObj=document.getElementById("leasing_terms_id");
    if(retErr&&(tmpObj.value<12||tmpObj.value>300)) {
        alert("Срок лизинга должен составлять целое положительное числовое значение в диапазоне от 12 до 300");
        retErr=false;
    }
    var tmpObj=document.getElementById("advance_payment_id");
    if(retErr&&document.getElementById("advance_type_percent").checked&&tmpObj.value.length>0) {
        var n=tmpObj.value.replace(/,/,".");
        if(n<0||n>40) {
            alert("Аванс должен составлять нулевое либо положительное (в том числе дробное) числовое значение в диапазоне от 0 до 40 - при выборе регистра '%' и от 0 до 40 % от указанной Вами стоимости объекта лизинга - при выборе регистра 'сумма'");
            retErr=false;
        }
    } else if(retErr&&document.getElementById("advance_type_money").checked&&tmpObj.value.length>0) {
        var nConst=GetMoney(document.getElementById("leasing_cost_id").value);
        var nPerc=getPercent(nConst,40);
        var tmp=GetMoney(tmpObj.value);
        if(tmp>nPerc) {
            alert("Аванс должен составлять нулевое либо положительное (в том числе дробное) числовое значение в диапазоне от 0 до 40 - при выборе регистра '%' и от 0 до 40 % от указанной Вами стоимости объекта лизинга - при выборе регистра 'сумма' :\nМаксимально допустимое значение - "+number_format(nPerc)+".");
            retErr=false;
        }
    }
    var tmpObj=document.getElementById("purchase_price_id");
    var k=document.getElementById("purchase_price_type_percent").checked;
    if(retErr&&document.getElementById("purchase_price_type_percent").checked&&tmpObj.value.length>0) {
        var n=tmpObj.value.replace(/,/,".");
        if(n<0.1||n>25) {
            if(k) {
                alert("Выкупная стоимость должна составлять положительное (в том числе дробное) числовое значение в диапазоне от 0,1 до 25 %");
            } else {
                alert("Выкупная стоимость должна составлять положительное числовое значение в диапазоне от 0,1 до 25 %");
            }
            retErr=false;
        }
    } else if(retErr&&document.getElementById("purchase_price_type_money").checked&&tmpObj.value.length>0) {
        var nConst=GetMoney(document.getElementById("leasing_cost_id").value);
        var nPerc=getPercent(nConst,25);
        var minPerc=getPercent(nConst,0.1);
        var tmp=GetMoney(tmpObj.value);
        if(tmp>nPerc) {
            if(k) {
                alert("Выкупная стоимость должна составлять положительное (в том числе дробное) числовое значение в диапазоне от 0,1 до 25 %:\nМаксимально допустимое значение - "+number_format(nPerc)+".");
            } else {
                alert("Выкупная стоимость должна составлять положительное числовое значение в диапазоне от 0,1 до 25 %:\nМаксимально допустимое значение - "+number_format(nPerc)+".");
            }
            retErr=false;
        }
        if(tmp<minPerc) {
            if(k) {
                alert("Выкупная стоимость должна составлять положительное (в том числе дробное) числовое значение в диапазоне от 0,1 до 25 %:\nМинимально допустимое значение - "+number_format(minPerc)+".");
            } else {
                alert("Выкупная стоимость должна составлять положительное числовое значение в диапазоне от 0,1 до 25 %:\nМинимально допустимое значение - "+number_format(minPerc)+".");
            }
            retErr=false;
        }
    }
    return retErr;
}

function SetLeasingRate(nVar) {
    if(document.getElementById("our_bid_id").checked) {
        return;
    }
    var i = document.getElementById("leasing_rate_id");
    if(nVar == "rub" && i.value.length > 0 && i.value != 16) {
        i.value = 16;
    } else if(nVar == "usd" && i.value.length > 0 && i.value != 14) {
        i.value = 14;
    }
}

function SetAdvance() {
    document.getElementById("advance_payment_id").value = "";
}

function SetPurchase() {
    document.getElementById("purchase_price_id").value = "";
}

function init(frmName) {
    var frmObject = "";
    var frmReturn = true;
    var frmErrorTxt = "";
    var n_frmObject = "";
    var frmValidate = "";
    var color = "";
    var defColor = "#E8E8E8";
    var showColor = 0;
    var fieldData = new Array();
    var frmData = new Array();
    var checkData = new Array();
    checkData[0] = "required";
    checkData[1] = "numeric";
    checkData[2] = "string";
    checkData[3] = "alphanum";
    checkData[4] = "email";
    checkData[5] = "minlen";
    checkData[6] = "maxlen";
    checkData[7] = "float";
    checkData[8] = "noselect";
    checkData[9] = "nochecked";
    checkData[10] = "date";
    checkData[11] = "url";
    checkData[12] = "phone";
    checkData[13] = "fileext";
    checkData[14] = "noequals";
    checkData[15] = "icq";
    checkData[16] = "year";
    checkData[17] = "time";
    var errorMessage = new Array();
    errorMessage[checkData[0]] = "Ana iiey ioia?aiiua * iaycaoaeuiu aey caiieiaiey";
    errorMessage[checkData[1]] = "Cia?aiea aie?ii yaeyouny ?eneii";
    errorMessage[checkData[2]] = "Cia?aiea ii?ao niaa??aou oieuei aoeau";
    errorMessage[checkData[3]] = "Cia?aiea ii?ao niaa??aou oieuei aoeau e oeo?u";
    errorMessage[checkData[4]] = "Cia?aieai iiey aie?ai yaeyouny email aa?an";
    errorMessage[checkData[5]] = "Eieee?anoai neiaieia aie?ii auou ia iaiuoa %s.\nOaeouaa eieee?anoai - %s";
    errorMessage[checkData[6]] = "Eieee?anoai neiaieia aie?ii auou ia aieuoa %s.\nOaeouaa eieee?anoai - %s";
    errorMessage[checkData[7]] = "?enei ii?ao eiaou a?iaio? ?anou, n ?acaaeeoaeai '.'.\n Iai?eia? 12.04";
    errorMessage[checkData[8]] = "Auaa?eoa ii?aeoenoa a?oaia cia?aiea";
    errorMessage[checkData[9]] = "Ii?aeoenoa auaa?eoa iiea";
    errorMessage[checkData[10]] = "Cia?aieai iiey aie?ia yaeyouny aaoa.\nOi?iao aaou: %s";
    errorMessage[checkData[11]] = "Cia?aieai iiey aie?ai yaeyouny web aa?an";
    errorMessage[checkData[12]] = "Cia?aieai iiey aae?ai yaeyouny oaeaoiiiue iiia?";
    errorMessage[checkData[13]] = "Ecaeieoa, ii nenoaia ia iiaaa??eaaao aaiiue oi?iao ecia?a?aiey";
    errorMessage[checkData[14]] = "%s ia niaiaaa?o ia?ao niaie";
    errorMessage[checkData[15]] = "Cia?aieai iiey aie?ai yaeyouny ICQ iiia?";
    errorMessage[checkData[16]] = "Cia?aieai iiey aie?ai yaeyouny aia ia?eiay io 1901 e caeai?eaay oaeouei aiaii";
    errorMessage[checkData[17]] = "Cia?aieai iiey aie?ii yaeyouny a?aiy.\nIai?eia?: 10:20";
    var addErrorMessage = new Array();
    addErrorMessage["incorrectDate"] = "Oaeie aaou ia nouanoaoao";
    frmObject = document.forms[frmName];
    this.checkText = function(frmTxt) {
        var checkedFrmTxt = frmTxt.replace(/(^ +)|( +$)/, "");
        var defaultError = "";
        defaultError = errorMessage[frmValidate];
        frmErrorTxt = (checkedFrmTxt.length > 0) ? checkedFrmTxt : defaultError;
        return;
    }
    this.setFocus = function() {
        if(n_frmObject.type != "hidden" && n_frmObject.disabled == false) {
            n_frmObject.focus();
        }
        return;
    }
    this.setColor = function(nCol) {
        color = nCol;
        return;
    }
    this.showColorer = function(flag) {
        flag = (flag == 0 || flag == 1) ? flag : 0;
        showColor = flag;
        return;
    }
    this.setError = function() {
        frmReturn = false;
    }
    this.inColor = function() {
        var nColor = color;
        if(!nColor) {
            nColor = defColor;
        }
        n_frmObject.style.background = nColor;
        n_frmObject.style.borderColor = "red";
        return;
    }
    this.checkColor = function() {
        var tmpObjColor = n_frmObject.style.background.toString().toLowerCase();
        var nColor = color;
        if(!nColor) {
            nColor = defColor;
        }
        var tmpCurrColor = nColor.toLowerCase();
        if(tmpObjColor == tmpCurrColor) {
            return true;
        }
        return false;
    }
    this.noColor = function() {
        n_frmObject.style.backgroundColor = "";
        n_frmObject.style.borderColor = "";
        return;
    }
    this.checkValue = function(value) {
        n_frmObject.value = n_frmObject.value.replace(/(^ +)|( +$)/, "");
    }
    this.addReqField = function(fieldName, frmName) {
        var flag = 0;
        for(var i in fieldData) {
            if(fieldData[i] == fieldName) {
                flag = 1;
            }
        }
        if(flag == 0) {
            fieldData[fieldData.length] = fieldName;
            frmData[fieldData.length] = frmName;
        }
    }
    this.getErrorMessage = function(errorData) {
        var startPoint = 0;
        var endPoint = 0;
        var tmpMsg = frmErrorTxt;
        var endPoint = tmpMsg.search(/\%s/i);
        var tmpNewMsg = "";
        var trueMsg = "";
        if(typeof errorData == "object" && endPoint != -1) {
            for(i in errorData) {
                tmpNewMsg = tmpMsg.substring(startPoint, endPoint + 2);
                tmpMsg = tmpMsg.substr(endPoint + 2, tmpMsg.length);
                endPoint = tmpMsg.search(/\%s/i);
                trueMsg += tmpNewMsg.replace("%s", errorData[i]);
            }
            startPoint = frmErrorTxt.lastIndexOf("%s");
            endPoint = frmErrorTxt.length;
            trueMsg += frmErrorTxt.substring(startPoint + 2, endPoint);
            frmErrorTxt = trueMsg;
        }
        return;
    }
    this.addReqValidation = function(frmTxt) {
        if(frmReturn == false) {
            return false;
        }
        frmValidate = "required";
        var invalidFields = new Array();
        var counter = 0;
        var firstElement = "";
        for(i in fieldData) {
            n_frmObject = frmObject[fieldData[i]];
            this.checkText(frmTxt);
            this.checkValue();
            if(n_frmObject.value.length == 0) {
                if(showColor == 1) {
                    this.inColor();
                }
                firstElement = (firstElement.length == 0) ? fieldData[i] : firstElement;
                invalidFields[counter++] = n_frmObject;
            } else {
                this.noColor();
            }
        }
        if(invalidFields.length > 0) {
            n_frmObject = frmObject[firstElement];
            alert(frmErrorTxt);
            this.setFocus();
            frmReturn = false;
            return false;
        }
        frmReturn = true;
        fieldData = new Array();
        frmData = new Array();
        return true;
    }
    this.addNumValidation = function(frmName, frmTxt) {
        if(frmReturn == false) {
            return false;
        }
        frmValidate = "numeric";
        n_frmObject = frmObject[frmName];
        this.checkText(frmTxt);
        this.checkValue();
        searchExpr = /[^0-9 ]/gi;
        if(n_frmObject.value.length != 0 && n_frmObject.value.search(searchExpr) != -1) {
            alert(frmErrorTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addIntValidation = function(frmName, frmTxt) {
        if(frmReturn == false) {
            return false;
        }
        frmValidate = "numeric";
        n_frmObject = frmObject[frmName];
        this.checkText(frmTxt);
        this.checkValue();
        searchExpr = /[^0-9- ]/gi;
        if(n_frmObject.value.length != 0 && n_frmObject.value.search(searchExpr) != -1) {
            alert(frmErrorTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addStringValidation = function(frmName, frmTxt) {
        if(frmReturn == false) {
            return false;
        }
        frmValidate = "string";
        n_frmObject = frmObject[frmName];
        this.checkText(frmTxt);
        this.checkValue();
        searchExpr = /[^A-Z ]/gi;
        if(n_frmObject.value.length != 0 && n_frmObject.value.search(searchExpr) != -1) {
            alert(frmErrorTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addAlphaNumValidation = function(frmName, frmTxt) {
        if(frmReturn == false) {
            return false;
        }
        frmValidate = "alphanum";
        n_frmObject = frmObject[frmName];
        this.checkText(frmTxt);
        this.checkValue();
        searchExpr = /[^0-9A-Z_ ]/gi;
        if(n_frmObject.value.length != 0 && n_frmObject.value.search(searchExpr) != -1) {
            alert(frmErrorTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addEmailValidation = function(frmName, frmTxt) {
        if(frmReturn == false) {
            return false;
        }
        frmValidate = "email";
        n_frmObject = frmObject[frmName];
        this.checkText(frmTxt);
        this.checkValue();
        searchExpr = /^[A-Za-z0-9_]+([_\.-][A-Za-z0-9]*)*@[A-Za-z0-9]+([_\.-][A-Za-z0-9]+)*\.([A-Za-z]){2,4}$/i;
        if(n_frmObject.value.length != 0 && n_frmObject.value.search(searchExpr) == -1) {
            alert(frmErrorTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addMinLengthValidation = function(frmName, frmTxt, nLength) {
        if(frmReturn == false) {
            return false;
        }
        frmValidate = "minlen";
        n_frmObject = frmObject[frmName];
        this.checkText(frmTxt);
        this.checkValue();
        var valueLength = n_frmObject.value.length;
        if(valueLength != 0 && valueLength < nLength) {
            var errorData = new Array(nLength, valueLength);
            this.getErrorMessage(errorData);
            alert(frmErrorTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addMaxLengthValidation = function(frmName, frmTxt, nLength) {
        if(frmReturn == false) {
            return false;
        }
        frmValidate = "maxlen";
        n_frmObject = frmObject[frmName];
        this.checkText(frmTxt);
        this.checkValue();
        var valueLength = n_frmObject.value.length;
        if(valueLength != 0 && valueLength > nLength) {
            var errorData = new Array(nLength, valueLength);
            this.getErrorMessage(errorData);
            alert(frmErrorTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addFloatValidation = function(frmName, frmTxt) {
        if(frmReturn == false) {
            return false;
        }
        frmValidate = "float";
        n_frmObject = frmObject[frmName];
        this.checkText(frmTxt);
        this.checkValue();
        searchExpr = /^[0-9]*(\.|\,)?[0-9]*$/ig;
        if(n_frmObject.value.length != 0 && n_frmObject.value.search(searchExpr) == -1) {
            alert(frmErrorTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addNoSelectValidation = function(frmName, frmTxt, invalidValue) {
        if(frmReturn == false || frmObject[frmName].type != "select-one") {
            return false;
        }
        frmValidate = "noselect";
        n_frmObject = frmObject[frmName];
        this.checkText(frmTxt);
        this.checkValue();
        for(n = 0; n < n_frmObject.options.length; n++) {
            if(n_frmObject.options[n].selected == true) {
                selectedOption = n_frmObject.options[n];
            }
        }
        if(selectedOption.value == invalidValue) {
            var errorData = new Array(selectedOption.text);
            this.getErrorMessage(errorData);
            alert(frmErrorTxt);
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addNoCheckedValidation = function(frmName, frmTxt, invalidValue) {
        if(frmReturn == false || frmObject[frmName].type != "checkbox") {
            return false;
        }
        frmValidate = "nochecked";
        n_frmObject = frmObject[frmName];
        this.checkText(frmTxt);
        this.checkValue();
        if(n_frmObject.checked == false) {
            alert(frmErrorTxt);
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addDateValidation = function(frmName, frmTxt, dateTemplate) {
        if(frmReturn == false) {
            return false;
        }
        var a = new Array();
        a["%d"] = "((1|2)\\d|3[01]|0?[1-9])";
        a["%m"] = "(1[012]|0?[1-9])";
        a["%y"] = "(19\\d{2}|2(0\\d{2}|1[0]{2}))";
        dMask = dateTemplate;
        var delimiterData = new Array();
        frmValidate = "date";
        n_frmObject = frmObject[frmName];
        tDate = n_frmObject.value;
        this.checkText(frmTxt);
        this.checkValue();
        if(n_frmObject.value.length == 0) {
            return true;
        }
        var delimiter = this.searchDelimiter(dMask);
        var mask = this.searchMask(dMask);
        var tmpMask = "";
        for(i in mask) {
            if(tmpMask.length == 0) {
                tmpMask = a[mask[i]];
            } else {
                tmpMask += "\\" + delimiter + a[mask[i]];
            }
        }
        var tMsg = "";
        var sMask = "^(" + tmpMask + ")$";
        var rExp = new RegExp(sMask);
        if(rExp.exec(tDate) == null) {
            var errorData = new Array(dateTemplate);
            this.getErrorMessage(errorData);
            alert(frmErrorTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        if(this.searchDate(tDate, dMask) == false) {
            alert(addErrorMessage["incorrectDate"]);
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.searchDelimiter = function(dMask) {
        delimiter = dMask.substr(2, 1);
        return delimiter;
    }
    this.searchMask = function(dMask) {
        var sMask = new Array();
        sMask[0] = dMask.substr(0, 2);
        sMask[1] = dMask.substr(3, 2);
        sMask[2] = dMask.substr(6, 2);
        return sMask;
    }
    this.checkDayExists = function(tDate, delimiter) {
        var sDate = new Array();
        i = tDate.search(/\D/);
        sDate[0] = tDate.substring(0, i);
        tDate = tDate.substring(i + 1);
        i = tDate.search(/\D/);
        sDate[1] = tDate.substring(0, i);
        tDate = tDate.substring(i + 1);
        sDate[2] = tDate;
        return sDate;
    }
    this.searchDate = function(tDate, dMask) {
        var sMask = this.searchMask(dMask);
        var delimiter = this.searchDelimiter(dMask);
        var sDate = this.checkDayExists(tDate, delimiter);
        var sYear = 0;
        var sMonth = 0;
        var sDay = 0;
        for(i in sMask) {
            switch(sMask[i]) {
                case("%y"):
                    sYear = sDate[i];
                    break;
                case("%m"):
                    sMonth = (sDate[i] * 1) - 1;
                    break;
                case("%d"):
                    sDay = (sDate[i] * 1);
                    break;
            }
        }
        var i = new Date(sYear, sMonth, sDay);
        day = i.getDate();
        var tMsg = "";
        if(day != sDay) {
            return false;
        }
        return true;
    }
    this.addURLValidation = function(frmName, frmTxt) {
        if(frmReturn == false) {
            return false;
        }
        n_frmObject = frmObject[frmName];
        if(n_frmObject.value.length == 0) {
            return true;
        }
        frmValidate = "url";
        this.checkText(frmTxt);
        this.checkValue();
        sMask = /^(http:\/\/(www\.)?|www\.)\w*\.([a-z]{2}|[a-z]{3})/;
        if(n_frmObject.value.search(sMask) == -1) {
            alert(frmErrorTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addPhoneValidation = function(frmName, frmTxt) {
        if(frmReturn == false) {
            return false;
        }
        n_frmObject = frmObject[frmName];
        if(n_frmObject.value.length == 0) {
            return true;
        }
        frmValidate = "phone";
        this.checkText(frmTxt);
        this.checkValue();
        sMask = /^(\+)?[0-9\-() ]*$/;
        if(n_frmObject.value.search(sMask) == -1) {
            alert(frmErrorTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addEqualField = function(fieldName, frmName) {
        var flag = 0;
        for(var i in fieldData) {
            if(fieldData[i] == fieldName) {
                flag = 1;
            }
        }
        if(flag == 0) {
            fieldData[fieldData.length] = fieldName;
            frmData[fieldData.length] = frmName;
        }
    }
    this.addFileExtentionValidation = function(frmName, frmTxt, validExtentions) {
        if(frmReturn == false) {
            return false;
        }
        n_frmObject = frmObject[frmName];
        if(n_frmObject.value.length == 0) {
            return true;
        }
        if(validExtentions == "" || validExtentions == null) {
            var validExtentions = new Array("jpg", "jpeg", "png");
        }
        frmValidate = "fileext";
        this.checkText(frmTxt);
        var sMask = /\.(\w*)$/;
        var t = sMask.exec(n_frmObject.value);
        var fExt = RegExp.$1.toLowerCase();
        var nFlag = 0;
        for(i in validExtentions) {
            if(validExtentions[i] == fExt) {
                nFlag = 1;
                break;
            }
        }
        if(nFlag == 0) {
            alert(frmErrorTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addEqualValidation = function(frmTxt) {
        if(frmReturn == false) {
            return false;
        }
        frmValidate = "noequals";
        var invalidFields = new Array();
        var counter = 0;
        var n_counter = 0;
        var flag = 0;
        var firstElement = "";
        for(i in fieldData) {
            n_frmObject = frmObject[fieldData[i]];
            this.checkText(frmTxt);
            this.checkValue();
            if(n_counter != 0 && a != n_frmObject.value) {
                if(flag == 0) {
                    firstElement = i;
                }
                invalidFields[counter++] = n_frmObject;
                flag = 1;
            }
            a = n_frmObject.value;
            n_counter++;
        }
        if(invalidFields.length > 0) {
            for(i in fieldData) {
                n_frmObject = frmObject[fieldData[i]];
                if(showColor == 1) {
                    this.inColor();
                }
            }
            n_frmObject = frmObject[firstElement];
            var tmpMessage = "";
            for(i in frmData) {
                if(frmData[i].length > 0) {
                    tmpMessage += (tmpMessage.length == 0) ? "\"" + frmData[i] + "\"" : ", \"" + frmData[i] + "\"";
                }
            }
            var errorData = new Array(tmpMessage);
            this.getErrorMessage(errorData);
            alert(frmErrorTxt);
            this.setFocus();
            frmReturn = false;
            return false;
        }
        frmReturn = true;
        fieldData = new Array();
        frmData = new Array();
        return true;
    }
    this.addICQValidation = function(frmName, frmTxt) {
        if(frmReturn == false) {
            return false;
        }
        n_frmObject = frmObject[frmName];
        if(n_frmObject.value.length == 0) {
            return true;
        }
        frmValidate = "icq";
        this.checkText(frmTxt);
        this.checkValue();
        sMask = /[^0-9\- ]/;
        if(n_frmObject.value.search(sMask) != -1) {
            alert(frmErrorTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addYearValidation = function(frmName, frmTxt) {
        if(frmReturn == false) {
            return false;
        }
        n_frmObject = frmObject[frmName];
        if(n_frmObject.value.length == 0) {
            return true;
        }
        frmValidate = "year";
        this.checkText(frmTxt);
        this.checkValue();
        var nNow = new Date();
        if(!this.addNumValidation(frmName, "")) {
            frmReturn = false;
            return false;
        }
        if(!this.addMinLengthValidation(frmName, "", 4)) {
            frmReturn = false;
            return false;
        }
        if(!this.addMaxLengthValidation(frmName, "", 4)) {
            frmReturn = false;
            return false;
        }
        var currYear = (nNow.getYear() < 1900) ? nNow.getYear() + 1900 : nNow.getYear();
        if(n_frmObject.value.length > 0 && (n_frmObject.value < 1901 || n_frmObject.value > currYear)) {
            alert(frmTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
    this.addTimeValidation = function(frmName, frmTxt) {
        if(frmReturn == false) {
            return false;
        }
        n_frmObject = frmObject[frmName];
        if(n_frmObject.value.length == 0) {
            return true;
        }
        frmValidate = "time";
        this.checkText(frmTxt);
        this.checkValue();
        sMask = /(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])/;
        if(n_frmObject.value.search(sMask) == -1) {
            alert(frmTxt);
            this.setFocus();
            if(showColor == 1) {
                this.inColor();
            }
            frmReturn = false;
            return false;
        }
        this.noColor();
        frmReturn = true;
        return true;
    }
}







//input masker
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.VMasker = factory();
    }
}(this, function() {
    var DIGIT = "9",
        ALPHA = "A",
        ALPHANUM = "S",
        BY_PASS_KEYS = [8, 9, 16, 17, 18, 36, 37, 38, 39, 40, 91, 92, 93],
        isAllowedKeyCode = function(keyCode) {
            for (var i = 0, len = BY_PASS_KEYS.length; i < len; i++) {
                if (keyCode == BY_PASS_KEYS[i]) {
                    return false;
                }
            }
            return true;
        },
        mergeMoneyOptions = function(opts) {
            opts = opts || {};
            opts = {
                precision: opts.hasOwnProperty("precision") ? opts.precision : 2,
                separator: opts.separator || ",",
                delimiter: opts.delimiter || ".",
                unit: opts.unit && (opts.unit.replace(/[\s]/g,'') + " ") || "",
                suffixUnit: opts.suffixUnit && (" " + opts.suffixUnit.replace(/[\s]/g,'')) || "",
                zeroCents: opts.zeroCents,
                lastOutput: opts.lastOutput
            };
            opts.moneyPrecision = opts.zeroCents ? 0 : opts.precision;
            return opts;
        },
        // Fill wildcards past index in output with placeholder
        addPlaceholdersToOutput = function(output, index, placeholder) {
            for (; index < output.length; index++) {
                if(output[index] === DIGIT || output[index] === ALPHA || output[index] === ALPHANUM) {
                    output[index] = placeholder;
                }
            }
            return output;
        }
    ;

    var VanillaMasker = function(elements) {
        this.elements = elements;
    };

    VanillaMasker.prototype.unbindElementToMask = function() {
        for (var i = 0, len = this.elements.length; i < len; i++) {
            this.elements[i].lastOutput = "";
            this.elements[i].onkeyup = false;
            this.elements[i].onkeydown = false;

            if (this.elements[i].value.length) {
                this.elements[i].value = this.elements[i].value.replace(/\D/g, '');
            }
        }
    };

    VanillaMasker.prototype.bindElementToMask = function(maskFunction) {
        var that = this,
            onType = function(e) {
                e = e || window.event;
                var source = e.target || e.srcElement;

                if (isAllowedKeyCode(e.keyCode)) {
                    setTimeout(function() {
                        that.opts.lastOutput = source.lastOutput;
                        source.value = VMasker[maskFunction](source.value, that.opts);
                        source.lastOutput = source.value;
                        if (source.setSelectionRange && that.opts.suffixUnit) {
                            source.setSelectionRange(source.value.length, (source.value.length - that.opts.suffixUnit.length));
                        }
                    }, 0);
                }
            }
        ;
        for (var i = 0, len = this.elements.length; i < len; i++) {
            this.elements[i].lastOutput = "";
            this.elements[i].onkeyup = onType;
            if (this.elements[i].value.length) {
                this.elements[i].value = VMasker[maskFunction](this.elements[i].value, this.opts);
            }
        }
    };

    VanillaMasker.prototype.maskMoney = function(opts) {
        this.opts = mergeMoneyOptions(opts);
        this.bindElementToMask("toMoney");
    };

    VanillaMasker.prototype.maskNumber = function() {
        this.opts = {};
        this.bindElementToMask("toNumber");
    };

    VanillaMasker.prototype.maskAlphaNum = function() {
        this.opts = {};
        this.bindElementToMask("toAlphaNumeric");
    };

    VanillaMasker.prototype.maskPattern = function(pattern) {
        this.opts = {pattern: pattern};
        this.bindElementToMask("toPattern");
    };

    VanillaMasker.prototype.unMask = function() {
        this.unbindElementToMask();
    };

    var VMasker = function(el) {
        if (!el) {
            throw new Error("VanillaMasker: There is no element to bind.");
        }
        var elements = ("length" in el) ? (el.length ? el : []) : [el];
        return new VanillaMasker(elements);
    };

    VMasker.toMoney = function(value, opts) {
        opts = mergeMoneyOptions(opts);
        if (opts.zeroCents) {
            opts.lastOutput = opts.lastOutput || "";
            var zeroMatcher = ("("+ opts.separator +"[0]{0,"+ opts.precision +"})"),
                zeroRegExp = new RegExp(zeroMatcher, "g"),
                digitsLength = value.toString().replace(/[\D]/g, "").length || 0,
                lastDigitLength = opts.lastOutput.toString().replace(/[\D]/g, "").length || 0
            ;
            value = value.toString().replace(zeroRegExp, "");
            if (digitsLength < lastDigitLength) {
                value = value.slice(0, value.length - 1);
            }
        }
        var number = value.toString().replace(/[\D]/g, ""),
            clearDelimiter = new RegExp("^(0|\\"+ opts.delimiter +")"),
            clearSeparator = new RegExp("(\\"+ opts.separator +")$"),
            money = number.substr(0, number.length - opts.moneyPrecision),
            masked = money.substr(0, money.length % 3),
            cents = new Array(opts.precision + 1).join("0")
        ;
        money = money.substr(money.length % 3, money.length);
        for (var i = 0, len = money.length; i < len; i++) {
            if (i % 3 === 0) {
                masked += opts.delimiter;
            }
            masked += money[i];
        }
        masked = masked.replace(clearDelimiter, "");
        masked = masked.length ? masked : "0";
        if (!opts.zeroCents) {
            var beginCents = number.length - opts.precision,
                centsValue = number.substr(beginCents, opts.precision),
                centsLength = centsValue.length,
                centsSliced = (opts.precision > centsLength) ? opts.precision : centsLength
            ;
            cents = (cents + centsValue).slice(-centsSliced);
        }
        var output = opts.unit + masked + opts.separator + cents + opts.suffixUnit;
        return output.replace(clearSeparator, "");
    };

    VMasker.toPattern = function(value, opts) {
        var pattern = (typeof opts === 'object' ? opts.pattern : opts),
            patternChars = pattern.replace(/\W/g, ''),
            output = pattern.split(""),
            values = value.toString().replace(/\W/g, ""),
            charsValues = values.replace(/\W/g, ''),
            index = 0,
            i,
            outputLength = output.length,
            placeholder = (typeof opts === 'object' ? opts.placeholder : undefined)
        ;

        for (i = 0; i < outputLength; i++) {
            // Reached the end of input
            if (index >= values.length) {
                if (patternChars.length == charsValues.length) {
                    return output.join("");
                }
                else if ((placeholder !== undefined) && (patternChars.length > charsValues.length)) {
                    return addPlaceholdersToOutput(output, i, placeholder).join("");
                }
                else {
                    break;
                }
            }
            // Remaining chars in input
            else{
                if ((output[i] === DIGIT && values[index].match(/[0-9]/)) ||
                    (output[i] === ALPHA && values[index].match(/[a-zA-Z]/)) ||
                    (output[i] === ALPHANUM && values[index].match(/[0-9a-zA-Z]/))) {
                    output[i] = values[index++];
                } else if (output[i] === DIGIT || output[i] === ALPHA || output[i] === ALPHANUM) {
                    if(placeholder !== undefined){
                        return addPlaceholdersToOutput(output, i, placeholder).join("");
                    }
                    else{
                        return output.slice(0, i).join("");
                    }
                }
            }
        }
        return output.join("").substr(0, i);
    };

    VMasker.toNumber = function(value) {
        return value.toString().replace(/(?!^-)[^0-9]/g, "");
    };

    VMasker.toAlphaNumeric = function(value) {
        return value.toString().replace(/[^a-z0-9 ]+/i, "");
    };

    return VMasker;
}));



VMasker(document.getElementById("leasing_cost_id")).maskMoney({
    precision: 0,
    separator: ',',
    delimiter: ' ',
});