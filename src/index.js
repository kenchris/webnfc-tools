import { LitElement, html, css } from "../web_modules/lit-element.js";
import "../web_modules/@material/mwc-drawer.js";
import "../web_modules/@material/mwc-top-app-bar.js";
import "../web_modules/@material/mwc-icon-button.js";
import "../web_modules/@material/mwc-button.js";
import "../web_modules/@material/mwc-dialog.js";
import "../web_modules/@material/mwc-snackbar.js";
import "../web_modules/@material/mwc-select.js";
import '../web_modules/@material/mwc-menu.js';
import '../web_modules/@material/mwc-textfield.js';
import '../web_modules/@material/mwc-list/mwc-list-item.js';

class NDEFRecordRoot extends LitElement {
  static styles = css`
    :host {
      border: solid;
      margin: 16px;
      padding: 6px 16px 6px 16px;
      width: calc(100% - 64px);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      align-content: stretch;
    }

    #header {
      width: calc(100% + 16px);
      height: 42px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      align-content: stretch;
    }

    #header #expand {
      flex: 1;
    }
  `;

  firstUpdated() {
    this.menu = this.shadowRoot.querySelector("#menu");
    this.menu.anchor = this.shadowRoot.querySelector("#menu-button");
  }

  records() {
    let records = [];
    for (let child of Array.from(this.children)) {
      if ("records" in child) {
        records.push(child.records());
      }
    }
    return records;
  }

  render() {
    const addRecord = (name) => {
      const element = document.createElement(name);
      this.appendChild(element);
    } 

    return html`
      <div id="header">
        Root
        &nbsp;&nbsp;&nbsp;
        <div id="expand"></div>
        <div style="position: relative;">
          <mwc-icon-button id="menu-button" icon="add" @click=${() => this.menu.show()}></mwc-icon-button>
          <mwc-menu id="menu">
            <mwc-list-item @click=${() => addRecord("record-empty")}>Empty record</mwc-list-item>
            <mwc-list-item @click=${() => addRecord("record-text")}>Text record</mwc-list-item>
            <mwc-list-item @click=${() => addRecord("record-url")}>URL record</mwc-list-item>
            <mwc-list-item @click=${() => addRecord("record-absolute-url")}>Absolute URL record</mwc-list-item>
            <mwc-list-item @click=${() => addRecord("record-empty")}>Smart Poster record</mwc-list-item>
            <mwc-list-item @click=${() => addRecord("record-empty")}>MIME type record</mwc-list-item>
            <mwc-list-item @click=${() => addRecord("record-empty")}>External type record</mwc-list-item>
            <mwc-list-item @click=${() => addRecord("record-empty")}>Unknown record</mwc-list-item>
          </mwc-menu>
        </div>
      </div>
      <slot></slot>
    `;
  }
}
customElements.define("record-root", NDEFRecordRoot);

const subItemStyle = css`
  :host {
    border: solid;
    margin: 6px 0px 0px 0px;
    padding: 16px 16px;
    width: calc(100% - 16px);
  }

  #header {
    width: calc(100% + 16px);
    height: 18px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: stretch;
  }

  #header span {
    color: gray;
    font-size: 10pt;
  }

  #header #expand {
    flex: 1;
  }

  mwc-textfield, mwc-select {
    margin: 16px 0px 0px 0px;
    width: 100%;
  }
`; 

class NDEFEmptyRecord extends LitElement {
  static styles = [subItemStyle];

  records() {
    return {
      recordType: "empty"
    };
  }

  render() {
    return html`
      <div id="header">
        Record
        &nbsp;&nbsp;&nbsp;
        <span>Empty</span>
        <div id="expand"></div>
        <div style="position: relative;">
          <mwc-icon-button icon="remove" @click=${() => this.remove()}></mwc-icon-button>
        </div>
      </div>
    `;
  }
}
customElements.define("record-empty", NDEFEmptyRecord);

class NDEFTextRecord extends LitElement {
  static styles = [subItemStyle, css`
    mwc-textfield {
      margin: 16px 0px 0px 0px;
      width: 100%;
    }
  `];

  records() {
    const textValue = this.shadowRoot.querySelector("#text-input").value || "";
    const langValue = this.shadowRoot.querySelector("#lang-input").value || "en-US";
    const encodingValue = this.shadowRoot.querySelector("#encoding-input").value || "utf-8";

    return {
      recordType: "text",
      data: textValue,
      encoding: encodingValue,
      lang: langValue
    };
  }

  render() {
    return html`
      <div id="header">
        Record
        &nbsp;&nbsp;&nbsp;
        <span>Text (UTF-8)</span>
        <div id="expand"></div>
        <div style="position: relative;">
          <mwc-icon-button icon="remove" @click=${() => this.remove()}></mwc-icon-button>
        </div>
      </div>
      <mwc-textfield id="text-input" outlined label="Text"></mwc-textfield>
      <mwc-textfield id="lang-input" outlined label="Language code" value="en-US"></mwc-textfield>
      <mwc-select id="encoding-input" outlined label="Encoding">
        <mwc-list-item value="utf-8" selected>UTF-8</mwc-list-item>
        <mwc-list-item value="utf-16">UTF-16</mwc-list-item>
      </mwc-select>
    `;
  }
}
customElements.define("record-text", NDEFTextRecord);

class NDEFURLRecord extends LitElement {
  static styles = [subItemStyle];

  records() {
    const textValue = this.shadowRoot.querySelector("#text-input").value || "";

    return {
      recordType: "url",
      data: textValue
    };
  }

  render() {
    return html`
      <div id="header">
        Record
        &nbsp;&nbsp;&nbsp;
        <span>URL</span>
        <div id="expand"></div>
        <div style="position: relative;">
          <mwc-icon-button icon="remove" @click=${() => this.remove()}></mwc-icon-button>
        </div>
      </div>
      <mwc-textfield id="text-input" outlined type="url" label="URL"></mwc-textfield>
    `;
  }
}
customElements.define("record-url", NDEFURLRecord);

class NDEFAbsoluteURLRecord extends LitElement {
  static styles = [subItemStyle];

  records() {
    const textValue = this.shadowRoot.querySelector("#text-input").value || "";

    return {
      recordType: "absolute-url",
      data: textValue
    };
  }

  render() {
    return html`
      <div id="header">
        Record
        &nbsp;&nbsp;&nbsp;
        <span>Absolute URL</span>
        <div id="expand"></div>
        <div style="position: relative;">
          <mwc-icon-button icon="remove" @click=${() => this.remove()}></mwc-icon-button>
        </div>
      </div>
      <mwc-textfield id="text-input" outlined type="url" label="URL"></mwc-textfield>
    `;
  }
}
customElements.define("record-absolute-url", NDEFAbsoluteURLRecord);

class NFCTools extends LitElement {
  static styles = css`
  .drawer-content {
    padding: 0px 16px 0 16px;
  }
  .main-content {
    width: 100vw;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: stretch;
  }

  hr {
    width: 100%;
  }
  `;

  async firstUpdated() {
    const drawer = this.shadowRoot.querySelector("mwc-drawer");
    const container = drawer.parentNode;
    container.addEventListener('MDCTopAppBar:nav', _ => {
      drawer.open = !drawer.open;
    });
    this.rootRecord = this.shadowRoot.querySelector("record-root");
  }

  write() {
    const records = this.rootRecord.records();
    console.table(records);
    if ("NDEFWriter" in window) {
      // Hook up with toast or some dialog
      const writer = new NDEFWriter();
      writer.write({ records });
    }
  }

  render() {
    return html`
      <mwc-drawer hasHeader type=modal>
        <span slot="title">Web NFC tools</span>
        <span slot="subtitle">Configure your NFC tags today</span>
        <div class="drawer-content">
          <p><a href="https://w3c.github.io/web-nfc/">Web NFC API specification</a></p>
        </div>
        <div slot="appContent">
          <mwc-top-app-bar>
            <mwc-icon-button slot="navigationIcon" icon="menu"></mwc-icon-button>
            <div slot="title">Web NFC tools</div>
          </mwc-top-app-bar>
          <div class="main-content">
            <record-root>
              <record-text></record-text>
            </record-root>
            <mwc-button @click=${() => this.write()}>Write</mwc-button>
          </div>
        </div>
      </mwc-drawer>
      <mwc-snackbar id="snackbar">
        <mwc-button id="actionButton" slot="action">CANCEL</mwc-button>
        <mwc-icon-button id="iconButton" icon="close" slot="dismiss"></mwc-icon-button>
      </mwc-snackbar>
    `;
  }
}

customElements.define("nfc-tools", NFCTools);