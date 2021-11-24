// Create a class for the element
class PopUpInfo extends HTMLElement {
  constructor() {
    super();

    const template = `
    <template>
      <style>
        .columns{
          margin:0 0 30px;
        }
        .column{
          width: 600px;
          flex:none;
        }
      </style>
      <div class="columns">
        <div class="column col-mx-auto">
          <div class="top_views" id="topViews"></div>
        </div>
      </div>
    </template>`
    let parser = new DOMParser();
    let dom = parser.parseFromString(template, "text/html").querySelector('template')
    console.log('dom: ', dom.content);

    // Create a shadow root
    const shadow = this.attachShadow({mode: 'open'});

    shadow.appendChild(dom.content.cloneNode(true));
  }
}

// Define the new element
customElements.define('popup-info', PopUpInfo);