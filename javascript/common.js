(function($){
    var top,
        extractHeight,
        $go2Top = $('.go2Top'),
        $navigation = $('.navigation'),
        $sidenavWrapper = $('.sidenav-wrapper'),
        sidenavWrapper = $sidenavWrapper[0];
    
    function getHeight(){
        extractHeight = $navigation.outerHeight(true);
        top = -($sidenavWrapper.outerHeight(true)+extractHeight)+'px';
    }

    getHeight();

	//初始化
    new SmoothScroll({
    	duration: 300,
        go2Top: $go2Top,
        container: $(window),
        destination: $('body')
    });
    
    $go2Top.on('click', function(){
        if($sidenavWrapper.css('visibility') === 'visible'){
            $sidenavWrapper.css('top', top);    
        }
    }); 

    $('a').on('focus', function(){
        this.blur();
    });

    $navigation.children('.menu').on('click', function(e){
    	if($sidenavWrapper.css('visibility') === 'hidden'){
    		$sidenavWrapper.css({
    			visibility: 'visible',
    			top: extractHeight + 'px'
    		});    		
    	}else{
			$sidenavWrapper.css({top: top});	
    	}
    	e.stopPropagation();
    });

    $(document).on('click', function(e){
    	var target = e.srcElement || e.target;
    	if($sidenavWrapper.css('visibility') === 'visible'){
    		$sidenavWrapper.css('top', top);	
    	}
    });

    $sidenavWrapper.on('webkitTransitionEnd', function(e){
    	var $this = $(this);
    	if(parseInt($this.css('top'), 10) < 0){
    		$this.css({visibility: 'hidden'});
    	}
    });

    window.onorientationchange = window.onresize = function(){
        getHeight(); 
    };
})(jQuery);