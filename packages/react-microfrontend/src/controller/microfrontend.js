class Microfrontend {
  static STATUS = {
    DISCOVERED: 'DISCOVERED',
    LOADED: 'LOADED',
    IMPORTED: 'IMPORTED',
    REGISTERED: 'REGISTERED',
    INITIALIZED: 'INITIALIZED'
  };

  name
  status = Microfrontend.STATUS.CREATED;
  host
  files = {
    js: null,
    css: null
  };
  style = []
  content
  isLoaded = false

  constructor(name, metaInfo) {
    this.name = name;
    this.host = metaInfo.host;
    this.files.js = metaInfo.js;
    this.files.css = metaInfo.css;
  }

  register(content) {
    this.status = Microfrontend.STATUS.REGISTERED;
    this.content = content;
  }

  loaded() {
    this.status = Microfrontend.STATUS.LOADED;
    this.isLoaded = true;
  }

  importScript(jsScripts) {
    this.files.js = jsScripts;
    this.status = Microfrontend.STATUS.IMPORTED;
  }

  hasBeenLoaded() {
    return this.isLoaded;
  }

  isReady() {
    return this.status === Microfrontend.STATUS.REGISTERED;
  }

  setStyle(style) {
    this.style = style;
  }
}

export default Microfrontend;
