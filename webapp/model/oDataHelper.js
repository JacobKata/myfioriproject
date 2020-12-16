sap.ui.define([],function(){
	return {
		callGETOData:function(oModel, sapPath, aFilters){
			return new Promise(function(resolve, reject){
				debugger;
					oModel.read(sapPath, {
						success: function(data, oResponse) {
							//positive response
							resolve(data);

						},
						error: function(oError, oResponse) {
							//Negative response
                           reject(oError);
						}
					});
			});
		}
	};
});