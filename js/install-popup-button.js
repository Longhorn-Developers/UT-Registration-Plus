(function (w, d) {
    'use strict';

    if (w.DBOX_INSTALLED) return;
    w.DBOX_INSTALLED = true;

    var UTM_PARAMS = extractUtmParams();

    function extractUtmParams() {
      var data = {};
      var queryString = window.location.href.split('?')[1];
      if(queryString) {
        var supportedUtmParams = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_term', 'utm_content'];
        var params = queryString.split('&');
        params.map(function(p){
          var splitted = p.split('='),  key = splitted[0], value = splitted[1];

          if(supportedUtmParams.indexOf(key) >= 0) {
            data[key] = value;
          }
        });
      }

      return data;
    }

    var buttonClass  = 'dbox-donation-button',
        frameID = 'donorbox_widget_frame',
        setFrameStyles = function (style) {
          style.position = 'fixed';
          style.display = 'block';
          style.left = '0px';
          style.top = '0px';
          style.width = '100%';
          style.height = '100%';
          style.margin = '0px';
          style.padding = '0px';
          style.border = 'none';
          style.overflowX = 'hidden';
          style.overflowY = 'auto';
          style.visibility = 'visible';
          style.backgroundColor = 'transparent';
          style.zIndex = 2147483647;
        };

    function toggleScrolling(disable) {
        d.body.style.overflow = disable ? 'hidden' : 'auto';
    }

    function remove(el) {
        el.parentNode.removeChild(el);
        toggleScrolling()
    }

    function queryButtons() {
        var links = d.getElementsByClassName(buttonClass), arr = function (arrayLike) {
            return Array.prototype.slice.call(arrayLike)
        };
        if (typeof w.DonorBox == 'object' && w.DonorBox.widgetLinkClassName)
            links = arr(links).concat(arr(d.getElementsByClassName(w.DonorBox.widgetLinkClassName)));
        return links;
    }

    function shouldOpenNewTab() {
      var agent = navigator.userAgent.toLowerCase();
      return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(agent)||
             /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substr(0,4));
    }

    function addEventListener(target, ev, listener) {
        if (target.addEventListener)
            target.addEventListener(ev, listener, false);
        else if (target.attachEvent)
            target.attachEvent('on' + ev, listener);
        else target['on' + ev] = ev
    }

    function openTheModal(e) {
        e.preventDefault();
        var target = e.currentTarget || e.target,
            frame = d.createElement('iframe');

        toggleScrolling(true);
        frame.id = frameID;
        frame.frameborder = 0;
        frame.setAttribute('allowpaymentrequest', true);
        frame.src = target.href + (target.href.indexOf('?') == -1 ? '?' : '&') + 'modal=true';
        setFrameStyles(frame.style);
        d.body.appendChild(frame);
        frame.focus();

        // Send UTM Params to donorbox iframes
        if(Object.keys(UTM_PARAMS).length > 0) {
          frame.onload = function(){
            frame.contentWindow.postMessage({action: 'set-utm-params', msg: UTM_PARAMS}, '*');
          };
        }
    }

    w.dw_open = function () {
        var buttons = queryButtons(), i = 0, len = buttons.length;
        if (len == 0) throw 'Donation widget button is not exists. If you see these on your WEB page, please, check button installation steps.';

        if (shouldOpenNewTab())
          for(; i < len; i++)
              buttons[i].setAttribute('target', '_blank');
        else
          for(; i < len; i++)
              addEventListener(buttons[i], 'click', openTheModal)
    };

    addEventListener(w, 'message', function (e) {
        typeof e.data == 'object' && e.data.from == 'dbox' &&
          e.data.close === true && remove(d.getElementById(frameID))
    });

    w.dw_open();
}(window, document));
