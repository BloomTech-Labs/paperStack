import React, { Component } from 'react';
import './CoverFlow.css';

class CoverFlow extends Component {
  constructor() {
    super();
    this.state = { selectedIndex: 2 };
    this.urls = [
      'http://katsosco.gr/media/images/products/images/2_MT_GlacierNP500px-200x200.jpg', 
      'https://advertiseonbing.blob.core.windows.net/blob/bingads/media/library/global/social/bing-ads-200x200-teal.png',
      'https://www.frbsf.org/wp-content/themes/sf_fed_rebrand_2015/library/images/apple-touch-icon-200x200.png',
      'http://www.resident-music.com/image/cache/data/preoc-200x200.jpg',
      'http://s1.dmcdn.net/ncMic/200x200-MoV.jpg'
    ];
  }

  select = (selectedIndex) => this.setState({ selectedIndex });

  getNonFocussedElementStyle(loc, i, multiplier) {
    return { 
      backgroundImage: "url("+ this.urls[i] +")",
      WebkitTransform: "translateX(" + -70 * multiplier + "%) rotateY(" + -loc * 45 +"deg)",
      zIndex: loc * multiplier,
      opacity: 1 - (-0.1 * loc * multiplier)
    };
  }

  getStyles = (i) => {
    const index = this.state.selectedIndex;
    const multiplier = index - i;
    if (i === index) return { backgroundImage: "url("+ this.urls[i] +")", transform: 'translateZ(180px)' };
    else if (i < index) return this.getNonFocussedElementStyle(-1, i, multiplier);
    else return this.getNonFocussedElementStyle(1, i, multiplier);
  }

  render() {
    return (<div className="CoverFlow">
              <div className="CoverFlow-box" onClick={() => this.select(0)} style={this.getStyles(0)}></div>
              <div className="CoverFlow-box" onClick={() => this.select(1)} style={this.getStyles(1)}></div>
              <div className="CoverFlow-box" onClick={() => this.select(2)} style={this.getStyles(2)}></div>
              <div className="CoverFlow-box" onClick={() => this.select(3)} style={this.getStyles(3)}></div>
              <div className="CoverFlow-box" onClick={() => this.select(4)} style={this.getStyles(4)}></div>
            </div>);
  }
}
    
export default CoverFlow;