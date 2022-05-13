"use strict";

class RblTagInput extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.tags = [];
    }
    addTag(tag) {
        if (tag.length > 0) {
            if (this.getAttribute("lowercase") == "true") {
                tag = tag.toLowerCase();
            }
            if (this.getAttribute("uppercase") == "true") {
                tag = tag.toUpperCase();
            }
            if (this.getAttribute("duplicates") == "true" || this.tags.indexOf(tag) === -1) {
                this.tags.push(tag);
                this.shadowRoot.querySelector('#tag-input').value = "";
                this.render();
            } else {
                var $element = this.shadowRoot.querySelector('[data-index="' + this.tags.indexOf(tag) + '"]');
                $element.className = ($element.className + " duplicate");
                setTimeout(function () {
                    $element.className = $element.className.replace("duplicate", "");
                }, 500);
            }
        }
    }
    get value() {
        return this.tags.join(",");
    }
    set value(newTags) {
        this.tags = newTags;
        this.render();
    }
    render() {
        this.clear();
        this.tags.forEach((tag, idx) => {
            let $tag = document.createElement("div");
            $tag.className = "tag";
            let $remove = document.createElement("div");
            $remove.className = "remove";
            $remove.innerHTML = "✕";
            $remove.addEventListener("click", () => {
                this.deleteTag(idx);
            });
            $tag.dataset.index = idx;
            $tag.innerHTML = tag;
            $tag.appendChild($remove);
            this.shadowRoot.querySelector('.rebel-tag-input').appendChild($tag);
        });
    }
    clear() {
        var tagElements = this.shadowRoot.querySelectorAll('.tag');
        if (tagElements.length > 0) {
            for (var i = 0; i < tagElements.length; i++) {
                this.shadowRoot.querySelector('.rebel-tag-input').removeChild(tagElements[i]);
            }
        }
    }
    empty() {
        this.clear();
        this.tags = [];
    }
    deleteTag(index) {
        var newTags = [];
        this.tags.forEach((tag, idx) => {
            if (idx !== index) {
                newTags.push(tag);
            }
        });
        this.value = newTags;
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                .rebel-tag-input {
                    font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
                    max-width: 100%;
                    display: flex;
                    align-content: flex-start;
                    flex-wrap: wrap;
                    border-radius: 2px;
                    padding: .1em;
                    align-items: baseline;
                    
                    --bg: white;
                    --tag-bg: #e6e6e6;
                    --border: #CCC;
                    
                    background: var(--bg);
                    border: solid 1px var(--border);
                    
                }
                @media (prefers-color-scheme: dark) {
                    .rebel-tag-input {
                        --bg: #3b3b3b;
                        --border: #808080;
                        --tag-bg: #666;
                    }
                }
                #tag-input {
                    flex-grow: 1;
                    display: inline-block;
                    order: 200;
                    border: none;
                    margin: 0;
                    font-size: inherit;
                }
                #tag-input:focus {
                    outline: none;
                }
                .rebel-tag-input div.tag {
                    display: inline-flex;
                    /* flex-grow: 0; */
                    margin: 0.2em 0.2em;
                    padding: 0.2em;
                    padding-left: 0.4em;
                    gap: 0.3em;
                    line-height: 1;
                    background-color: var(--tag-bg);
                    order: 100;
                    border-radius: 1000px;
                    position: relative;
                    overflow: hidden;
                    align-items: center;
                }
                .rebel-tag-input div.tag.duplicate {
                    background-color: rgba(255, 64, 27, 0.71);
                    transition: all 0.3s linear;
                }
                .rebel-tag-input div.tag:last-child {
                    margin-right: 5px;
                }
                .rebel-tag-input div.tag .remove {
                    background-color: rgb(199 199 199 / 71%);
                    color: #7e7e7e;
                    font-weight: 600;
                    font-size: 0.8em;
                    padding: 0.1em;
                    cursor: pointer;
                    border-radius: 100px;
                    display: inline-flex;
                    height: 1em;
                    width: 1em;
                    line-height: 1;
                    text-align: center;
                    align-items: center;
                    justify-content: center;
                }
                .rebel-tag-input div.tag:hover .remove {
                }
            </style>
            <div class="rebel-tag-input">
                <input type="text" id="tag-input" placeholder="Enter tag..." />
                <!-- Start Tag Elements -->
            </div>
        `;
        let allowDelete = false;
        this.shadowRoot.querySelector('#tag-input').addEventListener("keydown", (event) => {
            let tag = this.shadowRoot.querySelector('#tag-input').value;
            if (event.keyCode === 13) {
                this.addTag(tag);
            } else if (event.keyCode === 188) {
                event.preventDefault();
                this.addTag(tag);
            } else if (event.keyCode === 8 && tag.length === 0) {
                if (allowDelete) {
                    this.deleteTag(this.tags.length - 1);
                    allowDelete = false;
                } else {
                    allowDelete = true;
                }
            }
        });
    }
}

customElements.define("rbl-tag-input", RblTagInput);
