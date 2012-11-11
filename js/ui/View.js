define(["js/html/HtmlElement", "js/core/Content", "underscore"], function (HtmlElement, Content, _) {
        return HtmlElement.inherit({
            defaults: {
                tagName: "div"
            },
            $domAttributes: ['class','id', 'style'],
            render: function () {
                if(this.isRendered()){
                    return this.$el;
                }
                // look if the component has a layout defined
                var layout = this.$templates['layout'];
                // if layout template available...
                if (layout) {
                    var children = layout.createComponents({}, this, this);
                    this._initializeLayoutChildren(children);
                }
                return this.callBase();
            },
            _isDOMNodeAttribute: function(attribute){
                return ((this.$el && attribute in this.$el) || /^data-/.test(attribute) || _.indexOf(this.$domAttributes, attribute) !== -1);
            },
            _initializeLayoutChildren: function (children) {
                for (var i = 0; i < children.length; i++) {
                    children[i].$rootScope = this;
                    this.addChild(children[i]);
                }
            },
            _renderChild: function (child) {
                this.callBase();
                if (child instanceof Content) {
                    var ref = child.get('name');
                    if (ref) {
                        var placeHolder = this.getPlaceHolder(ref);
                        if (placeHolder) {
                            placeHolder.set({content: child});
                        }
                    }
                }
            },
            _renderLayoutClass: function (layoutClass, oldLayoutClass) {
                _.each(this.$renderedChildren, function (child) {
                    if (oldLayoutClass) {
                        child.removeClass(oldLayoutClass);
                    }
                    if (layoutClass) {
                        child.addClass(layoutClass)
                    }
                });
            },

            _renderTemplateToPlaceHolder: function (templateName, placeholderName, attributes) {
                this.$renderedPlaceholders = this.$renderedPlaceholders || {};
                var renderedComponent = this.$renderedPlaceholders[placeholderName], placeHolder;
                if (!renderedComponent) {
                    var template = this.getTemplate(templateName);
                    if (template) {
                        // or create special method createComponent
                        renderedComponent = template.createInstance(attributes);
                        placeHolder = this.getPlaceHolder(placeholderName);
                        if (placeHolder) {
                            placeHolder.set({content: renderedComponent});
                            this.$renderedPlaceholders[placeholderName] = renderedComponent;
                        } else {
                            // throw "No placeholder '"+placeholderName+"' found";
                        }

                    }
                } else {
                    placeHolder = this.getPlaceHolder(placeholderName);
                    if(placeHolder){
                        placeHolder.set({content: renderedComponent});
                    }
                    renderedComponent.set(attributes);
                }

            },
            _renderId: function (id) {
                if (id) {
                    this.$el.setAttribute("id", id);
                }else{
                    this.$el.removeAttribute("id");
                }

            }
        });
    }
);