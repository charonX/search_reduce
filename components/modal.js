class Modal extends HTMLElement {
    constructor() {
        super();
        let templete = `<template id="m-modal">
            <style></style>
            <div class="modal active" id="options" data-index="">
                <a class="modal-overlay" href="#modals-sizes" aria-label="Close"></a>
                <div class="modal-container" role="document">
                <div class="modal-header"><a class="btn btn-clear float-right" href="#modals-sizes" aria-label="Close"></a>
                    <div class="modal-title h5">标题</div>
                </div>
                <div class="modal-body">
                    <slot name="modal-body"></slot>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" aria-label="Submit">提交</button><a class="btn btn-link" href="#modals-sizes" aria-label="Close">取消</a>
                </div>
                </div>
            </div>
        </template>`
        let wrap = document.createElement('div');
        wrap.innerHTML = templete
        let shadow = this.attachShadow({mode: 'open'});
        shadow.adoptedStyleSheets = [styles];
        shadow.appendChild(wrap.firstChild.content);
    }
  }

  customElements.define('m-modal', Modal);