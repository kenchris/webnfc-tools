import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

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
      margin-left: 12px;
      width: calc(100% + 12px);
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
          <sl-dropdown>
            <sl-icon-button id="menu-button" slot="trigger" name="plus-square-dotted" style="font-size: 1.5rem;"></sl-icon-button>
            <sl-menu>
              <sl-menu-item @click=${() => addRecord("record-empty")}>
                Empty record
                <sl-icon slot="prefix" name="chat-right"></sl-icon>
              </sl-menu-item>
              <sl-menu-item @click=${() => addRecord("record-text")}>
                Text record
                <sl-icon slot="prefix" name="chat-right-text"></sl-icon>
              </sl-menu-item>
              <sl-menu-item @click=${() => addRecord("record-url")}>
                URL record
                <sl-icon slot="prefix" name="house"></sl-icon>
              </sl-menu-item>
              <sl-menu-item @click=${() => addRecord("record-absolute-url")}>
                Absolute URL record
                <sl-icon slot="prefix" name="house"></sl-icon>
              </sl-menu-item>
              <sl-menu-item @click=${() => addRecord("record-empty")}>
                Smart Poster record
                <sl-icon slot="prefix" name="easel2"></sl-icon>
              </sl-menu-item>
              <sl-menu-item @click=${() => addRecord("record-mime")}>
                MIME type record
                <sl-icon slot="prefix" name="file-bar-graph"></sl-icon>
              </sl-menu-item>
              <sl-menu-item @click=${() => addRecord("record-external")}>
                External type record
                <sl-icon slot="prefix" name="box-arrow-up-right"></sl-icon>
              </sl-menu-item>
              <sl-menu-item @click=${() => addRecord("record-empty")}>
                Unknown record
                <sl-icon slot="prefix" name="patch-question"></sl-icon>
              </sl-menu-item>
            </sl-menu>
          </sl-dropdown>
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
    width: calc(100% + 12px);
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

  sl-input, sl-select, #content > * {
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
          <sl-icon-button name="dash-square-dotted" style="font-size: 1.5rem;" @click=${() => this.remove()}></sl-icon-button>
        </div>
      </div>
    `;
  }
}
customElements.define("record-empty", NDEFEmptyRecord);

class NDEFTextRecord extends LitElement {
  static styles = [subItemStyle];

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
          <sl-icon-button name="dash-square-dotted" style="font-size: 1.5rem;" @click=${() => this.remove()}></sl-icon-button>
        </div>
      </div>
      <sl-input id="text-input" label="Text" clearable></sl-input>
      <sl-input id="lang-input" label="Language code" placeholder="ISO language code" value="en-US" clearable></sl-input>
      <sl-select id="encoding-input" label="Encoding" value="utf-8">
        <sl-menu-item value="utf-8">UTF-8</sl-menu-item>
        <sl-menu-item value="utf-16">UTF-16</sl-menu-item>
      </sl-select>
    `;
  }
}
customElements.define("record-text", NDEFTextRecord);

class NDEFMIMERecord extends LitElement {
  static styles = [subItemStyle];

  constructor() {
    super();
    this.fileSelect = document.createElement("input");
    this.fileSelect.type = "file";
  }

  records() {
    const mimeValue = this.shadowRoot.querySelector("#mime-input").value || "application/octet-stream";

    return {
      recordType: "mime",
      mediaType: mimeValue,
      data: this.dataSource || null
    };
  }

  async selectDataSource() {
    const file = await new Promise(resolve => {
      this.fileSelect.addEventListener("change",
        _ => resolve(this.fileSelect.files[0]),
        { once: true }
      );
      this.fileSelect.click();
    });

    const mimeInput = this.shadowRoot.querySelector("#mime-input");

    if (file.name.endsWith(".png")) {
      mimeInput.value = "image/png";
    } else if (file.name.endsWith(".jpg")) {
      mimeInput.value = "image/jpg";
    } else if (file.name.endsWith(".json")) {
      mimeInput.value = "application/json";
    }
    else {
      mimeInput.value = "application/octet-stream";
    }

    this.dataSource = await file.arrayBuffer();

    const size = this.shadowRoot.querySelector("#size");
    size.innerText = this.dataSource.byteLength;

    // TODO: Gray out write until ready.
  }

  render() {
    return html`
      <div id="header">
        Record
        &nbsp;&nbsp;&nbsp;
        <span>Text (UTF-8)</span>
        <div id="expand"></div>
        <div style="position: relative;">
          <sl-icon-button name="dash-square-dotted" style="font-size: 1.5rem;" @click=${() => this.remove()}></sl-icon-button>
        </div>
      </div>
      <div id="content">
        <sl-input id="mime-input" label="MIME type" value="application/octet-stream" clearable></sl-input>
        <sl-button name="file" style="font-size: 1.5rem;" @click=${() => this.selectDataSource()}>
          Select data source (current size <span id="size">0</span> bytes)
        </sl-icon-button>
      </div>
    `;
  }
}
customElements.define("record-mime", NDEFMIMERecord);

class NDEFExternalRecord extends LitElement {
  static styles = [subItemStyle,
    css`
    :host {
      border: solid;
      margin: 16px;
      padding: 6px 16px 6px 16px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      align-content: stretch;
    }

    #header {
      margin-left: 12px;
      width: calc(100% + 12px);
      height: 42px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      align-content: stretch;
    }

    #header #expand {
      flex: 1;
    }
  `];
  
  records() {
    const namespaceValue = this.shadowRoot.querySelector("#ns-input").value || "example.com";
    const nameValue = this.shadowRoot.querySelector("#name-input").value || "myType";

    let records = [];
    for (let child of Array.from(this.children)) {
      if ("records" in child) {
        records.push(child.records());
      }
    }

    
    return {
      recordType: `${namespaceValue}:${nameValue}`,
      data: records
    }
  }

  render() {
    const addRecord = (name) => {
      const element = document.createElement(name);
      this.appendChild(element);
    }

    return html`
      <div id="header">
        Record
        &nbsp;&nbsp;&nbsp;
        <span>External</span>
        <div id="expand"></div>
        <div style="position: relative;">
          <sl-icon-button name="dash-square-dotted" style="font-size: 1.5rem;" @click=${() => this.remove()}></sl-icon-button>
        </div>
      </div>
      <sl-input id="ns-input" label="Namespace" placeholder="example.com" clearable></sl-input>
      <sl-input id="name-input" label="Name" placeholder="myType" clearable></sl-input>

      <br>
      <slot></slot>
      <br>

      <div id="header">
        <sl-dropdown>
          <sl-button variant="default" slot="trigger" >
           <sl-icon slot="prefix" name="plus-square-dotted"></sl-icon>
            Add subrecord
          </sl-button>
          <sl-menu>
            <sl-menu-item @click=${() => addRecord("record-empty")}>
              Empty record
              <sl-icon slot="prefix" name="chat-right"></sl-icon>
            </sl-menu-item>
            <sl-menu-item @click=${() => addRecord("record-text")}>
              Text record
              <sl-icon slot="prefix" name="chat-right-text"></sl-icon>
            </sl-menu-item>
            <sl-menu-item @click=${() => addRecord("record-url")}>
              URL record
              <sl-icon slot="prefix" name="house"></sl-icon>
            </sl-menu-item>
            <sl-menu-item @click=${() => addRecord("record-absolute-url")}>
              Absolute URL record
              <sl-icon slot="prefix" name="house"></sl-icon>
            </sl-menu-item>
            <sl-menu-item @click=${() => addRecord("record-empty")}>
              Smart Poster record
              <sl-icon slot="prefix" name="easel2"></sl-icon>
            </sl-menu-item>
            <sl-menu-item @click=${() => addRecord("record-mime")}>
              MIME type record
              <sl-icon slot="prefix" name="file-bar-graph"></sl-icon>
            </sl-menu-item>
            <sl-menu-item @click=${() => addRecord("record-external")}>
              External type record
              <sl-icon slot="prefix" name="box-arrow-up-right"></sl-icon>
            </sl-menu-item>
            <sl-menu-item @click=${() => addRecord("record-empty")}>
              Unknown record
              <sl-icon slot="prefix" name="patch-question"></sl-icon>
            </sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </div>
    </div>
    `;
  }
}
customElements.define("record-external", NDEFExternalRecord);



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
          <sl-icon-button name="dash-square-dotted" style="font-size: 1.5rem;" @click=${() => this.remove()}></sl-icon-button>
        </div>
      </div>
      <sl-input id="text-input" label="URL" placeholder="https://" clearable></sl-input>
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
          <sl-icon-button name="dash-square-dotted" style="font-size: 1.5rem;" @click=${() => this.remove()}></sl-icon-button>
        </div>
      </div>
      <sl-input id="text-input" label="URL" placeholder="https://" clearable></sl-input>
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
      <div class="main-content">
        <record-root>
          <record-text></record-text>
        </record-root>
        <sl-button variant="primary" @click=${() => this.write()}>Write</sl-button>
      </div>
    `;
  }
}

customElements.define("nfc-tools", NFCTools);