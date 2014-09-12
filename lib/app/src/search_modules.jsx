/** @jsx React.DOM */
'use strict';

var React = require('react');
var SearchResult = require('./search_result.jsx');

var SearchModules = React.createClass({
    onKeyDown: function (event) {
        if (event.which !== 13) {
            return;
        }

        if (event.target.value.length) {
            this.props.searchResults.fetch({
                data: {
                    term: event.target.value
                }
            });
        }
    },
    render: function () {
        var installedModules = this.props.installedModules;

        var rows = this.props.searchResults.map(function (module) {
            return (
                <SearchResult module={module} key={module.get('name')} installedModules={installedModules}/>
            );
        });

        if (rows.length) {
            return (
                <section className="search">
                    <input type="text" placeholder="Search" onKeyDown={this.onKeyDown}/>
                    {rows}
                </section>
            );
        } else {
            return (
                <section className="search">
                    <input type="text" placeholder="Search" onKeyDown={this.onKeyDown} />
                    <p>No plugins found.</p>
                </section>
            );
        }
    }
});

module.exports = SearchModules;
