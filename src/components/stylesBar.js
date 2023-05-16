import React, {Component} from 'react';


let cssRootH = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-h')
let cssRootS = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-s').slice(0,-1)
let cssRootL = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-l').slice(0,-1)

let cssRootHeaderText = getComputedStyle(document.querySelector(':root')).getPropertyValue('--header-text-color').slice(0,-1)

class Stylebar extends Component {
    constructor(){
        super()
        this.state = {
            theme: {
                colorPick1: this.hslToHex(cssRootH, cssRootS, cssRootL),
                colorPick2: cssRootHeaderText,
            }
        }
    }

    handleColorChange = e => {
      let colorPicker1 = document.getElementById("colorPick1")
      let colorPicker2 = document.getElementById("colorPick2")
      let HSLcolorPicker1 = this.hexToHSL(colorPicker1.value)
      document.querySelector(":root").style.setProperty("--color-h", HSLcolorPicker1.H)
      document.querySelector(":root").style.setProperty("--color-s", `${HSLcolorPicker1.S}%`)
      document.querySelector(":root").style.setProperty("--color-l", `${HSLcolorPicker1.L}%`)
      document.querySelector(":root").style.setProperty("--header-text-color", `${colorPicker2.value}`)
      this.setState({
          theme: {
              colorPick1: colorPicker1.value,
              colorPick2: colorPicker2.value
          }
      })
    }

    hexToHSL(H) {
        // Convert hex to RGB first
        let r = 0, g = 0, b = 0;
        if (H.length == 4) {
          r = "0x" + H[1] + H[1];
          g = "0x" + H[2] + H[2];
          b = "0x" + H[3] + H[3];
        } else if (H.length == 7) {
          r = "0x" + H[1] + H[2];
          g = "0x" + H[3] + H[4];
          b = "0x" + H[5] + H[6];
        }
        // Then to HSL
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r,g,b),
            cmax = Math.max(r,g,b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;
      
        if (delta == 0)
          h = 0;
        else if (cmax == r)
          h = ((g - b) / delta) % 6;
        else if (cmax == g)
          h = (b - r) / delta + 2;
        else
          h = (r - g) / delta + 4;
      
        h = Math.round(h * 60);
      
        if (h < 0)
          h += 360;
      
        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return {"H":h, "S":s, "L":l}
      }

      hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
          const k = (n + h / 30) % 12;
          const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
        };
        return `#${f(0)}${f(8)}${f(4)}`;
      }

      printPdf() {
        // newWindow object can only be created by window.open()
        // in an event listener.
        // If we call it elsewhere, null will be returned
        const newWindow = window.open();
    
        // creating a new html node
        const html = document.createElement("html");
    
        // We can load the CSS by cloning the document head
        // NOTE: since we are going to move node to a foreign 
        // window object, we need to clone the DOM nodes.
        // If we dont clone, the node in this original window 
        // will disappear, because we have moved it to a new location.
        // cloneNode(true) will perform a deep clone 
        const head = document.head.cloneNode(true);
    
        // creating a new body element for our newWindow
        const body = document.createElement("body");
    
        // grab the elements that you want to convert to PDF
        const section =  deepCloneWithStyles(document.querySelector("html"))
        
        function deepCloneWithStyles (node) {
            const style = window.getComputedStyle(document.body, null);
            const clone = node.cloneNode(false);
            if (clone.style && style.cssText)
            clone.style.cssText = style.cssText;
            for (let child of node.childNodes)
                clone.appendChild(deepCloneWithStyles(child));
            return clone;
        }
        section.querySelector(".stylesBar").style.visibility = "hidden"
        section.querySelectorAll("button").forEach((e)=>{
            e.style.visibility = "hidden"
        })
        section.querySelectorAll("select").forEach((e)=>{
          e.style.appearance = "none"
      })
        
        // you can append as many child as you like
        // this is where we add our elements to the new window.
        body.appendChild(section);

        html.appendChild(head);
        html.appendChild(body);
    
        // write content to the new window's document.
        newWindow.document.write(html.innerHTML);
    
        // close document to stop writing
        // otherwise new window may hang
        newWindow.document.close();
        
        // print content in new window as PDF
        newWindow.print();
    
        // close the new window after printing
        newWindow.close();
    }
    
    

    render() {
        const { theme } = this.state;
        return (
            <div className="stylesBar">
                <div onClick={(e)=>this.printPdf()}>PDF</div> 
                <input
                    id="colorPick2"
                    type='color'
                    value={theme.colorPick2}
                    onChange={(e)=>{
                        this.handleColorChange(e)
                    }}
                />
                <input
                    id="colorPick1"
                    type='color'
                    value={theme.colorPick1}
                    onChange={(e)=>{
                        this.handleColorChange(e)
                    }}
                />
            </div>
        );
    }
}

export default Stylebar;