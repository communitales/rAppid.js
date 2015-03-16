define(['js/core/Bindable', 'js/core/Base'], function (Bindable, Base) {

    var Validator = Bindable.inherit('js.data.validator.Validator', {

        $validatorCache: {},

        defaults: {

            /**
             * The field of the entity to validate.
             *
             * @type {String}
             */
            field: null,

            /**
             * The error code for this validation error.
             *
             * @type {Number}
             */
            errorCode: 'isInvalid',

            /**
             * The error message displayed for the user.
             *
             * @type {String}
             */
            errorMessage: null
        },

        ctor: function () {
            this.callBase();

            var cacheKey = this._generateCacheKey.apply(this, arguments);
            if (cacheKey && !this.$validatorCache[cacheKey]) {
                this.$validatorCache[cacheKey] = this;
            }

            return this.$validatorCache[cacheKey];
        },

        /**
         * Returns a generated cache key.
         *
         * @returns {*}
         * @private
         */
        _generateCacheKey: function () {
            return null;
        },

        /**
         * Validates an entity asynchronously. The validation error is returned as the second parameter of the callback
         *
         * @param {js.data.Entity} entity
         * @param {Object} [options]
         * @param {Function} callback
         */
        validate: function (entity, options, callback) {
            if (options instanceof Function) {
                callback = options;
                options = {};
            }

            options = options || {};

            var self = this,
                callbackInvoked = false;

            if (!this._validationRequired(entity)) {
                internalCallback(null);
                return;
            }

            try {
                internalCallback(null, this._validate(entity, options));
            } catch (e) {
                internalCallback(e);
            }

            function internalCallback(err, result) {
                if (callbackInvoked) {
                    self.log('Validator returned twice. Ignore second return', Base.LOGLEVEL.WARN);
                    return;
                }

                callbackInvoked = true;
                // returns an array of errors
                callback(err, result);
            }
        },

        /**
         * Returns true if entity has the field set or the field is required
         *
         * @param {js.data.Entity} entity
         *
         * @returns {Boolean}
         * @private
         */
        _validationRequired: function (entity) {
            return !(this.$.field && !entity.schema[this.$.field].required && !entity.getTransformedValue(this.$.field));
        },

        /**
         * Performs a synchronous validation.
         *
         * @param {js.data.Entity} entity
         * @param {Object} [options]
         *
         * @abstract
         * @private
         */
        _validate: function (entity, options) {
            throw new Error("abstract method _validate from Validator");
        },

        /**
         * Returns an occurred error message.
         *
         * @returns {?String}
         * @private
         */
        _getErrorMessage: function () {
            if (this.$.field) {
                return (this.$.errorMessage || "Field '%' is invalid").replace('%', this.$.field);
            } else {
                return this.$.errorMessage || "Entity is invalid";
            }
        },

        /**
         * Creates a validation error object with a code, message and a field
         *
         * @param {Number|String} code
         * @param {String} message
         * @param {String} field
         *
         * @returns {js.data.validator.Validator.Error}
         * @private
         */
        _createError: function (code, message, field) {
            return new Validator.Error({
                code: code,
                message: message,
                field: field
            });
        },

        /**
         * Create a field error
         *
         * @param {String} [field] - the field
         *
         * @returns {js.data.validator.Validator.Error} an error instance
         * @private
         */
        _createFieldError: function (field) {
            return this._createError(this.$.errorCode, this._getErrorMessage(), field || this.$.field);
        }

    });

    Validator.Error = Bindable.inherit({});

    return Validator;
})
;
