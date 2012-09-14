define(['srv/core/EndPoint', 'http'], function(EndPoint, Http) {

    return EndPoint.inherit('srv.endpoint.HttpEndPoint', {

        defaults: {
            port: 80,
            hostname: null,
            backlog: null
        },

        _start: function() {

            var self = this;
            this.$endPoint = Http.createServer(function(req, res) {
                self.handleRequest(req, res);
            });

            this.$endPoint.listen(this.$.port, this.$.hostname, this.$.backlog);
        },

        _stop: function(callback) {
            this.$endPoint && this.$endPoint.close(callback);
        }
    });
});