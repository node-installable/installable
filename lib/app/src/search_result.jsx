/** @jsx React.DOM */
'use strict';

var React = require('react');

var SearchResult = React.createClass({
    onClickInstall: function () {
        var self = this;
        this.props.module.save(null, {
            wait: true,
            success: function () {
                console.log('self', self);
                self.props.installedModules.add(self.props.module);
            }
        });
    },
    render: function () {
        return (
            <div className="search-result">
                {this.props.module.get('name')}
                <button onClick={this.onClickInstall}>Install</button>
            </div>
        );
    }
});

module.exports = SearchResult;
