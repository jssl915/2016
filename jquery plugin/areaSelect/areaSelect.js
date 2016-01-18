$.extend({
    areaGetName:function(d){
        var d1 = d.substring(0,2)+'0000';
        var d2 = d.substring(0,4)+'00';
        var aAreaName=[];
        for(var i=0;i<aArea.length;i++){
            var area = aArea[i];
            if(d1==area.a){
                aAreaName[0]=area.c;
            }
            if(d2==area.a){
                aAreaName[1]=area.c;
            }
            if(d==area.a){
                aAreaName[2]=area.c;
            }
        }
        if(aAreaName[2]==aAreaName[1]){
        	aAreaName.length = 2;
        }
        if(aAreaName[1]==aAreaName[0]){
        	aAreaName.length = 1;
        }
        return aAreaName;
    },
 	areaSelect:function(data){
		var aId = data.aId;
		var oProvice = $('#'+aId[0]);
		var oCity = $('#'+aId[1]);
		var oDistrict = $('#'+aId[2]);
		//生成数组
		var aCity=[],aDistrict=[];
		initArray();
		function initArray(){
			for(var i=0;i<aArea.length;i++){
				var area = aArea[i];
				area.d==1 && oProvice.append('<option value="'+area.a+'">'+area.c+'</option>');
				area.d==2 && aCity.push(area);
				area.d==3 && aDistrict.push(area);
			}
            oProvice.val('');
			initCity();
		}
		if(data.addressCode!=undefined){
			var addressCode = data.addressCode+'';
			var d1 = addressCode.substring(0,2)+'0000';
	        var d2 = addressCode.substring(0,4)+'00';
	        oProvice.val(d1);
	        initCity(d2);
			initDistrict(addressCode);
		}
		
		function initCity(city){
			oCity.empty();
			var flag = false; //判断是否是直辖
			for(var i=0;i<aCity.length;i++){	
				var d = aCity[i];
				d.b == oProvice.val() && oCity.append('<option value="'+d.a+'">'+d.c+'</option>');	
				if(city&&d.a==city){
					flag = true;
				}
			}
            flag?oCity.val(city):oCity.val(data.addressCode);
		}
		
		function initDistrict(district){
			oDistrict.empty(); 
			for(var i=0;i<aDistrict.length;i++){
				var d = aDistrict[i];
				d.b==oCity.val() && oDistrict.append('<option value="'+d.a+'">'+d.c+'</option>');			
			}
			oDistrict.val(district);
		}

		//绑定选择方法
		oProvice.change(function(){
			initCity();		
			initDistrict();
		});
		oCity.change(function(){
			initDistrict();					   
		})	
	}	
});