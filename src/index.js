import isTouch from 'has-touch';
import EventEmitter from 'events';

class ViewPort extends EventEmitter {
  constructor() {
    super();
    const raf = window.requestAnimationFrame;
    let tmr;

    this._isIOS = navigator.platform.search(/iPad|iPhone|iPod/) !== -1;

    const sendEvent = () => {
      tmr = 0;
      this.emit('viewport', this.getViewport());
    };

    if (raf) {
      let ticking = false;
      const handler = () => {
        if (!ticking) {
          raf(() => {
            sendEvent();
            ticking = false;
          });
          ticking = true;
        }
      };
      ['scroll', 'resize'].forEach(event => {
        window.addEventListener(event, handler);
      });
    } else {
      const timVal = isTouch ? 1 : 200;
      const handler = () => {
        if (tmr) {
          clearTimeout(tmr);
        }
        tmr = setTimeout(sendEvent, timVal);
      };
      ['scroll', 'resize'].forEach(event => {
        window.addEventListener(event, handler);
      });
    }
  }
  _width({w, h}) {
    const orientation = window.orientation;
    if (orientation === undefined) {
      return w;
    }
    if (orientation === 0 || orientation === 180) {
      return Math.min(w, h);
    }
    return Math.max(w, h);
  }
  _height({w, h}) {
    const orientation = window.orientation;
    if (orientation === undefined) {
      return h;
    }
    if (orientation === 0 || orientation === 180) {
      return Math.max(h, w);
    }
    return Math.min(h, w);
  }
  getViewport() {
    const clientWidth = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
    const height = this._height({w: window.innerWidth, h: window.innerHeight});
    const clientHeight = this._isIOS ?
      height : document.documentElement.clientHeight;
    return {
      isIOS: this._isIOS,
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset,
      width: this._width({w: window.innerWidth, h: window.innerHeight}),
      height,
      clientWidth: this._width({w: clientWidth, h: clientHeight}),
      clientHeight: this._height({w: clientWidth, h: clientHeight})
    };
  }
}

const theViewPort = new ViewPort();

export default theViewPort;
