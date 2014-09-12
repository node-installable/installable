/** @jsx React.DOM */
'use strict';

var React = require('react');
var InstalledModule = require('./installed_module.jsx');

var InstalledModules = React.createClass({
    render: function () {
        var rows = this.props.modules.map(function (module) {
            return (
                <InstalledModule module={module} key={module.get('name')} />
            );
        });

        if (rows.length) {
            return (
                <section>{rows}</section>
            );
        } else {
            return (
                <section>
                    <p>No plugins are installed</p>
                </section>
            );
        }
    }
});

module.exports = InstalledModules;
