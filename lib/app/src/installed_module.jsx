/** @jsx React.DOM */
'use strict';

var React = require('react');

var InstalledModule = React.createClass({
    onClickUninstall: function () {
        if (window.confirm('Sure?')) {
            this.props.module.destroy();
        }
    },
    render: function () {
        return (
            <div className="installed-module">
                {this.props.module.get('name')}
                <button onClick={this.onClickUninstall}>Uninstall</button>
            </div>
        );
    }
});

module.exports = InstalledModule;
