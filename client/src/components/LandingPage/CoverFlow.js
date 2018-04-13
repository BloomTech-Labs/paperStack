import React, { Component } from 'react';
import invoiceImg from './invoice.png';
import './CoverFlow.css';

class CoverFlow extends Component {
  constructor() {
    super();
    this.state = { selectedIndex: 2 };
    // we will replace this.urls later with images of templates
    this.urls = [
      invoiceImg, 
      invoiceImg,
      invoiceImg,
      invoiceImg,
      invoiceImg
    ];
  }

  select = (selectedIndex) => this.setState({ selectedIndex });

  getUnfocusedBoxStyle(l, i, m) { // location, index, multiplier
    return { 
      backgroundImage: "url("+ this.urls[i] +")",
      WebkitTransform: "translateX(" + -70 * m + "%) rotateY(" + -l * 45 +"deg)",
      zIndex: l * m,
      opacity: 1 - (-0.1 * l * m)
    };
  }

  getStyles = (i) => {
    const index = this.state.selectedIndex;
    const m = index - i; // multiplier
    if (i === index) return { backgroundImage: "url("+ this.urls[i] +")", transform: 'translateZ(180px)' };
    else if (i < index) return this.getUnfocusedBoxStyle(-1, i, m);
    else return this.getUnfocusedBoxStyle(1, i, m);
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