define(["js/ui/View", "js/core/Content", "js/ui/Button", "underscore"], function(View, Content, Button, _) {

    return View.inherit("js.ui.MenuButtonClass", {
        defaults: {
            'tagName': 'div',
            'componentClass': 'btn-group menu-button',
            'menuClassName': "dropdown-menu",
            'menuVisible': false
        },
        $defaultContentName: 'menu',
        $instances: [],

        addChild: function (child) {
            this.callBase();
            if (child instanceof Button) {
                this._collectButton(child);
            }
        },

        _collectButton: function (child) {
            this.$button = child;
            this.$toggleButton = child;
        },

        _renderType: function (type) {
            this.$button.set({type: type});
        },

        _renderIconClass: function (iconClass) {
            this.$button.set({iconClass: iconClass});
        },

        _renderLabel: function (label) {
            if (this.$button) {
                this.$button.set({label: label});
            }

        },

        _renderMenuVisible: function (visible) {
            if (visible === true) {
                for (var i = 0; i < this.$instances.length; i++) {
                    if (this.$instances[i] != this) {
                        this.$instances[i].set({menuVisible: false});
                    }
                }
                this.addClass('open');
            } else {
                this.removeClass('open');
            }

        },

        _bindDomEvents: function (el) {
            this.callBase();

            if (!_.contains(this.$instances, this)) {
                this.$instances.push(this);
            }
            var self = this;

            this.bindDomEvent('click', function (e) {
                self.set({menuVisible: false});
            });

            this.$toggleButton.bind('on:click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                self.set({menuVisible: !self.$.menuVisible});
            });

            this.$button.bind('on:click', function (e) {
                self.trigger('on:click', e, self);
            });

            this.dom(this.$stage.$document).bindDomEvent('click', function (e) {
                self.set({menuVisible: false});
            });

        },

        _preventDefault: function (e) {
            e.$.stopPropagation();
        },

        closeMenu: function () {
            this.set('menuVisible', false);
        }
    });

});