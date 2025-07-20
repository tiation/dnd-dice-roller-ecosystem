$(document).ready(function() {
	
   adsenseTimer = 1;

   setTimeout(function(){
	  adsenseTimer = 0;
   }, 150000);

    $('.roll, #roll-all').click(function() {
        
	if(adsenseTimer == 0)
	{
		$url = $('#adsense-header').attr("src");
        	$('#adsense-header').attr("src","about:blank");
        	$('#adsense-header').attr("src",$url);

        $url = $('#adsense-left').attr("src");
        	$('#adsense-left').attr("src","about:blank");
        	$('#adsense-left').attr("src",$url);

	        adsenseTimer = 1;

		setTimeout(function(){
			adsenseTimer = 0;
   		}, 150000);

	}

    });

});

