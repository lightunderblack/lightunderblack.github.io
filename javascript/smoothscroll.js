(function($, window, undefined){
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function SmoothScroll(config){
        return this._init(config);
    }

    SmoothScroll.prototype = {
        constructor: SmoothScroll,

        _init: function(config){
            var me = this; 

            me._config = $.extend({
                //container
                //go2Top 
                //destination
                duration: 500,
                scrollTop: 20    
            }, config);
            me._cacheParam()._bindEventListener();

            return me;   
        },

        _cacheParam: function(){
            var i,
                me = this,
                config = me._config;

            for(i in config){
                if(hasOwnProperty.call(config, i)){
                    me['_' + i] = config[i];
                    config[i] = null;
                    delete config[i];   
                }
            }

            return me;
        },

        _bindEventListener: function(){
            var me = this,
                $go2Top = me._go2Top,
                $container = me._container;

            me._showOrHideGo2Top();    
            $container.on('scroll.smoothccroll', function(e){
                 me._showOrHideGo2Top();
            });
            $go2Top.on('click.smoothccroll', function(e){
                me._smoothScroll();
                return false;
            }); 

            return me;   
        },

        _smoothScroll: function(duration){
            var step,
                distance,
                me = this,
                $container = me._container,
                destination = me._destination.offset().top;

            duration = duration == null ? me._duration : duration;
            if(duration < 0){
                me._showOrHideGo2Top();
                return;
            }
            distance = destination - $container.scrollTop();
            step = distance / duration * 10;
            me._smoothScrollTime = setTimeout(function(){
                if(!isNaN(parseInt(step, 10))) {
                    $container.scrollTop($container.scrollTop() + step);
                    me._smoothScroll(duration - 10); 
                }else{
                    me._showOrHideGo2Top();
                }   
            }, 10);  

            return me;                  
        },

        _showOrHideGo2Top: function(){
            var me = this,
                $go2Top = me._go2Top;

            $go2Top.css('opacity', me._container.scrollTop() > me._scrollTop ? 1 : 0);

            return me;
        }
    };

    window.SmoothScroll = SmoothScroll;
})(jQuery, this);